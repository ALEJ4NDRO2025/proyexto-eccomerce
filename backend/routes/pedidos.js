import express from "express";
import {crearPedido,obtenerPedidosUsuario,obtenerPedido} from "../controllers/pedidos.js";

const router = express.Router();

// Crear un nuevo pedido
router.post("/", crearPedido);

// Obtener todos los pedidos de un usuario
router.get("/usuario/:userId", obtenerPedidosUsuario);

// Obtener un pedido específico
router.get("/:pedidoId", obtenerPedido);

export default router;
```

---

## 📋 **LAS 3 RUTAS QUE NECESITAS:**

### **1. Crear pedido**
```
POST /api/pedidos
```

### **2. Ver pedidos de un usuario**
```
GET /api/pedidos/usuario/user123
```

### **3. Ver un pedido específico**
```
GET /api/pedidos/PED-1234567890-123