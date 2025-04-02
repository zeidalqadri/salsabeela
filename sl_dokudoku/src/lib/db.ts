import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any) => pool.query(text, params);

pool.on('connect', () => {
  console.log('New connection established');
});

pool.on('remove', () => {
  console.log('Connection removed');
});

pool.on('error', (err) => {
  console.error('Connection pool error:', err);
}); 