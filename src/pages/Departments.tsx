import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockDepartments } from '@/data/mockData';
import { Department } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function Departments() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});

  const columns = [
    { key: 'department_id', header: 'ID' },
    { key: 'department_name', header: 'Name', render: (item: Department) => (
      <span className="font-medium">{item.department_name}</span>
    )},
    { key: 'department_location', header: 'Location' },
  ];

  const handleAdd = () => {
    setSelectedDepartment(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData(department);
    setIsModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.department_name || !formData.department_location) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (selectedDepartment) {
      setDepartments(prev => prev.map(d => d.department_id === selectedDepartment.department_id ? { ...d, ...formData } as Department : d));
      toast({ title: 'Department Updated', description: 'The department has been successfully updated.' });
    } else {
      const newDepartment: Department = {
        ...formData,
        department_id: `D${String(departments.length + 1).padStart(3, '0')}`,
      } as Department;
      setDepartments(prev => [...prev, newDepartment]);
      toast({ title: 'Department Added', description: 'The department has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartment) {
      setDepartments(prev => prev.filter(d => d.department_id !== selectedDepartment.department_id));
      toast({ title: 'Department Deleted', description: 'The department has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Location'];
    const csvContent = [
      headers.join(','),
      ...departments.map(d => [d.department_id, d.department_name, `"${d.department_location}"`].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'departments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Departments have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage agency departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <DataTable
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search departments..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDepartment ? 'Edit Department' : 'Add Department'}
        onSubmit={handleSubmit}
        submitLabel={selectedDepartment ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Department Name *</label>
            <input
              type="text"
              value={formData.department_name || ''}
              onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
              className="form-input"
              placeholder="e.g., Sales, Rentals"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              value={formData.department_location || ''}
              onChange={(e) => setFormData({ ...formData, department_location: e.target.value })}
              className="form-input"
              placeholder="e.g., Los Angeles HQ"
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
      />
    </div>
  );
}
