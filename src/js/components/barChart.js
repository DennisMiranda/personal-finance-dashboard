import Chart from 'chart.js/auto';
import { TransactionProcessor } from '../utils/transactionProcesor';

// Clase para manejar el gráfico de barras
export class BarChart {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chartInstance = null;
  }

  // Crear gráfico dinámicamente
  renderChart(labels, datasets) {
    const ctx = document.getElementById(this.canvasId)?.getContext('2d');

    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
      },
    });
  }

  // Cargar y procesar datos dinámicamente
  renderData(transactions, labels, datasetConfig, selectedYear) {
    try {
      const processor = new TransactionProcessor(transactions);

      // Crear datasets dinámicamente
      const datasets = datasetConfig.map(
        ({ label, type, color, borderRadius }) => ({
          label,
          data: processor.getProcessedData(type, selectedYear),
          backgroundColor: color,
          borderRadius,
        })
      );

      if (this.chartInstance) {
        this.chartInstance.data = { labels, datasets };
        this.chartInstance.update();
      } else {
        this.renderChart(labels, datasets);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }
}
