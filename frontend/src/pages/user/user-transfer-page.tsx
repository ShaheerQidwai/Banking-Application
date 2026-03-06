import { useState } from 'react';
import type { FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { extractApiError, transfer } from '../../api';
import { useAuth } from '../../auth';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function UserTransferPage() {
  const { session } = useAuth();
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (session?.role !== 'user') {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await transfer(session.accountNumber, toAccount, Number(amount));
      setMessage(`Transfer completed. New balance: ${response.balance}`);
      setToAccount('');
      setAmount('0');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl"><SendHorizontal className="h-5 w-5" /> Transfer Funds</CardTitle>
        <CardDescription>Move money securely between accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && <Alert>{message}</Alert>}
        {error && <Alert variant="destructive">{error}</Alert>}
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 sm:col-span-2">
            <Label>From Account</Label>
            <Input value={session?.role === 'user' ? session.accountNumber : ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>To Account</Label>
            <Input value={toAccount} onChange={(e) => setToAccount(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">Send Transfer</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
