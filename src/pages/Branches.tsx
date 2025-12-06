import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockBranches, mockDepartments } from '@/data/mockData';
import { Branch } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function Branches() {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<Partial<Branch>>({});

  const getDepartmentName = (deptId: string) => {
    const dept = mockDepartments.find(d => d.department_id === deptId);
    return dept?.department_name || deptId;
  };

  const columns = [
    { key: 'branch_id', header: 'ID' },
    { key: 'branch_name', header: 'Name', render: (item: Branch) => (
      <span className="font-medium">{item.branch_name}</span>
    )},
    { key: 'city', header: 'City' },
    { key: 'address', header: 'Address' },
    { key: 'phone', header: 'Phone' },
    { key: 'department_id', header: 'Department', render: (item: Branch) => (
      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
        {getDepartmentName(item.department_id)}
      </span>
    )},
  ];

  const handleAdd = () => {
    setSelectedBranch(null);
    setFormData({ department_id: mockDepartments[0]?.department_id });
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const validatePhone = (phone: string) => /^\d{11}$/.test(phone);

  const handleSubmit = () => {
    if (!formData.branch_name || !formData.city || !formData.address || !formData.phone) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({ title: 'Validation Error', description: 'Phone number must be exactly 11 digits.', variant: 'destructive' });
      return;
    }

    if (selectedBranch) {
      setBranches(prev => prev.map(b => b.branch_id === selectedBranch.branch_id ? { ...b, ...formData } as Branch : b));
      toast({ title: 'Branch Updated', description: 'The branch has been successfully updated.' });
    } else {
      const newBranch: Branch = {
        ...formData,
        branch_id: `B${String(branches.length + 1).padStart(3, '0')}`,
      } as Branch;
      setBranches(prev => [...prev, newBranch]);
      toast({ title: 'Branch Added', description: 'The branch has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedBranch) {
      setBranches(prev => prev.filter(b => b.branch_id !== selectedBranch.branch_id));
      toast({ title: 'Branch Deleted', description: 'The branch has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'City', 'Address', 'Phone', 'Department'];
    const csvContent = [
      headers.join(','),
      ...branches.map(b => [b.branch_id, b.branch_name, b.city, `"${b.address}"`, b.phone, getDepartmentName(b.department_id)].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branches.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Branches have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Branches</h1>
          <p className="page-subtitle">Manage agency branch locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      <DataTable
        data={branches}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search branches..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBranch ? 'Edit Branch' : 'Add Branch'}
        onSubmit={handleSubmit}
        submitLabel={selectedBranch ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Branch Name *</label>
            <input
              type="text"
              value={formData.branch_name || ''}
              onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
              className="form-input"
              placeholder="e.g., LA Downtown"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="form-input"
                placeholder="City"
              />
            </div>
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              placeholder="Branch address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <select
              value={formData.department_id || ''}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="form-input"
            >
              {mockDepartments.map(d => (
                <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
              ))}
            </select>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
      />
    </div>
  );
}
