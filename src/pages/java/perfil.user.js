let modoEdicion = false;
let datosUsuarioActual = null;

// Función para obtener las iniciales del avatar
function obtenerIniciales(nombre) {
    if (!nombre) return '?';
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
        return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
    }
    return nombre.charAt(0).toUpperCase();
}

// 🔌 CONECTADO AL BACKEND: Obtener datos del usuario
async function obtenerDatosUsuario() {
    try {
        // ✅ CORREGIDO: Usar 'usuario' (la misma clave que login.js y perfil.js)
        const userData = JSON.parse(localStorage.getItem('usuario'));
        
        console.log('📦 Datos en localStorage:', userData);
        
        if (!userData || !userData.email) {
            console.error('❌ No hay sesión activa');
            alert('No hay sesión activa. Redirigiendo al login...');
            window.location.href = 'login.html';
            return null;
        }

        console.log('📤 Enviando solicitud al backend con email:', userData.email);

        const response = await fetch('http://localhost:8081/api/perfil/obtener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userData.email })
        });

        console.log('📥 Respuesta del servidor - Status:', response.status);

        const data = await response.json();
        
        console.log('📥 Datos recibidos:', data);

        if (response.ok) {
            datosUsuarioActual = data.user;
            return data.user;
        } else {
            console.error('❌ Error al obtener perfil:', data.message);
            alert(data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        alert('Error al cargar el perfil. Verifica tu conexión y que el servidor esté corriendo.');
        return null;
    }
}

// 🔌 CONECTADO AL BACKEND: Guardar cambios del usuario
async function guardarDatosUsuario(nuevoNombre) {
    try {
        const userData = JSON.parse(localStorage.getItem('usuario'));
        
        const response = await fetch('http://localhost:8081/api/perfil/actualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: userData.email,
                nombre: nuevoNombre
            })
        });

        const data = await response.json();

        if (response.ok) {
            datosUsuarioActual = data.user;
            
            userData.nombre = data.user.nombre;
            localStorage.setItem('usuario', JSON.stringify(userData));
            
            alert('Perfil actualizado exitosamente');
            return true;
        } else {
            alert(data.message);
            return false;
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar los cambios');
        return false;
    }
}

// 🔌 CONECTADO AL BACKEND: Eliminar cuenta
async function eliminarCuenta() {
    try {
        const userData = JSON.parse(localStorage.getItem('usuario'));
        
        const response = await fetch('http://localhost:8081/api/perfil/eliminar', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userData.email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cuenta eliminada exitosamente');
            localStorage.clear();
            window.location.href = 'index.html';
            return true;
        } else {
            alert(data.message);
            return false;
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la cuenta');
        return false;
    }
}

// Función principal para cargar la información en el HTML
async function renderizarPerfil() {
    const usuario = await obtenerDatosUsuario();
    
    if (!usuario) return;

    const btnEditar = document.getElementById('btn-editar');

    // Cargar datos de la cabecera y avatar
    document.getElementById('perfil-nombre-completo').textContent = usuario.nombre;
    document.getElementById('perfil-correo').textContent = usuario.email;
    document.getElementById('perfil-foto').textContent = obtenerIniciales(usuario.nombre);

    // Cargar datos en los inputs del formulario
    document.getElementById('edit-nombre').value = usuario.nombre;
    document.getElementById('edit-correo').value = usuario.email;
    document.getElementById('edit-role').value = usuario.role || 'user';
    
    // Poner inputs en modo sólo lectura (vista)
    document.getElementById('edit-nombre').readOnly = true;
    document.getElementById('edit-correo').readOnly = true;
    document.getElementById('edit-role').readOnly = true;
    
    // Configurar botones para modo vista
    btnEditar.textContent = "Editar Perfil";
    btnEditar.classList.remove('bg-green-600', 'hover:bg-green-700');
    btnEditar.classList.add('bg-blue-600', 'hover:bg-blue-700');
    document.getElementById('btn-cancelar').classList.add('hidden');
    document.getElementById('btn-eliminar').classList.remove('hidden');
    
    modoEdicion = false;
}

// Función para alternar entre modo vista y edición
function toggleModoEdicion() {
    modoEdicion = !modoEdicion;
    const btnEditar = document.getElementById('btn-editar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEliminar = document.getElementById('btn-eliminar');
    const nombreInput = document.getElementById('edit-nombre');

    nombreInput.readOnly = !modoEdicion;

    if (modoEdicion) {
        // Modo edición: Botón Guardar
        btnEditar.textContent = "Guardar Cambios";
        btnEditar.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        btnEditar.classList.add('bg-green-600', 'hover:bg-green-700');
        btnCancelar.classList.remove('hidden');
        btnEliminar.classList.add('hidden');
    } else {
        // Modo vista: Vuelve a cargar datos originales
        renderizarPerfil(); 
    }
}

// Función para procesar y guardar los datos del formulario
async function manejarGuardarCambios() {
    const nuevoNombre = document.getElementById('edit-nombre').value.trim();

    if (!nuevoNombre) {
        alert("El nombre es obligatorio.");
        return;
    }
    
    const exito = await guardarDatosUsuario(nuevoNombre);
    
    if (exito) {
        toggleModoEdicion();
    }
}

// --- EVENTOS PRINCIPALES ---
document.addEventListener('DOMContentLoaded', () => {
    
    console.log('🚀 Página de perfil cargada');
    console.log('🔍 Verificando localStorage...');
    
    const checkUser = localStorage.getItem('usuario');
    console.log('👤 Usuario en localStorage:', checkUser);
    
    renderizarPerfil();

    document.getElementById('btn-editar').addEventListener('click', (e) => {
        e.preventDefault();
        
        if (modoEdicion) {
            manejarGuardarCambios();
        } else {
            toggleModoEdicion();
        }
    });
    
    document.getElementById('btn-cancelar').addEventListener('click', (e) => {
        e.preventDefault();
        toggleModoEdicion();
    });
    
    document.getElementById('btn-eliminar').addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            await eliminarCuenta();
        }
    });
});