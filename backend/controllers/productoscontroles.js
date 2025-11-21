// importar el modelo de productos
import Producto from "../models/productos.js";

// crear un nuevo producto
export const registrarProductos = async (req, res) => {
    try {
        const { productId, nombre, descripcion, precio, imagen } = req.body;

        const nuevoProducto = new Producto({
            productId,
            nombre,
            descripcion,
            precio,
            imagen
        });

        await nuevoProducto.save();
        res.status(201).json({ message: "Producto guardado con éxito" });
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        res.status(400).json({ message: "Error al ingresar el producto" });
    }
};

// traer los datos de la base de datos
export const obtenerProductos = async (req, res) => {
    try {
        const listaProductos = await Producto.find();
        res.json(listaProductos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};
