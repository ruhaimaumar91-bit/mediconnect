import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, StatusBar, Modal, SafeAreaView,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

// ==================== SUPABASE ====================
const supabaseUrl = 'https://lvqxyfbihvozbtjjeuzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cXh5ZmJpaHZvemJ0ampldXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjgxMjcsImV4cCI6MjA5MTMwNDEyN30.Re1KvgH1pGFsiC9qiaJnBOxlnZNHRv5xN1NPvjyIpes';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== THEME ====================
const COLORS = {
  primary: '#2A9D8F', primaryDark: '#1B7A6E', primaryLight: '#E8F5F3',
  secondary: '#264653', accent: '#E76F51', white: '#FFFFFF', black: '#000000',
  gray: '#6B7280', lightGray: '#F3F4F6', border: '#E5E7EB', error: '#EF4444',
  success: '#10B981', warning: '#F59E0B', text: '#1F2937', textLight: '#6B7280',
  background: '#F9FAFB',
};

const SPECIALTIES = [
  { id: '1', name: 'Cardiology', icon: '❤️', color: '#FEE2E2' },
  { id: '2', name: 'Neurology', icon: '🧠', color: '#EDE9FE' },
  { id: '3', name: 'Ophthalmology', icon: '👁️', color: '#DBEAFE' },
  { id: '4', name: 'Pediatrics', icon: '👶', color: '#FCE7F3' },
  { id: '5', name: 'Orthopedics', icon: '🦴', color: '#FEF3C7' },
  { id: '6', name: 'General', icon: '🩺', color: '#D1FAE5' },
  { id: '7', name: 'Pharmacy', icon: '💊', color: '#CCFBF1' },
  { id: '8', name: 'Emergency', icon: '🚨', color: '#FEE2E2' },
];

const SAMPLE_DOCTORS = [
  { id: '1', full_name: 'Dr. Sarah Johnson', specialty: 'Cardiology', location: 'London, UK', consultation_fee: 150, rating: 4.8, total_reviews: 124, is_verified: true, is_available: true, languages: ['English', 'French'], bio: 'Experienced cardiologist with 15 years of practice specializing in heart disease prevention and treatment.', avatar: '👩‍⚕️' },
  { id: '2', full_name: 'Dr. Michael Chen', specialty: 'Neurology', location: 'New York, USA', consultation_fee: 200, rating: 4.9, total_reviews: 89, is_verified: true, is_available: true, languages: ['English', 'Mandarin'], bio: 'Specialist in neurological disorders and brain health with expertise in stroke prevention.', avatar: '👨‍⚕️' },
  { id: '3', full_name: 'Dr. Aisha Patel', specialty: 'Pediatrics', location: 'Dubai, UAE', consultation_fee: 120, rating: 4.7, total_reviews: 200, is_verified: true, is_available: true, languages: ['English', 'Arabic', 'Hindi'], bio: 'Dedicated pediatrician caring for children of all ages with a gentle and patient approach.', avatar: '👩‍⚕️' },
  { id: '4', full_name: 'Dr. James Wilson', specialty: 'Orthopedics', location: 'Toronto, Canada', consultation_fee: 180, rating: 4.6, total_reviews: 67, is_verified: true, is_available: true, languages: ['English'], bio: 'Expert in bone and joint treatments including sports injuries and joint replacement.', avatar: '👨‍⚕️' },
  { id: '5', full_name: 'Dr. Fatima Al-Hassan', specialty: 'General', location: 'Lagos, Nigeria', consultation_fee: 80, rating: 4.5, total_reviews: 312, is_verified: true, is_available: true, languages: ['English', 'Arabic'], bio: 'General practitioner with holistic approach to health and preventive medicine.', avatar: '👩‍⚕️' },
  { id: '6', full_name: 'Dr. Robert Kim', specialty: 'Ophthalmology', location: 'Seoul, South Korea', consultation_fee: 160, rating: 4.8, total_reviews: 145, is_verified: true, is_available: true, languages: ['English', 'Korean'], bio: 'Eye specialist with expertise in laser surgery and retinal diseases.', avatar: '👨‍⚕️' },
];

