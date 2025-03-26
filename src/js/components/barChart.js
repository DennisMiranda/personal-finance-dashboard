import Chart from 'chart.js/auto';

export class TransactionProcessor {
  constructor(transactions) {
    this.transactions = transactions;
  }

  // Extraer el mes y año
  static getMonthYearFromDate(dateString) {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  // Filtrar por tipo, mes y año para obtener el monto mensual
  filterByTypeAndMonth(type, selectedYear) {
    return this.transactions.reduce((accumulator, transaction) => {
      const monthYear = TransactionProcessor.getMonthYearFromDate(
        transaction['date']
      );

      const amount = +transaction['amount'];

      if (!monthYear.startsWith(selectedYear)) return accumulator;

      if (!accumulator[monthYear]) accumulator[monthYear] = 0;
      accumulator[monthYear] += transaction['type'] === type ? amount : 0;

      return accumulator;
    }, {});
  }

  // Crear arreglo con los montos acumulados
  getProcessedData(type, selectedYear) {
    const totals = this.filterByTypeAndMonth(type, selectedYear);
    const totalByMonth = [];

    for (let i = 0; i < 12; i++) {
      totalByMonth[i] =
        totals[`${selectedYear}-${(i + 1).toString().padStart(2, '0')}`] || 0;
    }

    return totalByMonth;
  }
}

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
