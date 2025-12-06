# Estate Hub - Database Integration Checklist

## ✅ Setup Complete - What You Have Now

### 1. Frontend Infrastructure
- [x] HTTP client (`axios`) configured
- [x] API service layer (`src/services/api.ts`)
- [x] Database operations wrapper (`src/services/database.ts`)
- [x] React Query hooks (`src/hooks/useDatabase.ts`)
- [x] TypeScript interfaces (`src/types/database.ts`)
- [x] Example component (`src/components/examples/DatabaseExample.tsx`)

### 2. Backend API Server
- [x] Express.js server
- [x] SQL Server connection pooling
- [x] Query builder utilities
- [x] 7 API route groups
- [x] Error handling middleware
- [x] CORS enabled

### 3. Dependencies
- [x] `axios` installed
- [x] `express` installed
- [x] `mssql` installed
- [x] `cors` installed
- [x] `dotenv` installed
- [x] `body-parser` installed
- [x] `nodemon` installed

### 4. Configuration Files
- [x] `.env.local` created (frontend)
- [x] `api/.env` created (backend)

### 5. Documentation
- [x] `DATABASE_SETUP.md` - Detailed setup guide
- [x] `QUICK_START.md` - Quick reference
- [x] `INTEGRATION_SUMMARY.md` - Overview
- [x] `PropertiesExample.tsx` - Integration example

---

## 🔧 NEXT STEPS - What You Need to Do

### Step 1: Configure Database Credentials (REQUIRED)

**File: `.env.local`**
```bash
# Open the file and replace:
VITE_DB_PASSWORD=your_sql_password
```

**File: `api/.env`**
```bash
# Open the file and replace:
DB_PASSWORD=your_sql_password
```

### Step 2: Start Backend Server (REQUIRED)

In PowerShell or Command Prompt:
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

### Step 3: Start Frontend Application (REQUIRED)

In another terminal:
```bash
npm run dev
```

Access at: `http://localhost:8080`

### Step 4: Test the Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to any application page
4. Look for requests to `http://localhost:3001/api/...`
5. Verify data loads correctly

---

## 📝 Integration Checklist - For Each Page

For each page you want to connect to the database:

- [ ] Import hooks: `import { useFetchTable, ... } from '@/hooks/useDatabase'`
- [ ] Import type: `import { PropertyType } from '@/types/database'`
- [ ] Add hook: `const { data } = useFetchTable<PropertyType[]>('TableName')`
- [ ] Replace mock data with `data`
- [ ] Add insert mutation: `const insertMutation = useInsertIntoTable('TableName')`
- [ ] Add update mutation: `const updateMutation = useUpdateTable('TableName')`
- [ ] Add delete mutation: `const deleteMutation = useDeleteFromTable('TableName')`
- [ ] Add loading state: `if (isLoading) return <Loading />`
- [ ] Add error state: `if (error) return <Error />`
- [ ] Add toast notifications for mutations
- [ ] Test CRUD operations
- [ ] Test error handling

## 📊 Table Integration List

- [ ] Dashboard - Fetch summary data
- [ ] Properties - Full CRUD operations
- [ ] Clients - Full CRUD operations
- [ ] Agents - Full CRUD operations
- [ ] Contracts - Full CRUD operations
- [ ] Payments - Full CRUD operations
- [ ] Owners - Full CRUD operations
- [ ] Departments - Full CRUD operations
- [ ] Branches - Full CRUD operations
- [ ] Property Visits - Full CRUD operations
- [ ] Listings - Full CRUD operations

## 🐛 Troubleshooting Checklist

### Can't Start Backend
- [ ] Is SQL Server installed and running?
- [ ] Database `Real_Estate_Agency` exists?
- [ ] Credentials in `api/.env` correct?
- [ ] Port 1433 is accessible?
- [ ] Try: `sqlcmd -S localhost -U sa -P your_password`

### CORS Errors in Browser
- [ ] Is backend running on port 3001?
- [ ] Check `VITE_API_BASE_URL` in `.env.local`
- [ ] Browser console should show API URL

### API Returns Errors
- [ ] Check terminal where backend is running
- [ ] Look for SQL error messages
- [ ] Verify table names are correct
- [ ] Check data types match database schema

### No Data Showing
- [ ] Verify backend is running
- [ ] Check Network tab for API response
- [ ] Add `console.log(data)` to component
- [ ] Check browser console for errors
- [ ] Verify tables have data in SQL Server

### "Module not found"
- [ ] Run `npm install` in project root
- [ ] Run `npm install` in `api/` folder
- [ ] Delete `node_modules` and reinstall
- [ ] Restart backend server

---

## 🎯 Quick Reference

### Start Backend
```bash
cd api && npm run dev
```

### Start Frontend
```bash
npm run dev
```

### Fetch Data
```tsx
const { data } = useFetchTable('TableName');
```

### Insert Data
```tsx
const insert = useInsertIntoTable('TableName');
insert.mutate({ field1: value1, field2: value2 });
```

### Update Data
```tsx
const update = useUpdateTable('TableName');
update.mutate({ id: '123', data: { field: newValue } });
```

### Delete Data
```tsx
const delete = useDeleteFromTable('TableName');
delete.mutate('123');
```

### Get Status
```tsx
const { data: isConnected } = useDatabaseConnection();
```

---

## 📚 Useful Files to Read

1. **DATABASE_SETUP.md** - Full setup instructions
2. **QUICK_START.md** - Quick reference guide
3. **PropertiesExample.tsx** - Integration example
4. **src/hooks/useDatabase.ts** - Hook documentation
5. **src/services/database.ts** - Operation documentation

---

## ✨ Features Available

✅ Fetch data with automatic caching  
✅ Insert new records  
✅ Update existing records  
✅ Delete records  
✅ Custom SQL queries  
✅ Error handling  
✅ Loading states  
✅ Toast notifications  
✅ Type safety (TypeScript)  
✅ Connection pooling  
✅ CORS support  

---

## 🎓 Learning Resources

- Read `PropertiesExample.tsx` for integration pattern
- Review `src/hooks/useDatabase.ts` for hook usage
- Check `src/services/database.ts` for operation details
- See `src/types/database.ts` for available tables
- Review `api/server.js` to understand API structure

---

## 📞 Summary

**Status:** ✅ Ready to use  
**Backend:** Running on `http://localhost:3001`  
**Frontend:** Running on `http://localhost:8080`  
**Database:** `Real_Estate_Agency` on `localhost:1433`  

Your React application is now fully integrated with your SQL Server database!

Start by following the "Next Steps" section above.
