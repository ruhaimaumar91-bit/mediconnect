import { supabase } from './supabase';

// ==================== DOCTORS ====================

export const getDoctors = async (specialty?: string) => {
  let query = supabase
    .from('doctors')
    .select('*')
    .eq('is_available', true);

  if (specialty) {
    query = query.eq('specialty', specialty);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getDoctorById = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .single();

  if (error) throw error;
  return data;
};

export const searchDoctors = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .or(
      `full_name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`
    );

  if (error) throw error;
  return data;
};

export const getDoctorAvailability = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('doctor_availability')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('is_available', true);

  if (error) throw error;
  return data;
};

// ==================== APPOINTMENTS ====================

export const createAppointment = async (appointment: {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  notes?: string;
  fee: number;
}) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPatientAppointments = async (patientId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors (
        full_name,
        specialty,
        avatar_url,
        location
      )
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelAppointment = async (appointmentId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== PHARMACIES ====================

export const getPharmacies = async () => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*');

  if (error) throw error;
  return data;
};

export const getPharmacyById = async (pharmacyId: string) => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('id', pharmacyId)
    .single();

  if (error) throw error;
  return data;
};

// ==================== MEDICATIONS ====================

export const getMedications = async (pharmacyId?: string) => {
  let query = supabase
    .from('medications')
    .select('*')
    .eq('in_stock', true);

  if (pharmacyId) {
    query = query.eq('pharmacy_id', pharmacyId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const searchMedications = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .eq('in_stock', true);

  if (error) throw error;
  return data;
};

// ==================== ORDERS ====================

export const createOrder = async (order: {
  patient_id: string;
  pharmacy_id: string;
  items: any[];
  total_amount: number;
  delivery_address: string;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPatientOrders = async (patientId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      pharmacies (
        name,
        address,
        phone
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      pharmacies (
        name,
        address,
        phone
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// ==================== REVIEWS ====================

export const getDoctorReviews = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createReview = async (review: {
  reviewer_id: string;
  doctor_id?: string;
  pharmacy_id?: string;
  rating: number;
  comment?: string;
}) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== SEED DATA ====================

export const seedDoctors = async () => {
  const doctors = [
    {
      full_name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      bio: 'Experienced cardiologist with 15 years of practice.',
      location: 'London, UK',
      consultation_fee: 150,
      rating: 4.8,
      total_reviews: 124,
      is_verified: true,
      is_available: true,
      languages: ['English', 'French'],
      avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      full_name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      bio: 'Specialist in neurological disorders and brain health.',
      location: 'New York, USA',
      consultation_fee: 200,
      rating: 4.9,
      total_reviews: 89,
      is_verified: true,
      is_available: true,
      languages: ['English', 'Mandarin'],
      avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      full_name: 'Dr. Aisha Patel',
      specialty: 'Pediatrics',
      bio: 'Dedicated pediatrician caring for children of all ages.',
      location: 'Dubai, UAE',
      consultation_fee: 120,
      rating: 4.7,
      total_reviews: 200,
      is_verified: true,
      is_available: true,
      languages: ['English', 'Arabic', 'Hindi'],
      avatar_url: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      full_name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      bio: 'Expert in bone and joint treatments.',
      location: 'Toronto, Canada',
      consultation_fee: 180,
      rating: 4.6,
      total_reviews: 67,
      is_verified: true,
      is_available: true,
      languages: ['English'],
      avatar_url: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      full_name: 'Dr. Fatima Al-Hassan',
      specialty: 'General',
      bio: 'General practitioner with holistic approach to health.',
      location: 'Lagos, Nigeria',
      consultation_fee: 80,
      rating: 4.5,
      total_reviews: 312,
      is_verified: true,
      is_available: true,
      languages: ['English', 'Arabic'],
      avatar_url: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      full_name: 'Dr. Robert Kim',
      specialty: 'Ophthalmology',
      bio: 'Eye specialist with expertise in laser surgery.',
      location: 'Seoul, South Korea',
      consultation_fee: 160,
      rating: 4.8,
      total_reviews: 145,
      is_verified: true,
      is_available: true,
      languages: ['English', 'Korean'],
      avatar_url: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
  ];

  const { data, error } = await supabase
    .from('doctors')
    .insert(doctors)
    .select();

  if (error) throw error;
  return data;
};

export const seedPharmacies = async () => {
  const pharmacies = [
    {
      name: 'MediConnect Pharmacy',
      address: '123 Health Street, London, UK',
      phone: '+44 20 1234 5678',
      email: 'london@mediconnect.com',
      is_verified: true,
      is_open_24h: true,
      rating: 4.8,
    },
    {
      name: 'Global Health Pharmacy',
      address: '456 Wellness Ave, New York, USA',
      phone: '+1 212 987 6543',
      email: 'nyc@globalhealth.com',
      is_verified: true,
      is_open_24h: false,
      rating: 4.6,
    },
    {
      name: 'CareFirst Pharmacy',
      address: '789 Medical Blvd, Dubai, UAE',
      phone: '+971 4 123 4567',
      email: 'dubai@carefirst.com',
      is_verified: true,
      is_open_24h: true,
      rating: 4.7,
    },
  ];

  const { data, error } = await supabase
    .from('pharmacies')
    .insert(pharmacies)
    .select();

  if (error) throw error;
  return data;
};
