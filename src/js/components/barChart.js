import Chart from 'chart.js/auto';

class TransactionProcessor {
  constructor(transactions) {
    this.transactions = transactions;
  }

  // Extraer el mes y año
  static getMonthYearFromDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  // Filtrar por tipo, mes y año para obtener el monto mensual
  filterByTypeAndMonth(type, selectedYear) {
    return this.transactions.reduce((accumulator, transaction) => {
      const monthYear = TransactionProcessor.getMonthYearFromDate(
        transaction['Fecha']
      );
      const amount = transaction['Monto'];

      if (!monthYear.startsWith(selectedYear)) return accumulator; // Filtrar solo el año deseado

      if (!accumulator[monthYear]) accumulator[monthYear] = 0;
      accumulator[monthYear] +=
        transaction['Tipo de Registro'] === type ? amount : 0;

      return accumulator;
    }, {});
  }
  // Crear arreglo con los montos acumulados
  getProcessedData(type, selectedYear) {
    const totals = this.filterByTypeAndMonth(type, selectedYear);
    const totalByMonth = [];

    for (let i = 0; i < 12; i++) {
      totalByMonth[i] =
        totals[`${selectedYear}-${i < 10 ? `0${i + 1}` : i}`] || 0;
    }

    return totalByMonth;
  }
}

// Clase para manejar el gráfico de barras
class BarChart {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.chartInstance = null;
  }

  // Crear gráfico dinámicamente
  renderChart(labels, datasets) {
    const ctx = document.getElementById(this.canvasId)?.getContext('2d');

    if (this.chartInstance) this.chartInstance.destroy(); // Evitar gráficos duplicados

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

      this.renderChart(labels, datasets);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }
}

import transactions from '../../assets/data/transactions.json';

// Inicializar el gráfico cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
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

  const myChart = new BarChart('cash-flow-chart');
  myChart.renderData(transactions, labels, datasetConfig, currentYear);
});
