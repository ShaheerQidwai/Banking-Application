import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { extractApiError, getAllAccounts, login } from '../api';
import { useAuth } from '../auth';
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function PublicPage() {
  const navigate = useNavigate();
  const { loginAdmin, loginUser } = useAuth();

  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (cnic === 'admin' && password === 'admin123') {
        loginAdmin({ role: 'admin', username: 'Administrator' });
        navigate('/admin');
        return;
      }

      const response = await login({ cnic, password });
      const accounts = await getAllAccounts();
      const userAccount = accounts.find((account) => account.cnic === cnic);

      if (!userAccount) {
        throw new Error('No account found for this CNIC');
      }

      loginUser({
        role: 'user',
        fullName: response.fullName,
        cnic,
        accountNumber: userAccount.accountNumber,
      });
      navigate('/user/info');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-600">
          <Landmark className="h-3.5 w-3.5" />
          Corporate Digital Banking
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900">
          Secure, modern banking
          <br />
          built for confidence.
        </h1>
        <p className="mt-4 max-w-lg text-slate-600">
          Access your accounts, transfer funds, and monitor transactions through a professional banking experience.
        </p>
      </div>

      <div className="flex justify-center lg:justify-end">
        <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in with CNIC and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive">{error}</Alert>}
            <form className="space-y-4" onSubmit={onLogin}>
              <div className="space-y-2">
                <Label>CNIC</Label>
                <Input value={cnic} onChange={(e) => setCnic(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Login
              </Button>
            </form>
            <p className="text-center text-sm text-slate-600">
              New to SecureBank?{' '}
              <Link to="/create-account" className="font-medium text-slate-900 underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
