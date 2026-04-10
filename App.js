import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator,
  Alert, Animated, Dimensions, StatusBar, Modal,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

// 🔐 SUPABASE - Replace with your new keys
const supabaseUrl = ''https://taaqzchrxbwqepshetnf.supabase.co;
const supabaseAnonKey = ''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYXF6Y2hyeGJ3cWVwc2hldG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzE2ODUsImV4cCI6MjA5MTQwNzY4NX0.Fi2Ve9IhPe8vfvNitdV_cMoLjQmF96NT98yDFpWidjI;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COLORS = {
  primary: '#2A9D8F',
  primaryDark: '#1B7A6E',
  primaryLight: '#E8F5F3',
  secondary: '#264653',
  accent: '#E76F51',
  admin: '#1B4332',
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

// ─────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────
function SplashScreen({ onDone }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 1000, useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 50, friction: 7, useNativeDriver: true
      }),
    ]).start();
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{
      flex: 1, backgroundColor: COLORS.primary,
      justifyContent: 'center', alignItems: 'center'
    }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View style={{
        alignItems: 'center',
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }}>
        <View style={{
          width: 100, height: 100, borderRadius: 25,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 20
        }}>
          <Text style={{ fontSize: 50 }}>🏥</Text>
        </View>
        <Text style={{
          fontSize: 36, fontWeight: 'bold',
          color: COLORS.white, letterSpacing: 1
        }}>
          MediConnect
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.8)',
          marginTop: 8
        }}>
          Your Health, Delivered
        </Text>
      </Animated.View>
      <View style={{
        position: 'absolute', bottom: 50, alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center', lineHeight: 22
        }}>
          Connecting you to healthcare,{'\n'}anytime, anywhere.
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────
function OnboardingScreen({ onDone, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const slides = [
    { id: '1', icon: '🔍', title: 'Find Top Doctors',
      description: 'Browse verified specialists across all medical fields worldwide.',
      color: COLORS.primary },
    { id: '2', icon: '📅', title: 'Book Appointments',
      description: 'Schedule in-person or video consultations. Fill a form, pay securely, done.',
      color: COLORS.secondary },
    { id: '3', icon: '💊', title: 'Medications Delivered',
      description: 'Order medications from verified pharmacies. Delivered fast to your door.',
      color: COLORS.primary },
    { id: '4', icon: '🛡️', title: 'Safe & Secure',
      description: 'All doctors and pharmacies are verified. Payments held safely until session completes.',
      color: COLORS.accent },
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
      <TouchableOpacity
        style={{
          position: 'absolute', top: 50,
          right: 20, zIndex: 10, padding: 10
        }}
        onPress={onDone}>
        <Text style={{ fontSize: 14, color: COLORS.gray, fontWeight: '500' }}>
          Skip
        </Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{
            width, flex: 1, alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40, paddingTop: 80
          }}>
            <View style={{
              width: 160, height: 160, borderRadius: 40,
              backgroundColor: item.color,
              justifyContent: 'center', alignItems: 'center',
              marginBottom: 40
            }}>
              <Text style={{ fontSize: 80 }}>{item.icon}</Text>
            </View>
            <Text style={{
              fontSize: 28, fontWeight: 'bold',
              color: COLORS.text, textAlign: 'center', marginBottom: 16
            }}>
              {item.title}
            </Text>
            <Text style={{
              fontSize: 16, color: COLORS.textLight,
              textAlign: 'center', lineHeight: 26
            }}>
              {item.description}
            </Text>
          </View>
        )}
      />
      <View style={{
        paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center'
      }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 32
        }}>
          {slides.map((_, index) => (
            <View key={index} style={{
              height: 8,
              width: currentIndex === index ? 24 : 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index
                ? COLORS.primary : COLORS.border,
              marginHorizontal: 4
            }} />
          ))}
        </View>
        <TouchableOpacity
          style={{
            width: '100%', backgroundColor: COLORS.primary,
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleNext}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.white
          }}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account?{' '}
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields'); return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      if (error) throw error;
      onLogin(data.user);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally { setLoading(false); }
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: 60, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)', marginBottom: 8
        }}>
          Welcome back 👋
        </Text>
        <Text style={{
          fontSize: 28, fontWeight: 'bold', color: COLORS.white
        }}>
          Log In to MediConnect
        </Text>
      </View>
      <View style={{ padding: 24, flex: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Email Address
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: COLORS.border,
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: COLORS.lightGray
            }}
            placeholder="Enter your email"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none"
          />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Password
          </Text>
          <View style={{
            flexDirection: 'row',
            borderWidth: 1, borderColor: COLORS.border,
            borderRadius: 12, backgroundColor: COLORS.lightGray,
            alignItems: 'center'
          }}>
            <TextInput
              style={{ flex: 1, padding: 14, fontSize: 16 }}
              placeholder="Enter your password"
              value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ padding: 14 }}
              onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: loading ? COLORS.gray : COLORS.primary,
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{
                fontSize: 16, fontWeight: 'bold', color: COLORS.white
              }}>Log In</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{
            fontSize: 14, color: COLORS.primary, fontWeight: '600'
          }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 24
        }}>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          <Text style={{ marginHorizontal: 16, color: COLORS.gray, fontSize: 14 }}>
            or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 2, borderColor: COLORS.primary,
            borderRadius: 16, paddingVertical: 16, alignItems: 'center'
          }}
          onPress={onRegister}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.primary
          }}>
            Create New Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
