import { useEffect } from 'react';
import { useFetchTable, useInsertIntoTable, useUpdateTable, useDeleteFromTable } from '@/hooks/useDatabase';
import { Property } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

/**
 * Example component demonstrating database operations
 * Shows how to fetch, insert, update, and delete records
 */
export const DatabaseExample = () => {
  const { toast } = useToast();

  // Fetch all properties
  const {
    data: properties = [],
    isLoading,
    error
  } = useFetchTable<Property>('Properties');

  // Insert mutation
  const insertMutation = useInsertIntoTable('Properties');

  // Update mutation
  const updateMutation = useUpdateTable('Properties');

  // Delete mutation
  const deleteMutation = useDeleteFromTable('Properties');

  const handleInsertProperty = async () => {
    try {
      await insertMutation.mutateAsync({
        title: 'New Property',
        address: '123 Main St',
        price: 500000,
        status: 'Available'
      });
      toast({
        title: 'Success',
        description: 'Property added successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProperty = async (id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { status: 'Sold' }
      });
      toast({
        title: 'Success',
        description: 'Property updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Property deleted successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading properties</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Properties Management</h1>

      <Button onClick={handleInsertProperty} className="mb-4">
        Add New Property
      </Button>

      <div className="space-y-2">
        {properties?.map((property) => (
          <div key={property.property_id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{property.address}</h3>
            <p className="text-sm text-gray-600">Price: ${property.price}</p>
            <p className="text-sm text-gray-600">Status: {property.status}</p>
            <div className="mt-2 space-x-2">
              <Button
                size="sm"
                onClick={() => handleUpdateProperty(property.property_id)}
              >
                Update
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteProperty(property.property_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseExample;
