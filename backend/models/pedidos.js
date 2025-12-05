import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    pedidoId:{type:String,required:true,unique:true},
    userId:{type:String,required:true},
    email:{type:String,required:true},
    nombreCliente:{type:String,required:true},

    productos: [{
     productId: {type: String,required: true},
        nombre: {type: String,required: true},
        descripcion: {type: String,required: true},
        precio: {type: Number,required: true},
        cantidad: {type: Number,required: true,min: 1},
        imagen: {type: String,required: true},
        subtotal: {type: Number,required: true}
    }],
    
    direccionEnvio: {direccion: {type: String,required: true},
    ciudad: {type: String,required: true},
    codigoPostal: {type: String,required: true}
    },

    metodoPago:{type: String,required: true,enum: ['efectivo', 'tarjeta', 'transferencia', 'paypal']},
    subtotal:{type: Number,required: true},
    envio:{type: Number,default: 0},
    total: {type: Number,required: true},
    estado: {type: String,enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'},
    fechaPedido: {type: Date,default: Date.now},
    fechaActualizacion: {type: Date,default: Date.now}
}, {
    timestamps: true
});

// Cada vez que guardas o actualizas un pedido con .save(), AUTOMÁTICAMENTE actualiza el campo fechaActualizacion con la fecha y hora actual.
pedidoSchema.pre('save', function(next) {
    this.fechaActualizacion = Date.now();
    next();
});

const Pedido = mongoose.model("Pedido", pedidoSchema, "Pedido");

export default Pedido;


