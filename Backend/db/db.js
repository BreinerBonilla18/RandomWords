import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres', // Reemplaza con tu usuario de PostgreSQL
  host: 'localhost', // Si PostgreSQL está en el mismo servidor
  database: 'random_words',
  password: 'admin', // Reemplaza con tu contraseña
  port: 5432,
});

export default pool;