import { Chart } from 'chart.js';
import { TransactionProcessor } from '../utils/transactionProcesor';

export class PieChart {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chartInstance = null;
    this.type = 'Ingresos';
  }

  // Crear gráfico dinámicamente
  renderChart(labels, datasets) {
    const ctx = document.getElementById(this.canvasId)?.getContext('2d');

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
      console.log(transactions);

      const processor = new TransactionProcessor(transactions);
      const { incomes, expenses } = processor.getCategoriesLabelsAndValues(
        month,
        selectedYear
      );

      const labels =
        this.type === 'Ingresos' ? incomes.labels : expenses.labels;
      const values =
        this.type === 'Ingresos' ? incomes.values : expenses.values;

      if (this.chartInstance) {
        this.chartInstance.data = {
          labels: labels,
          datasets: [{ label: this.type, data: values }],
        };
        this.chartInstance.update();
      } else {
        this.renderChart(labels, [{ label: this.type, data: values }]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }
}
