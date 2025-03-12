document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rePassword = document.getElementById('re-password').value;
    const checkTerm = document.getElementById('checkTerm').checked;

    // Validar si el email ya está registrado
    if (localStorage.getItem(email)) {
      alert('El correo electrónico ya está registrado.');
      return;
    }

    // Validar que la contraseña tenga al menos un número y una mayúscula
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'La contraseña debe tener al menos una mayúscula, un número y 6 caracteres.'
      );
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== rePassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Validar que se aceptaron los términos y condiciones
    if (!checkTerm) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    // Cifrar la contraseña antes de almacenarla
    const encryptedPassword = btoa(password); // Base64 (simple, pero útil para evitar texto plano)

    // Guardar datos en LocalStorage
    const userData = {
      username: username,
      email: email,
      password: encryptedPassword,
    };

    localStorage.setItem(email, JSON.stringify(userData));

    alert('Registro exitoso. Redirigiendo al inicio de sesión...');
    window.location.href = '/src/pages/login.html';
  });
});
