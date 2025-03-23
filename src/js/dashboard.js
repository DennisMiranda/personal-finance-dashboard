// Imports
import { TransactionsTable } from './components/table';
import { barChart } from './components/barChart';
import { loadTransactions } from './utils/localstorage';

// Charge DOM and instance objects
document.addEventListener('DOMContentLoaded', () => {
  const transactions = loadTransactions();
  console.log(transactions);

  // Create tables
  new TransactionsTable('#table-expenses', 'Gasto');
  new TransactionsTable('#table-incomes', 'Ingreso');
});
