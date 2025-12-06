import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockOwners, mockProperties } from '@/data/mockData';
import { Owner } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function Owners() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState<Partial<Owner>>({});

  const getPropertyAddress = (propId: string) => {
    const prop = mockProperties.find(p => p.property_id === propId);
    return prop?.address || propId;
  };

  const columns = [
    { key: 'owner_id', header: 'ID' },
    { key: 'name', header: 'Name', render: (item: Owner) => (
      <span className="font-medium">{item.f_name} {item.l_name}</span>
    )},
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'address', header: 'Address' },
    { key: 'property_id', header: 'Property', render: (item: Owner) => (
      <span className="text-primary">{getPropertyAddress(item.property_id)}</span>
    )},
  ];

  const handleAdd = () => {
    setSelectedOwner(null);
    setFormData({ property_id: mockProperties[0]?.property_id });
    setIsModalOpen(true);
  };

  const handleEdit = (owner: Owner) => {
    setSelectedOwner(owner);
    setFormData(owner);
    setIsModalOpen(true);
  };

  const handleDelete = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsDeleteModalOpen(true);
  };

  const validatePhone = (phone: string) => /^\d{11}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!formData.f_name || !formData.l_name || !formData.email || !formData.phone) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({ title: 'Validation Error', description: 'Phone number must be exactly 11 digits.', variant: 'destructive' });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({ title: 'Validation Error', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    const emailExists = owners.some(o => o.email === formData.email && o.owner_id !== selectedOwner?.owner_id);
    if (emailExists) {
      toast({ title: 'Validation Error', description: 'An owner with this email already exists.', variant: 'destructive' });
      return;
    }

    if (selectedOwner) {
      setOwners(prev => prev.map(o => o.owner_id === selectedOwner.owner_id ? { ...o, ...formData } as Owner : o));
      toast({ title: 'Owner Updated', description: 'The owner has been successfully updated.' });
    } else {
      const newOwner: Owner = {
        ...formData,
        owner_id: `O${String(owners.length + 1).padStart(3, '0')}`,
      } as Owner;
      setOwners(prev => [...prev, newOwner]);
      toast({ title: 'Owner Added', description: 'The owner has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedOwner) {
      setOwners(prev => prev.filter(o => o.owner_id !== selectedOwner.owner_id));
      toast({ title: 'Owner Deleted', description: 'The owner has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Property'];
    const csvContent = [
      headers.join(','),
      ...owners.map(o => [o.owner_id, o.f_name, o.l_name, o.email, o.phone, `"${o.address}"`, getPropertyAddress(o.property_id)].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'owners.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Owners have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Owners</h1>
          <p className="page-subtitle">Manage property owners</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        </div>
      </div>

      <DataTable
        data={owners}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search owners..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOwner ? 'Edit Owner' : 'Add Owner'}
        onSubmit={handleSubmit}
        submitLabel={selectedOwner ? 'Update' : 'Add'}
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
              <label className="block text-sm font-medium mb-2">Property</label>
              <select
                value={formData.property_id || ''}
                onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                className="form-input"
              >
                {mockProperties.map(p => (
                  <option key={p.property_id} value={p.property_id}>{p.address}</option>
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
              placeholder="Owner address"
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Owner"
        message="Are you sure you want to delete this owner? This action cannot be undone."
      />
    </div>
  );
}
