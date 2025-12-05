import express from 'express';
import { getPedidos } from '../controllers/pedidos.js';

const router = express.Router();

router.get('/', getPedidos);

export default router; //ESTE ROUTER PROBABLEMENTE ESTE IMCOMPLETO Y REVISE EL CONTROLADOR