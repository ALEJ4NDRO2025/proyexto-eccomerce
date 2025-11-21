//importamos el modelo de base de datos
import User from "../models/user.js";


//obtener el perfil del usuario

export const obtenerPerfil = async (req,res)=>{
    try{
        //extraer el email del cuerpo de la solicitud
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"🤬 El email es requerido."})
        }

        //traer el correo de la base de datos
        const usuari0= await User.findOne({email:email}).select('-password'); //PENDITENTE DE REVISIÓN User.findOne y email - //buscar usuario por email
        if(!usuari0){
            return res.status(404).json({message:"😤 Usuario no encontrado."}); // Si no encuentra el usuario
        }
        res.status(200).json({
            user:{
                userId:usuari0.userId,
                nombre:usuari0.nombre,
                email:usuari0.email,
                role:usuari0.role
            } 
        
        });



    } catch(error){

        res.status(500).json({message:"Error al obtener el perfil del usuario",error:error.message});//mensaje de error
    }

}









