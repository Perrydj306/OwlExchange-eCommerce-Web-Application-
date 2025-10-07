require('dotenv').config();
const sql = require('mssql');
console.log("Loaded ENV:", process.env); // debug


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // false for local, true if using Azure
        trustServerCertificate: true, // allows self-signed certs
    }
};

async function connectDB() {
    try {
        console.log("Attempting SQL connection...");
        await sql.connect(config);
        console.log("Connected to MSSQL Database!");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

module.exports = connectDB;

