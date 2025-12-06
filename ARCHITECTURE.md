# Estate Hub - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Side)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  React Components (Dashboard, Properties, Clients, etc.)        │
│  ↓                                                                │
│  useDatabase Hooks (useFetchTable, useInsertIntoTable, etc.)   │
│  ↓                                                                │
│  React Query (Caching, Invalidation, Refetch)                  │
│  ↓                                                                │
│  api.ts (Axios HTTP Client with Interceptors)                  │
│  ↓                                                                │
│  HTTP Request/Response                                           │
│  ↓ (CORS Enabled)                                               │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          │ http://localhost:3001
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS API SERVER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Express Middleware (CORS, Body Parser, Error Handler)         │
│  ↓                                                                │
│  Route Handlers:                                                 │
│  • GET /api/health                                               │
│  • GET /api/tables                                               │
│  • GET /api/tables/:tableName                                    │
│  • POST /api/tables/:tableName                                   │
│  • PUT /api/tables/:tableName/:id                                │
│  • DELETE /api/tables/:tableName/:id                             │
│  • POST /api/query                                               │
│  ↓                                                                │
│  queryBuilder.js (SQL Query Functions)                          │
│  ↓                                                                │
│  database.js (Connection Pool Management)                       │
│  ↓                                                                │
│  SQL Query                                                       │
│  ↓                                                                │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          │ TDS Protocol (Port 1433)
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SQL SERVER DATABASE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Database: Real_Estate_Agency                                    │
│  ├── Properties                                                  │
│  ├── Clients                                                     │
│  ├── Agents                                                      │
│  ├── Contracts                                                   │
│  ├── Payments                                                    │
│  ├── Owners                                                      │
│  ├── Departments                                                 │
│  ├── Branches                                                    │
│  ├── PropertyVisits                                              │
│  └── Listings                                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure & Dependencies

```
estate-hub/
├── Frontend Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         ← useFetchTable('summary')
│   │   │   ├── Properties.tsx        ← useFetchTable('Properties')
│   │   │   ├── Clients.tsx          ← useFetchTable('Clients')
│   │   │   ├── Agents.tsx           ← useFetchTable('Agents')
│   │   │   ├── Contracts.tsx        ← useFetchTable('Contracts')
│   │   │   ├── Payments.tsx         ← useFetchTable('Payments')
│   │   │   ├── Owners.tsx           ← useFetchTable('Owners')
│   │   │   ├── Departments.tsx      ← useFetchTable('Departments')
│   │   │   ├── Branches.tsx         ← useFetchTable('Branches')
│   │   │   ├── PropertyVisits.tsx   ← useFetchTable('PropertyVisits')
│   │   │   └── Listings.tsx         ← useFetchTable('Listings')
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts               ← HTTP Client
│   │   │   └── database.ts          ← DB Operations
│   │   │
│   │   ├── hooks/
│   │   │   └── useDatabase.ts       ← React Query Hooks
│   │   │
│   │   ├── types/
│   │   │   └── database.ts          ← TypeScript Interfaces
│   │   │
│   │   ├── components/
│   │   │   └── examples/
│   │   │       └── DatabaseExample.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env.local                   ← Frontend Config
│   ├── package.json                 ← Frontend Dependencies
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── Backend API Server
│   ├── api/
│   │   ├── server.js                ← Express App
│   │   ├── database.js              ← DB Connection Pool
│   │   ├── queryBuilder.js          ← SQL Helpers
│   │   ├── package.json             ← Backend Dependencies
│   │   └── .env                     ← Backend Config
│
└── Documentation
    ├── DATABASE_SETUP.md            ← Detailed Setup
    ├── QUICK_START.md              ← Quick Reference
    ├── INTEGRATION_SUMMARY.md       ← Overview
    ├── SETUP_CHECKLIST.md          ← Action Items
    └── ARCHITECTURE.md              ← This File
```

## 🔄 Data Flow Examples

### Example 1: Fetch Properties
```
Component renders
    ↓
useFetchTable('Properties') hook
    ↓
apiClient.get('/api/tables/Properties')
    ↓
axios sends HTTP GET request
    ↓
server.js receives request at route handler
    ↓
queryBuilder.fetchFromTable('Properties')
    ↓
database.js executes: SELECT * FROM Properties
    ↓
SQL Server returns recordset
    ↓
server.js sends JSON response
    ↓
React Query receives data
    ↓
Component updates and displays data
```

### Example 2: Insert New Property
```
User clicks "Add Property" button
    ↓
insertMutation.mutate(propertyData)
    ↓
useMutation sends mutation
    ↓
apiClient.post('/api/tables/Properties', propertyData)
    ↓
axios sends HTTP POST request with data
    ↓
server.js receives request
    ↓
queryBuilder.insertIntoTable('Properties', data)
    ↓
database.js executes: INSERT INTO Properties (...)
    ↓
SQL Server inserts record and returns count
    ↓
server.js sends success response
    ↓
React Query invalidates 'Properties' cache
    ↓
useFetchTable('Properties') automatically refetches
    ↓
Component displays new data
    ↓
Toast notification shows success
```

