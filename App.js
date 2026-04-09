import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  Modal,
  SafeAreaView,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

// ==================== SUPABASE ====================
const supabaseUrl = 'https://lvqxyfbihvozbtjjeuzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cXh5ZmJpaHZvemJ0ampldXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjgxMjcsImV4cCI6MjA5MTMwNDEyN30.Re1KvgH1pGFsiC9qiaJnBOxlnZNHRv5xN1NPvjyIpes';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== THEME ====================
const COLORS = {
  primary: '#2A9D8F',
  primaryDark: '#1B7A6E',
  primaryLight: '#E8F5F3',
  secondary: '#264653',
  accent: '#E76F51',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  text: '#1F2937',
  textLight: '#6B7280',
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
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22 }}>
          Connecting you to healthcare,{'\n'}anytime, anywhere.
        </Text>
      </View>
    </View>
  );
}

// ==================== ONBOARDING SCREEN ====================
function OnboardingScreen({ onDone, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

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
    } else {
      onDone();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 }} onPress={onDone}>
        <Text style={{ fontSize: 14, color: COLORS.gray, fontWeight: '500' }}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
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
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate('search')}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>👨‍⚕️</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>Find Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate('pharmacy')}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>💊</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>Pharmacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }} onPress={() => onNavigate('appointments')}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>📅</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>My Bookings</Text>
          </TouchableOpacity>
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>How It Works</Text>
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

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
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
}

