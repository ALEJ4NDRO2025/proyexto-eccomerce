// ==========================================
// FUNCIONES DE LOCALSTORAGE
// ==========================================

// Obtener carrito desde localStorage
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
}

// ==========================================
// AGREGAR PRODUCTO AL CARRITO
// ==========================================
function agregarAlCarrito(producto) {
    let carrito = obtenerCarrito();
    
    // Verificar si el producto ya existe
    const indice = carrito.findIndex(item => item.productId === producto.productId);
    
    if (indice !== -1) {
        // Si existe, aumentar cantidad
        carrito[indice].cantidad += 1;
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito(carrito);
    mostrarNotificacion('Producto agregado al carrito');
}

// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==========================================
function eliminarDelCarrito(productId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.productId !== productId);
    guardarCarrito(carrito);
    cargarCarrito();
}

// ==========================================
// ACTUALIZAR CANTIDAD
// ==========================================
function actualizarCantidad(productId, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const indice = carrito.findIndex(item => item.productId === productId);
    
    if (indice !== -1) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productId);
        } else {
            carrito[indice].cantidad = nuevaCantidad;
            guardarCarrito(carrito);
            cargarCarrito();
        }
    }
}

// ==========================================
// ACTUALIZAR CONTADOR DEL HEADER
// ==========================================
function actualizarContador() {
    const carrito = obtenerCarrito();
    const contador = document.getElementById('cart-counter');
    
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        if (totalItems > 0) {
            contador.textContent = totalItems;
            contador.style.display = 'flex';
        } else {
            contador.style.display = 'none';
        }
    }
}

// ==========================================
// CALCULAR TOTALES
// ==========================================
function calcularTotales() {
    const carrito = obtenerCarrito();
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 100000 ? 0 : 10000;
    const total = subtotal + envio;
    
    return { subtotal, envio, total };
}

// ==========================================
// CARGAR PRODUCTOS EN LA PÁGINA
// ==========================================
function cargarCarrito() {
    const carrito = obtenerCarrito();
    const carritoVacio = document.getElementById('carrito-vacio');
    const listaProductos = document.getElementById('lista-productos');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    
    if (carrito.length === 0) {
        carritoVacio.classList.remove('hidden');
        listaProductos.classList.add('hidden');
        if (btnFinalizar) btnFinalizar.disabled = true;
    } else {
        carritoVacio.classList.add('hidden');
        listaProductos.classList.remove('hidden');
        if (btnFinalizar) btnFinalizar.disabled = false;
        
        // Renderizar productos
        listaProductos.innerHTML = carrito.map(item => `
            <div class="bg-white rounded-2xl shadow-lg p-6 flex gap-6">
                <img src="${item.imagen}" alt="${item.nombre}" 
                     class="w-32 h-32 object-cover rounded-lg">
                
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${item.nombre}</h3>
                    <p class="text-gray-600 mb-4">${item.descripcion}</p>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <button onclick="actualizarCantidad('${item.productId}', ${item.cantidad - 1})"
                                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            
                            <span class="text-lg font-semibold">${item.cantidad}</span>
                            
                            <button onclick="actualizarCantidad('${item.productId}', ${item.cantidad + 1})"
                                    class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="text-right">
                            <p class="text-2xl font-bold text-blue-600">
                                $${(item.precio * item.cantidad).toLocaleString('es-CO')}
                            </p>
                            <p class="text-sm text-gray-500">
                                $${item.precio.toLocaleString('es-CO')} c/u
                            </p>
                        </div>
                    </div>
                </div>
                
                <button onclick="eliminarDelCarrito('${item.productId}')"
                        class="text-red-500 hover:text-red-700 p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `).join('');
        
        // Actualizar totales
        const { subtotal, envio, total } = calcularTotales();
        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
        document.getElementById('total').textContent = `$${total.toLocaleString('es-CO')}`;
        
        // Actualizar texto de envío
        const envioTexto = document.querySelector('.flex.justify-between.items-center.py-3.border-b span:last-child');
        if (envioTexto) {
            if (envio === 0) {
                envioTexto.textContent = 'Gratis';
                envioTexto.className = 'text-green-600 font-semibold';
            } else {
                envioTexto.textContent = `$${envio.toLocaleString('es-CO')}`;
                envioTexto.className = 'text-gray-900 font-semibold';
            }
        }
    }
}

// ==========================================
// FINALIZAR COMPRA - ENVIAR AL BACKEND
// ==========================================
async function finalizarCompra() {
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const codigoPostal = document.getElementById('codigo-postal').value.trim();
    const metodoPago = document.getElementById('metodo-pago').value;
    
    // Validar campos
    if (!direccion || !ciudad || !codigoPostal) {
        mostrarNotificacion('Por favor completa todos los campos de envío', 'error');
        return;
    }
    
    // Obtener información del usuario
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        mostrarNotificacion('Debes iniciar sesión para finalizar la compra', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    
    // Deshabilitar botón mientras se procesa
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
            <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Procesando...
    `;
    
    try {
        // Preparar datos del pedido
        const pedidoData = {
            userId: usuario.userId,
            email: usuario.email,
            nombreCliente: usuario.nombre,
            productos: carrito,
            direccionEnvio: {
                direccion,
                ciudad,
                codigoPostal
            },
            metodoPago
        };
        
        // Enviar pedido al backend
        const response = await fetch('https://proyecto-eccomerce-wilson.onrender.com/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear el pedido');
        }
        
        // Pedido creado exitosamente
        console.log('Pedido creado:', data);
        
        // Limpiar carrito
        localStorage.removeItem('carrito');
        actualizarContador();
        
        // Mostrar mensaje de éxito
        mostrarNotificacion(`¡Compra realizada con éxito! Pedido #${data.pedido.pedidoId}`, 'success');
        
        // Redirigir a página de inicio
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
    } catch (error) {
        console.error('Error al finalizar compra:', error);
        mostrarNotificacion(`Error: ${error.message}`, 'error');
        
        // Rehabilitar botón
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Finalizar Compra
        `;
    }
}

// ==========================================
// MOSTRAR NOTIFICACIÓN
// ==========================================
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
        tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.opacity = '0';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ==========================================
// INICIALIZAR EN LA PÁGINA DEL CARRITO
// ==========================================
if (window.location.pathname.includes('carrito.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cargarCarrito();
        actualizarContador();
        
        const btnFinalizar = document.getElementById('btn-finalizar-compra');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', finalizarCompra);
        }
    });
}

// ==========================================
// ACTUALIZAR CONTADOR EN TODAS LAS PÁGINAS
// ==========================================
document.addEventListener('DOMContentLoaded', actualizarContador);