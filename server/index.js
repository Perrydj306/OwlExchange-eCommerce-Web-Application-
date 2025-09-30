const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // import the db connection

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MSSQL
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to OWL EXCHANGE!");
});

// Test route
app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


