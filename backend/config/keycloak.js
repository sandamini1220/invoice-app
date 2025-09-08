//const session = require('express-session');
//const Keycloak = require('keycloak-connect');

//const memoryStore = new session.MemoryStore();

// Use explicit config so we don’t need keycloak.json
//const keycloakConfig = {
  //'realm': process.env.KC_REALM || 'invoice_realm',
  //'auth-server-url': process.env.KC_AUTH_URL || 'http://keycloak:8080',
  //'ssl-required': 'none',
  //'resource': process.env.KC_RESOURCE || 'backend-api',
  //'bearer-only': true,
  //'confidential-port': 0
//};

//const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

//module.exports = { keycloak, memoryStore };