const SAMPLE_PHARMACIES = [
  { id: '1', name: 'MediConnect Pharmacy', address: '123 Health Street, London, UK', phone: '+44 20 1234 5678', is_verified: true, is_open_24h: true, rating: 4.8, icon: '🏪' },
  { id: '2', name: 'Global Health Pharmacy', address: '456 Wellness Ave, New York, USA', phone: '+1 212 987 6543', is_verified: true, is_open_24h: false, rating: 4.6, icon: '💊' },
  { id: '3', name: 'CareFirst Pharmacy', address: '789 Medical Blvd, Dubai, UAE', phone: '+971 4 123 4567', is_verified: true, is_open_24h: true, rating: 4.7, icon: '🏥' },
];

const SAMPLE_MEDICATIONS = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, requires_prescription: false, in_stock: true, description: 'Effective pain and fever relief', icon: '💊' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 12.99, requires_prescription: true, in_stock: true, description: 'Broad spectrum antibiotic', icon: '💉' },
  { id: '3', name: 'Vitamin D3 1000IU', category: 'Vitamins', price: 8.99, requires_prescription: false, in_stock: true, description: 'Supports bone and immune health', icon: '🌟' },
  { id: '4', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 6.99, requires_prescription: false, in_stock: true, description: 'Anti-inflammatory pain relief', icon: '💊' },
  { id: '5', name: 'Omeprazole 20mg', category: 'Digestive', price: 9.99, requires_prescription: false, in_stock: true, description: 'Reduces stomach acid', icon: '🟡' },
  { id: '6', name: 'Cetirizine 10mg', category: 'Allergy', price: 7.99, requires_prescription: false, in_stock: true, description: 'Antihistamine for allergies', icon: '🔵' },
];

const PAYMENT_METHODS = [
  { id: '1', type: 'visa', label: 'Visa', icon: '💳', color: '#1A1F71', last4: '4242' },
  { id: '2', type: 'mastercard', label: 'Mastercard', icon: '💳', color: '#EB001B', last4: '5555' },
  { id: '3', type: 'amex', label: 'Amex', icon: '💳', color: '#2E77BC', last4: '0005' },
  { id: '4', type: 'applepay', label: 'Apple Pay', icon: '🍎', color: '#000000', last4: null },
  { id: '5', type: 'googlepay', label: 'Google Pay', icon: '🔵', color: '#4285F4', last4: null },
  { id: '6', type: 'paypal', label: 'PayPal', icon: '🅿️', color: '#003087', last4: null },
];
// ==================== SPLASH SCREEN ====================
function SplashScreen({ onDone }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View style={{ alignItems: 'center', opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <View style={{ width: 100, height: 100, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 50 }}>🏥</Text>
        </View>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 }}>MediConnect</Text>
        <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Your Health, Delivered</Text>
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 50, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22 }}>Connecting you to healthcare,{'\n'}anytime, anywhere.</Text>
      </View>
    </View>
  );
}

// ==================== ONBOARDING ====================
function OnboardingScreen({ onDone, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const slides = [
    { id: '1', icon: '🔍', title: 'Find Top Doctors', description: 'Browse specialists across all medical fields. Filter by specialty, location, language, and availability.', color: COLORS.primary },
    { id: '2', icon: '📅', title: 'Book Appointments', description: 'Schedule in-person or video consultations with ease. Get instant confirmation and reminders.', color: '#264653' },
    { id: '3', icon: '💊', title: 'Medications Delivered', description: 'Order prescription and over-the-counter medications from trusted pharmacies. Delivered in under 60 minutes.', color: '#2A9D8F' },
    { id: '4', icon: '🛡️', title: 'Your Health, Safe', description: 'All doctors are verified professionals. Your health data is protected with enterprise-grade security.', color: '#E76F51' },
  ];
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else { onDone(); }
  };
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 }} onPress={onDone}>
        <Text style={{ fontSize: 14, color: COLORS.gray, fontWeight: '500' }}>Skip</Text>
      </TouchableOpacity>
      <FlatList ref={flatListRef} data={slides} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 }}>
            <View style={{ width: 160, height: 160, borderRadius: 40, backgroundColor: item.color, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
              <Text style={{ fontSize: 80 }}>{item.icon}</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 16 }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 26 }}>{item.description}</Text>
          </View>
        )}
      />
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
          {slides.map((_, index) => (
            <View key={index} style={{ height: 8, width: currentIndex === index ? 24 : 8, borderRadius: 4, backgroundColor: currentIndex === index ? COLORS.primary : COLORS.border, marginHorizontal: 4 }} />
          ))}
        </View>
        <TouchableOpacity style={{ width: '100%', backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }} onPress={handleNext}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== LOGIN SCREEN ====================
function LoginScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin(data.user);
    } catch (error) { Alert.alert('Login Failed', error.message); }
    finally { setLoading(false); }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.white }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Welcome back 👋</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.white }}>Log In to MediConnect</Text>
      </View>
      <View style={{ padding: 24, flex: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Email Address</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Password</Text>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.lightGray, alignItems: 'center' }}>
            <TextInput style={{ flex: 1, padding: 14, fontSize: 16 }} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity style={{ padding: 14 }} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Log In</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          <Text style={{ marginHorizontal: 16, color: COLORS.gray, fontSize: 14 }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        </View>
        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={onRegister}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==================== REGISTER SCREEN ====================
function RegisterScreen({ onRegister, onLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } });
      if (error) throw error;
      Alert.alert('Success! 🎉', 'Account created! Please check your email to verify your account.', [{ text: 'OK', onPress: onLogin }]);
    } catch (error) { Alert.alert('Registration Failed', error.message); }
    finally { setLoading(false); }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.white }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Join MediConnect 🏥</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.white }}>Create Your Account</Text>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Full Name</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Email Address</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>I am a</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['patient', 'doctor'].map((r) => (
              <TouchableOpacity key={r} style={{ flex: 1, borderWidth: 2, borderColor: role === r ? COLORS.primary : COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: role === r ? COLORS.primaryLight : COLORS.white }} onPress={() => setRole(r)}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{r === 'patient' ? '🙋' : '👨‍⚕️'}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: role === r ? COLORS.primary : COLORS.gray, textTransform: 'capitalize' }}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Password</Text>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.lightGray, alignItems: 'center' }}>
            <TextInput style={{ flex: 1, padding: 14, fontSize: 16 }} placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity style={{ padding: 14 }} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Confirm Password</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder="Confirm your password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
        </View>
        <TouchableOpacity style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Create Account</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
// ==================== HOME SCREEN ====================
function HomeScreen({ user, onNavigate }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Good day 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{user?.user_metadata?.full_name || 'Welcome!'}</Text>
          </View>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={() => onNavigate('profile')}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, gap: 10 }} onPress={() => onNavigate('search')}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <Text style={{ fontSize: 16, color: COLORS.gray }}>Search doctors, specialties...</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👨‍⚕️', label: 'Find Doctor', screen: 'search' },
            { icon: '💊', label: 'Pharmacy', screen: 'pharmacy' },
            { icon: '📅', label: 'My Bookings', screen: 'appointments' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate(item.screen)}>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>💊 Medications Delivered</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Get meds delivered in under 60 mins</Text>
            <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' }} onPress={() => onNavigate('pharmacy')}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 60 }}>🚚</Text>
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Browse by Specialty</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {SPECIALTIES.map((specialty) => (
            <TouchableOpacity key={specialty.id} style={{ width: (width - 72) / 2, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: selectedSpecialty === specialty.name ? 2 : 0, borderColor: COLORS.primary }} onPress={() => { setSelectedSpecialty(specialty.name); onNavigate('search', { specialty: specialty.name }); }}>
              <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: specialty.color, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 26 }}>{specialty.icon}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{specialty.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Top Doctors</Text>
        {SAMPLE_DOCTORS.slice(0, 3).map((doctor) => (
          <TouchableOpacity key={doctor.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate('doctorProfile', { doctor })}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 30 }}>{doctor.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{doctor.full_name}</Text>
                {doctor.is_verified && <Text style={{ fontSize: 14 }}>✅</Text>}
              </View>
              <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 4 }}>{doctor.specialty}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>📍 {doctor.location}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {doctor.rating} ({doctor.total_reviews})</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 24 }} onPress={() => onNavigate('search')}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>View All Doctors →</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: COLORS.secondary, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 16 }}>How It Works</Text>
          {[
            { step: '1', icon: '👤', title: 'Create Account', desc: 'Sign up and set up your health profile' },
            { step: '2', icon: '🔍', title: 'Find a Doctor', desc: 'Browse by specialty, symptom or name' },
            { step: '3', icon: '📅', title: 'Book & Consult', desc: 'Schedule in-person or video consultation' },
            { step: '4', icon: '💊', title: 'Get Medication', desc: 'Order prescribed meds for delivery or pickup' },
          ].map((item) => (
            <View key={item.step} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{item.step}</Text>
              </View>
              <Text style={{ fontSize: 18, marginRight: 10 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.white }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ==================== SEARCH SCREEN ====================
function SearchScreen({ onNavigate, initialSpecialty }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || null);
  const [doctors, setDoctors] = useState(SAMPLE_DOCTORS);
  useEffect(() => {
    let filtered = SAMPLE_DOCTORS;
    if (selectedSpecialty) filtered = filtered.filter(d => d.specialty === selectedSpecialty);
    if (searchQuery) filtered = filtered.filter(d => d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || d.location.toLowerCase().includes(searchQuery.toLowerCase()));
    setDoctors(filtered);
  }, [searchQuery, selectedSpecialty]);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 16 }}>Find Doctors</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10 }}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput style={{ flex: 1, fontSize: 16 }} placeholder="Search doctors, specialties..." value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={{ fontSize: 18 }}>✕</Text></TouchableOpacity> : null}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60, paddingHorizontal: 16, paddingVertical: 10 }}>
        <TouchableOpacity style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: !selectedSpecialty ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }} onPress={() => setSelectedSpecialty(null)}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: !selectedSpecialty ? COLORS.white : COLORS.primary }}>All</Text>
        </TouchableOpacity>
        {SPECIALTIES.map((s) => (
          <TouchableOpacity key={s.id} style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedSpecialty === s.name ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }} onPress={() => setSelectedSpecialty(selectedSpecialty === s.name ? null : s.name)}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: selectedSpecialty === s.name ? COLORS.white : COLORS.primary }}>{s.icon} {s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={doctors} keyExtractor={(item) => item.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 40, marginBottom: 16 }}>🔍</Text><Text style={{ fontSize: 16, color: COLORS.textLight }}>No doctors found</Text></View>}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate('doctorProfile', { doctor: item })}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 30 }}>{item.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{item.full_name}</Text>
                {item.is_verified && <Text>✅</Text>}
              </View>
              <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 4 }}>{item.specialty}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>📍 {item.location}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating} ({item.total_reviews} reviews)</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${item.consultation_fee}/visit</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ==================== DOCTOR PROFILE SCREEN ====================
