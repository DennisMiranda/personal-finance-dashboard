// =====================================
// Funciones auxiliares para cálculos

import { TransactionProcessor } from './transactionProcesor';

// =====================================
export function calculateTotalBalance(transactions, previousBalance) {
  return calculateSavings(transactions) + previousBalance;
}

export function calculateTotalByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function calculateSavings(transactions) {
  // Ahorro del mes actual
  const totalIncomes = calculateTotalByType(transactions, 'Ingreso');
  const totalExpenses = calculateTotalByType(transactions, 'Gasto');

  return totalIncomes - totalExpenses;
}

// Filtrar por tipo, mes y año para obtener el monto mensual
export function getBalanceByYearMonth(transactions) {
  const balanceObj = transactions.reduce((accumulator, transaction) => {
    const yearMonth = TransactionProcessor.getMonthYearFromDate(
      transaction['date']
    );

    const amount = +transaction['amount'];

    if (!accumulator[yearMonth]) {
      accumulator[yearMonth] = {
        incomes: 0,
        expenses: 0,
        categories: { incomes: {}, expenses: {} },
      };
    }

    const { categories } = accumulator[yearMonth];

    if (transaction.type === 'Ingreso') {
      accumulator[yearMonth].incomes += amount;

      if (!categories.incomes[transaction.category])
        categories.incomes[transaction.category] = 0;

      categories.incomes[transaction.category] += amount;
    } else {
      accumulator[yearMonth].expenses += amount;
      categories.expenses[transaction.category] ??= 0;
      categories.expenses[transaction.category] += amount;
    }

    return accumulator;
  }, {});

  return Object.keys(balanceObj)
    .sort()
    .map((key) => ({
      key,
      incomes: balanceObj[key].incomes,
      expenses: balanceObj[key].expenses,
      categories: balanceObj[key].categories,
    }));
}

export function getPreviousMonthBalance(transactions, month, year) {
  let totalSavings = 0;
  for (const transaction of transactions) {
    if (transaction.key < `${year}-${month}`) {
      totalSavings += transaction.incomes - transaction.expenses;
    } else {
      return totalSavings;
    }
  }

  return totalSavings;
}

export function getIndicatorPercent(balance, previousBalance) {
  if (!previousBalance) {
    return (0).toFixed(1);
  }

  return (((balance - previousBalance) / previousBalance) * 100).toFixed(1);
}

export function getAmountsAndIndicators(balanceByYearMonth, month, year) {
  const defaultBalance = {
    key: '',
    incomes: 0,
    expenses: 0,
  };

  const previousAccumaltedBalance = getPreviousMonthBalance(
    balanceByYearMonth,
    month,
    year
  );

  const previousMonth = new Date(Date.UTC(year, +month - 1, 1));
  previousMonth.setDate(previousMonth.getDate() - 1);
  const previousKey = `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1
  ).padStart(2, '0')}`;

  const previousBalance = balanceByYearMonth.find(
    (item) => item.key === previousKey
  ) || { ...defaultBalance, key: previousKey };

  const currentKey = `${year}-${month}`;
  const balance = balanceByYearMonth.find(
    (item) => item.key === currentKey
  ) || { ...defaultBalance, key: currentKey };

  const totalBalance =
    balance.incomes - balance.expenses + previousAccumaltedBalance;
  const monthlySavings = balance.incomes - balance.expenses;

  return {
    amounts: [
      totalBalance,
      balance.incomes,
      balance.expenses,
      monthlySavings,
      previousAccumaltedBalance,
    ],
    indicators: [
      getIndicatorPercent(totalBalance, previousAccumaltedBalance),
      getIndicatorPercent(balance.incomes, previousBalance.incomes),
      getIndicatorPercent(balance.expenses, previousBalance.expenses),
      getIndicatorPercent(
        monthlySavings,
        previousBalance.incomes - previousBalance.expenses
      ),
      null,
    ],
  };
}
