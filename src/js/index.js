/**
 * Script para el control del menú móvil en Yapay Wallet.
 * Se encarga de mostrar y ocultar el menú en dispositivos móviles
 * y manejar el cambio de iconos entre el menú abierto y cerrado.
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Botón de activación/desactivación del menú móvil
   * @type {HTMLElement}
   */
  const menuButton = document.querySelector('#menu-toggle');

  /**
   * Menú desplegable en dispositivos móviles.
   * @type {HTMLElement}
   */
  const mobileMenu = document.querySelector('#mobile-menu');

  /**
   * Iconos de apertura y cierre del menú.
   * @type {HTMLElement}
   */
  const [openIcon, closeIcon] = [
    document.querySelector('#menu-open'),
    document.querySelector('#menu-closed'),
  ];

  /**
   * Función que alterna la visibilidad del menú de navegación móvil.
   */
  const toggleMenu = () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');
    openIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  };

  // Agrega evento de clic al botón del menú para abrir o cerrar el menú móvil.
  menuButton.addEventListener('click', toggleMenu);

  /**
   * Selecciona todos los enlaces dentro del menú móvil y les asigna un evento de clic.
   * Al hacer clic en un enlace, se oculta el menú móvil y se restablecen los iconos del botón.
   */
  document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // Agrega el evento click al botón de menú para alternar el estado del menú móvil.
  menuButton.addEventListener('click', toggleMenu);
});
