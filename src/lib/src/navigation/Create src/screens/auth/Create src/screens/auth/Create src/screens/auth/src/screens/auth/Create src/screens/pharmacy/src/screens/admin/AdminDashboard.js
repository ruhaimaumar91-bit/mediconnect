import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StatusBar, ActivityIndicator,
  Alert
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'verify', icon: '✅', label: 'Verify' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  useEffect(() => {
    if (activeTab === 'verify') {
      fetchPending();
    }
  }, [activeTab]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_status', 'pending');
      if (error) throw error;
      const doctors = data?.filter(u => u.role === 'doctor') || [];
      const pharmacies = data?.filter(u => u.role === 'pharmacy') || [];
      setPendingDoctors(doctors);
      setPendingPharmacies(pharmacies);
    } catch (error) {
      console.log('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
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
      Alert.alert(
        'Done! ✅',
        `User has been ${action}.`
      );
      fetchPending();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      showsVerticalScrollIndicator={false}>

      <View style={{
        backgroundColor: '#1B4332',
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)'
        }}>
          Admin Panel 🔐
        </Text>
        <Text style={{
          fontSize: 22, fontWeight: 'bold',
          color: '#FFFFFF'
        }}>
          {user?.user_metadata?.full_name || 'Admin'}
        </Text>
        <Text style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          marginTop: 4
        }}>
          MediConnect Founder & Admin
        </Text>
      </View>

      <View style={{ padding: 24 }}>

        {/* Admin Stats */}
        <View style={{
          flexDirection: 'row', gap: 12, marginBottom: 24
        }}>
          {[
            { icon: '👥', label: 'Total Users', value: '0' },
            { icon: '⏳', label: 'Pending', value: '0' },
            { icon: '💰', label: 'Revenue', value: '$0' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: '#FFFFFF',
              borderRadius: 16, padding: 16,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8, elevation: 2
            }}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>
                {stat.icon}
              </Text>
              <Text style={{
                fontSize: 20, fontWeight: 'bold',
                color: '#1B4332'
              }}>
                {stat.value}
              </Text>
              <Text style={{
                fontSize: 11, color: '#6B7280',
                textAlign: 'center'
              }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 16
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
                width: '47%',
                backgroundColor: '#FFFFFF',
                borderRadius: 16, padding: 20,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8, elevation: 2
              }}
              onPress={() => setActiveTab(item.tab)}>
              <Text style={{ fontSize: 30, marginBottom: 8 }}>
                {item.icon}
              </Text>
              <Text style={{
                fontSize: 13, fontWeight: '600',
                color: '#1F2937', textAlign: 'center'
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View Dashboards */}
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 16
        }}>
          View Dashboards
        </Text>
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8, elevation: 2,
          marginBottom: 24
        }}>
          {[
            { icon: '🙋', label: 'Patient Dashboard', color: '#2A9D8F' },
            { icon: '👨‍⚕️', label: 'Doctor Dashboard', color: '#264653' },
            { icon: '🏪', label: 'Pharmacy Dashboard', color: '#E76F51' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                borderBottomColor: '#E5E7EB'
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
                fontWeight: '600', color: '#1F2937'
              }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 16, color: '#6B7280' }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </ScrollView>
  );

  const renderVerify = () => (
    <ScrollView
      style={{ flex:​​​​​​​​​​​​​​​​
