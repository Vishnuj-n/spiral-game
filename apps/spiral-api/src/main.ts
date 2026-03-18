import express from 'express';
import * as path from 'path';
import cors from 'cors';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { SpiralSession } from '@spiral-game/game-types';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Mock generator for Sprint 3
app.post('/generate/spiral', (req, res) => {
  try {
    console.log("Reading data from example.json...");
    // Read the file directly from the workspace root where the user created it
    const exampleFilePath = path.join(process.cwd(), 'example.json');
    const rawData = fs.readFileSync(exampleFilePath, 'utf8');
    const jsonData = JSON.parse(rawData);

    // The user's example.json itself has the exact SpiralSession format!
    // Since it already has a structured layout, we just return it or ensure it matches SpiralSession:
    const session: SpiralSession = {
      sessionId: jsonData.sessionId || randomUUID(),
      questions: jsonData.questions,
      createdAt: jsonData.createdAt || new Date().toISOString()
    };

    res.json(session);
  } catch (err) {
    console.error("Error reading example.json:", err);
    res.status(500).json({ error: "Could not generate demo from example.json" });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
