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



//actualizar perfil del usuario

export const actualizarPerfil = async (req, res) => {
    try {
        const { email, nombre } = req.body;

        // validar campos obligatorios
        if (!email) {
            return res.status(400).json({ message: "🤬 El email es requerido." });
        }
        if (!nombre) {
            return res.status(400).json({ message: "🤬 El nombre es requerido." });
        }

        // buscar usuario por email y actualizar su nombre
        // Asumiendo que 'User' es el modelo de Mongoose
        const usuarioActualizado = await User.findOneAndUpdate(
            { email: email },
            { nombre: nombre },
            { new: true } // opcion para devolver el documento actualizado
        ).select('-password'); // Excluir el campo password

        if (!usuarioActualizado) {
            return res.status(404).json({ message: "😤 Usuario no encontrado." });
        }

        // Respuesta exitosa
        res.status(200).json({
            user: {
                userId: usuarioActualizado.userId,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                role: usuarioActualizado.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el perfil del usuario", error: error.message});
    }
};


// controler de eliminar
export const eliminarPerfil = async (req, res) => {
    try {
        // 1. Obtener el email del cuerpo de la solicitud
        const { email } = req.body;

        // 2. Validar que el email esté presente
        if (!email) {
            return res.status(400).json({ 
                message: "El campo 'email' es requerido en el cuerpo de la solicitud." 
            });
        }

        // 3. Buscar y eliminar el usuario
        // findOneAndDelete() busca el documento y lo elimina
        const usuarioEliminado = await User.findOneAndDelete({ email: email });

        // 4. Manejar el caso de "Usuario no encontrado"
        if (!usuarioEliminado) {
            return res.status(404).json({ 
                message: `Usuario no encontrado.` 
            });
        }

        // 5. Respuesta de éxito (Status 200 OK)
            res.status(200).json({ 
            message: "Perfil eliminado exitosamente.",
            usuario: {
                // Se corrigió el error de sintaxis aquí (faltaba el nombre de la propiedad)
                userId: usuarioEliminado.userId, 
                nombre: usuarioEliminado.nombre,
                email: usuarioEliminado.email
                // La contraseña no se devuelve por seguridad
            }
        });

    } catch (error) {
        // 6. Manejar errores del servidor o de la base de datos
        console.error("Error al intentar eliminar el perfil:", error);
        return res.status(500).json({ 
            message: "Ocurrió un error en el servidor al eliminar el perfil.",
            error: error.message 
        });
    }
};

