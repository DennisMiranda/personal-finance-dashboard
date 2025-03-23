import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import transactions from '../../assets/data/transactions.json';

import { createGrid, themeQuartz } from 'ag-grid-community';

function CategoryRenderer(params) {
  const iconMap = {
    Alimentación: { icon: 'fa-utensils', color: 'bg-orange-500' },
    'Servicios Básicos': { icon: 'fa-house', color: 'bg-green-500' },
    Transporte: { icon: 'fa-bus', color: 'bg-yellow-500' },
    'Salud e Higiene': { icon: 'fa-notes-medical', color: 'bg-red-500' },
    Educación: { icon: 'fa-graduation-cap', color: 'bg-blue-500' },
    Entretenimiento: { icon: 'fa-film', color: 'bg-purple-500' },
    'Moda y Belleza': { icon: 'fa-tshirt', color: 'bg-pink-500' },
    'Salario principal': {
      icon: 'fa-solid fa-briefcase',
      color: 'bg-blue-700',
    },
    'Bonos y pensiones': { icon: 'fa-solid fa-coins', color: 'bg-orange-500' },
    Rentas: { icon: 'fa-solid fa-house', color: 'bg-purple-500' },
    Intereses: { icon: 'fa-solid fa-piggy-bank', color: 'bg-green-500' },
    Dividendos: { icon: 'fa-solid fa-dollar-sign', color: 'bg-red-500' },
    'Negocio Independiente': {
      icon: 'fa-solid fa-store',
      color: 'bg-yellow-500',
    },
    'Regalos y donaciones': { icon: 'fa-solid fa-gift', color: 'bg-gray-600' },
  };

  const category = iconMap[params.value] || {
    icon: 'fa-question-circle',
    color: 'bg-gray-500',
  };

  return `
    <span class="flex items-center gap-2">
      <span class="flex justify-center items-center text-center w-5 h-5 ${category.color} text-white rounded-full">
        <i class="fa-solid ${category.icon} text-xs"></i>
      </span>
      ${params.value}
    </span>
  `;
}

// Almacena las columnas a mostrar en la tabla.
let columns = Object.keys(transactions[0])
  .filter(
    (key) =>
      key !== 'Tipo de Registro' && key !== 'ID' && key !== 'Subcategoría'
  )
  .map((key) => ({
    field: key,
    cellRenderer: key === 'Categoría' ? CategoryRenderer : undefined,
    cellStyle: key === 'Monto' ? { textAlign: 'right' } : undefined,
    valueFormatter:
      key === 'Monto' ? (params) => params.value.toFixed(2) : undefined,
  }));

//Obtener datos
class Table {
  constructor(id, options) {
    const myGridElement = document.querySelector(id);
    createGrid(myGridElement, options);
  }
}

class TransactionsTable extends Table {
  constructor(id, type) {
    const options = {
      theme: themeQuartz.withParams({ wrapperBorder: false }),
      rowData: transactions.filter(
        (transaction) => transaction['Tipo de Registro'] == type
      ),
      columnDefs: columns,
      autoSizeStrategy: {
        type: 'fitCellContents',
      },
    };

    super(id, options);
  }
}

export { TransactionsTable, Table };
