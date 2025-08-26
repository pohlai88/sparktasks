import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { DirectionProvider } from '@/components/primitives';
import './index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <DirectionProvider dir="ltr">
      <App />
    </DirectionProvider>
  </React.StrictMode>
);
