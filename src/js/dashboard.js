// Imports
import { TransactionsTable } from './components/table';
import { BarChart } from './components/barChart';
import { loadTransactions } from './utils/localstorage';
import { Card } from './components/cards';

// Charge DOM and instance objects
document.addEventListener('DOMContentLoaded', () => {
  const transactions = loadTransactions() || [];

  // Create Cards
  const cardContainerId = 'cards-container';
  const moreIcon = 'fa-solid fa-ellipsis-vertical';
  const cards = [
    {
      icons: ['fa-solid fa-wallet', moreIcon],
      title: 'Total',
      amount: 0,
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-money-bill-trend-up', moreIcon],
      title: 'Ingresos',
      amount: 0,
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-sack-xmark', moreIcon],
      title: 'Gastos',
      amount: 0,
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-piggy-bank', moreIcon],
      title: 'Ahorro',
      amount: 0,
      indicator: 1.2,
    },
  ];

  for (const card of cards) {
    const { icons, title, amount, indicator } = card;
    new Card(cardContainerId, icons, title, amount, indicator);
  }

  // Create tables
  const tableExpenses = new TransactionsTable(
    '#table-expenses',
    'Gasto',
    transactions
  );
  const tableIncomes = new TransactionsTable(
    '#table-incomes',
    'Ingreso',
    transactions
  );

  tableExpenses.show();
  tableIncomes.show();

  // Create BarChart
  const currentYear = new Date().getFullYear(); // Año actual dinámico
  const labels = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  const datasetConfig = [
    {
      label: 'Gastos',
      type: 'Gasto',
      color: 'rgba(213, 213, 247, 1)',
      borderRadius: 3,
    },
    {
      label: 'Ingresos',
      type: 'Ingreso',
      color: 'rgba(47, 44, 216, 1)',
      borderRadius: 3,
    },
  ];

  const barChart = new BarChart('cash-flow-chart');
  barChart.renderData(transactions, labels, datasetConfig, currentYear);
});
