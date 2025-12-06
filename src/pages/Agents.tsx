import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { mockAgents, mockDepartments } from '@/data/mockData';
import { Agent } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function Agents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<Partial<Agent>>({});

  const getDepartmentName = (deptId: string) => {
    const dept = mockDepartments.find(d => d.department_id === deptId);
    return dept?.department_name || deptId;
  };

  const columns = [
    { key: 'agent_id', header: 'ID' },
    { key: 'name', header: 'Name', render: (item: Agent) => (
      <span className="font-medium">{item.f_name} {item.l_name}</span>
    )},
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'department_id', header: 'Department', render: (item: Agent) => (
      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
        {getDepartmentName(item.department_id)}
      </span>
    )},
  ];

  const handleAdd = () => {
    setSelectedAgent(null);
    setFormData({ department_id: mockDepartments[0]?.department_id });
    setIsModalOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData(agent);
    setIsModalOpen(true);
  };

  const handleDelete = (agent: Agent) => {
    setSelectedAgent(agent);
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

    const emailExists = agents.some(a => a.email === formData.email && a.agent_id !== selectedAgent?.agent_id);
    if (emailExists) {
      toast({ title: 'Validation Error', description: 'An agent with this email already exists.', variant: 'destructive' });
      return;
    }

    if (selectedAgent) {
      setAgents(prev => prev.map(a => a.agent_id === selectedAgent.agent_id ? { ...a, ...formData } as Agent : a));
      toast({ title: 'Agent Updated', description: 'The agent has been successfully updated.' });
    } else {
      const newAgent: Agent = {
        ...formData,
        agent_id: `A${String(agents.length + 1).padStart(3, '0')}`,
      } as Agent;
      setAgents(prev => [...prev, newAgent]);
      toast({ title: 'Agent Added', description: 'The agent has been successfully added.' });
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      setAgents(prev => prev.filter(a => a.agent_id !== selectedAgent.agent_id));
      toast({ title: 'Agent Deleted', description: 'The agent has been successfully deleted.' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department'];
    const csvContent = [
      headers.join(','),
      ...agents.map(a => [a.agent_id, a.f_name, a.l_name, a.email, a.phone, getDepartmentName(a.department_id)].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agents.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Export Complete', description: 'Agents have been exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Agents</h1>
          <p className="page-subtitle">Manage your real estate agents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Agent
          </Button>
        </div>
      </div>

      <DataTable
        data={agents}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search agents..."
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAgent ? 'Edit Agent' : 'Add Agent'}
        onSubmit={handleSubmit}
        submitLabel={selectedAgent ? 'Update' : 'Add'}
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
              placeholder="email@realestate.com"
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
        </div>
      </FormModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Agent"
        message="Are you sure you want to delete this agent? This action cannot be undone."
      />
    </div>
  );
}
