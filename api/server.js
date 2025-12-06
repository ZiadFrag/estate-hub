import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getPool, closePool, sql } from './database.js';
import { fetchFromTable, insertIntoTable, updateTable, deleteFromTable, executeQuery } from './queryBuilder.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize pool
let pool = null;

// Initialize database connection on startup
const initializeDatabase = async () => {
  try {
    pool = await getPool();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT 1');
    res.json({
      status: 'connected',
      database: process.env.DB_NAME,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'disconnected',
      error: error.message
    });
  }
});

// Get all tables
app.get('/api/tables', async (req, res) => {
  try {
    const result = await pool.request().query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
    );
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table structure
app.get('/api/tables/:tableName/structure', async (req, res) => {
  try {
    const { tableName } = req.params;
    const result = await pool.request().query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`
    );
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch from table with filters
app.get('/api/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const filters = req.query;
    const data = await fetchFromTable(pool, tableName, filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert into table
app.post('/api/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const data = req.body;
    await insertIntoTable(pool, tableName, data);
    res.status(201).json({
      success: true,
      message: `Record inserted into ${tableName}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update table
app.put('/api/tables/:tableName/:id', async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const data = req.body;
    await updateTable(pool, tableName, id, data);
    res.json({
      success: true,
      message: `Record updated in ${tableName}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete from table
app.delete('/api/tables/:tableName/:id', async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const result = await deleteFromTable(pool, tableName, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute custom query
app.post('/api/query', async (req, res) => {
  try {
    const { query, params } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const result = await executeQuery(pool, query, params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connection...');
  await closePool();
  process.exit(0);
});

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
  });
});

export default app;
