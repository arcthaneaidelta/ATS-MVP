import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

// Self-hosted variable fonts (PRD §4.3, §11.1)
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/dm-sans/index.css';

// Styles
import './styles/tailwind.css';

// Remove initial critical CSS blocker
const bootEl = document.getElementById('boot');
if (bootEl) {
  bootEl.remove();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
