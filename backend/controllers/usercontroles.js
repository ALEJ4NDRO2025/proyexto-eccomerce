import User from "../models/user.js";
import bcrypt from "bcrypt";

// Registrar un nuevo usuario
export const registrarUsers = async (req, res) => {
    try {
        const { userId, nombre, email, password, role } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si ya existe el usuario
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            userId,
            nombre,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        // Guardar en la base de datos
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
};
