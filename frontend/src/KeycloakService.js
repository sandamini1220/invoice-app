import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',       // no /auth for KC 24+
  realm: 'invoice_realm',
  clientId: 'frontend-spa',
});

export default keycloak;
