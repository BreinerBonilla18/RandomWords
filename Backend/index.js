import express from 'express';
import pkg from 'pg';
import cors from 'cors'

const { Pool } = pkg;
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes solo desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite solo estos métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite solo estos encabezados
  }));

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres', // Reemplaza con tu usuario de PostgreSQL
    host: 'localhost', // Si PostgreSQL está en el mismo servidor
    database: 'random_words',
    password: 'admin', // Reemplaza con tu contraseña
    port: 5432,
});

app.get('/words', async (req, res) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM words');
      client.release();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las words' });
    }
  });

  app.post('/create-word', async (req, res) => {
    const { word, meaning } = req.body;

  try {
    const client = await pool.connect();
    await client.query('INSERT INTO words (word, meaning) VALUES ($1, $2)', [word, meaning]);
    client.release();

    res.json({ message: 'word added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding a word' });
  }
});

app.put('/update-word/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    await client.query('UPDATE words SET timeslearned = timeslearned + 1 WHERE id = $1', [id]);
    client.release();

    res.json({ message: 'Word updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating word' });
  }
});

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});