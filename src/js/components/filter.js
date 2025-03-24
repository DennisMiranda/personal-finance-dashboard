import { loadTransactions } from '../utils/localstorage.js';
import { TransactionsTable } from '../components/table.js';

// Obtener referencias a los selectores de mes y año
const monthSelector = document.getElementById('month-selector');
const yearSelector = document.getElementById('year-selector');

// Función para limpiar las tablas antes de mostrar nuevos datos
function clearTables() {
  document.getElementById('table-expenses').innerHTML = '';
  document.getElementById('table-incomes').innerHTML = '';
}

// Función para filtrar transacciones según el mes y año seleccionados
function filterTransactionsByDate(transactions, selectedMonth, selectedYear) {
  return transactions.filter((transaction) => {
    // Convertir la fecha de la transacción en un objeto Date
    let transactionDate = new Date(transaction.date);

    // Verificar si la fecha es válida
    if (isNaN(transactionDate)) {
      console.warn('Fecha inválida encontrada:', transaction.date);
      return false;
    }

    // Extraer correctamente el mes y año de la fecha
    let transactionMonth = String(transactionDate.getMonth() + 1).padStart(
      2,
      '0'
    ); // Ajustar meses (0-11 en JS)
    let transactionYear = String(transactionDate.getFullYear());

    // Depuración: Ver qué datos se están filtrando
    console.log(
      `Filtrando: ${selectedYear}-${selectedMonth}, Transacción: ${transaction.date} -> ${transactionMonth}-${transactionYear}`
    );

    return (
      transactionMonth === selectedMonth && transactionYear === selectedYear
    );
  });
}

// Función para actualizar las tablas de ingresos y gastos
function updateTables() {
  const selectedMonth = monthSelector.value;
  const selectedYear = yearSelector.value;
  const allTransactions = loadTransactions();

  const filteredTransactions = filterTransactionsByDate(
    allTransactions,
    selectedMonth,
    selectedYear
  );

  // Limpiar las tablas antes de agregar nuevas filas
  clearTables();

  // Crear y mostrar las tablas con los datos filtrados
  const tableExpenses = new TransactionsTable(
    '#table-expenses',
    'Gasto',
    filteredTransactions
  );
  const tableIncomes = new TransactionsTable(
    '#table-incomes',
    'Ingreso',
    filteredTransactions
  );

  tableExpenses.show();
  tableIncomes.show();
}

// Agregar eventos para detectar cambios en los selectores
monthSelector.addEventListener('change', updateTables);
yearSelector.addEventListener('change', updateTables);

// Cargar los datos iniciales cuando la página carga
document.addEventListener('DOMContentLoaded', updateTables);
