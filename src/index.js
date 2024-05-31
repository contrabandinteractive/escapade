import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider } from 'primereact/api';
import { EnokiFlowProvider } from '@mysten/enoki/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <EnokiFlowProvider apiKey="enoki_public_96b4e56deef6ec8f7943400abdb78aac">
     <PrimeReactProvider>
    <App />
    </PrimeReactProvider>
    </EnokiFlowProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
