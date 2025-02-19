import express from 'express';
import { getWords, createWord, updateWord } from '../controllers/wordController.js';

const router = express.Router();

// Rutas para las palabras
router.get('/words', getWords); // Obtener todas las palabras
router.post('/create-word', createWord); // Crear una nueva palabra
router.put('/update-word/:id', updateWord); // Actualizar una palabra

export default router;