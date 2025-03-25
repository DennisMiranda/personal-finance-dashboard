// filter.js
import { loadTransactions } from '../utils/localstorage.js';
import { TransactionsTable } from './table.js';

export class TransactionFilter {
  constructor() {
    this.transactions = loadTransactions() || [];
    console.log('Transacciones cargadas:', this.transactions); // ← Depuración aquí
    this.currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    this.currentYear = new Date().getFullYear();
  }

  // Filtrar transacciones por mes y año
  filterByDate(month, year) {
    return this.transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return (
        String(date.getMonth() + 1).padStart(2, '0') === month &&
        date.getFullYear() === parseInt(year)
      );
    });
  }

  // Actualizar tablas con transacciones filtradas
  updateTables(month, year) {
    const filteredTransactions = this.filterByDate(month, year);
    console.log('Transacciones filtradas:', filteredTransactions); // ← Depuración

    // Limpiar contenedores antes de renderizar
    document.querySelector('#table-expenses').innerHTML = '';
    document.querySelector('#table-incomes').innerHTML = '';

    // Renderizar tablas
    new TransactionsTable(
      '#table-expenses',
      'Gasto',
      filteredTransactions
    ).show();
    new TransactionsTable(
      '#table-incomes',
      'Ingreso',
      filteredTransactions
    ).show();
  }

  // Inicializar event listeners para los selectores
  initDateSelectors() {
    const selectMonth = document.getElementById('select-month');
    const selectYear = document.getElementById('select-year');

    // Setear valores iniciales (mes/año actual)
    selectMonth.value = this.currentMonth;
    selectYear.value = this.currentYear;

    // Event listeners
    selectMonth.addEventListener('change', () => {
      this.updateTables(selectMonth.value, selectYear.value);
    });

    selectYear.addEventListener('change', () => {
      this.updateTables(selectMonth.value, selectYear.value);
    });

    // Cargar datos iniciales
    this.updateTables(this.currentMonth, this.currentYear);
  }
}
