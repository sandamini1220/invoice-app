import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import EditInvoice from "./pages/EditInvoice";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import PrivateRoute from "./components/PrivateRoute";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { getKeycloak } from "./keycloak";

const App = () => {
  const keycloak = getKeycloak();

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      }}
    >
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <InvoiceForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute>
                  <EditInvoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <Customers />
                </PrivateRoute>
              }
            />
            <Route
              path="/items"
              element={
                <PrivateRoute>
                  <Items />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      
    </ReactKeycloakProvider>
  );
};

export default App;
