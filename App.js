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
  Image,
  Modal,
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
    { id: '3', icon: '💊', title: 'Medications Delivered', description: 'Order prescription and over-the-counter medications from trusted pharmacies. Delivered to your door in under 60 minutes.', color: '#2A9D8F' },
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
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
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
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text>
          </Text>
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
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
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
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Password</Text>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.lightGray, alignItems: 'center' }}>
            <TextInput
              style={{ flex: 1, padding: 14, fontSize: 16 }}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={{ padding: 14 }} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
          onPress={handleLogin}
          disabled={loading}
        >
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

        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
          onPress={onRegister}
        >
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
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (error) throw error;
      Alert.alert('Success! 🎉', 'Account created successfully! Please check your email to verify your account.', [
        { text: 'OK', onPress: onLogin },
      ]);
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
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Email Address</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>I am a</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['patient', 'doctor'].map((r) => (
              <TouchableOpacity
                key={r}
                style={{ flex: 1, borderWidth: 2, borderColor: role === r ? COLORS.primary : COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: role === r ? COLORS.primaryLight : COLORS.white }}
                onPress={() => setRole(r)}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{r === 'patient' ? '🙋' : '👨‍⚕️'}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: role === r ? COLORS.primary : COLORS.gray, textTransform: 'capitalize' }}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Password</Text>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.lightGray, alignItems: 'center' }}>
            <TextInput
              style={{ flex: 1, padding: 14, fontSize: 16 }}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={{ padding: 14 }} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Confirm Password</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Create Account</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==================== APP ENTRY POINT ====================
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) setScreen('home');
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) setScreen('home');
      else setScreen('login');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('onboarding');
  };

  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('onboarding')} />;
  if (screen === 'onboarding') return <OnboardingScreen onDone={() => setScreen('login')} onLogin={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={(u) => { setUser(u); setScreen('home'); }} onRegister={() => setScreen('register')} />;
  if (screen === 'register') return <RegisterScreen onRegister={(u) => { setUser(u); setScreen('home'); }} onLogin={() => setScreen('login')} />;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
      <Text style={{ fontSize: 40 }}>🏥</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginTop: 16 }}>Welcome to MediConnect</Text>
      <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Loading your dashboard...</Text>
      <ActivityIndicator color={COLORS.white} style={{ marginTop: 24 }} />
    </View>
  );
}
