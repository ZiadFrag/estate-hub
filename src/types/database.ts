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

// Client related types
export interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Agent related types
export interface Agent {
  agent_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license: string;
  branch_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Contract related types
export interface Contract {
  contract_id: string;
  property_id: string;
  client_id: string;
  agent_id: string;
  contract_date: Date;
  signature_date?: Date;
  status: 'draft' | 'signed' | 'completed' | 'cancelled';
  value: number;
  created_at?: Date;
  updated_at?: Date;
}

// Payment related types
export interface Payment {
  payment_id: string;
  contract_id: string;
  amount: number;
  payment_date: Date;
  payment_method: 'cash' | 'check' | 'transfer' | 'card';
  status: 'pending' | 'completed' | 'failed';
  created_at?: Date;
  updated_at?: Date;
}

// Owner related types
export interface Owner {
  owner_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  property_id: string;
  bank_account?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Department related types
export interface Department {
  department_id: string;
  name: string;
  description?: string;
  head_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Branch related types
export interface Branch {
  branch_id: string;
  name: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

// Property Visit related types
export interface PropertyVisit {
  visit_id: string;
  property_id: string;
  client_id: string;
  agent_id: string;
  visit_date: Date;
  notes?: string;
  rating?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Listing related types
export interface Listing {
  listing_id: string;
  property_id: string;
  agent_id: string;
  listing_date: Date;
  expiry_date?: Date;
  status: 'active' | 'inactive' | 'expired';
  featured: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Contract {
  contract_id: string;
  total_amount: number;
  contract_type: 'Sale' | 'Rent' | 'Lease';
  contract_date: string;
  property_id: string;
}

export interface Payment {
  payment_id: string;
  amount: number;
  payment_date: string;
  method: 'Cash' | 'Credit Card' | 'Bank Transfer' | 'Check';
  contract_id: string;
}

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

export interface Department {
  department_id: string;
  department_name: string;
  department_location: string;
}

export interface Agent {
  agent_id: string;
  phone: string;
  f_name: string;
  l_name: string;
  email: string;
  department_id: string;
}

export interface PropertyVisit {
  visit_id: string;
  notes: string;
  visit_date: string;
  property_id: string;
  agent_id: string;
}

export interface Branch {
  branch_id: string;
  phone: string;
  city: string;
  address: string;
  branch_name: string;
  department_id: string;
}

export interface LoginUser {
  login_id: string;
  username: string;
  user_password: string;
  agent_id?: string;
  client_id?: string;
  owner_id?: string;
}

export interface Listing {
  listing_id: string;
  listing_date: string;
  status: 'Active' | 'Inactive' | 'Expired';
  price: number;
  property_id: string;
  agent_id: string;
}
