/**
 * Script para el control del menú móvil en Yapay Wallet.
 * Se encarga de mostrar y ocultar el menú en dispositivos móviles
 * y manejar el cambio de iconos entre el menú abierto y cerrado.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Selección de elementos del DOM
  const menuButton = document.querySelector('#menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const openIcon = document.querySelector('#menu-open');
  const closeIcon = document.querySelector('#menu-closed');

  /**
   * Función que alterna la visibilidad del menú de navegación móvil.
   */
  const toggleMenu = () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';

    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');

    // Alternar iconos del menú
    openIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  };

  // Agregar evento de clic al botón del menú para abrir o cerrar el menú móvil.
  menuButton.addEventListener('click', toggleMenu);

  /**
   * Cierra el menú cuando se hace clic en un enlace dentro del menú móvil.
   */
  document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  /**
   * Cierra el menú si el usuario hace clic fuera de él.
   */
  document.addEventListener('click', (event) => {
    if (
      !mobileMenu.classList.contains('hidden') &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      mobileMenu.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
});
