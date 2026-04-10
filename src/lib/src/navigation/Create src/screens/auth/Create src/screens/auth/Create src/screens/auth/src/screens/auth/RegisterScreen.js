import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, StatusBar
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen({ onRegister, onLogin }) {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            // Doctors and pharmacies start unverified
            is_verified: role === 'patient' ? true : false,
            verification_status: role === 'patient'
              ? 'approved'
              : 'pending',
          }
        }
      });
      if (error) throw error;

      if (role === 'patient') {
        Alert.alert(
          'Success! 🎉',
          'Account created! Please check your email to verify.',
          [{ text: 'OK', onPress: onLogin }]
        );
      } else {
        Alert.alert(
          'Application Submitted! 📋',
          `Your ${role} account is under review. Our admin team will verify your credentials within 24-48 hours. You will be notified once approved.`,
          [{ text: 'OK', onPress: onLogin }]
        );
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#2A9D8F" />

      <View style={{
        backgroundColor: '#2A9D8F',
        paddingTop: 60, paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: 8
        }}>
          Join MediConnect 🏥
        </Text>
        <Text style={{
          fontSize: 28, fontWeight: 'bold', color: '#FFFFFF'
        }}>
          Create Your Account
        </Text>
      </View>

      <View style={{ padding: 24 }}>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: '#1F2937', marginBottom: 8
          }}>
            Full Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: '#E5E7EB',
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: '#F3F4F6'
            }}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: '#1F2937', marginBottom: 8
          }}>
            Email Address
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: '#E5E7EB',
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: '#F3F4F6'
            }}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: '#1F2937', marginBottom: 8
          }}>
            I am a
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: role === r.id ? '#2A9D8F' : '#E5E7EB',
                  borderRadius: 12, paddingVertical: 12,
                  alignItems: 'center',
                  backgroundColor: role === r.id ? '#E8F5F3' : '#FFFFFF'
                }}
                onPress={() => setRole(r.id)}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                  {r.icon}
                </Text>
                <Text style={{
                  fontSize: 12, fontWeight: '600',
                  color: role === r.id ? '#2A9D8F' : '#6B7280'
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
              <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>
                ⚠️ {role === 'doctor' ? 'Doctors' : 'Pharmacies'} must be
                verified by our admin team before accessing the platform.
                You will need to submit your credentials after registration.
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600',
            color: '#1F2937', marginBottom: 8
          }}>
            Password
          </Text>
          <View style={{
            flexDirection: 'row',
            borderWidth: 1, borderColor: '#E5E7EB',
            borderRadius: 12, backgroundColor: '#F3F4F6',
            alignItems: 'center'
          }}>
            <TextInput
              style={{ flex: 1, padding: 14, fontSize: 16 }}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
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
            color: '#1F2937', marginBottom: 8
          }}>
            Confirm Password
          </Text>
          <TextInput
            style={{
              borderWidth: 1, borderColor: '#E5E7EB',
              borderRadius: 12, padding: 14,
              fontSize: 16, backgroundColor: '#F3F4F6'
            }}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: loading ? '#6B7280' : '#2A9D8F',
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleRegister}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={{
                fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'
              }}>
                Create Account
              </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={onLogin}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            Already have an account?{' '}
            <Text style={{ color: '#2A9D8F', fontWeight: 'bold' }}>
              Log In
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
