import { useState } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockProperties } from '@/data/mockData';
import { Property } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const propertyTypes = ['House', 'Apartment', 'Condo', 'Land', 'Commercial'] as const;
const statusOptions = ['Available', 'Sold', 'Pending', 'Rented'] as const;

export default function Properties() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});

  const columns = [
    { key: 'property_id', header: 'ID' },
    { key: 'address', header: 'Address', render: (item: Property) => (
      <span className="font-medium">{item.address}</span>
    )},
    { key: 'property_type', header: 'Type' },
    { key: 'city', header: 'City' },
    { key: 'price', header: 'Price', render: (item: Property) => (
      <span className="font-semibold text-primary">${item.price.toLocaleString()}</span>
    )},
    { key: 'size_properties', header: 'Size (sq ft)', render: (item: Property) => (
      <span>{item.size_properties.toLocaleString()}</span>
    )},
    { key: 'status', header: 'Status', render: (item: Property) => (
      <StatusBadge status={item.status} />
    )},
  ];

  const handleAdd = () => {
    setSelectedProperty(null);
    setFormData({
      property_type: 'House',
      status: 'Available',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData(property);
    setIsModalOpen(true);
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.address || !formData.city || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.price < 0) {
      toast({
        title: 'Validation Error',
        description: 'Price must be greater than or equal to 0.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedProperty) {
      // Update
      setProperties(prev =>
        prev.map(p => p.property_id === selectedProperty.property_id ? { ...p, ...formData } as Property : p)
      );
      toast({
        title: 'Property Updated',
        description: 'The property has been successfully updated.',
      });
    } else {
      // Create
      const newProperty: Property = {
        ...formData,
        property_id: `P${String(properties.length + 1).padStart(3, '0')}`,
      } as Property;
      setProperties(prev => [...prev, newProperty]);
      toast({
        title: 'Property Added',
        description: 'The property has been successfully added.',
      });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedProperty) {
      setProperties(prev => prev.filter(p => p.property_id !== selectedProperty.property_id));
      toast({
        title: 'Property Deleted',
        description: 'The property has been successfully deleted.',
      });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Type', 'Address', 'Price', 'City', 'Status', 'Size'];
    const csvContent = [
      headers.join(','),
      ...properties.map(p => [
        p.property_id,
        p.property_type,
        `"${p.address}"`,
        p.price,
        p.city,
        p.status,
        p.size_properties,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'properties.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Properties have been exported to CSV.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">Manage your property listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={properties}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search properties..."
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProperty ? 'Edit Property' : 'Add Property'}
        onSubmit={handleSubmit}
        submitLabel={selectedProperty ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Property Type *</label>
            <select
              value={formData.property_type || ''}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value as Property['property_type'] })}
              className="form-input"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              placeholder="Enter property address"
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
              <label className="block text-sm font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                min="0"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Size (sq ft)</label>
              <input
                type="number"
                min="0"
                value={formData.size_properties || ''}
                onChange={(e) => setFormData({ ...formData, size_properties: Number(e.target.value) })}
                className="form-input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Property['status'] })}
                className="form-input"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </div>
  );
}
