import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { saveTransactions } from '../utils/localstorage';
import { convertDate } from '../utils/convertDate';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { createGrid, themeQuartz } from 'ag-grid-community';

class TransactionActionComponent {
  eGui;
  deleteButton;
  eventListener;
  gridApi;

  init(props) {
    this.gridApi = props.api;
    this.eGui = document.createElement('div');
    this.eGui.className = 'h-full w-full flex justify-center';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'fa-solid fa-trash text-red-500 cursor-pointer';

    // La fila se elimina por medio de su índice actual
    this.eventListener = () => this.deleteRow(props.node.rowIndex);
    deleteButton.addEventListener('click', this.eventListener);
    this.eGui.appendChild(deleteButton);
  }

  getGui() {
    return this.eGui;
  }

  refresh() {
    return true;
  }

  destroy() {
    if (this.deleteButton) {
      this.deleteButton.removeEventListener('click', this.eventListener);
    }
  }

  deleteRow(id) {
    // Obtener todos los datos de la tabla
    const rowData = this.gridApi.getGridOption('rowData');
    // Eliminar la fila seleccionada
    rowData.splice(id, 1);
    // Actualizar los datos de la tabla
    this.gridApi.setGridOption('rowData', rowData);
    // Guardar en el localstorage
    saveTransactions(rowData);
  }
}

const iconMap = {
  Alimentación: { icon: 'fa-utensils', color: 'bg-orange-500' },
  'Servicios Básicos': { icon: 'fa-house', color: 'bg-green-500' },
  Transporte: { icon: 'fa-bus', color: 'bg-yellow-500' },
  'Salud e Higiene': { icon: 'fa-notes-medical', color: 'bg-red-500' },
  Educación: { icon: 'fa-graduation-cap', color: 'bg-blue-500' },
  Entretenimiento: { icon: 'fa-film', color: 'bg-purple-500' },
  'Moda y Belleza': { icon: 'fa-tshirt', color: 'bg-pink-500' },
  'Salario Principal': {
    icon: 'fa-solid fa-briefcase',
    color: 'bg-blue-700',
  },
  'Bonos y Pensiones': { icon: 'fa-solid fa-coins', color: 'bg-orange-500' },
  Rentas: { icon: 'fa-solid fa-house', color: 'bg-purple-500' },
  Intereses: { icon: 'fa-solid fa-piggy-bank', color: 'bg-green-500' },
  Dividendos: { icon: 'fa-solid fa-dollar-sign', color: 'bg-red-500' },
  'Negocio Independiente': {
    icon: 'fa-solid fa-store',
    color: 'bg-yellow-500',
  },
  'Regalos y Donaciones': { icon: 'fa-solid fa-gift', color: 'bg-gray-600' },
};

const columnsOptions = {
  date: { label: 'Fecha' },
  category: { label: 'Categoría', cellRenderer: CategoryRenderer },
  amount: { label: 'Monto', cellStyle: { textAlign: 'right' } },
  description: { label: 'Descripción' },
  type: { label: 'Tipo' },
  actions: {
    label: 'Acciones',
    cellRenderer: TransactionActionComponent,
  },
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
    // Api de aggrid para controlar la tabla
    this.gridApi = null;
  }

  show() {
    const myGridElement = document.getElementById(this.id);
    this.gridApi = createGrid(myGridElement, this.options);
  }
}

class TransactionsTable extends Table {
  constructor(containerId, type, transactions = []) {
    super(containerId, {});
    this.type = type;
    this.transactions = transactions;
  }

  setColumns() {
    if (!this.transactions.length) {
      this.columns = [];
      return;
    }

    const keys = Object.keys(this.transactions[0]);
    let exludedKeys = ['id', 'type', 'actions'];
    if (!this.type) {
      exludedKeys = [];
      keys.push('actions');
    }

    this.columns = keys
      .filter((key) => !exludedKeys.includes(key))
      .map((key) => ({
        field: key,
        headerName: columnsOptions[key]?.label,
        cellRenderer: columnsOptions[key]?.cellRenderer,
        cellStyle: columnsOptions[key],
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

  filterByType(transactions) {
    this.transactions = transactions.filter(
      (transaction) => transaction['type'] == this.type
    );
  }

  show() {
    this.setColumns();
    if (this.type) {
      this.filterByType(this.transactions);
    }

    this.options = {
      theme: themeQuartz.withParams({ wrapperBorder: false }),
      rowData: this.transactions,
      columnDefs: this.columns,
      autoSizeStrategy: {
        type: 'fitCellContents',
      },
    };

    super.show();
  }

  update(transactions) {
    if (this.type) {
      this.filterByType(transactions);
    }
    this.gridApi.setGridOption('rowData', this.transactions);
  }
}

export { TransactionsTable, Table };
