import express from 'express';
import * as path from 'path';
import cors from 'cors';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import OpenAI from 'openai';
import { createRequire } from 'module';
import { Question, SpiralSession } from '@spiral-game/game-types';

const nodeRequire = createRequire(__filename);
const pdfParse = nodeRequire('pdf-parse') as (dataBuffer: Buffer) => Promise<{ text: string }>;

type SupportedProvider = 'openai' | 'openrouter' | 'groq';

type StructuralSection = {
  heading: string;
  level: number;
  hierarchy: string[];
  content: string;
};

type ChapterChunk = {
  chunkId: string;
  hierarchyPath: string;
  text: string;
  tokenEstimate: number;
};

type LlmQuestionPayload = {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

const PROVIDER_ENDPOINTS: Record<SupportedProvider, string> = {
  openai: 'https://api.openai.com/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  groq: 'https://api.groq.com/openai/v1',
};

const PROVIDER_API_KEY_ENV: Record<SupportedProvider, string> = {
  openai: 'OPENAI_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  groq: 'GROQ_API_KEY',
};

const DEFAULT_MODEL_BY_PROVIDER: Record<SupportedProvider, string> = {
  openai: 'gpt-4o-mini',
  openrouter: 'openai/gpt-4o-mini',
  groq: 'llama-3.3-70b-versatile',
};

const MIN_CHUNK_TOKENS = 300;
const MAX_CHUNK_TOKENS = 800;
const DEFAULT_MAX_QUESTIONS = 8;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

function isLikelyHeading(line: string): { isHeading: boolean; level: number } {
  const trimmed = line.trim();
  if (!trimmed) {
    return { isHeading: false, level: 0 };
  }

  const chapterMatch = /^chapter\s+\d+/i.test(trimmed);
  if (chapterMatch) {
    return { isHeading: true, level: 1 };
  }

  const numberedMatch = trimmed.match(/^(\d+(?:\.\d+){0,3})\s+.+/);
  if (numberedMatch) {
    const depth = numberedMatch[1].split('.').length;
    return { isHeading: true, level: Math.min(depth + 1, 4) };
  }

  const wordCount = trimmed.split(/\s+/).length;
  const allCaps = trimmed === trimmed.toUpperCase();
  if (allCaps && wordCount <= 8 && /[A-Z]/.test(trimmed)) {
    return { isHeading: true, level: 2 };
  }

  return { isHeading: false, level: 0 };
}

function parseStructuralSections(rawText: string): StructuralSection[] {
  const lines = normalizeWhitespace(rawText)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !/^page\s+\d+/i.test(line))
    .filter((line) => !/^\d+$/.test(line));

  const sections: StructuralSection[] = [];
  const hierarchy: string[] = [];
  let currentSection: StructuralSection | null = null;

  for (const line of lines) {
    const { isHeading, level } = isLikelyHeading(line);
    if (isHeading) {
      const heading = line.replace(/\s+/g, ' ').trim();
      hierarchy.splice(level - 1);
      hierarchy[level - 1] = heading;

      currentSection = {
        heading,
        level,
        hierarchy: hierarchy.filter(Boolean),
        content: '',
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        heading: 'Introduction',
        level: 1,
        hierarchy: ['Introduction'],
        content: '',
      };
      sections.push(currentSection);
    }

    currentSection.content += `${line}\n`;
  }

  return sections
    .map((section) => ({
      ...section,
      content: normalizeWhitespace(section.content),
    }))
    .filter((section) => section.content.length > 0);
}

