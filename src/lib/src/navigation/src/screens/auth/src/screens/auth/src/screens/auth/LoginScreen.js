import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, StatusBar
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen({ onLogin, onRegister }) {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      if (error) throw error;
      onLogin(data.user);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
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
          Welcome back 👋
        </Text>
        <Text style={{
          fontSize: 28, fontWeight: 'bold', color: '#FFFFFF'
        }}>
          Log In to MediConnect
        </Text>
      </View>

      <View style={{ padding: 24, flex: 1 }}>

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

        <View style={{ marginBottom: 24 }}>
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
              placeholder="Enter your password"
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

        <TouchableOpacity
          style={{
            backgroundColor: loading ? '#6B7280' : '#2A9D8F',
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleLogin}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={{
                fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'
              }}>Log In</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{
            fontSize: 14, color: '#2A9D8F', fontWeight: '600'
          }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View style={{
          flexDirection: 'row', alignItems: 'center', marginBottom: 24
        }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          <Text style={{ marginHorizontal: 16, color: '#6B7280', fontSize: 14 }}>
            or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
        </View>

        <TouchableOpacity
          style={{
            borderWidth: 2, borderColor: '#2A9D8F',
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center'
          }}
          onPress={onRegister}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: '#2A9D8F'
          }}>
            Create New Account
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
