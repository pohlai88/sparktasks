import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Railway Foundation App from local src folder
import App from './App';
import './index.css';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
