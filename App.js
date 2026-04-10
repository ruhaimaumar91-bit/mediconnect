-- ============================================
-- MEDICONNECT COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- for location

-- ============================================
-- USERS / PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('patient', 'doctor', 'pharmacy', 'admin')) DEFAULT 'patient',
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  language TEXT DEFAULT 'English',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOCTOR PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  specialty TEXT,
  bio TEXT,
  license_number TEXT,
  license_document_url TEXT,
  medical_certificate_url TEXT,
  id_document_url TEXT,
  years_experience INTEGER DEFAULT 0,
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  video_call_fee DECIMAL(10,2) DEFAULT 0,
  languages TEXT[] DEFAULT ARRAY['English'],
  hospital_affiliation TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PHARMACY PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.pharmacy_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  pharmacy_name TEXT,
  license_number TEXT,
  license_document_url TEXT,
  registration_document_url TEXT,
  id_document_url TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  is_open_24h BOOLEAN DEFAULT FALSE,
  opening_hours JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  delivery_radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DOCTOR AVAILABILITY
-- ============================================
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
  day_of_week TEXT CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.profiles(id),
  doctor_id UUID REFERENCES public.doctor_profiles(id),
  -- Booking form fields
  patient_name TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  reason TEXT,
  session_duration_minutes INTEGER DEFAULT 30,
  language TEXT DEFAULT 'English',
  additional_notes TEXT,
  -- Appointment details
  appointment_date DATE,
  appointment_time TIME,
  appointment_type TEXT CHECK (appointment_type IN ('in-person', 'video')) DEFAULT 'in-person',
  status TEXT CHECK (status IN ('pending','confirmed','in-progress','completed','cancelled','rescheduled','disputed')) DEFAULT 'pending',
  -- Doctor confirmation
  doctor_confirmed BOOLEAN DEFAULT FALSE,
  doctor_confirmed_at TIMESTAMPTZ,
  doctor_cancel_reason TEXT,
  -- Rescheduling
  reschedule_requested_by TEXT,
  reschedule_date DATE,
  reschedule_time TIME,
  reschedule_reason TEXT,
  reschedule_status TEXT CHECK (reschedule_status IN ('pending','approved','rejected')),
  -- Video call
  call_room_id TEXT,
  call_started_at TIMESTAMPTZ,
  call_ended_at TIMESTAMPTZ,
  call_duration_seconds INTEGER DEFAULT 0,
  call_status TEXT CHECK (call_status IN ('not_started','in-progress','paused','completed','failed')) DEFAULT 'not_started',
  call_resume_token TEXT,
  -- Payment
  fee DECIMAL(10,2),
  payment_status TEXT CHECK (payment_status IN ('pending','held','released','refunded','failed','cancelled')) DEFAULT 'pending',
  payment_intent_id TEXT,
  commission_amount DECIMAL(10,2),
  commission_status TEXT CHECK (commission_status IN ('pending','collected')) DEFAULT 'pending',
  -- Review
  review_prompted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDICATIONS / INVENTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id UUID REFERENCES public.pharmacy_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  price DECIMAL(10,2),
  requires_prescription BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  icon TEXT DEFAULT '💊',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS (PHARMACY DELIVERIES)
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.profiles(id),
  pharmacy_id UUID REFERENCES public.pharmacy_profiles(id),
  -- Booking form
  patient_name TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  delivery_reason TEXT,
  language TEXT DEFAULT 'English',
  additional_notes TEXT,
  prescription_url TEXT,
  -- Order details
  items JSONB,
  total_amount DECIMAL(10,2),
  delivery_address TEXT,
  delivery_latitude DOUBLE PRECISION,
  delivery_longitude DOUBLE PRECISION,
  -- Status
  status TEXT CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled','disputed')) DEFAULT 'pending',
  pharmacy_confirmed BOOLEAN DEFAULT FALSE,
  pharmacy_confirmed_at TIMESTAMPTZ,
  pharmacy_cancel_reason TEXT,
  -- Rescheduling
  reschedule_requested_by TEXT,
  reschedule_datetime TIMESTAMPTZ,
  reschedule_reason TEXT,
  reschedule_status TEXT CHECK (reschedule_status IN ('pending','approved','rejected')),
  -- Estimated delivery
  estimated_delivery TEXT,
  delivered_at TIMESTAMPTZ,
  -- Payment
  payment_status TEXT CHECK (payment_status IN ('pending','held','released','refunded','failed','cancelled')) DEFAULT 'pending',
  payment_intent_id TEXT,
  commission_amount DECIMAL(10,2),
  commission_status TEXT CHECK (commission_status IN ('pending','collected')) DEFAULT 'pending',
  -- Review
  review_prompted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES public.profiles(id),
  target_type TEXT CHECK (target_type IN ('doctor', 'pharmacy')),
  target_id UUID,
  appointment_id UUID REFERENCES public.appointments(id),
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  admin_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS / TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.profiles(id),
  appointment_id UUID REFERENCES public.appointments(id),
  order_id UUID REFERENCES public.orders(id),
  amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending','held','completed','refunded','failed')) DEFAULT 'pending',
  stripe_payment_intent TEXT,
  refund_reason TEXT,
  refund_processed_by UUID REFERENCES public.profiles(id),
  refund_processed_at TIMESTAMPTZ,
  invoice_sent BOOLEAN DEFAULT FALSE,
  invoice_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  title TEXT,
  body TEXT,
  type TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES (IN-APP CONTACT)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  appointment_id UUID REFERENCES public.appointments(id),
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES public.transactions(id),
  appointment_id UUID REFERENCES public.appointments(id),
  order_id UUID REFERENCES public.orders(id),
  from_user_id UUID REFERENCES public.profiles(id),
  amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending','collected')) DEFAULT 'pending',
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Doctor profiles: public read, own update
CREATE POLICY "doctor_profiles_select" ON public.doctor_profiles FOR SELECT USING (true);
CREATE POLICY "doctor_profiles_insert" ON public.doctor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "doctor_profiles_update" ON public.doctor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Pharmacy profiles
CREATE POLICY "pharmacy_profiles_select" ON public.pharmacy_profiles FOR SELECT USING (true);
CREATE POLICY "pharmacy_profiles_insert" ON public.pharmacy_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pharmacy_profiles_update" ON public.pharmacy_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Appointments
CREATE POLICY "appointments_select" ON public.appointments FOR SELECT USING (
  auth.uid() = patient_id OR
  auth.uid() IN (SELECT user_id FROM doctor_profiles WHERE id = doctor_id)
);
CREATE POLICY "appointments_insert" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "appointments_update" ON public.appointments FOR UPDATE USING (
  auth.uid() = patient_id OR
  auth.uid() IN (SELECT user_id FROM doctor_profiles WHERE id = doctor_id)
);

-- Orders
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (
  auth.uid() = patient_id OR
  auth.uid() IN (SELECT user_id FROM pharmacy_profiles WHERE id = pharmacy_id)
);
CREATE POLICY "orders_insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING (
  auth.uid() = patient_id OR
  auth.uid() IN (SELECT user_id FROM pharmacy_profiles WHERE id = pharmacy_id)
);

-- Notifications: own only
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (true);

-- Messages
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews: public read
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Medications: public read
CREATE POLICY "medications_select" ON public.medications FOR SELECT USING (true);
CREATE POLICY "medications_insert" ON public.medications FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM pharmacy_profiles WHERE id = pharmacy_id)
);

-- Availability: public read
CREATE POLICY "availability_select" ON public.doctor_availability FOR SELECT USING (true);
CREATE POLICY "availability_insert" ON public.doctor_availability FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM doctor_profiles WHERE id = doctor_id)
);

-- Transactions: own only
CREATE POLICY "transactions_select" ON public.transactions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "transactions_insert" ON public.transactions FOR INSERT WITH CHECK (true);

-- Commissions: admin only (handled via service role)
CREATE POLICY "commissions_select" ON public.commissions FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update doctor rating when review added
CREATE OR REPLACE FUNCTION public.update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'doctor' THEN
    UPDATE public.doctor_profiles
    SET
      rating = (SELECT AVG(rating) FROM public.reviews WHERE target_type = 'doctor' AND target_id = NEW.target_id),
      total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE target_type = 'doctor' AND target_id = NEW.target_id)
    WHERE id = NEW.target_id;
  END IF;
  IF NEW.target_type = 'pharmacy' THEN
    UPDATE public.pharmacy_profiles
    SET
      rating = (SELECT AVG(rating) FROM public.reviews WHERE target_type = 'pharmacy' AND target_id = NEW.target_id),
      total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE target_type = 'pharmacy' AND target_id = NEW.target_id)
    WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_doctor_rating();

-- ============================================
-- SET YOUR ADMIN ACCOUNT
-- Replace with your actual user ID from Supabase Auth
-- ============================================
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
// ============================================
// PART 2 — PATIENT DASHBOARD
// MediConnect v2.0
// Replaces PatientShell placeholder from Part 1
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, StatusBar, Modal,
  KeyboardAvoidingView, Platform, RefreshControl,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// CONSTANTS
// ============================================
const SPECIALTIES = [
  { id: '1', name: 'Cardiology', icon: '❤️', color: '#FEE2E2' },
  { id: '2', name: 'Neurology', icon: '🧠', color: '#EDE9FE' },
  { id: '3', name: 'Ophthalmology', icon: '👁️', color: '#DBEAFE' },
  { id: '4', name: 'Pediatrics', icon: '👶', color: '#FCE7F3' },
  { id: '5', name: 'Orthopedics', icon: '🦴', color: '#FEF3C7' },
  { id: '6', name: 'General Practice', icon: '🩺', color: '#D1FAE5' },
  { id: '7', name: 'Dermatology', icon: '🧴', color: '#CCFBF1' },
  { id: '8', name: 'Psychiatry', icon: '🧘', color: '#E0E7FF' },
  { id: '9', name: 'Gynecology', icon: '🌸', color: '#FCE7F3' },
  { id: '10', name: 'Emergency Medicine', icon: '🚨', color: '#FEE2E2' },
  { id: '11', name: 'Surgery', icon: '🔬', color: '#F0FDF4' },
  { id: '12', name: 'Internal Medicine', icon: '💊', color: '#FEF3C7' },
];

const PAYMENT_METHODS = [
  { id: '1', type: 'visa', label: 'Visa', icon: '💳', color: '#1A1F71' },
  { id: '2', type: 'mastercard', label: 'Mastercard', icon: '💳', color: '#EB001B' },
  { id: '3', type: 'amex', label: 'Amex', icon: '💳', color: '#2E77BC' },
  { id: '4', type: 'applepay', label: 'Apple Pay', icon: '🍎', color: '#000000' },
  { id: '5', type: 'googlepay', label: 'Google Pay', icon: '🔵', color: '#4285F4' },
  { id: '6', type: 'paypal', label: 'PayPal', icon: '🅿️', color: '#003087' },
];

const SESSION_DURATIONS = [15, 30, 45, 60, 90, 120];

