import { saveTransaction } from './utils/localstorage';

document.addEventListener('DOMContentLoaded', function () {
  // Funcionalidad a los TAB de ingresos y gasto
  const formGastos = document.getElementById('formGastos');
  const formIngresos = document.getElementById('formIngresos');
  const tabGastos = document.getElementById('tabGastos');
  const tabIngresos = document.getElementById('tabIngresos');
  const btnGasto = document.getElementById('btnGasto');
  const formMain = document.getElementById('formMain');
  const nav_tab = document.getElementById('nav_tab');
  const balance = document.getElementById('balance');
  const modalEliminar = document.getElementById('modalEliminar');
  const btnEliminar = document.getElementById('btnEliminar');
  const btnCancelar = document.getElementById('btnCancelar');

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
  btnGasto.addEventListener('click', function () {
    let dateGasto = document.getElementById('dateGasto').value;
    let typeGasto = document.getElementById('typeGasto').value;
    let montoGasto = Number(document.getElementById('montoGasto').value);
    let descriptionGasto = document.getElementById('descriptionGasto').value;

    //validando los campos del formulario esten llenos
    if (dateGasto === '' || typeGasto === '' || montoGasto === '') {
      alert('Porfavor completar el formulario');
      return;
    }

    //Creando las filas y celdas de la tabla
    const table = document.getElementById('table');
    const fila = table.insertRow();

    let celda_ID_Gasto = fila.insertCell(0);
    let celda_dateGasto = fila.insertCell(1);
    let celda_typeGasto = fila.insertCell(2);
    let celda_montoGasto = fila.insertCell(3);
    let celda_descriptionGasto = fila.insertCell(4);
    let celda_eliminarGasto = fila.insertCell(5);

    //Contador del ID
    contGasto++;
    let ID_Gasto = 'G - ' + contGasto;

    //Dando valores a las celdas
    celda_ID_Gasto.innerHTML = ID_Gasto;
    celda_dateGasto.innerHTML = dateGasto;
    celda_typeGasto.innerHTML = typeGasto;
    celda_montoGasto.innerHTML = montoGasto;
    celda_descriptionGasto.innerHTML = descriptionGasto;

    saveTransaction({
      id: ID_Gasto,
      // Guardar fecha en formato ISO, sin zona horaria
      date: dateGasto + 'T00:00:00',
      category: typeGasto,
      amount: montoGasto,
      description: descriptionGasto,
      type: 'Gasto',
    });

    //Dando estilo a algunas celdas
    celda_montoGasto.classList.add('text-red-600');
    celda_montoGasto.classList.add('font-bold');
    celda_ID_Gasto.classList.add('text-red-600');
    celda_ID_Gasto.classList.add('font-bold');

    //creando el boton eliminar
    let eliminarGasto = document.createElement('button');
    eliminarGasto.textContent = '🗑️';

    //Dando funcionalidad al boton eliminar
    eliminarGasto.addEventListener('click', function () {
      let filaEliminada = this.closest('tr'); //obtengo la fila en la que apreto el boton eliminar.
      let celdaGastoEliminado = Number(filaEliminada.cells[3].textContent);

      modalEliminar.classList.remove('hidden');

      btnEliminar.addEventListener('click', function () {
        let eliminado = true;
        if (eliminado) {
          fila.remove();
          modalEliminar.classList.add('hidden');
        }
      });

      btnCancelar.addEventListener('click', function () {
        let cancelado = true;
        if (cancelado) modalEliminar.classList.add('hidden');
      });

      balanceGasto = balanceGasto - celdaGastoEliminado;
      balance.innerHTML = '';
      balanceTotal = balanceIngreso - balanceGasto;
      balance.innerHTML = balanceTotal;
    });
    celda_eliminarGasto.appendChild(eliminarGasto);

    document.getElementById('formGastos').reset();

    //Mostrando el balance de ingresos y gastos
    balanceGasto = balanceGasto + montoGasto;
    balance.innerHTML = '';
    balanceTotal = balanceIngreso - balanceGasto;
    balance.innerHTML = balanceTotal;
  });

  //---------------------------------------------
  //Obteniendo valores del formulario de INGRESOS
  //---------------------------------------------
  btnIngreso.addEventListener('click', function () {
    let dateIngreso = document.getElementById('dateIngreso').value;
    let typeIngreso = document.getElementById('typeIngreso').value;
    let montoIngreso = Number(document.getElementById('montoIngreso').value);
    let descriptionIngreso =
      document.getElementById('descriptionIngreso').value;

    //validando los campos del formulario esten llenos
    if (dateIngreso === '' || typeIngreso === '' || montoIngreso === '') {
      alert('Porfavor completar el formulario');
      return;
    }

    //Creando las filas y celdas de la tabla
    const table = document.getElementById('table');
    const fila = table.insertRow();

    let celda_ID_Ingreso = fila.insertCell(0);
    let celda_dateIngreso = fila.insertCell(1);
    let celda_typeIngreso = fila.insertCell(2);
    let celda_montoIngreso = fila.insertCell(3);
    let celda_descriptionIngreso = fila.insertCell(4);
    let celda_eliminarIngreso = fila.insertCell(5);

    //Contador del ID
    contIngreso++;
    let ID_Ingreso = 'I - ' + contIngreso;

    //Dando valores a las celdas
    celda_ID_Ingreso.innerHTML = ID_Ingreso;
    celda_dateIngreso.innerHTML = dateIngreso;
    celda_typeIngreso.innerHTML = typeIngreso;
    celda_montoIngreso.innerHTML = montoIngreso;
    celda_descriptionIngreso.innerHTML = descriptionIngreso;

    saveTransaction({
      id: ID_Ingreso,
      date: dateIngreso + 'T00:00:00',
      category: typeIngreso,
      amount: montoIngreso,
      description: descriptionIngreso,
      type: 'Ingreso',
    });

    celda_montoIngreso.classList.add('text-green-600');
    celda_montoIngreso.classList.add('font-bold');
    celda_ID_Ingreso.classList.add('text-Green-600');
    celda_ID_Ingreso.classList.add('font-bold');

    //creando el boton eliminar
    let eliminarIngreso = document.createElement('button');
    eliminarIngreso.textContent = '🗑️';

    //Dando funcionalidad al boton eliminar
    eliminarIngreso.addEventListener('click', function () {
      let filaEliminada = this.closest('tr'); //Obtengo la fila en la que se encuentra el boton eliminar.
      let celdaIngresoEliminada = Number(filaEliminada.cells[3].textContent);
      fila.remove();

      balanceIngreso = balanceIngreso - celdaIngresoEliminada;
      balance.innerHTML = '';
      balanceTotal = balanceIngreso - balanceGasto;
      balance.innerHTML = balanceTotal;
    });
    celda_eliminarIngreso.appendChild(eliminarIngreso);

    document.getElementById('formIngresos').reset();

    //Mostrando el balance de ingresos y gastos
    balanceIngreso = balanceIngreso + montoIngreso;
    balance.innerHTML = '';
    balanceTotal = balanceIngreso - balanceGasto;
    balance.innerHTML = balanceTotal;
  });
});
