import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockPayments, mockContracts } from '@/data/mockData';
import { Payment } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Check'] as const;

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<Partial<Payment>>({});

  const columns = [
    { key: 'payment_id', header: 'ID' },
    { key: 'contract_id', header: 'Contract' },
    { key: 'amount', header: 'Amount', render: (item: Payment) => (
      <span className="font-semibold text-success">${item.amount.toLocaleString()}</span>
    )},
    { key: 'method', header: 'Method', render: (item: Payment) => (
      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-medium">
        {item.method}
      </span>
    )},
    { key: 'payment_date', header: 'Date', render: (item: Payment) => (
      new Date(item.payment_date).toLocaleDateString()
    )},
  ];

  const handleAdd = () => {
    setSelectedPayment(null);
    setFormData({ method: 'Bank Transfer', contract_id: mockContracts[0]?.contract_id });
    setIsModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData(payment);
    setIsModalOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.contract_id || !formData.amount || !formData.payment_date) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (formData.amount < 0) {
      toast({ title: 'Validation Error', description: 'Amount must be greater than or equal to 0.', variant: 'destructive' });
      return;
    }

    if (selectedPayment) {
      setPayments(prev => prev.map(p => p.payment_id === selectedPayment.payment_id ? { ...p, ...formData } as Payment : p));
      toast({ title: 'Payment Updated', description: 'The payment has been successfully updated.' });
    } else {
      const newPayment: Payment = {
        ...formData,
        payment_id: `PAY${String(payments.length + 1).padStart(3, '0')}`,
      } as Payment;
      setPayments(prev => [...prev, newPayment]);
      toast({ title: 'Payment Added', description: 'The payment has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedPayment) {
      setPayments(prev => prev.filter(p => p.payment_id !== selectedPayment.payment_id));
      toast({ title: 'Payment Deleted', description: 'The payment has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Contract', 'Amount', 'Method', 'Date'];
    const csvContent = [
      headers.join(','),
      ...payments.map(p => [p.payment_id, p.contract_id, p.amount, p.method, p.payment_date].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Payments have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Track payment transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search payments..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPayment ? 'Edit Payment' : 'Add Payment'}
        onSubmit={handleSubmit}
        submitLabel={selectedPayment ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contract *</label>
            <select
              value={formData.contract_id || ''}
              onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
              className="form-input"
            >
              {mockContracts.map(c => (
                <option key={c.contract_id} value={c.contract_id}>
                  {c.contract_id} - {c.contract_type} (${c.total_amount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount ($) *</label>
              <input
                type="number"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="form-input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Method *</label>
              <select
                value={formData.method || ''}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as Payment['method'] })}
                className="form-input"
              >
                {paymentMethods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Date *</label>
            <input
              type="date"
              value={formData.payment_date || ''}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
      />
    </div>
  );
}
