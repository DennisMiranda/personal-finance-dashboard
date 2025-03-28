import { sidebar } from './components/sidebar';
import {
  getUserData,
  loadTransactions,
  saveTransaction,
} from './utils/localstorage';
import { TransactionsTable } from './components/table';

class TransactionsHistory {
  constructor() {
    this.transactions = loadTransactions();
    this.table = null;
  }

  init() {
    const { username, email } = getUserData();
    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;

    formGastos.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addTransaction('formGastos', 'Gasto');
    });

    formIngresos.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addTransaction('formIngresos', 'Ingreso');
    });

    this.createTable();
  }

  createTable() {
    // Renderizar las tablas con los datos filtrados
    this.table = new TransactionsTable(
      'table-transactions-history',
      null,
      this.transactions
    );
    this.table.show();
  }

  addTransaction(formId, type) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    let date = formData.get('date');
    let category = formData.get('category');
    let amount = Number(formData.get('amount'));
    let description = formData.get('description');

    //validando los campos del formulario esten llenos
    if (date === '' || category === '' || amount === '') {
      alert('Porfavor completar el formulario');
      return;
    }

    const transaction = {
      id: Date.now(),
      date: date + 'T00:00:00',
      category,
      amount,
      description,
      type,
    };

    this.transactions.push(transaction);
    this.table.update(this.transactions);
    saveTransaction(transaction);

    form.reset();
  }
}

const transactionsHistory = new TransactionsHistory();
transactionsHistory.init();

document.addEventListener('DOMContentLoaded', function () {
  // Funcionalidad a los TAB de ingresos y gasto
  const formGastos = document.getElementById('formGastos');
  const formIngresos = document.getElementById('formIngresos');
  const tabGastos = document.getElementById('tabGastos');
  const tabIngresos = document.getElementById('tabIngresos');
  const btnIngreso = document.getElementById('btnIngreso');
  const btnGasto = document.getElementById('btnGasto');
  const formMain = document.getElementById('formMain');
  const nav_tab = document.getElementById('nav_tab');
  const balance = document.getElementById('balance');
  const modalFormTransaction = document.getElementById('modalFormTransaction');
  const fondoOscuro = document.getElementById('fondoOscuro');
  const btnCerrarFormulario = document.querySelectorAll('.btnCerrarFormulario');

  btnCerrarFormulario.forEach((btnCerrar) => {
    btnCerrar.addEventListener('click', function () {
      modalFormTransaction.classList.add('hidden');
      fondoOscuro.classList.add('hidden');
    });
  });

  tabGastos.addEventListener('click', function () {
    nav_tab.classList.remove('bg-[#00a254]');
    nav_tab.classList.add('bg-[#ff2326]');
    formGastos.classList.remove('hidden');
    formIngresos.classList.add('hidden');
    formIngresos.classList.remove('border-[#00a254]'); //elimina el borde verde del contenedor del formulario ingresos
    formGastos.classList.add('border-[#ff2326]'); //se agrega borde rojo al contenedor del formulario de gastos
    tabIngresos.classList.add('shadow-2xs');
    tabIngresos.classList.add('bg-white');
    tabGastos.classList.remove('shadow-2xs');
    tabGastos.classList.remove('bg-white');
  });

  tabIngresos.addEventListener('click', function () {
    nav_tab.classList.remove('bg-[#ff2326]');
    nav_tab.classList.add('bg-[#00a254]');
    formGastos.classList.add('hidden');
    formIngresos.classList.remove('hidden');
    formGastos.classList.remove('border-[#ff2326]');
    formIngresos.classList.add('border-[#00a254]');
    formMain.classList.remove('border-[#ff2326]'); //elimina el border rojo del contenedor del formulario
    formMain.classList.add('border-[#00a254]'); //se agrega borde verde al contenedor del formulario
    tabIngresos.classList.remove('shadow-2xs');
    tabIngresos.classList.remove('bg-white');
    tabGastos.classList.add('bg-white');
    tabGastos.classList.add('shadow-2xs');
  });

  //---------------------------------------------
  //Obteniendo valores del formulario de GASTOS
  //---------------------------------------------
  let contGasto = 0,
    contIngreso = 0,
    balanceIngreso = 0,
    balanceGasto = 0,
    balanceTotal = 0;

  const openModal = document.getElementById('openModal');
  const closeModal = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');

  // Función para abrir el modal con animación
  openModal.addEventListener('click', () => {
    modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('opacity-0', 'scale-95');
    modalContent.classList.add('opacity-100', 'scale-100');
  });

  // Función para cerrar el modal con animación
  closeModal.addEventListener('click', () => {
    modalContent.classList.remove('opacity-100', 'scale-100');
    modalContent.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      modalOverlay.classList.add('opacity-0', 'pointer-events-none');
    }, 300); // Coincide con la duración de la animación
  });

  // Cerrar el modal al hacer clic fuera del contenido
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      modalContent.classList.remove('opacity-100', 'scale-100');
      modalContent.classList.add('opacity-0', 'scale-95');

      setTimeout(() => {
        modalOverlay.classList.add('opacity-0', 'pointer-events-none');
      }, 300);
    }
  });
});
