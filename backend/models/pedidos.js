import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    pedidoId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    nombreCliente: { type: String, required: true },
    productos: { type: Array, required: true },
    direccionEnvio: { type: Object, required: true },
    metodoPago: { type: String, required: true },
    subtotal: { type: Number, required: true },
    envio: { type: Number, required: true },
    total: { type: Number, required: true },
    estado: { type: String, default: 'pendiente' }
}, {
    timestamps: true
});

const Pedido = mongoose.model("Pedido", pedidoSchema, "Pedido");

export default Pedido;