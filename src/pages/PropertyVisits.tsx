import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockPropertyVisits, mockProperties, mockAgents } from '@/data/mockData';
import { PropertyVisit } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function PropertyVisits() {
  const { toast } = useToast();
  const [visits, setVisits] = useState<PropertyVisit[]>(mockPropertyVisits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<PropertyVisit | null>(null);
  const [formData, setFormData] = useState<Partial<PropertyVisit>>({});

  const getPropertyAddress = (propId: string) => {
    const prop = mockProperties.find(p => p.property_id === propId);
    return prop?.address || propId;
  };

  const getAgentName = (agentId: string) => {
    const agent = mockAgents.find(a => a.agent_id === agentId);
    return agent ? `${agent.f_name} ${agent.l_name}` : agentId;
  };

  const columns = [
    { key: 'visit_id', header: 'ID' },
    { key: 'property_id', header: 'Property', render: (item: PropertyVisit) => (
      <span className="font-medium">{getPropertyAddress(item.property_id)}</span>
    )},
    { key: 'agent_id', header: 'Agent', render: (item: PropertyVisit) => (
      <span className="text-primary">{getAgentName(item.agent_id)}</span>
    )},
    { key: 'visit_date', header: 'Date', render: (item: PropertyVisit) => (
      new Date(item.visit_date).toLocaleDateString()
    )},
    { key: 'notes', header: 'Notes', render: (item: PropertyVisit) => (
      <span className="text-sm text-muted-foreground truncate max-w-xs block">{item.notes}</span>
    )},
  ];

  const handleAdd = () => {
    setSelectedVisit(null);
    setFormData({ property_id: mockProperties[0]?.property_id, agent_id: mockAgents[0]?.agent_id });
    setIsModalOpen(true);
  };

  const handleEdit = (visit: PropertyVisit) => {
    setSelectedVisit(visit);
    setFormData(visit);
    setIsModalOpen(true);
  };

  const handleDelete = (visit: PropertyVisit) => {
    setSelectedVisit(visit);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.property_id || !formData.agent_id || !formData.visit_date) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (selectedVisit) {
      setVisits(prev => prev.map(v => v.visit_id === selectedVisit.visit_id ? { ...v, ...formData } as PropertyVisit : v));
      toast({ title: 'Visit Updated', description: 'The property visit has been successfully updated.' });
    } else {
      const newVisit: PropertyVisit = {
        ...formData,
        visit_id: `V${String(visits.length + 1).padStart(3, '0')}`,
      } as PropertyVisit;
      setVisits(prev => [...prev, newVisit]);
      toast({ title: 'Visit Added', description: 'The property visit has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedVisit) {
      setVisits(prev => prev.filter(v => v.visit_id !== selectedVisit.visit_id));
      toast({ title: 'Visit Deleted', description: 'The property visit has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Property', 'Agent', 'Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...visits.map(v => [v.visit_id, `"${getPropertyAddress(v.property_id)}"`, getAgentName(v.agent_id), v.visit_date, `"${v.notes}"`].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property_visits.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Property visits have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Property Visits</h1>
          <p className="page-subtitle">Schedule and track property showings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Visit
          </Button>
        </div>
      </div>

      <DataTable
        data={visits}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search visits..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedVisit ? 'Edit Visit' : 'Schedule Visit'}
        onSubmit={handleSubmit}
        submitLabel={selectedVisit ? 'Update' : 'Schedule'}
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
              <label className="block text-sm font-medium mb-2">Visit Date *</label>
              <input
                type="date"
                value={formData.visit_date || ''}
                onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-input min-h-[100px] resize-none"
              placeholder="Add visit notes..."
            />
          </div>
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Visit"
        message="Are you sure you want to delete this property visit? This action cannot be undone."
      />
    </div>
  );
}
