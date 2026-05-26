import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../index.css';

const container = document.getElementById('root');
if (!container) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
  
  // Remove H1 and P from boilerplate
  const h1 = document.querySelector('h1');
  const p = document.querySelector('p');
  if (h1) h1.remove();
  if (p) p.remove();

  const root = createRoot(rootDiv);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
