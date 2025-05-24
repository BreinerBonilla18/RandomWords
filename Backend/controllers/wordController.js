import pool from "../db/db.js";

// Obtener todas las palabras
export const getWords = async (_, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM words WHERE is_hidden = false"
    );
    client.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las palabras" });
  }
};

// Crear una nueva palabra
export const createWord = async (req, res) => {
  const { word, meaning, description, level } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO words (word, meaning, description, cefr_level) VALUES ($1, $2, $3, $4)",
      [word, meaning, description, level]
    );
    client.release();
    res.json({ message: "Palabra agregada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar una palabra" });
  }
};

//Actualizar una palabra
export const updateWord = async (req, res) => {
  const { id } = req.params; // ID de la palabra a actualizar
  const { word, meaning, description, level } = req.body; // Nuevos valores para word y meaning

  try {
    const client = await pool.connect();
    const query = `
        UPDATE words 
        SET word = $1, meaning = $2, description = $3, cefr_level = $4
        WHERE id = $5
      `;
    const values = [word, meaning, description, level, id];

    await client.query(query, values);
    client.release();

    res.json({ message: "Palabra actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la palabra" });
  }
};

// Actualizar las veces aprendidas de una palabra
export const updateTimesLearned = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    await client.query(
      "UPDATE words SET timeslearned = timeslearned + 1 WHERE id = $1",
      [id]
    );
    client.release();
    res.json({ message: "Palabra actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la palabra" });
  }
};

export const updateHideWord = async (req, res) => {
  const { id } = req.params
  const isHidden = req.params.isHidden == "true";
  try {
    const client = await pool.connect();
    await client.query(
      "UPDATE words SET is_hidden = $1 WHERE id = $2",
      [isHidden, id]
    );
    client.release()
    const hideMessage = isHidden ? "ocultada" : "expuesta" 
    res.json({ message: `Palabra ${hideMessage} con exito`})
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la palabra" });
  }
};

// Obtener una palabra aleatoria
export const getRandomWord = async (_, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM words WHERE is_hidden = false ORDER BY RANDOM() LIMIT 1 "
    );
    client.release();

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay palabras en la base de datos" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener una palabra aleatoria" });
  }
};

// Obtener una palabra específica y 3 aleatorias más
export const getAnswersMeaning = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    // Consulta para obtener la palabra seleccionada
    const selectedQuery = `
      SELECT id, meaning, description FROM words WHERE id = $1
    `;
    const selectedResult = await client.query(selectedQuery, [id]);

    if (selectedResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Palabra no encontrada" });
    }

    const selectedWord = selectedResult.rows[0];

    // Consulta para obtener 3 palabras aleatorias diferentes a la seleccionada
    const randomQuery = `
      SELECT id, meaning, description FROM words 
      WHERE id != $1
      ORDER BY RANDOM()
      LIMIT 3
    `;
    const randomResult = await client.query(randomQuery, [id]);

    // Combinar ambas listas
    const allWords = [selectedWord, ...randomResult.rows];

    // Opcional: Mezclar las palabras para evitar que siempre esté en la misma posición
    const shuffledWords = allWords.sort(() => Math.random() - 0.5);

    client.release();

    res.json(shuffledWords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las palabras" });
  }
};
