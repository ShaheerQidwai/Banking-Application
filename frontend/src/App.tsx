import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth';
import { AppShell } from './components/app-shell';
import { AdminGuard, UserGuard } from './guards';
import { AdminAccountsPage } from './pages/admin/admin-accounts-page';
import { AdminDepositPage } from './pages/admin/admin-deposit-page';
import { AdminTransactionsPage } from './pages/admin/admin-transactions-page';
import { AdminWithdrawPage } from './pages/admin/admin-withdraw-page';
import { CreateAccountPage } from './pages/create-account-page';
import { PublicPage } from './pages/public-page';
import { UserInfoPage } from './pages/user/user-info-page';
import { UserTransactionsPage } from './pages/user/user-transactions-page';
import { UserTransferPage } from './pages/user/user-transfer-page';

const userLinks = [
  { to: '/user/info', label: 'User Info' },
  { to: '/user/transfer', label: 'Transfer' },
  { to: '/user/transactions', label: 'Transaction History' },
];

const adminLinks = [
  { to: '/admin/accounts', label: 'All Accounts' },
  { to: '/admin/transactions', label: 'Transactions' },
  { to: '/admin/withdraw', label: 'Withdraw' },
  { to: '/admin/deposit', label: 'Deposit' },
];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />

          <Route element={<UserGuard />}>
            <Route path="/user" element={<AppShell links={userLinks} title="User Dashboard" />}>
              <Route index element={<Navigate to="/user/info" replace />} />
              <Route path="info" element={<UserInfoPage />} />
              <Route path="transactions" element={<UserTransactionsPage />} />
              <Route path="transfer" element={<UserTransferPage />} />
            </Route>
          </Route>

          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AppShell links={adminLinks} title="Admin Dashboard" />}>
              <Route index element={<Navigate to="/admin/accounts" replace />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="withdraw" element={<AdminWithdrawPage />} />
              <Route path="deposit" element={<AdminDepositPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
