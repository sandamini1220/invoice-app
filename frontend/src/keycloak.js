import Keycloak from "keycloak-js";

let keycloak = null;

export const getKeycloak = () => {
  if (!keycloak) {
    keycloak = new Keycloak({
      url: "http://localhost:8080",
      realm: "mern-app",
      clientId: "mern-frontend",
    });
  }
  return keycloak;
};
