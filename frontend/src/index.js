
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './KeycloakService';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const eventLogger = (event, error) => {
  // console.log('onKeycloakEvent', event, error);
};
const tokenLogger = (tokens) => {
  // console.log('onKeycloakTokens', tokens);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: 'login-required', checkLoginIframe: false, pkceMethod: 'S256' }}
      onEvent={eventLogger}
      onTokens={tokenLogger}
    >
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>
);



