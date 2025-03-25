import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { convertDate } from '../utils/convertDate';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { createGrid, themeQuartz } from 'ag-grid-community';

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

const columnsHeaderNames = {
  date: 'Fecha',
  category: 'Categoría',
  amount: 'Monto',
  description: 'Descripción',
};

function CategoryRenderer(params) {
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

//Obtener datos
class Table {
  constructor(containerId, options) {
    this.id = containerId;
    this.options = options;
  }

  show() {
    const myGridElement = document.querySelector(this.id);
    createGrid(myGridElement, this.options);
  }
}

class TransactionsTable extends Table {
  constructor(containerId, type, transactions = []) {
    super(containerId, {});
    this.type = type;
    this.transactions = transactions;
  }

  setColumns() {
    this.columns = Object.keys(this.transactions[0])
      .filter((key) => !['id', 'type'].includes(key))
      .map((key) => ({
        field: key,
        headerName: columnsHeaderNames[key],
        cellRenderer: key === 'category' ? CategoryRenderer : undefined,
        cellStyle: key === 'amount' ? { textAlign: 'right' } : undefined,
        valueFormatter: (params) => {
          if (key === 'amount') {
            return (+params.value).toFixed(2);
          } else if (key === 'date') {
            return convertDate(params.value);
          }
          return params.value;
        },
      }));
  }

  show() {
    this.setColumns();

    this.options = {
      theme: themeQuartz.withParams({ wrapperBorder: false }),
      rowData: this.transactions.filter(
        (transaction) => transaction['type'] == this.type
      ),
      columnDefs: this.columns,
      autoSizeStrategy: {
        type: 'fitCellContents',
      },
    };

    super.show();
  }
}

export { TransactionsTable, Table };
