import express from "express";
import { registrarProductos } from "../controllers/productoscontroles.js";
import Productos from "../models/productos.js";

const router = express.Router();

// Ruta para registrar un nuevo producto
router.post("/", registrarProductos);

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        // Usamos el modelo importado con mayúscula
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
});

export default router;
