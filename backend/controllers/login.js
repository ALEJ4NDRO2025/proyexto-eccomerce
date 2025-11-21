import bcrypt from 'bcrypt';
import User from '../models/user.js';

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: "Por favor ingrese email y contraseña" });
        }

        // Buscar usuario en la BD
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseña encriptada
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Login exitoso
        res.status(200).json({
            message: "Login exitoso",
            user: {
                userId:usuario.userId,
                nombre:usuario.nombre,
                email:usuario.email,
                role:usuario.role
            }
        });

    } catch (error) {
        console.error("Error en el login del usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
