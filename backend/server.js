import express from 'express';
import cors from 'cors';
import "./db/db.js";
import ProductosRouter from "./routes/productos.js";
import UsersRouter from "./routes/users.js";
import LoginRouter from './routes/Login.js';
import obtenerPerfil from "./routes/perfil.js";
import Recuperarpassword from "./routes/rc.js";
import PedidosRouter from "./routes/pedidos.js";

// Crear la aplicación de Express
const app = express();

app.use(cors());
app.use(express.json());


// Rutas
app.get('/', (req, res) => {
    res.send('Bienvenido al curso de node express');
});

app.use("/api/productos", ProductosRouter);
app.use("/api/users", UsersRouter);
app.use("/api/login", LoginRouter); // <-- Usamos el router aquí
app.use("/api/perfil", obtenerPerfil); // <-- Usamos el router aquí") ACUERDESE DE LOS .JS
app.use('/api/Recuperar', Recuperarpassword)
app.use("/api/pedidos", PedidosRouter);

// Escuchar al servidor al final
app.listen(8081, () => console.log('Servidor corriendo en http://localhost:8081'));