function RegisterScreen({ onRegister, onLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'patient', icon: '🙋', label: 'Patient' },
    { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
  ];

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields'); return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            is_verified: role === 'patient' ? true : false,
            verification_status: role === 'patient' ? 'approved' : 'pending',
          }
        }
      });
      if (error) throw error;
      if (role === 'patient') {
        Alert.alert('Success! 🎉',
          'Account created! Please check your email to verify.',
          [{ text: 'OK', onPress: onLogin }]);
      } else {
        Alert.alert('Application Submitted! 📋',
          `Your ${role} account is under review. Admin will verify within 24-48 hours.`,
          [{ text: 'OK', onPress: onLogin }]);
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally { setLoading(false); }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: 60, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)', marginBottom: 8
        }}>
          Join MediConnect 🏥
        </Text>
        <Text style={{
          fontSize: 28, fontWeight: 'bold', color: COLORS.white
        }}>
          Create Your Account
        </Text>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Full Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: COLORS.border,
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: COLORS.lightGray
            }}
            placeholder="Enter your full name"
            value={fullName} onChangeText={setFullName}
          />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Email Address
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: COLORS.border,
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: COLORS.lightGray
            }}
            placeholder="Enter your email"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none"
          />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            I am a
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={{
                  flex: 1, borderWidth: 2,
                  borderColor: role === r.id ? COLORS.primary : COLORS.border,
                  borderRadius: 12, paddingVertical: 12,
                  alignItems: 'center',
                  backgroundColor: role === r.id
                    ? COLORS.primaryLight : COLORS.white
                }}
                onPress={() => setRole(r.id)}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</Text>
                <Text style={{
                  fontSize: 12, fontWeight: '600',
                  color: role === r.id ? COLORS.primary : COLORS.gray
                }}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {role !== 'patient' && (
            <View style={{
              backgroundColor: '#FEF3C7',
              borderRadius: 10, padding: 12, marginTop: 12
            }}>
              <Text style={{
                fontSize: 13, color: '#92400E', lineHeight: 20
              }}>
                ⚠️ {role === 'doctor' ? 'Doctors' : 'Pharmacies'} must be
                verified by admin before accessing the platform.
              </Text>
            </View>
          )}
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Password
          </Text>
          <View style={{
            flexDirection: 'row',
            borderWidth: 1, borderColor: COLORS.border,
            borderRadius: 12, backgroundColor: COLORS.lightGray,
            alignItems: 'center'
          }}>
            <TextInput
              style={{ flex: 1, padding: 14, fontSize: 16 }}
              placeholder="Create a password"
              value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ padding: 14 }}
              onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18 }}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: COLORS.text, marginBottom: 8
          }}>
            Confirm Password
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: COLORS.border,
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: COLORS.lightGray
            }}
            placeholder="Confirm your password"
            value={confirmPassword} onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: loading ? COLORS.gray : COLORS.primary,
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={{
                fontSize: 16, fontWeight: 'bold', color: COLORS.white
              }}>Create Account</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: 'center' }} onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account?{' '}
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────
// PENDING VERIFICATION SCREEN
// ─────────────────────────────────────────
function PendingVerificationScreen({ role, onLogout }) {
  return (
    <View style={{
      flex: 1, backgroundColor: COLORS.background,
      justifyContent: 'center', alignItems: 'center', padding: 24
    }}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 60, marginBottom: 24 }}>⏳</Text>
      <Text style={{
        fontSize: 24, fontWeight: 'bold',
        color: COLORS.text, marginBottom: 12, textAlign: 'center'
      }}>
        Verification Pending
      </Text>
      <Text style={{
        fontSize: 15, color: COLORS.textLight,
        textAlign: 'center', lineHeight: 24, marginBottom: 32
      }}>
        Your {role} account is under review by our admin team.
        This usually takes 24-48 hours.
        You will be notified once approved.
      </Text>
      <View style={{
        backgroundColor: '#FEF3C7', borderRadius: 16,
        padding: 20, width: '100%', marginBottom: 32
      }}>
        <Text style={{
          fontSize: 14, fontWeight: 'bold',
          color: '#92400E', marginBottom: 12
        }}>
          📋 What happens next?
        </Text>
        {[
          '1. Admin reviews your application',
          '2. You may be contacted for documents',
          '3. Account approved or rejected',
          '4. You will be notified by email',
        ].map((item) => (
          <Text key={item} style={{
            fontSize: 13, color: '#92400E',
            marginBottom: 6, lineHeight: 20
          }}>
            {item}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.error, borderRadius: 16,
          paddingVertical: 14, paddingHorizontal: 32
        }}
        onPress={onLogout}>
        <Text style={{
          fontSize: 16, fontWeight: 'bold', color: COLORS.white
        }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────
// PATIENT DASHBOARD
// ─────────────────────────────────────────
function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}>
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          Good day 👋
        </Text>
        <Text style={{
          fontSize: 22, fontWeight: 'bold', color: COLORS.white
        }}>
          {user?.user_metadata?.full_name || 'Patient'}
        </Text>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👨‍⚕️', label: 'Find Doctor', tab: 'search' },
            { icon: '💊', label: 'Pharmacy', tab: 'pharmacy' },
            { icon: '📅', label: 'My Bookings', tab: 'bookings' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flex: 1, backgroundColor: COLORS.white,
                borderRadius: 16, padding: 16, alignItems: 'center',
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
              }}
              onPress={() => setActiveTab(item.tab)}>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{
                fontSize: 12, fontWeight: '600',
                color: COLORS.text, textAlign: 'center'
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{
          backgroundColor: COLORS.primary, borderRadius: 16,
          padding: 20, marginBottom: 24,
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16, fontWeight: 'bold',
              color: COLORS.white, marginBottom: 6
            }}>
              💊 Medications Delivered
            </Text>
            <Text style={{
              fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12
            }}>
              Get meds delivered in under 60 mins
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.white, borderRadius: 10,
                paddingVertical: 8, paddingHorizontal: 16,
                alignSelf: 'flex-start'
              }}
              onPress={() => setActiveTab('pharmacy')}>
              <Text style={{
                fontSize: 13, fontWeight: 'bold', color: COLORS.primary
              }}>
                Order Now
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 50 }}>🚚</Text>
        </View>
        <View style={{
          backgroundColor: COLORS.secondary, borderRadius: 16,
          padding: 20, marginBottom: 24
        }}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: COLORS.white, marginBottom: 16
          }}>
            How It Works
          </Text>
          {[
            { step: '1', icon: '🔍', title: 'Find a Doctor',
              desc: 'Browse by specialty or symptom' },
            { step: '2', icon: '📋', title: 'Fill Booking Form',
              desc: 'Tell us about your appointment' },
            { step: '3', icon: '💳', title: 'Pay Securely',
              desc: 'Payment held until session completes' },
            { step: '4', icon: '✅', title: 'Session Complete',
              desc: 'Payment released, leave a review' },
          ].map((item) => (
            <View key={item.step} style={{
              flexDirection: 'row', alignItems: 'center', marginBottom: 16
            }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: COLORS.primary,
                justifyContent: 'center', alignItems: 'center',
                marginRight: 12
              }}>
                <Text style={{
                  fontSize: 14, fontWeight: 'bold', color: COLORS.white
                }}>
                  {item.step}
                </Text>
              </View>
              <Text style={{ fontSize: 18, marginRight: 10 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14, fontWeight: '600', color: COLORS.white
                }}>
                  {item.title}
                </Text>
                <Text style={{
                  fontSize: 12, color: 'rgba(255,255,255,0.7)'
                }}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderComingSoon = (title, icon) => (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center', backgroundColor: COLORS.background
    }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{
        fontSize: 22, fontWeight: 'bold',
        color: COLORS.text, marginBottom: 8
      }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.textLight }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        backgroundColor: COLORS.primary,
        paddingTop: 50, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center'
      }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{
          fontSize: 22, fontWeight: 'bold',
          color: COLORS.white, marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Patient'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>🙋 Patient</Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2', borderRadius: 16,
            paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.error
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderComingSoon('Find Doctors', '🔍')}
        {activeTab === 'bookings' && renderComingSoon('My Bookings', '📅')}
        {activeTab === 'pharmacy' && renderComingSoon('Pharmacy', '💊')}
        {activeTab === 'profile' && renderProfile()}
      </View>
      <View style={{
        flexDirection: 'row', backgroundColor: COLORS.white,
        borderTopWidth: 1, borderTopColor: COLORS.border,
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12, elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0, height: 3,
              backgroundColor: COLORS.primary,
              borderRadius: 2, marginBottom: 6
            }} />
            <Text style={{
              fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? COLORS.primary : COLORS.gray
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// DOCTOR DASHBOARD
// ─────────────────────────────────────────
function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}>
      <View style={{
        backgroundColor: COLORS.secondary,
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
              Welcome back 👋
            </Text>
            <Text style={{
              fontSize: 22, fontWeight: 'bold', color: COLORS.white
            }}>
              {user?.user_metadata?.full_name || 'Doctor'}
            </Text>
          </View>
          <View style={{
            backgroundColor: COLORS.primary, borderRadius: 12,
            paddingHorizontal: 12, paddingVertical: 6
          }}>
            <Text style={{
              fontSize: 12, fontWeight: 'bold', color: COLORS.white
            }}>
              ✅ Verified
            </Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📅', label: 'Today', value: '0' },
            { icon: '👥', label: 'Patients', value: '0' },
            { icon: '💰', label: 'Earnings', value: '$0' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: COLORS.white,
              borderRadius: 16, padding: 16, alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
            }}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{
                fontSize: 20, fontWeight: 'bold', color: COLORS.secondary
              }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        <View style={{
          backgroundColor: COLORS.white, borderRadius: 16,
          padding: 40, alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
        }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
          <Text style={{ fontSize: 15, color: COLORS.textLight }}>
            No appointments yet
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderComingSoon = (title, icon) => (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center', backgroundColor: COLORS.background
    }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{
        fontSize: 22, fontWeight: 'bold',
        color: COLORS.text, marginBottom: 8
      }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.textLight }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        backgroundColor: COLORS.secondary,
        paddingTop: 50, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center'
      }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 40 }}>👨‍⚕️</Text>
        </View>
        <Text style={{
          fontSize: 22, fontWeight: 'bold',
          color: COLORS.white, marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Doctor'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: COLORS.primary,
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>
            ✅ Verified Doctor
          </Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2', borderRadius: 16,
            paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.error
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'appointments' && renderComingSoon('Appointments', '📅')}
        {activeTab === 'patients' && renderComingSoon('My Patients', '👥')}
        {activeTab === 'earnings' && renderComingSoon('Earnings', '💰')}
        {activeTab === 'profile' && renderProfile()}
      </View>
      <View style={{
        flexDirection: 'row', backgroundColor: COLORS.white,
        borderTopWidth: 1, borderTopColor: COLORS.border,
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12, elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0, height: 3,
              backgroundColor: COLORS.secondary,
              borderRadius: 2, marginBottom: 6
            }} />
            <Text style={{
              fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? COLORS.secondary : COLORS.gray
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// PHARMACY DASHBOARD
// ─────────────────────────────────────────
function PharmacyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}>
      <View style={{
        backgroundColor: COLORS.accent,
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
              Welcome back 👋
            </Text>
            <Text style={{
              fontSize: 22, fontWeight: 'bold', color: COLORS.white
            }}>
              {user?.user_metadata?.full_name || 'Pharmacy'}
            </Text>
          </View>
          <View style={{
            backgroundColor: COLORS.primary, borderRadius: 12,
            paddingHorizontal: 12, paddingVertical: 6
          }}>
            <Text style={{
              fontSize: 12, fontWeight: 'bold', color: COLORS.white
            }}>
              ✅ Verified
            </Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📦', label: 'Orders', value: '0' },
            { icon: '⏳', label: 'Pending', value: '0' },
            { icon: '💰', label: 'Earnings', value: '$0' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: COLORS.white,
              borderRadius: 16, padding: 16, alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
            }}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{
                fontSize: 20, fontWeight: 'bold', color: COLORS.accent
              }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        <View style={{
          backgroundColor: COLORS.white, borderRadius: 16,
          padding: 40, alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
        }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
          <Text style={{ fontSize: 15, color: COLORS.textLight }}>
            No pending orders
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderComingSoon = (title, icon) => (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center', backgroundColor: COLORS.background
    }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{
        fontSize: 22, fontWeight: 'bold',
        color: COLORS.text, marginBottom: 8
      }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.textLight }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        backgroundColor: COLORS.accent,
        paddingTop: 50, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center'
      }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 40 }}>🏪</Text>
        </View>
        <Text style={{
          fontSize: 22, fontWeight: 'bold',
          color: COLORS.white, marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Pharmacy'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: COLORS.primary,
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>
            ✅ Verified Pharmacy
          </Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2', borderRadius: 16,
            paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.error
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.accent} />
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'orders' && renderComingSoon('Orders', '📦')}
        {activeTab === 'inventory' && renderComingSoon('Inventory', '💊')}
        {activeTab === 'earnings' && renderComingSoon('Earnings', '💰')}
        {activeTab === 'profile' && renderProfile()}
      </View>
      <View style={{
        flexDirection: 'row', backgroundColor: COLORS.white,
        borderTopWidth: 1, borderTopColor: COLORS.border,
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12, elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0, height: 3,
              backgroundColor: COLORS.accent,
              borderRadius: 2, marginBottom: 6
            }} />
            <Text style={{
              fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? COLORS.accent : COLORS.gray
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'verify', icon: '✅', label: 'Verify' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  useEffect(() => {
    if (activeTab === 'verify') fetchPending();
  }, [activeTab]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_status', 'pending');
      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.log(error.message);
    } finally { setLoading(false); }
  };

  const handleVerify = async (userId, action) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: action,
          is_verified: action === 'approved'
        })
        .eq('id', userId);
      if (error) throw error;
      Alert.alert('Done! ✅', `User has been ${action}.`);
      fetchPending();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}>
      <View style={{
        backgroundColor: COLORS.admin,
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          Admin Panel 🔐
        </Text>
        <Text style={{
          fontSize: 22, fontWeight: 'bold', color: COLORS.white
        }}>
          {user?.user_metadata?.full_name || 'Admin'}
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
          MediConnect Founder & Admin
        </Text>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👥', label: 'Total Users', value: '0' },
            { icon: '⏳', label: 'Pending', value: '0' },
            { icon: '💰', label: 'Revenue', value: '$0' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: COLORS.white,
              borderRadius: 16, padding: 16, alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
            }}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{
                fontSize: 20, fontWeight: 'bold', color: COLORS.admin
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontSize: 11, color: COLORS.textLight, textAlign: 'center'
              }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: COLORS.text, marginBottom: 16
        }}>
          Admin Actions
        </Text>
        <View style={{
          flexDirection: 'row', flexWrap: 'wrap',
          gap: 12, marginBottom: 24
        }}>
          {[
            { icon: '✅', label: 'Verify Users', tab: 'verify' },
            { icon: '👥', label: 'All Users', tab: 'users' },
            { icon: '💰', label: 'Payments', tab: 'payments' },
            { icon: '📊', label: 'Reports', tab: 'home' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{
                width: '47%', backgroundColor: COLORS.white,
                borderRadius: 16, padding: 20, alignItems: 'center',
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
              }}
              onPress={() => setActiveTab(item.tab)}>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{
                fontSize: 13, fontWeight: '600',
                color: COLORS.text, textAlign: 'center'
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: COLORS.text, marginBottom: 16
        }}>
          View Dashboards
        </Text>
        <View style={{
          backgroundColor: COLORS.white, borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
        }}>
          {[
            { icon: '🙋', label: 'Patient Dashboard', color: COLORS.primary },
            { icon: '👨‍⚕️', label: 'Doctor Dashboard', color: COLORS.secondary },
            { icon: '🏪', label: 'Pharmacy Dashboard', color: COLORS.accent },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: 'row', alignItems: 'center', padding: 16,
                borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.border
              }}>
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: item.color + '20',
                justifyContent: 'center', alignItems: 'center',
                marginRight: 14
              }}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <Text style={{
                flex: 1, fontSize: 15,
                fontWeight: '600', color: COLORS.text
              }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 16, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderVerify = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}>
      <View style={{
        backgroundColor: COLORS.admin,
        paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24
      }}>
        <Text style={{
          fontSize: 24, fontWeight: 'bold', color: COLORS.white
        }}>
          Verify Users ✅
        </Text>
        <Text style={{
          fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4
        }}>
          Approve or reject pending applications
        </Text>
      </View>
      <View style={{ padding: 24 }}>
        {loading ? (
          <ActivityIndicator
            size="large" color={COLORS.admin}
            style={{ marginTop: 40 }}
          />
        ) : pendingUsers.length === 0 ? (
          <View style={{
            backgroundColor: COLORS.white, borderRadius: 16,
            padding: 40, alignItems: 'center'
          }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>✅</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight }}>
              No pending applications
            </Text>
          </View>
        ) : (
          pendingUsers.map((u) => (
            <View key={u.id} style={{
              backgroundColor: COLORS.white, borderRadius: 16,
              padding: 16, marginBottom: 12,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
            }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', marginBottom: 12
              }}>
                <View style={{
                  width: 50, height: 50, borderRadius: 25,
                  backgroundColor: COLORS.primaryLight,
                  justifyContent: 'center', alignItems: 'center',
                  marginRight: 12
                }}>
                  <Text style={{ fontSize: 24 }}>
                    {u.role === 'doctor' ? '👨‍⚕️' : '🏪'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16, fontWeight: 'bold', color: COLORS.text
                  }}>
                    {u.full_name}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>
                    {u.email}
                  </Text>
                  <View style={{
                    backgroundColor: '#FEF3C7', borderRadius: 6,
                    paddingHorizontal: 8, paddingVertical: 2,
                    alignSelf: 'flex-start', marginTop: 4
                  }}>
                    <Text style={{
                      fontSize: 11, color: '#92400E', textTransform: 'capitalize'
                    }}>
                      {u.role}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1, backgroundColor: '#D1FAE5',
                    borderRadius: 12, paddingVertical: 12,
                    alignItems: 'center'
                  }}
                  onPress={() => handleVerify(u.id, 'approved')}>
                  <Text style={{
                    fontSize: 14, fontWeight: 'bold', color: '#065F46'
                  }}>
                    ✅ Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1, backgroundColor: '#FEE2E2',
                    borderRadius: 12, paddingVertical: 12,
                    alignItems: 'center'
                  }}
                  onPress={() => handleVerify(u.id, 'rejected')}>
                  <Text style={{
                    fontSize: 14, fontWeight: 'bold', color: '#991B1B'
                  }}>
                    ❌ Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderComingSoon = (title, icon) => (
    <View style={{
      flex: 1, justifyContent: 'center',
      alignItems: 'center', backgroundColor: COLORS.background
    }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{
        fontSize: 22, fontWeight: 'bold',
        color: COLORS.text, marginBottom: 8
      }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.textLight }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        backgroundColor: COLORS.admin,
        paddingTop: 50, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center'
      }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 40 }}>🔐</Text>
        </View>
        <Text style={{
          fontSize: 22, fontWeight: 'bold',
          color: COLORS.white, marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Admin'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: COLORS.primary,
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>
            🔐 Founder & Admin
          </Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2', borderRadius: 16,
            paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: COLORS.error
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.admin} />
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'verify' && renderVerify()}
        {activeTab === 'users' && renderComingSoon('All Users', '👥')}
        {activeTab === 'payments' && renderComingSoon('Payments', '💰')}
        {activeTab === 'profile' && renderProfile()}
      </View>
      <View style={{
        flexDirection: 'row', backgroundColor: COLORS.white,
        borderTopWidth: 1, borderTopColor: COLORS.border,
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12, elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0, height: 3,
              backgroundColor: COLORS.admin,
              borderRadius: 2, marginBottom: 6
            }} />
            <Text style={{
              fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? COLORS.admin : COLORS.gray
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) setScreen('main');
      else setScreen('splash');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session) setScreen('main');
        else setScreen('onboarding');
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen('onboarding');
  };

  const renderDashboard = () => {
    const role = user?.user_metadata?.role;
    const status = user?.user_metadata?.verification_status;

    if (role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }
    if (role === 'doctor') {
      if (status === 'pending' || status === 'rejected') {
        return (
          <PendingVerificationScreen
            role="doctor"
            onLogout={handleLogout}
          />
        );
      }
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
    if (role === 'pharmacy') {
      if (status === 'pending' || status === 'rejected') {
        return (
          <PendingVerificationScreen
            role="pharmacy"
            onLogout={handleLogout}
          />
        );
      }
      return <PharmacyDashboard user={user} onLogout={handleLogout} />;
    }
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  };

  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('onboarding')} />;
  if (screen === 'onboarding') return (
    <OnboardingScreen
      onDone={() => setScreen('login')}
      onLogin={() => setScreen('login')}
    />
  );
  if (screen === 'login') return (
    <LoginScreen
      onLogin={(u) => { setUser(u); setScreen('main'); }}
      onRegister={() => setScreen('register')}
    />
  );
  if (screen === 'register') return (
    <RegisterScreen
      onRegister={() => setScreen('login')}
      onLogin={() => setScreen('login')}
    />
  );
  if (screen === 'main') return renderDashboard();
  return null;
}