function DoctorProfileScreen({ doctor, onNavigate, onBack }) {
  const [activeTab, setActiveTab] = useState('about');
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 40 }}>{doctor.avatar}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{doctor.full_name}</Text>
            {doctor.is_verified && <Text>✅</Text>}
          </View>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>{doctor.specialty}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>📍 {doctor.location}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 24, marginTop: -20, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 16 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.primary }}>{doctor.rating}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight }}>⭐ Rating</Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.primary }}>{doctor.total_reviews}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight }}>Reviews</Text>
        </View>
        <View style={{ width: 1, backgroundColor: COLORS.border }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight }}>Per Visit</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 4 }}>
          {['about', 'availability'].map((tab) => (
            <TouchableOpacity key={tab} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.white : 'transparent' }} onPress={() => setActiveTab(tab)}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeTab === 'about' && (
          <View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>About</Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22 }}>{doctor.bio}</Text>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Languages</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {doctor.languages.map((lang) => (
                  <View key={lang} style={{ backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>🌐 {lang}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        {activeTab === 'availability' && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Available Days</Text>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <View key={day} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={{ fontSize: 14, color: COLORS.text }}>{day}</Text>
                <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>9:00 AM - 5:00 PM</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <View style={{ padding: 24, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => onNavigate('bookAppointment', { doctor })}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>📅 Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}// ==================== PAYMENT MODAL ====================
function PaymentModal({ visible, amount, title, onSuccess, onClose }) {
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
    if (selectedMethod.type === 'visa' || selectedMethod.type === 'mastercard' || selectedMethod.type === 'amex') {
      if (!cardNumber || !cardName || !expiry || !cvv) { Alert.alert('Error', 'Please fill in all card details'); return; }
    }
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setProcessing(false);
    onSuccess();
  };

  const digitalMethods = PAYMENT_METHODS.filter(m => ['applepay', 'googlepay', 'paypal'].includes(m.type));
  const cardMethods = PAYMENT_METHODS.filter(m => ['visa', 'mastercard', 'amex'].includes(m.type));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.92 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>💳 Secure Payment</Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 2 }}>Total: <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>${amount}</Text></Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false}>
            {/* Security Badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 24, gap: 10 }}>
              <Text style={{ fontSize: 20 }}>🔒</Text>
              <Text style={{ fontSize: 13, color: COLORS.success, fontWeight: '600', flex: 1 }}>256-bit SSL encrypted. Your payment is 100% secure.</Text>
            </View>

            {/* Digital Payment Methods */}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Quick Pay</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
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

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text style={{ marginHorizontal: 16, color: COLORS.gray, fontSize: 13 }}>or pay with card</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Card Methods */}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Select Card Type</Text>
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
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, padding: 20, marginBottom: 20 }}>
                {/* Card Preview */}
                <View style={{ backgroundColor: selectedMethod.color, borderRadius: 16, padding: 20, marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>{selectedMethod.label}</Text>
                  <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: 'bold', letterSpacing: 3, marginBottom: 20 }}>
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

                {/* Card Fields */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Card Number</Text>
                  <TextInput
                    style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, letterSpacing: 2 }}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Cardholder Name</Text>
                  <TextInput
                    style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                    placeholder="Name on card"
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Expiry Date</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="MM/YY"
                      value={expiry}
                      onChangeText={(t) => setExpiry(formatExpiry(t))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>CVV</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="•••"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Order Summary */}
            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 24 }}>
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
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${amount}</Text>
              </View>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={{ backgroundColor: processing ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 30, flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              onPress={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <ActivityIndicator color={COLORS.white} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Processing...</Text>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 20 }}>🔒</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>
                    Pay ${amount} {selectedMethod ? `via ${selectedMethod.label}` : ''}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ==================== BOOK APPOINTMENT SCREEN ====================
function BookAppointmentScreen({ doctor, user, onBack, onSuccess }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  const handleBook = () => {
    if (!selectedDate || !selectedTime) { Alert.alert('Error', 'Please select a date and time'); return; }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        type: appointmentType,
        notes,
        fee: doctor.consultation_fee,
        status: 'confirmed',
        payment_status: 'paid',
      });
      if (error) throw error;
      Alert.alert('Booked & Paid! 🎉', `Your appointment with ${doctor.full_name} on ${selectedDate} at ${selectedTime} is confirmed and paid!`, [{ text: 'OK', onPress: onSuccess }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Book Appointment</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>with {doctor.full_name}</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 24 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Appointment Type</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[{ type: 'in-person', icon: '🏥', label: 'In-Person' }, { type: 'video', icon: '📹', label: 'Video Call' }].map((t) => (
              <TouchableOpacity key={t.type} style={{ flex: 1, borderWidth: 2, borderColor: appointmentType === t.type ? COLORS.primary : COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: appointmentType === t.type ? COLORS.primaryLight : COLORS.white }} onPress={() => setAppointmentType(t.type)}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: appointmentType === t.type ? COLORS.primary : COLORS.gray }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((d) => (
              <TouchableOpacity key={d.date} style={{ marginRight: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: selectedDate === d.date ? COLORS.primary : COLORS.lightGray, alignItems: 'center' }} onPress={() => setSelectedDate(d.date)}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: selectedDate === d.date ? COLORS.white : COLORS.text }}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Select Time</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {times.map((time) => (
              <TouchableOpacity key={time} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: selectedTime === time ? COLORS.primary : COLORS.lightGray }} onPress={() => setSelectedTime(time)}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: selectedTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Notes (Optional)</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 100, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }} placeholder="Describe your symptoms or reason for visit..." value={notes} onChangeText={setNotes} multiline />
        </View>

        <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Booking Summary</Text>
          {[
            { label: 'Doctor', value: doctor.full_name },
            { label: 'Date', value: selectedDate || 'Not selected' },
            { label: 'Time', value: selectedTime || 'Not selected' },
            { label: 'Type', value: appointmentType },
          ].map((row) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: COLORS.textLight }}>{row.label}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, textTransform: 'capitalize' }}>{row.value}</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total Fee</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 24, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <TouchableOpacity style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={handleBook} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>💳 Proceed to Payment — ${doctor.consultation_fee}</Text>}
        </TouchableOpacity>
      </View>

      <PaymentModal
        visible={showPayment}
        amount={doctor.consultation_fee}
        title={`Appointment with ${doctor.full_name}`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}

