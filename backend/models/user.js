import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum:['user', 'admin'],
          default: "user" },
    
    // ✅ NUEVOS CAMPOS para recuperación de contraseña
    codigoRecuperacion:String, //pendiente de required:false 
    codigoExpiracion: Date


});
//forzar que guarde en Users
const User = mongoose.model("User", userSchema, "User");

export default User;