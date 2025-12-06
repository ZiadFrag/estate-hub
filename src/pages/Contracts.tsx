import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockContracts, mockProperties } from '@/data/mockData';
import { Contract } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const contractTypes = ['Sale', 'Rent', 'Lease'] as const;

export default function Contracts() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState<Partial<Contract>>({});

  const getPropertyAddress = (propId: string) => {
    const prop = mockProperties.find(p => p.property_id === propId);
    return prop?.address || propId;
  };

  const columns = [
    { key: 'contract_id', header: 'ID' },
    { key: 'contract_type', header: 'Type', render: (item: Contract) => (
      <span className={`px-2 py-1 text-xs rounded-md font-medium ${
        item.contract_type === 'Sale' ? 'bg-success/10 text-success' :
        item.contract_type === 'Rent' ? 'bg-primary/10 text-primary' :
        'bg-warning/10 text-warning'
      }`}>
        {item.contract_type}
      </span>
    )},
    { key: 'property_id', header: 'Property', render: (item: Contract) => (
      <span className="font-medium">{getPropertyAddress(item.property_id)}</span>
    )},
    { key: 'total_amount', header: 'Amount', render: (item: Contract) => (
      <span className="font-semibold text-primary">${item.total_amount.toLocaleString()}</span>
    )},
    { key: 'contract_date', header: 'Date', render: (item: Contract) => (
      new Date(item.contract_date).toLocaleDateString()
    )},
  ];

  const handleAdd = () => {
    setSelectedContract(null);
    setFormData({ contract_type: 'Sale', property_id: mockProperties[0]?.property_id });
    setIsModalOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setFormData(contract);
    setIsModalOpen(true);
  };

  const handleDelete = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.property_id || !formData.total_amount || !formData.contract_date) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (formData.total_amount < 0) {
      toast({ title: 'Validation Error', description: 'Amount must be greater than or equal to 0.', variant: 'destructive' });
      return;
    }

    if (selectedContract) {
      setContracts(prev => prev.map(c => c.contract_id === selectedContract.contract_id ? { ...c, ...formData } as Contract : c));
      toast({ title: 'Contract Updated', description: 'The contract has been successfully updated.' });
    } else {
      const newContract: Contract = {
        ...formData,
        contract_id: `C${String(contracts.length + 1).padStart(3, '0')}`,
      } as Contract;
      setContracts(prev => [...prev, newContract]);
      toast({ title: 'Contract Added', description: 'The contract has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedContract) {
      setContracts(prev => prev.filter(c => c.contract_id !== selectedContract.contract_id));
      toast({ title: 'Contract Deleted', description: 'The contract has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Type', 'Property', 'Amount', 'Date'];
    const csvContent = [
      headers.join(','),
      ...contracts.map(c => [c.contract_id, c.contract_type, `"${getPropertyAddress(c.property_id)}"`, c.total_amount, c.contract_date].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contracts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Contracts have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">Manage property contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contract
          </Button>
        </div>
      </div>

      <DataTable
        data={contracts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search contracts..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContract ? 'Edit Contract' : 'Add Contract'}
        onSubmit={handleSubmit}
        submitLabel={selectedContract ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contract Type *</label>
            <select
              value={formData.contract_type || ''}
              onChange={(e) => setFormData({ ...formData, contract_type: e.target.value as Contract['contract_type'] })}
              className="form-input"
            >
              {contractTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Property *</label>
            <select
              value={formData.property_id || ''}
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              className="form-input"
            >
              {mockProperties.map(p => (
                <option key={p.property_id} value={p.property_id}>{p.address} - {p.city}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Amount ($) *</label>
              <input
                type="number"
                min="0"
                value={formData.total_amount || ''}
                onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                className="form-input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contract Date *</label>
              <input
                type="date"
                value={formData.contract_date || ''}
                onChange={(e) => setFormData({ ...formData, contract_date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This action cannot be undone."
      />
    </div>
  );
}
