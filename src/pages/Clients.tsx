import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockClients } from '@/data/mockData';
import { Client } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const genderOptions = ['Male', 'Female', 'Other'] as const;

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});

  const columns = [
    { key: 'client_id', header: 'ID' },
    { key: 'name', header: 'Name', render: (item: Client) => (
      <span className="font-medium">{item.f_name} {item.l_name}</span>
    )},
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'gender', header: 'Gender' },
    { key: 'address', header: 'Address' },
    { key: 'contract_id', header: 'Contract ID' },
  ];

  const handleAdd = () => {
    setSelectedClient(null);
    setFormData({ gender: 'Male' });
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData(client);
    setIsModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const validatePhone = (phone: string) => /^\d{11}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!formData.f_name || !formData.l_name || !formData.email || !formData.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: 'Validation Error',
        description: 'Phone number must be exactly 11 digits.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    // Check for unique email
    const emailExists = clients.some(
      c => c.email === formData.email && c.client_id !== selectedClient?.client_id
    );
    if (emailExists) {
      toast({
        title: 'Validation Error',
        description: 'A client with this email already exists.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedClient) {
      setClients(prev =>
        prev.map(c => c.client_id === selectedClient.client_id ? { ...c, ...formData } as Client : c)
      );
      toast({ title: 'Client Updated', description: 'The client has been successfully updated.' });
    } else {
      const newClient: Client = {
        ...formData,
        client_id: `CL${String(clients.length + 1).padStart(3, '0')}`,
      } as Client;
      setClients(prev => [...prev, newClient]);
      toast({ title: 'Client Added', description: 'The client has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      setClients(prev => prev.filter(c => c.client_id !== selectedClient.client_id));
      toast({ title: 'Client Deleted', description: 'The client has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Address', 'Birthdate', 'Contract ID'];
    const csvContent = [
      headers.join(','),
      ...clients.map(c => [
        c.client_id, c.f_name, c.l_name, c.email, c.phone, c.gender, `"${c.address}"`, c.birthdate, c.contract_id
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Clients have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">Manage your client database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search clients..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Edit Client' : 'Add Client'}
        onSubmit={handleSubmit}
        submitLabel={selectedClient ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                value={formData.f_name || ''}
                onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                className="form-input"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.l_name || ''}
                onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                className="form-input"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="email@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone * (11 digits)</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                className="form-input"
                placeholder="12345678901"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Client['gender'] })}
                className="form-input"
              >
                {genderOptions.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              placeholder="Client address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Birthdate</label>
            <input
              type="date"
              value={formData.birthdate || ''}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
}
