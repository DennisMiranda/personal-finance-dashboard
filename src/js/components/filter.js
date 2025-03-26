export class TransactionFilter {
  constructor() {
    this.currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    this.currentYear = new Date().getFullYear();
  }

  // Inicializar event listeners para los selectores
  initDateSelectors() {
    const selectMonth = document.getElementById('select-month');
    const selectYear = document.getElementById('select-year');

    // Generar meses (1-12)
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    months.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = String(index + 1).padStart(2, '0');
      option.textContent = month;
      selectMonth.appendChild(option);
    });

    // Generar años
    const currentYear = new Date().getFullYear();
    for (let year = 2024; year <= currentYear + 2; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      selectYear.appendChild(option);
    }

    // Seleccionar mes/año actual por defecto
    selectMonth.value = this.currentMonth;
    selectYear.value = this.currentYear;

    // Disparar eventos cuando cambian los filtros
    [selectMonth, selectYear].forEach((element) => {
      element.addEventListener('change', () => {
        document.dispatchEvent(
          new CustomEvent('filterChanged', {
            detail: {
              month: selectMonth.value,
              year: selectYear.value,
            },
          })
        );
      });
    });
  }
}
