import api from "./api";

export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}

export async function loginUser(userData) {
  const response = await api.post("/auth/login", userData);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function getDashboardData() {
  const response = await api.get("/dashboard");
  return response.data;
}

export async function getUserAccounts() {
  const response = await api.get("/accounts");

  return response.data;
}

export async function createAccount() {
  const response = await api.post("/accounts");

  return response.data;
}

export async function getAccountBalance(accountId) {
  const response = await api.get(
    `/accounts/balance/${accountId}`
  );

  return response.data;
}

export async function getTransactions() {
  const response = await api.get(
    "/transactions"
  );

  return response.data;
}

export async function createTransaction(
  transactionData
) {
  const response = await api.post(
    "/transactions",
    transactionData
  );

  return response.data;
}

export async function getLedger(
  accountId
) {
  const response = await api.get(
    `/transactions/ledger/${accountId}`
  );

  return response.data;
}

export async function getTransactionById(
  transactionId
) {
  const response = await api.get(
    `/transactions/${transactionId}`
  );

  return response.data;
}