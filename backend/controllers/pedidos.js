import Pedido from "../models/pedidos.js";

// Generar ID único
const generarPedidoId = () => `PED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ==========================================
// CREAR PEDIDO
// ==========================================
export const crearPedido = async (req, res) => {
    try {
        const { userId, email, nombreCliente, productos, direccionEnvio, metodoPago } = req.body;

        // Validar datos obligatorios
        if (!userId || !email || !nombreCliente || !productos || !direccionEnvio || !metodoPago) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Calcular subtotal de cada producto
        const productosConSubtotal = productos.map(prod => ({
            ...prod,
            subtotal: prod.precio * prod.cantidad
        }));

        // Calcular subtotal total
        const subtotal = productosConSubtotal.reduce((sum, prod) => sum + prod.subtotal, 0);

        // Calcular envío (gratis si supera $100,000)
        const envio = subtotal >= 100000 ? 0 : 10000;

        // Calcular total
        const total = subtotal + envio;

        // Crear pedido
        const nuevoPedido = new Pedido({
            pedidoId: generarPedidoId(),
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
            message: "Pedido creado exitosamente", 
            pedido: nuevoPedido 
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error al crear pedido", error: error.message });
    }
};

// ==========================================
// OBTENER PEDIDOS DE UN USUARIO
// ==========================================
export const obtenerPedidosUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        const pedidos = await Pedido.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ 
            message: "Pedidos obtenidos exitosamente", 
            pedidos 
        });

    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
    }
};

// ==========================================
// OBTENER UN PEDIDO ESPECÍFICO
// ==========================================
export const obtenerPedido = async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const pedido = await Pedido.findOne({ pedidoId });
        
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ 
            message: "Pedido encontrado", 
            pedido 
        });

    } catch (error) {
        console.error("Error al obtener pedido:", error);
        res.status(500).json({ message: "Error al obtener pedido", error: error.message });
    }
};