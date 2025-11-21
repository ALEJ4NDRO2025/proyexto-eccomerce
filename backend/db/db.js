import mongoose from "mongoose";
const uri = "mongodb+srv://adsotarde:adso2025@eccomerce.gvdi4ig.mongodb.net/ECCOMERCE?retrywrites=true&w=majority";

mongoose.connect(uri)

.then(()=> console.log(' 🥵✅conectado a la base de datos') )
.catch(error => console.log(' ERROR de conexion a la base de datos', error) );