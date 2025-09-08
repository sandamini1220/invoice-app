require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const Keycloak = require("keycloak-connect");

// routes
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// core middlewares
app.use(cors());
app.use(express.json());

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Keycloak configuration
const kcConfig = {
  realm: "mern-app",
  "auth-server-url": "http://localhost:8080/",
  "ssl-required": "external",
  resource: "mern-frontend",
  "public-client": true,
  "confidential-port": 0,
};

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

// Initialize Keycloak
app.use(keycloak.middleware());

// DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("✅ MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB error:", err)
);

// protect APIs
app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);

// Example RBAC: only realm role "admin" can access invoices
app.use("/api/invoices", invoiceRoutes);

// test route
app.get("/protected", (req, res) => {
  res.json({ message: "Protected OK" });
});

// health
app.get("/", (req, res) => res.send("Invoice API running 🚀"));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: { message: err.message || "Internal Server Error" } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
