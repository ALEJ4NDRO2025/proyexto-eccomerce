// Importamos el modelo de base de datos
import Pedido from "../models/pedidos.js";
import nodemailer from "nodemailer";

// ==========================================
// FUNCIÓN AUXILIAR: Generar ID único para el pedido
// ==========================================
// Función de crear un ID único combinado
const generarPedidoId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PED-${timestamp}-${random}`;
};

// ==========================================
// CONFIGURAR NODEMAILER
// ==========================================
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alejandromejia2007l@gmail.com',
        pass: 'fjvxinfemjvefpbx'
    }
});

// ==========================================
// ✅ 1. CREAR UN PEDIDO
// ==========================================
export const crearPedido = async (req, res) => {
    try {
        const {
            userId,
            email,
            nombreCliente,
            productos,
            direccionEnvio,
            metodoPago
        } = req.body;

        // Validar que vengan los datos
        if (!userId || !email || !nombreCliente || !productos || !direccionEnvio || !metodoPago) {
            return res.status(400).json({ message: "🍑 Todos los campos son obligatorios" });
        }

        // Calcular totales y subtotales
        // .map sirve para crear un nuevo array con los productos actualizados
        const productosConSubtotal = productos.map(prod => ({
            ...prod, // Mantiene todos los campos originales
            subtotal: prod.precio * prod.cantidad // Agrega el campo subtotal calculado
        }));

        // CÁLCULO TOTAL DEL PEDIDO
        // .reduce sirve para recorrer el array sumando cada subtotal
        // (array es una estructura de datos que guarda datos del mismo tipo)
        const subtotal = productosConSubtotal.reduce((sum, prod) => sum + prod.subtotal, 0);

        // Esto ya es agregaciones chimbas
        const envio = subtotal >= 100000 ? 0 : 10000;

        // Total del pedido
        const total = subtotal + envio;

        // GENERAR ID ÚNICO DEL PEDIDO
        const pedidoId = generarPedidoId();

        // Crear objeto del pedido
        const nuevoPedido = new Pedido({
            pedidoId,
            userId,
            email,
            nombreCliente,
            productos: productosConSubtotal,
            direccionEnvio,
            metodoPago,
            subtotal,
            envio,
            total
        });

        // Guardar en la base de datos
        await nuevoPedido.save();

        res.status(201).json({
            message: "💕 Pedido creado exitosamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        // Manejo de errores
        console.error("Error al crear el pedido:", error);

        // Enviamos respuesta de error al frontend
        res.status(500).json({ 
            message: "Error al crear el pedido", 
            error: error.message 
        });
    }
};

// ==========================================
// ✅ 2. OBTENER TODOS LOS PEDIDOS DE UN USUARIO
// ==========================================
export const obtenerPedidosUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        // .sort sirve para ordenar del más reciente al más antiguo
        const pedidos = await Pedido.find({ userId }).sort({ fechaPedido: -1 });

        // Respuesta exitosa
        res.status(200).json({
            message: "🎉 Pedidos obtenidos exitosamente",
            pedidos // Array con todos los pedidos del usuario
        });

    } catch (error) {
        // Manejo de errores
        console.error("🤬 Error al obtener los pedidos:", error);

        // Enviamos respuesta de error al frontend
        res.status(500).json({ 
            message: "🤬 Error al obtener los pedidos", 
            error: error.message 
        });
    }
};

// ==========================================
// ✅ 3. OBTENER UN PEDIDO ESPECÍFICO
// ==========================================
// Esta función devuelve los detalles de un pedido particular
// Útil para ver la información completa de una compra
export const obtenerPedido = async (req, res) => {
    try {
        // Extraemos el pedidoId de los parámetros de la URL
        const { pedidoId } = req.params;

        // Buscamos el pedido en la base de datos
        const pedido = await Pedido.findOne({ pedidoId });

        // Verificar si el pedido existe
        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado"
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            message: "Pedido encontrado",
            pedido // Objeto con todos los datos del pedido
        });

    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener el pedido:", error);
        res.status(500).json({
            message: "Error al obtener el pedido",
            error: error.message
        });
    }
};

// ==========================================
// ✅ 4. OBTENER TODOS LOS PEDIDOS (ADMIN)
// ==========================================
// Esta función devuelve TODOS los pedidos de TODOS los usuarios
// Solo debería ser accesible por administradores
// Útil para un panel de administración
export const obtenerTodosPedidos = async (req, res) => {
    try {
        // .find() sin parámetros trae TODOS los documentos
        // .sort({ fechaPedido: -1 }) ordena del más reciente al más antiguo
        const pedidos = await Pedido.find().sort({ fechaPedido: -1 });

        // Respuesta exitosa
        res.status(200).json({
            message: "Todos los pedidos obtenidos",
            total: pedidos.length, // Cantidad total de pedidos
            pedidos // Array con todos los pedidos
        });

    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener todos los pedidos:", error);
        res.status(500).json({
            message: "Error al obtener los pedidos",
            error: error.message
        });
    }
};