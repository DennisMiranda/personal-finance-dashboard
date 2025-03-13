document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  //Mostrar y ocultar contraseña
  const inputPass = document.getElementById('password');
  const eyePass = document.getElementById('eye');
  eyePass.addEventListener('click', function () {
    if (inputPass.type == 'password') {
      inputPass.type = 'text';
      eyePass.style.opacity = 1;
    } else {
      inputPass.type = 'password';
      eyePass.style.opacity = 0.2;
    }
  });

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberPass = document.getElementById('rememberPass').checked;

    // Verificar si el correo está registrado
    const storedUser = localStorage.getItem(email);
    if (!storedUser) {
      alert('Correo no registrado.');
      return;
    }

    const userData = JSON.parse(storedUser);
    const storedPassword = atob(userData.password); // Desencriptar la contraseña

    // Verificar que la contraseña sea correcta
    if (password !== storedPassword) {
      alert('Contraseña incorrecta.');
      return;
    }

    // Guardar sesión del usuario
    sessionStorage.setItem('loggedUser', email);

    // Si "Recordar contraseña" está activado, guardar en localStorage
    if (rememberPass) {
      localStorage.setItem('rememberedUser', email);
    } else {
      localStorage.removeItem('rememberedUser');
    }

    alert('Inicio de sesión exitoso. Redirigiendo al dashboard...');
    window.location.href = '../pages/dashboard.html';
  });

  // Comprobar si hay un usuario recordado y rellenar el campo email
  const rememberedUser = localStorage.getItem('rememberedUser');
  if (rememberedUser) {
    document.getElementById('email').value = rememberedUser;
    document.getElementById('rememberPass').checked = true;
  }
});