function splitLargeParagraph(paragraph: string, maxTokens: number): string[] {
  const sentences = paragraph
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return [paragraph];
  }

  const pieces: string[] = [];
  let buffer = '';

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer} ${sentence}` : sentence;
    if (estimateTokens(candidate) <= maxTokens) {
      buffer = candidate;
      continue;
    }

    if (buffer) {
      pieces.push(buffer);
    }
    buffer = sentence;
  }

  if (buffer) {
    pieces.push(buffer);
  }

  return pieces;
}

function createHierarchicalChunks(sections: StructuralSection[]): ChapterChunk[] {
  const chunks: ChapterChunk[] = [];

  for (const section of sections) {
    const paragraphs = section.content
      .split(/\n\n+/)
      .map((part) => part.trim())
      .filter(Boolean);

    let chunkIndex = 1;
    let buffer = '';

    for (const paragraph of paragraphs) {
      const paragraphParts =
        estimateTokens(paragraph) > MAX_CHUNK_TOKENS
          ? splitLargeParagraph(paragraph, MAX_CHUNK_TOKENS)
          : [paragraph];

      for (const part of paragraphParts) {
        const candidate = buffer ? `${buffer}\n\n${part}` : part;
        if (estimateTokens(candidate) <= MAX_CHUNK_TOKENS) {
          buffer = candidate;
          continue;
        }

        if (buffer) {
          chunks.push({
            chunkId: `${section.hierarchy.join(' > ')}::${chunkIndex}`,
            hierarchyPath: section.hierarchy.join(' > '),
            text: buffer,
            tokenEstimate: estimateTokens(buffer),
          });
          chunkIndex += 1;
        }
        buffer = part;
      }
    }

    if (buffer) {
      const lastChunk = chunks[chunks.length - 1];
      const merged = lastChunk
        ? `${lastChunk.text}\n\n${buffer}`
        : buffer;
      const sameHierarchy =
        !!lastChunk &&
        lastChunk.hierarchyPath === section.hierarchy.join(' > ');

      if (
        estimateTokens(buffer) < MIN_CHUNK_TOKENS &&
        lastChunk &&
        sameHierarchy &&
        estimateTokens(merged) <= MAX_CHUNK_TOKENS
      ) {
        lastChunk.text = merged;
        lastChunk.tokenEstimate = estimateTokens(lastChunk.text);
      } else {
        chunks.push({
          chunkId: `${section.hierarchy.join(' > ')}::${chunkIndex}`,
          hierarchyPath: section.hierarchy.join(' > '),
          text: buffer,
          tokenEstimate: estimateTokens(buffer),
        });
      }
    }
  }

  return chunks;
}

function parseSupportedProvider(input: unknown): SupportedProvider {
  const normalized =
    typeof input === 'string' && input.trim().length > 0
      ? input.toLowerCase()
      : (process.env.LLM_PROVIDER ?? 'openai').toLowerCase();

  if (normalized === 'openai' || normalized === 'openrouter' || normalized === 'groq') {
    return normalized;
  }

  throw new Error(
    `Unsupported provider '${normalized}'. Use one of: openai, openrouter, groq.`
  );
}

function resolveApiKey(provider: SupportedProvider, requestApiKey?: unknown): string {
  if (typeof requestApiKey === 'string' && requestApiKey.trim().length > 0) {
    return requestApiKey.trim();
  }

  // Shared key for whichever provider is selected.
  const genericKey = process.env.OPENAI_COMPATIBLE_API_KEY;
  if (genericKey && genericKey.trim().length > 0) {
    return genericKey.trim();
  }

  const apiKeyEnv = PROVIDER_API_KEY_ENV[provider];
  const providerKey = process.env[apiKeyEnv];
  if (providerKey && providerKey.trim().length > 0) {
    return providerKey.trim();
  }

  throw new Error(
    `Missing API key for provider '${provider}'. Set OPENAI_COMPATIBLE_API_KEY or ${apiKeyEnv}.`
  );
}

function createLlmClient(provider: SupportedProvider, requestApiKey?: unknown): OpenAI {
  const apiKey = resolveApiKey(provider, requestApiKey);

  const extraHeaders: Record<string, string> = {};
  if (provider === 'openrouter') {
    if (process.env.OPENROUTER_SITE_URL) {
      extraHeaders['HTTP-Referer'] = process.env.OPENROUTER_SITE_URL;
    }
    if (process.env.OPENROUTER_APP_NAME) {
      extraHeaders['X-Title'] = process.env.OPENROUTER_APP_NAME;
    }
  }

  return new OpenAI({
    apiKey,
    baseURL: PROVIDER_ENDPOINTS[provider],
    defaultHeaders: extraHeaders,
  });
}

function parseLlmJson(content: string): LlmQuestionPayload {
  const trimmed = content.trim();
  const clean = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();
  const parsed = JSON.parse(clean) as LlmQuestionPayload;

  if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length < 4) {
    throw new Error('LLM response missing required fields.');
  }

  if (typeof parsed.correctIndex !== 'number' || parsed.correctIndex < 0 || parsed.correctIndex > 3) {
    throw new Error('LLM response contains invalid correctIndex.');
  }

  return {
    question: parsed.question,
    options: parsed.options.slice(0, 4),
    correctIndex: parsed.correctIndex,
    hint: parsed.hint || 'Use the core concept from this section.',
  };
}

async function generateQuestionFromChunk(
  client: OpenAI,
  model: string,
  chunk: ChapterChunk,
  level: number
): Promise<Question> {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.25,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You generate one MCQ from textbook content. Return only strict JSON with keys: question, options, correctIndex, hint. options must contain exactly 4 choices, and correctIndex must be in range 0-3.',
      },
      {
        role: 'user',
        content: [
          `Hierarchy: ${chunk.hierarchyPath}`,
          `Target difficulty level: ${level}`,
          'Generate exactly one conceptual multiple choice question from this chunk.',
          'Chunk text:',
          chunk.text,
        ].join('\n\n'),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty completion for chunk ${chunk.chunkId}`);
  }

  const payload = parseLlmJson(content);

  return {
    id: level,
    level,
    question: payload.question,
    options: payload.options,
    correctIndex: payload.correctIndex,
    hint: payload.hint,
    points: level * 100,
  };
}

