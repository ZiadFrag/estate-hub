import sql from 'mssql';

/**
 * Execute a custom SQL query
 */
export const executeQuery = async (pool, query, params = []) => {
  try {
    const request = pool.request();
    
    // Add parameters if provided
    if (Array.isArray(params)) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
    } else if (typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

/**
 * Fetch all records from a table
 */
export const fetchFromTable = async (pool, tableName, filters = {}) => {
  try {
    let query = `SELECT * FROM ${tableName}`;
    const request = pool.request();

    if (Object.keys(filters).length > 0) {
      const whereConditions = Object.keys(filters).map((key, index) => {
        request.input(`filter_${key}`, filters[key]);
        return `${key} = @filter_${key}`;
      });
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Insert a record into a table
 */
export const insertIntoTable = async (pool, tableName, data) => {
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const request = pool.request();

    columns.forEach((col, index) => {
      request.input(col, values[index]);
    });

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) 
                   VALUES (${columns.map(col => `@${col}`).join(', ')})`;

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
};

/**
 * Update a record in a table
 */
export const updateTable = async (pool, tableName, id, data, idField = 'id') => {
  try {
    const columns = Object.keys(data);
    const request = pool.request();

    request.input('id', id);
    columns.forEach((col) => {
      request.input(col, data[col]);
    });

    const setClause = columns.map(col => `${col} = @${col}`).join(', ');
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = @id`;

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
};

/**
 * Delete a record from a table
 */
export const deleteFromTable = async (pool, tableName, id, idField = 'id') => {
  try {
    const request = pool.request();
    request.input('id', id);

    const query = `DELETE FROM ${tableName} WHERE ${idField} = @id`;
    const result = await request.query(query);

    return {
      success: result.rowsAffected[0] > 0,
      message: result.rowsAffected[0] > 0 ? 'Record deleted successfully' : 'No record found'
    };
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Get row count from a table
 */
export const getTableCount = async (pool, tableName) => {
  try {
    const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result.recordset[0].count;
  } catch (error) {
    console.error(`Error getting count from ${tableName}:`, error);
    throw error;
  }
};
