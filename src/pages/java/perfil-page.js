// perfil-page.js
// Script responsable de rellenar la página perfil.html con los datos del usuario
// Comentarios detallados para un dev junior en cada bloque explicando qué se hace y por qué.

document.addEventListener('DOMContentLoaded', async function () {
  // Esperamos a que el DOM esté listo para poder obtener elementos por id

  // Referencias a los elementos del DOM que existen en perfil.html
  // Si alguno no existe, el script mostrará un mensaje en consola pero seguirá intentando con los demás.
  const nombreEl = document.getElementById('profile-name'); // donde mostraremos el nombre
  const emailEl = document.getElementById('profile-email'); // donde mostraremos el correo
  const roleEl = document.getElementById('profile-role');   // donde mostraremos el rol
  const avatarEl = document.getElementById('profile-avatar'); // avatar / inicial
  const messageEl = document.getElementById('profile-message'); // contenedor para mensajes al usuario
  const logoutBtn = document.getElementById('logout-link'); // botón de cerrar sesión en la página
  const editBtn = document.getElementById('edit-profile-btn'); // botón editar (no funcional por ahora)
  const changePasswordBtn = document.getElementById('change-password-btn'); // botón cambiar contraseña

  // Comprobación básica: si no hay sesión activa, redirigimos al login.
  // En el proyecto se guarda 'SesionActiva' en localStorage cuando el usuario inicia sesión.
  const SesionActiva = localStorage.getItem('SesionActiva');
  if (!SesionActiva) {
    // No hay sesión: limpiamos y forzamos al usuario a iniciar sesión.
    console.warn('No hay sesión activa. Redirigiendo al login.');
    window.location.href = 'login.html';
    return; // detenemos ejecución
  }

  // Intentamos obtener los datos básicos del usuario desde localStorage.
  // En login.js se guardó la clave 'usuario' con un objeto { userId, nombre, email, role }.
  let perfilLocal = null;
  try {
    const raw = localStorage.getItem('usuario');
    perfilLocal = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Error parseando localStorage.usuario:', err);
    perfilLocal = null;
  }

  // Función auxiliar para mostrar mensajes al usuario en la página (mensaje breve)
  function mostrarMensaje(texto, tipo) {
    // tipo puede ser 'error' o 'success' o undefined para neutro
    if (!messageEl) {
      // Si no existe el contenedor, usamos alert como fallback
      if (tipo === 'error') alert('Error: ' + texto);
      else alert(texto);
      return;
    }

    // Limpiamos clases anteriores y aplicamos de acuerdo al tipo
    messageEl.className = '';
    messageEl.textContent = texto;
    if (tipo === 'error') {
      messageEl.classList.add('mb-4', 'text-sm', 'text-red-700', 'bg-red-50', 'px-4', 'py-3', 'rounded-lg');
    } else if (tipo === 'success') {
      messageEl.classList.add('mb-4', 'text-sm', 'text-green-700', 'bg-green-50', 'px-4', 'py-3', 'rounded-lg');
    } else {
      messageEl.classList.add('mb-4', 'text-sm', 'text-gray-700');
    }
    messageEl.classList.remove('hidden');
  }

  // Función para rellenar la UI con un objeto usuario que tenga { nombre, email, role }
  function rellenarUI(usuario) {
    if (!usuario) return;
    if (nombreEl) nombreEl.textContent = usuario.nombre || '-';
    if (emailEl) emailEl.textContent = usuario.email || '-';
    if (roleEl) roleEl.textContent = (usuario.role) ? usuario.role : 'Usuario';
    if (avatarEl) {
      // Avatar: mostramos la primera letra del nombre en mayúscula
      const inicial = (usuario.nombre && usuario.nombre.length) ? usuario.nombre.trim()[0].toUpperCase() : '?';
      avatarEl.textContent = inicial;
    }
  }

  // 1) Si tenemos datos en localStorage, los usamos inmediatamente para una carga rápida
  if (perfilLocal) {
    rellenarUI(perfilLocal);
  }

  // 2) Intentamos obtener datos actualizados del backend usando /api/perfil/obtener
  //    Este paso es opcional pero recomendable: sincroniza los datos con la base de datos.
  //    Requiere que el backend esté corriendo en http://localhost:8081 y que exista la ruta POST /api/perfil/obtener.
  if (perfilLocal && perfilLocal.email) {
    // Mostramos un mensaje de carga breve mientras pedimos al servidor
    mostrarMensaje('Cargando datos del perfil...', '');

    try {
      const respuesta = await fetch('http://localhost:8081/api/perfil/obtener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: perfilLocal.email })
      });

      const data = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        // Si el servidor responde con error, mostramos el mensaje y mantenemos lo de localStorage
        const msg = (data && data.message) ? data.message : 'No se pudieron obtener datos del servidor.';
        mostrarMensaje(msg, 'error');
        // mantenemos lo que ya se mostró desde localStorage
      } else {
        // Si todo OK, actualizamos la UI con los datos del backend
        const usuarioBackend = data && data.user ? data.user : null;
        if (usuarioBackend) {
          rellenarUI(usuarioBackend);
          // Opcional: actualizamos localStorage para mantener consistencia
          try {
            localStorage.setItem('usuario', JSON.stringify({ userId: usuarioBackend.userId, nombre: usuarioBackend.nombre, email: usuarioBackend.email, role: usuarioBackend.role }));
          } catch (err) {
            console.warn('No se pudo actualizar localStorage.usuario:', err);
          }
          mostrarMensaje('Perfil actualizado desde el servidor.', 'success');
        } else {
          mostrarMensaje('Respuesta del servidor no contiene usuario.', 'error');
        }
      }
    } catch (err) {
      // Error de red o CORS
      console.error('Error al obtener perfil desde backend:', err);
      mostrarMensaje('No se pudo conectar al servidor. Se muestran datos locales si existen.', 'error');
    }
  } else {
    // No hay email en localStorage: forzamos a login por seguridad
    if (!perfilLocal) {
      mostrarMensaje('Datos de usuario no disponibles. Redirigiendo al login...', 'error');
      setTimeout(() => { window.location.href = 'login.html'; }, 900);
      return;
    }
  }

  // === Manejo del botón de cerrar sesión en la página de perfil ===
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      // Al cerrar sesión removemos la información guardada y redirigimos a login
      localStorage.clear();
      // Pequeña UX: mostrar mensaje breve antes de redirigir
      if (messageEl) {
        messageEl.className = ''; messageEl.textContent = 'Cerrando sesión...';
        messageEl.classList.add('mb-4', 'text-sm', 'text-gray-700');
        messageEl.classList.remove('hidden');
      }
      setTimeout(function () { window.location.href = 'login.html'; }, 600);
    });
  }

  // === Manejo del botón Editar perfil (ahora permite editar y guardar cambios) ===
  if (editBtn) {
    // Estado local para saber si estamos en modo edición
    let enEdicion = false;

    editBtn.addEventListener('click', async function () {
      // Si no hay datos locales, no permitimos la edición
      if (!perfilLocal) {
        mostrarMensaje('Datos de usuario no disponibles. No se puede editar.', 'error');
        return;
      }

      // Si ya estamos en edición, el botón sirve para guardar
      if (enEdicion) {
        // Obtener valores desde los inputs generados
        const nombreInput = document.getElementById('profile-name-input');
        const emailInput = document.getElementById('profile-email-input');

        const nuevoNombre = nombreInput ? nombreInput.value.trim() : (perfilLocal.nombre || '');
        const nuevoEmail = emailInput ? emailInput.value.trim() : (perfilLocal.email || '');

        // Validaciones simples
        if (!nuevoNombre || !nuevoEmail) {
          mostrarMensaje('Nombre y correo no pueden quedar vacíos.', 'error');
          return;
        }

        // Preparar payload para actualizar en el backend
        const payload = { userId: perfilLocal.userId, nombre: nuevoNombre, email: nuevoEmail };

        try {
          // Llamada PUT al endpoint que creamos en el backend
          const res = await fetch('http://localhost:8081/api/perfil/actualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const body = await res.json().catch(() => null);

          if (!res.ok) {
            const msg = body && body.message ? body.message : 'Error al actualizar perfil.';
            mostrarMensaje(msg, 'error');
            return;
          }

          // Actualizar UI y localStorage con los datos devueltos por el backend
          const usuarioActualizado = body && body.user ? body.user : { userId: perfilLocal.userId, nombre: nuevoNombre, email: nuevoEmail, role: perfilLocal.role };

          rellenarUI(usuarioActualizado);
          try {
            localStorage.setItem('usuario', JSON.stringify({ userId: usuarioActualizado.userId, nombre: usuarioActualizado.nombre, email: usuarioActualizado.email, role: usuarioActualizado.role }));
          } catch (err) {
            console.warn('No se pudo actualizar localStorage.usuario:', err);
          }

          mostrarMensaje('Perfil actualizado con éxito.', 'success');

          // Salir de modo edición: restaurar botones y mostrar como texto
          salirModoEdicion();

        } catch (err) {
          console.error('Error al actualizar perfil:', err);
          mostrarMensaje('Error al conectar con el servidor para actualizar perfil.', 'error');
        }

        return;
      }

      // Entrar en modo edición: cambiar los campos a inputs
      enEdicion = true;
      enterModoEdicion();
      // Cambiar texto del botón a 'Guardar'
      editBtn.textContent = 'Guardar';
    });

    // Funciones auxiliares para togglear edición
    function enterModoEdicion() {
      // Reemplazar el contenido de los elementos por inputs
      if (nombreEl) {
        const val = nombreEl.textContent || '';
        nombreEl.innerHTML = `<input id="profile-name-input" class="w-full border border-gray-300 rounded px-2 py-1 text-sm" value="${escapeHtml(val)}">`;
      }
      if (emailEl) {
        const val = emailEl.textContent || '';
        emailEl.innerHTML = `<input id="profile-email-input" class="w-full border border-gray-300 rounded px-2 py-1 text-sm" value="${escapeHtml(val)}">`;
      }
      // Ocultamos el role (no editable desde aquí) o lo dejamos estático
    }

    function salirModoEdicion() {
      // Restaurar texto plano en los elementos (ya fueron actualizados por rellenarUI)
      if (nombreEl) nombreEl.textContent = nombreEl.querySelector ? (nombreEl.querySelector('input') ? nombreEl.querySelector('input').value : nombreEl.textContent) : nombreEl.textContent;
      if (emailEl) emailEl.textContent = emailEl.querySelector ? (emailEl.querySelector('input') ? emailEl.querySelector('input').value : emailEl.textContent) : emailEl.textContent;
      // Restaurar el texto del botón a 'Editar perfil'
      editBtn.textContent = 'Editar perfil';
      // Actualizamos el estado
      enEdicion = false;
    }

    // Pequeña función para escapar comillas / signos en valores imputados (prevención mínima XSS al insertar HTML)
    function escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
  }

  // === Manejo del botón Cambiar contraseña (solo feedback por ahora) ===
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', function () {
      mostrarMensaje('Función cambiar contraseña no implementada. Implementa un flujo de cambio de password en el backend.', '');
    });
  }

});
