import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productId:{type:String,require:true,unique:true},
    nombre:{type:String,require:true},
    descripcion:{type:String,require:true},
    precio:{type:Number,require:true},
    imagen:{type:String,require:true},
});

const productos = mongoose.model("productos",productSchema,"productos")

export default productos;