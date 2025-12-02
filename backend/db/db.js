import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI


mongoose.connect(uri)

.then(()=> console.log(' 🥵✅conectado a la base de datos') )
.catch(error => console.log(' ERROR de conexion a la base de datos', error) );