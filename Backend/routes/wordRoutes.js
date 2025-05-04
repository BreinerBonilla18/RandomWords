import express from 'express';
import { getWords, createWord, updateWord, updateTimesLearned, getRandomWord, getAnswersMeaning } from '../controllers/wordController.js';

const router = express.Router();

// Rutas para las palabras
router.get('/random-word', getRandomWord); // Obtener una palabra aleatoria
router.get('/answers-meanings/:id', getAnswersMeaning);
router.get('/words', getWords); // Obtener todas las palabras
router.post('/create-word', createWord); // Crear una nueva palabra
router.put('/update-word/:id', updateWord); // Actualizar una palabra
router.put('/update-times-learned/:id', updateTimesLearned); // Actualizar las veces aprendidas de una palabra

export default router;