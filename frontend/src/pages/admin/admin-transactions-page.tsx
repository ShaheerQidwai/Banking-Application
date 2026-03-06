import { useEffect, useState } from 'react';
import { extractApiError, getAllTransactions, type TransactionResponse, type TransactionType } from '../../api';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export function AdminTransactionsPage() {
  const [items, setItems] = useState<TransactionResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const response = await getAllTransactions({
          page,
          size,
          type: typeFilter === 'ALL' ? undefined : typeFilter,
          from: fromFilter || undefined,
          to: toFilter || undefined,
        });
        setItems(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err) {
        setError(extractApiError(err));
      }
    };
    void fetchData();
  }, [page, size, typeFilter, fromFilter, toFilter]);

  const resetFilters = () => {
    setTypeFilter('ALL');
    setFromFilter('');
    setToFilter('');
    setPage(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="destructive">{error}</Alert>}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="admin-type">Type</Label>
            <Select
              id="admin-type"
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value as 'ALL' | TransactionType);
                setPage(0);
              }}
            >
              <option value="ALL">All</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAW">Withdraw</option>
              <option value="TRANSFER">Transfer</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="admin-from">From</Label>
            <Input
              id="admin-from"
              type="datetime-local"
              value={fromFilter}
              onChange={(event) => {
                setFromFilter(event.target.value);
                setPage(0);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="admin-to">To</Label>
            <Input
              id="admin-to"
              type="datetime-local"
              value={toFilter}
              onChange={(event) => {
                setToFilter(event.target.value);
                setPage(0);
              }}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="button" variant="outline" onClick={resetFilters}>Reset</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.transactionId}>
                <TableCell>{item.transactionId}</TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.fromAccountNumber ?? '-'}</TableCell>
                <TableCell>{item.toAccountNumber ?? '-'}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500">No transactions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">Total: {totalElements}</div>
          <div className="flex items-center gap-2">
            <Label htmlFor="admin-size">Rows</Label>
            <Select
              id="admin-size"
              className="w-24"
              value={String(size)}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(0);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
            <Button type="button" variant="outline" onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
              Previous
            </Button>
            <span className="text-sm text-slate-600">Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={totalPages === 0 || page + 1 >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
