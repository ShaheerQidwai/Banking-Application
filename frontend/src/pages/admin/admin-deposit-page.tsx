import { useState } from 'react';
import type { FormEvent } from 'react';
import { deposit, extractApiError } from '../../api';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function AdminDepositPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const result = await deposit(accountNumber, Number(amount));
      setMessage(`Deposit completed. New balance: ${result.balance}`);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Deposit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && <Alert>{message}</Alert>}
        {error && <Alert variant="destructive">{error}</Alert>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading}>Deposit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
