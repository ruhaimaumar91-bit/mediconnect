export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'patient' | 'doctor' | 'pharmacy' | 'admin';
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_available: boolean;
  languages: string[];
}

export interface Pharmacy {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_verified: boolean;
  is_open_24h: boolean;
  rating: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  doctor?: Doctor;
  appointment_date: string;
  appointment_time: string;
  type: 'in-person' | 'video';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  fee: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

export interface Medication {
  id: string;
  pharmacy_id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  requires_prescription: boolean;
  in_stock: boolean;
  image_url?: string;
}

export interface Order {
  id: string;
  patient_id: string;
  pharmacy_id: string;
  pharmacy?: Pharmacy;
  items: OrderItem[];
  total_amount: number;
  delivery_address?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  estimated_delivery?: string;
  created_at: string;
}

export interface OrderItem {
  medication_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  reviewer_id: string;
  doctor_id?: string;
  pharmacy_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface CartItem {
  medication: Medication;
  quantity: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  DoctorProfile: { doctorId: string };
  BookAppointment: { doctor: Doctor };
  OrderTracking: { orderId: string };
  PharmacyDetail: { pharmacyId: string };
  MedicationOrder: { pharmacyId: string };
};
