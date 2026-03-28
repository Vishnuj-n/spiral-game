import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { App } from './app/app';

declare global {
  interface Window {
    __SPIRAL_DATA__?: any[];
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App questionsData={window.__SPIRAL_DATA__} />
    </BrowserRouter>
  </StrictMode>,
);
