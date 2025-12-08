// Property related types
export interface Property {
  property_id: string;
  property_type: 'House' | 'Apartment' | 'Condo' | 'Land' | 'Commercial';
  address: string;
  price: number;
  city: string;
  status: 'Available' | 'Sold' | 'Pending' | 'Rented';
  size_properties: number;
}

// Owner related types
export interface Owner {
  owner_id: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  address: string;
  property_id: string;
}

// Contract related types
export interface Contract {
  contract_id: string;
  total_amount: number;
  contract_type: 'Sale' | 'Rent' | 'Lease';
  contract_date: string;
  property_id: string;
}

// Payment related types
export interface Payment {
  payment_id: string;
  amount: number;
  payment_date: string;
  method: 'Cash' | 'Credit Card' | 'Bank Transfer' | 'Check';
  contract_id: string;
}

// Client related types
export interface Client {
  client_id: string;
  phone: string;
  birthdate: string;
  email: string;
  f_name: string;
  l_name: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  contract_id: string;
}

// Department related types
export interface Department {
  department_id: string;
  department_name: string;
  department_location: string;
}

// Agent related types
export interface Agent {
  agent_id: string;
  phone: string;
  f_name: string;
  l_name: string;
  email: string;
  department_id: string;
}

// Property Visit related types
export interface PropertyVisit {
  visit_id: string;
  notes: string;
  visit_date: string;
  property_id: string;
  agent_id: string;
}

// Branch related types
export interface Branch {
  branch_id: string;
  phone: string;
  city: string;
  address: string;
  branch_name: string;
  department_id: string;
}

// Listing related types
export interface Listing {
  listing_id: string;
  listing_date: string;
  status: 'Active' | 'Inactive' | 'Expired';
  price: number;
  property_id: string;
  agent_id: string;
}

// Login User type
export interface LoginUser {
  login_id: string;
  username: string;
  user_password: string;
  agent_id?: string;
  client_id?: string;
  owner_id?: string;
}
