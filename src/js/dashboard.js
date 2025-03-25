// dashboard.js
import { TransactionFilter } from './components/filter.js';
import { BarChart } from './components/barChart.js';
import { Card } from './components/cards.js';
import { loadTransactions } from './utils/localstorage.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el filtro de fechas y tablas
  const transactionFilter = new TransactionFilter();
  transactionFilter.initDateSelectors();

  // Cargar transacciones para gráficos y tarjetas (sin filtrar por fecha)
  const transactions = loadTransactions() || [];
  const currentYear = new Date().getFullYear();
  const labels = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  // =====================================
  // 1. Inicializar Tarjetas (Cards)
  // =====================================
  const cardContainerId = 'cards-container';
  const moreIcon = 'fa-solid fa-ellipsis-vertical';
  const cards = [
    {
      icons: ['fa-solid fa-wallet', moreIcon],
      title: 'Total',
      amount: calculateTotalBalance(transactions),
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-money-bill-trend-up', moreIcon],
      title: 'Ingresos',
      amount: calculateTotalByType(transactions, 'Ingreso'),
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-sack-xmark', moreIcon],
      title: 'Gastos',
      amount: calculateTotalByType(transactions, 'Gasto'),
      indicator: 1.2,
    },
    {
      icons: ['fa-solid fa-piggy-bank', moreIcon],
      title: 'Ahorro',
      amount: calculateSavings(transactions),
      indicator: 1.2,
    },
  ];

  cards.forEach((card) => {
    new Card(
      cardContainerId,
      card.icons,
      card.title,
      card.amount,
      card.indicator
    );
  });

  // =====================================
  // 2. Inicializar Gráfico de Barras
  // =====================================
  const barChart = new BarChart('cash-flow-chart');
  barChart.renderData(
    transactions,
    labels,
    [
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
    ],
    currentYear
  );
});

// =====================================
// Funciones auxiliares para cálculos
// =====================================
function calculateTotalBalance(transactions) {
  const incomes = transactions
    .filter((t) => t.type === 'Ingreso')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.type === 'Gasto')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  return incomes - expenses;
}

function calculateTotalByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

function calculateSavings(transactions) {
  // Lógica personalizada para ahorros (ej: 10% de ingresos)
  const totalIncomes = calculateTotalByType(transactions, 'Ingreso');
  return totalIncomes * 0.1; // 10% de ahorro
}
