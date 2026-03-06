import axios from 'axios';

export type AccountType = 'SAVINGS' | 'CURRENT';
export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export type AccountResponse = {
  accountNumber: string;
  fullName: string;
  cnic: string;
  phone: string;
  accountType: AccountType;
  balance: number;
  active: boolean;
  createdAt: string;
};

export type BalanceResponse = {
  accountNumber: string;
  balance: number;
};

export type TransactionResponse = {
  transactionId: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  fromAccountNumber: string | null;
  toAccountNumber: string | null;
  description: string;
};

export type PagedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};

export type TransactionQueryParams = {
  page?: number;
  size?: number;
  type?: TransactionType;
  from?: string;
  to?: string;
};

export type LoginResponse = {
  userId: number;
  fullName: string;
  message: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

const normalizeDateTimeParam = (value?: string) => {
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value.length === 16 ? `${value}:00` : value;
};

const buildTransactionParams = (params: TransactionQueryParams) => ({
  page: params.page,
  size: params.size,
  type: params.type,
  from: normalizeDateTimeParam(params.from),
  to: normalizeDateTimeParam(params.to),
});

export const createAccount = async (payload: {
  fullName: string;
  cnic: string;
  phone: string;
  password: string;
  accountType: AccountType;
  initialBalance: number;
}) => {
  const { data } = await api.post<AccountResponse>('/users/accounts', payload);
  return data;
};

export const login = async (payload: { cnic: string; password: string }) => {
  const { data } = await api.post<LoginResponse>('/users/login', payload);
  return data;
};

export const getAccount = async (accountNumber: string) => {
  const { data } = await api.get<AccountResponse>(`/users/accounts/${accountNumber}`);
  return data;
};

export const deposit = async (accountNumber: string, amount: number) => {
  const { data } = await api.post<BalanceResponse>('/accounts/deposit', { accountNumber, amount });
  return data;
};

export const withdraw = async (accountNumber: string, amount: number) => {
  const { data } = await api.post<BalanceResponse>('/accounts/withdraw', { accountNumber, amount });
  return data;
};

export const transfer = async (fromAccountNumber: string, toAccountNumber: string, amount: number) => {
  const { data } = await api.post<BalanceResponse>('/accounts/transfer', {
    fromAccountNumber,
    toAccountNumber,
    amount,
  });
  return data;
};

export const getTransactions = async (accountNumber: string, params: TransactionQueryParams = {}) => {
  const { data } = await api.get<PagedResponse<TransactionResponse>>(`/accounts/${accountNumber}/transactions`, {
    params: buildTransactionParams(params),
  });
  return data;
};

export const getAllAccounts = async () => {
  const { data } = await api.get<AccountResponse[]>('/admin/accounts');
  return data;
};

export const getTotalBalance = async () => {
  const { data } = await api.get<{ totalBalance: number }>('/admin/total-balance');
  return data;
};

export const getAllTransactions = async (params: TransactionQueryParams = {}) => {
  const { data } = await api.get<PagedResponse<TransactionResponse>>('/admin/transactions', {
    params: buildTransactionParams(params),
  });
  return data;
};

export const extractApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'Unexpected error occurred';
};
