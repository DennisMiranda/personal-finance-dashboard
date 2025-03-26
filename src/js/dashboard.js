// Imports
import { TransactionFilter } from './components/filter.js';
import { TransactionsTable } from './components/table';
import { BarChart } from './components/barChart';
import { loadTransactions } from './utils/localstorage';
import { Card } from './components/cards';

class Dashboard {
  constructor() {
    this.transactions = loadTransactions(); // Cargar transacciones almacenadas

    // Definir propiedades para manejar los componentes
    this.barChart = null;
    this.barChartOptions = {};
    this.tableExpenses = null;
    this.tableIncomes = null;
  }

  // Filtrar transacciones por año y mes (opcional)
  filterByDate(year, month = null) {
    return this.transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      const isSameYear = date.getFullYear() === parseInt(year);
      if (month) {
        const isSameMonth =
          String(date.getMonth() + 1).padStart(2, '0') === month;

        return isSameYear && isSameMonth;
      }
      return isSameYear;
    });
  }

  createCards(transactions) {
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
  }

  createTables(transactions) {
    // Renderizar las tablas con los datos filtrados
    this.tableExpenses = new TransactionsTable(
      '#table-expenses',
      'Gasto',
      transactions
    );
    this.tableExpenses.show();

    this.tableIncomes = new TransactionsTable(
      '#table-incomes',
      'Ingreso',
      transactions
    );
    this.tableIncomes.show();
  }

  createCharts(transactions, currentYear) {
    // Inicializar las opciones del gráfico de barras
    this.barChartOptions = {
      labels: Array.from({ length: 12 }, (_, i) =>
        String(i + 1).padStart(2, '0')
      ),
      datasetConfig: [
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
    };

    this.barChart = new BarChart('cash-flow-chart');
    this.barChart.renderData(
      transactions,
      this.barChartOptions.labels,
      this.barChartOptions.datasetConfig,
      currentYear
    );
  }

  createComponents(month, year) {
    const yearlyTransactions = this.filterByDate(year);
    this.createCharts(yearlyTransactions, year);

    const monthlyTransactions = this.filterByDate(year, month);
    this.createCards(monthlyTransactions);
    this.createTables(monthlyTransactions);
  }

  updateComponents(month, year) {
    const yearlyTransactions = this.filterByDate(year);
    // Actualizar cards
    // Actualizar gráficos
    this.barChart.renderData(
      yearlyTransactions,
      this.barChartOptions.labels,
      this.barChartOptions.datasetConfig,
      year
    );

    const monthlyTransactions = this.filterByDate(year, month);
    // Actualizar tablas
    this.tableExpenses.update(monthlyTransactions);
    this.tableIncomes.update(monthlyTransactions);
  }

  // Iniciar dashboard y escuchar eventos de filtro
  init() {
    // Inicializar el filtro de fechas
    const transactionFilter = new TransactionFilter();
    transactionFilter.initDateSelectors();

    // Escuchar cambios en los filtros
    document.addEventListener('filterChanged', (event) => {
      const { month, year } = event.detail;

      this.updateComponents(month, year);
    });

    this.createComponents(
      transactionFilter.currentMonth,
      transactionFilter.currentYear
    );
  }
}

// Iniciar el dashboard
const dashboard = new Dashboard();
dashboard.init();

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
