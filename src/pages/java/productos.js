// ==========================================
// FUNCIONES DEL CARRITO (AGREGAR AL INICIO)
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

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    let carrito = obtenerCarrito();
    
    // Verificar si el producto ya existe
    const indice = carrito.findIndex(item => item.productId === producto.productId);
    
    if (indice !== -1) {
        // Si existe, aumentar cantidad
        carrito[indice].cantidad += 1;
        mostrarNotificacion(`Cantidad actualizada: ${carrito[indice].cantidad}`);
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            ...producto,
            cantidad: 1
        });
        mostrarNotificacion('Producto agregado al carrito ✓');
    }
    
    guardarCarrito(carrito);
}

// Actualizar contador del carrito en el header
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

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300 ${
        tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-semibold`;
    notificacion.textContent = mensaje;
    notificacion.style.opacity = '0';
    notificacion.style.transform = 'translateY(-20px)';
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateY(-20px)';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ==========================================
// TU CÓDIGO ORIGINAL (NO SE TOCA)
// ==========================================

//funcion de cargar productos
async function cargarProductos(){
    try{
        const response = await fetch('https://proyecto-eccomerce-wilson.onrender.com/api/productos');
        
        // Manejo de error de HTTP
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const productos = await response.json();

        const grid_p = document.getElementById('product-grid');
        
        // Genera el HTML con el diseño de Tailwind corregido
        grid_p.innerHTML=productos.map(productos=> {
            // Corrección: Uso toLocaleString correctamente
            const precioFormateado = (productos.precio||0).toLocaleString('es-CO');
            
            return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 product-card"
            data-category="laptops"
            data-price="${productos.precio}"
            data-product-id="${productos.productId || productos.ProductId || productos.id}"> 
            
                <div class="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${productos.imagen}" alt="${productos.nombre}" 
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"> <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -15%
                    </div>
                </div> <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    ${productos.nombre}</h3>

                    <p class="text-gray-600 mb-4">
                    ${productos.descripcion}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-blue-600">
                        $${precioFormateado}
                        </span>
                        
                        <div class="flex text-yellow-500">
                            ⭐⭐⭐⭐⭐
                        </div>
                    </div>

                    <div class="flex space-x-2 mt-4">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                        ver detalles
                        </button>

                        <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                        comprar
                        </button>
                    </div>
                </div> </div> `;
        }).join('');
        console.log("productos cargados con exito");
        
        // ✅ AGREGAR ESTO: Event listeners para los botones
        agregarEventListenersCarrito();

    }catch(error){
        console.error("Error al cargar los productos:", error);
    }
}

// ==========================================
// NUEVA FUNCIÓN: Event Listeners del Carrito
// ==========================================
function agregarEventListenersCarrito() {
    const botonesAgregar = document.querySelectorAll('.add-to-cart-btn');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtener la tarjeta del producto
            const card = e.target.closest('.product-card');
            
            // Extraer información del producto
            const producto = {
                productId: card.dataset.productId,
                nombre: card.querySelector('h3').textContent.trim(),
                descripcion: card.querySelector('p').textContent.trim(),
                precio: parseFloat(card.dataset.price),
                imagen: card.querySelector('img').src
            };
            
            // Agregar al carrito
            agregarAlCarrito(producto);
            
            // Animación visual del botón
            boton.classList.add('scale-95');
            setTimeout(() => {
                boton.classList.remove('scale-95');
            }, 200);
        });
    });
}

// ==========================================
// INICIALIZAR TODO
// ==========================================
cargarProductos();

// Actualizar contador al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
});