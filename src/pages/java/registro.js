// Comentarios EXPLICATIVOS para un dev junior: explicación línea a línea y por secciones.
// Lee estos comentarios con calma. Cada bloque tiene una explicación sencilla de "qué hace" y "por qué".
// IMPORTANT: No se cambia la lógica, solo se añaden comentarios para aprendizaje.

document.addEventListener('DOMContentLoaded', function() {
    // ¿Qué significa esto? -> Esperamos a que todo el HTML esté cargado antes de ejecutar el código.
    // Por qué: Si intentamos acceder a elementos del DOM antes de que existan (por ejemplo el formulario), obtendremos null y fallará el script.
    console.log('✅ Página de Registro cargada correctamente - Sistema listo');

    // ==========================================
    // 🚨 GUARDIA DE SESIÓN (prevención de acceso innecesario)
    // ==========================================
    // Línea: obtenemos si hay una clave en localStorage que indica sesión activa.
    // localStorage es un almacenamiento simple en el navegador que persiste entre recargas.
    const sesionActiva = localStorage.getItem('SesionActiva');

    // Si sesionActiva tiene algún valor (no es null), suponemos que el usuario ya está logueado.
    // Por qué: No queremos que alguien logueado cree otra cuenta en la misma sesión; se redirige a la página principal.
    if (sesionActiva) {
        console.log('⚠️ Usuario ya logueado. Redirigiendo a página principal.');
        // Redirigir con window.location.href cambia la URL del navegador y carga otra página.
        window.location.href = 'index.html';
        return; // Salimos para que el resto del script no se ejecute.
    }

    // ==========================================
    // REFERENCIAS A ELEMENTOS DEL DOM
    // ==========================================
    // Aquí buscamos los elementos del HTML por su id. Si no existen, getElementById devuelve null.
    const form = document.getElementById('registration-form');
    // Contenedores opcionales para mostrar mensajes al usuario (pueden no existir en el HTML).
    const statusDiv = document.getElementById('registration-status');
    const errorMessageSpan = document.getElementById('registration-error-message');

    // Comprobación rápida: si no existe el formulario, no hacemos nada (evita errores en consola).
    if (!form) {
        console.warn('🙈No se encontró el formulario de registro (id="registration-form"). Nada que hacer.');
        return; // Salimos del listener DOMContentLoaded.
    }

    // ==========================================
    // EVENTO: envío del formulario
    // ==========================================
    // Añadimos un listener al evento 'submit' del formulario. Este se ejecuta cuando el usuario presiona el botón de submit.
    form.addEventListener('submit', async (e) => {
        // e.preventDefault() impide que el formulario haga su comportamiento por defecto (recargar la página).
        e.preventDefault();

        // Referencia al botón de registro para deshabilitarlo mientras se procesa.
        const btn = document.getElementById('register-button');
        // Guardamos el texto anterior del botón para poder restaurarlo luego.
        const prevBtnText = btn ? btn.textContent : null;

        // Ocultamos cualquier mensaje anterior y protegemos al usuario de envíos repetidos
        if (statusDiv) statusDiv.classList.add('hidden');
        if (btn) {
            btn.disabled = true; // bloquea el botón para evitar clicks múltiples
            btn.textContent = 'Registrando...'; // feedback visual
        }

        // ===== Obtención de los inputs del formulario =====
        // Es importante validar que existan antes de leer sus valores.
        const nombreInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        // Si alguno falta, mostramos error y restauramos el botón.
        if (!nombreInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            mostrarError('Error interno: elementos del formulario no encontrados.');
            restaurarBoton();
            return;
        }

        // ===== Lectura de valores =====
        // .value lee el valor actual del input; .trim() elimina espacios al inicio y final.
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // ===== Validaciones básicas en el cliente =====
        // Verificamos campos vacíos.
        if (!nombre || !email || !password || !confirmPassword) {
            // Mostrar un mensaje amigable y marcar visualmente los inputs erróneos.
            mostrarError('Por favor complete todos los campos❌');
            marcarCamposErroneos([nombreInput, emailInput, passwordInput, confirmPasswordInput]);
            restaurarBoton();
            return; // detener ejecución porque falta información
        }

        // Comprobamos que la contraseña y su confirmación coincidan.
        if (password !== confirmPassword) {
            mostrarError('Las contraseñas no coinciden.');
            marcarCamposErroneos([passwordInput, confirmPasswordInput]);
            restaurarBoton();
            return;
        }

        // ==========================================
        // Generar userId en el cliente (simulación)
        // ==========================================
        // Intentamos usar crypto.randomUUID() si está disponible (genera un UUID seguro). Si no, usamos un fallback.
        let newUserId = null;
        try {
            newUserId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : null;
        } catch (err) {
            newUserId = null; // si falla por cualquier razón, no interrumpe el flujo
        }
        if (!newUserId) {
            // Fallback simple: 'u-' + timestamp + aleatorio
            // No es tan seguro ni único como un UUID, pero sirve para identificar localmente al usuario.
            newUserId = 'u-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        }

        // Payload que se envía al servidor. IMPORTANTE: aquí aún tenemos la contraseña en texto plano,
        // pero el backend debe recibirla y hashearla antes de guardarla en la base de datos (ver backend).
        const payload = { userId: newUserId, nombre, email, password };

        // ==========================================
        // Enviar datos al backend (ruta /api/users)
        // ==========================================
        try {
            // Hacemos la llamada fetch a https://proyecto-eccomerce-wilson.onrender.com/api/users que está definida en el backend.
            // La petición es POST y mandamos JSON. El backend se encargará de validar, hashear contraseña y guardar en DB.
            let serverResponse = null;
            try {
                const res = await fetch('https://proyecto-eccomerce-wilson.onrender.com/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: newUserId, nombre, email, password })
                });

                // Si el servidor responde con status >= 400 (no ok), intentamos leer el mensaje y lanzar error.
                if (!res.ok) {
                    // Intentamos parsear el body de error, si no se puede usamos texto genérico.
                    const errBody = await res.json().catch(() => null);
                    const errMsg = errBody && errBody.message ? errBody.message : res.statusText || 'Error en el servidor';
                    throw new Error(errMsg);
                }

                // Si todo fue ok, parseamos la respuesta JSON (si es que el backend devuelve algo útil).
                serverResponse = await res.json().catch(() => null);

                // Guardado local opcional: solo datos no sensibles. Esto ayuda a la UX (ej. mostrar nombre tras registro).
                // NO debe guardarse la contraseña en localStorage en producción.
                try {
                    localStorage.setItem('registeredUser', JSON.stringify({ userId: newUserId, nombre, email }));
                } catch (err) {
                    // Si falla localStorage (modo privado o bloqueo), es solo una advertencia.
                    console.warn('No se pudo guardar en localStorage:', err);
                }
            } catch (err) {
                // Si la petición falla por red o el backend respondió con error, avisamos y restauramos el botón.
                mostrarError('Error al comunicarse con el servidor: ' + (err.message || 'Error desconocido'));
                restaurarBoton();
                return; // detenemos ejecución porque no se pudo registrar en backend
            }

            // ===== Mostrar mensaje de éxito =====
            // Si en el HTML existe un contenedor para mensajes, usamos estilos bonitos; si no, usamos alert() como fallback.
            if (statusDiv && errorMessageSpan) {
                statusDiv.className = 'mt-4 px-4 py-3 rounded-lg text-sm font-medium text-center bg-green-100 border border-green-400 text-green-700';
                errorMessageSpan.textContent = 'Registro exitoso ✅';
                statusDiv.classList.remove('hidden');
            } else {
                alert('Registro exitoso ✅');
            }

            // Redirigimos a login.html después de un pequeño retraso para que el usuario vea el mensaje.
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 700);

        } catch (err) {
            // Captura general: debería raramente ejecutarse aquí porque errores específicos se manejan arriba.
            console.error('Error durante el registro:', err);
            mostrarError('Ocurrió un error al registrar. Intente nuevamente.');
            restaurarBoton();
        }

        // ==========================================
        // HELPERS: funciones auxiliares pequeñas y reutilizables
        // Explicación: las definimos dentro del listener para que accedan a las variables locales (btn, statusDiv, etc.).
        // ==========================================

        // mostrarError: recibe un mensaje (string) y lo muestra al usuario.
        // - Si existe statusDiv + errorMessageSpan en el HTML, usamos ese contenedor (mejor UX).
        // - Si no existe, usamos alert() para no dejar al usuario sin feedback.
        function mostrarError(mensaje) {
            if (statusDiv && errorMessageSpan) {
                // Cambiamos la clase para aplicar estilos de alerta (fondo rojo claro, borde, texto rojo oscuro).
                statusDiv.className = 'mt-4 px-4 py-3 rounded-lg text-sm font-medium text-center bg-red-100 border border-red-400 text-red-700';
                // Ponemos el mensaje dentro del span que será visible para el usuario.
                errorMessageSpan.textContent = mensaje;
                // Nos aseguramos que el div no esté oculto.
                statusDiv.classList.remove('hidden');
            } else {
                // Fallback: si no hay contenedor, usamos alert (no ideal, pero funcional).
                alert(mensaje);
            }
        }

        // restaurarBoton: vuelve a habilitar el botón y restaura su texto original.
        function restaurarBoton() {
            if (btn) {
                btn.disabled = false;
                // Si prevBtnText existe, lo usamos; si no, ponemos un texto por defecto.
                btn.textContent = prevBtnText || 'Registrar';
            }
        }

        // marcarCamposErroneos: añade un borde rojo a los inputs para indicar error y lo quita después.
        // Esto es solo feedback visual temporal.
        function marcarCamposErroneos(inputs) {
            inputs.forEach(i => {
                if (!i) return; // seguridad por si algún elemento no existe
                i.classList.add('border-red-500'); // Tailwind: borde rojo
                // Quitamos la marca al cabo de 2.5 segundos para que el usuario pueda ver la señal.
                setTimeout(() => i.classList.remove('border-red-500'), 2500);
            });
        }
    });
});
