import express from 'express';
import { obtenerPerfil, actualizarPerfil, eliminarPerfil } from '../controllers/perfil.js';


const router = express.Router();

// Ruta para obtener el perfil del usuario
router.post('/obtener', obtenerPerfil);
router.put('/actualizar', actualizarPerfil);
router.delete('/eliminar',eliminarPerfil)

export default router;