document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
});

// Función para cargar transacciones desde LocalStorage
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  // Limpia la lista antes de cargar (opcional, para evitar duplicados)
  document.getElementById("transactionList").innerHTML = "";
  transactions.forEach(addTransactionToDOM);
  updateBalance();
}

document.getElementById("transactionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  // Validación de campos
  if (!description || isNaN(amount) || amount <= 0 || !date) {
    alert("Todos los campos son obligatorios y el monto debe ser válido.");
    return;
  }

  // VALIDACIÓN: La fecha no puede ser futura
  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
      alert("La fecha no puede ser futura.");
      return;
  }

  const transaction = { id: Date.now(), description, amount, type, date };

  saveTransaction(transaction);
  addTransactionToDOM(transaction);
  updateBalance();

  this.reset();
});

// Función para guardar transacciones en LocalStorage
function saveTransaction(transaction) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Función para agregar una transacción a la tabla
function addTransactionToDOM(transaction) {
  const transactionList = document.getElementById("transactionList");

  const row = document.createElement("tr");
  row.innerHTML = `
      <td class="p-2 border">${transaction.description}</td>
      <td class="p-2 border ${transaction.type === "Ingreso" ? "text-green-500" : "text-red-500"}">
          ${transaction.type === "Ingreso" ? "+" : "-"} $${transaction.amount.toFixed(2)}
      </td>
      <td class="p-2 border">${transaction.type}</td>
      <td class="p-2 border">${transaction.date}</td>
      <td class="p-2 border">
          <button onclick="deleteTransaction(${transaction.id})" class="bg-red-500 text-white px-2 py-1 rounded">
              Eliminar
          </button>
      </td>
  `;
  transactionList.appendChild(row);
}

// Función para eliminar transacción
function deleteTransaction(id) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions = transactions.filter(transaction => transaction.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Limpiar la tabla y recargar las transacciones
  document.getElementById("transactionList").innerHTML = "";
  loadTransactions();
}

// Función para actualizar el balance total
function updateBalance() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const balance = transactions.reduce((acc, t) => t.type === "Ingreso" ? acc + t.amount : acc - t.amount, 0);
  document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
}
