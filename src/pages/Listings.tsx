import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockListings, mockProperties, mockAgents } from '@/data/mockData';
import { Listing } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const statusOptions = ['Active', 'Inactive', 'Expired'] as const;

export default function Listings() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState<Partial<Listing>>({});

  const getPropertyAddress = (propId: string) => {
    const prop = mockProperties.find(p => p.property_id === propId);
    return prop?.address || propId;
  };

  const getAgentName = (agentId: string) => {
    const agent = mockAgents.find(a => a.agent_id === agentId);
    return agent ? `${agent.f_name} ${agent.l_name}` : agentId;
  };

  const columns = [
    { key: 'listing_id', header: 'ID' },
    { key: 'property_id', header: 'Property', render: (item: Listing) => (
      <span className="font-medium">{getPropertyAddress(item.property_id)}</span>
    )},
    { key: 'agent_id', header: 'Agent', render: (item: Listing) => (
      <span className="text-primary">{getAgentName(item.agent_id)}</span>
    )},
    { key: 'price', header: 'Price', render: (item: Listing) => (
      <span className="font-semibold text-primary">${item.price.toLocaleString()}</span>
    )},
    { key: 'listing_date', header: 'Listed Date', render: (item: Listing) => (
      new Date(item.listing_date).toLocaleDateString()
    )},
    { key: 'status', header: 'Status', render: (item: Listing) => (
      <StatusBadge status={item.status} />
    )},
  ];

  const handleAdd = () => {
    setSelectedListing(null);
    setFormData({ status: 'Active', property_id: mockProperties[0]?.property_id, agent_id: mockAgents[0]?.agent_id });
    setIsModalOpen(true);
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setFormData(listing);
    setIsModalOpen(true);
  };

  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.property_id || !formData.agent_id || !formData.price || !formData.listing_date) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (formData.price < 0) {
      toast({ title: 'Validation Error', description: 'Price must be greater than or equal to 0.', variant: 'destructive' });
      return;
    }

    if (selectedListing) {
      setListings(prev => prev.map(l => l.listing_id === selectedListing.listing_id ? { ...l, ...formData } as Listing : l));
      toast({ title: 'Listing Updated', description: 'The listing has been successfully updated.' });
    } else {
      const newListing: Listing = {
        ...formData,
        listing_id: `L${String(listings.length + 1).padStart(3, '0')}`,
      } as Listing;
      setListings(prev => [...prev, newListing]);
      toast({ title: 'Listing Added', description: 'The listing has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedListing) {
      setListings(prev => prev.filter(l => l.listing_id !== selectedListing.listing_id));
      toast({ title: 'Listing Deleted', description: 'The listing has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Property', 'Agent', 'Price', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...listings.map(l => [l.listing_id, `"${getPropertyAddress(l.property_id)}"`, getAgentName(l.agent_id), l.price, l.listing_date, l.status].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Listings have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Listings</h1>
          <p className="page-subtitle">Manage property listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      <DataTable
        data={listings}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search listings..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedListing ? 'Edit Listing' : 'Add Listing'}
        onSubmit={handleSubmit}
        submitLabel={selectedListing ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
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
              <label className="block text-sm font-medium mb-2">Agent *</label>
              <select
                value={formData.agent_id || ''}
                onChange={(e) => setFormData({ ...formData, agent_id: e.target.value })}
                className="form-input"
              >
                {mockAgents.map(a => (
                  <option key={a.agent_id} value={a.agent_id}>{a.f_name} {a.l_name}</option>
                ))}
              </select>
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
              <label className="block text-sm font-medium mb-2">Listing Date *</label>
              <input
                type="date"
                value={formData.listing_date || ''}
                onChange={(e) => setFormData({ ...formData, listing_date: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Listing['status'] })}
                className="form-input"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
      />
    </div>
  );
}
