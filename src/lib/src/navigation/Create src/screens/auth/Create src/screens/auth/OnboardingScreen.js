import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StatusBar, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1', icon: '🔍',
    title: 'Find Top Doctors',
    description: 'Browse specialists across all medical fields. Filter by specialty, location, language, and availability.',
    color: '#2A9D8F'
  },
  {
    id: '2', icon: '📅',
    title: 'Book Appointments',
    description: 'Schedule in-person or video consultations with ease. Get instant confirmation and reminders.',
    color: '#264653'
  },
  {
    id: '3', icon: '💊',
    title: 'Medications Delivered',
    description: 'Order prescription and over-the-counter medications from trusted pharmacies. Delivered fast.',
    color: '#2A9D8F'
  },
  {
    id: '4', icon: '🛡️',
    title: 'Your Health, Safe',
    description: 'All doctors are verified professionals. Your health data is protected with enterprise-grade security.',
    color: '#E76F51'
  },
];

export default function OnboardingScreen({ onDone, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onDone();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={{
          position: 'absolute', top: 50,
          right: 20, zIndex: 10, padding: 10
        }}
        onPress={onDone}>
        <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>
          Skip
        </Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(
            Math.round(e.nativeEvent.contentOffset.x / width)
          )
        }
        renderItem={({ item }) => (
          <View style={{
            width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
            paddingTop: 80
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
              color: '#1F2937', textAlign: 'center',
              marginBottom: 16
            }}>
              {item.title}
            </Text>
            <Text style={{
              fontSize: 16, color: '#6B7280',
              textAlign: 'center', lineHeight: 26
            }}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={{
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 32
        }}>
          {slides.map((_, index) => (
            <View key={index} style={{
              height: 8,
              width: currentIndex === index ? 24 : 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index
                ? '#2A9D8F' : '#E5E7EB',
              marginHorizontal: 4
            }} />
          ))}
        </View>

        <TouchableOpacity
          style={{
            width: '100%', backgroundColor: '#2A9D8F',
            borderRadius: 16, paddingVertical: 16,
            alignItems: 'center', marginBottom: 16
          }}
          onPress={handleNext}>
          <Text style={{
            fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'
          }}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogin}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            Already have an account?{' '}
            <Text style={{ color: '#2A9D8F', fontWeight: 'bold' }}>
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
