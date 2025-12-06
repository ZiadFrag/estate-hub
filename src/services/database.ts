import apiClient from './api';

// Types for database operations
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface QueryOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Execute a database query through the API
 */
export const executeQuery = async <T = any>(
  query: string,
  options?: QueryOptions
): Promise<T> => {
  try {
    const response = await apiClient.post('/api/query', {
      query,
      ...options,
    });
    return response.data as T;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

/**
 * Fetch data from a specific table
 */
export const fetchFromTable = async <T = any>(
  tableName: string,
  filters?: Record<string, any>,
  options?: QueryOptions
): Promise<T[]> => {
  try {
    const response = await apiClient.get(`/api/tables/${tableName}`, {
      params: filters,
      ...options,
    });
    return response.data as T[];
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Insert data into a table
 */
export const insertIntoTable = async <T = any>(
  tableName: string,
  data: Record<string, any>,
  options?: QueryOptions
): Promise<T> => {
  try {
    const response = await apiClient.post(`/api/tables/${tableName}`, data, options);
    return response.data as T;
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
};

/**
 * Update data in a table
 */
export const updateTable = async <T = any>(
  tableName: string,
  id: string | number,
  data: Record<string, any>,
  options?: QueryOptions
): Promise<T> => {
  try {
    const response = await apiClient.put(
      `/api/tables/${tableName}/${id}`,
      data,
      options
    );
    return response.data as T;
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
};

/**
 * Delete data from a table
 */
export const deleteFromTable = async (
  tableName: string,
  id: string | number,
  options?: QueryOptions
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(
      `/api/tables/${tableName}/${id}`,
      options
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Get database health status
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/health');
    return response.status === 200;
  } catch {
    return false;
  }
};
