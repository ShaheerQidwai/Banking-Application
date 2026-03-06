import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createAccount, extractApiError } from '../api';
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';

export function CreateAccountPage() {
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'SAVINGS' | 'CURRENT'>('SAVINGS');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await createAccount({
        fullName,
        cnic,
        phone,
        password,
        accountType,
        initialBalance: 0,
      });
      setMessage(`Account created successfully. Account number: ${response.accountNumber}`);
      setFullName('');
      setCnic('');
      setPhone('');
      setPassword('');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h2 className="text-3xl font-semibold text-slate-900">Open your SecureBank account</h2>
        <p className="mt-3 max-w-lg text-slate-600">
          Create your account to start managing balances, transfers, and transaction history with enterprise-grade reliability.
        </p>
      </div>

      <Card className="w-full border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <CardHeader className="space-y-3">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Open your new account in a few steps</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <Alert>{message}</Alert>}
          {error && <Alert variant="destructive">{error}</Alert>}
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2 sm:col-span-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>CNIC</Label>
              <Input value={cnic} onChange={(e) => setCnic(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={accountType} onChange={(e) => setAccountType(e.target.value as 'SAVINGS' | 'CURRENT')}>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="w-full">Create Account</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