// ============================================
// PAYMENT MODAL (Full Featured)
// ============================================
function PaymentModal({ visible, amount, title, onSuccess, onClose, isHeld }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('select');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : cleaned;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    return cleaned;
  };

  const handlePayment = async () => {
    if (!selectedMethod) { Alert.alert('Error', 'Please select a payment method'); return; }
    if (['visa', 'mastercard', 'amex'].includes(selectedMethod.type)) {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setProcessing(false);
    onSuccess(selectedMethod.label);
  };

  const digitalMethods = PAYMENT_METHODS.filter(m => ['applepay', 'googlepay', 'paypal'].includes(m.type));
  const cardMethods = PAYMENT_METHODS.filter(m => ['visa', 'mastercard', 'amex'].includes(m.type));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.95 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>💳 Secure Payment</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>
                Total: <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>${amount}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            {/* Security badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 16, gap: 10 }}>
              <Text style={{ fontSize: 20 }}>🔒</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.success, fontWeight: '700' }}>256-bit SSL Encrypted</Text>
                <Text style={{ fontSize: 12, color: COLORS.success }}>Payment held securely until service is complete</Text>
              </View>
            </View>

            {/* Hold notice */}
            {isHeld && (
              <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' }}>
                <Text style={{ fontSize: 13, color: '#1E40AF', fontWeight: '700', marginBottom: 4 }}>💡 How Payment Works</Text>
                <Text style={{ fontSize: 12, color: '#1E40AF', lineHeight: 18 }}>
                  Your payment will be securely held and only released to the provider once your appointment or delivery is fully completed. If cancelled by the provider, you get a full refund.
                </Text>
              </View>
            )}

            {/* Quick Pay */}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Quick Pay</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {digitalMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={{ flex: 1, borderWidth: 2, borderColor: selectedMethod?.id === method.id ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: selectedMethod?.id === method.id ? COLORS.primaryLight : COLORS.white }}
                  onPress={() => { setSelectedMethod(method); setStep('confirm'); }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{method.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedMethod?.id === method.id ? COLORS.primary : COLORS.text }}>{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text style={{ marginHorizontal: 16, color: COLORS.gray, fontSize: 13 }}>or pay with card</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Card Methods */}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Card Payment</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {cardMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={{ flex: 1, borderWidth: 2, borderColor: selectedMethod?.id === method.id ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center', backgroundColor: selectedMethod?.id === method.id ? COLORS.primaryLight : COLORS.white }}
                  onPress={() => { setSelectedMethod(method); setStep('card'); }}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>{method.icon}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: method.color }}>{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Card Form */}
            {step === 'card' && selectedMethod && ['visa', 'mastercard', 'amex'].includes(selectedMethod.type) && (
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, padding: 16, marginBottom: 16 }}>
                {/* Card preview */}
                <View style={{ backgroundColor: selectedMethod.color, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>{selectedMethod.label}</Text>
                  <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: 'bold', letterSpacing: 3, marginBottom: 16 }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>CARD HOLDER</Text>
                      <Text style={{ fontSize: 14, color: COLORS.white, fontWeight: '600' }}>{cardName || 'YOUR NAME'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>EXPIRES</Text>
                      <Text style={{ fontSize: 14, color: COLORS.white, fontWeight: '600' }}>{expiry || 'MM/YY'}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Card Number</Text>
                  <TextInput style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, letterSpacing: 2 }} placeholder="1234 5678 9012 3456" value={cardNumber} onChangeText={(t) => setCardNumber(formatCardNumber(t))} keyboardType="numeric" maxLength={19} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Cardholder Name</Text>
                  <TextInput style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }} placeholder="Name on card" value={cardName} onChangeText={setCardName} autoCapitalize="characters" />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Expiry</Text>
                    <TextInput style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }} placeholder="MM/YY" value={expiry} onChangeText={(t) => setExpiry(formatExpiry(t))} keyboardType="numeric" maxLength={5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>CVV</Text>
                    <TextInput style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }} placeholder="•••" value={cvv} onChangeText={setCvv} keyboardType="numeric" maxLength={4} secureTextEntry />
                  </View>
                </View>
              </View>
            )}

            {/* Order Summary */}
            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Order Summary</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>{title}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>${amount}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Platform fee</Text>
                <Text style={{ fontSize: 14, color: COLORS.success }}>Free</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total (Held)</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${amount}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: processing ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 30, flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              onPress={handlePayment}
              disabled={processing}
            >
              {processing
                ? <><ActivityIndicator color={COLORS.white} /><Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Processing...</Text></>
                : <><Text style={{ fontSize: 20 }}>🔒</Text><Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Hold ${amount} Securely</Text></>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// REVIEW MODAL
// ============================================
function ReviewModal({ visible, targetType, targetId, appointmentId, orderId, userId, targetName, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Please select a rating'); return; }
    setLoading(true);
    try {
      await supabase.from('reviews').insert({
        reviewer_id: userId,
        target_type: targetType,
        target_id: targetId,
        appointment_id: appointmentId || null,
        order_id: orderId || null,
        rating,
        comment,
      });
      Alert.alert('Thank you! 🙏', 'Your review has been submitted.');
      onDone();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 6, textAlign: 'center' }}>
            How was your experience?
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 }}>
            Rate your session with {targetName}
          </Text>

          {/* Stars */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={{ fontSize: 40 }}>{star <= rating ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={{ textAlign: 'center', fontSize: 14, color: COLORS.primary, fontWeight: '600', marginBottom: 16 }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </Text>
          )}

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Comments (Optional)</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 100, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
              placeholder="Share your experience..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              onPress={onDone}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 2, backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Submit Review</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={{ height: 20 }} />
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// BOOKING FORM SCREEN
// ============================================
function BookingFormScreen({ doctor, user, profile, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [availability, setAvailability] = useState([]);

  const [form, setForm] = useState({
    patientName: profile?.full_name || '',
    patientAge: '',
    patientGender: '',
    reason: '',
    sessionDuration: 30,
    language: 'English',
    additionalNotes: '',
    appointmentType: 'in-person',
    appointmentDate: '',
    appointmentTime: '',
  });

  const totalFee = form.appointmentType === 'video'
    ? (doctor.video_call_fee || doctor.consultation_fee)
    : doctor.consultation_fee;

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctor.id)
      .eq('is_available', true);
    setAvailability(data || []);
  };

  const getAvailableDates = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const availableDays = availability.map(a => a.day_of_week);
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      if (availableDays.length === 0 || availableDays.includes(dayName)) {
        dates.push({
          date: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          day: dayName,
        });
      }
    }
    return dates;
  };

  const getAvailableTimes = () => {
    if (!form.appointmentDate) return [];
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date(form.appointmentDate);
    const dayName = days[d.getDay()];
    const avail = availability.find(a => a.day_of_week === dayName);
    const startHour = avail ? parseInt(avail.start_time?.split(':')[0]) : 9;
    const endHour = avail ? parseInt(avail.end_time?.split(':')[0]) : 17;
    const times = [];
    for (let h = startHour; h < endHour; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
      times.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.patientName || !form.patientAge || !form.patientGender || !form.reason) {
        Alert.alert('Missing Info', 'Please fill in all required fields');
        return false;
      }
    }
    if (step === 2) {
      if (!form.appointmentDate || !form.appointmentTime) {
        Alert.alert('Missing Info', 'Please select a date and time');
        return false;
      }
    }
    return true;
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    setShowPayment(false);
    setLoading(true);
    try {
      // Create appointment with payment held
      const { data: appt, error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctor.id,
        patient_name: form.patientName,
        patient_age: parseInt(form.patientAge),
        patient_gender: form.patientGender,
        reason: form.reason,
        session_duration_minutes: form.sessionDuration,
        language: form.language,
        additional_notes: form.additionalNotes,
        appointment_type: form.appointmentType,
        appointment_date: form.appointmentDate,
        appointment_time: form.appointmentTime,
        fee: totalFee,
        status: 'pending',
        payment_status: 'held',
      }).select().single();

      if (error) throw error;

      // Create transaction record
      const commission = totalFee * (doctor.commission_rate / 100 || 0.1);
      await supabase.from('transactions').insert({
        patient_id: user.id,
        appointment_id: appt.id,
        amount: totalFee,
        commission_amount: commission,
        net_amount: totalFee - commission,
        payment_method: paymentMethod,
        payment_status: 'held',
      });

      // Notify doctor
      await supabase.from('notifications').insert({
        user_id: doctor.user_id,
        title: '📅 New Appointment Request',
        body: `${form.patientName} has booked a ${form.appointmentType} appointment on ${form.appointmentDate} at ${form.appointmentTime}. Please confirm or reject.`,
        type: 'appointment',
        data: { icon: '📅', appointment_id: appt.id },
      });

      Alert.alert(
        'Booking Submitted! 🎉',
        `Your appointment with ${doctor.full_name} on ${form.appointmentDate} at ${form.appointmentTime} is pending doctor confirmation. Payment of $${totalFee} is securely held.`,
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const dates = getAvailableDates();
  const times = getAvailableTimes();

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const languages = ['English'];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Book Appointment</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>with Dr. {doctor.full_name}</Text>
        {/* Progress */}
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? COLORS.white : 'rgba(255,255,255,0.3)' }} />
          ))}
        </View>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
          Step {step} of 3 — {['', 'Patient Details', 'Date & Time', 'Review & Pay'][step]}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>

        {/* STEP 1 — Patient Details */}
        {step === 1 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Patient Information</Text>

            <Input label="Full Name *" value={form.patientName} onChangeText={(v) => setForm({ ...form, patientName: v })} placeholder="Enter full name" icon="👤" />
            <Input label="Age *" value={form.patientAge} onChangeText={(v) => setForm({ ...form, patientAge: v })} placeholder="e.g. 32" keyboard="numeric" icon="🎂" />

            {/* Gender */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Gender *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: form.patientGender === g ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.patientGender === g ? COLORS.primary : COLORS.border }}
                    onPress={() => setForm({ ...form, patientGender: g })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: form.patientGender === g ? COLORS.white : COLORS.text }}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Appointment Type */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Appointment Type *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { type: 'in-person', icon: '🏥', label: 'In-Person', fee: doctor.consultation_fee },
                  { type: 'video', icon: '📹', label: 'Video Call', fee: doctor.video_call_fee || doctor.consultation_fee },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.type}
                    style={{ flex: 1, borderWidth: 2, borderColor: form.appointmentType === t.type ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: form.appointmentType === t.type ? COLORS.primaryLight : COLORS.white }}
                    onPress={() => setForm({ ...form, appointmentType: t.type })}
                  >
                    <Text style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: form.appointmentType === t.type ? COLORS.primary : COLORS.gray }}>{t.label}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>${t.fee}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reason */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Reason for Visit *</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                placeholder="Describe your symptoms or reason..."
                value={form.reason}
                onChangeText={(v) => setForm({ ...form, reason: v })}
                multiline
              />
            </View>

            {/* Session Duration */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Session Duration</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SESSION_DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: form.sessionDuration === d ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.sessionDuration === d ? COLORS.primary : COLORS.border }}
                    onPress={() => setForm({ ...form, sessionDuration: d })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: form.sessionDuration === d ? COLORS.white : COLORS.text }}>{d} min</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Language */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Preferred Language</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {languages.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: form.language === l ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.language === l ? COLORS.primary : COLORS.border }}
                    onPress={() => setForm({ ...form, language: l })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: form.language === l ? COLORS.white : COLORS.text }}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Notes */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Additional Notes (Optional)</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                placeholder="Any other info for the doctor..."
                value={form.additionalNotes}
                onChangeText={(v) => setForm({ ...form, additionalNotes: v })}
                multiline
              />
            </View>
          </>
        )}

        {/* STEP 2 — Date & Time */}
        {step === 2 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Select Date & Time</Text>

            {/* Dates */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Available Dates</Text>
              {dates.length === 0 ? (
                <View style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: COLORS.textLight }}>No availability set — all days available</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {dates.map((d) => (
                    <TouchableOpacity
                      key={d.date}
                      style={{ marginRight: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: form.appointmentDate === d.date ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.appointmentDate === d.date ? COLORS.primary : COLORS.border, alignItems: 'center', minWidth: 90 }}
                      onPress={() => setForm({ ...form, appointmentDate: d.date, appointmentTime: '' })}
                    >
                      <Text style={{ fontSize: 12, color: form.appointmentDate === d.date ? COLORS.white : COLORS.textLight, marginBottom: 2 }}>{d.label.split(' ')[0]}</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: form.appointmentDate === d.date ? COLORS.white : COLORS.text }}>{d.label.split(' ')[2]}</Text>
                      <Text style={{ fontSize: 12, color: form.appointmentDate === d.date ? 'rgba(255,255,255,0.8)' : COLORS.textLight }}>{d.label.split(' ')[1]}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Times */}
            {form.appointmentDate && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Available Times</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {(times.length > 0 ? times : ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']).map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: form.appointmentTime === time ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.appointmentTime === time ? COLORS.primary : COLORS.border }}
                      onPress={() => setForm({ ...form, appointmentTime: time })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.appointmentTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* STEP 3 — Review & Pay */}
        {step === 3 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Review & Confirm</Text>

            {/* Doctor Card */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{doctor.full_name}</Text>
                <Text style={{ fontSize: 13, color: COLORS.primary }}>{doctor.specialty}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⭐ {doctor.rating || 'New'} • {doctor.location}</Text>
              </View>
            </View>

            {/* Summary */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Booking Details</Text>
              {[
                { label: 'Patient', value: form.patientName },
                { label: 'Age', value: form.patientAge },
                { label: 'Gender', value: form.patientGender },
                { label: 'Type', value: form.appointmentType === 'video' ? '📹 Video Call' : '🏥 In-Person' },
                { label: 'Date', value: form.appointmentDate },
                { label: 'Time', value: form.appointmentTime },
                { label: 'Duration', value: `${form.sessionDuration} minutes` },
                { label: 'Language', value: form.language },
                { label: 'Reason', value: form.reason },
              ].map((row) => (
                <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{row.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{row.value}</Text>
                </View>
              ))}
            </View>

            {/* Fee Summary */}
            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Payment</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Consultation Fee</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>${totalFee}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Platform Fee</Text>
                <Text style={{ fontSize: 14, color: COLORS.success }}>Free</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total (Held)</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${totalFee}</Text>
              </View>
              <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 8 }}>
                💡 Payment is held securely until your appointment is completed.
              </Text>
            </View>

            {/* Agreement */}
            <View style={{ backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#86EFAC' }}>
              <Text style={{ fontSize: 12, color: '#166534', lineHeight: 18 }}>
                ✅ By proceeding, I confirm that all information provided is accurate and I agree to MediConnect's terms of service. I understand that payment will be held until the appointment is completed.
              </Text>
            </View>
          </>
        )}

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
          {step > 1 && (
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => setStep(step - 1)}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ flex: 2, backgroundColor: loading ? COLORS.gray : (step === 3 ? COLORS.success : COLORS.primary), borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
            onPress={() => {
              if (!validateStep()) return;
              if (step < 3) { setStep(step + 1); }
              else { setShowPayment(true); }
            }}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>
                  {step === 3 ? '💳 Proceed to Payment' : 'Next →'}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPayment}
        amount={totalFee}
        title={`Appointment with Dr. ${doctor.full_name}`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
        isHeld
      />
    </View>
  );
}

// ============================================
// DOCTOR PROFILE SCREEN (Patient View)
// ============================================
function DoctorProfileScreen({ doctor, user, profile, onBack, onBook }) {
  const [activeTab, setActiveTab] = useState('about');
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchAvailability();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*, profiles(full_name)').eq('target_type', 'doctor').eq('target_id', doctor.id).order('created_at', { ascending: false }).limit(10);
    setReviews(data || []);
  };

  const fetchAvailability = async () => {
    const { data } = await supabase.from('doctor_availability').select('*').eq('doctor_id', doctor.id).eq('is_available', true);
    setAvailability(data || []);
  };

  const dayLabels = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 40 }}>👨‍⚕️</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{doctor.full_name}</Text>
            {doctor.is_verified && <Text>✅</Text>}
          </View>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{doctor.specialty}</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>📍 {doctor.location}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, marginTop: -20, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 16 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>⭐ {doctor.rating?.toFixed(1) || 'New'}</Text>
          <Text style={{ fontSize: 11, color: COLORS.textLight }}>Rating</Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>{doctor.total_reviews || 0}</Text>
          <Text style={{ fontSize: 11, color: COLORS.textLight }}>Reviews</Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>{doctor.years_experience || 0}yr</Text>
          <Text style={{ fontSize: 11, color: COLORS.textLight }}>Experience</Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}</Text>
          <Text style={{ fontSize: 11, color: COLORS.textLight }}>Per Visit</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 4 }}>
        {['about', 'availability', 'reviews'].map((tab) => (
          <TouchableOpacity key={tab} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.white : 'transparent' }} onPress={() => setActiveTab(tab)}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? COLORS.doctorColor : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {activeTab === 'about' && (
          <>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>About</Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22 }}>{doctor.bio || 'No bio available.'}</Text>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Details</Text>
              {[
                { icon: '🏥', label: 'Hospital', value: doctor.hospital_affiliation || 'Independent' },
                { icon: '🌐', label: 'Languages', value: (doctor.languages || ['English']).join(', ') },
                { icon: '📹', label: 'Video Fee', value: `$${doctor.video_call_fee || doctor.consultation_fee}` },
                { icon: '🏥', label: 'Visit Fee', value: `$${doctor.consultation_fee}` },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, width: 80 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1 }}>{item.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'availability' && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Available Days & Hours</Text>
            {availability.length === 0 ? (
              <Text style={{ fontSize: 14, color: COLORS.textLight }}>Available weekdays 9AM - 5PM (contact doctor for specific times)</Text>
            ) : (
              availability.map((slot) => (
                <View key={slot.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 14, color: COLORS.text, textTransform: 'capitalize' }}>{dayLabels[slot.day_of_week]}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>
                    {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'reviews' && (
          <>
            {reviews.length === 0 ? (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 30, marginBottom: 10 }}>⭐</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>No reviews yet</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <View key={review.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
                      {review.is_anonymous ? 'Anonymous Patient' : (review.profiles?.full_name || 'Patient')}
                    </Text>
                    <Text style={{ fontSize: 13 }}>{'⭐'.repeat(review.rating)}</Text>
                  </View>
                  {review.comment && <Text style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 20 }}>{review.comment}</Text>}
                  <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 6 }}>{new Date(review.created_at).toLocaleDateString()}</Text>
                </View>
              ))
            )}
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={{ padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <TouchableOpacity
          style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
          onPress={onBook}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>📅 Book Appointment — ${doctor.consultation_fee}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================
// SEARCH SCREEN (Patient)
// ============================================
function PatientSearchScreen({ user, profile, onSelectDoctor, initialSpecialty }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, nearby, video

  useEffect(() => { fetchDoctors(); }, [selectedSpecialty, searchQuery, filterType]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('doctor_profiles')
        .select('*, profiles(full_name, email)')
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .order('rating', { ascending: false });

      if (selectedSpecialty) query = query.eq('specialty', selectedSpecialty);
      if (filterType === 'video') query = query.gt('video_call_fee', 0);

      const { data } = await query;
      let filtered = data || [];

      if (searchQuery) {
        filtered = filtered.filter(d =>
          d.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.location?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setDoctors(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Find Doctors</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10 }}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15 }}
            placeholder="Search doctors, specialties, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={{ fontSize: 16 }}>✕</Text></TouchableOpacity> : null}
        </View>
      </View>

      {/* Filter tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {[{ id: 'all', label: '🌍 All' }, { id: 'video', label: '📹 Video' }].map((f) => (
          <TouchableOpacity
            key={f.id}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filterType === f.id ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: filterType === f.id ? COLORS.primary : COLORS.border }}
            onPress={() => setFilterType(f.id)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: filterType === f.id ? COLORS.white : COLORS.text }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Specialty filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52, paddingHorizontal: 12 }}>
        <TouchableOpacity
          style={{ marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: !selectedSpecialty ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }}
          onPress={() => setSelectedSpecialty(null)}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: !selectedSpecialty ? COLORS.white : COLORS.primary }}>All</Text>
        </TouchableOpacity>
        {SPECIALTIES.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={{ marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedSpecialty === s.name ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }}
            onPress={() => setSelectedSpecialty(selectedSpecialty === s.name ? null : s.name)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: selectedSpecialty === s.name ? COLORS.white : COLORS.primary }}>{s.icon} {s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 40, marginBottom: 16 }}>🔍</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No doctors found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onSelectDoctor(item)}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 30 }}>👨‍⚕️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.profiles?.full_name || item.full_name}</Text>
                  <Text>✅</Text>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 2 }}>{item.specialty}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>📍 {item.location}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'} ({item.total_reviews || 0})</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {item.video_call_fee > 0 && <Text style={{ fontSize: 11, color: COLORS.white, backgroundColor: COLORS.doctorColor, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>📹 Video</Text>}
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${item.consultation_fee}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// PATIENT ACTIVITY SCREEN
// ============================================
function PatientActivityScreen({ user }) {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReview, setShowReview] = useState(null);
  const [showReschedule, setShowReschedule] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [apptRes, orderRes] = await Promise.all([
        supabase.from('appointments').select('*, doctor_profiles(*, profiles(full_name))').eq('patient_id', user.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, pharmacy_profiles(pharmacy_name)').eq('patient_id', user.id).order('created_at', { ascending: false }),
      ]);
      setAppointments(apptRes.data || []);
      setOrders(orderRes.data || []);

      // Check for completed ones needing review
      const completedAppts = (apptRes.data || []).filter(a => a.status === 'completed' && !a.review_prompted);
      if (completedAppts.length > 0) {
        setShowReview({ type: 'appointment', item: completedAppts[0] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

  const handleCancelAppointment = (appt) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel', style: 'destructive', onPress: async () => {
          await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id);
          // Notify doctor
          await supabase.from('notifications').insert({
            user_id: appt.doctor_profiles?.user_id,
            title: '❌ Appointment Cancelled',
            body: `${appt.patient_name} has cancelled their appointment on ${appt.appointment_date}.`,
            type: 'appointment',
            data: { icon: '❌' },
          });
          fetchAll();
        }
      }
    ]);
  };

  const RescheduleModal = ({ appointment, onClose }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const dates = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return { date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
    });

    const handleReschedule = async () => {
      if (!newDate || !newTime || !reason) { Alert.alert('Please fill in all fields'); return; }
      setLoading(true);
      try {
        await supabase.from('appointments').update({
          reschedule_requested_by: 'patient',
          reschedule_date: newDate,
          reschedule_time: newTime,
          reschedule_reason: reason,
          reschedule_status: 'pending',
          status: 'rescheduled',
        }).eq('id', appointment.id);

        await supabase.from('notifications').insert({
          user_id: appointment.doctor_profiles?.user_id,
          title: '📅 Reschedule Request',
          body: `${appointment.patient_name} wants to reschedule to ${newDate} at ${newTime}. Reason: ${reason}`,
          type: 'reschedule',
          data: { icon: '📅', appointment_id: appointment.id },
        });

        Alert.alert('Request Sent! ✅', 'Your reschedule request has been sent to the doctor.');
        onClose();
        fetchAll();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal visible animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.85 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>📅 Reschedule</Text>
              <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 22 }}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>New Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {dates.map((d) => (
                  <TouchableOpacity
                    key={d.date}
                    style={{ marginRight: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: newDate === d.date ? COLORS.primary : COLORS.lightGray, alignItems: 'center', minWidth: 80 }}
                    onPress={() => setNewDate(d.date)}
                  >
                    <Text style={{ fontSize: 12, color: newDate === d.date ? COLORS.white : COLORS.textLight }}>{d.label.split(' ')[0]}</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: newDate === d.date ? COLORS.white : COLORS.text }}>{d.label.split(' ')[2]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>New Time</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {times.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: newTime === t ? COLORS.primary : COLORS.lightGray }}
                    onPress={() => setNewTime(t)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: newTime === t ? COLORS.white : COLORS.text }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Reason for Rescheduling</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray, marginBottom: 20 }}
                placeholder="Why do you need to reschedule?"
                value={reason}
                onChangeText={setReason}
                multiline
              />
              <TouchableOpacity
                style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 20 }}
                onPress={handleReschedule}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Send Request</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>My Activity</Text>
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4 }}>
          {[{ id: 'appointments', label: '📅 Appointments' }, { id: 'orders', label: '📦 Orders' }].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab.id ? COLORS.white : 'transparent' }}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab.id ? COLORS.primary : COLORS.white }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : activeTab === 'appointments' ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 50, marginBottom: 16 }}>📅</Text><Text style={{ fontSize: 16, color: COLORS.textLight }}>No appointments yet</Text></View>}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 }}>
                    Dr. {item.doctor_profiles?.profiles?.full_name || 'Doctor'}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>{item.doctor_profiles?.specialty}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>${item.fee}</Text>
                  <StatusBadge status={item.payment_status} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['pending', 'confirmed'].includes(item.status) && (
                    <>
                      <TouchableOpacity
                        style={{ backgroundColor: COLORS.primaryLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                        onPress={() => setShowReschedule(item)}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>📅 Reschedule</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ backgroundColor: '#FEE2E2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                        onPress={() => handleCancelAppointment(item)}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.error }}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status === 'completed' && !item.review_prompted && (
                    <TouchableOpacity
                      style={{ backgroundColor: COLORS.warning + '20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                      onPress={() => setShowReview({ type: 'appointment', item })}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.warning }}>⭐ Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 50, marginBottom: 16 }}>📦</Text><Text style={{ fontSize: 16, color: COLORS.textLight }}>No orders yet</Text></View>}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.pharmacy_profiles?.pharmacy_name}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>🛒 {(item.items || []).length} items • ${item.total_amount?.toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                <StatusBadge status={item.payment_status} />
                {item.status === 'delivered' && !item.review_prompted && (
                  <TouchableOpacity
                    style={{ backgroundColor: COLORS.warning + '20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                    onPress={() => setShowReview({ type: 'order', item })}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.warning }}>⭐ Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}

      {showReview && (
        <ReviewModal
          visible
          targetType={showReview.type === 'appointment' ? 'doctor' : 'pharmacy'}
          targetId={showReview.type === 'appointment' ? showReview.item.doctor_id : showReview.item.pharmacy_id}
          appointmentId={showReview.type === 'appointment' ? showReview.item.id : null}
          orderId={showReview.type === 'order' ? showReview.item.id : null}
          userId={user.id}
          targetName={showReview.type === 'appointment'
            ? `Dr. ${showReview.item.doctor_profiles?.profiles?.full_name}`
            : showReview.item.pharmacy_profiles?.pharmacy_name}
          onDone={async () => {
            if (showReview.type === 'appointment') {
              await supabase.from('appointments').update({ review_prompted: true }).eq('id', showReview.item.id);
            } else {
              await supabase.from('orders').update({ review_prompted: true }).eq('id', showReview.item.id);
            }
            setShowReview(null);
            fetchAll();
          }}
        />
      )}

      {showReschedule && (
        <RescheduleModal
          appointment={showReschedule}
          onClose={() => setShowReschedule(null)}
        />
      )}
    </View>
  );
}

// ============================================
// PATIENT PROFILE SCREEN
// ============================================
function PatientProfileScreen({ user, profile, onLogout }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({ appointments: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [a, o] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
      ]);
      setStats({ appointments: a.count || 0, orders: o.count || 0 });
    };
    fetchStats();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>{profile?.full_name || 'Patient'}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{user.email}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>🙋 Patient</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: 'Appointments', value: stats.appointments },
            { icon: '📦', label: 'Orders', value: stats.orders },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontSize: 26, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '💳', label: 'Payment Methods' },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📋', label: 'Terms & Privacy Policy' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0{'\n'}© 2026 Reine Mande Ltd. All rights reserved.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

// ============================================
// PATIENT HOME SCREEN
// ============================================
function PatientHomeScreen({ user, profile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTopDoctors(); }, []);

  const fetchTopDoctors = async () => {
    const { data } = await supabase
      .from('doctor_profiles')
      .select('*, profiles(full_name)')
      .eq('is_verified', true)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false })
      .limit(5);
    setTopDoctors(data || []);
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Good day 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name || 'Welcome!'}</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, gap: 10 }}
          onPress={() => onNavigate('search')}
        >
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <Text style={{ fontSize: 15, color: COLORS.gray }}>Search doctors, specialties...</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👨‍⚕️', label: 'Find Doctor', screen: 'search', color: '#EFF6FF' },
            { icon: '💊', label: 'Pharmacy', screen: 'pharmacy', color: '#F0FDF4' },
            { icon: '📋', label: 'My Activity', screen: 'activity', color: '#FFF7ED' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ flex: 1, backgroundColor: item.color, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Banner */}
        <View style={{ backgroundColor: COLORS.secondary, borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>💊 Medications Delivered</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Order from verified pharmacies. Delivered in under 60 mins.</Text>
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' }}
              onPress={() => onNavigate('pharmacy')}
            >
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.secondary }}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 60 }}>🚚</Text>
        </View>

        {/* Specialties */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Browse by Specialty</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {SPECIALTIES.slice(0, 8).map((specialty) => (
            <TouchableOpacity
              key={specialty.id}
              style={{ width: (width - 60) / 2, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate('search', { specialty: specialty.name })}
            >
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: specialty.color, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 24 }}>{specialty.icon}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{specialty.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Doctors */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Top Rated Doctors</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : topDoctors.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>No verified doctors yet</Text>
          </View>
        ) : (
          topDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('doctorProfile', { doctor })}
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{doctor.profiles?.full_name}</Text>
                  <Text>✅</Text>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 2 }}>{doctor.specialty}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>📍 {doctor.location}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {doctor.rating?.toFixed(1) || 'New'} ({doctor.total_reviews || 0})</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}/visit</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 20 }}
          onPress={() => onNavigate('search')}
        >
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>View All Doctors →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================================
// PATIENT PHARMACY SCREEN
// ============================================
function PatientPharmacyScreen({ user, profile }) {
  const [activeTab, setActiveTab] = useState('pharmacies');
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    patientName: profile?.full_name || '',
    patientAge: '',
    patientGender: '',
    deliveryReason: '',
    language: 'English',
    additionalNotes: '',
    deliveryAddress: '',
    prescriptionNote: '',
  });

  useEffect(() => { fetchPharmacies(); }, []);
  useEffect(() => { if (selectedPharmacy) fetchMedications(selectedPharmacy.id); }, [selectedPharmacy]);

  const fetchPharmacies = async () => {
    const { data } = await supabase.from('pharmacy_profiles').select('*, profiles(full_name, email)').eq('is_verified', true).eq('verification_status', 'approved').order('rating', { ascending: false });
    setPharmacies(data || []);
    setLoading(false);
  };

  const fetchMedications = async (pharmacyId) => {
    const { data } = await supabase.from('medications').select('*').eq('pharmacy_id', pharmacyId).eq('in_stock', true);
    setMedications(data || []);
  };

  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) setCart(cart.map(c => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { ...med, quantity: 1 }]);
  };

  const removeFromCart = (medId) => setCart(cart.filter(c => c.id !== medId));

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePaymentSuccess = async (paymentMethod) => {
    setShowPayment(false);
    try {
      const commission = cartTotal * 0.1;
      const { data: order, error } = await supabase.from('orders').insert({
        patient_id: user.id,
        pharmacy_id: selectedPharmacy.id,
        patient_name: orderForm.patientName,
        patient_age: parseInt(orderForm.patientAge),
        patient_gender: orderForm.patientGender,
        delivery_reason: orderForm.deliveryReason,
        language: orderForm.language,
        additional_notes: orderForm.additionalNotes,
        items: cart,
        total_amount: cartTotal,
        delivery_address: orderForm.deliveryAddress,
        status: 'pending',
        pharmacy_confirmed: false,
        payment_status: 'held',
        estimated_delivery: '45-60 mins',
      }).select().single();

      if (error) throw error;

      await supabase.from('transactions').insert({
        patient_id: user.id,
        order_id: order.id,
        amount: cartTotal,
        commission_amount: commission,
        net_amount: cartTotal - commission,
        payment_method: paymentMethod,
        payment_status: 'held',
      });

      // Notify pharmacy
      await supabase.from('notifications').insert({
        user_id: selectedPharmacy.user_id,
        title: '📦 New Order Request',
        body: `${orderForm.patientName} has placed an order for ${cartCount} items worth $${cartTotal.toFixed(2)}. Please confirm.`,
        type: 'order',
        data: { icon: '📦', order_id: order.id },
      });

      Alert.alert('Order Placed! 🎉', `Your order has been placed and is pending pharmacy confirmation. Payment of $${cartTotal.toFixed(2)} is securely held.`, [
        { text: 'OK', onPress: () => { setCart([]); setShowCart(false); setShowOrderForm(false); } }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const genders = ['Male', 'Female', 'Other'];
  const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Pharmacy</Text>
          {cart.length > 0 && (
            <TouchableOpacity style={{ position: 'relative' }} onPress={() => setShowCart(true)}>
              <Text style={{ fontSize: 28 }}>🛒</Text>
              <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.accent, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, padding: 4 }}>
          {['pharmacies', 'medications'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.pharmacyColor : 'transparent' }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'pharmacies' ? (
        loading ? <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.pharmacyColor} /> : (
          <FlatList
            data={pharmacies}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>🏪</Text><Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No pharmacies available</Text></View>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                onPress={() => { setSelectedPharmacy(item); setActiveTab('medications'); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 26 }}>🏪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.pharmacy_name}</Text>
                      <Text>✅</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {item.address}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'}</Text>
                    <Text style={{ fontSize: 12, color: item.is_open_24h ? COLORS.success : COLORS.error }}>
                      {item.is_open_24h ? '🟢 Open 24h' : '🔴 Limited Hours'}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>Order →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      ) : (
        <View style={{ flex: 1 }}>
          {selectedPharmacy && (
            <View style={{ backgroundColor: COLORS.white, padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setActiveTab('pharmacies')} style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 20 }}>←</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{selectedPharmacy.pharmacy_name}</Text>
            </View>
          )}
          <View style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <TextInput style={{ flex: 1, fontSize: 15 }} placeholder="Search medications..." value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </View>
          <FlatList
            data={filteredMeds}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
            ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>💊</Text><Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 12 }}>No medications found</Text></View>}
            renderItem={({ item }) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                  <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 24 }}>{item.icon || '💊'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.category} • {item.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.pharmacyColor }}>${item.price}</Text>
                      {item.requires_prescription && (
                        <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: '#D97706' }}>Rx Required</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ backgroundColor: inCart ? COLORS.success : COLORS.pharmacyColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{inCart ? `✓ ${inCart.quantity}` : 'Add'}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Cart Modal */}
      <Modal visible={showCart} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.75 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>🛒 Cart ({cartCount})</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}><Text style={{ fontSize: 22 }}>✕</Text></TouchableOpacity>
            </View>
            {cart.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 30 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🛒</Text>
                <Text style={{ fontSize: 16, color: COLORS.textLight }}>Cart is empty</Text>
              </View>
            ) : (
              <>
                <ScrollView style={{ maxHeight: 260 }}>
                  {cart.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textLight }}>Qty: {item.quantity} × ${item.price}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>${(item.price * item.quantity).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={{ fontSize: 18 }}>🗑️</Text></TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.primary }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                    onPress={() => { setShowCart(false); setShowOrderForm(true); }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>📋 Fill Delivery Form</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Order Form Modal */}
      <Modal visible={showOrderForm} animationType="slide">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => setShowOrderForm(false)} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Delivery Details</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Fill in your delivery information</Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Input label="Full Name *" value={orderForm.patientName} onChangeText={(v) => setOrderForm({ ...orderForm, patientName: v })} placeholder="Your full name" icon="👤" />
            <Input label="Age *" value={orderForm.patientAge} onChangeText={(v) => setOrderForm({ ...orderForm, patientAge: v })} placeholder="e.g. 28" keyboard="numeric" icon="🎂" />

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Gender *</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {genders.map((g) => (
                  <TouchableOpacity key={g} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: orderForm.patientGender === g ? COLORS.pharmacyColor : COLORS.white, borderWidth: 1, borderColor: orderForm.patientGender === g ? COLORS.pharmacyColor : COLORS.border, alignItems: 'center' }} onPress={() => setOrderForm({ ...orderForm, patientGender: g })}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: orderForm.patientGender === g ? COLORS.white : COLORS.text }}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input label="Delivery Address *" value={orderForm.deliveryAddress} onChangeText={(v) => setOrderForm({ ...orderForm, deliveryAddress: v })} placeholder="Full delivery address" icon="📍" />
            <Input label="Reason for Order" value={orderForm.deliveryReason} onChangeText={(v) => setOrderForm({ ...orderForm, deliveryReason: v })} placeholder="e.g. Prescribed by Dr. Smith for..." icon="📋" />
            <Input label="Additional Notes" value={orderForm.additionalNotes} onChangeText={(v) => setOrderForm({ ...orderForm, additionalNotes: v })} placeholder="Any special instructions..." multiline icon="📝" />

            <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#FED7AA' }}>
              <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 18 }}>
                ⚠️ For prescription medications, the pharmacy may contact you to verify your prescription before confirming the order.
              </Text>
            </View>

            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Order Total: ${cartTotal.toFixed(2)}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>Payment held securely until delivery confirmed ✅</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 40 }}
              onPress={() => {
                if (!orderForm.patientName || !orderForm.patientAge || !orderForm.patientGender || !orderForm.deliveryAddress) {
                  Alert.alert('Missing Info', 'Please fill in all required fields');
                  return;
                }
                setShowPayment(true);
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>💳 Proceed to Payment — ${cartTotal.toFixed(2)}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <PaymentModal
        visible={showPayment}
        amount={cartTotal.toFixed(2)}
        title={`Medication Order (${cartCount} items)`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
        isHeld
      />
    </View>
  );
}

// ============================================
// PATIENT SHELL — Main Tab Navigator
// Replace PatientShell placeholder in Part 1
// ============================================
export function PatientShell({ profile, onLogout }) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  // Sub-screens
  if (screen === 'doctorProfile' && screenParams.doctor) {
    return (
      <DoctorProfileScreen
        doctor={screenParams.doctor}
        user={user}
        profile={profile}
        onBack={() => { setScreen(activeTab); setScreenParams({}); }}
        onBook={() => navigate('bookAppointment', { doctor: screenParams.doctor })}
      />
    );
  }

  if (screen === 'bookAppointment' && screenParams.doctor) {
    return (
      <BookingFormScreen
        doctor={screenParams.doctor}
        user={user}
        profile={profile}
        onBack={() => navigate('doctorProfile', { doctor: screenParams.doctor })}
        onSuccess={() => switchTab('activity')}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Find' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'activity', icon: '📋', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <PatientHomeScreen
            user={user}
            profile={profile}
            onNavigate={(s, p = {}) => {
              if (['search', 'pharmacy', 'activity', 'profile'].includes(s)) {
                if (p.specialty) { setActiveTab('search'); setScreen('search'); setScreenParams(p); }
                else switchTab(s);
              } else {
                navigate(s, p);
              }
            }}
          />
        )}
        {activeTab === 'search' && (
          <PatientSearchScreen
            user={user}
            profile={profile}
            initialSpecialty={screenParams.specialty}
            onSelectDoctor={(doctor) => navigate('doctorProfile', { doctor })}
          />
        )}
        {activeTab === 'pharmacy' && (
          <PatientPharmacyScreen user={user} profile={profile} />
        )}
        {activeTab === 'activity' && (
          <PatientActivityScreen user={user} />
        )}
        {activeTab === 'profile' && (
          <PatientProfileScreen user={user} profile={profile} onLogout={onLogout} />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.primary : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Make StatusBadge and useApp available (already in Part 1)
// These are re-exported for use in later parts
// ============================================
// PART 3 — DOCTOR DASHBOARD & PHARMACY DASHBOARD
// MediConnect v2.0
// Replaces DoctorShell and PharmacyShell placeholders from Part 1
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, Modal, Platform,
  RefreshControl, Switch,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// DOCTOR HOME SCREEN
// ============================================
function DoctorHomeScreen({ user, profile, doctorProfile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingConfirmations: 0,
    totalEarnings: 0,
    totalPatients: 0,
    completedToday: 0,
    pendingPayments: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [allAppts, todayAppts, transactions] = await Promise.all([
        supabase.from('appointments').select('*').eq('doctor_id', doctorProfile.id),
        supabase.from('appointments').select('*, profiles(full_name, email)').eq('doctor_id', doctorProfile.id).eq('appointment_date', today).order('appointment_time'),
        supabase.from('transactions').select('*').eq('appointment_id', doctorProfile.id),
      ]);

      const all = allAppts.data || [];
      const todays = todayAppts.data || [];

      setStats({
        todayAppointments: todays.length,
        pendingConfirmations: all.filter(a => a.status === 'pending').length,
        totalEarnings: (doctorProfile.total_earnings || 0),
        totalPatients: new Set(all.map(a => a.patient_id)).size,
        completedToday: todays.filter(a => a.status === 'completed').length,
        pendingPayments: all.filter(a => a.payment_status === 'held').length,
      });

      setTodayAppointments(todays);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Welcome back 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Dr. {profile.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{doctorProfile.specialty}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
            <View style={{ backgroundColor: doctorProfile.is_available ? COLORS.success : COLORS.error, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>
                {doctorProfile.is_available ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: "Today's Appts", value: stats.todayAppointments, color: '#EFF6FF', textColor: COLORS.doctorColor },
            { icon: '⏳', label: 'Pending', value: stats.pendingConfirmations, color: '#FFF7ED', textColor: COLORS.warning },
            { icon: '✅', label: 'Completed Today', value: stats.completedToday, color: '#F0FDF4', textColor: COLORS.success },
            { icon: '👥', label: 'Total Patients', value: stats.totalPatients, color: '#F5F3FF', textColor: COLORS.adminColor },
          ].map((stat) => (
            <View key={stat.label} style={{ width: (width - 52) / 2, backgroundColor: stat.color, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Earnings Card */}
        <View style={{ backgroundColor: COLORS.doctorColor, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Total Earnings</Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
            ${doctorProfile.total_earnings?.toFixed(2) || '0.00'}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            {stats.pendingPayments} payment{stats.pendingPayments !== 1 ? 's' : ''} pending release
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('appointments')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.white }}>View All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('earnings')}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.doctorColor }}>Earnings →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: 'Appointments', screen: 'appointments' },
            { icon: '⏰', label: 'Availability', screen: 'availability' },
            { icon: '👤', label: 'My Profile', screen: 'profile' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Appointments */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>
          Today's Schedule
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.doctorColor} />
        ) : todayAppointments.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📅</Text>
            <Text style={{ fontSize: 15, color: COLORS.textLight }}>No appointments today</Text>
          </View>
        ) : (
          todayAppointments.map((appt) => (
            <TouchableOpacity
              key={appt.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: appt.status === 'confirmed' ? COLORS.success : appt.status === 'pending' ? COLORS.warning : COLORS.gray, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('appointmentDetail', { appointment: appt })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{appt.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{appt.reason}</Text>
                </View>
                <StatusBadge status={appt.status} />
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {appt.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{appt.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⏱ {appt.session_duration_minutes}min</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// ============================================
// DOCTOR APPOINTMENTS SCREEN
// ============================================
function DoctorAppointmentsScreen({ user, doctorProfile, onNavigate }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'pending', label: '⏳ Pending' },
    { id: 'confirmed', label: '✅ Confirmed' },
    { id: 'completed', label: '🏁 Completed' },
    { id: 'cancelled', label: '❌ Cancelled' },
  ];

  useEffect(() => { fetchAppointments(); }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*, profiles!appointments_patient_id_fkey(full_name, email)')
        .eq('doctor_id', doctorProfile.id)
        .order('appointment_date', { ascending: false });

      if (activeTab === 'pending') {
        query = query.in('status', ['pending', 'rescheduled']);
      } else {
        query = query.eq('status', activeTab);
      }

      const { data } = await query;
      setAppointments(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchAppointments(); };

  const handleConfirm = async (appt) => {
    Alert.alert('Confirm Appointment', `Confirm appointment with ${appt.patient_name} on ${appt.appointment_date} at ${appt.appointment_time}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm ✅', onPress: async () => {
          await supabase.from('appointments').update({
            status: 'confirmed',
            doctor_confirmed: true,
            doctor_confirmed_at: new Date().toISOString(),
          }).eq('id', appt.id);

          await supabase.from('notifications').insert({
            user_id: appt.patient_id,
            title: '✅ Appointment Confirmed!',
            body: `Dr. ${user.user_metadata?.full_name || 'your doctor'} confirmed your appointment on ${appt.appointment_date} at ${appt.appointment_time}.`,
            type: 'appointment',
            data: { icon: '✅', appointment_id: appt.id },
          });

          fetchAppointments();
        }
      }
    ]);
  };

  const handleReject = async (appt) => {
    Alert.prompt(
      'Reject Appointment',
      'Please provide a reason for rejection:',
      async (reason) => {
        if (!reason) return;
        await supabase.from('appointments').update({
          status: 'cancelled',
          doctor_cancel_reason: reason,
          payment_status: 'refunded',
        }).eq('id', appt.id);

        // Notify patient with reason
        await supabase.from('notifications').insert({
          user_id: appt.patient_id,
          title: '❌ Appointment Rejected',
          body: `Your appointment on ${appt.appointment_date} was rejected. Reason: ${reason}. Your payment will be refunded.`,
          type: 'appointment',
          data: { icon: '❌', appointment_id: appt.id },
        });

        // Notify admin for refund processing
        const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
        if (admins?.length > 0) {
          await supabase.from('notifications').insert(admins.map(a => ({
            user_id: a.id,
            title: '↩️ Refund Required',
            body: `Dr. ${user.user_metadata?.full_name} rejected appointment for ${appt.patient_name}. Refund of $${appt.fee} needed.`,
            type: 'refund',
            data: { icon: '↩️', appointment_id: appt.id },
          })));
        }

        fetchAppointments();
      },
      'plain-text'
    );
  };

  const handleComplete = async (appt) => {
    Alert.alert('Complete Appointment', 'Mark this appointment as completed? This will release the payment to you.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete ✅', onPress: async () => {
          const commission = (appt.fee || 0) * (doctorProfile.commission_rate / 100 || 0.1);
          const net = (appt.fee || 0) - commission;

          await supabase.from('appointments').update({
            status: 'completed',
            payment_status: 'released',
            call_status: appt.appointment_type === 'video' ? 'completed' : appt.call_status,
          }).eq('id', appt.id);

          // Update doctor earnings
          await supabase.from('doctor_profiles').update({
            total_earnings: (doctorProfile.total_earnings || 0) + net,
          }).eq('id', doctorProfile.id);

          // Update transaction
          await supabase.from('transactions')
            .update({ payment_status: 'completed' })
            .eq('appointment_id', appt.id);

          // Record commission
          await supabase.from('commissions').insert({
            appointment_id: appt.id,
            from_user_id: appt.patient_id,
            amount: commission,
            status: 'collected',
            collected_at: new Date().toISOString(),
          });

          // Notify patient
          await supabase.from('notifications').insert({
            user_id: appt.patient_id,
            title: '✅ Appointment Completed',
            body: `Your appointment with Dr. ${user.user_metadata?.full_name} is completed. Payment of $${appt.fee} has been processed. Please leave a review!`,
            type: 'appointment',
            data: { icon: '✅', appointment_id: appt.id },
          });

          fetchAppointments();
          Alert.alert('✅ Done!', `Appointment completed. $${net.toFixed(2)} has been added to your earnings.`);
        }
      }
    ]);
  };

  const handleRescheduleResponse = async (appt, approved) => {
    if (approved) {
      await supabase.from('appointments').update({
        appointment_date: appt.reschedule_date,
        appointment_time: appt.reschedule_time,
        status: 'confirmed',
        reschedule_status: 'approved',
      }).eq('id', appt.id);

      await supabase.from('notifications').insert({
        user_id: appt.patient_id,
        title: '✅ Reschedule Approved',
        body: `Your reschedule request to ${appt.reschedule_date} at ${appt.reschedule_time} has been approved.`,
        type: 'reschedule',
        data: { icon: '📅' },
      });
    } else {
      await supabase.from('appointments').update({
        status: 'confirmed',
        reschedule_status: 'rejected',
      }).eq('id', appt.id);

      await supabase.from('notifications').insert({
        user_id: appt.patient_id,
        title: '❌ Reschedule Rejected',
        body: `Your reschedule request was rejected. Your original appointment stands.`,
        type: 'reschedule',
        data: { icon: '❌' },
      });
    }
    fetchAppointments();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Appointments</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === tab.id ? COLORS.doctorColor : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.doctorColor} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>📅</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No {activeTab} appointments</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              {/* Patient Info */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>
                    {item.patient_age}yr • {item.patient_gender} • {item.language}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {/* Reason */}
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 2 }}>Reason</Text>
                <Text style={{ fontSize: 13, color: COLORS.text }}>{item.reason}</Text>
              </View>

              {/* Details */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⏱ {item.session_duration_minutes}min</Text>
              </View>

              {/* Fee & Payment */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>${item.fee}</Text>
                <StatusBadge status={item.payment_status} />
              </View>

              {/* Reschedule Request */}
              {item.status === 'rescheduled' && item.reschedule_status === 'pending' && (
                <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#FED7AA' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 4 }}>📅 Reschedule Request</Text>
                  <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 2 }}>New Date: {item.reschedule_date} at {item.reschedule_time}</Text>
                  <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 10 }}>Reason: {item.reschedule_reason}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}
                      onPress={() => handleRescheduleResponse(item, true)}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white }}>✅ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}
                      onPress={() => handleRescheduleResponse(item, false)}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      onPress={() => handleConfirm(item)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>✅ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      onPress={() => handleReject(item)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.status === 'confirmed' && (
                  <>
                    {item.appointment_type === 'video' && (
                      <TouchableOpacity
                        style={{ flex: 1, backgroundColor: COLORS.doctorColor, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                        onPress={() => onNavigate('videoCall', { appointment: item })}
                      >
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>📹 Start Call</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      onPress={() => handleComplete(item)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>🏁 Complete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// DOCTOR AVAILABILITY SCREEN
// ============================================
function DoctorAvailabilityScreen({ user, doctorProfile, onBack }) {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctorProfile.id);

    // Build full week with existing data
    const fullWeek = days.map(day => {
      const existing = (data || []).find(a => a.day_of_week === day.id);
      return existing || {
        day_of_week: day.id,
        start_time: '09:00',
        end_time: '17:00',
        is_available: false,
        doctor_id: doctorProfile.id,
      };
    });

    setAvailability(fullWeek);
    setLoading(false);
  };

  const toggleDay = (dayId) => {
    setAvailability(prev => prev.map(a =>
      a.day_of_week === dayId ? { ...a, is_available: !a.is_available } : a
    ));
  };

  const updateTime = (dayId, field, value) => {
    setAvailability(prev => prev.map(a =>
      a.day_of_week === dayId ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete existing and re-insert
      await supabase.from('doctor_availability').delete().eq('doctor_id', doctorProfile.id);

      const toInsert = availability.filter(a => a.is_available).map(a => ({
        doctor_id: doctorProfile.id,
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
        is_available: true,
      }));

      if (toInsert.length > 0) {
        await supabase.from('doctor_availability').insert(toInsert);
      }

      // Update doctor availability status
      await supabase.from('doctor_profiles').update({
        is_available: toInsert.length > 0,
      }).eq('id', doctorProfile.id);

      Alert.alert('Saved ✅', 'Your availability has been updated.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.doctorColor} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Set Availability</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Choose when patients can book you</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' }}>
          <Text style={{ fontSize: 13, color: '#1E40AF', lineHeight: 18 }}>
            💡 Toggle days on/off and set your working hours. Patients will only see available days when booking.
          </Text>
        </View>

        {availability.map((slot) => {
          const dayLabel = days.find(d => d.id === slot.day_of_week)?.label;
          return (
            <View key={slot.day_of_week} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: slot.is_available ? COLORS.doctorColor : COLORS.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: slot.is_available ? 14 : 0 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: slot.is_available ? COLORS.text : COLORS.gray }}>{dayLabel}</Text>
                <Switch
                  value={slot.is_available}
                  onValueChange={() => toggleDay(slot.day_of_week)}
                  trackColor={{ true: COLORS.doctorColor }}
                  thumbColor={slot.is_available ? COLORS.white : COLORS.lightGray}
                />
              </View>
              {slot.is_available && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>Start Time</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['08:00', '09:00', '10:00', '11:00'].map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: slot.start_time === t ? COLORS.doctorColor : COLORS.lightGray }}
                          onPress={() => updateTime(slot.day_of_week, 'start_time', t)}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: slot.start_time === t ? COLORS.white : COLORS.text }}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>End Time</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['15:00', '17:00', '18:00', '20:00'].map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: slot.end_time === t ? COLORS.doctorColor : COLORS.lightGray }}
                          onPress={() => updateTime(slot.day_of_week, 'end_time', t)}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: slot.end_time === t ? COLORS.white : COLORS.text }}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={{ backgroundColor: saving ? COLORS.gray : COLORS.doctorColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 40 }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>💾 Save Availability</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ============================================
// DOCTOR EARNINGS SCREEN
// ============================================
function DoctorEarningsScreen({ user, doctorProfile, onBack }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0, thisMonth: 0, pending: 0, commissionPaid: 0,
  });

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    try {
      const { data: appts } = await supabase
        .from('appointments')
        .select('*, profiles!appointments_patient_id_fkey(full_name)')
        .eq('doctor_id', doctorProfile.id)
        .in('payment_status', ['released', 'held'])
        .order('created_at', { ascending: false });

      const all = appts || [];
      const now = new Date();
      const thisMonth = all.filter(a => {
        const d = new Date(a.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const commission = doctorProfile.commission_rate / 100 || 0.1;

      setStats({
        total: doctorProfile.total_earnings || 0,
        thisMonth: thisMonth.filter(a => a.payment_status === 'released').reduce((s, a) => s + ((a.fee || 0) * (1 - commission)), 0),
        pending: all.filter(a => a.payment_status === 'held').reduce((s, a) => s + ((a.fee || 0) * (1 - commission)), 0),
        commissionPaid: all.filter(a => a.payment_status === 'released').reduce((s, a) => s + ((a.fee || 0) * commission), 0),
      });

      setTransactions(all);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Earnings</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Total Card */}
        <View style={{ backgroundColor: COLORS.doctorColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Earnings</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>
            ${stats.total.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            After {doctorProfile.commission_rate || 10}% platform commission
          </Text>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'This Month', value: stats.thisMonth, icon: '📅', color: '#EFF6FF' },
            { label: 'Pending Release', value: stats.pending, icon: '🔒', color: '#FFF7ED' },
            { label: 'Commission Paid', value: stats.commissionPaid, icon: '💼', color: '#F5F3FF' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.color, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>${s.value.toFixed(2)}</Text>
              <Text style={{ fontSize: 10, color: COLORS.textLight, textAlign: 'center' }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Transaction History */}
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Transaction History</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.doctorColor} />
        ) : transactions.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>No transactions yet</Text>
          </View>
        ) : (
          transactions.map((item) => {
            const commission = doctorProfile.commission_rate / 100 || 0.1;
            const net = (item.fee || 0) * (1 - commission);
            return (
              <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.payment_status === 'released' ? '#F0FDF4' : '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 22 }}>{item.payment_status === 'released' ? '✅' : '🔒'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_date} • {item.appointment_type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.payment_status === 'released' ? COLORS.success : COLORS.warning }}>
                    ${net.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 10, color: COLORS.textLight }}>of ${item.fee}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// DOCTOR PROFILE EDITOR
// ============================================
function DoctorProfileEditor({ user, profile, doctorProfile, onBack, onSaved }) {
  const [form, setForm] = useState({
    bio: doctorProfile.bio || '',
    consultationFee: String(doctorProfile.consultation_fee || ''),
    videoFee: String(doctorProfile.video_call_fee || ''),
    hospital: doctorProfile.hospital_affiliation || '',
    location: doctorProfile.location || '',
    phone: profile.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(doctorProfile.is_available);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('doctor_profiles').update({
        bio: form.bio,
        consultation_fee: parseFloat(form.consultationFee) || 0,
        video_call_fee: parseFloat(form.videoFee) || 0,
        hospital_affiliation: form.hospital,
        location: form.location,
        is_available: isAvailable,
      }).eq('id', doctorProfile.id);

      await supabase.from('profiles').update({
        phone: form.phone,
      }).eq('id', user.id);

      Alert.alert('Saved ✅', 'Your profile has been updated.');
      onSaved();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Status Toggle */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>Available for Bookings</Text>
            <Text style={{ fontSize: 12, color: COLORS.textLight }}>Patients can book you when on</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ true: COLORS.success }}
          />
        </View>

        <Input label="Location (City, Country)" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} placeholder="e.g. London, UK" icon="📍" />
        <Input label="Hospital / Clinic" value={form.hospital} onChangeText={(v) => setForm({ ...form, hospital: v })} placeholder="e.g. St. Mary's Hospital" icon="🏥" />
        <Input label="Phone Number" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="+44 7000 000000" keyboard="phone-pad" icon="📞" />
        <Input label="In-Person Fee (USD)" value={form.consultationFee} onChangeText={(v) => setForm({ ...form, consultationFee: v })} placeholder="e.g. 150" keyboard="numeric" icon="💵" />
        <Input label="Video Call Fee (USD)" value={form.videoFee} onChangeText={(v) => setForm({ ...form, videoFee: v })} placeholder="e.g. 120" keyboard="numeric" icon="📹" />

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Professional Bio</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 120, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
            placeholder="Describe your experience and specializations..."
            value={form.bio}
            onChangeText={(v) => setForm({ ...form, bio: v })}
            multiline
          />
        </View>

        {/* Verified badge */}
        <View style={{ backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#86EFAC' }}>
          <Text style={{ fontSize: 22 }}>✅</Text>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#166534' }}>Verified Doctor</Text>
            <Text style={{ fontSize: 12, color: '#166534' }}>License: {doctorProfile.license_number}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: saving ? COLORS.gray : COLORS.doctorColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 40 }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>💾 Save Changes</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ============================================
// DOCTOR SHELL — Main Tab Navigator
// Replaces DoctorShell placeholder from Part 1
// ============================================
export function DoctorShell({ profile, doctorProfile: initialDoctorProfile, onLogout }) {
  const { user, refreshProfile, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [doctorProfile, setDoctorProfile] = useState(initialDoctorProfile);

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  const refreshDoctor = async () => {
    const { data } = await supabase.from('doctor_profiles').select('*').eq('user_id', user.id).single();
    if (data) setDoctorProfile(data);
  };

  // Sub screens
  if (screen === 'availability') {
    return <DoctorAvailabilityScreen user={user} doctorProfile={doctorProfile} onBack={() => switchTab('home')} />;
  }
  if (screen === 'earnings') {
    return <DoctorEarningsScreen user={user} doctorProfile={doctorProfile} onBack={() => switchTab('home')} />;
  }
  if (screen === 'editProfile') {
    return (
      <DoctorProfileEditor
        user={user}
        profile={profile}
        doctorProfile={doctorProfile}
        onBack={() => switchTab('profile')}
        onSaved={() => { refreshDoctor(); switchTab('profile'); }}
      />
    );
  }
  if (screen === 'videoCall' && screenParams.appointment) {
    return (
      <VideoCallScreen
        appointment={screenParams.appointment}
        user={user}
        role="doctor"
        onEnd={() => switchTab('appointments')}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'availability', icon: '⏰', label: 'Schedule' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <DoctorHomeScreen
            user={user}
            profile={profile}
            doctorProfile={doctorProfile}
            onNavigate={(s, p = {}) => {
              if (tabs.find(t => t.id === s)) switchTab(s);
              else navigate(s, p);
            }}
          />
        )}
        {activeTab === 'appointments' && (
          <DoctorAppointmentsScreen
            user={user}
            doctorProfile={doctorProfile}
            onNavigate={(s, p = {}) => navigate(s, p)}
          />
        )}
        {activeTab === 'availability' && (
          <DoctorAvailabilityScreen
            user={user}
            doctorProfile={doctorProfile}
          />
        )}
        {activeTab === 'earnings' && (
          <DoctorEarningsScreen
            user={user}
            doctorProfile={doctorProfile}
            onBack={() => switchTab('home')}
          />
        )}
        {activeTab === 'profile' && (
          <DoctorProfileView
            user={user}
            profile={profile}
            doctorProfile={doctorProfile}
            onLogout={onLogout}
            onEdit={() => navigate('editProfile')}
          />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.doctorColor, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.doctorColor : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ============================================
// DOCTOR PROFILE VIEW
// ============================================
function DoctorProfileView({ user, profile, doctorProfile, onLogout, onEdit }) {
  const { setShowNotifications } = useApp();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>👨‍⚕️</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 }}>Dr. {profile.full_name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{doctorProfile.specialty}</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>📍 {doctorProfile.location}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>✅ Verified Doctor</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '⭐', label: 'Rating', value: doctorProfile.rating?.toFixed(1) || 'New' },
            { icon: '💬', label: 'Reviews', value: doctorProfile.total_reviews || 0 },
            { icon: '💰', label: 'Earnings', value: `$${doctorProfile.total_earnings?.toFixed(0) || 0}` },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.doctorColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          style={{ backgroundColor: COLORS.doctorColor, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 16, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          onPress={onEdit}
        >
          <Text style={{ fontSize: 18 }}>✏️</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Menu */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '💳', label: 'Payment Details' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📞', label: 'Contact Admin' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0 • Doctor Portal{'\n'}© 2026 Reine Mande Ltd.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

// ============================================
// VIDEO CALL SCREEN (shared: doctor + patient)
// Full timer, auto-end, pause/resume logic
// ============================================
export function VideoCallScreen({ appointment, user, role, onEnd }) {
  const [callStatus, setCallStatus] = useState('connecting');
  const [timeRemaining, setTimeRemaining] = useState(appointment.session_duration_minutes * 60);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const totalSeconds = appointment.session_duration_minutes * 60;

  useEffect(() => {
    // Start connecting animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Simulate connection after 2s
    const connectTimer = setTimeout(async () => {
      setCallStatus('active');

      // Update DB: call started
      await supabase.from('appointments').update({
        call_status: 'in-progress',
        call_started_at: new Date().toISOString(),
        status: 'in-progress',
      }).eq('id', appointment.id);

      startTimer();
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleCallEnd('time_up');
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPaused(true);
    setCallStatus('paused');
    supabase.from('appointments').update({ call_status: 'paused' }).eq('id', appointment.id);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setCallStatus('active');
    supabase.from('appointments').update({ call_status: 'in-progress' }).eq('id', appointment.id);
    startTimer();
  };

  const handleCallEnd = async (reason = 'manual') => {
    if (timerRef.current) clearInterval(timerRef.current);

    const isCompleted = reason === 'time_up' || reason === 'manual_complete';

    await supabase.from('appointments').update({
      call_status: isCompleted ? 'completed' : 'paused',
      call_ended_at: new Date().toISOString(),
      call_duration_seconds: timeElapsed,
      status: isCompleted ? 'completed' : 'in-progress',
      payment_status: isCompleted ? 'released' : 'held',
    }).eq('id', appointment.id);

    if (isCompleted) {
      // Notify both parties
      const otherUserId = role === 'doctor' ? appointment.patient_id : appointment.doctor_profiles?.user_id;
      if (otherUserId) {
        await supabase.from('notifications').insert({
          user_id: otherUserId,
          title: reason === 'time_up' ? '⏰ Session Time Ended' : '✅ Call Completed',
          body: `Your video session has ended. Duration: ${formatTime(timeElapsed)}.`,
          type: 'call',
          data: { icon: '📹' },
        });
      }
    }

    setCallStatus(isCompleted ? 'completed' : 'disconnected');
    setTimeout(() => onEnd(), 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;

  const timeColor = timeRemaining <= 300
    ? COLORS.error
    : timeRemaining <= 600
    ? COLORS.warning
    : COLORS.success;

  if (callStatus === 'connecting') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1117', justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.doctorColor, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 50 }}>{role === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
          </View>
        </Animated.View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>Connecting...</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          {role === 'doctor' ? `Calling ${appointment.patient_name}` : `Calling Dr. ${appointment.doctor_profiles?.profiles?.full_name || 'Doctor'}`}
        </Text>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (callStatus === 'completed' || callStatus === 'disconnected') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1117', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>{callStatus === 'completed' ? '✅' : '📵'}</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>
          {callStatus === 'completed' ? 'Call Completed' : 'Call Ended'}
        </Text>
        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Duration: {formatTime(timeElapsed)}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1117' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1117" />

      {/* Remote Video Area */}
      <View style={{ flex: 1, backgroundColor: '#1A1D2E', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.doctorColor + '40', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 60 }}>{role === 'doctor' ? '🙋' : '👨‍⚕️'}</Text>
        </View>
        <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: '600' }}>
          {role === 'doctor' ? appointment.patient_name : `Dr. ${appointment.doctor_profiles?.profiles?.full_name || 'Doctor'}`}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isPaused ? COLORS.warning : COLORS.success }} />
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{isPaused ? 'Paused' : 'Connected'}</Text>
        </View>
      </View>

      {/* Self View */}
      <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, width: 100, height: 140, borderRadius: 14, backgroundColor: '#2A2D3E', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.doctorColor }}>
        {isCameraOff ? (
          <Text style={{ fontSize: 30 }}>📷</Text>
        ) : (
          <Text style={{ fontSize: 40 }}>{role === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
        )}
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>You</Text>
      </View>

      {/* Timer Section */}
      <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 16, padding: 12, minWidth: 140 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Time Remaining</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: timeColor, fontVariant: ['tabular-nums'] }}>
          {formatTime(timeRemaining)}
        </Text>
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
          of {appointment.session_duration_minutes} min session
        </Text>
        {/* Progress Bar */}
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 8 }}>
          <View style={{ height: 4, width: `${progressPercent}%`, backgroundColor: timeColor, borderRadius: 2 }} />
        </View>
        {timeRemaining <= 300 && (
          <Text style={{ fontSize: 11, color: COLORS.error, marginTop: 6, fontWeight: '700' }}>
            ⚠️ Less than 5 minutes remaining!
          </Text>
        )}
      </View>

      {/* Controls */}
      <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', paddingBottom: Platform.OS === 'ios' ? 40 : 20, paddingTop: 20, paddingHorizontal: 24 }}>
        {/* Elapsed time */}
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 16 }}>
          Elapsed: {formatTime(timeElapsed)}
        </Text>

        {/* Control Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {/* Mute */}
          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isMuted ? COLORS.error : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Text style={{ fontSize: 24 }}>{isMuted ? '🔇' : '🎤'}</Text>
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isCameraOff ? COLORS.error : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setIsCameraOff(!isCameraOff)}
          >
            <Text style={{ fontSize: 24 }}>{isCameraOff ? '📷' : '📹'}</Text>
          </TouchableOpacity>

          {/* Pause/Resume */}
          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isPaused ? COLORS.success : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => isPaused ? resumeTimer() : pauseTimer()}
          >
            <Text style={{ fontSize: 24 }}>{isPaused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity
            style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setShowEndConfirm(true)}
          >
            <Text style={{ fontSize: 28 }}>📵</Text>
          </TouchableOpacity>
        </View>

        {isPaused && (
          <View style={{ backgroundColor: COLORS.warning + '30', borderRadius: 10, padding: 10, marginTop: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: COLORS.warning, fontWeight: '700' }}>
              ⏸️ Call paused — timer stopped. Payment held until resumed and completed.
            </Text>
          </View>
        )}
      </View>

      {/* End Call Confirmation */}
      <Modal visible={showEndConfirm} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>End Call?</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              If you end before session time, payment will remain held until the session is marked complete.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => setShowEndConfirm(false)}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.warning, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowEndConfirm(false); handleCallEnd('paused'); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>Pause Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowEndConfirm(false); handleCallEnd('manual_complete'); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>End & Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============================================
// PHARMACY HOME SCREEN
// ============================================
function PharmacyHomeScreen({ user, profile, pharmacyProfile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    activeDeliveries: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: orders } = await supabase
        .from('orders')
        .select('*, profiles!orders_patient_id_fkey(full_name)')
        .eq('pharmacy_id', pharmacyProfile.id)
        .order('created_at', { ascending: false });

      const all = orders || [];
      const todayOrders = all.filter(o => o.created_at?.startsWith(today));

      setStats({
        todayOrders: todayOrders.length,
        pendingOrders: all.filter(o => o.status === 'pending').length,
        totalEarnings: pharmacyProfile.total_earnings || 0,
        activeDeliveries: all.filter(o => o.status === 'out_for_delivery').length,
      });

      setRecentOrders(all.slice(0, 5));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Pharmacy Dashboard 🏪</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{pharmacyProfile.pharmacy_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>📍 {pharmacyProfile.city}, {pharmacyProfile.country}</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📦', label: "Today's Orders", value: stats.todayOrders, color: '#F0FDF4', textColor: COLORS.pharmacyColor },
            { icon: '⏳', label: 'Pending', value: stats.pendingOrders, color: '#FFF7ED', textColor: COLORS.warning },
            { icon: '🚚', label: 'Active Deliveries', value: stats.activeDeliveries, color: '#EFF6FF', textColor: COLORS.doctorColor },
            { icon: '💰', label: 'Total Earnings', value: `$${(pharmacyProfile.total_earnings || 0).toFixed(0)}`, color: '#F5F3FF', textColor: COLORS.adminColor },
          ].map((stat) => (
            <View key={stat.label} style={{ width: (width - 52) / 2, backgroundColor: stat.color, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📦', label: 'Orders', screen: 'orders' },
            { icon: '💊', label: 'Inventory', screen: 'inventory' },
            { icon: '💰', label: 'Earnings', screen: 'earnings' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Recent Orders</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.pharmacyColor} />
        ) : recentOrders.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📦</Text>
            <Text style={{ fontSize: 15, color: COLORS.textLight }}>No orders yet</Text>
          </View>
        ) : (
          recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: order.status === 'delivered' ? COLORS.success : order.status === 'pending' ? COLORS.warning : COLORS.pharmacyColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('orderDetail', { order })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{order.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{(order.items || []).length} items • ${order.total_amount?.toFixed(2)}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// ============================================
// PHARMACY ORDERS SCREEN
// ============================================
function PharmacyOrdersScreen({ user, pharmacyProfile }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'pending', label: '⏳ Pending' },
    { id: 'confirmed', label: '✅ Confirmed' },
    { id: 'preparing', label: '⚗️ Preparing' },
    { id: 'out_for_delivery', label: '🚚 Out for Delivery' },
    { id: 'delivered', label: '📦 Delivered' },
    { id: 'cancelled', label: '❌ Cancelled' },
  ];

  useEffect(() => { fetchOrders(); }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, profiles!orders_patient_id_fkey(full_name, email)')
        .eq('pharmacy_id', pharmacyProfile.id)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchOrders(); };

  const updateOrderStatus = async (order, newStatus, notifyMsg) => {
    await supabase.from('orders').update({
      status: newStatus,
      pharmacy_confirmed: newStatus !== 'pending',
      pharmacy_confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : order.pharmacy_confirmed_at,
      delivered_at: newStatus === 'delivered' ? new Date().toISOString() : null,
      payment_status: newStatus === 'delivered' ? 'released' : order.payment_status,
    }).eq('id', order.id);

    // Update pharmacy earnings on delivery
    if (newStatus === 'delivered') {
      const commission = (order.total_amount || 0) * (pharmacyProfile.commission_rate / 100 || 0.1);
      const net = (order.total_amount || 0) - commission;

      await supabase.from('pharmacy_profiles').update({
        total_earnings: (pharmacyProfile.total_earnings || 0) + net,
      }).eq('id', pharmacyProfile.id);

      await supabase.from('commissions').insert({
        order_id: order.id,
        from_user_id: order.patient_id,
        amount: commission,
        status: 'collected',
        collected_at: new Date().toISOString(),
      });
    }

    await supabase.from('notifications').insert({
      user_id: order.patient_id,
      title: notifyMsg.title,
      body: notifyMsg.body,
      type: 'order',
      data: { icon: '📦', order_id: order.id },
    });

    fetchOrders();
  };

  const handleConfirm = (order) => {
    Alert.alert('Confirm Order', `Confirm order from ${order.patient_name} for $${order.total_amount?.toFixed(2)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm ✅', onPress: () => updateOrderStatus(order, 'confirmed', {
          title: '✅ Order Confirmed!',
          body: `${pharmacyProfile.pharmacy_name} confirmed your order. They are now preparing it.`,
        })
      }
    ]);
  };

  const handleReject = (order) => {
    Alert.prompt('Reject Order', 'Reason for rejection:', async (reason) => {
      if (!reason) return;
      await supabase.from('orders').update({
        status: 'cancelled',
        pharmacy_cancel_reason: reason,
        payment_status: 'refunded',
      }).eq('id', order.id);

      await supabase.from('notifications').insert({
        user_id: order.patient_id,
        title: '❌ Order Rejected',
        body: `Your order was rejected by ${pharmacyProfile.pharmacy_name}. Reason: ${reason}. Your payment will be refunded.`,
        type: 'order',
        data: { icon: '❌' },
      });

      // Notify admin for refund
      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
      if (admins?.length > 0) {
        await supabase.from('notifications').insert(admins.map(a => ({
          user_id: a.id,
          title: '↩️ Refund Required',
          body: `${pharmacyProfile.pharmacy_name} rejected order for ${order.patient_name}. Refund of $${order.total_amount} needed.`,
          type: 'refund',
          data: { icon: '↩️' },
        })));
      }

      fetchOrders();
    }, 'plain-text');
  };

  const statusFlow = {
    confirmed: { next: 'preparing', label: '⚗️ Start Preparing', notify: { title: '⚗️ Preparing Your Order', body: 'Your medications are being prepared.' } },
    preparing: { next: 'out_for_delivery', label: '🚚 Out for Delivery', notify: { title: '🚚 On the Way!', body: 'Your order is out for delivery!' } },
    out_for_delivery: { next: 'delivered', label: '📦 Mark Delivered', notify: { title: '📦 Order Delivered!', body: 'Your order has been delivered. Please leave a review!' } },
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === tab.id ? COLORS.pharmacyColor : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.pharmacyColor} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>📦</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No {activeTab} orders</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                    {item.patient_age}yr • {item.patient_gender} • {item.language}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {/* Delivery reason */}
              {item.delivery_reason && (
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 2 }}>Reason</Text>
                  <Text style={{ fontSize: 13, color: COLORS.text }}>{item.delivery_reason}</Text>
                </View>
              )}

              {/* Items */}
              <View style={{ marginBottom: 10 }}>
                {(item.items || []).map((med, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: i < item.items.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}>
                    <Text style={{ fontSize: 13, color: COLORS.text }}>{med.name} × {med.quantity}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.pharmacyColor }}>${(med.price * med.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              {/* Total & Payment */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>${item.total_amount?.toFixed(2)}</Text>
                <StatusBadge status={item.payment_status} />
              </View>

              {/* Delivery Address */}
              {item.delivery_address && (
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 10 }}>📍 {item.delivery_address}</Text>
              )}

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      onPress={() => handleConfirm(item)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>✅ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      onPress={() => handleReject(item)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {statusFlow[item.status] && (
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: COLORS.pharmacyColor, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                    onPress={() => updateOrderStatus(item, statusFlow[item.status].next, statusFlow[item.status].notify)}
                  >
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{statusFlow[item.status].label}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// PHARMACY INVENTORY SCREEN
// ============================================
function PharmacyInventoryScreen({ pharmacyProfile, onBack }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', description: '',
    price: '', requires_prescription: false,
    in_stock: true, stock_quantity: '', icon: '💊',
  });

  const categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Digestive', 'Allergy', 'Cardiovascular', 'Diabetes', 'Mental Health', 'Skincare', 'Other'];
  const icons = ['💊', '💉', '🌟', '🔵', '🟡', '🟢', '🔴', '⚪', '🧴', '🩺'];

  useEffect(() => { fetchMedications(); }, []);

  const fetchMedications = async () => {
    const { data } = await supabase.from('medications').select('*').eq('pharmacy_id', pharmacyProfile.id).order('name');
    setMedications(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: '', category: '', description: '', price: '', requires_prescription: false, in_stock: true, stock_quantity: '', icon: '💊' });
    setEditingMed(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { Alert.alert('Error', 'Name and price are required'); return; }
    try {
      if (editingMed) {
        await supabase.from('medications').update({
          name: form.name, category: form.category, description: form.description,
          price: parseFloat(form.price), requires_prescription: form.requires_prescription,
          in_stock: form.in_stock, stock_quantity: parseInt(form.stock_quantity) || 0, icon: form.icon,
        }).eq('id', editingMed.id);
      } else {
        await supabase.from('medications').insert({
          pharmacy_id: pharmacyProfile.id,
          name: form.name, category: form.category, description: form.description,
          price: parseFloat(form.price), requires_prescription: form.requires_prescription,
          in_stock: form.in_stock, stock_quantity: parseInt(form.stock_quantity) || 0, icon: form.icon,
        });
      }
      setShowAddModal(false);
      resetForm();
      fetchMedications();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (med) => {
    Alert.alert('Delete Medication', `Remove ${med.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await supabase.from('medications').delete().eq('id', med.id);
        fetchMedications();
      }}
    ]);
  };

  const openEdit = (med) => {
    setEditingMed(med);
    setForm({
      name: med.name, category: med.category || '', description: med.description || '',
      price: String(med.price), requires_prescription: med.requires_prescription,
      in_stock: med.in_stock, stock_quantity: String(med.stock_quantity || ''), icon: med.icon || '💊',
    });
    setShowAddModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Inventory</Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
            onPress={() => { resetForm(); setShowAddModal(true); }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.pharmacyColor }}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.pharmacyColor} />
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>💊</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No medications yet</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>Tap + Add to add your first medication</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.pharmacyColor }}>${item.price}</Text>
                  <View style={{ backgroundColor: item.in_stock ? '#F0FDF4' : '#FEE2E2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 11, color: item.in_stock ? COLORS.success : COLORS.error, fontWeight: '600' }}>
                      {item.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                    </Text>
                  </View>
                  {item.requires_prescription && (
                    <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, color: '#D97706' }}>Rx</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => openEdit(item)} style={{ padding: 8 }}>
                  <Text style={{ fontSize: 18 }}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 8 }}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: COLORS.white }}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>
              {editingMed ? 'Edit Medication' : 'Add Medication'}
            </Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Icon Picker */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Icon</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {icons.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: form.icon === ic ? COLORS.pharmacyColor : COLORS.lightGray, justifyContent: 'center', alignItems: 'center', borderWidth: form.icon === ic ? 2 : 0, borderColor: COLORS.white }}
                    onPress={() => setForm({ ...form, icon: ic })}
                  >
                    <Text style={{ fontSize: 22 }}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input label="Medication Name *" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Paracetamol 500mg" icon="💊" />
            <Input label="Price (USD) *" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} placeholder="e.g. 5.99" keyboard="numeric" icon="💵" />
            <Input label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} placeholder="Brief description" icon="📝" />
            <Input label="Stock Quantity" value={form.stock_quantity} onChangeText={(v) => setForm({ ...form, stock_quantity: v })} placeholder="e.g. 100" keyboard="numeric" icon="📦" />

            {/* Category */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: form.category === cat ? COLORS.pharmacyColor : COLORS.white, borderWidth: 1, borderColor: form.category === cat ? COLORS.pharmacyColor : COLORS.border }}
                      onPress={() => setForm({ ...form, category: cat })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.category === cat ? COLORS.white : COLORS.text }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Toggles */}
            {[
              { key: 'in_stock', label: 'In Stock', icon: '✅' },
              { key: 'requires_prescription', label: 'Requires Prescription', icon: '📋' },
            ].map((toggle) => (
              <View key={toggle.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>{toggle.icon}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{toggle.label}</Text>
                </View>
                <Switch
                  value={form[toggle.key]}
                  onValueChange={(v) => setForm({ ...form, [toggle.key]: v })}
                  trackColor={{ true: COLORS.pharmacyColor }}
                />
              </View>
            ))}

            <TouchableOpacity
              style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 40 }}
              onPress={handleSave}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>
                💾 {editingMed ? 'Save Changes' : 'Add Medication'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ============================================
// PHARMACY EARNINGS SCREEN
// ============================================
function PharmacyEarningsScreen({ pharmacyProfile, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, pending: 0 });

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles!orders_patient_id_fkey(full_name)')
      .eq('pharmacy_id', pharmacyProfile.id)
      .in('payment_status', ['released', 'held'])
      .order('created_at', { ascending: false });

    const all = data || [];
    const now = new Date();
    const commission = pharmacyProfile.commission_rate / 100 || 0.1;

    const thisMonth = all.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.payment_status === 'released';
    });

    setStats({
      total: pharmacyProfile.total_earnings || 0,
      thisMonth: thisMonth.reduce((s, o) => s + ((o.total_amount || 0) * (1 - commission)), 0),
      pending: all.filter(o => o.payment_status === 'held').reduce((s, o) => s + ((o.total_amount || 0) * (1 - commission)), 0),
    });

    setOrders(all);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Earnings</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Earnings</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>
            ${stats.total.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            After {pharmacyProfile.commission_rate || 10}% platform commission
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'This Month', value: stats.thisMonth, icon: '📅', color: '#F0FDF4' },
            { label: 'Pending', value: stats.pending, icon: '🔒', color: '#FFF7ED' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.color, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>${s.value.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Order History</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.pharmacyColor} />
        ) : orders.map((item) => {
          const commission = pharmacyProfile.commission_rate / 100 || 0.1;
          const net = (item.total_amount || 0) * (1 - commission);
          return (
            <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.payment_status === 'released' ? '#F0FDF4' : '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 22 }}>{item.payment_status === 'released' ? '✅' : '🔒'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.patient_name}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{(item.items || []).length} items • {new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.payment_status === 'released' ? COLORS.success : COLORS.warning }}>
                  ${net.toFixed(2)}
                </Text>
                <Text style={{ fontSize: 10, color: COLORS.textLight }}>of ${item.total_amount?.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// PHARMACY PROFILE VIEW
// ============================================
function PharmacyProfileView({ user, profile, pharmacyProfile, onLogout, onEdit }) {
  const { setShowNotifications } = useApp();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>🏪</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 }}>{pharmacyProfile.pharmacy_name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>📍 {pharmacyProfile.address}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>✅ Verified Pharmacy</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '⭐', label: 'Rating', value: pharmacyProfile.rating?.toFixed(1) || 'New' },
            { icon: '💬', label: 'Reviews', value: pharmacyProfile.total_reviews || 0 },
            { icon: '💰', label: 'Earnings', value: `$${(pharmacyProfile.total_earnings || 0).toFixed(0)}` },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.pharmacyColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 16, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          onPress={onEdit}
        >
          <Text style={{ fontSize: 18 }}>✏️</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '🕐', label: pharmacyProfile.is_open_24h ? 'Open 24 Hours' : 'Limited Hours' },
            { icon: '🚚', label: `Delivery Radius: ${pharmacyProfile.delivery_radius_km}km` },
            { icon: '📞', label: 'Contact Admin' },
            { icon: '❓', label: 'Help & Support' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0 • Pharmacy Portal{'\n'}© 2026 Reine Mande Ltd.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

// ============================================
// PHARMACY SHELL — Main Tab Navigator
// Replaces PharmacyShell placeholder from Part 1
// ============================================
export function PharmacyShell({ profile, pharmacyProfile: initialPharmacyProfile, onLogout }) {
  const { user, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [pharmacyProfile, setPharmacyProfile] = useState(initialPharmacyProfile);

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  const refreshPharmacy = async () => {
    const { data } = await supabase.from('pharmacy_profiles').select('*').eq('user_id', user.id).single();
    if (data) setPharmacyProfile(data);
  };

  // Sub screens
  if (screen === 'editProfile') {
    return (
      <PharmacyProfileEditorScreen
        user={user}
        profile={profile}
        pharmacyProfile={pharmacyProfile}
        onBack={() => switchTab('profile')}
        onSaved={() => { refreshPharmacy(); switchTab('profile'); }}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <PharmacyHomeScreen
            user={user}
            profile={profile}
            pharmacyProfile={pharmacyProfile}
            onNavigate={(s, p = {}) => {
              if (tabs.find(t => t.id === s)) switchTab(s);
              else navigate(s, p);
            }}
          />
        )}
        {activeTab === 'orders' && (
          <PharmacyOrdersScreen user={user} pharmacyProfile={pharmacyProfile} />
        )}
        {activeTab === 'inventory' && (
          <PharmacyInventoryScreen pharmacyProfile={pharmacyProfile} />
        )}
        {activeTab === 'earnings' && (
          <PharmacyEarningsScreen pharmacyProfile={pharmacyProfile} onBack={() => switchTab('home')} />
        )}
        {activeTab === 'profile' && (
          <PharmacyProfileView
            user={user}
            profile={profile}
            pharmacyProfile={pharmacyProfile}
            onLogout={onLogout}
            onEdit={() => navigate('editProfile')}
          />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.pharmacyColor, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.pharmacyColor : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ============================================
// PHARMACY PROFILE EDITOR
// ============================================
function PharmacyProfileEditorScreen({ user, profile, pharmacyProfile, onBack, onSaved }) {
  const [form, setForm] = useState({
    pharmacyName: pharmacyProfile.pharmacy_name || '',
    address: pharmacyProfile.address || '',
    city: pharmacyProfile.city || '',
    country: pharmacyProfile.country || '',
    phone: pharmacyProfile.phone || '',
    deliveryRadius: String(pharmacyProfile.delivery_radius_km || 10),
    isOpen24h: pharmacyProfile.is_open_24h || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('pharmacy_profiles').update({
        pharmacy_name: form.pharmacyName,
        address: form.address,
        city: form.city,
        country: form.country,
        phone: form.phone,
        delivery_radius_km: parseInt(form.deliveryRadius) || 10,
        is_open_24h: form.isOpen24h,
      }).eq('id', pharmacyProfile.id);

      Alert.alert('Saved ✅', 'Pharmacy profile updated.');
      onSaved();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Input label="Pharmacy Name" value={form.pharmacyName} onChangeText={(v) => setForm({ ...form, pharmacyName: v })} placeholder="Pharmacy name" icon="🏪" />
        <Input label="Address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} placeholder="Street address" icon="📍" />
        <Input label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} placeholder="City" icon="🏙️" />
        <Input label="Country" value={form.country} onChangeText={(v) => setForm({ ...form, country: v })} placeholder="Country" icon="🌍" />
        <Input label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="+44 20 1234 5678" keyboard="phone-pad" icon="📞" />
        <Input label="Delivery Radius (km)" value={form.deliveryRadius} onChangeText={(v) => setForm({ ...form, deliveryRadius: v })} placeholder="10" keyboard="numeric" icon="🚚" />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 20 }}>🕐</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Open 24 Hours</Text>
          </View>
          <Switch value={form.isOpen24h} onValueChange={(v) => setForm({ ...form, isOpen24h: v })} trackColor={{ true: COLORS.pharmacyColor }} />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: saving ? COLORS.gray : COLORS.pharmacyColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 40 }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>💾 Save Changes</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
// ============================================
// PART 4 — ADMIN DASHBOARD
// MediConnect v2.0
// Replaces AdminShell placeholder from Part 1
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, Modal, Platform,
  RefreshControl, Switch,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// ADMIN HOME SCREEN
// ============================================
function AdminHomeScreen({ user, profile, onNavigate }) {
  const { setShowNotifications, setAdminViewAs } = useApp();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPharmacies: 0,
    totalPatients: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    activeAppointments: 0,
    activeOrders: 0,
    pendingRefunds: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [
        profiles,
        doctorProfiles,
        pharmacyProfiles,
        appointments,
        orders,
        commissions,
        notifications,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('doctor_profiles').select('*'),
        supabase.from('pharmacy_profiles').select('*'),
        supabase.from('appointments').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('commissions').select('*'),
        supabase.from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const doctors = doctorProfiles.data || [];
      const pharmacies = pharmacyProfiles.data || [];
      const appts = appointments.data || [];
      const ords = orders.data || [];
      const comms = commissions.data || [];

      const totalCommission = comms.reduce((s, c) => s + (c.amount || 0), 0);
      const totalRevenue = appts.reduce((s, a) => s + (a.fee || 0), 0) +
        ords.reduce((s, o) => s + (o.total_amount || 0), 0);

      setStats({
        totalUsers: profiles.count || 0,
        totalDoctors: doctors.length,
        totalPharmacies: pharmacies.length,
        totalPatients: (profiles.count || 0) - doctors.length - pharmacies.length - 1,
        pendingVerifications:
          doctors.filter(d => d.verification_status === 'pending').length +
          pharmacies.filter(p => p.verification_status === 'pending').length,
        totalRevenue,
        totalCommissions: totalCommission,
        activeAppointments: appts.filter(a => ['pending', 'confirmed', 'in-progress'].includes(a.status)).length,
        activeOrders: ords.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length,
        pendingRefunds: appts.filter(a => a.payment_status === 'refunded').length +
          ords.filter(o => o.payment_status === 'refunded').length,
      });

      setRecentActivity(notifications.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchDashboard(); };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={{
        backgroundColor: COLORS.adminColor,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Admin Control Panel 🛡️</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>MediConnect Founder</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>

        {/* Pending Verifications Alert */}
        {stats.pendingVerifications > 0 && (
          <TouchableOpacity
            style={{ backgroundColor: COLORS.warning, borderRadius: 14, padding: 14, marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => onNavigate('verifications')}
          >
            <Text style={{ fontSize: 22 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>
                {stats.pendingVerifications} Pending Verification{stats.pendingVerifications > 1 ? 's' : ''}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Tap to review and approve</Text>
            </View>
            <Text style={{ fontSize: 18, color: COLORS.white }}>›</Text>
          </TouchableOpacity>
        )}

        {stats.pendingRefunds > 0 && (
          <TouchableOpacity
            style={{ backgroundColor: COLORS.error, borderRadius: 14, padding: 14, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => onNavigate('refunds')}
          >
            <Text style={{ fontSize: 22 }}>↩️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>
                {stats.pendingRefunds} Refund{stats.pendingRefunds > 1 ? 's' : ''} to Process
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Tap to process patient refunds</Text>
            </View>
            <Text style={{ fontSize: 18, color: COLORS.white }}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ padding: 20 }}>

        {/* Revenue Card */}
        <View style={{ backgroundColor: COLORS.adminColor, borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Platform Revenue</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
            ${stats.totalRevenue.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
            My Commission: <Text style={{ fontWeight: 'bold', color: COLORS.white }}>${stats.totalCommissions.toFixed(2)}</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('revenue')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.white }}>Revenue →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('commissions')}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.adminColor }}>Commissions →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#F5F3FF', textColor: COLORS.adminColor, screen: 'users' },
            { icon: '👨‍⚕️', label: 'Doctors', value: stats.totalDoctors, color: '#EFF6FF', textColor: COLORS.doctorColor, screen: 'doctors' },
            { icon: '🏪', label: 'Pharmacies', value: stats.totalPharmacies, color: '#F0FDF4', textColor: COLORS.pharmacyColor, screen: 'pharmacies' },
            { icon: '🙋', label: 'Patients', value: stats.totalPatients, color: '#FFF7ED', textColor: COLORS.warning, screen: 'patients' },
            { icon: '📅', label: 'Active Appts', value: stats.activeAppointments, color: '#EFF6FF', textColor: COLORS.doctorColor, screen: 'appointments' },
            { icon: '📦', label: 'Active Orders', value: stats.activeOrders, color: '#F0FDF4', textColor: COLORS.pharmacyColor, screen: 'orders' },
          ].map((stat) => (
            <TouchableOpacity
              key={stat.label}
              style={{ width: (width - 52) / 2, backgroundColor: stat.color, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(stat.screen)}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View As Section */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>
            👁️ View App As
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 14 }}>
            Switch into any role to see their dashboard experience
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[
              { role: 'patient', icon: '🙋', label: 'Patient', color: COLORS.patientColor },
              { role: 'doctor', icon: '👨‍⚕️', label: 'Doctor', color: COLORS.doctorColor },
              { role: 'pharmacy', icon: '🏪', label: 'Pharmacy', color: COLORS.pharmacyColor },
            ].map((r) => (
              <TouchableOpacity
                key={r.role}
                style={{ flex: 1, backgroundColor: r.color + '15', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 2, borderColor: r.color }}
                onPress={() => {
                  Alert.alert(
                    `View as ${r.label}`,
                    `You will see the ${r.label} dashboard. Tap Admin in the app to switch back.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: `View as ${r.label}`, onPress: () => setAdminViewAs(r.role) },
                    ]
                  );
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: r.color }}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Quick Actions</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '✅', label: 'Verifications', screen: 'verifications', color: '#FFF7ED', badge: stats.pendingVerifications },
            { icon: '↩️', label: 'Refunds', screen: 'refunds', color: '#FEE2E2', badge: stats.pendingRefunds },
            { icon: '💰', label: 'Revenue', screen: 'revenue', color: '#F0FDF4' },
            { icon: '📊', label: 'Commissions', screen: 'commissions', color: '#F5F3FF' },
            { icon: '📢', label: 'Send Notification', screen: 'sendNotification', color: '#EFF6FF' },
            { icon: '💬', label: 'Messages', screen: 'messages', color: '#FCE7F3' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ width: (width - 52) / 2, backgroundColor: item.color, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, position: 'relative' }}
              onPress={() => onNavigate(item.screen)}
            >
              {item.badge > 0 && (
                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: COLORS.error, borderRadius: 10, width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>{item.badge}</Text>
                </View>
              )}
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Notifications */}
        {recentActivity.length > 0 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Recent Activity</Text>
            {recentActivity.slice(0, 5).map((notif) => (
              <View key={notif.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: COLORS.border }}>
                <Text style={{ fontSize: 24 }}>{notif.data?.icon || '🔔'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 }}>{notif.title}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 18 }}>{notif.body}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>{new Date(notif.created_at).toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

// ============================================
// ADMIN VERIFICATIONS SCREEN
// ============================================
function AdminVerificationsScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [doctors, setDoctors] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchVerifications(); }, [activeTab]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const [docRes, pharmRes] = await Promise.all([
        supabase.from('doctor_profiles')
          .select('*, profiles(full_name, email, phone, created_at)')
          .eq('verification_status', activeTab)
          .order('created_at', { ascending: false }),
        supabase.from('pharmacy_profiles')
          .select('*, profiles(full_name, email, phone, created_at)')
          .eq('verification_status', activeTab)
          .order('created_at', { ascending: false }),
      ]);
      setDoctors(docRes.data || []);
      setPharmacies(pharmRes.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (type, item, decision) => {
    setProcessing(true);
    try {
      const table = type === 'doctor' ? 'doctor_profiles' : 'pharmacy_profiles';
      const isApproved = decision === 'approved';

      await supabase.from(table).update({
        verification_status: decision,
        is_verified: isApproved,
        verification_notes: adminNotes || null,
        verified_at: isApproved ? new Date().toISOString() : null,
        verified_by: null,
      }).eq('id', item.id);

      // Notify the user
      await supabase.from('notifications').insert({
        user_id: item.user_id,
        title: isApproved
          ? `✅ Verification Approved!`
          : `❌ Verification Rejected`,
        body: isApproved
          ? `Congratulations! Your ${type} account has been verified. You can now start accepting ${type === 'doctor' ? 'appointments' : 'orders'}.`
          : `Your verification was not approved. ${adminNotes ? `Reason: ${adminNotes}` : 'Please contact support for more info.'}`,
        type: 'verification',
        data: { icon: isApproved ? '✅' : '❌' },
      });

      Alert.alert(
        isApproved ? '✅ Approved!' : '❌ Rejected',
        `${type === 'doctor' ? 'Doctor' : 'Pharmacy'} has been ${decision}.`,
        [{ text: 'OK', onPress: () => { setShowDetailModal(false); setAdminNotes(''); fetchVerifications(); } }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const tabs = [
    { id: 'pending', label: '⏳ Pending' },
    { id: 'approved', label: '✅ Approved' },
    { id: 'rejected', label: '❌ Rejected' },
  ];

  const allItems = [
    ...doctors.map(d => ({ ...d, type: 'doctor' })),
    ...pharmacies.map(p => ({ ...p, type: 'pharmacy' })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Verifications</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === tab.id ? COLORS.adminColor : COLORS.white }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.adminColor} />
      ) : (
        <FlatList
          data={allItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>✅</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No {activeTab} verifications</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: item.type === 'doctor' ? COLORS.doctorColor : COLORS.pharmacyColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => { setSelectedItem(item); setShowDetailModal(true); setAdminNotes(''); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text style={{ fontSize: 20 }}>{item.type === 'doctor' ? '👨‍⚕️' : '🏪'}</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>
                      {item.type === 'doctor'
                        ? `Dr. ${item.profiles?.full_name}`
                        : item.pharmacy_name}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>
                    {item.type === 'doctor' ? item.specialty : `${item.city}, ${item.country}`}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📧 {item.profiles?.email}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <StatusBadge status={item.verification_status} />
                  <Badge
                    label={item.type === 'doctor' ? '👨‍⚕️ Doctor' : '🏪 Pharmacy'}
                    color={item.type === 'doctor' ? COLORS.doctorColor : COLORS.pharmacyColor}
                    bgColor={item.type === 'doctor' ? '#EFF6FF' : '#F0FDF4'}
                  />
                </View>
              </View>

              {item.type === 'doctor' && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📋 {item.license_number}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {item.location}</Text>
                </View>
              )}

              {item.verification_notes && (
                <View style={{ backgroundColor: '#FEF2F2', borderRadius: 8, padding: 8, marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: COLORS.error }}>Admin Note: {item.verification_notes}</Text>
                </View>
              )}

              {activeTab === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
                    onPress={() => { setSelectedItem(item); setShowDetailModal(true); }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white }}>Review & Decide</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => setShowDetailModal(false)} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>
              Review {selectedItem?.type === 'doctor' ? 'Doctor' : 'Pharmacy'}
            </Text>
          </View>

          {selectedItem && (
            <ScrollView style={{ flex: 1, padding: 20 }}>
              {/* Profile Info */}
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>
                  {selectedItem.type === 'doctor' ? '👨‍⚕️' : '🏪'} Profile Information
                </Text>
                {selectedItem.type === 'doctor' ? (
                  <>
                    {[
                      { label: 'Full Name', value: `Dr. ${selectedItem.profiles?.full_name}` },
                      { label: 'Email', value: selectedItem.profiles?.email },
                      { label: 'Phone', value: selectedItem.profiles?.phone || 'Not provided' },
                      { label: 'Specialty', value: selectedItem.specialty },
                      { label: 'License No.', value: selectedItem.license_number },
                      { label: 'Experience', value: `${selectedItem.years_experience} years` },
                      { label: 'Hospital', value: selectedItem.hospital_affiliation || 'Independent' },
                      { label: 'Location', value: selectedItem.location },
                      { label: 'In-Person Fee', value: `$${selectedItem.consultation_fee}` },
                      { label: 'Video Fee', value: `$${selectedItem.video_call_fee || 0}` },
                      { label: 'Applied', value: new Date(selectedItem.created_at).toLocaleDateString() },
                    ].map((row) => (
                      <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                        <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{row.label}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{row.value}</Text>
                      </View>
                    ))}
                    {selectedItem.bio && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 4 }}>Bio</Text>
                        <Text style={{ fontSize: 13, color: COLORS.text, lineHeight: 20 }}>{selectedItem.bio}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {[
                      { label: 'Pharmacy Name', value: selectedItem.pharmacy_name },
                      { label: 'Owner Name', value: selectedItem.profiles?.full_name },
                      { label: 'Email', value: selectedItem.profiles?.email },
                      { label: 'Phone', value: selectedItem.phone || 'Not provided' },
                      { label: 'License No.', value: selectedItem.license_number },
                      { label: 'Address', value: selectedItem.address },
                      { label: 'City', value: selectedItem.city },
                      { label: 'Country', value: selectedItem.country },
                      { label: '24 Hours', value: selectedItem.is_open_24h ? 'Yes' : 'No' },
                      { label: 'Delivery Radius', value: `${selectedItem.delivery_radius_km}km` },
                      { label: 'Applied', value: new Date(selectedItem.created_at).toLocaleDateString() },
                    ].map((row) => (
                      <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                        <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{row.label}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{row.value}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>

              {/* Documents Note */}
              <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FED7AA' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 6 }}>📎 Document Verification</Text>
                <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>
                  Check your email (verify@mediconnect.app) for submitted documents from this {selectedItem.type}. Verify the license, certificates and ID before approving.
                </Text>
              </View>

              {/* Admin Notes */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Admin Notes (shown to user if rejected)</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 100, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                  placeholder="Add notes for the applicant (optional for approval, recommended for rejection)..."
                  value={adminNotes}
                  onChangeText={setAdminNotes}
                  multiline
                />
              </View>

              {/* Decision Buttons */}
              {activeTab === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                    onPress={() => {
                      if (!adminNotes) {
                        Alert.alert('Add Notes', 'Please add a reason for rejection before proceeding.');
                        return;
                      }
                      Alert.alert('Reject?', 'This will reject the verification and notify the user.', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Reject', style: 'destructive', onPress: () => handleDecision(selectedItem.type, selectedItem, 'rejected') },
                      ]);
                    }}
                    disabled={processing}
                  >
                    {processing ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>❌ Reject</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 2, backgroundColor: COLORS.success, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                    onPress={() => {
                      Alert.alert('Approve?', 'This will approve the verification and grant them access to the platform.', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Approve ✅', onPress: () => handleDecision(selectedItem.type, selectedItem, 'approved') },
                      ]);
                    }}
                    disabled={processing}
                  >
                    {processing ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>✅ Approve</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

// ============================================
// ADMIN USERS SCREEN (Doctors, Pharmacies, Patients)
// ============================================
function AdminUsersScreen({ onBack, initialFilter }) {
  const [activeTab, setActiveTab] = useState(initialFilter || 'all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchUsers(); }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (activeTab !== 'all') query = query.eq('role', activeTab);
      const { data } = await query;
      setUsers(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchUsers(); };

  const handleToggleActive = async (user) => {
    await supabase.from('profiles').update({ is_active: !user.is_active }).eq('id', user.id);
    fetchUsers();
  };

  const handleContactUser = (user) => {
    Alert.alert(
      `Contact ${user.full_name}`,
      `Email: ${user.email}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Send Notification', onPress: async () => {
          Alert.prompt('Send Notification', 'Enter message:', async (msg) => {
            if (!msg) return;
            await supabase.from('notifications').insert({
              user_id: user.id,
              title: '📢 Message from Admin',
              body: msg,
              type: 'admin',
              data: { icon: '📢' },
            });
            Alert.alert('Sent ✅', 'Notification sent to user.');
          }, 'plain-text');
        }},
      ]
    );
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'patient', label: '🙋 Patients' },
    { id: 'doctor', label: '👨‍⚕️ Doctors' },
    { id: 'pharmacy', label: '🏪 Pharmacy' },
  ];

  const roleColors = {
    patient: COLORS.patientColor,
    doctor: COLORS.doctorColor,
    pharmacy: COLORS.pharmacyColor,
    admin: COLORS.adminColor,
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>All Users</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10, marginBottom: 12 }}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15 }}
            placeholder="Search by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === tab.id ? COLORS.adminColor : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.adminColor} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>👥</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No users found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: (roleColors[item.role] || COLORS.primary) + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 22 }}>
                    {item.role === 'doctor' ? '👨‍⚕️' : item.role === 'pharmacy' ? '🏪' : item.role === 'admin' ? '🛡️' : '🙋'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.full_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.email}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.gray }}>Joined {new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Badge
                    label={item.role}
                    color={roleColors[item.role] || COLORS.primary}
                    bgColor={(roleColors[item.role] || COLORS.primary) + '15'}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.is_active ? COLORS.success : COLORS.error }} />
                    <Text style={{ fontSize: 11, color: item.is_active ? COLORS.success : COLORS.error }}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}
                  onPress={() => handleContactUser(item)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>📢 Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: item.is_active ? '#FEE2E2' : '#F0FDF4', borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}
                  onPress={() => {
                    Alert.alert(
                      item.is_active ? 'Deactivate User?' : 'Activate User?',
                      `This will ${item.is_active ? 'prevent' : 'allow'} ${item.full_name} from accessing the app.`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: item.is_active ? 'Deactivate' : 'Activate', onPress: () => handleToggleActive(item) },
                      ]
                    );
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: item.is_active ? COLORS.error : COLORS.success }}>
                    {item.is_active ? '🚫 Deactivate' : '✅ Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// ADMIN REFUNDS SCREEN
// ============================================
function AdminRefundsScreen({ onBack }) {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => { fetchRefunds(); }, []);

  const fetchRefunds = async () => {
    try {
      const [appts, ords] = await Promise.all([
        supabase.from('appointments')
          .select('*, profiles!appointments_patient_id_fkey(full_name, email), doctor_profiles(profiles(full_name))')
          .eq('payment_status', 'refunded')
          .order('updated_at', { ascending: false }),
        supabase.from('orders')
          .select('*, profiles!orders_patient_id_fkey(full_name, email), pharmacy_profiles(pharmacy_name)')
          .eq('payment_status', 'refunded')
          .order('updated_at', { ascending: false }),
      ]);

      const combined = [
        ...(appts.data || []).map(a => ({ ...a, refundType: 'appointment' })),
        ...(ords.data || []).map(o => ({ ...o, refundType: 'order' })),
      ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setRefunds(combined);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (item) => {
    setProcessing(item.id);
    try {
      const table = item.refundType === 'appointment' ? 'appointments' : 'orders';

      await supabase.from(table).update({
        payment_status: 'refunded',
      }).eq('id', item.id);

      // Update transaction
      await supabase.from('transactions')
        .update({
          payment_status: 'refunded',
          refund_processed_at: new Date().toISOString(),
        })
        .or(`appointment_id.eq.${item.id},order_id.eq.${item.id}`);

      // Notify patient
      const amount = item.refundType === 'appointment' ? item.fee : item.total_amount;
      await supabase.from('notifications').insert({
        user_id: item.patient_id,
        title: '✅ Refund Processed!',
        body: `Your refund of $${amount} has been processed by MediConnect. It will appear in your account within 3-5 business days.`,
        type: 'refund',
        data: { icon: '↩️' },
      });

      Alert.alert('Refund Processed ✅', `$${amount} refund has been processed for ${item.profiles?.full_name}.`);
      fetchRefunds();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Refund Management</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
          {refunds.length} refund{refunds.length !== 1 ? 's' : ''} to process
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.adminColor} />
      ) : refunds.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>✅</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>No Pending Refunds</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginTop: 8 }}>All refunds have been processed</Text>
        </View>
      ) : (
        <FlatList
          data={refunds}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border }}>
              {/* Type Badge */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text style={{ fontSize: 20 }}>{item.refundType === 'appointment' ? '📅' : '📦'}</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>
                      {item.refundType === 'appointment' ? 'Appointment Cancelled' : 'Order Cancelled'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>Patient: {item.profiles?.full_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📧 {item.profiles?.email}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.error }}>
                    ${item.refundType === 'appointment' ? item.fee : item.total_amount?.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>Refund Amount</Text>
                </View>
              </View>

              {/* Cancel Reason */}
              {(item.doctor_cancel_reason || item.pharmacy_cancel_reason) && (
                <View style={{ backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, marginBottom: 12 }}>
                  <Text style={{ fontSize: 12, color: COLORS.error, fontWeight: '600', marginBottom: 2 }}>Cancellation Reason:</Text>
                  <Text style={{ fontSize: 12, color: COLORS.error }}>
                    {item.doctor_cancel_reason || item.pharmacy_cancel_reason}
                  </Text>
                </View>
              )}

              {/* Provider Info */}
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: 12 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                  {item.refundType === 'appointment'
                    ? `Cancelled by: Dr. ${item.doctor_profiles?.profiles?.full_name || 'Doctor'}`
                    : `Cancelled by: ${item.pharmacy_profiles?.pharmacy_name || 'Pharmacy'}`}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                  Date: {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </View>

              <TouchableOpacity
                style={{ backgroundColor: processing === item.id ? COLORS.gray : COLORS.success, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => {
                  Alert.alert(
                    'Process Refund',
                    `Process $${item.refundType === 'appointment' ? item.fee : item.total_amount?.toFixed(2)} refund to ${item.profiles?.full_name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Process ✅', onPress: () => handleProcessRefund(item) },
                    ]
                  );
                }}
                disabled={!!processing}
              >
                {processing === item.id
                  ? <ActivityIndicator color={COLORS.white} />
                  : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>↩️ Process Refund</Text>
                }
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// ADMIN REVENUE SCREEN
// ============================================
function AdminRevenueScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    appointmentRevenue: 0,
    orderRevenue: 0,
    totalCommission: 0,
    thisMonthRevenue: 0,
    thisMonthCommission: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { fetchRevenue(); }, []);

  const fetchRevenue = async () => {
    try {
      const [appts, ords, comms] = await Promise.all([
        supabase.from('appointments').select('*, profiles!appointments_patient_id_fkey(full_name)').in('payment_status', ['held', 'released', 'refunded']).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, profiles!orders_patient_id_fkey(full_name)').in('payment_status', ['held', 'released', 'refunded']).order('created_at', { ascending: false }),
        supabase.from('commissions').select('*').order('created_at', { ascending: false }),
      ]);

      const allAppts = appts.data || [];
      const allOrds = ords.data || [];
      const allComms = comms.data || [];
      const now = new Date();

      const apptRevenue = allAppts.reduce((s, a) => s + (a.fee || 0), 0);
      const ordRevenue = allOrds.reduce((s, o) => s + (o.total_amount || 0), 0);
      const totalComm = allComms.reduce((s, c) => s + (c.amount || 0), 0);

      const thisMonthAppts = allAppts.filter(a => {
        const d = new Date(a.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const thisMonthOrds = allOrds.filter(o => {
        const d = new Date(o.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      setStats({
        totalRevenue: apptRevenue + ordRevenue,
        appointmentRevenue: apptRevenue,
        orderRevenue: ordRevenue,
        totalCommission: totalComm,
        thisMonthRevenue:
          thisMonthAppts.reduce((s, a) => s + (a.fee || 0), 0) +
          thisMonthOrds.reduce((s, o) => s + (o.total_amount || 0), 0),
        thisMonthCommission: allComms
          .filter(c => {
            const d = new Date(c.created_at);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((s, c) => s + (c.amount || 0), 0),
      });

      // Combine for recent transactions
      const combined = [
        ...allAppts.slice(0, 20).map(a => ({ ...a, txType: 'appointment', amount: a.fee })),
        ...allOrds.slice(0, 20).map(o => ({ ...o, txType: 'order', amount: o.total_amount })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30);

      setTransactions(combined);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.adminColor} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Revenue</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Total Revenue */}
        <View style={{ backgroundColor: COLORS.adminColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Platform Revenue</Text>
          <Text style={{ fontSize: 44, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>
            ${stats.totalRevenue.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            My Commission: <Text style={{ fontWeight: 'bold', color: COLORS.white }}>${stats.totalCommission.toFixed(2)}</Text>
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Appointment Revenue', value: stats.appointmentRevenue, icon: '📅', color: '#EFF6FF' },
            { label: 'Order Revenue', value: stats.orderRevenue, icon: '📦', color: '#F0FDF4' },
            { label: 'This Month Revenue', value: stats.thisMonthRevenue, icon: '📈', color: '#FFF7ED' },
            { label: 'This Month Commission', value: stats.thisMonthCommission, icon: '💰', color: '#F5F3FF' },
          ].map((s) => (
            <View key={s.label} style={{ width: (width - 44) / 2, backgroundColor: s.color, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>${s.value.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Transactions */}
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>
          Recent Transactions
        </Text>
        {transactions.map((tx) => (
          <View key={tx.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: tx.txType === 'appointment' ? '#EFF6FF' : '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 22 }}>{tx.txType === 'appointment' ? '📅' : '📦'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{tx.profiles?.full_name || tx.patient_name}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                {tx.txType === 'appointment' ? 'Appointment' : 'Order'} • {new Date(tx.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>${tx.amount?.toFixed(2)}</Text>
              <StatusBadge status={tx.payment_status} />
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// ADMIN COMMISSIONS SCREEN
// ============================================
function AdminCommissionsScreen({ onBack }) {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);

  useEffect(() => { fetchCommissions(); }, []);

  const fetchCommissions = async () => {
    try {
      const { data } = await supabase
        .from('commissions')
        .select('*, appointments(patient_name, appointment_date, doctor_profiles(profiles(full_name))), orders(patient_name, pharmacy_profiles(pharmacy_name))')
        .order('created_at', { ascending: false });

      const all = data || [];
      const now = new Date();

      setTotal(all.reduce((s, c) => s + (c.amount || 0), 0));
      setThisMonth(
        all
          .filter(c => {
            const d = new Date(c.created_at);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((s, c) => s + (c.amount || 0), 0)
      );

      setCommissions(all);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>My Commissions</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: COLORS.adminColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Commission Earned</Text>
          <Text style={{ fontSize: 44, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>
            ${total.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            This Month: <Text style={{ fontWeight: 'bold', color: COLORS.white }}>${thisMonth.toFixed(2)}</Text>
          </Text>
        </View>

        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Commission History</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.adminColor} />
        ) : commissions.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 50, marginBottom: 12 }}>💰</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight }}>No commissions yet</Text>
          </View>
        ) : (
          commissions.map((item) => {
            const isAppt = !!item.appointment_id;
            const name = isAppt
              ? item.appointments?.patient_name
              : item.orders?.patient_name;
            const provider = isAppt
              ? `Dr. ${item.appointments?.doctor_profiles?.profiles?.full_name || 'Doctor'}`
              : item.orders?.pharmacy_profiles?.pharmacy_name || 'Pharmacy';

            return (
              <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 22 }}>{isAppt ? '📅' : '📦'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{provider}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.gray }}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.adminColor }}>
                    +${item.amount?.toFixed(2)}
                  </Text>
                  <StatusBadge status={item.status} />
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// ADMIN SEND NOTIFICATION SCREEN
// ============================================
function AdminSendNotificationScreen({ onBack }) {
  const [targetType, setTargetType] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const targets = [
    { id: 'all', label: '👥 Everyone' },
    { id: 'patient', label: '🙋 All Patients' },
    { id: 'doctor', label: '👨‍⚕️ All Doctors' },
    { id: 'pharmacy', label: '🏪 All Pharmacies' },
  ];

  const handleSend = async () => {
    if (!title || !message) { Alert.alert('Error', 'Please fill in title and message'); return; }
    setSending(true);
    try {
      let query = supabase.from('profiles').select('id');
      if (targetType !== 'all') query = query.eq('role', targetType);

      const { data: users } = await query;
      if (!users?.length) { Alert.alert('No users found'); return; }

      await supabase.from('notifications').insert(
        users.map(u => ({
          user_id: u.id,
          title,
          body: message,
          type: 'admin',
          data: { icon: '📢' },
        }))
      );

      Alert.alert('Sent ✅', `Notification sent to ${users.length} user${users.length !== 1 ? 's' : ''}.`);
      setTitle('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Send Notification</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Broadcast to users</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Target Selector */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Send To</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {targets.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: targetType === t.id ? COLORS.adminColor : COLORS.white, borderWidth: 1, borderColor: targetType === t.id ? COLORS.adminColor : COLORS.border }}
                onPress={() => setTargetType(t.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: targetType === t.id ? COLORS.white : COLORS.text }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input label="Notification Title" value={title} onChangeText={setTitle} placeholder="e.g. App Update Available" icon="📢" />

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Message</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 120, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
            placeholder="Write your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        {/* Preview */}
        {(title || message) && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 10 }}>Preview</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={{ fontSize: 24 }}>📢</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>{title || 'Title'}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{message || 'Message'}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={{ backgroundColor: sending ? COLORS.gray : COLORS.adminColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 40 }}
          onPress={handleSend}
          disabled={sending}
        >
          {sending
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>📢 Send Notification</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ============================================
// ADMIN APPOINTMENTS OVERVIEW
// ============================================
function AdminAppointmentsScreen({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchAppointments(); }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*, profiles!appointments_patient_id_fkey(full_name), doctor_profiles(specialty, profiles(full_name))')
        .order('created_at', { ascending: false })
        .limit(50);

      if (activeTab !== 'all') query = query.eq('status', activeTab);

      const { data } = await query;
      setAppointments(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter(a =>
    a.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.doctor_profiles?.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 }}>All Appointments</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10, marginBottom: 12 }}>
          <Text>🔍</Text>
          <TextInput style={{ flex: 1, fontSize: 15 }} placeholder="Search patient or doctor..." value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: activeTab === tab ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === tab ? COLORS.adminColor : COLORS.white, textTransform: 'capitalize' }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.adminColor} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>📅</Text><Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No appointments found</Text></View>}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                    Dr. {item.doctor_profiles?.profiles?.full_name} • {item.doctor_profiles?.specialty}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                  📅 {item.appointment_date} • {item.appointment_type === 'video' ? '📹' : '🏥'} {item.appointment_type}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.text }}>${item.fee}</Text>
                  <StatusBadge status={item.payment_status} />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// ADMIN ORDERS OVERVIEW
// ============================================
function AdminOrdersScreen({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchOrders(); }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*, profiles!orders_patient_id_fkey(full_name), pharmacy_profiles(pharmacy_name)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (activeTab !== 'all') query = query.eq('status', activeTab);

      const { data } = await query;
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>All Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['all', 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: activeTab === tab ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === tab ? COLORS.adminColor : COLORS.white, textTransform: 'capitalize' }}>
                  {tab.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.adminColor} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40 }}>📦</Text><Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No orders found</Text></View>}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.pharmacy_profiles?.pharmacy_name}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                  🛒 {(item.items || []).length} items • {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.text }}>${item.total_amount?.toFixed(2)}</Text>
                  <StatusBadge status={item.payment_status} />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// ADMIN SHELL — Main Tab Navigator
// Replaces AdminShell placeholder from Part 1
// ============================================
export function AdminShell({ profile, onLogout }) {
  const { user, setAdminViewAs, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  // Sub screens
  const subScreens = {
    verifications: <AdminVerificationsScreen onBack={() => switchTab('home')} />,
    refunds: <AdminRefundsScreen onBack={() => switchTab('home')} />,
    revenue: <AdminRevenueScreen onBack={() => switchTab('home')} />,
    commissions: <AdminCommissionsScreen onBack={() => switchTab('home')} />,
    sendNotification: <AdminSendNotificationScreen onBack={() => switchTab('home')} />,
    appointments: <AdminAppointmentsScreen onBack={() => switchTab('home')} />,
    orders: <AdminOrdersScreen onBack={() => switchTab('home')} />,
    users: <AdminUsersScreen onBack={() => switchTab('home')} />,
    doctors: <AdminUsersScreen onBack={() => switchTab('home')} initialFilter="doctor" />,
    pharmacies: <AdminUsersScreen onBack={() => switchTab('home')} initialFilter="pharmacy" />,
    patients: <AdminUsersScreen onBack={() => switchTab('home')} initialFilter="patient" />,
  };

  if (subScreens[screen]) return subScreens[screen];

  const tabs = [
    { id: 'home', icon: '🛡️', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'verifications', icon: '✅', label: 'Verify' },
    { id: 'revenue', icon: '💰', label: 'Revenue' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <AdminHomeScreen
            user={user}
            profile={profile}
            onNavigate={(s, p = {}) => navigate(s, p)}
          />
        )}
        {activeTab === 'users' && (
          <AdminUsersScreen onBack={() => switchTab('home')} />
        )}
        {activeTab === 'verifications' && (
          <AdminVerificationsScreen onBack={() => switchTab('home')} />
        )}
        {activeTab === 'revenue' && (
          <AdminRevenueScreen onBack={() => switchTab('home')} />
        )}
        {activeTab === 'settings' && (
          <AdminSettingsScreen
            user={user}
            profile={profile}
            onLogout={onLogout}
            onNavigate={navigate}
          />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.adminColor, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.adminColor : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ============================================
// ADMIN SETTINGS SCREEN
// ============================================
function AdminSettingsScreen({ user, profile, onLogout, onNavigate }) {
  const { setAdminViewAs, setShowNotifications } = useApp();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.adminColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>🛡️</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 }}>{profile.full_name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{user.email}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>🛡️ Platform Admin</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* View As Admin */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>👁️ View App As</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { role: 'patient', icon: '🙋', label: 'Patient', color: COLORS.patientColor },
              { role: 'doctor', icon: '👨‍⚕️', label: 'Doctor', color: COLORS.doctorColor },
              { role: 'pharmacy', icon: '🏪', label: 'Pharmacy', color: COLORS.pharmacyColor },
            ].map((r) => (
              <TouchableOpacity
                key={r.role}
                style={{ flex: 1, backgroundColor: r.color + '15', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: r.color }}
                onPress={() => setAdminViewAs(r.role)}
              >
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: r.color }}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '📊', label: 'Commissions', onPress: () => onNavigate('commissions') },
            { icon: '📢', label: 'Send Notification', onPress: () => onNavigate('sendNotification') },
            { icon: '↩️', label: 'Process Refunds', onPress: () => onNavigate('refunds') },
            { icon: '✅', label: 'Verifications', onPress: () => onNavigate('verifications') },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0 • Admin Portal{'\n'}© 2026 Reine Mande Ltd. All rights reserved.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}
// ============================================
// PART 5 — FINAL WIRING & COMPLETE FEATURES
// MediConnect v2.0
// Reviews + Rankings + Location + Invoicing
// Push Notifications + Complete App Integration
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, Modal, Platform,
  RefreshControl, Linking,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// STEP 1 — UPDATE YOUR App.js IMPORTS
// Add these exports at the top of App.js (Part 1)
// These connect all shells from all parts
// ============================================

/*
In your App.js (Part 1), replace the placeholder shell functions:

import { PatientShell } from './Part2';
import { DoctorShell, PharmacyShell, VideoCallScreen } from './Part3';
import { AdminShell } from './Part4';

OR if you paste everything into one file (recommended),
make sure all Shell components are defined before RoleRouter.
*/

// ============================================
// STEP 2 — FINAL RoleRouter UPDATE
// Replace the RoleRouter in Part 1 with this
// ============================================
export function RoleRouter({ profile, doctorProfile, pharmacyProfile, onLogout, onCompleteVerification }) {
  const { adminViewAs, setAdminViewAs, user } = useApp();
  const [screen, setScreen] = useState(null);
  const [screenParams, setScreenParams] = useState({});

  // Admin "view as" banner when switching roles
  const effectiveRole = adminViewAs || profile.role;

  // Video call can be triggered from anywhere
  if (screen === 'videoCall' && screenParams.appointment) {
    return (
      <VideoCallScreen
        appointment={screenParams.appointment}
        user={user}
        role={profile.role}
        onEnd={() => { setScreen(null); setScreenParams({}); }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Admin "Viewing As" Banner */}
      {adminViewAs && (
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.adminColor,
            paddingTop: Platform.OS === 'ios' ? 44 : 24,
            paddingBottom: 10,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 999,
          }}
          onPress={() => {
            Alert.alert('Switch Back', 'Return to Admin Dashboard?', [
              { text: 'Stay', style: 'cancel' },
              { text: 'Back to Admin', onPress: () => setAdminViewAs(null) },
            ]);
          }}
        >
          <Text style={{ fontSize: 13, color: COLORS.white, fontWeight: '600' }}>
            🛡️ Admin viewing as: {adminViewAs.toUpperCase()} — Tap to return
          </Text>
          <Text style={{ fontSize: 18, color: COLORS.white }}>✕</Text>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        {effectiveRole === 'admin' && (
          <AdminShell profile={profile} onLogout={onLogout} />
        )}

        {effectiveRole === 'doctor' && (
          !doctorProfile || doctorProfile.verification_status !== 'approved'
            ? doctorProfile
              ? <PendingVerificationScreen
                  profile={{ ...profile, ...doctorProfile, documents_submitted: !!doctorProfile.license_document_url }}
                  onLogout={onLogout}
                  onCompleteVerification={onCompleteVerification}
                />
              : <DoctorVerificationScreen profile={profile} onLogout={onLogout} />
            : <DoctorShell profile={profile} doctorProfile={doctorProfile} onLogout={onLogout} />
        )}

        {effectiveRole === 'pharmacy' && (
          !pharmacyProfile || pharmacyProfile.verification_status !== 'approved'
            ? pharmacyProfile
              ? <PendingVerificationScreen
                  profile={{ ...profile, ...pharmacyProfile, documents_submitted: !!pharmacyProfile.license_document_url }}
                  onLogout={onLogout}
                  onCompleteVerification={onCompleteVerification}
                />
              : <PharmacyVerificationScreen profile={profile} onLogout={onLogout} />
            : <PharmacyShell profile={profile} pharmacyProfile={pharmacyProfile} onLogout={onLogout} />
        )}

        {effectiveRole === 'patient' && (
          <PatientShell profile={profile} onLogout={onLogout} />
        )}
      </View>
    </View>
  );
}

// ============================================
// LOCATION DISCOVERY SCREEN
// Nearby doctors and pharmacies
// ============================================
export function NearbyScreen({ user, profile, onSelectDoctor, onSelectPharmacy }) {
  const [loading, setLoading] = useState(true);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [userCity, setUserCity] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, nearby, video

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLoading(true);
    try {
      // Get user's city from profile or use IP geolocation
      const city = profile?.city || '';
      setUserCity(city);
      await fetchNearby(city);
    } catch (error) {
      console.log(error);
      await fetchNearby('');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearby = async (city) => {
    try {
      // Fetch doctors - filter by city if available
      let doctorQuery = supabase
        .from('doctor_profiles')
        .select('*, profiles(full_name, email)')
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .order('rating', { ascending: false });

      if (city) {
        doctorQuery = doctorQuery.ilike('location', `%${city}%`);
      }

      const { data: doctors } = await doctorQuery.limit(20);

      // Fetch pharmacies
      let pharmQuery = supabase
        .from('pharmacy_profiles')
        .select('*, profiles(full_name)')
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .order('rating', { ascending: false });

      if (city) {
        pharmQuery = pharmQuery.ilike('city', `%${city}%`);
      }

      const { data: pharmacies } = await pharmQuery.limit(20);

      setNearbyDoctors(doctors || []);
      setNearbyPharmacies(pharmacies || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredDoctors = nearbyDoctors.filter(d => {
    if (filterType === 'video') return (d.video_call_fee || 0) > 0;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 16,
        paddingHorizontal: 20,
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
          Nearby
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>
          📍 {userCity || 'Worldwide'} — Doctors & Pharmacies near you
        </Text>
        {/* Tab */}
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4 }}>
          {['doctors', 'pharmacies'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.white : 'transparent' }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.white, textTransform: 'capitalize' }}>
                {tab === 'doctors' ? '👨‍⚕️ Doctors' : '🏪 Pharmacies'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter Pills — Doctors Only */}
      {activeTab === 'doctors' && (
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          {[
            { id: 'all', label: '🌍 All' },
            { id: 'video', label: '📹 Video Available' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filterType === f.id ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: filterType === f.id ? COLORS.primary : COLORS.border }}
              onPress={() => setFilterType(f.id)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: filterType === f.id ? COLORS.white : COLORS.text }}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : activeTab === 'doctors' ? (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>🔍</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No doctors found nearby</Text>
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}
                onPress={() => { setUserCity(''); fetchNearby(''); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.white }}>Show All Worldwide</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onSelectDoctor(item)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 30 }}>👨‍⚕️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.profiles?.full_name}</Text>
                    <Text>✅</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 2 }}>{item.specialty}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {item.location}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'} ({item.total_reviews || 0})</Text>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      {(item.video_call_fee || 0) > 0 && (
                        <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 11, color: COLORS.doctorColor, fontWeight: '600' }}>📹 Video</Text>
                        </View>
                      )}
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${item.consultation_fee}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={nearbyPharmacies}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 12 }}>🏪</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No pharmacies found nearby</Text>
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}
                onPress={() => { setUserCity(''); fetchNearby(''); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.white }}>Show All Worldwide</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onSelectPharmacy && onSelectPharmacy(item)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 28 }}>🏪</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.pharmacy_name}</Text>
                    <Text>✅</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {item.address}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>🏙️ {item.city}, {item.country}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{ backgroundColor: item.is_open_24h ? '#F0FDF4' : '#FEF2F2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, color: item.is_open_24h ? COLORS.success : COLORS.error, fontWeight: '600' }}>
                          {item.is_open_24h ? '🟢 24h' : '🔴 Limited'}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, color: COLORS.doctorColor, fontWeight: '600' }}>🚚 {item.delivery_radius_km}km</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ============================================
// RANKING SYSTEM UTILITIES
// Used throughout the app to sort providers
// ============================================
export const RankingUtils = {
  // Score a doctor for ranking (higher = better placement)
  scoreDoctorForRanking: (doctor) => {
    let score = 0;
    // Rating weight (0-5 stars = 0-50 points)
    score += (doctor.rating || 0) * 10;
    // Review count weight (more reviews = more trust)
    score += Math.min((doctor.total_reviews || 0) * 0.5, 20);
    // Verified bonus
    if (doctor.is_verified) score += 15;
    // Available bonus
    if (doctor.is_available) score += 10;
    // Experience bonus (capped at 10)
    score += Math.min((doctor.years_experience || 0) * 0.5, 10);
    // Penalty for bad reviews (avg < 3)
    if (doctor.rating > 0 && doctor.rating < 3) score -= 20;
    // Penalty for very bad reviews (avg < 2)
    if (doctor.rating > 0 && doctor.rating < 2) score -= 30;
    return score;
  },

  // Score a pharmacy
  scorePharmacyForRanking: (pharmacy) => {
    let score = 0;
    score += (pharmacy.rating || 0) * 10;
    score += Math.min((pharmacy.total_reviews || 0) * 0.5, 20);
    if (pharmacy.is_verified) score += 15;
    if (pharmacy.is_open_24h) score += 10;
    if (pharmacy.rating > 0 && pharmacy.rating < 3) score -= 20;
    return score;
  },

  // Get ranking label for a doctor/pharmacy
  getRankingLabel: (rating, totalReviews) => {
    if (totalReviews === 0) return null;
    if (rating >= 4.8 && totalReviews >= 20) return { label: '🏆 Top Rated', color: '#F59E0B', bg: '#FEF3C7' };
    if (rating >= 4.5 && totalReviews >= 10) return { label: '⭐ Highly Rated', color: '#2563EB', bg: '#EFF6FF' };
    if (rating >= 4.0) return { label: '👍 Recommended', color: '#059669', bg: '#F0FDF4' };
    if (rating < 2.5 && totalReviews >= 5) return { label: '⚠️ Poor Reviews', color: COLORS.error, bg: '#FEE2E2' };
    return null;
  },

  // Check if provider should be flagged/removed
  shouldFlag: (rating, totalReviews) => {
    return rating < 2.0 && totalReviews >= 5;
  },
};

// ============================================
// RANKING BADGE COMPONENT
// ============================================
export function RankingBadge({ rating, totalReviews }) {
  const rank = RankingUtils.getRankingLabel(rating, totalReviews);
  if (!rank) return null;
  return (
    <View style={{ backgroundColor: rank.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: rank.color }}>{rank.label}</Text>
    </View>
  );
}

// ============================================
// INVOICE GENERATOR & EMAIL SENDER
// ============================================
export const InvoiceUtils = {
  // Generate invoice HTML for appointments
  generateAppointmentInvoice: (appointment, doctor, patient) => {
    const commission = (appointment.fee || 0) * 0.1;
    const doctorNet = (appointment.fee || 0) - commission;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
MediConnect Invoice
=====================
Invoice #: MC-APT-${appointment.id?.slice(0, 8).toUpperCase()}
Date: ${date}

PATIENT
Name: ${appointment.patient_name}
Age: ${appointment.patient_age}
Gender: ${appointment.patient_gender}

DOCTOR
Name: Dr. ${doctor?.full_name || 'Doctor'}
Specialty: ${doctor?.specialty || ''}
License: ${doctor?.license_number || ''}

APPOINTMENT DETAILS
Date: ${appointment.appointment_date}
Time: ${appointment.appointment_time}
Type: ${appointment.appointment_type === 'video' ? 'Video Consultation' : 'In-Person'}
Duration: ${appointment.session_duration_minutes} minutes
Reason: ${appointment.reason}

PAYMENT SUMMARY
Consultation Fee:    $${appointment.fee?.toFixed(2)}
Platform Fee:        Free
Total Charged:       $${appointment.fee?.toFixed(2)}
Payment Status:      ${appointment.payment_status?.toUpperCase()}

Doctor Receives:     $${doctorNet.toFixed(2)}
Platform Commission: $${commission.toFixed(2)}

Thank you for using MediConnect!
© 2026 Reine Mande Ltd.
support@mediconnect.app
    `.trim();
  },

  // Generate invoice for orders
  generateOrderInvoice: (order, pharmacy) => {
    const commission = (order.total_amount || 0) * 0.1;
    const pharmacyNet = (order.total_amount || 0) - commission;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const itemsText = (order.items || [])
      .map(item => `  ${item.name} x${item.quantity}    $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    return `
MediConnect Invoice
=====================
Invoice #: MC-ORD-${order.id?.slice(0, 8).toUpperCase()}
Date: ${date}

PATIENT
Name: ${order.patient_name}
Delivery Address: ${order.delivery_address}

PHARMACY
Name: ${pharmacy?.pharmacy_name || 'Pharmacy'}
Address: ${pharmacy?.address || ''}

ORDER ITEMS
${itemsText}

PAYMENT SUMMARY
Subtotal:            $${order.total_amount?.toFixed(2)}
Delivery Fee:        Free
Total Charged:       $${order.total_amount?.toFixed(2)}
Payment Status:      ${order.payment_status?.toUpperCase()}

Pharmacy Receives:   $${pharmacyNet.toFixed(2)}
Platform Commission: $${commission.toFixed(2)}

Thank you for using MediConnect!
© 2026 Reine Mande Ltd.
support@mediconnect.app
    `.trim();
  },

  // Send invoice via email (opens mail client)
  sendInvoiceEmail: async (toEmail, invoiceText, subject) => {
    try {
      const encodedBody = encodeURIComponent(invoiceText);
      const encodedSubject = encodeURIComponent(subject);
      const mailtoUrl = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Invoice', 'Could not open email client. Invoice details:\n\n' + invoiceText);
      }
    } catch (error) {
      console.log('Email error:', error);
    }
  },

  // Store invoice in database and notify user
  sendInvoiceNotification: async (userId, invoiceRef, amount, type) => {
    await supabase.from('notifications').insert({
      user_id: userId,
      title: `🧾 Invoice Ready — ${invoiceRef}`,
      body: `Your invoice for $${amount} has been generated. Reference: ${invoiceRef}`,
      type: 'invoice',
      data: {
        icon: '🧾',
        invoice_ref: invoiceRef,
        amount,
        type,
      },
    });
  },
};

// ============================================
// INVOICE MODAL — View and send invoice
// ============================================
export function InvoiceModal({ visible, invoiceText, invoiceRef, patientEmail, doctorEmail, onClose }) {
  const [sending, setSending] = useState(false);

  const handleSendToPatient = async () => {
    setSending(true);
    await InvoiceUtils.sendInvoiceEmail(
      patientEmail,
      invoiceText,
      `MediConnect Invoice — ${invoiceRef}`
    );
    setSending(false);
  };

  const handleSendToDoctor = async () => {
    if (!doctorEmail) return;
    setSending(true);
    await InvoiceUtils.sendInvoiceEmail(
      doctorEmail,
      invoiceText,
      `MediConnect Invoice — ${invoiceRef}`
    );
    setSending(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: height * 0.85 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>🧾 Invoice</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 22 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {/* Invoice Preview */}
            <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.text, lineHeight: 20 }}>
                {invoiceText}
              </Text>
            </View>

            {/* Send Buttons */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 12 }}>Send Invoice</Text>

            <TouchableOpacity
              style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              onPress={handleSendToPatient}
              disabled={sending}
            >
              <Text style={{ fontSize: 20 }}>📧</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Send to Patient</Text>
            </TouchableOpacity>

            {doctorEmail && (
              <TouchableOpacity
                style={{ backgroundColor: COLORS.doctorColor, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                onPress={handleSendToDoctor}
                disabled={sending}
              >
                <Text style={{ fontSize: 20 }}>📧</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Send to Doctor</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{ backgroundColor: COLORS.lightGray, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 30 }}
              onPress={onClose}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text }}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// ENHANCED POST-SESSION REVIEW FLOW
// Auto-triggered after completed session
// ============================================
export function PostSessionReviewFlow({ appointment, order, userId, onDone }) {
  const [step, setStep] = useState('prompt'); // prompt, review, invoice, done
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);

  const isAppointment = !!appointment;
  const targetName = isAppointment
    ? `Dr. ${appointment?.doctor_profiles?.profiles?.full_name || 'Doctor'}`
    : appointment?.pharmacy_profiles?.pharmacy_name || 'Pharmacy';

  const handleSkip = async () => {
    if (isAppointment) {
      await supabase.from('appointments').update({ review_prompted: true }).eq('id', appointment.id);
    } else if (order) {
      await supabase.from('orders').update({ review_prompted: true }).eq('id', order.id);
    }
    onDone();
  };

  const handleSubmitReview = async () => {
    if (rating === 0) { Alert.alert('Please select a rating'); return; }
    setLoading(true);
    try {
      const targetType = isAppointment ? 'doctor' : 'pharmacy';
      const targetId = isAppointment ? appointment.doctor_id : order?.pharmacy_id;

      await supabase.from('reviews').insert({
        reviewer_id: userId,
        target_type: targetType,
        target_id: targetId,
        appointment_id: isAppointment ? appointment.id : null,
        order_id: order?.id || null,
        rating,
        comment,
        is_anonymous: isAnonymous,
      });

      // Mark as prompted
      if (isAppointment) {
        await supabase.from('appointments').update({ review_prompted: true }).eq('id', appointment.id);
      } else if (order) {
        await supabase.from('orders').update({ review_prompted: true }).eq('id', order.id);
      }

      // Check if provider should be flagged (auto-flag at < 2.0 avg with 5+ reviews)
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('target_type', targetType)
        .eq('target_id', targetId);

      if (allReviews && allReviews.length >= 5) {
        const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
        if (avg < 2.0) {
          // Notify admin about flagged provider
          const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
          if (admins?.length > 0) {
            await supabase.from('notifications').insert(admins.map(a => ({
              user_id: a.id,
              title: `⚠️ Provider Flagged — Low Reviews`,
              body: `${targetName} has an average rating of ${avg.toFixed(1)} with ${allReviews.length} reviews. Consider review or removal.`,
              type: 'flag',
              data: { icon: '⚠️', target_type: targetType, target_id: targetId },
            })));
          }
        }
      }

      setStep('invoice');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (isAppointment) {
      const { data: doctor } = await supabase
        .from('doctor_profiles')
        .select('*, profiles(full_name, email)')
        .eq('id', appointment.doctor_id)
        .single();

      const invoiceText = InvoiceUtils.generateAppointmentInvoice(appointment, doctor?.profiles, null);
      const invoiceRef = `MC-APT-${appointment.id?.slice(0, 8).toUpperCase()}`;

      // Send notifications
      await InvoiceUtils.sendInvoiceNotification(userId, invoiceRef, appointment.fee, 'appointment');
      if (doctor?.user_id) {
        await InvoiceUtils.sendInvoiceNotification(doctor.user_id, invoiceRef, appointment.fee, 'appointment');
      }

      Alert.alert(
        '🧾 Invoice Ready',
        `Invoice ${invoiceRef} has been generated. Check your notifications.`,
        [{ text: 'OK', onPress: () => onDone() }]
      );
    } else {
      onDone();
    }
  };

  return (
    <Modal visible transparent animationType="none">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
        <Animated.View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: height * 0.85,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* STEP: Prompt */}
          {step === 'prompt' && (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <Text style={{ fontSize: 60, marginBottom: 16 }}>🎉</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 8 }}>
                Session Complete!
              </Text>
              <Text style={{ fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
                How was your {isAppointment ? 'appointment' : 'delivery'} with {targetName}?
              </Text>
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }}
                onPress={() => setStep('review')}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>⭐ Leave a Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: COLORS.lightGray, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                onPress={handleSkip}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Skip for Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP: Review */}
          {step === 'review' && (
            <ScrollView style={{ padding: 24 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 6 }}>
                Rate {targetName}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 }}>
                Your honest review helps others find great care
              </Text>

              {/* Stars */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Animated.Text style={{ fontSize: 44 }}>
                      {star <= rating ? '⭐' : '☆'}
                    </Animated.Text>
                  </TouchableOpacity>
                ))}
              </View>

              {rating > 0 && (
                <Text style={{ textAlign: 'center', fontSize: 16, color: COLORS.primary, fontWeight: '700', marginBottom: 20 }}>
                  {['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Very Good', '🌟 Excellent!'][rating]}
                </Text>
              )}

              {/* Comment */}
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, fontSize: 14, height: 100, textAlignVertical: 'top', backgroundColor: COLORS.lightGray, marginBottom: 14 }}
                placeholder={`Share your experience with ${targetName}...`}
                value={comment}
                onChangeText={setComment}
                multiline
              />

              {/* Anonymous toggle */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Post Anonymously</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>Your name won't be shown</Text>
                </View>
                <TouchableOpacity
                  style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: isAnonymous ? COLORS.primary : COLORS.gray, justifyContent: 'center', paddingHorizontal: 2 }}
                  onPress={() => setIsAnonymous(!isAnonymous)}
                >
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, alignSelf: isAnonymous ? 'flex-end' : 'flex-start' }} />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 30 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                  onPress={handleSkip}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray }}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 2, backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                  onPress={handleSubmitReview}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color={COLORS.white} />
                    : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Submit Review</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* STEP: Invoice */}
          {step === 'invoice' && (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <Text style={{ fontSize: 60, marginBottom: 16 }}>🧾</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 8 }}>
                Review Submitted!
              </Text>
              <Text style={{ fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
                Thank you for your review. Would you like to generate an invoice for this {isAppointment ? 'appointment' : 'order'}?
              </Text>
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                onPress={handleGenerateInvoice}
              >
                <Text style={{ fontSize: 20 }}>🧾</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Generate Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: '100%', backgroundColor: COLORS.lightGray, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
                onPress={onDone}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>No Thanks</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ============================================
// REAL-TIME NOTIFICATION LISTENER
// Add this to your main app shell
// ============================================
export function useRealtimeNotifications(userId, onNewNotification) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notif = payload.new;
          if (onNewNotification) {
            onNewNotification(notif);
          }
          // Show in-app toast
          Alert.alert(
            notif.title,
            notif.body,
            [{ text: 'OK' }]
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);
}

// ============================================
// IN-APP TOAST NOTIFICATION
// ============================================
export function ToastNotification({ message, visible, onHide }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide && onHide());
    }
  }, [visible]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 16,
        right: 16,
        backgroundColor: COLORS.secondary,
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        transform: [{ translateY: slideAnim }],
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <Text style={{ fontSize: 22 }}>{message?.icon || '🔔'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{message?.title}</Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }} numberOfLines={2}>{message?.body}</Text>
      </View>
      <TouchableOpacity onPress={onHide}>
        <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================
// ENHANCED PATIENT SHELL WITH NEARBY TAB
// Replace PatientShell in Part 2 with this
// ============================================
export function PatientShellV2({ profile, onLogout }) {
  const { user, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [toast, setToast] = useState(null);
  const [showPostSession, setShowPostSession] = useState(null);

  // Real-time notifications
  useRealtimeNotifications(user?.id, (notif) => {
    setToast({ title: notif.title, body: notif.body, icon: notif.data?.icon });

    // Auto-trigger post session flow if appointment completed
    if (notif.type === 'appointment' && notif.body?.includes('completed')) {
      // Fetch the completed appointment
      supabase
        .from('appointments')
        .select('*, doctor_profiles(*, profiles(full_name, email))')
        .eq('patient_id', user.id)
        .eq('status', 'completed')
        .eq('review_prompted', false)
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) setShowPostSession({ type: 'appointment', data });
        });
    }
  });

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  // Sub-screens
  if (screen === 'doctorProfile' && screenParams.doctor) {
    return (
      <View style={{ flex: 1 }}>
        <DoctorProfileScreen
          doctor={screenParams.doctor}
          user={user}
          profile={profile}
          onBack={() => { setScreen(activeTab); setScreenParams({}); }}
          onBook={() => navigate('bookAppointment', { doctor: screenParams.doctor })}
        />
        {toast && <ToastNotification message={toast} visible onHide={() => setToast(null)} />}
      </View>
    );
  }

  if (screen === 'bookAppointment' && screenParams.doctor) {
    return (
      <View style={{ flex: 1 }}>
        <BookingFormScreen
          doctor={screenParams.doctor}
          user={user}
          profile={profile}
          onBack={() => navigate('doctorProfile', { doctor: screenParams.doctor })}
          onSuccess={() => switchTab('activity')}
        />
        {toast && <ToastNotification message={toast} visible onHide={() => setToast(null)} />}
      </View>
    );
  }

  if (screen === 'videoCall' && screenParams.appointment) {
    return (
      <VideoCallScreen
        appointment={screenParams.appointment}
        user={user}
        role="patient"
        onEnd={() => { setScreen(activeTab); setScreenParams({}); }}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'nearby', icon: '📍', label: 'Nearby' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'activity', icon: '📋', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <PatientHomeScreen
            user={user}
            profile={profile}
            onNavigate={(s, p = {}) => {
              if (s === 'nearby') { switchTab('nearby'); }
              else if (['pharmacy', 'activity', 'profile'].includes(s)) {
                if (p.specialty) { setActiveTab('home'); navigate('search', p); }
                else switchTab(s);
              } else if (s === 'search') {
                switchTab('nearby');
              } else {
                navigate(s, p);
              }
            }}
          />
        )}

        {activeTab === 'nearby' && (
          <NearbyScreen
            user={user}
            profile={profile}
            onSelectDoctor={(doctor) => navigate('doctorProfile', { doctor })}
            onSelectPharmacy={(pharmacy) => {
              switchTab('pharmacy');
            }}
          />
        )}

        {activeTab === 'pharmacy' && (
          <PatientPharmacyScreen user={user} profile={profile} />
        )}

        {activeTab === 'activity' && (
          <PatientActivityScreen
            user={user}
            onStartVideoCall={(appointment) => navigate('videoCall', { appointment })}
          />
        )}

        {activeTab === 'profile' && (
          <PatientProfileScreen user={user} profile={profile} onLogout={onLogout} />
        )}
      </View>

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast}
          visible={!!toast}
          onHide={() => setToast(null)}
        />
      )}

      {/* Post Session Review Flow */}
      {showPostSession && (
        <PostSessionReviewFlow
          appointment={showPostSession.type === 'appointment' ? showPostSession.data : null}
          order={showPostSession.type === 'order' ? showPostSession.data : null}
          userId={user.id}
          onDone={() => setShowPostSession(null)}
        />
      )}

      {/* Bottom Tab Bar */}
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.primary : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ============================================
// FINAL App.js WIRING
// This is the complete updated App.js
// Replace your entire App.js with this
// ============================================
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [pharmacyProfile, setPharmacyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminViewAs, setAdminViewAs] = useState(null);
  const [toast, setToast] = useState(null);

  // Real-time notifications for any logged-in user
  useRealtimeNotifications(user?.id, (notif) => {
    setToast({ title: notif.title, body: notif.body, icon: notif.data?.icon });
  });

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
        setScreen('splash');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setDoctorProfile(null);
        setPharmacyProfile(null);
        setAdminViewAs(null);
        setScreen('onboarding');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(prof);

      if (prof?.role === 'doctor') {
        const { data: dp } = await supabase
          .from('doctor_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        setDoctorProfile(dp || null);
      }

      if (prof?.role === 'pharmacy') {
        const { data: pp } = await supabase
          .from('pharmacy_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        setPharmacyProfile(pp || null);
      }

      setScreen('main');
    } catch (error) {
      console.log('Profile fetch error:', error.message);
      setScreen('main');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setDoctorProfile(null);
          setPharmacyProfile(null);
          setAdminViewAs(null);
          setScreen('onboarding');
        },
      },
    ]);
  };

  const refreshProfile = () => {
    if (user) fetchProfile(user.id);
  };

  // Context value — shared across all components
  const contextValue = {
    user,
    profile,
    doctorProfile,
    pharmacyProfile,
    refreshProfile,
    handleLogout,
    adminViewAs,
    setAdminViewAs,
    showNotifications,
    setShowNotifications,
  };

  // Loading screen
  if (loading || screen === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>🏥</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>MediConnect</Text>
        <ActivityIndicator color="rgba(255,255,255,0.8)" size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <View style={{ flex: 1 }}>
        {/* Screens */}
        {screen === 'splash' && (
          <SplashScreen onDone={() => setScreen('onboarding')} />
        )}

        {screen === 'onboarding' && (
          <OnboardingScreen
            onGetStarted={() => setScreen('login')}
            onLogin={() => setScreen('login')}
          />
        )}

        {screen === 'login' && (
          <LoginScreen
            onLogin={(u) => { setUser(u); fetchProfile(u.id); }}
            onRegister={() => setScreen('register')}
          />
        )}

        {screen === 'register' && (
          <RegisterScreen
            onRegister={() => setScreen('login')}
            onLogin={() => setScreen('login')}
          />
        )}

        {screen === 'main' && profile && (
          <RoleRouter
            profile={profile}
            doctorProfile={doctorProfile}
            pharmacyProfile={pharmacyProfile}
            onLogout={handleLogout}
            onCompleteVerification={() => {
              // Re-fetch profile to check status
              fetchProfile(user.id);
            }}
          />
        )}

        {/* Global Notifications Screen */}
        {showNotifications && user && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
            <NotificationsScreen
              userId={user.id}
              onBack={() => setShowNotifications(false)}
            />
          </View>
        )}

        {/* Global Toast */}
        {toast && (
          <ToastNotification
            message={toast}
            visible={!!toast}
            onHide={() => setToast(null)}
          />
        )}
      </View>
    </AppContext.Provider>
  );
}

// ============================================
// FINAL SUPABASE SQL — Run these in Supabase
// Additional fixes and indexes for performance
// ============================================

/*
-- Run in Supabase SQL Editor

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_orders_patient_id ON orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_orders_pharmacy_id ON orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_verified ON doctor_profiles(is_verified, verification_status);
CREATE INDEX IF NOT EXISTS idx_pharmacy_profiles_verified ON pharmacy_profiles(is_verified, verification_status);

-- Allow admin to update any row (service-level bypass)
CREATE POLICY "admin_all_appointments" ON appointments
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_orders" ON orders
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_doctor_profiles" ON doctor_profiles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_pharmacy_profiles" ON pharmacy_profiles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_transactions" ON transactions
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_commissions" ON commissions
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Set your admin account (replace with your email)
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Fix: allow notifications to be inserted by any authenticated user
DROP POLICY IF EXISTS "notifications_insert" ON notifications;
CREATE POLICY "notifications_insert" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix: allow commissions insert from authenticated users
DROP POLICY IF EXISTS "commissions_insert" ON commissions;
CREATE POLICY "commissions_insert" ON commissions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix: allow transactions insert from authenticated users
DROP POLICY IF EXISTS "transactions_insert" ON transactions;
CREATE POLICY "transactions_insert" ON transactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
*/

// ============================================
// COMPLETE PACKAGE.JSON DEPENDENCIES
// Add these to your package.json
// ============================================

/*
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    "@react-native-async-storage/async-storage": "1.21.0"
  }
}

Run: npm install @supabase/supabase-js @react-native-async-storage/async-storage
*/

// ============================================
// WHAT TO DO AFTER PASTING ALL PARTS
// ============================================

/*
SETUP CHECKLIST:

1. DATABASE
   ✅ Run Part 1 SQL in Supabase SQL Editor
   ✅ Run Part 5 SQL (indexes + policies + realtime)
   ✅ Set your admin email:
      UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';

2. PROJECT STRUCTURE (Single File Recommended)
   Create one file: App.js
   Paste in this order:
   - Part 1 (Foundation, Auth, Shared Components)
   - Part 2 (Patient Dashboard)
   - Part 3 (Doctor + Pharmacy Dashboards + VideoCall)
   - Part 4 (Admin Dashboard)
   - Part 5 (Wiring, Rankings, Nearby, Invoicing)
   
   Make sure PatientShell, DoctorShell, PharmacyShell,
   AdminShell are defined BEFORE RoleRouter.

3. REPLACE THESE IN PART 1:
   - PatientShell → use PatientShellV2 from Part 5
   - RoleRouter → use updated RoleRouter from Part 5
   - Export App default → use App from Part 5

4. SUPABASE SETTINGS
   In Supabase Dashboard:
   ✅ Authentication → Email confirmations (turn OFF for testing)
   ✅ Database → Realtime → Enable for notifications table
   ✅ Storage → Create bucket called "documents" (public)

5. TESTING ORDER
   a. Register as patient → browse doctors → book appointment
   b. Register as doctor → complete verification
   c. Log into admin → approve doctor → check commissions
   d. Patient books doctor → doctor confirms → payment held
   e. Doctor completes → payment released → review prompted
   f. Admin sees commission collected automatically

6. GO LIVE CHECKLIST
   ✅ Replace mock payment with Stripe SDK
   ✅ Replace VideoCallScreen with WebRTC (react-native-webrtc)
      or Daily.co / Agora SDK for real video
   ✅ Add push notifications via Expo Notifications or Firebase
   ✅ Add real location with expo-location
   ✅ Set commission rates per doctor in doctor_profiles table
   ✅ Add Stripe Connect for doctor/pharmacy payouts
*/
