import { Chart } from 'chart.js';
import { TransactionProcessor } from '../utils/transactionProcesor';

export class PieChart {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chartInstance = null;
    this.type = 'Gastos';
    this.btnExpenses = document.getElementById('btn-chart-expenses');
    this.btnExpenses.classList.add('bg-red-500', 'text-white');
    this.btnIncomes = document.getElementById('btn-chart-incomes');

    this.data = { incomes: {}, expenses: {} };
  }

  // Crear gráfico dinámicamente
  renderChart(labels, datasets) {
    const ctx = document.getElementById(this.canvasId)?.getContext('2d');

    // Agregar los event listener para el cambio de tipo.
    this.watchTypeChange();

    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
          legend: { display: true },
          datalabels: {
            color: '#000',
            formatter: (value, ctx) => {
              let label = ctx.chart.data.labels[ctx.dataIndex];
              return `${label}: ${value}`;
            },
            anchor: 'center',
            align: 'center',
            font: { weight: 'bold', size: 10 },
          },
        },
      },
    });
  }

  // Cargar y procesar datos dinámicamente
  renderData(transactions, month, selectedYear) {
    try {
      console.log(transactions, this.type);

      const processor = new TransactionProcessor(transactions);
      const { incomes, expenses } = processor.getCategoriesLabelsAndValues(
        month,
        selectedYear
      );

      // Almacenar los datos procesados en las propiedades para actualizar los datos del gráfico
      // al cambiar el tipo.
      this.incomes = incomes;
      this.expenses = expenses;

      const labels =
        this.type === 'Ingresos' ? incomes.labels : expenses.labels;
      const values =
        this.type === 'Ingresos' ? incomes.values : expenses.values;

      if (this.chartInstance) {
        this.updateData(labels, values);
      } else {
        this.renderChart(labels, [{ label: this.type, data: values }]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  //Escucha boton
  watchTypeChange() {
    this.btnExpenses.addEventListener('click', () => {
      this.type = 'Gastos';
      this.updateData(this.expenses.labels, this.expenses.values);
      this.btnExpenses.classList.add('bg-red-500', 'text-white');
      this.btnIncomes.classList.remove('!bg-green-500', 'text-white');
    });
    this.btnIncomes.addEventListener('click', () => {
      this.type = 'Ingresos';
      this.updateData(this.incomes.labels, this.incomes.values);
      this.btnIncomes.classList.add('!bg-green-500', 'text-white');
      this.btnExpenses.classList.remove('bg-red-500', 'text-white');
    });
  }

  updateData(labels, values) {
    this.chartInstance.data = {
      labels: labels,
      datasets: [{ label: this.type, data: values }],
    };
    this.chartInstance.update();
  }
}
