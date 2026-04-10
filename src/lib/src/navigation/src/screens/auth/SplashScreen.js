import React, { useEffect, useRef } from 'react';
import {
  View, Text, Animated, StatusBar
} from 'react-native';

export default function SplashScreen({ onDone }) {
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
      flex: 1,
      backgroundColor: '#2A9D8F',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <StatusBar barStyle="light-content" backgroundColor="#2A9D8F" />
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
          color: '#FFFFFF', letterSpacing: 1
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
      <View style={{ position: 'absolute', bottom: 50, alignItems: 'center' }}>
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
