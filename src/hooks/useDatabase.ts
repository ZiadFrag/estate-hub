import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFromTable,
  insertIntoTable,
  updateTable,
  deleteFromTable,
  checkDatabaseConnection,
} from '@/services/database';

/**
 * Hook to fetch data from any table with caching and automatic refetching
 */
export const useFetchTable = <T = any>(
  tableName: string,
  filters?: Record<string, any>,
  enabled = true
) => {
  return useQuery({
    queryKey: [tableName, filters],
    queryFn: () => fetchFromTable<T>(tableName, filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to insert data into a table
 */
export const useInsertIntoTable = <T = any>(tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => insertIntoTable<T>(tableName, data),
    onSuccess: () => {
      // Invalidate and refetch table data
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
};

/**
 * Hook to update data in a table
 */
export const useUpdateTable = <T = any>(tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Record<string, any> }) =>
      updateTable<T>(tableName, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
};

/**
 * Hook to delete data from a table
 */
export const useDeleteFromTable = (tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteFromTable(tableName, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
};

/**
 * Hook to check database connection status
 */
export const useDatabaseConnection = () => {
  return useQuery({
    queryKey: ['db-health'],
    queryFn: checkDatabaseConnection,
    refetchInterval: 30000, // Check every 30 seconds
  });
};
