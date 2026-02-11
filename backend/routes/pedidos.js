import express from "express";
import {crearPedido,obtenerPedidosUsuario,obtenerPedido} from "../controllers/pedidos.js";

const router = express.Router();

// Crear un nuevo pedido
router.post("/", crearPedido);

// Obtener todos los pedidos de un usuario
router.get("/usuario/:userId", obtenerPedidosUsuario);

// Obtener un pedido específico
router.get("/:pedidoId", obtenerPedido);

export default router;
