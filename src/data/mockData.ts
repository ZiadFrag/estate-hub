import { Property, Owner, Contract, Payment, Client, Department, Agent, PropertyVisit, Branch, Listing } from '@/types/database';

export const mockProperties: Property[] = [
  { property_id: 'P001', property_type: 'House', address: '123 Oak Street', price: 450000, city: 'Los Angeles', status: 'Available', size_properties: 2500 },
  { property_id: 'P002', property_type: 'Apartment', address: '456 Pine Avenue', price: 280000, city: 'San Francisco', status: 'Sold', size_properties: 1200 },
  { property_id: 'P003', property_type: 'Condo', address: '789 Maple Drive', price: 320000, city: 'San Diego', status: 'Pending', size_properties: 1500 },
  { property_id: 'P004', property_type: 'Commercial', address: '101 Business Park', price: 850000, city: 'Los Angeles', status: 'Available', size_properties: 5000 },
  { property_id: 'P005', property_type: 'Land', address: '202 Rural Road', price: 150000, city: 'Sacramento', status: 'Available', size_properties: 10000 },
  { property_id: 'P006', property_type: 'House', address: '303 Sunset Blvd', price: 620000, city: 'Beverly Hills', status: 'Rented', size_properties: 3200 },
  { property_id: 'P007', property_type: 'Apartment', address: '404 Downtown Ave', price: 395000, city: 'San Francisco', status: 'Available', size_properties: 1800 },
  { property_id: 'P008', property_type: 'House', address: '505 Coastal Way', price: 890000, city: 'Malibu', status: 'Pending', size_properties: 4100 },
];

export const mockOwners: Owner[] = [
  { owner_id: 'O001', address: '100 Owner Lane', phone: '12345678901', f_name: 'John', l_name: 'Smith', email: 'john.smith@email.com', property_id: 'P001' },
  { owner_id: 'O002', address: '200 Owner Ave', phone: '12345678902', f_name: 'Sarah', l_name: 'Johnson', email: 'sarah.j@email.com', property_id: 'P002' },
  { owner_id: 'O003', address: '300 Owner Blvd', phone: '12345678903', f_name: 'Michael', l_name: 'Williams', email: 'm.williams@email.com', property_id: 'P003' },
  { owner_id: 'O004', address: '400 Owner St', phone: '12345678904', f_name: 'Emily', l_name: 'Brown', email: 'emily.b@email.com', property_id: 'P004' },
];

export const mockContracts: Contract[] = [
  { contract_id: 'C001', total_amount: 450000, contract_type: 'Sale', contract_date: '2024-01-15', property_id: 'P002' },
  { contract_id: 'C002', total_amount: 2500, contract_type: 'Rent', contract_date: '2024-02-01', property_id: 'P006' },
  { contract_id: 'C003', total_amount: 320000, contract_type: 'Sale', contract_date: '2024-03-10', property_id: 'P003' },
  { contract_id: 'C004', total_amount: 5000, contract_type: 'Lease', contract_date: '2024-03-20', property_id: 'P004' },
];

export const mockPayments: Payment[] = [
  { payment_id: 'PAY001', amount: 45000, payment_date: '2024-01-15', method: 'Bank Transfer', contract_id: 'C001' },
  { payment_id: 'PAY002', amount: 405000, payment_date: '2024-02-01', method: 'Bank Transfer', contract_id: 'C001' },
  { payment_id: 'PAY003', amount: 2500, payment_date: '2024-02-01', method: 'Credit Card', contract_id: 'C002' },
  { payment_id: 'PAY004', amount: 2500, payment_date: '2024-03-01', method: 'Credit Card', contract_id: 'C002' },
  { payment_id: 'PAY005', amount: 32000, payment_date: '2024-03-10', method: 'Check', contract_id: 'C003' },
];

export const mockClients: Client[] = [
  { client_id: 'CL001', phone: '98765432101', birthdate: '1985-06-15', email: 'alice.jones@email.com', f_name: 'Alice', l_name: 'Jones', gender: 'Female', address: '111 Client St', contract_id: 'C001' },
  { client_id: 'CL002', phone: '98765432102', birthdate: '1990-03-22', email: 'bob.wilson@email.com', f_name: 'Bob', l_name: 'Wilson', gender: 'Male', address: '222 Client Ave', contract_id: 'C002' },
  { client_id: 'CL003', phone: '98765432103', birthdate: '1988-11-08', email: 'carol.davis@email.com', f_name: 'Carol', l_name: 'Davis', gender: 'Female', address: '333 Client Blvd', contract_id: 'C003' },
];

