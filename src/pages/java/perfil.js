// ==========================================
// PERFIL.JS - GESTIÓN DEL PERFIL Y LA SESIÓN
// Este script controla la visibilidad de los iconos (Login vs. Avatar)
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. OBTENER ELEMENTOS Y ESTADO DE SESIÓN
    const SesionActiva = localStorage.getItem('SesionActiva');
    const contenedorPerfil = document.getElementById('user-menu-container');
    const loginIcon = document.getElementById('login-icon'); // Elemento del botón de Login/Registro

    // Si el contenedor del perfil no existe en la página actual, el script termina.
    if (!contenedorPerfil) {
        console.warn('⚠️ Contenedor de perfil (#user-menu-container) no encontrado.');
        return;
    }

    // ==========================================
    // 2. LÓGICA DE VISUALIZACIÓN (TOGGLE LOGIN/PERFIL)
    // ==========================================
    
    if (!SesionActiva) {
        // --- CASO A: NO HAY SESIÓN ACTIVA (Modo Visitante) ---
        console.log('❌ No hay sesión activa. Mostrando Login.');
        
        // Ocultamos el perfil (el avatar)
        contenedorPerfil.classList.add('hidden');
        
        // Nos aseguramos de que el icono de Login esté visible
        if (loginIcon) loginIcon.classList.remove('hidden');
        
        return; // 🛑 El script se detiene aquí si no hay usuario logueado.
    } 
    
    // --- CASO B: SÍ HAY SESIÓN ACTIVA (Modo Usuario) ---
    console.log('✅ Sesión activa. Cargando perfil...');
    
    // CAMBIO CLAVE: Eliminamos el icono de Login/Registro del DOM por completo.
    if (loginIcon) {
        loginIcon.remove(); 
        console.log('✨ Icono de Login/Registro eliminado del DOM.');
    }
    
    // Mostramos el contenedor del perfil (quitando la clase 'hidden')
    contenedorPerfil.classList.remove('hidden');


    // ==========================================
    // 3. OBTENCIÓN DE DATOS DEL USUARIO (FETCH AL BACKEND)
    // ==========================================
    
    const perfilLocal = JSON.parse(localStorage.getItem("usuario"));
    
    if (!perfilLocal || !perfilLocal.email) {
        console.error('❌ Inconsistencia: Hay SesiónActiva pero faltan datos en localStorage.');
        localStorage.clear();
        window.location.reload();
        return;
    }

    let usuarioBackend; 

    try {
        const respuesta = await fetch('https://proyecto-eccomerce-wilson.onrender.com/api/perfil/obtener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: perfilLocal.email })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.message || 'Error al obtener perfil');
        }

        usuarioBackend = data.user;

    } catch (error) {
        console.error("⚠️ Error conectando con backend. Forzando cierre de sesión:", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // ==========================================
    // 4. RENDERIZADO DEL MENÚ (HTML INTERNO)
    // ==========================================

    // Se inyecta el HTML del avatar y el menú desplegable en el contenedor.
    contenedorPerfil.innerHTML = `
        <button id="user-menu-btn"
            class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform focus:outline-none">
            <span id="user-avatar">${usuarioBackend.nombre[0].toUpperCase()}</span>
        </button>

        <div id="user-dropdown"
            class="hidden absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 
                transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">

            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p class="text-sm font-bold text-gray-900 truncate">${usuarioBackend.nombre}</p>
                <p class="text-xs text-gray-500 truncate">${usuarioBackend.email}</p>
                <p class="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wider">${usuarioBackend.role || 'Usuario'}</p>
            </div>

            <div class="py-1">
                <a href="../pages/perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 
                        hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
                    <svg class="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Mi Perfil
                </a>
            </div>

            <div class="border-t border-gray-100 py-1">
                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-red-600
                        hover:bg-red-50 hover:text-red-800 transition-colors cursor-pointer font-medium">
                    <svg class="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;

    // ==========================================
    // 5. FUNCIONALIDAD DEL DROPDOWN (Click y Animación)
    // ==========================================
    
    const btnMenu = document.getElementById("user-menu-btn");
    const dropMenu = document.getElementById("user-dropdown");

    // Lógica para abrir/cerrar el menú al hacer click en el avatar
    btnMenu.addEventListener("click", (e) => {
        e.stopPropagation(); 
        
        if (dropMenu.classList.contains("hidden")) {
            // ABRIR
            dropMenu.classList.remove("hidden");
            setTimeout(() => {
                dropMenu.classList.remove("opacity-0", "scale-95");
                dropMenu.classList.add("opacity-100", "scale-100");
            }, 10);
        } else {
            // CERRAR
            cerrarMenu(dropMenu);
        }
    });

    // Cerrar menú si el usuario hace click en cualquier otro lado de la página
    document.addEventListener('click', (e) => {
        if (!contenedorPerfil.contains(e.target) && !dropMenu.classList.contains('hidden')) {
            cerrarMenu(dropMenu);
        }
    });
});

// Función auxiliar para gestionar la animación de cierre (más limpia)
function cerrarMenu(element) {
    element.classList.remove("opacity-100", "scale-100");
    element.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
        element.classList.add("hidden");
    }, 150);
}

// ==========================================
// 6. CERRAR SESIÓN (Lógica de Logout Global)
// ==========================================

document.addEventListener("click", (e) => {
    // Usamos .closest para asegurar que el evento se dispare incluso si se hace click en el icono o el texto.
    if (e.target.closest('#logout-btn')) {
        console.log("🚪 Iniciando cierre de sesión...");

        localStorage.clear(); // Limpiamos TODA la información de la sesión
        
        const toast = document.getElementById("logout-toast");
        
        if(toast) {
            // Mostrar y animar el toast
            toast.classList.remove("hidden", "opacity-0");
            toast.classList.add("opacity-100");

            // Redirigir después de mostrar el mensaje
            setTimeout(() => {
                toast.classList.remove("opacity-100");
                toast.classList.add("opacity-0");
                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 300); // Esperar que termine el fade out
            }, 1500); // Mostrar mensaje por 1.5 segundos
        } else {
            // Fallback: si el toast no existe, redirigir directamente
            window.location.href = "../pages/login.html";
        }
    }
});