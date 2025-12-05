document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Pagina cargada correctamente - Sistema listo');

    // ==========================================
    // 🚨 GUARDIA DE SEGURIDAD 🚨
    // Evita que los usuarios logueados accedan a login.html
    // ==========================================
    const sesionActiva = localStorage.getItem('SesionActiva');

    if (sesionActiva) {
        console.log('⚠️ Usuario ya logueado. Redirigiendo a página principal.');
        window.location.href = "../pages/index.html"; 
        return; // Detenemos la ejecución del script aquí si ya hay sesión.
    }
    
    // ==========================================
    // LÓGICA DE LOGIN
    // ==========================================
    const API_URL='https://proyecto-eccomerce-wilson.onrender.com/api/login';

    document.getElementById('login-form').addEventListener('submit', async function(e){
        e.preventDefault();

        // Preparamos elementos
        const btn=document.getElementById('login-button');
        const erroDiv=document.getElementById('login-error');
        const errorMessageSpan=document.getElementById('login-error-message');

        erroDiv.classList.add('hidden'); 
        btn.disabled = true; 
        // Recopilar datos del formulario
        const datos={
            email:document.getElementById('email').value.trim(),
            password:document.getElementById('password').value.trim()
        };

        // Validar campos vacíos
        if(!datos.email||!datos.password){
            errorMessageSpan.textContent='Por favor complete todos los campos...❌';
            erroDiv.classList.remove('hidden');
            btn.disabled = false; 
            return; 
        }

        // Cambiar el botón mientras se procesa 
        const originalButtonText = btn.textContent;
        btn.textContent='Iniciando sesion...🔥';

        // Enviar los datos al servidor
        try{
            const response= await fetch(API_URL,{
                method:'POST',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify(datos)
            });

            const result= await response.json();
            
            // Manejo de respuesta exitosa (código 200-299)
            if(response.ok){ 
                console.log('Inicio de sesion exitoso (Código 2xx)🔥');

                // Guardar información de la sesión y del usuario
                localStorage.setItem('SesionActiva',"true");
                localStorage.setItem('usuario',JSON.stringify({
                    userId: result.user.userId,
                    nombre: result.user.nombre,
                    email: result.user.email,
                    role: result.user.role
                }));

                // Mostrar éxito y redirigir
                erroDiv.className="bg-green-50 border-green-400 text-green-800 px-4 py-3 rounded-lg";
                errorMessageSpan.textContent='Inicio de sesion exitoso! Redirigiendo...✅';
                setTimeout(()=>window.location.href='productos.html',1500);

            } else{
                // Manejo de errores de autenticación/servidor
                errorMessageSpan.textContent=result.message||'Error al iniciar sesion. Verifique sus credenciales❌';
                erroDiv.classList.remove('hidden');
                btn.disabled=false;
                btn.textContent=originalButtonText;
            }

        } catch (error){
            console.error('❌Error al conectar con el servidor:',error);
            errorMessageSpan.textContent='Error de conexion con el servidor. Intente mas tarde❌';
            erroDiv.classList.remove('hidden');

            // Restaurar botón
            btn.disabled=false;
            btn.textContent='Iniciar Sesion';
        }
    });
});