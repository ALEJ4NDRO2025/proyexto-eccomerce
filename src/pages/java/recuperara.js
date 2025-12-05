// Variable para prevenir envíos múltiples
let enviando = false;

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔒 Prevenir envíos múltiples
    if (enviando) return;
    enviando = true;

    const correo = document.getElementById("emailveri").value;
    const boton = document.getElementById("login-btn");
    
    // Deshabilitar botón
    boton.disabled = true;
    boton.textContent = "Enviando...";

    try {
        const response = await fetch("https://proyecto-eccomerce-wilson.onrender.com/api/Recuperar/solicitar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: correo })
        });

        const data = await response.json();

        if (response.ok) {
            // Pasamos el correo a recuperarB
            window.location.href = `recuperarB.html?correo=${encodeURIComponent(correo)}`;
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