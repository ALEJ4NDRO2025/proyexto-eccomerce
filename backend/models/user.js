import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    
    // ✅ NUEVOS CAMPOS para recuperación de contraseña
    codigoRecuperacion: { 
        type: String, 
        required: false 
    },
    codigoExpiracion: { 
        type: Number, 
        required: false 
    }
}, {
    timestamps: true // Opcional: agrega createdAt y updatedAt automáticamente
});

const User = mongoose.model("User", userSchema, "User");

export default User;