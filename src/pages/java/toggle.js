//funcion visibilidad del ojito

document.getElementById('toggle-password').addEventListener('click',function() {
    const passwordInput=document.getElementById('password');
    const eyeOpen=document.getElementById('eye-icon-open');
    const eyeClosed=document.getElementById('eye-icon-closed');

    //Verificar si la contraseña esta oculta

    const isHidden=passwordInput.type==='password';

    //cambiar el password a texto

    passwordInput.type=isHidden?'text':'password';

    //alternar iconos del ojo

    eyeOpen.classList.toggle('hidden',!isHidden);
    eyeClosed.classList.toggle('hidden',isHidden);
    
}); 