### Example 3: Update Property
```
User clicks "Update" and changes status
    ↓
updateMutation.mutate({ id, data: { status: 'Sold' } })
    ↓
apiClient.put('/api/tables/Properties/:id', updateData)
    ↓
axios sends HTTP PUT request
    ↓
server.js receives request
    ↓
queryBuilder.updateTable('Properties', id, updateData)
    ↓
database.js executes: UPDATE Properties SET status = @status WHERE id = @id
    ↓
SQL Server updates record
    ↓
server.js sends success response
    ↓
React Query invalidates cache
    ↓
Data refetches and component updates
```

## 🔐 Data Security Flow

```
Frontend (Browser)
    ↓
CORS Check (allowed)
    ↓
Express Middleware
    ├── bodyParser (validate JSON)
    └── cors (check origin)
    ↓
Route Handler
    ├── Validate table name
    └── Validate user input
    ↓
queryBuilder
    └── Create parameterized query (prevent SQL injection)
    ↓
database
    ├── Use connection pool
    ├── Send parameterized query
    └── Receive encrypted data over TDS
    ↓
SQL Server
    └── Execute with least privilege user
    ↓
Response encrypted over TDS
    ↓
Express Response
    └── Convert to JSON
    ↓
Axios Response Interceptor
    ├── Check status
    └── Handle errors
    ↓
React Component
    ├── Display data
    └── Show errors if any
```

## 🚀 Request/Response Cycle

### HTTP Request Headers
```
GET /api/tables/Properties HTTP/1.1
Host: localhost:3001
Origin: http://localhost:8080
Content-Type: application/json
Authorization: Bearer token (if available)
```

### HTTP Response Headers
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Content-Type: application/json
Content-Length: 1234
```

### Request Body Example (POST)
```json
{
  "address": "123 Main Street",
  "city": "New York",
  "price": 500000,
  "status": "Available",
  "property_type": "House",
  "size_properties": 3500
}
```

### Response Body Example
```json
[
  {
    "property_id": "1",
    "address": "123 Main Street",
    "city": "New York",
    "price": 500000,
    "status": "Available",
    "property_type": "House",
    "size_properties": 3500
  }
]
```

## 📊 Data Caching Strategy

```
Initial Request:
useFetchTable('Properties')
    ↓
Cache miss
    ↓
API Request
    ↓
Data received and stored in cache
    ↓
Component displays data
    
Subsequent Request (within 5 minutes):
useFetchTable('Properties')
    ↓
Cache hit
    ↓
Data served from cache instantly
    ↓
Background refetch (stale-while-revalidate)
    
Mutation (insert/update/delete):
insertMutation.mutate(data)
    ↓
API Request
    ↓
On Success:
    - Invalidate 'Properties' cache
    - Trigger automatic refetch
    - Component updates
```

## 🔄 Synchronization Flow

```
Multiple Users on Same Database:

User A Updates Property
    ↓
useMutation.mutate()
    ↓
PUT /api/tables/Properties/:id
    ↓
SQL Server updates record
    ↓
Cache invalidated for User A
    ↓
User A sees updated data
    
User B (currently viewing):
    ↓
useFetchTable('Properties')
    ↓
Cache is still valid for User B
    ↓
User B doesn't see update yet
    ↓
After 5 minutes (cache expires) or:
    - User B manually refreshes
    - User B does another mutation
    
Best Practice:
    - Use optimistic updates
    - Or use WebSocket for real-time
    - Or reduce cache time
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **React Router** - Navigation
- **React Query (TanStack)** - Data Management
- **Axios** - HTTP Client
- **Zod/React Hook Form** - Form Management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MSSQL** - SQL Server Driver
- **CORS** - Cross-Origin Support
- **Nodemon** - Dev Auto-reload

### Database
- **SQL Server** - Database Engine
- **Real_Estate_Agency** - Database Name
- **10+ Tables** - Data Models

## 📈 Performance Optimizations

```
1. Connection Pooling
   - Reuse connections instead of creating new ones
   - Default: 10 connections in pool
   - Reduces connection overhead

2. Query Caching
   - 5-minute cache time by default
   - Stale-while-revalidate pattern
   - Configurable per hook

3. Pagination Support
   - Can implement in queryBuilder
   - Reduce payload size
   - Faster transfers

4. Selective Field Loading
   - Can optimize with SELECT specific fields
   - Reduce bandwidth usage
   - Faster queries

5. Lazy Loading
   - Load on demand
   - Split data into chunks
   - Better UX for large datasets
```

## 🔍 Debugging & Monitoring

### Frontend Debugging
```
DevTools → Network Tab
    ↓
See all API requests
    ↓
View request/response headers
    ↓
Check payload sizes
    ↓
Monitor timing

DevTools → Console Tab
    ↓
See axios interceptor logs
    ↓
View React Query logs (if enabled)
    ↓
Check error messages
```

### Backend Debugging
```
Server Terminal
    ↓
See connection logs
    ↓
SQL error messages
    ↓
Request timing
    ↓
Enable debug mode in server.js
```

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** ✅ Complete