// ==================== PHARMACY SCREEN ====================
function PharmacyScreen({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('pharmacies');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const filteredMeds = SAMPLE_MEDICATIONS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) setCart(cart.map(c => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { ...med, quantity: 1 }]);
  };
  const removeFromCart = (medId) => setCart(cart.filter(c => c.id !== medId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    try {
      const { error } = await supabase.from('orders').insert({
        patient_id: user.id,
        pharmacy_id: SAMPLE_PHARMACIES[0].id,
        items: cart,
        total_amount: cartTotal,
        delivery_address: 'Home Address',
        status: 'confirmed',
        payment_status: 'paid',
        estimated_delivery: '45-60 mins',
      });
      if (error) throw error;
      Alert.alert('Order Placed & Paid! 🎉', `Your order of ${cartCount} items ($${cartTotal.toFixed(2)}) is confirmed! Estimated delivery: 45-60 mins`, [{ text: 'OK', onPress: () => { setCart([]); setShowCart(false); } }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Pharmacy</Text>
          <TouchableOpacity style={{ position: 'relative' }} onPress={() => setShowCart(true)}>
            <Text style={{ fontSize: 28 }}>🛒</Text>
            {cartCount > 0 && (
              <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.accent, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, padding: 4 }}>
          {['pharmacies', 'medications'].map((tab) => (
            <TouchableOpacity key={tab} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.primary : 'transparent' }} onPress={() => setActiveTab(tab)}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: activeTab === tab ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'pharmacies' ? (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View style={{ backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>🚚 Medications, Delivered to You</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Order prescriptions and OTC medications from trusted pharmacies</Text>
            {[{ icon: '🚚', text: 'Door-step Delivery in under 60 mins' }, { icon: '📍', text: 'Nearby Pharmacies' }, { icon: '🕐', text: '24/7 Available' }, { icon: '✅', text: 'Verified Medications' }].map((f) => (
              <View key={f.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Text style={{ fontSize: 16 }}>{f.icon}</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{f.text}</Text>
              </View>
            ))}
          </View>
          {SAMPLE_PHARMACIES.map((pharmacy) => (
            <TouchableOpacity key={pharmacy.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => setActiveTab('medications')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 26 }}>{pharmacy.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{pharmacy.name}</Text>
                    {pharmacy.is_verified && <Text>✅</Text>}
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {pharmacy.address}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {pharmacy.rating}</Text>
                  <Text style={{ fontSize: 12, color: pharmacy.is_open_24h ? COLORS.success : COLORS.error }}>{pharmacy.is_open_24h ? '🟢 Open 24h' : '🔴 Limited Hours'}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => setActiveTab('medications')}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>Order</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10 }}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <TextInput style={{ flex: 1, fontSize: 16 }} placeholder="Search medications..." value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </View>
          <FlatList
            data={filteredMeds}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 26 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>{item.category} • {item.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>${item.price}</Text>
                      {item.requires_prescription && <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ fontSize: 11, color: '#D97706' }}>Rx Required</Text></View>}
                    </View>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: inCart ? COLORS.success : COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => addToCart(item)}>
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
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.7 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>🛒 Your Cart ({cartCount})</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}><Text style={{ fontSize: 24 }}>✕</Text></TouchableOpacity>
            </View>
            {cart.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 16 }}>🛒</Text>
                <Text style={{ fontSize: 16, color: COLORS.textLight }}>Your cart is empty</Text>
              </View>
            ) : (
              <>
                <ScrollView style={{ maxHeight: 280 }}>
                  {cart.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.name}</Text>
                        <Text style={{ fontSize: 13, color: COLORS.textLight }}>Qty: {item.quantity} × ${item.price}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>${(item.price * item.quantity).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={{ fontSize: 18 }}>🗑️</Text></TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16, marginTop: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => { setShowCart(false); setShowPayment(true); }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>💳 Proceed to Payment</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <PaymentModal
        visible={showPayment}
        amount={cartTotal.toFixed(2)}
        title={`Medication Order (${cartCount} items)`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}

// ==================== ORDER TRACKING SCREEN ====================
function OrderTrackingScreen({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchOrders();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const TRACKING_STEPS = [
    { id: 'pending', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
    { id: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Pharmacy confirmed your order' },
    { id: 'preparing', label: 'Preparing', icon: '⚗️', desc: 'Your medications are being packed' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', desc: 'Driver is on the way to you' },
    { id: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order delivered successfully' },
  ];

  const getStepIndex = (status) => TRACKING_STEPS.findIndex(s => s.id === status);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return COLORS.success;
      case 'out_for_delivery': return COLORS.primary;
      case 'preparing': return COLORS.warning;
      case 'confirmed': return COLORS.primary;
      case 'cancelled': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  if (selectedOrder) {
    const currentStep = getStepIndex(selectedOrder.status);
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
          <TouchableOpacity onPress={() => setSelectedOrder(null)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: COLORS.white }}>← Back to Orders</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Track Order</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        <ScrollView style={{ flex: 1, padding: 24 }}>
          {/* Status Banner */}
          <View style={{ backgroundColor: getStatusColor(selectedOrder.status) + '15', borderRadius: 16, padding: 20, marginBottom: 24, alignItems: 'center', borderWidth: 1, borderColor: getStatusColor(selectedOrder.status) + '30' }}>
            <Animated.Text style={{ fontSize: 50, marginBottom: 8, transform: [{ scale: selectedOrder.status === 'out_for_delivery' ? pulseAnim : 1 }] }}>
              {TRACKING_STEPS.find(s => s.id === selectedOrder.status)?.icon || '📋'}
            </Animated.Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: getStatusColor(selectedOrder.status), textTransform: 'capitalize' }}>
              {selectedOrder.status.replace(/_/g, ' ')}
            </Text>
            {selectedOrder.estimated_delivery && (
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>
                Estimated delivery: {selectedOrder.estimated_delivery}
              </Text>
            )}
          </View>

          {/* Tracking Steps */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 }}>Tracking Progress</Text>
            {TRACKING_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;
              return (
                <View key={step.id} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ alignItems: 'center', marginRight: 16 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isCompleted ? COLORS.primary : COLORS.lightGray, justifyContent: 'center', alignItems: 'center', borderWidth: isActive ? 3 : 0, borderColor: COLORS.primaryLight }}>
                      <Text style={{ fontSize: isCompleted ? 18 : 14 }}>{isCompleted ? step.icon : '○'}</Text>
                    </View>
                    {index < TRACKING_STEPS.length - 1 && (
                      <View style={{ width: 2, height: 40, backgroundColor: index < currentStep ? COLORS.primary : COLORS.border, marginVertical: 4 }} />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingTop: 8, paddingBottom: index < TRACKING_STEPS.length - 1 ? 32 : 0 }}>
                    <Text style={{ fontSize: 15, fontWeight: isActive ? 'bold' : '500', color: isCompleted ? COLORS.text : COLORS.textLight }}>{step.label}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Order Items */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Order Items</Text>
            {(selectedOrder.items || []).map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: index < selectedOrder.items.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>Qty: {item.quantity} × ${item.price}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${selectedOrder.total_amount?.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery Address */}
          {selectedOrder.delivery_address && (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Delivery Address</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 24 }}>📍</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight, flex: 1 }}>{selectedOrder.delivery_address}</Text>
              </View>
            </View>
          )}

          {/* Payment Status */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Payment</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: COLORS.textLight }}>Payment Status</Text>
              <View style={{ backgroundColor: selectedOrder.payment_status === 'paid' ? COLORS.success + '20' : COLORS.warning + '20', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: selectedOrder.payment_status === 'paid' ? COLORS.success : COLORS.warning, textTransform: 'capitalize' }}>
                  {selectedOrder.payment_status}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>My Orders</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Track your medication deliveries</Text>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>📦</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No orders yet</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>Order medications from the Pharmacy tab to get started</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => setSelectedOrder(item)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>
                    Order #{item.id.slice(0, 8).toUpperCase()}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
                <View style={{ backgroundColor: getStatusColor(item.status) + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getStatusColor(item.status), textTransform: 'capitalize' }}>
                    {item.status?.replace(/_/g, ' ')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>
                  🛒 {(item.items || []).length} item{(item.items || []).length !== 1 ? 's' : ''}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>
                  ${item.total_amount?.toFixed(2)}
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>Track Order →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ==================== APPOINTMENTS SCREEN ====================
function AppointmentsScreen({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: false });
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));
  const displayed = activeTab === 'upcoming' ? upcoming : past;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'cancelled': return COLORS.error;
      case 'completed': return COLORS.gray;
      default: return COLORS.gray;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 16 }}>My Appointments</Text>
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4 }}>
          {['upcoming', 'past'].map((tab) => (
            <TouchableOpacity key={tab} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.white : 'transparent' }} onPress={() => setActiveTab(tab)}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: activeTab === tab ? COLORS.primary : COLORS.white, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : displayed.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>📅</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No {activeTab} appointments</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>Book an appointment with a doctor to get started</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>
                    {SAMPLE_DOCTORS.find(d => d.id === item.doctor_id)?.full_name || 'Doctor'}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>
                    {SAMPLE_DOCTORS.find(d => d.id === item.doctor_id)?.specialty || ''}
                  </Text>
                </View>
                <View style={{ backgroundColor: getStatusColor(item.status) + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getStatusColor(item.status), textTransform: 'capitalize' }}>{item.status}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.type === 'video' ? '📹' : '🏥'} {item.type}</Text>
              </View>
              {item.fee && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>Fee: ${item.fee}</Text>
                  <Text style={{ fontSize: 13, color: item.payment_status === 'paid' ? COLORS.success : COLORS.warning, fontWeight: '600', textTransform: 'capitalize' }}>
                    {item.payment_status === 'paid' ? '✅ Paid' : '⏳ ' + item.payment_status}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

// ==================== PROFILE SCREEN ====================
function ProfileScreen({ user, onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      setProfile(data);
    } catch (error) { console.log(error); }
  };

  const menuItems = [
    { icon: '👤', label: 'Personal Information', action: () => {} },
    { icon: '📅', label: 'My Appointments', action: () => {} },
    { icon: '💊', label: 'My Orders', action: () => {} },
    { icon: '💳', label: 'Payment Methods', action: () => {} },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '🔒', label: 'Privacy & Security', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
    { icon: '📋', label: 'Terms & Privacy Policy', action: () => {} },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
          {user?.user_metadata?.full_name || profile?.full_name || 'User'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{user?.email}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }}>
          <Text style={{ fontSize: 13, color: COLORS.white, textTransform: 'capitalize' }}>
            👤 {user?.user_metadata?.role || 'Patient'}
          </Text>
        </View>
      </View>

      <View style={{ padding: 24 }}>
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📅', label: 'Appointments', value: '0' },
            { icon: '📦', label: 'Orders', value: '0' },
            { icon: '⭐', label: 'Reviews', value: '0' },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight, textAlign: 'center' }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.label} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < menuItems.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }} onPress={item.action}>
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 16, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }} onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
          MediConnect v1.0.0{'\n'}© 2026 Reine Mande Ltd. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
