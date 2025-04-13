import pool from '../db/db.js';

// Obtener todas las palabras
export const getWords = async (req, res) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM words');
      client.release();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener las palabras' });
    }
  };
  
  // Crear una nueva palabra
  export const createWord = async (req, res) => {
    const { word, meaning } = req.body;
    try {
      const client = await pool.connect();
      await client.query('INSERT INTO words (word, meaning) VALUES ($1, $2)', [word, meaning]);
      client.release();
      res.json({ message: 'Palabra agregada exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al agregar una palabra' });
    }
  };

  //Actualizar una palabra
  export const updateWord = async (req, res) => {
    const { id } = req.params; // ID de la palabra a actualizar
    const { word, meaning } = req.body; // Nuevos valores para word y meaning
  
    try {
      const client = await pool.connect();
      const query = `
        UPDATE words 
        SET word = $1, meaning = $2 
        WHERE id = $3
      `;
      const values = [word, meaning, id];
  
      await client.query(query, values);
      client.release();
  
      res.json({ message: 'Palabra actualizada exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la palabra' });
    }
  };
  
  // Actualizar las veces aprendidas de una palabra
  export const updateTimesLearned = async (req, res) => {
    const { id } = req.params;
    try {
      const client = await pool.connect();
      await client.query('UPDATE words SET timeslearned = timeslearned + 1 WHERE id = $1', [id]);
      client.release();
      res.json({ message: 'Palabra actualizada exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la palabra' });
    }
  };