import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, StatusBar
} from 'react-native';

export default function PharmacyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const verificationStatus = user?.user_metadata?.verification_status;

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  // Pending verification screen
  if (verificationStatus === 'pending') {
    return (
      <View style={{
        flex: 1, backgroundColor: '#F9FAFB',
        justifyContent: 'center', alignItems: 'center',
        padding: 24
      }}>
        <StatusBar barStyle="dark-content" />
        <Text style={{ fontSize: 60, marginBottom: 24 }}>⏳</Text>
        <Text style={{
          fontSize: 24, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 12,
          textAlign: 'center'
        }}>
          Verification Pending
        </Text>
        <Text style={{
          fontSize: 15, color: '#6B7280',
          textAlign: 'center', lineHeight: 24,
          marginBottom: 32
        }}>
          Your pharmacy account is under review
          by our admin team. This usually takes
          24-48 hours. You will be notified once approved.
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
            '1. Admin reviews your pharmacy license',
            '2. You may be contacted for documents',
            '3. Account approved or rejected',
            '4. Email notification sent to you',
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
            backgroundColor: '#EF4444', borderRadius: 16,
            paddingVertical: 14, paddingHorizontal: 32
          }}
          onPress={onLogout}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: '#FFFFFF'
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Rejected screen
  if (verificationStatus === 'rejected') {
    return (
      <View style={{
        flex: 1, backgroundColor: '#F9FAFB',
        justifyContent: 'center', alignItems: 'center',
        padding: 24
      }}>
        <Text style={{ fontSize: 60, marginBottom: 24 }}>❌</Text>
        <Text style={{
          fontSize: 24, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 12,
          textAlign: 'center'
        }}>
          Application Rejected
        </Text>
        <Text style={{
          fontSize: 15, color: '#6B7280',
          textAlign: 'center', lineHeight: 24,
          marginBottom: 32
        }}>
          Unfortunately your application was not approved.
          Please contact our support team for more information.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#EF4444', borderRadius: 16,
            paddingVertical: 14, paddingHorizontal: 32
          }}
          onPress={onLogout}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: '#FFFFFF'
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHome = () => (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      showsVerticalScrollIndicator={false}>

      <View style={{
        backgroundColor: '#E76F51',
        paddingTop: 50, paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)'
            }}>
              Welcome back 👋
            </Text>
            <Text style={{
              fontSize: 22, fontWeight: 'bold',
              color: '#FFFFFF'
            }}>
              {user?.user_metadata?.full_name || 'Pharmacy'}
            </Text>
          </View>
          <View style={{
            backgroundColor: '#2A9D8F',
            borderRadius: 12,
            paddingHorizontal: 12, paddingVertical: 6
          }}>
            <Text style={{
              fontSize: 12, fontWeight: 'bold',
              color: '#FFFFFF'
            }}>
              ✅ Verified
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 24 }}>

        {/* Stats */}
        <View style={{
          flexDirection: 'row', gap: 12, marginBottom: 24
        }}>
          {[
            { icon: '📦', label: 'Orders', value: '0' },
            { icon: '⏳', label: 'Pending', value: '0' },
            { icon: '💰', label: 'Earnings', value: '$0' },
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
                color: '#E76F51'
              }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: '#6B7280' }}>
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
          Quick Actions
        </Text>
        <View style={{
          flexDirection: 'row', gap: 12, marginBottom: 24
        }}>
          {[
            { icon: '📦', label: 'Orders', tab: 'orders' },
            { icon: '💊', label: 'Inventory', tab: 'inventory' },
            { icon: '💰', label: 'Earnings', tab: 'earnings' },
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
                fontSize: 12, fontWeight: '600',
                color: '#1F2937', textAlign: 'center'
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pending Orders */}
        <Text style={{
          fontSize: 18, fontWeight: 'bold',
          color: '#1F2937', marginBottom: 16
        }}>
          Pending Orders
        </Text>
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 16,
          padding: 40, alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8, elevation: 2
        }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
          <Text style={{ fontSize: 15, color: '#6B7280' }}>
            No pending orders
          </Text>
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
      <Text style={{ fontSize: 14, color: '#6B7280' }}>
        Coming in next update
      </Text>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{
        backgroundColor: '#E76F51',
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
          color: '#FFFFFF', marginBottom: 4
        }}>
          {user?.user_metadata?.full_name || 'Pharmacy'}
        </Text>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)'
        }}>
          {user?.email}
        </Text>
        <View style={{
          backgroundColor: '#2A9D8F',
          borderRadius: 20, paddingHorizontal: 16,
          paddingVertical: 6, marginTop: 8
        }}>
          <Text style={{ fontSize: 13, color: '#FFFFFF' }}>
            ✅ Verified Pharmacy
          </Text>
        </View>
      </View>

      <View style={{ padding: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FEE2E2',
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', flexDirection: 'row',
            justifyContent: 'center', gap: 8
          }}
          onPress={onLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{
            fontSize: 16, fontWeight: 'bold',
            color: '#EF4444'
          }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#E76F51" />

      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'orders' && renderComingSoon('Orders', '📦')}
        {activeTab === 'inventory' && renderComingSoon('Inventory', '💊')}
        {activeTab === 'earnings' && renderComingSoon('Earnings', '💰')}
        {activeTab === 'profile' && renderProfile()}
      </View>

      <View style={{
        flexDirection: 'row', backgroundColor: '#FFFFFF',
        borderTopWidth: 1, borderTopColor: '#E5E7EB',
        paddingBottom: 24, paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06, shadowRadius: 12,
        elevation: 10
      }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => setActiveTab(tab.id)}>
            <View style={{
              width: activeTab === tab.id ? 36 : 0,
              height: 3, backgroundColor: '#E76F51',
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
              color: activeTab === tab.id ? '#E76F51' : '#6B7280'
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
