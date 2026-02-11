import jwt from 'jsonwebtoken';
import User from '../models/user.js';

//Verificar token JWT y consultar el usuario en la base de datos
export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    }
}//TERMINAR