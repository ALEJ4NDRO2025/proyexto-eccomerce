import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
            return res.status(400).json({ message: "Contraseña incorrecta" }); //pendiente de las variables password
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id,
              role: usuario.role //pendiente de las variables role-rol
             },
             process.env.JWT_SECRET,
            { expiresIn: '1h' });

            //respondemos con token y datos del usuario

        res.status(200).json({
            message: "Login exitoso pelao",
            token,
            user: {
                userId:usuario.userId,
                nombre:usuario.nombre,
                email:usuario.email,
                role:usuario.role
            },
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

        