// ==================== BOOK APPOINTMENT SCREEN ====================
function BookAppointmentScreen({ doctor, user, onBack, onSuccess }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) { Alert.alert('Error', 'Please select a date and time'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        type: appointmentType,
        notes,
        fee: doctor.consultation_fee,
        status: 'pending',
        payment_status: 'unpaid',
      }).select().single();
      if (error) throw error;
      Alert.alert('Booked! 🎉', `Your appointment with ${doctor.full_name} on ${selectedDate} at ${selectedTime} has been confirmed!`, [{ text: 'OK', onPress: onSuccess }]);
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Doctor</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{doctor.full_name}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Date</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{selectedDate || 'Not selected'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Time</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{selectedTime || 'Not selected'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Type</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, textTransform: 'capitalize' }}>{appointmentType}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total Fee</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 24, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <TouchableOpacity style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={handleBook} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Confirm Booking — ${doctor.consultation_fee}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== PHARMACY SCREEN ====================
function PharmacyScreen({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('pharmacies');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const filteredMeds = SAMPLE_MEDICATIONS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) {
      setCart(cart.map(c => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const removeFromCart = (medId) => setCart(cart.filter(c => c.id !== medId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) { Alert.alert('Error', 'Your cart is empty'); return; }
    try {
      const { data, error } = await supabase.from('orders').insert({
        patient_id: user.id,
        pharmacy_id: SAMPLE_PHARMACIES[0].id,
        items: cart,
        total_amount: cartTotal,
        delivery_address: 'Home Address',
        status: 'pending',
        payment_status: 'unpaid',
      }).select().single();
      if (error) throw error;
      Alert.alert('Order Placed! 🎉', `Your order of ${cartCount} items (£${cartTotal.toFixed(2)}) has been placed. Estimated delivery: 45-60 mins`, [{ text: 'OK', onPress: () => { setCart([]); setShowCart(false); } }]);
    } catch (error) {
      Alert.alert('Order Failed', error.message);
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
            <View style={{ gap: 8 }}>
              {[{ icon: '🚚', text: 'Door-step Delivery in under 60 mins' }, { icon: '📍', text: 'Nearby Pharmacies' }, { icon: '🕐', text: '24/7 Available' }, { icon: '✅', text: 'Verified Medications' }].map((f) => (
                <View key={f.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 16 }}>{f.icon}</Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{f.text}</Text>
                </View>
              ))}
            </View>
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
                <ScrollView style={{ maxHeight: 300 }}>
                  {cart.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.name}</Text>
                        <Text style={{ fontSize: 13, color: COLORS.textLight }}>Qty: {item.quantity} × ${item.price}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>${(item.price * item.quantity).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={{ fontSize: 18, color: COLORS.error }}>🗑️</Text></TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16, marginTop: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={handleOrder}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Place Order — ${cartTotal.toFixed(2)}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==================== APPOINTMENTS SCREEN ====================
function AppointmentsScreen({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase.from('appointments').select('*, doctors(full_name, specialty, avatar_url)').eq('patient_id', user.id).order('appointment_date', { ascending: false });
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
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>{item.doctors?.full_name || 'Doctor'}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>{item.doctors?.specialty}</Text>
                </View>
                <View style={{ backgroundColor: getStatusColor(item.status) + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getStatusColor(item.status), textTransform: 'capitalize' }}>{item.status}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.type === 'video' ? '📹' : '🏥'} {item.type}</Text>
              </View>
              {item.fee && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>Fee: ${item.fee}</Text>
                  <Text style={{ fontSize: 13, color: item.payment_status === 'paid' ? COLORS.success : COLORS.warning, fontWeight: '600', textTransform: 'capitalize' }}>{item.payment_status}</Text>
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      setProfile(data);
    } catch (error) {
      console.log(error);
    }
  };

  const menuItems = [
    { icon: '👤', label: 'Personal Information', action: () => {} },
    { icon: '📅', label: 'My Appointments', action: () => {} },
    { icon: '💊', label: 'My Orders', action: () => {} },
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
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>{user?.user_metadata?.full_name || profile?.full_name || 'User'}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{user?.email}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 }}>
          <Text style={{ fontSize: 13, color: COLORS.white, textTransform: 'capitalize' }}>👤 {user?.user_metadata?.role || 'Patient'}</Text>
        </View>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.label} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < menuItems.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }} onPress={item.action}>
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 16, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center', marginTop: 24 }}>MediConnect v1.0.0{'\n'}© 2026 Reine Mande Ltd. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

// ==================== MAIN TAB BAR ====================
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

  if (screen === 'doctorProfile') return <DoctorProfileScreen doctor={screenParams.doctor} user={user} onNavigate={navigate} onBack={goBack} />;
  if (screen === 'bookAppointment') return <BookAppointmentScreen doctor={screenParams.doctor} user={user} onBack={goBack} onSuccess={() => { setActiveTab('appointments'); setScreen('appointments'); }} />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && <HomeScreen user={user} onNavigate={(s, p) => { if (['search', 'pharmacy', 'appointments', 'profile'].includes(s)) { setActiveTab(s); setScreen(s); } else { navigate(s, p); } }} />}
        {activeTab === 'search' && <SearchScreen onNavigate={navigate} initialSpecialty={screenParams.specialty} />}
        {activeTab === 'appointments' && <AppointmentsScreen user={user} />}
        {activeTab === 'pharmacy' && <PharmacyScreen user={user} onNavigate={navigate} />}
        {activeTab === 'profile' && <ProfileScreen user={user} onLogout={onLogout} />}
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 20, paddingTop: 10 }}>
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'appointments', icon: '📅', label: 'Bookings' },
          { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
          { id: 'profile', icon: '👤', label: 'Profile' },
        ].map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => { setActiveTab(tab.id); setScreen(tab.id); setScreenParams({}); }}>
            <Text style={{ fontSize: 22, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: activeTab === tab.id ? COLORS.primary : COLORS.gray }}>{tab.label}</Text>
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
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) setScreen('main');
      else setScreen('login');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('onboarding');
    setUser(null);
  };

  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('onboarding')} />;
  if (screen === 'onboarding') return <OnboardingScreen onDone={() => setScreen('login')} onLogin={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={(u) => { setUser(u); setScreen('main'); }} onRegister={() => setScreen('register')} />;
  if (screen === 'register') return <RegisterScreen onRegister={() => setScreen('login')} onLogin={() => setScreen('login')} />;
  if (screen === 'main') return <MainApp user={user} onLogout={handleLogout} />;

  return null;
}
