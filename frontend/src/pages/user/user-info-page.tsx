import { useEffect, useState } from 'react';
import { BadgeDollarSign, CreditCard, ShieldCheck, UserCircle2 } from 'lucide-react';
import { getAccount, type AccountResponse, extractApiError } from '../../api';
import { useAuth } from '../../auth';
import { Alert } from '../../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function UserInfoPage() {
  const { session } = useAuth();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session?.role === 'user') {
          setAccount(await getAccount(session.accountNumber));
        }
      } catch (err) {
        setError(extractApiError(err));
      }
    };
    void fetchData();
  }, [session]);

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>{error ? <Alert variant="destructive">{error}</Alert> : 'Loading account...'}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Account Overview</CardTitle>
          <CardDescription>Personal and account details</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardDescription>Account Holder</CardDescription>
            <CardTitle className="text-base">{account.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-slate-500"><UserCircle2 className="h-4 w-4" /> Customer</CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-base">PKR {account.balance}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-slate-500"><BadgeDollarSign className="h-4 w-4" /> Available</CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardDescription>Account Number</CardDescription>
            <CardTitle className="text-base">{account.accountNumber}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-slate-500"><CreditCard className="h-4 w-4" /> {account.accountType}</CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-base">{account.active ? 'Active' : 'Inactive'}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-slate-500"><ShieldCheck className="h-4 w-4" /> Protected</CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <p><strong>Name:</strong> {account.fullName}</p>
          <p><strong>CNIC:</strong> {account.cnic}</p>
          <p><strong>Phone:</strong> {account.phone}</p>
          <p><strong>Type:</strong> {account.accountType}</p>
        </CardContent>
      </Card>
    </div>
  );
}
