// Imports
import { BarChart } from './components/barChart';
import { Card } from './components/cards';
import { TransactionFilter } from './components/filter.js';
import { TransactionsTable } from './components/table';
import {
  getAmountsAndIndicators,
  getBalanceByYearMonth,
} from './utils/cardAmounts.js';
import { loadTransactions, getUserData } from './utils/localstorage';
import { sidebar } from './components/sidebar.js';
import { PieChart } from './components/pieChart.js';
import { SidebarToggle } from './components/sidebar.js';

class Dashboard {
  constructor() {
    this.transactions = loadTransactions(); // Cargar transacciones almacenadas
    // Propiedad que almacena los balances por año y mes
    this.balanceByYearMonth = [];

    // Definir propiedades para manejar los componentes
    this.cards = [];

    this.barChart = null;
    this.barChartOptions = {};
    this.pieChart = null;
    this.pieChartOptions = {};

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

  createCards(month, year) {
    const cardContainerId = 'cards-container';
    const moreIcon = 'fa-solid fa-ellipsis-vertical';

    const { amounts, indicators } = getAmountsAndIndicators(
      this.balanceByYearMonth,
      month,
      year
    );

    const cards = [
      {
        id: 'totalBalance',
        icons: ['fa-solid fa-wallet', moreIcon],
        title: 'Saldo Actual',
        amount: amounts[0],
        indicator: indicators[0],
      },
      {
        id: 'monthlyInconme',
        icons: ['fa-solid fa-money-bill-trend-up', moreIcon],
        title: 'Ingreso mensual',
        amount: amounts[1],
        indicator: indicators[1],
      },
      {
        id: 'monthlyExpense',
        icons: ['fa-solid fa-sack-xmark', moreIcon],
        title: 'Gasto mensual',
        amount: amounts[2],
        indicator: indicators[2],
      },
      {
        id: 'monthlySavings',
        icons: ['fa-solid fa-piggy-bank', moreIcon],
        title: 'Ahorro mensual',
        amount: amounts[3],
        indicator: indicators[3],
      },
      {
        id: 'previousBalance',
        icons: ['fa-solid fa-history', moreIcon],
        title: 'Saldo anterior',
        amount: amounts[4],
        indicator: null,
      },
      ,
    ];

    cards.forEach((card) => {
      const newCard = new Card(
        cardContainerId,
        card.id,
        card.icons,
        card.title,
        card.amount,
        card.indicator
      );

      newCard.init();
      this.cards.push(newCard);
    });
  }

  createTables(transactions) {
    // Renderizar las tablas con los datos filtrados
    this.tableExpenses = new TransactionsTable(
      'table-expenses',
      'Gasto',
      transactions
    );
    this.tableExpenses.show();

    this.tableIncomes = new TransactionsTable(
      'table-incomes',
      'Ingreso',
      transactions
    );
    this.tableIncomes.show();
  }

  createCharts(transactions, month, year) {
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
      year
    );

    this.pieChart = new PieChart('cash-flow-pie-chart');
    this.pieChart.renderData(this.balanceByYearMonth, month, year);
  }

  createComponents(month, year) {
    const yearlyTransactions = this.filterByDate(year);
    const monthlyTransactions = this.filterByDate(year, month);

    this.createCards(month, year);
    this.createCharts(yearlyTransactions, month, year);
    this.createTables(monthlyTransactions);
  }

  updateComponents(month, year) {
    const yearlyTransactions = this.filterByDate(year);
    const monthlyTransactions = this.filterByDate(year, month);

    // Actualizar cards
    const { amounts, indicators } = getAmountsAndIndicators(
      this.balanceByYearMonth,
      month,
      year
    );

    amounts.forEach((amount, i) => {
      this.cards[i].update(amount, indicators[i]);
    });

    // Actualizar gráficos
    this.barChart.renderData(
      yearlyTransactions,
      this.barChartOptions.labels,
      this.barChartOptions.datasetConfig,
      year
    );

    this.pieChart.renderData(this.balanceByYearMonth, month, year);

    // Actualizar tablas
    this.tableExpenses.update(monthlyTransactions);
    this.tableIncomes.update(monthlyTransactions);
  }

  // Iniciar dashboard y escuchar eventos de filtro
  init() {
    const { username, email } = getUserData();
    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;

    // Inicializar el filtro de fechas
    const transactionFilter = new TransactionFilter();
    transactionFilter.initDateSelectors();

    this.balanceByYearMonth = getBalanceByYearMonth(this.transactions);

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