// ==================== MAIN APP WITH NAVIGATION ====================
function MainApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const goBack = () => {
    setScreen(activeTab);
    setScreenParams({});
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  // Full screen overlays (no tab bar)
  if (screen === 'doctorProfile') {
    return (
      <DoctorProfileScreen
        doctor={screenParams.doctor}
        user={user}
        onNavigate={navigate}
        onBack={goBack}
      />
    );
  }

  if (screen === 'bookAppointment') {
    return (
      <BookAppointmentScreen
        doctor={screenParams.doctor}
        user={user}
        onBack={goBack}
        onSuccess={() => switchTab('appointments')}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'appointments', icon: '📅', label: 'Bookings' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Screen Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomeScreen
            user={user}
            onNavigate={(s, p) => {
              if (['search', 'pharmacy', 'appointments', 'orders', 'profile'].includes(s)) {
                switchTab(s);
              } else {
                navigate(s, p);
              }
            }}
          />
        )}
        {activeTab === 'search' && (
          <SearchScreen
            onNavigate={navigate}
            initialSpecialty={screenParams.specialty}
          />
        )}
        {activeTab === 'appointments' && (
          <AppointmentsScreen user={user} />
        )}
        {activeTab === 'orders' && (
          <OrderTrackingScreen user={user} />
        )}
        {activeTab === 'pharmacy' && (
          <PharmacyScreen user={user} onNavigate={navigate} />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen user={user} onLogout={onLogout} />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: 24,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => switchTab(tab.id)}
          >
            <View style={{
              width: activeTab === tab.id ? 36 : 0,
              height: 3,
              backgroundColor: COLORS.primary,
              borderRadius: 2,
              marginBottom: 6,
            }} />
            <Text style={{ fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? COLORS.primary : COLORS.gray,
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ==================== APP ENTRY POINT ====================
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) setScreen('main');
      else setScreen('splash');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) setScreen('main');
      else setScreen('onboarding');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen('onboarding');
  };

  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('onboarding')} />;
  if (screen === 'onboarding') return <OnboardingScreen onDone={() => setScreen('login')} onLogin={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={(u) => { setUser(u); setScreen('main'); }} onRegister={() => setScreen('register')} />;
  if (screen === 'register') return <RegisterScreen onRegister={() => setScreen('login')} onLogin={() => setScreen('login')} />;
  if (screen === 'main') return <MainApp user={user} onLogout={handleLogout} />;

  return null;
}
