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
    const newExpandedState = !isExpanded;

    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');
    mobileMenu.setAttribute('aria-hidden', String(!newExpandedState));

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
      mobileMenu.setAttribute('aria-hidden', 'true');
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

  /**
   * Funcionalidad del Slider de testimonios
   */
  const slider = document.querySelector('#testimonial-slider div');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let index = 0;

  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener('click', () => {
    index = index > 0 ? index - 1 : 2;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    index = index < 2 ? index + 1 : 0;
    updateSlider();
  });

  // Cambio automático cada 5 segundos
  setInterval(() => {
    index = index < 2 ? index + 1 : 0;
    updateSlider();
  }, 5000);
});
