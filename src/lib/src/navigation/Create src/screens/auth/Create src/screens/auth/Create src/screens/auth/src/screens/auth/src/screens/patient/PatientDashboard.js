import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StatusBar
} from 'react-native';

export default function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'appointments', icon: '📅', label: 'Bookings' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      showsVerticalScrollIndicator={false}>

      <View style={{
        backgroundColor: '#2A9D8F',
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)'
        }}>
          Good day 👋
        </Text>
        <Text style={{
          fontSize: 22, fontWeight: 'bold', color: '#FFFFFF'
        }}>
          {user?.user_metadata?.full_name || 'Patient'}
        </Text>
      </View>

      <View style={{ padding: 24 }}>

        {/* Quick Actions */}
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 16
        }}>
          What do you need?
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👨‍⚕️', label: 'Find Doctor', tab: 'search' },
            { icon: '💊', label: 'Pharmacy', tab: 'pharmacy' },
            { icon: '📅', label: 'My Bookings', tab: 'appointments' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flex: 1, backgroundColor: '#FFFFFF',
                borderRadius: 16, padding: 16,
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
                fontSize: 12, fontWeight: '600', color: '#1F2937',
                textAlign: 'center'
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Tips Banner */}
        <View style={{
          backgroundColor: '#2A9D8F', borderRadius: 16,
          padding: 20, marginBottom: 24
        }}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: '#FFFFFF', marginBottom: 6
          }}>
            🚚 Medications Delivered
          </Text>
          <Text style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 12
          }}>
            Get meds delivered in under 60 mins
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 10,
              paddingVertical: 8, paddingHorizontal: 16,
              alignSelf: 'flex-start'
            }}
            onPress={() => setActiveTab('pharmacy')}>
            <Text style={{
              fontSize: 13, fontWeight: 'bold', color: '#2A9D8F'
            }}>
              Order Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={{
          backgroundColor: '#264653', borderRadius: 16,
          padding: 20, marginBottom: 24
        }}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: '#FFFFFF', marginBottom: 16
          }}>
            How It Works
          </Text>
          {[
            { step: '1', icon: '🔍', title: 'Find a Doctor', desc: 'Browse by specialty or symptom' },
            { step: '2', icon: '📋', title: 'Fill Booking Form', desc: 'Tell us why you need the appointment' },
            { step: '3', icon: '💳', title: 'Pay Securely', desc: 'Payment held until session completes' },
            { step: '4', icon: '✅', title: 'Session Complete', desc: 'Payment released, leave a review' },
          ].map((item) => (
            <View key={item.step} style={{
              flexDirection: 'row',
              alignItems: 'center', marginBottom: 16
            }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: '#2A9D8F',
                justifyContent: 'center', alignItems: 'center',
                marginRight: 12
              }}>
                <Text style={{
                  fontSize: 14, fontWeight: 'bold', color: '#FFFFFF'
                }}>
                  {item.step}
                </Text>
              </View>
              <Text style={{ fontSize: 18, marginRight: 10 }}>
                {item.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14, fontWeight: '600', color: '#FFFFFF'
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
      alignItems: 'center', backgroundColor: '#F9FAFB'
    }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{
        fontSize: 22, fontWeight: 'bold',
        color: '#1F2937', marginBottom: 8
      }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{
        backgroundColor: '#2A9D8F',
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
          color: '#FFFFFF', marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Patient'}
        </Text>
        <Text style={{
          fontSize: 14, color: 'rgba(255,255,255,0.8)'
        }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: '#FFFFFF' }}>
            🙋 Patient
          </Text>
        </View>
      </View>

      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2', borderRadius: 16,
            paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center',
            gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: '#EF4444'
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2A9D8F" />

      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderComingSoon('Find Doctors', '🔍')}
        {activeTab === 'appointments' && renderComingSoon('My Bookings', '📅')}
        {activeTab === 'pharmacy' && renderComingSoon('Pharmacy', '💊')}
        {activeTab === 'profile' && renderProfile()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={{
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12, elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0,
              height: 3, backgroundColor: '#2A9D8F',
              borderRadius: 2, marginBottom: 6
            }} />
            <Text style={{
              fontSize: activeTab === tab.id ? 24 : 22,
              marginBottom: 2
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? '#2A9D8F' : '#6B7280'
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
