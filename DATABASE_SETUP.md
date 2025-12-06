# Estate Hub - Database Setup Guide

## 📦 Setup Instructions

### 1. Frontend (React) Setup

The React application has been configured to connect to your `Real_Estate_Agency` database through a backend API.

#### Files Created:

- **`src/services/api.ts`** - HTTP client configuration (axios)
- **`src/services/database.ts`** - Database operation functions
- **`src/hooks/useDatabase.ts`** - React Query hooks for data fetching
- **`src/types/database.ts`** - TypeScript interfaces for all database tables
- **`.env.local`** - Environment configuration

#### Configuration:

Edit `.env.local` with your database details:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_DB_HOST=localhost
VITE_DB_PORT=1433
VITE_DB_USER=sa
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=Real_Estate_Agency
```

### 2. Backend API Setup

A Node.js/Express API server has been created to handle database connections.

#### Files Created:

- **`api/server.js`** - Express server with API routes
- **`api/database.js`** - SQL Server connection manager
- **`api/queryBuilder.js`** - Database query helpers
- **`api/package.json`** - Dependencies
- **`api/.env`** - Backend environment configuration

#### Installation:

```bash
# Navigate to api folder
cd api

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

#### Configuration:

Edit `api/.env` with your SQL Server details:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=Real_Estate_Agency
API_PORT=3001
NODE_ENV=development
```

#### Start Backend Server:

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The API will run on `http://localhost:3001`

### 3. Testing Connection

Once both frontend and backend are running:

1. **Start Frontend**: `npm run dev` (from project root)
2. **Start Backend**: `npm run dev` (from `api/` folder)
3. Visit `http://localhost:8080` to access the application

### 4. Using Database Operations

#### Fetch Data:

```tsx
import { useFetchTable } from '@/hooks/useDatabase';
import { Property } from '@/types/database';

const MyComponent = () => {
  const { data: properties, isLoading, error } = useFetchTable<Property[]>('Properties');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {properties?.map(prop => (
        <div key={prop.property_id}>{prop.address}</div>
      ))}
    </div>
  );
};
```

#### Insert Data:

```tsx
import { useInsertIntoTable } from '@/hooks/useDatabase';

const MyComponent = () => {
  const insertMutation = useInsertIntoTable('Properties');

  const handleAdd = async () => {
    await insertMutation.mutateAsync({
      address: '123 Main St',
      price: 500000,
      status: 'Available'
    });
  };

  return <button onClick={handleAdd}>Add Property</button>;
};
```

#### Update Data:

```tsx
import { useUpdateTable } from '@/hooks/useDatabase';

const MyComponent = () => {
  const updateMutation = useUpdateTable('Properties');

  const handleUpdate = async (id: string) => {
    await updateMutation.mutateAsync({
      id,
      data: { status: 'Sold' }
    });
  };

  return <button onClick={() => handleUpdate('1')}>Update</button>;
};
```

#### Delete Data:

```tsx
import { useDeleteFromTable } from '@/hooks/useDatabase';

const MyComponent = () => {
  const deleteMutation = useDeleteFromTable('Properties');

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return <button onClick={() => handleDelete('1')}>Delete</button>;
};
```

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Check database connection status

### Tables
- `GET /api/tables` - Get all table names
- `GET /api/tables/:tableName` - Fetch records from a table
- `GET /api/tables/:tableName/structure` - Get table structure/schema
- `POST /api/tables/:tableName` - Insert record
- `PUT /api/tables/:tableName/:id` - Update record
- `DELETE /api/tables/:tableName/:id` - Delete record

### Custom Queries
- `POST /api/query` - Execute custom SQL query

## 🔧 Supported Database Tables

- Properties
- Clients
- Agents
- Contracts
- Payments
- Owners
- Departments
- Branches
- PropertyVisits
- Listings

## 📝 Notes

1. **CORS**: The backend allows requests from all origins. For production, configure CORS properly.
2. **Security**: Don't hardcode sensitive credentials in `.env` files. Use proper secret management.
3. **Error Handling**: All requests include error handling. Check console for detailed errors.
4. **Caching**: React Query caches data for 5 minutes by default to improve performance.

## 🐛 Troubleshooting

### Database Connection Failed
- Verify SQL Server is running
- Check credentials in `.env` files
- Ensure database `Real_Estate_Agency` exists
- Test connection from SQL Server Management Studio first

### CORS Errors
- Verify backend API is running on port 3001
- Check `VITE_API_BASE_URL` in `.env.local`

### Connection Timeout
- Increase timeout values in `api/database.js`
- Check firewall settings
- Verify SQL Server authentication is enabled

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Express.js Documentation](https://expressjs.com/)
- [MSSQL Node Package](https://github.com/tediousjs/node-mssql)
- [Axios Documentation](https://axios-http.com/)