export const mockDepartments: Department[] = [
  { department_id: 'D001', department_name: 'Sales', department_location: 'Los Angeles HQ' },
  { department_id: 'D002', department_name: 'Rentals', department_location: 'San Francisco Office' },
  { department_id: 'D003', department_name: 'Commercial', department_location: 'San Diego Branch' },
  { department_id: 'D004', department_name: 'Property Management', department_location: 'Los Angeles HQ' },
];

export const mockAgents: Agent[] = [
  { agent_id: 'A001', phone: '55555555501', f_name: 'David', l_name: 'Martinez', email: 'd.martinez@realestate.com', department_id: 'D001' },
  { agent_id: 'A002', phone: '55555555502', f_name: 'Emma', l_name: 'Garcia', email: 'e.garcia@realestate.com', department_id: 'D001' },
  { agent_id: 'A003', phone: '55555555503', f_name: 'James', l_name: 'Anderson', email: 'j.anderson@realestate.com', department_id: 'D002' },
  { agent_id: 'A004', phone: '55555555504', f_name: 'Sophia', l_name: 'Taylor', email: 's.taylor@realestate.com', department_id: 'D003' },
];

export const mockPropertyVisits: PropertyVisit[] = [
  { visit_id: 'V001', notes: 'Client very interested, asked about financing options', visit_date: '2024-03-15', property_id: 'P001', agent_id: 'A001' },
  { visit_id: 'V002', notes: 'Second viewing, discussing price negotiation', visit_date: '2024-03-18', property_id: 'P001', agent_id: 'A001' },
  { visit_id: 'V003', notes: 'First time buyer, liked the location', visit_date: '2024-03-20', property_id: 'P007', agent_id: 'A002' },
  { visit_id: 'V004', notes: 'Commercial client, needs larger space', visit_date: '2024-03-22', property_id: 'P004', agent_id: 'A004' },
];

export const mockBranches: Branch[] = [
  { branch_id: 'B001', phone: '88888888801', city: 'Los Angeles', address: '1000 Main Street', branch_name: 'LA Downtown', department_id: 'D001' },
  { branch_id: 'B002', phone: '88888888802', city: 'San Francisco', address: '2000 Market Street', branch_name: 'SF Financial District', department_id: 'D002' },
  { branch_id: 'B003', phone: '88888888803', city: 'San Diego', address: '3000 Harbor Drive', branch_name: 'SD Waterfront', department_id: 'D003' },
];

export const mockListings: Listing[] = [
  { listing_id: 'L001', listing_date: '2024-01-10', status: 'Active', price: 450000, property_id: 'P001', agent_id: 'A001' },
  { listing_id: 'L002', listing_date: '2024-01-15', status: 'Inactive', price: 280000, property_id: 'P002', agent_id: 'A002' },
  { listing_id: 'L003', listing_date: '2024-02-01', status: 'Active', price: 320000, property_id: 'P003', agent_id: 'A001' },
  { listing_id: 'L004', listing_date: '2024-02-10', status: 'Active', price: 850000, property_id: 'P004', agent_id: 'A004' },
  { listing_id: 'L005', listing_date: '2024-02-15', status: 'Active', price: 150000, property_id: 'P005', agent_id: 'A002' },
  { listing_id: 'L006', listing_date: '2024-03-01', status: 'Active', price: 620000, property_id: 'P006', agent_id: 'A001' },
  { listing_id: 'L007', listing_date: '2024-03-05', status: 'Active', price: 395000, property_id: 'P007', agent_id: 'A003' },
  { listing_id: 'L008', listing_date: '2024-03-10', status: 'Active', price: 890000, property_id: 'P008', agent_id: 'A002' },
];

export const dashboardStats = {
  totalProperties: mockProperties.length,
  availableProperties: mockProperties.filter(p => p.status === 'Available').length,
  totalClients: mockClients.length,
  activeContracts: mockContracts.length,
  totalAgents: mockAgents.length,
  totalPayments: mockPayments.reduce((sum, p) => sum + p.amount, 0),
  propertyVisitsThisMonth: mockPropertyVisits.length,
  activeListings: mockListings.filter(l => l.status === 'Active').length,
};
