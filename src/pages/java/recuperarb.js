// ✅ CORREGIDO: Leer 'correo' que es lo que enviamos desde recuperara.js
const params = new URLSearchParams(window.location.search);
const correo = params.get("correo");

if (!correo) {
    alert("No se recibió el correo. Debes iniciar el proceso nuevamente.");
    window.location.href = "recuperarA.html";
}

// Variable para prevenir envíos múltiples
let enviando = false;

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔒 Prevenir envíos múltiples
    if (enviando) return;
    enviando = true;

    const codigo = document.getElementById("codigo").value;
    const password = document.getElementById("password").value;
    const passwordver = document.getElementById("passwordver").value;
    const boton = document.getElementById("login-btn");
    
    // 🔍 DEBUG: Ver qué se envía
    console.log('📤 Enviando:', { correo, codigo, password: '***' });

    // Validar que las contraseñas coincidan
    if (password !== passwordver) {
        const errorBox = document.getElementById("login-error");
        document.getElementById("login-error-message").textContent =
            "Las contraseñas no coinciden";
        errorBox.classList.remove("hidden");
        enviando = false;
        return;
    }

    // Deshabilitar botón
    boton.disabled = true;
    boton.textContent = "Cambiando contraseña...";

    try {
        const response = await fetch("http://localhost:8081/api/Recuperar/cambiar-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: correo,
                codigo,
                nuevaPassword: password
            })
        });

        const data = await response.json();
        
        // 🔍 DEBUG: Ver respuesta
        console.log('📥 Respuesta:', { status: response.status, data });

        if (response.ok) {
            alert("Contraseña actualizada correctamente");
            window.location.href = "login.html";
        } else {
            const errorBox = document.getElementById("login-error");
            document.getElementById("login-error-message").textContent = data.message;
            errorBox.classList.remove("hidden");
            
            // Rehabilitar para reintentar
            boton.disabled = false;
            boton.textContent = "Continuar";
            enviando = false;
        }
    } catch (error) {
        console.error("Error:", error);
        const errorBox = document.getElementById("login-error");
        document.getElementById("login-error-message").textContent = "Error de conexión con el servidor";
        errorBox.classList.remove("hidden");
        
        // Rehabilitar para reintentar
        boton.disabled = false;
        boton.textContent = "Continuar";
        enviando = false;
    }
});