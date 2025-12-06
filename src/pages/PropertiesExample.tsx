import { useFetchTable, useInsertIntoTable, useUpdateTable, useDeleteFromTable } from '@/hooks/useDatabase';
import { Property } from '@/types/database';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

/**
 * Properties Page - Integration Example
 * 
 * This is an example of how to replace the mock data with real database queries.
 * You can use this pattern for other pages (Clients, Agents, Contracts, etc.)
 */

export function PropertiesPage() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch all properties from database
  const { 
    data: properties = [], 
    isLoading, 
    error 
  } = useFetchTable<Property>('Properties');

  // Setup mutations for CRUD operations
  const insertMutation = useInsertIntoTable('Properties');
  const updateMutation = useUpdateTable('Properties');
  const deleteMutation = useDeleteFromTable('Properties');

  // Handle insert
  const handleInsertProperty = async (newProperty: Partial<Property>) => {
    try {
      await insertMutation.mutateAsync(newProperty);
      toast({
        title: 'Success',
        description: 'Property added successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle update
  const handleUpdateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: updates
      });
      toast({
        title: 'Success',
        description: 'Property updated successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Handle delete
  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Property deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading properties...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading properties: {(error as Error).message}
      </div>
    );
  }

  // Define columns for DataTable
  const columns = [
    { key: 'property_id', header: 'ID' },
    { key: 'address', header: 'Address' },
    { key: 'city', header: 'City' },
    { key: 'price', header: 'Price', render: (property: Property) => `$${property.price.toLocaleString()}` },
    { key: 'property_type', header: 'Type' },
    { key: 'status', header: 'Status' },
    { key: 'size_properties', header: 'Size (sqft)' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button onClick={() => {
          // Open add property modal
          handleInsertProperty({
            address: 'New Property',
            price: 0,
            status: 'Available',
            property_type: 'House',
            city: '',
            size_properties: 0
          });
        }}>
          Add Property
        </Button>
      </div>

      <DataTable
        data={properties}
        columns={columns}
        onView={(property) => setSelectedId(property.property_id)}
        onDelete={(property) => handleDeleteProperty(property.property_id)}
        onEdit={(property) => {
          // Open edit modal
          console.log('Edit property:', property);
        }}
      />

      {selectedId && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Property Details</h3>
          {properties.find(p => p.property_id === selectedId) && (
            <pre>
              {JSON.stringify(
                properties.find(p => p.property_id === selectedId),
                null,
                2
              )}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;

/**
 * INTEGRATION GUIDE
 * 
 * To integrate database queries with your existing pages:
 * 
 * 1. Import the custom hooks:
 *    import { useFetchTable, useInsertIntoTable, useUpdateTable, useDeleteFromTable } from '@/hooks/useDatabase';
 * 
 * 2. Import the correct TypeScript type:
 *    import { Property, Client, Agent, etc. } from '@/types/database';
 * 
 * 3. Use the hooks in your page:
 *    const { data, isLoading, error } = useFetchTable<TypeName[]>('TableName');
 * 
 * 4. Replace mock data with real data:
 *    - Replace mockData.properties with data from useFetchTable
 *    - Use mutations for CRUD operations
 *    - Add loading/error states
 * 
 * EXAMPLE TABLE NAMES:
 * - 'Properties' → Property[]
 * - 'Clients' → Client[]
 * - 'Agents' → Agent[]
 * - 'Contracts' → Contract[]
 * - 'Payments' → Payment[]
 * - 'Owners' → Owner[]
 * - 'Departments' → Department[]
 * - 'Branches' → Branch[]
 * - 'PropertyVisits' → PropertyVisit[]
 * - 'Listings' → Listing[]
 * 
 * ERROR HANDLING:
 * - Wrap mutations in try/catch
 * - Use toast notifications for user feedback
 * - Display error messages in the UI
 * 
 * LOADING STATES:
 * - Show loading spinner while fetching
 * - Show error message if query fails
 * - Show mutation loading state for buttons
 * 
 * PERFORMANCE:
 * - Data is cached for 5 minutes
 * - Mutations automatically invalidate cache
 * - Use filters for large datasets: useFetchTable('Properties', { city: 'NYC' })
 */
