// Función para cargar transacciones desde LocalStorage
export function loadTransactions() {
  const userData = getUserData();

  return userData.transactions || [];
}

// Función para guardar transacciones en LocalStorage
export function saveTransaction(transaction) {
  const userData = getUserData();
  if (!userData.transactions) {
    userData.transactions = [];
  }
  userData.transactions.push(transaction);
  localStorage.setItem(userData.email, JSON.stringify(userData));
}

export function saveTransactions(transactions) {
  const userData = getUserData();
  userData.transactions = transactions;
  localStorage.setItem(userData.email, JSON.stringify(userData));
}

function logOut() {
  window.location.replace('/pages/login.html');
}

export function getUserData() {
  const userEmail = sessionStorage.getItem('loggedUser');
  if (!userEmail) {
    logOut();
    return;
  }
  return JSON.parse(localStorage.getItem(userEmail)) || {};
}
