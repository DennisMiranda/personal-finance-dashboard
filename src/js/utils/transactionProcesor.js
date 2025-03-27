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

  getCategoriesLabelsAndValues(month, year) {
    // Buscar el balance para el mes y año correspondiente
    const data = this.transactions.find(
      (item) => item.key === `${year}-${month}`
    );

    // En caso de no encontrar el mes y año, devolver valores por defecto.
    if (!data) {
      return {
        incomes: { labels: [], values: [] },
        expenses: { labels: [], values: [] },
      };
    }

    const { categories } = data;

    // Retornar las llaves que corresponden a los nombres de las categorías y los valores correspondientes.
    return {
      incomes: {
        labels: Object.keys(categories.incomes),
        values: Object.values(categories.incomes),
      },
      expenses: {
        labels: Object.keys(categories.expenses),
        values: Object.values(categories.expenses),
      },
    };
  }
}
