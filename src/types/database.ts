export type UserRole = 'agent' | 'buyer' | 'seller';

export interface User {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  images: string[];
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  property_id: string;
  user_id: string;
  agent_id: string;
  appointment_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}