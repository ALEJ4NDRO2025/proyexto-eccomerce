import express from 'express';
import { obtenerPerfil } from '../controllers/perfil.js';

const router = express.Router();

// Ruta para obtener el perfil del usuario
router.post('/obtener', obtenerPerfil);

export default router;