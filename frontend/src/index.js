import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import {register} from '../src/serviceWorker/serviceWorker';
import "./shared/styles/App.scss"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

register();