async function extractChapterText(pdfPath: string): Promise<string> {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(pdfBuffer);
  if (!parsed.text?.trim()) {
    throw new Error('No extractable text found in the chapter PDF.');
  }

  return parsed.text;
}

function resolveChapterPdfPath(): string {
  return path.resolve(process.cwd(), '..', 'chapter', 'CHAP 9.pmd.pdf');
}

function toBoundedNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.floor(value)));
}

const app = express();
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.post('/generate/spiral', async (req, res) => {
  try {
    const provider = parseSupportedProvider(req.body?.provider);
    const model =
      typeof req.body?.model === 'string' && req.body.model.trim().length > 0
        ? req.body.model
        : process.env.LLM_MODEL || DEFAULT_MODEL_BY_PROVIDER[provider];
    const maxQuestions = toBoundedNumber(req.body?.maxQuestions, DEFAULT_MAX_QUESTIONS, 3, 12);
    const chapterPdfPath = resolveChapterPdfPath();

    console.log(`Generating spiral session from ${chapterPdfPath}`);
    const chapterText = await extractChapterText(chapterPdfPath);

    // Structural parsing preserves heading hierarchy before chunking.
    const sections = parseStructuralSections(chapterText);
    const allChunks = createHierarchicalChunks(sections);
    const selectedChunks = allChunks.slice(0, Math.max(maxQuestions, 1));

    if (selectedChunks.length === 0) {
      throw new Error('No chunks were generated from the chapter.');
    }

    const client = createLlmClient(provider, req.body?.apiKey);
    const questionPromises = selectedChunks.map((chunk, index) =>
      generateQuestionFromChunk(client, model, chunk, index + 1)
    );

    const questions = await Promise.all(questionPromises);
    const session: SpiralSession = {
      sessionId: randomUUID(),
      questions,
      createdAt: new Date().toISOString(),
    };

    res.json({
      ...session,
      source: {
        file: path.basename(chapterPdfPath),
        provider,
        model,
        sectionsParsed: sections.length,
        chunksUsed: selectedChunks.length,
        chunksAvailable: allChunks.length,
        chunkTokenRange: [MIN_CHUNK_TOKENS, MAX_CHUNK_TOKENS],
      },
    });
  } catch (err) {
    console.error('Error generating spiral session:', err);
    const message = err instanceof Error ? err.message : 'Unknown generation error';
    res.status(500).json({ error: message });
  }
});

app.post('/spiral/result', (req, res) => {
  const result = req.body;
  console.log("Received Game Result:", result);
  
  // In a real database we would INSERT the result. For demo, just log it.
  res.json({ success: true, message: "Result recorded successfully.", data: result });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
