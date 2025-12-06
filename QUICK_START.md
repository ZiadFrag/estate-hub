# Estate Hub - Database Connection Quick Start

## ✅ Setup Complete!

Your React application has been configured to connect to the **Real_Estate_Agency** database. Here's what was installed and created:

## 📦 Installed Packages

### Frontend (React)
- ✅ `axios` - HTTP client for API requests

### Backend API
- ✅ `express` - Web framework
- ✅ `mssql` - SQL Server driver
- ✅ `cors` - Cross-origin requests
- ✅ `dotenv` - Environment variables
- ✅ `body-parser` - Request parsing
- ✅ `nodemon` - Auto-reload development server

## 📁 Created Files & Folders

### React Application
```
src/
├── services/
│   ├── api.ts                 # HTTP client with interceptors
│   └── database.ts            # Database operation functions
├── hooks/
│   └── useDatabase.ts         # React Query hooks for CRUD operations
├── components/examples/
│   └── DatabaseExample.tsx    # Example component with database operations
└── types/
    └── database.ts            # TypeScript interfaces for all tables
```

### Backend API
```
api/
├── server.js                  # Express server with API routes
├── database.js                # SQL Server connection manager
├── queryBuilder.js            # Query helper functions
├── package.json               # Dependencies
└── .env                       # Environment configuration
```

### Configuration Files
```
.env.local                      # Frontend environment variables
DATABASE_SETUP.md               # Detailed setup guide
setup-db.sh                     # Setup script (Linux/Mac)
setup-db.ps1                    # Setup script (Windows PowerShell)
QUICK_START.md                  # This file
```

## 🔧 Configuration Steps

### Step 1: Update Frontend Configuration
Edit `.env.local` in the project root:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_DB_HOST=localhost
VITE_DB_PORT=1433
VITE_DB_USER=sa
VITE_DB_PASSWORD=your_sql_password
VITE_DB_NAME=Real_Estate_Agency
```

### Step 2: Update Backend Configuration
Edit `api/.env`:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_sql_password
DB_NAME=Real_Estate_Agency
API_PORT=3001
NODE_ENV=development
```

**Important:** Replace `your_sql_password` with your actual SQL Server password.

## 🚀 Running the Application

### Terminal 1 - Backend API Server

```bash
cd api
npm run dev
```

Expected output:
```
✓ Database connected successfully
🚀 API Server running on http://localhost:3001
📦 Database: Real_Estate_Agency
🔌 Host: localhost:1433
```

### Terminal 2 - Frontend React App

```bash
npm run dev
```

Access the application at: `http://localhost:8080`

## 📝 Quick Usage Examples

### Fetch Data from Database

```tsx
import { useFetchTable } from '@/hooks/useDatabase';
import { Property } from '@/types/database';

function PropertyList() {
  const { data: properties, isLoading } = useFetchTable<Property[]>('Properties');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {properties?.map(prop => (
        <div key={prop.property_id}>{prop.address} - ${prop.price}</div>
      ))}
    </div>
  );
}
```

### Insert New Record

```tsx
import { useInsertIntoTable } from '@/hooks/useDatabase';

function AddProperty() {
  const insertMutation = useInsertIntoTable('Properties');

  const handleAdd = () => {
    insertMutation.mutate({
      address: '123 Main St',
      price: 500000,
      city: 'New York',
      status: 'Available',
      property_type: 'House'
    });
  };

  return <button onClick={handleAdd}>Add Property</button>;
}
```

### Update Record

```tsx
import { useUpdateTable } from '@/hooks/useDatabase';

function UpdateProperty({ id }) {
  const updateMutation = useUpdateTable('Properties');

  const handleUpdate = () => {
    updateMutation.mutate({
      id,
      data: { status: 'Sold' }
    });
  };

  return <button onClick={handleUpdate}>Mark as Sold</button>;
}
```

### Delete Record

```tsx
import { useDeleteFromTable } from '@/hooks/useDatabase';

function DeleteProperty({ id }) {
  const deleteMutation = useDeleteFromTable('Properties');

  return (
    <button onClick={() => deleteMutation.mutate(id)}>
      Delete
    </button>
  );
}
```

## 🔍 Available Database Operations

All operations are available through custom hooks:

| Hook | Operation | Example |
|------|-----------|---------|
| `useFetchTable` | Read | `useFetchTable('Properties')` |
| `useInsertIntoTable` | Create | `useInsertIntoTable('Properties')` |
| `useUpdateTable` | Update | `useUpdateTable('Properties')` |
| `useDeleteFromTable` | Delete | `useDeleteFromTable('Properties')` |
| `useDatabaseConnection` | Health Check | `useDatabaseConnection()` |

## 📊 Database Tables

The following tables are supported:

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

See `src/types/database.ts` for all TypeScript interfaces.

## 🧪 Test Your Connection

After starting both frontend and backend:

1. Open browser console (F12)
2. Go to any page in the application
3. Check the Network tab for API calls to `http://localhost:3001`
4. Verify data is being fetched correctly

## 🐛 Troubleshooting

### "Cannot connect to database"
- ✅ Is SQL Server running?
- ✅ Database `Real_Estate_Agency` exists?
- ✅ Credentials in `.env` are correct?
- ✅ Check Windows Firewall allows SQL Server (port 1433)

### "CORS error"
- ✅ Is backend running on port 3001?
- ✅ Check `VITE_API_BASE_URL` in `.env.local`

### "API not responding"
- ✅ Terminal 1: `cd api && npm run dev`
- ✅ Wait for "Database connected successfully" message
- ✅ Check port 3001 is not in use: `netstat -ano | findstr :3001`

### "Module not found (axios, mssql, etc.)"
- ✅ Run `npm install axios` in project root
- ✅ Run `npm install` in `api/` folder

## 📚 Additional Resources

- [API Endpoints Documentation](./DATABASE_SETUP.md)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Express.js Guide](https://expressjs.com/)
- [SQL Server Node Module](https://github.com/tediousjs/node-mssql)

## 🎉 You're All Set!

Your React application is now fully configured to communicate with your Real_Estate_Agency database!

Questions? Check `DATABASE_SETUP.md` for detailed information about API endpoints and advanced usage.
