import { useEffect, useState } from 'react';
import { extractApiError, getAllAccounts, type AccountResponse } from '../../api';
import { Alert } from '../../components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAccounts(await getAllAccounts());
      } catch (err) {
        setError(extractApiError(err));
      }
    };
    void fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="destructive">{error}</Alert>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((item) => (
              <TableRow key={item.accountNumber}>
                <TableCell>{item.accountNumber}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.accountType}</TableCell>
                <TableCell>{item.balance}</TableCell>
                <TableCell>{item.active ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
