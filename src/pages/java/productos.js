//funcion de cargar productos
async function cargarProductos(){
    try{
        const response = await fetch('https://proyecto-eccomerce-wilson.onrender.com/api/productos');//ajustar la ruta si es necesario
        
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
            data-product-id="${productos.ProductId || productos.id}"> 
            
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
                            ⭐️⭐️⭐️⭐️⭐️
                        </div>
                    </div>

                    <div class="flex space-x-2 mt-4">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                        ver detalles
                        </button>

                        <button class="add-to-car-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                        comprar
                        </button>
                    </div>
                </div> </div> `;
        }).join('');
        console.log("productos cargados con exito")
        

    }catch(error){
        console.error("Error al cargar los productos:", error);
    }

}
//
cargarProductos();

// Si tenías un setInterval fuera del bloque try...catch, lo mantengo aquí:
// setInterval(() => {
//     cargarProductos();
// }, 5000);