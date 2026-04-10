import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, FlatList, ActivityIndicator, Alert,
  Animated, Dimensions, StatusBar, Modal,
  KeyboardAvoidingView, Platform, Switch,
  RefreshControl, Linking,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE
// ============================================
const supabaseUrl = 'https://lvqxyfbihvozbtjjeuzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cXh5ZmJpaHZvemJ0ampldXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjgxMjcsImV4cCI6MjA5MTMwNDEyN30.Re1KvgH1pGFsiC9qiaJnBOxlnZNHRv5xN1NPvjyIpes';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { width, height } = Dimensions.get('window');

// ============================================
// COLORS
// ============================================
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
  adminColor: '#7C3AED',
  doctorColor: '#2563EB',
  pharmacyColor: '#059669',
  patientColor: '#2A9D8F',
};

// ============================================
// CONSTANTS
// ============================================
const SPECIALTIES = [
  { id: '1', name: 'Cardiology', icon: '❤️', color: '#FEE2E2' },
  { id: '2', name: 'Neurology', icon: '🧠', color: '#EDE9FE' },
  { id: '3', name: 'Ophthalmology', icon: '👁️', color: '#DBEAFE' },
  { id: '4', name: 'Pediatrics', icon: '👶', color: '#FCE7F3' },
  { id: '5', name: 'Orthopedics', icon: '🦴', color: '#FEF3C7' },
  { id: '6', name: 'General Practice', icon: '🩺', color: '#D1FAE5' },
  { id: '7', name: 'Dermatology', icon: '🧴', color: '#CCFBF1' },
  { id: '8', name: 'Psychiatry', icon: '🧘', color: '#E0E7FF' },
  { id: '9', name: 'Gynecology', icon: '🌸', color: '#FCE7F3' },
  { id: '10', name: 'Emergency Medicine', icon: '🚨', color: '#FEE2E2' },
  { id: '11', name: 'Surgery', icon: '🔬', color: '#F0FDF4' },
  { id: '12', name: 'Internal Medicine', icon: '💊', color: '#FEF3C7' },
];

const PAYMENT_METHODS = [
  { id: '1', type: 'visa', label: 'Visa', icon: '💳', color: '#1A1F71' },
  { id: '2', type: 'mastercard', label: 'Mastercard', icon: '💳', color: '#EB001B' },
  { id: '3', type: 'amex', label: 'Amex', icon: '💳', color: '#2E77BC' },
  { id: '4', type: 'applepay', label: 'Apple Pay', icon: '🍎', color: '#000000' },
  { id: '5', type: 'googlepay', label: 'Google Pay', icon: '🔵', color: '#4285F4' },
  { id: '6', type: 'paypal', label: 'PayPal', icon: '🅿️', color: '#003087' },
];

const SESSION_DURATIONS = [15, 30, 45, 60, 90, 120];

// ============================================
// APP CONTEXT
// ============================================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ============================================
// SHARED COMPONENTS
// ============================================
function Button({ label, onPress, color, textColor, loading, icon, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[{
        backgroundColor: loading ? COLORS.gray : (color || COLORS.primary),
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
      }, style]}
    >
      {loading
        ? <ActivityIndicator color={COLORS.white} />
        : <>
            {icon && <Text style={{ fontSize: 18 }}>{icon}</Text>}
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor || COLORS.white }}>
              {label}
            </Text>
          </>
      }
    </TouchableOpacity>
  );
}

function Input({ label, value, onChangeText, placeholder, secure, keyboard, multiline, icon }) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: COLORS.lightGray,
      }}>
        {icon && <Text style={{ fontSize: 18, paddingLeft: 14 }}>{icon}</Text>}
        <TextInput
          style={{
            flex: 1,
            padding: 14,
            fontSize: 15,
            height: multiline ? 100 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
            color: COLORS.text,
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !show}
          keyboardType={keyboard || 'default'}
          autoCapitalize="none"
          multiline={multiline}
        />
        {secure && (
          <TouchableOpacity style={{ padding: 14 }} onPress={() => setShow(!show)}>
            <Text style={{ fontSize: 18 }}>{show ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Card({ children, style }) {
  return (
    <View style={[{
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }, style]}>
      {children}
    </View>
  );
}

function Badge({ label, color, bgColor }) {
  return (
    <View style={{
      backgroundColor: bgColor || COLORS.primaryLight,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: color || COLORS.primary }}>
        {label}
      </Text>
    </View>
  );
}

function Header({ title, subtitle, color, onBack, rightComponent }) {
  return (
    <View style={{
      backgroundColor: color || COLORS.primary,
      paddingTop: Platform.OS === 'ios' ? 50 : 40,
      paddingBottom: 20,
      paddingHorizontal: 24,
    }}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>{title}</Text>
          {subtitle && (
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightComponent}
      </View>
    </View>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#FEF3C7', color: '#D97706', label: '⏳ Pending' },
    confirmed: { bg: '#D1FAE5', color: '#059669', label: '✅ Confirmed' },
    'in-progress': { bg: '#DBEAFE', color: '#2563EB', label: '🔄 In Progress' },
    completed: { bg: '#D1FAE5', color: '#059669', label: '✅ Completed' },
    cancelled: { bg: '#FEE2E2', color: '#EF4444', label: '❌ Cancelled' },
    rescheduled: { bg: '#EDE9FE', color: '#7C3AED', label: '📅 Rescheduled' },
    disputed: { bg: '#FEE2E2', color: '#EF4444', label: '⚠️ Disputed' },
    approved: { bg: '#D1FAE5', color: '#059669', label: '✅ Approved' },
    rejected: { bg: '#FEE2E2', color: '#EF4444', label: '❌ Rejected' },
    held: { bg: '#DBEAFE', color: '#2563EB', label: '🔒 Held' },
    released: { bg: '#D1FAE5', color: '#059669', label: '💚 Released' },
    refunded: { bg: '#EDE9FE', color: '#7C3AED', label: '↩️ Refunded' },
    out_for_delivery: { bg: '#DBEAFE', color: '#2563EB', label: '🚚 Out for Delivery' },
    delivered: { bg: '#D1FAE5', color: '#059669', label: '📦 Delivered' },
    preparing: { bg: '#FEF3C7', color: '#D97706', label: '⚗️ Preparing' },
    failed: { bg: '#FEE2E2', color: '#EF4444', label: '❌ Failed' },
    collected: { bg: '#D1FAE5', color: '#059669', label: '✅ Collected' },
  };
  const s = map[status] || { bg: COLORS.lightGray, color: COLORS.gray, label: status || 'Unknown' };
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{s.label}</Text>
    </View>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <Text style={{ fontSize: 60, marginBottom: 16 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

function NotificationBell({ userId, onPress }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      setUnread(count || 0);
    };
    fetch();
    const sub = supabase
      .channel(`bell_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, () => fetch())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [userId]);

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative', padding: 4 }}>
      <Text style={{ fontSize: 24 }}>🔔</Text>
      {unread > 0 && (
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: COLORS.error,
          borderRadius: 10,
          minWidth: 18,
          height: 18,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.white }}>
            {unread > 9 ? '9+' : unread}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function RankingBadge({ rating, totalReviews }) {
  if (!totalReviews || totalReviews === 0) return null;
  let rank = null;
  if (rating >= 4.8 && totalReviews >= 20) rank = { label: '🏆 Top Rated', color: '#F59E0B', bg: '#FEF3C7' };
  else if (rating >= 4.5 && totalReviews >= 10) rank = { label: '⭐ Highly Rated', color: '#2563EB', bg: '#EFF6FF' };
  else if (rating >= 4.0) rank = { label: '👍 Recommended', color: '#059669', bg: '#F0FDF4' };
  else if (rating < 2.5 && totalReviews >= 5) rank = { label: '⚠️ Poor Reviews', color: COLORS.error, bg: '#FEE2E2' };
  if (!rank) return null;
  return (
    <View style={{ backgroundColor: rank.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: rank.color }}>{rank.label}</Text>
    </View>
  );
}

function ToastNotification({ message, visible, onHide }) {
  const slideAnim = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible && message) {
      Animated.sequence([
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.delay(3500),
        Animated.timing(slideAnim, { toValue: -120, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide && onHide());
    }
  }, [visible, message]);

  if (!visible || !message) return null;

  return (
    <Animated.View style={{
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 30,
      left: 16,
      right: 16,
      backgroundColor: COLORS.secondary,
      borderRadius: 14,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      transform: [{ translateY: slideAnim }],
      zIndex: 9999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    }}>
      <Text style={{ fontSize: 22 }}>{message?.icon || '🔔'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }} numberOfLines={1}>
          {message?.title}
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }} numberOfLines={2}>
          {message?.body}
        </Text>
      </View>
      <TouchableOpacity onPress={onHide}>
        <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function NotificationsScreen({ userId, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMark = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
      setLoading(false);
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    };
    fetchAndMark();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Notifications" onBack={onBack} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" subtitle="You are all caught up!" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card style={{ opacity: item.is_read ? 0.7 : 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>{item.data?.icon || '🔔'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 20 }}>
                    {item.body}
                  </Text>
                  <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 6 }}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                </View>
                {!item.is_read && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 4 }} />
                )}
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

function PaymentModal({ visible, amount, title, onSuccess, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('select');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : cleaned;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    return cleaned;
  };

  const handlePayment = async () => {
    if (!selectedMethod) { Alert.alert('Error', 'Please select a payment method'); return; }
    if (['visa', 'mastercard', 'amex'].includes(selectedMethod.type)) {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setProcessing(false);
    onSuccess(selectedMethod.label);
  };

  const digitalMethods = PAYMENT_METHODS.filter(m => ['applepay', 'googlepay', 'paypal'].includes(m.type));
  const cardMethods = PAYMENT_METHODS.filter(m => ['visa', 'mastercard', 'amex'].includes(m.type));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.95 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>💳 Secure Payment</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>
                Total: <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>${amount}</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, color: COLORS.gray }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 16, gap: 10 }}>
              <Text style={{ fontSize: 20 }}>🔒</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.success, fontWeight: '700' }}>256-bit SSL Encrypted</Text>
                <Text style={{ fontSize: 12, color: COLORS.success }}>Payment held until service is complete</Text>
              </View>
            </View>

            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Quick Pay</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {digitalMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={{ flex: 1, borderWidth: 2, borderColor: selectedMethod?.id === method.id ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: selectedMethod?.id === method.id ? COLORS.primaryLight : COLORS.white }}
                  onPress={() => { setSelectedMethod(method); setStep('confirm'); }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{method.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedMethod?.id === method.id ? COLORS.primary : COLORS.text }}>{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text style={{ marginHorizontal: 16, color: COLORS.gray, fontSize: 13 }}>or pay with card</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {cardMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={{ flex: 1, borderWidth: 2, borderColor: selectedMethod?.id === method.id ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center', backgroundColor: selectedMethod?.id === method.id ? COLORS.primaryLight : COLORS.white }}
                  onPress={() => { setSelectedMethod(method); setStep('card'); }}
                >
                  <Text style={{ fontSize: 22, marginBottom: 4 }}>{method.icon}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: method.color }}>{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {step === 'card' && selectedMethod && ['visa', 'mastercard', 'amex'].includes(selectedMethod.type) && (
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <View style={{ backgroundColor: selectedMethod.color, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>{selectedMethod.label}</Text>
                  <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: 'bold', letterSpacing: 3, marginBottom: 16 }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>CARD HOLDER</Text>
                      <Text style={{ fontSize: 14, color: COLORS.white, fontWeight: '600' }}>{cardName || 'YOUR NAME'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>EXPIRES</Text>
                      <Text style={{ fontSize: 14, color: COLORS.white, fontWeight: '600' }}>{expiry || 'MM/YY'}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Card Number</Text>
                  <TextInput
                    style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border, letterSpacing: 2 }}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Cardholder Name</Text>
                  <TextInput
                    style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                    placeholder="Name on card"
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Expiry</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="MM/YY"
                      value={expiry}
                      onChangeText={(t) => setExpiry(formatExpiry(t))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>CVV</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.white, borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }}
                      placeholder="•••"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Order Summary</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>{title}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>${amount}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Platform fee</Text>
                <Text style={{ fontSize: 14, color: COLORS.success }}>Free</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total (Held)</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${amount}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: processing ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 30, flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              onPress={handlePayment}
              disabled={processing}
            >
              {processing
                ? <><ActivityIndicator color={COLORS.white} /><Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Processing...</Text></>
                : <><Text style={{ fontSize: 20 }}>🔒</Text><Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Hold ${amount} Securely</Text></>
              }
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
// ============================================
// PART 2 — AUTH SCREENS + ROLE ROUTER
// ============================================

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
        <View style={{ width: 120, height: 120, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 60 }}>🏥</Text>
        </View>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 }}>MediConnect</Text>
        <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Your Health, Delivered</Text>
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 50 }}>
        <ActivityIndicator color="rgba(255,255,255,0.6)" size="small" />
      </View>
    </View>
  );
}

function OnboardingScreen({ onGetStarted, onLogin }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const slides = [
    { id: '1', icon: '🔍', title: 'Find Top Doctors', description: 'Browse verified specialists across all medical fields worldwide.', color: COLORS.primary },
    { id: '2', icon: '📅', title: 'Book & Consult', description: 'Schedule in-person or video consultations. Pay securely in-app.', color: '#264653' },
    { id: '3', icon: '💊', title: 'Medications Delivered', description: 'Order from verified pharmacies. Delivered to your door in under 60 mins.', color: '#2A9D8F' },
    { id: '4', icon: '🛡️', title: 'Safe & Verified', description: 'Every doctor and pharmacy is manually verified by our admin team.', color: '#E76F51' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={{ position: 'absolute', top: Platform.OS === 'ios' ? 54 : 40, right: 20, zIndex: 10, padding: 10 }}
        onPress={onGetStarted}
      >
        <Text style={{ fontSize: 14, color: COLORS.gray, fontWeight: '600' }}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 100 }}>
            <View style={{ width: 160, height: 160, borderRadius: 40, backgroundColor: item.color, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
              <Text style={{ fontSize: 80 }}>{item.icon}</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 16 }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 26 }}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{ height: 8, width: currentIndex === i ? 24 : 8, borderRadius: 4, backgroundColor: currentIndex === i ? COLORS.primary : COLORS.border, marginHorizontal: 4 }}
            />
          ))}
        </View>
        <Button
          label={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={() => {
            if (currentIndex < slides.length - 1) {
              flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
              setCurrentIndex(currentIndex + 1);
            } else {
              onGetStarted();
            }
          }}
          style={{ marginBottom: 16 }}
        />
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account?{' '}
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LoginScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Welcome back 👋</Text>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLORS.white }}>Log In</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ height: 24 }} />
        <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboard="email-address" icon="📧" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secure icon="🔒" />
        <TouchableOpacity style={{ alignItems: 'flex-end', marginTop: -8, marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>
        <Button label="Log In" onPress={handleLogin} loading={loading} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          <Text style={{ marginHorizontal: 16, color: COLORS.gray }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        </View>
        <Button
          label="Create New Account"
          onPress={onRegister}
          color={COLORS.white}
          textColor={COLORS.primary}
          style={{ borderWidth: 2, borderColor: COLORS.primary }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RegisterScreen({ onRegister, onLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'patient', icon: '🙋', label: 'Patient', color: COLORS.patientColor },
    { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor', color: COLORS.doctorColor },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy', color: COLORS.pharmacyColor },
  ];

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (error) throw error;
      Alert.alert(
        'Account Created! 🎉',
        role === 'patient'
          ? 'Welcome to MediConnect! Please log in.'
          : `Your ${role} account has been created. Please complete verification to get started.`,
        [{ text: 'OK', onPress: onLogin }]
      );
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Join MediConnect 🏥</Text>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLORS.white }}>Create Account</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ height: 16 }} />
        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" icon="👤" />
        <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboard="email-address" icon="📧" />

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>I am a</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={{ flex: 1, borderWidth: 2, borderColor: role === r.id ? r.color : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: role === r.id ? r.color + '15' : COLORS.white }}
                onPress={() => setRole(r.id)}
              >
                <Text style={{ fontSize: 26, marginBottom: 6 }}>{r.icon}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: role === r.id ? r.color : COLORS.gray }}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(role === 'doctor' || role === 'pharmacy') && (
          <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FED7AA' }}>
            <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>
              ⚠️ {role === 'doctor' ? 'Doctors' : 'Pharmacies'} must complete a verification process before accessing the platform. You will be guided through this after registration.
            </Text>
          </View>
        )}

        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secure icon="🔒" />
        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password" secure icon="🔒" />

        <Button label="Create Account" onPress={handleRegister} loading={loading} style={{ marginBottom: 16 }} />
        <TouchableOpacity style={{ alignItems: 'center', marginBottom: 40 }} onPress={onLogin}>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Already have an account?{' '}
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PendingVerificationScreen({ profile, onLogout, onCompleteVerification }) {
  const config = profile.verification_status === 'rejected'
    ? { icon: '❌', title: 'Verification Rejected', subtitle: 'Your application was rejected. Please review the notes below and resubmit.', color: COLORS.error }
    : { icon: '⏳', title: 'Verification Pending', subtitle: 'Our team is reviewing your documents. This usually takes 24-48 hours.', color: COLORS.warning };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: config.color, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 30, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.white }}>MediConnect</Text>
      </View>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 70, marginBottom: 24 }}>{config.icon}</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 12 }}>{config.title}</Text>
        <Text style={{ fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 24, marginBottom: 24 }}>{config.subtitle}</Text>
        {profile.verification_notes && (
          <View style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: '#FCA5A5' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.error, marginBottom: 6 }}>Admin Notes:</Text>
            <Text style={{ fontSize: 13, color: COLORS.text }}>{profile.verification_notes}</Text>
          </View>
        )}
        {(profile.verification_status === 'rejected' || !profile.documents_submitted) && (
          <Button label="Complete Verification" onPress={onCompleteVerification} style={{ width: '100%', marginBottom: 12 }} />
        )}
        <Button label="Log Out" onPress={onLogout} color={COLORS.lightGray} textColor={COLORS.text} style={{ width: '100%' }} />
      </View>
    </View>
  );
}

function DoctorVerificationScreen({ profile, onLogout }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    specialty: '',
    licenseNumber: '',
    yearsExperience: '',
    hospital: '',
    location: '',
    bio: '',
    consultationFee: '',
    videoFee: '',
  });

  const specialties = [
    'Cardiology', 'Neurology', 'Ophthalmology', 'Pediatrics',
    'Orthopedics', 'General Practice', 'Dermatology', 'Psychiatry',
    'Gynecology', 'Emergency Medicine', 'Surgery', 'Internal Medicine',
  ];

  const handleSubmit = async () => {
    if (!form.specialty || !form.licenseNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('doctor_profiles').upsert({
        user_id: profile.id,
        specialty: form.specialty,
        license_number: form.licenseNumber,
        years_experience: parseInt(form.yearsExperience) || 0,
        hospital_affiliation: form.hospital,
        location: form.location,
        bio: form.bio,
        consultation_fee: parseFloat(form.consultationFee) || 0,
        video_call_fee: parseFloat(form.videoFee) || 0,
        verification_status: 'pending',
        license_document_url: 'pending_upload',
        commission_rate: 10.00,
      });
      if (error) throw error;

      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
      if (admins && admins.length > 0) {
        await supabase.from('notifications').insert(
          admins.map(a => ({
            user_id: a.id,
            title: 'New Doctor Verification Request',
            body: `Dr. ${profile.full_name} has submitted verification documents for review.`,
            type: 'verification',
            data: { icon: '👨‍⚕️' },
          }))
        );
      }

      Alert.alert(
        'Submitted! ✅',
        'Your verification has been submitted. Our team will review within 24-48 hours. Please email your documents to verify@mediconnect.app',
        [{ text: 'OK', onPress: onLogout }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Step {step} of 2</Text>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: COLORS.white }}>Doctor Verification</Text>
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
          {[1, 2].map((s) => (
            <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? COLORS.white : 'rgba(255,255,255,0.3)' }} />
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {step === 1 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16, marginTop: 8 }}>Professional Details</Text>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Specialty *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {specialties.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: form.specialty === s ? COLORS.doctorColor : COLORS.white, borderWidth: 1, borderColor: form.specialty === s ? COLORS.doctorColor : COLORS.border }}
                      onPress={() => setForm({ ...form, specialty: s })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.specialty === s ? COLORS.white : COLORS.text }}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            <Input label="Medical License Number *" value={form.licenseNumber} onChangeText={(v) => setForm({ ...form, licenseNumber: v })} placeholder="e.g. GMC-123456" icon="📋" />
            <Input label="Years of Experience" value={form.yearsExperience} onChangeText={(v) => setForm({ ...form, yearsExperience: v })} placeholder="e.g. 10" keyboard="numeric" icon="📅" />
            <Input label="Hospital / Clinic Affiliation" value={form.hospital} onChangeText={(v) => setForm({ ...form, hospital: v })} placeholder="e.g. St. Mary's Hospital" icon="🏥" />
            <Input label="Location (City, Country)" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} placeholder="e.g. London, UK" icon="📍" />
            <Button label="Next →" onPress={() => setStep(2)} color={COLORS.doctorColor} style={{ marginTop: 8 }} />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16, marginTop: 8 }}>Fees & Bio</Text>
            <Input label="In-Person Consultation Fee (USD)" value={form.consultationFee} onChangeText={(v) => setForm({ ...form, consultationFee: v })} placeholder="e.g. 150" keyboard="numeric" icon="💵" />
            <Input label="Video Call Fee (USD)" value={form.videoFee} onChangeText={(v) => setForm({ ...form, videoFee: v })} placeholder="e.g. 120" keyboard="numeric" icon="📹" />
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Professional Bio</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 100, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                placeholder="Describe your experience and specializations..."
                value={form.bio}
                onChangeText={(v) => setForm({ ...form, bio: v })}
                multiline
              />
            </View>
            <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#FED7AA' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 8 }}>📎 Documents Required</Text>
              <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>
                • Medical License{'\n'}
                • Medical Certificate / Degree{'\n'}
                • Government ID{'\n\n'}
                Email to: verify@mediconnect.app{'\n'}
                Subject: Doctor Verification - {profile.full_name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button label="← Back" onPress={() => setStep(1)} color={COLORS.lightGray} textColor={COLORS.text} style={{ flex: 1 }} />
              <Button label="Submit" onPress={handleSubmit} loading={loading} color={COLORS.doctorColor} style={{ flex: 2 }} />
            </View>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function PharmacyVerificationScreen({ profile, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [isOpen24h, setIsOpen24h] = useState(false);
  const [form, setForm] = useState({
    pharmacyName: '',
    licenseNumber: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    deliveryRadius: '10',
  });

  const handleSubmit = async () => {
    if (!form.pharmacyName || !form.licenseNumber || !form.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('pharmacy_profiles').upsert({
        user_id: profile.id,
        pharmacy_name: form.pharmacyName,
        license_number: form.licenseNumber,
        address: form.address,
        city: form.city,
        country: form.country,
        phone: form.phone,
        is_open_24h: isOpen24h,
        delivery_radius_km: parseInt(form.deliveryRadius) || 10,
        verification_status: 'pending',
        license_document_url: 'pending_upload',
        commission_rate: 10.00,
      });
      if (error) throw error;

      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
      if (admins && admins.length > 0) {
        await supabase.from('notifications').insert(
          admins.map(a => ({
            user_id: a.id,
            title: 'New Pharmacy Verification Request',
            body: `${form.pharmacyName} has submitted verification documents for review.`,
            type: 'verification',
            data: { icon: '🏪' },
          }))
        );
      }

      Alert.alert(
        'Submitted! ✅',
        'Your pharmacy verification has been submitted. Our team will review within 24-48 hours. Please email your documents to verify@mediconnect.app',
        [{ text: 'OK', onPress: onLogout }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: COLORS.white }}>Pharmacy Verification</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Complete your profile to get verified</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View style={{ height: 16 }} />
        <Input label="Pharmacy Name *" value={form.pharmacyName} onChangeText={(v) => setForm({ ...form, pharmacyName: v })} placeholder="e.g. HealthCare Pharmacy" icon="🏪" />
        <Input label="License / Registration Number *" value={form.licenseNumber} onChangeText={(v) => setForm({ ...form, licenseNumber: v })} placeholder="e.g. PHARM-789012" icon="📋" />
        <Input label="Address *" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} placeholder="Full street address" icon="📍" />
        <Input label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} placeholder="e.g. London" icon="🏙️" />
        <Input label="Country" value={form.country} onChangeText={(v) => setForm({ ...form, country: v })} placeholder="e.g. United Kingdom" icon="🌍" />
        <Input label="Phone Number" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="+44 20 1234 5678" keyboard="phone-pad" icon="📞" />
        <Input label="Delivery Radius (km)" value={form.deliveryRadius} onChangeText={(v) => setForm({ ...form, deliveryRadius: v })} placeholder="10" keyboard="numeric" icon="🚚" />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 20 }}>🕐</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Open 24 Hours</Text>
          </View>
          <Switch
            value={isOpen24h}
            onValueChange={setIsOpen24h}
            trackColor={{ false: COLORS.border, true: COLORS.pharmacyColor }}
          />
        </View>

        <View style={{ backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#86EFAC' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#166534', marginBottom: 8 }}>📎 Documents Required</Text>
          <Text style={{ fontSize: 13, color: '#166534', lineHeight: 20 }}>
            • Pharmacy License / Registration Certificate{'\n'}
            • Owner / Manager Government ID{'\n\n'}
            Email to: verify@mediconnect.app{'\n'}
            Subject: Pharmacy Verification - {form.pharmacyName || profile.full_name}
          </Text>
        </View>

        <Button label="Submit for Verification" onPress={handleSubmit} loading={loading} color={COLORS.pharmacyColor} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function RoleRouter({ profile, doctorProfile, pharmacyProfile, onLogout }) {
  const { adminViewAs } = useApp();
  const effectiveRole = adminViewAs || profile.role;

  if (effectiveRole === 'admin') {
    return <AdminShell profile={profile} onLogout={onLogout} />;
  }

  if (effectiveRole === 'doctor') {
    if (!doctorProfile) {
      return <DoctorVerificationScreen profile={profile} onLogout={onLogout} />;
    }
    if (doctorProfile.verification_status !== 'approved') {
      return (
        <PendingVerificationScreen
          profile={{ ...profile, ...doctorProfile, documents_submitted: !!doctorProfile.license_document_url }}
          onLogout={onLogout}
          onCompleteVerification={() => {}}
        />
      );
    }
    return <DoctorShell profile={profile} doctorProfile={doctorProfile} onLogout={onLogout} />;
  }

  if (effectiveRole === 'pharmacy') {
    if (!pharmacyProfile) {
      return <PharmacyVerificationScreen profile={profile} onLogout={onLogout} />;
    }
    if (pharmacyProfile.verification_status !== 'approved') {
      return (
        <PendingVerificationScreen
          profile={{ ...profile, ...pharmacyProfile, documents_submitted: !!pharmacyProfile.license_document_url }}
          onLogout={onLogout}
          onCompleteVerification={() => {}}
        />
      );
    }
    return <PharmacyShell profile={profile} pharmacyProfile={pharmacyProfile} onLogout={onLogout} />;
  }

  return <PatientShell profile={profile} onLogout={onLogout} />;
}
// ============================================
// PART 3 — PATIENT DASHBOARD
// ============================================

function PatientShell({ profile, onLogout }) {
  const { user, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [toast, setToast] = useState(null);

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  useEffect(() => {
    if (!user) return;
    const sub = supabase
      .channel(`patient_notif_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setToast({
          title: payload.new.title,
          body: payload.new.body,
          icon: payload.new.data?.icon || '🔔',
        });
      })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [user]);

  if (screen === 'doctorProfile' && screenParams.doctor) {
    return (
      <View style={{ flex: 1 }}>
        <PatientDoctorProfile
          doctor={screenParams.doctor}
          user={user}
          profile={profile}
          onBack={() => { setScreen(activeTab); setScreenParams({}); }}
          onBook={() => navigate('bookAppointment', { doctor: screenParams.doctor })}
        />
        <ToastNotification message={toast} visible={!!toast} onHide={() => setToast(null)} />
      </View>
    );
  }

  if (screen === 'bookAppointment' && screenParams.doctor) {
    return (
      <View style={{ flex: 1 }}>
        <BookingFormScreen
          doctor={screenParams.doctor}
          user={user}
          profile={profile}
          onBack={() => navigate('doctorProfile', { doctor: screenParams.doctor })}
          onSuccess={() => switchTab('activity')}
        />
        <ToastNotification message={toast} visible={!!toast} onHide={() => setToast(null)} />
      </View>
    );
  }

  if (screen === 'videoCall' && screenParams.appointment) {
    return (
      <VideoCallScreen
        appointment={screenParams.appointment}
        user={user}
        role="patient"
        onEnd={() => { setScreen('activity'); setActiveTab('activity'); setScreenParams({}); }}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'nearby', icon: '📍', label: 'Nearby' },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy' },
    { id: 'activity', icon: '📋', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <PatientHome
            user={user}
            profile={profile}
            onNavigate={(s, p = {}) => {
              if (['pharmacy', 'activity', 'profile', 'nearby'].includes(s)) {
                switchTab(s);
              } else {
                navigate(s, p);
              }
            }}
          />
        )}
        {activeTab === 'nearby' && (
          <NearbyScreen
            user={user}
            profile={profile}
            onSelectDoctor={(doctor) => navigate('doctorProfile', { doctor })}
          />
        )}
        {activeTab === 'pharmacy' && (
          <PatientPharmacy user={user} profile={profile} />
        )}
        {activeTab === 'activity' && (
          <PatientActivity
            user={user}
            onStartVideoCall={(appt) => navigate('videoCall', { appointment: appt })}
          />
        )}
        {activeTab === 'profile' && (
          <PatientProfile user={user} profile={profile} onLogout={onLogout} />
        )}
      </View>

      <ToastNotification message={toast} visible={!!toast} onHide={() => setToast(null)} />

      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.primary : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function PatientHome({ user, profile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTopDoctors(); }, []);

  const fetchTopDoctors = async () => {
    const { data } = await supabase
      .from('doctor_profiles')
      .select('*, profiles(full_name, email)')
      .eq('is_verified', true)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false })
      .limit(5);
    setTopDoctors(data || []);
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Good day 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name || 'Welcome!'}</Text>
          </View>
          <NotificationBell userId={user?.id} onPress={() => setShowNotifications(true)} />
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, gap: 10 }}
          onPress={() => onNavigate('nearby')}
        >
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <Text style={{ fontSize: 15, color: COLORS.gray }}>Search doctors, specialties...</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👨‍⚕️', label: 'Find Doctor', screen: 'nearby', color: '#EFF6FF' },
            { icon: '💊', label: 'Pharmacy', screen: 'pharmacy', color: '#F0FDF4' },
            { icon: '📋', label: 'Activity', screen: 'activity', color: '#FFF7ED' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ flex: 1, backgroundColor: item.color, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor: COLORS.secondary, borderRadius: 16, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>💊 Medications Delivered</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Order from verified pharmacies. Under 60 mins.</Text>
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'flex-start' }}
              onPress={() => onNavigate('pharmacy')}
            >
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.secondary }}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 60 }}>🚚</Text>
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Browse by Specialty</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {SPECIALTIES.slice(0, 8).map((specialty) => (
            <TouchableOpacity
              key={specialty.id}
              style={{ width: (width - 60) / 2, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate('nearby', { specialty: specialty.name })}
            >
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: specialty.color, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 24 }}>{specialty.icon}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{specialty.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Top Rated Doctors</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : topDoctors.length === 0 ? (
          <Card>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>No verified doctors yet</Text>
          </Card>
        ) : (
          topDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('doctorProfile', { doctor })}
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{doctor.profiles?.full_name}</Text>
                  <Text>✅</Text>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 2 }}>{doctor.specialty}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>📍 {doctor.location}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {doctor.rating?.toFixed(1) || 'New'} ({doctor.total_reviews || 0})</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${doctor.consultation_fee}/visit</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 20 }}
          onPress={() => onNavigate('nearby')}
        >
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>View All Doctors →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function NearbyScreen({ user, profile, onSelectDoctor }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { fetchDoctors(); }, [selectedSpecialty, filterType]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('doctor_profiles')
        .select('*, profiles(full_name, email)')
        .eq('is_verified', true)
        .eq('verification_status', 'approved')
        .order('rating', { ascending: false });
      if (selectedSpecialty) query = query.eq('specialty', selectedSpecialty);
      if (filterType === 'video') query = query.gt('video_call_fee', 0);
      const { data } = await query;
      setDoctors(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = doctors.filter(d =>
    !searchQuery ||
    d.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Find Doctors</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10 }}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: COLORS.text }}
            placeholder="Search doctors, specialties, location..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 16, color: COLORS.gray }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
        {[{ id: 'all', label: '🌍 All' }, { id: 'video', label: '📹 Video' }].map((f) => (
          <TouchableOpacity
            key={f.id}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filterType === f.id ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: filterType === f.id ? COLORS.primary : COLORS.border }}
            onPress={() => setFilterType(f.id)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: filterType === f.id ? COLORS.white : COLORS.text }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: !selectedSpecialty ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }}
            onPress={() => setSelectedSpecialty(null)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: !selectedSpecialty ? COLORS.white : COLORS.primary }}>All</Text>
          </TouchableOpacity>
          {SPECIALTIES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedSpecialty === s.name ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.primary }}
              onPress={() => setSelectedSpecialty(selectedSpecialty === s.name ? null : s.name)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: selectedSpecialty === s.name ? COLORS.white : COLORS.primary }}>{s.icon} {s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <EmptyState icon="🔍" title="No doctors found" subtitle="Try changing your search or filters" />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              onPress={() => onSelectDoctor(item)}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 30 }}>👨‍⚕️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.profiles?.full_name}</Text>
                  <Text>✅</Text>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.primary, marginBottom: 2 }}>{item.specialty}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>📍 {item.location}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'} ({item.total_reviews || 0})</Text>
                    <RankingBadge rating={item.rating} totalReviews={item.total_reviews} />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    {(item.video_call_fee || 0) > 0 && (
                      <View style={{ backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, color: COLORS.doctorColor, fontWeight: '600' }}>📹</Text>
                      </View>
                    )}
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary }}>${item.consultation_fee}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function PatientDoctorProfile({ doctor, user, profile, onBack, onBook }) {
  const [activeTab, setActiveTab] = useState('about');
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchAvailability();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('target_type', 'doctor')
      .eq('target_id', doctor.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setReviews(data || []);
  };

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctor.id)
      .eq('is_available', true);
    setAvailability(data || []);
  };

  const dayLabels = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 40 }}>👨‍⚕️</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{doctor.profiles?.full_name || doctor.full_name}</Text>
            <Text>✅</Text>
          </View>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{doctor.specialty}</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>📍 {doctor.location}</Text>
          <View style={{ marginTop: 8 }}>
            <RankingBadge rating={doctor.rating} totalReviews={doctor.total_reviews} />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, marginTop: -20, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 16 }}>
        {[
          { label: '⭐ Rating', value: doctor.rating?.toFixed(1) || 'New' },
          { label: 'Reviews', value: doctor.total_reviews || 0 },
          { label: 'Experience', value: `${doctor.years_experience || 0}yr` },
          { label: 'Per Visit', value: `$${doctor.consultation_fee}` },
        ].map((stat, i, arr) => (
          <React.Fragment key={stat.label}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
            {i < arr.length - 1 && <View style={{ width: 1, backgroundColor: COLORS.border }} />}
          </React.Fragment>
        ))}
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 4 }}>
        {['about', 'availability', 'reviews'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.white : 'transparent' }}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? COLORS.doctorColor : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {activeTab === 'about' && (
          <>
            <Card>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>About</Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22 }}>{doctor.bio || 'No bio available.'}</Text>
            </Card>
            <Card>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Details</Text>
              {[
                { icon: '🏥', label: 'Hospital', value: doctor.hospital_affiliation || 'Independent' },
                { icon: '📹', label: 'Video Fee', value: `$${doctor.video_call_fee || doctor.consultation_fee}` },
                { icon: '🏥', label: 'Visit Fee', value: `$${doctor.consultation_fee}` },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>{item.icon}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, width: 80 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1 }}>{item.value}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {activeTab === 'availability' && (
          <Card>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Available Days & Hours</Text>
            {availability.length === 0 ? (
              <Text style={{ fontSize: 14, color: COLORS.textLight }}>Available weekdays 9AM - 5PM</Text>
            ) : (
              availability.map((slot) => (
                <View key={slot.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 14, color: COLORS.text, textTransform: 'capitalize' }}>{dayLabels[slot.day_of_week]}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>
                    {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                  </Text>
                </View>
              ))
            )}
          </Card>
        )}

        {activeTab === 'reviews' && (
          reviews.length === 0 ? (
            <Card>
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 30, marginBottom: 8 }}>⭐</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>No reviews yet</Text>
              </View>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
                    {review.is_anonymous ? 'Anonymous Patient' : (review.profiles?.full_name || 'Patient')}
                  </Text>
                  <Text style={{ fontSize: 13 }}>{'⭐'.repeat(review.rating)}</Text>
                </View>
                {review.comment && (
                  <Text style={{ fontSize: 13, color: COLORS.textLight, lineHeight: 20 }}>{review.comment}</Text>
                )}
                <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 6 }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </Card>
            ))
          )
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={{ padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <Button
          label={`📅 Book Appointment — $${doctor.consultation_fee}`}
          onPress={onBook}
        />
      </View>
    </View>
  );
}

function BookingFormScreen({ doctor, user, profile, onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    patientName: profile?.full_name || '',
    patientAge: '',
    patientGender: '',
    reason: '',
    sessionDuration: 30,
    language: 'English',
    additionalNotes: '',
    appointmentType: 'in-person',
    appointmentDate: '',
    appointmentTime: '',
  });

  const totalFee = form.appointmentType === 'video'
    ? (doctor.video_call_fee || doctor.consultation_fee)
    : doctor.consultation_fee;

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctor.id)
      .eq('is_available', true);
    setAvailability(data || []);
  };

  const getAvailableDates = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const availableDays = availability.map(a => a.day_of_week);
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      if (availableDays.length === 0 || availableDays.includes(dayName)) {
        dates.push({
          date: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        });
      }
    }
    return dates;
  };

  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const dates = getAvailableDates();

  const validateStep = () => {
    if (step === 1 && (!form.patientName || !form.patientAge || !form.patientGender || !form.reason)) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return false;
    }
    if (step === 2 && (!form.appointmentDate || !form.appointmentTime)) {
      Alert.alert('Missing Info', 'Please select a date and time');
      return false;
    }
    return true;
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    setShowPayment(false);
    setLoading(true);
    try {
      const { data: appt, error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctor.id,
        patient_name: form.patientName,
        patient_age: parseInt(form.patientAge),
        patient_gender: form.patientGender,
        reason: form.reason,
        session_duration_minutes: form.sessionDuration,
        language: form.language,
        additional_notes: form.additionalNotes,
        appointment_type: form.appointmentType,
        appointment_date: form.appointmentDate,
        appointment_time: form.appointmentTime,
        fee: totalFee,
        status: 'pending',
        payment_status: 'held',
      }).select().single();

      if (error) throw error;

      const commission = totalFee * 0.1;
      await supabase.from('transactions').insert({
        patient_id: user.id,
        appointment_id: appt.id,
        amount: totalFee,
        commission_amount: commission,
        net_amount: totalFee - commission,
        payment_method: paymentMethod,
        payment_status: 'held',
      });

      await supabase.from('notifications').insert({
        user_id: doctor.user_id,
        title: '📅 New Appointment Request',
        body: `${form.patientName} has booked a ${form.appointmentType} appointment on ${form.appointmentDate} at ${form.appointmentTime}. Please confirm.`,
        type: 'appointment',
        data: { icon: '📅', appointment_id: appt.id },
      });

      Alert.alert(
        'Booking Submitted! 🎉',
        `Your appointment with ${doctor.profiles?.full_name || doctor.full_name} on ${form.appointmentDate} at ${form.appointmentTime} is pending confirmation. Payment of $${totalFee} is securely held.`,
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Book Appointment</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>with {doctor.profiles?.full_name || doctor.full_name}</Text>
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? COLORS.white : 'rgba(255,255,255,0.3)' }} />
          ))}
        </View>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
          Step {step} of 3 — {['', 'Patient Details', 'Date & Time', 'Review & Pay'][step]}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Patient Information</Text>
            <Input label="Full Name *" value={form.patientName} onChangeText={(v) => setForm({ ...form, patientName: v })} placeholder="Enter full name" icon="👤" />
            <Input label="Age *" value={form.patientAge} onChangeText={(v) => setForm({ ...form, patientAge: v })} placeholder="e.g. 32" keyboard="numeric" icon="🎂" />

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Gender *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: form.patientGender === g ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.patientGender === g ? COLORS.primary : COLORS.border }}
                    onPress={() => setForm({ ...form, patientGender: g })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: form.patientGender === g ? COLORS.white : COLORS.text }}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Appointment Type *</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { type: 'in-person', icon: '🏥', label: 'In-Person', fee: doctor.consultation_fee },
                  { type: 'video', icon: '📹', label: 'Video Call', fee: doctor.video_call_fee || doctor.consultation_fee },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.type}
                    style={{ flex: 1, borderWidth: 2, borderColor: form.appointmentType === t.type ? COLORS.primary : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: form.appointmentType === t.type ? COLORS.primaryLight : COLORS.white }}
                    onPress={() => setForm({ ...form, appointmentType: t.type })}
                  >
                    <Text style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: form.appointmentType === t.type ? COLORS.primary : COLORS.gray }}>{t.label}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>${t.fee}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Reason for Visit *</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                placeholder="Describe your symptoms or reason..."
                value={form.reason}
                onChangeText={(v) => setForm({ ...form, reason: v })}
                multiline
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Session Duration</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SESSION_DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: form.sessionDuration === d ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.sessionDuration === d ? COLORS.primary : COLORS.border }}
                    onPress={() => setForm({ ...form, sessionDuration: d })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: form.sessionDuration === d ? COLORS.white : COLORS.text }}>{d} min</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Preferred Language</Text>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.primary, borderWidth: 1, borderColor: COLORS.primary, alignSelf: 'flex-start' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.white }}>English</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Additional Notes (Optional)</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
                placeholder="Any other info for the doctor..."
                value={form.additionalNotes}
                onChangeText={(v) => setForm({ ...form, additionalNotes: v })}
                multiline
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Select Date & Time</Text>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Available Dates</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {dates.map((d) => (
                    <TouchableOpacity
                      key={d.date}
                      style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: form.appointmentDate === d.date ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.appointmentDate === d.date ? COLORS.primary : COLORS.border, alignItems: 'center', minWidth: 90 }}
                      onPress={() => setForm({ ...form, appointmentDate: d.date, appointmentTime: '' })}
                    >
                      <Text style={{ fontSize: 12, color: form.appointmentDate === d.date ? COLORS.white : COLORS.textLight, marginBottom: 2 }}>{d.label.split(' ')[0]}</Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: form.appointmentDate === d.date ? COLORS.white : COLORS.text }}>{d.label.split(' ')[2]}</Text>
                      <Text style={{ fontSize: 12, color: form.appointmentDate === d.date ? 'rgba(255,255,255,0.8)' : COLORS.textLight }}>{d.label.split(' ')[1]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {form.appointmentDate && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Available Times</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {times.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: form.appointmentTime === time ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: form.appointmentTime === time ? COLORS.primary : COLORS.border }}
                      onPress={() => setForm({ ...form, appointmentTime: time })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.appointmentTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>Review & Confirm</Text>
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{doctor.profiles?.full_name || doctor.full_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>{doctor.specialty}</Text>
                </View>
              </View>
            </Card>

            <Card>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Booking Details</Text>
              {[
                { label: 'Patient', value: form.patientName },
                { label: 'Age', value: form.patientAge },
                { label: 'Gender', value: form.patientGender },
                { label: 'Type', value: form.appointmentType === 'video' ? '📹 Video Call' : '🏥 In-Person' },
                { label: 'Date', value: form.appointmentDate },
                { label: 'Time', value: form.appointmentTime },
                { label: 'Duration', value: `${form.sessionDuration} minutes` },
                { label: 'Language', value: form.language },
                { label: 'Reason', value: form.reason },
              ].map((row) => (
                <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{row.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{row.value}</Text>
                </View>
              ))}
            </Card>

            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Consultation Fee</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>${totalFee}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Platform Fee</Text>
                <Text style={{ fontSize: 14, color: COLORS.success }}>Free</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total (Held)</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>${totalFee}</Text>
              </View>
              <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 8 }}>
                💡 Payment held securely until appointment is completed.
              </Text>
            </View>

            <View style={{ backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#86EFAC' }}>
              <Text style={{ fontSize: 12, color: '#166534', lineHeight: 18 }}>
                ✅ By proceeding I confirm all information is accurate and I agree to MediConnect terms of service.
              </Text>
            </View>
          </>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
          {step > 1 && (
            <TouchableOpacity
              style={{ flex: 1, borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => setStep(step - 1)}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ flex: 2, backgroundColor: loading ? COLORS.gray : (step === 3 ? COLORS.success : COLORS.primary), borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}
            onPress={() => {
              if (!validateStep()) return;
              if (step < 3) { setStep(step + 1); }
              else { setShowPayment(true); }
            }}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>
                  {step === 3 ? '💳 Proceed to Payment' : 'Next →'}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPayment}
        amount={totalFee}
        title={`Appointment with ${doctor.profiles?.full_name || doctor.full_name}`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}

function PatientActivity({ user, onStartVideoCall }) {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReview, setShowReview] = useState(null);
  const [showReschedule, setShowReschedule] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [apptRes, orderRes] = await Promise.all([
        supabase.from('appointments').select('*, doctor_profiles(specialty, user_id, profiles(full_name))').eq('patient_id', user.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, pharmacy_profiles(pharmacy_name)').eq('patient_id', user.id).order('created_at', { ascending: false }),
      ]);
      setAppointments(apptRes.data || []);
      setOrders(orderRes.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

  const handleCancel = (appt) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel Appointment', style: 'destructive', onPress: async () => {
          await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id);
          if (appt.doctor_profiles?.user_id) {
            await supabase.from('notifications').insert({
              user_id: appt.doctor_profiles.user_id,
              title: '❌ Appointment Cancelled',
              body: `${appt.patient_name} has cancelled their appointment on ${appt.appointment_date}.`,
              type: 'appointment',
              data: { icon: '❌' },
            });
          }
          fetchAll();
        }
      }
    ]);
  };

  const ReviewModal = ({ item, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (rating === 0) { Alert.alert('Please select a rating'); return; }
      setSubmitting(true);
      try {
        await supabase.from('reviews').insert({
          reviewer_id: user.id,
          target_type: 'doctor',
          target_id: item.doctor_id,
          appointment_id: item.id,
          rating,
          comment,
          is_anonymous: isAnonymous,
        });
        await supabase.from('appointments').update({ review_prompted: true }).eq('id', item.id);
        Alert.alert('Thank you! 🙏', 'Your review has been submitted.');
        onClose();
        fetchAll();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Modal visible animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 6 }}>Rate Your Experience</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 20 }}>
              How was your session with Dr. {item.doctor_profiles?.profiles?.full_name}?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={{ fontSize: 40 }}>{star <= rating ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={{ textAlign: 'center', fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: 16 }}>
                {['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Very Good', '🌟 Excellent!'][rating]}
              </Text>
            )}
            <TextInput
              style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 80, textAlignVertical: 'top', backgroundColor: COLORS.lightGray, marginBottom: 14 }}
              placeholder="Share your experience (optional)..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: COLORS.text }}>Post Anonymously</Text>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button label="Skip" onPress={onClose} color={COLORS.lightGray} textColor={COLORS.gray} style={{ flex: 1 }} />
              <Button label="Submit Review" onPress={handleSubmit} loading={submitting} style={{ flex: 2 }} />
            </View>
            <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>
    );
  };

  const RescheduleModal = ({ appointment, onClose }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const dates = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return { date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
    });

    const handleReschedule = async () => {
      if (!newDate || !newTime || !reason) { Alert.alert('Please fill in all fields'); return; }
      setSubmitting(true);
      try {
        await supabase.from('appointments').update({
          reschedule_requested_by: 'patient',
          reschedule_date: newDate,
          reschedule_time: newTime,
          reschedule_reason: reason,
          reschedule_status: 'pending',
          status: 'rescheduled',
        }).eq('id', appointment.id);

        if (appointment.doctor_profiles?.user_id) {
          await supabase.from('notifications').insert({
            user_id: appointment.doctor_profiles.user_id,
            title: '📅 Reschedule Request',
            body: `${appointment.patient_name} wants to reschedule to ${newDate} at ${newTime}. Reason: ${reason}`,
            type: 'reschedule',
            data: { icon: '📅' },
          });
        }

        Alert.alert('Request Sent! ✅', 'Your reschedule request has been sent to the doctor.');
        onClose();
        fetchAll();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Modal visible animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.85 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>📅 Reschedule</Text>
              <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 22 }}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>New Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {dates.map((d) => (
                    <TouchableOpacity
                      key={d.date}
                      style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: newDate === d.date ? COLORS.primary : COLORS.lightGray, alignItems: 'center', minWidth: 80 }}
                      onPress={() => setNewDate(d.date)}
                    >
                      <Text style={{ fontSize: 12, color: newDate === d.date ? COLORS.white : COLORS.textLight }}>{d.label.split(' ')[0]}</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: newDate === d.date ? COLORS.white : COLORS.text }}>{d.label.split(' ')[2]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>New Time</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {times.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: newTime === t ? COLORS.primary : COLORS.lightGray }}
                    onPress={() => setNewTime(t)}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: newTime === t ? COLORS.white : COLORS.text }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Input label="Reason for Rescheduling" value={reason} onChangeText={setReason} placeholder="Why do you need to reschedule?" icon="📝" />
              <Button label="Send Reschedule Request" onPress={handleReschedule} loading={submitting} style={{ marginBottom: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>My Activity</Text>
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4 }}>
          {[{ id: 'appointments', label: '📅 Appointments' }, { id: 'orders', label: '📦 Orders' }].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab.id ? COLORS.white : 'transparent' }}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab.id ? COLORS.primary : COLORS.white }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : activeTab === 'appointments' ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<EmptyState icon="📅" title="No appointments yet" subtitle="Book an appointment with a doctor to get started" />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 }}>
                    Dr. {item.doctor_profiles?.profiles?.full_name || 'Doctor'}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>{item.doctor_profiles?.specialty}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⏱ {item.session_duration_minutes}min</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 4 }}>${item.fee}</Text>
                  <StatusBadge status={item.payment_status} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {item.status === 'confirmed' && item.appointment_type === 'video' && (
                    <TouchableOpacity
                      style={{ backgroundColor: COLORS.doctorColor, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                      onPress={() => onStartVideoCall && onStartVideoCall(item)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.white }}>📹 Join Call</Text>
                    </TouchableOpacity>
                  )}
                  {['pending', 'confirmed'].includes(item.status) && (
                    <>
                      <TouchableOpacity
                        style={{ backgroundColor: COLORS.primaryLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                        onPress={() => setShowReschedule(item)}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>📅 Reschedule</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ backgroundColor: '#FEE2E2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                        onPress={() => handleCancel(item)}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.error }}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status === 'completed' && !item.review_prompted && (
                    <TouchableOpacity
                      style={{ backgroundColor: COLORS.warning + '20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
                      onPress={() => setShowReview(item)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.warning }}>⭐ Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<EmptyState icon="📦" title="No orders yet" subtitle="Order medications from the Pharmacy tab" />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.pharmacy_profiles?.pharmacy_name}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>
                🛒 {(item.items || []).length} items • ${item.total_amount?.toFixed(2)}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                <StatusBadge status={item.payment_status} />
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
            </Card>
          )}
        />
      )}

      {showReview && <ReviewModal item={showReview} onClose={() => setShowReview(null)} />}
      {showReschedule && <RescheduleModal appointment={showReschedule} onClose={() => setShowReschedule(null)} />}
    </View>
  );
}

function PatientPharmacy({ user, profile }) {
  const [activeTab, setActiveTab] = useState('pharmacies');
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    patientName: profile?.full_name || '',
    patientAge: '',
    patientGender: '',
    deliveryReason: '',
    additionalNotes: '',
    deliveryAddress: '',
  });

  useEffect(() => { fetchPharmacies(); }, []);
  useEffect(() => { if (selectedPharmacy) fetchMedications(selectedPharmacy.id); }, [selectedPharmacy]);

  const fetchPharmacies = async () => {
    const { data } = await supabase
      .from('pharmacy_profiles')
      .select('*, profiles(full_name, email)')
      .eq('is_verified', true)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false });
    setPharmacies(data || []);
    setLoading(false);
  };

  const fetchMedications = async (pharmacyId) => {
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('pharmacy_id', pharmacyId)
      .eq('in_stock', true);
    setMedications(data || []);
  };

  const addToCart = (med) => {
    const existing = cart.find(c => c.id === med.id);
    if (existing) setCart(cart.map(c => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { ...med, quantity: 1 }]);
  };

  const removeFromCart = (medId) => setCart(cart.filter(c => c.id !== medId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const genders = ['Male', 'Female', 'Other'];
  const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handlePaymentSuccess = async (paymentMethod) => {
    setShowPayment(false);
    try {
      const commission = cartTotal * 0.1;
      const { data: order, error } = await supabase.from('orders').insert({
        patient_id: user.id,
        pharmacy_id: selectedPharmacy.id,
        patient_name: orderForm.patientName,
        patient_age: parseInt(orderForm.patientAge),
        patient_gender: orderForm.patientGender,
        delivery_reason: orderForm.deliveryReason,
        additional_notes: orderForm.additionalNotes,
        items: cart,
        total_amount: cartTotal,
        delivery_address: orderForm.deliveryAddress,
        status: 'pending',
        pharmacy_confirmed: false,
        payment_status: 'held',
        estimated_delivery: '45-60 mins',
      }).select().single();

      if (error) throw error;

      await supabase.from('transactions').insert({
        patient_id: user.id,
        order_id: order.id,
        amount: cartTotal,
        commission_amount: commission,
        net_amount: cartTotal - commission,
        payment_method: paymentMethod,
        payment_status: 'held',
      });

      await supabase.from('notifications').insert({
        user_id: selectedPharmacy.user_id,
        title: '📦 New Order Request',
        body: `${orderForm.patientName} placed an order for ${cartCount} items worth $${cartTotal.toFixed(2)}. Please confirm.`,
        type: 'order',
        data: { icon: '📦', order_id: order.id },
      });

      Alert.alert(
        'Order Placed! 🎉',
        `Your order is pending pharmacy confirmation. Payment of $${cartTotal.toFixed(2)} is securely held.`,
        [{ text: 'OK', onPress: () => { setCart([]); setShowCart(false); setShowOrderForm(false); } }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Pharmacy</Text>
          {cart.length > 0 && (
            <TouchableOpacity style={{ position: 'relative' }} onPress={() => setShowCart(true)}>
              <Text style={{ fontSize: 28 }}>🛒</Text>
              <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.accent, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, padding: 4 }}>
          {['pharmacies', 'medications'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? COLORS.pharmacyColor : 'transparent' }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'pharmacies' ? (
        loading ? <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.pharmacyColor} /> : (
          <FlatList
            data={pharmacies}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<EmptyState icon="🏪" title="No pharmacies available" subtitle="Check back soon" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                onPress={() => { setSelectedPharmacy(item); setActiveTab('medications'); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 26 }}>🏪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.pharmacy_name}</Text>
                      <Text>✅</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {item.address}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ fontSize: 12, color: COLORS.warning }}>⭐ {item.rating?.toFixed(1) || 'New'}</Text>
                    <Text style={{ fontSize: 12, color: item.is_open_24h ? COLORS.success : COLORS.error }}>
                      {item.is_open_24h ? '🟢 Open 24h' : '🔴 Limited Hours'}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>Order →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      ) : (
        <View style={{ flex: 1 }}>
          {selectedPharmacy && (
            <View style={{ backgroundColor: COLORS.white, padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setActiveTab('pharmacies')} style={{ marginRight: 10 }}>
                <Text style={{ fontSize: 20, color: COLORS.pharmacyColor }}>←</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{selectedPharmacy.pharmacy_name}</Text>
            </View>
          )}
          <View style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 10, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <TextInput
                style={{ flex: 1, fontSize: 15, color: COLORS.text }}
                placeholder="Search medications..."
                placeholderTextColor={COLORS.gray}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          <FlatList
            data={filteredMeds}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
            ListEmptyComponent={<EmptyState icon="💊" title="No medications found" subtitle="Try a different search" />}
            renderItem={({ item }) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                  <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 24 }}>{item.icon || '💊'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.category}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.pharmacyColor }}>${item.price}</Text>
                      {item.requires_prescription && (
                        <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: '#D97706' }}>Rx Required</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ backgroundColor: inCart ? COLORS.success : COLORS.pharmacyColor, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
                    onPress={() => addToCart(item)}
                  >
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
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.75 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>🛒 Cart ({cartCount})</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}><Text style={{ fontSize: 22 }}>✕</Text></TouchableOpacity>
            </View>
            {cart.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 30 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🛒</Text>
                <Text style={{ fontSize: 16, color: COLORS.textLight }}>Cart is empty</Text>
              </View>
            ) : (
              <>
                <ScrollView style={{ maxHeight: 260 }}>
                  {cart.map((item) => (
                    <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textLight }}>Qty: {item.quantity} × ${item.price}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>${(item.price * item.quantity).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={{ fontSize: 18 }}>🗑️</Text></TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.primary }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                  <Button
                    label="📋 Fill Delivery Form"
                    onPress={() => { setShowCart(false); setShowOrderForm(true); }}
                    color={COLORS.pharmacyColor}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showOrderForm} animationType="slide">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => setShowOrderForm(false)} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Delivery Details</Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <Input label="Full Name *" value={orderForm.patientName} onChangeText={(v) => setOrderForm({ ...orderForm, patientName: v })} placeholder="Your full name" icon="👤" />
            <Input label="Age *" value={orderForm.patientAge} onChangeText={(v) => setOrderForm({ ...orderForm, patientAge: v })} placeholder="e.g. 28" keyboard="numeric" icon="🎂" />
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Gender *</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: orderForm.patientGender === g ? COLORS.pharmacyColor : COLORS.white, borderWidth: 1, borderColor: orderForm.patientGender === g ? COLORS.pharmacyColor : COLORS.border, alignItems: 'center' }}
                    onPress={() => setOrderForm({ ...orderForm, patientGender: g })}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: orderForm.patientGender === g ? COLORS.white : COLORS.text }}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Input label="Delivery Address *" value={orderForm.deliveryAddress} onChangeText={(v) => setOrderForm({ ...orderForm, deliveryAddress: v })} placeholder="Full delivery address" icon="📍" />
            <Input label="Reason for Order" value={orderForm.deliveryReason} onChangeText={(v) => setOrderForm({ ...orderForm, deliveryReason: v })} placeholder="e.g. Prescribed by Dr. Smith" icon="📋" />
            <Input label="Additional Notes" value={orderForm.additionalNotes} onChangeText={(v) => setOrderForm({ ...orderForm, additionalNotes: v })} placeholder="Any special instructions..." multiline icon="📝" />

            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>Order Total: ${cartTotal.toFixed(2)}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>Payment held securely until delivery confirmed ✅</Text>
            </View>

            <Button
              label={`💳 Proceed to Payment — $${cartTotal.toFixed(2)}`}
              color={COLORS.pharmacyColor}
              onPress={() => {
                if (!orderForm.patientName || !orderForm.patientAge || !orderForm.patientGender || !orderForm.deliveryAddress) {
                  Alert.alert('Missing Info', 'Please fill in all required fields');
                  return;
                }
                setShowPayment(true);
              }}
              style={{ marginBottom: 40 }}
            />
          </ScrollView>
        </View>
      </Modal>

      <PaymentModal
        visible={showPayment}
        amount={cartTotal.toFixed(2)}
        title={`Medication Order (${cartCount} items)`}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}

function PatientProfile({ user, profile, onLogout }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({ appointments: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [a, o] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('patient_id', user.id),
      ]);
      setStats({ appointments: a.count || 0, orders: o.count || 0 });
    };
    fetchStats();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>{profile?.full_name || 'Patient'}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{user?.email}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>🙋 Patient</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: 'Appointments', value: stats.appointments },
            { icon: '📦', label: 'Orders', value: stats.orders },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 26, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '💳', label: 'Payment Methods' },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📋', label: 'Terms & Privacy Policy' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0{'\n'}© 2026 Reine Mande Ltd. All rights reserved.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}
// ============================================
// PART 4 — DOCTOR DASHBOARD + PHARMACY DASHBOARD + VIDEO CALL
// ============================================

function VideoCallScreen({ appointment, user, role, onEnd }) {
  const [callStatus, setCallStatus] = useState('connecting');
  const [timeRemaining, setTimeRemaining] = useState((appointment?.session_duration_minutes || 30) * 60);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const totalSeconds = (appointment?.session_duration_minutes || 30) * 60;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    const connectTimer = setTimeout(async () => {
      setCallStatus('active');
      await supabase.from('appointments').update({
        call_status: 'in-progress',
        call_started_at: new Date().toISOString(),
        status: 'in-progress',
      }).eq('id', appointment.id);
      startTimer();
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleCallEnd('time_up');
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPaused(true);
    setCallStatus('paused');
    supabase.from('appointments').update({ call_status: 'paused' }).eq('id', appointment.id);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setCallStatus('active');
    supabase.from('appointments').update({ call_status: 'in-progress' }).eq('id', appointment.id);
    startTimer();
  };

  const handleCallEnd = async (reason = 'manual') => {
    if (timerRef.current) clearInterval(timerRef.current);
    const isCompleted = reason === 'time_up' || reason === 'complete';

    await supabase.from('appointments').update({
      call_status: isCompleted ? 'completed' : 'paused',
      call_ended_at: new Date().toISOString(),
      call_duration_seconds: timeElapsed,
      status: isCompleted ? 'completed' : 'in-progress',
      payment_status: isCompleted ? 'released' : 'held',
    }).eq('id', appointment.id);

    if (isCompleted) {
      const otherUserId = role === 'doctor' ? appointment.patient_id : appointment.doctor_profiles?.user_id;
      if (otherUserId) {
        await supabase.from('notifications').insert({
          user_id: otherUserId,
          title: reason === 'time_up' ? '⏰ Session Time Ended' : '✅ Call Completed',
          body: `Your video session has ended. Duration: ${formatTime(timeElapsed)}.`,
          type: 'call',
          data: { icon: '📹' },
        });
      }
    }

    setCallStatus(isCompleted ? 'completed' : 'disconnected');
    setTimeout(() => onEnd(), 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;
  const timeColor = timeRemaining <= 300 ? COLORS.error : timeRemaining <= 600 ? COLORS.warning : COLORS.success;

  if (callStatus === 'connecting') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1117', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F1117" />
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.doctorColor + '40', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 50 }}>{role === 'doctor' ? '🙋' : '👨‍⚕️'}</Text>
          </View>
        </Animated.View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>Connecting...</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          {role === 'doctor'
            ? `Calling ${appointment.patient_name}`
            : `Connecting to doctor`}
        </Text>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (callStatus === 'completed' || callStatus === 'disconnected') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1117', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>{callStatus === 'completed' ? '✅' : '📵'}</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>
          {callStatus === 'completed' ? 'Call Completed' : 'Call Ended'}
        </Text>
        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Duration: {formatTime(timeElapsed)}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1117' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1117" />

      <View style={{ flex: 1, backgroundColor: '#1A1D2E', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.doctorColor + '40', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 60 }}>{role === 'doctor' ? '🙋' : '👨‍⚕️'}</Text>
        </View>
        <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: '600' }}>
          {role === 'doctor' ? appointment.patient_name : 'Doctor'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isPaused ? COLORS.warning : COLORS.success }} />
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{isPaused ? 'Paused' : 'Connected'}</Text>
        </View>
      </View>

      <View style={{ position: 'absolute', width: 100, height: 140, borderRadius: 14, backgroundColor: '#2A2D3E', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.doctorColor, top: Platform.OS === 'ios' ? 60 : 40, right: 20 }}>
        {isCameraOff
          ? <Text style={{ fontSize: 30 }}>📷</Text>
          : <Text style={{ fontSize: 40 }}>{role === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
        }
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>You</Text>
      </View>

      <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16, padding: 12, minWidth: 150 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Time Remaining</Text>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: timeColor }}>
          {formatTime(timeRemaining)}
        </Text>
        <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
          of {appointment.session_duration_minutes || 30} min session
        </Text>
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 8 }}>
          <View style={{ height: 4, width: `${progressPercent}%`, backgroundColor: timeColor, borderRadius: 2 }} />
        </View>
        {timeRemaining <= 300 && (
          <Text style={{ fontSize: 11, color: COLORS.error, marginTop: 6, fontWeight: '700' }}>
            ⚠️ Under 5 mins left!
          </Text>
        )}
      </View>

      <View style={{ backgroundColor: 'rgba(0,0,0,0.85)', paddingBottom: Platform.OS === 'ios' ? 40 : 20, paddingTop: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 16 }}>
          Elapsed: {formatTime(timeElapsed)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isMuted ? COLORS.error : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Text style={{ fontSize: 24 }}>{isMuted ? '🔇' : '🎤'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isCameraOff ? COLORS.error : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setIsCameraOff(!isCameraOff)}
          >
            <Text style={{ fontSize: 24 }}>{isCameraOff ? '📷' : '📹'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isPaused ? COLORS.success : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => isPaused ? resumeTimer() : pauseTimer()}
          >
            <Text style={{ fontSize: 24 }}>{isPaused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setShowEndConfirm(true)}
          >
            <Text style={{ fontSize: 28 }}>📵</Text>
          </TouchableOpacity>
        </View>

        {isPaused && (
          <View style={{ backgroundColor: COLORS.warning + '30', borderRadius: 10, padding: 10, marginTop: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: COLORS.warning, fontWeight: '700' }}>
              ⏸️ Call paused — payment held until completed
            </Text>
          </View>
        )}
      </View>

      <Modal visible={showEndConfirm} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>End Call?</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
              If you end before session time, payment stays held until the session is marked complete.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => setShowEndConfirm(false)}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.warning, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowEndConfirm(false); handleCallEnd('paused'); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => { setShowEndConfirm(false); handleCallEnd('complete'); }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>End & Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============================================
// DOCTOR SHELL
// ============================================
function DoctorShell({ profile, doctorProfile: initialDoctorProfile, onLogout }) {
  const { user, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [doctorProfile, setDoctorProfile] = useState(initialDoctorProfile);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;
    const sub = supabase
      .channel(`doctor_notif_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setToast({
          title: payload.new.title,
          body: payload.new.body,
          icon: payload.new.data?.icon || '🔔',
        });
      })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [user]);

  const refreshDoctor = async () => {
    const { data } = await supabase.from('doctor_profiles').select('*').eq('user_id', user.id).single();
    if (data) setDoctorProfile(data);
  };

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  if (screen === 'videoCall' && screenParams.appointment) {
    return (
      <VideoCallScreen
        appointment={screenParams.appointment}
        user={user}
        role="doctor"
        onEnd={() => { setScreen('appointments'); setActiveTab('appointments'); setScreenParams({}); }}
      />
    );
  }

  if (screen === 'editProfile') {
    return (
      <DoctorProfileEditor
        user={user}
        profile={profile}
        doctorProfile={doctorProfile}
        onBack={() => switchTab('profile')}
        onSaved={() => { refreshDoctor(); switchTab('profile'); }}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'availability', icon: '⏰', label: 'Schedule' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <DoctorHome
            user={user}
            profile={profile}
            doctorProfile={doctorProfile}
            onNavigate={(s, p = {}) => {
              if (tabs.find(t => t.id === s)) switchTab(s);
              else navigate(s, p);
            }}
          />
        )}
        {activeTab === 'appointments' && (
          <DoctorAppointments
            user={user}
            doctorProfile={doctorProfile}
            onNavigate={(s, p = {}) => navigate(s, p)}
          />
        )}
        {activeTab === 'availability' && (
          <DoctorAvailability user={user} doctorProfile={doctorProfile} />
        )}
        {activeTab === 'earnings' && (
          <DoctorEarnings doctorProfile={doctorProfile} />
        )}
        {activeTab === 'profile' && (
          <DoctorProfileView
            user={user}
            profile={profile}
            doctorProfile={doctorProfile}
            onLogout={onLogout}
            onEdit={() => navigate('editProfile')}
          />
        )}
      </View>

      <ToastNotification message={toast} visible={!!toast} onHide={() => setToast(null)} />

      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.doctorColor, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.doctorColor : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DoctorHome({ user, profile, doctorProfile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({ todayAppointments: 0, pendingConfirmations: 0, completedToday: 0, totalPatients: 0 });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [allAppts, todayAppts] = await Promise.all([
        supabase.from('appointments').select('*').eq('doctor_id', doctorProfile.id),
        supabase.from('appointments').select('*, profiles!appointments_patient_id_fkey(full_name)').eq('doctor_id', doctorProfile.id).eq('appointment_date', today).order('appointment_time'),
      ]);
      const all = allAppts.data || [];
      const todays = todayAppts.data || [];
      setStats({
        todayAppointments: todays.length,
        pendingConfirmations: all.filter(a => a.status === 'pending').length,
        completedToday: todays.filter(a => a.status === 'completed').length,
        totalPatients: new Set(all.map(a => a.patient_id)).size,
      });
      setTodayAppointments(todays);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDashboard(); }} />}
    >
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Welcome back 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Dr. {profile.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{doctorProfile.specialty}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <NotificationBell userId={user?.id} onPress={() => setShowNotifications(true)} />
            <View style={{ backgroundColor: doctorProfile.is_available ? COLORS.success : COLORS.error, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>
                {doctorProfile.is_available ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: "Today's Appts", value: stats.todayAppointments, color: '#EFF6FF', textColor: COLORS.doctorColor },
            { icon: '⏳', label: 'Pending', value: stats.pendingConfirmations, color: '#FFF7ED', textColor: COLORS.warning },
            { icon: '✅', label: 'Completed Today', value: stats.completedToday, color: '#F0FDF4', textColor: COLORS.success },
            { icon: '👥', label: 'Total Patients', value: stats.totalPatients, color: '#F5F3FF', textColor: COLORS.adminColor },
          ].map((stat) => (
            <View key={stat.label} style={{ width: (width - 52) / 2, backgroundColor: stat.color, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: COLORS.doctorColor, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Total Earnings</Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
            ${(doctorProfile.total_earnings || 0).toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('appointments')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.white }}>Appointments →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
              onPress={() => onNavigate('earnings')}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.doctorColor }}>Earnings →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Today's Schedule</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.doctorColor} />
        ) : todayAppointments.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>📅</Text>
              <Text style={{ fontSize: 15, color: COLORS.textLight }}>No appointments today</Text>
            </View>
          </Card>
        ) : (
          todayAppointments.map((appt) => (
            <TouchableOpacity
              key={appt.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: appt.status === 'confirmed' ? COLORS.success : appt.status === 'pending' ? COLORS.warning : COLORS.gray, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('appointments')}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{appt.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{appt.reason}</Text>
                </View>
                <StatusBadge status={appt.status} />
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {appt.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{appt.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⏱ {appt.session_duration_minutes}min</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function DoctorAppointments({ user, doctorProfile, onNavigate }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchAppointments(); }, [activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorProfile.id)
        .order('appointment_date', { ascending: false });
      if (activeTab === 'pending') query = query.in('status', ['pending', 'rescheduled']);
      else query = query.eq('status', activeTab);
      const { data } = await query;
      setAppointments(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleConfirm = (appt) => {
    Alert.alert('Confirm Appointment', `Confirm appointment with ${appt.patient_name} on ${appt.appointment_date} at ${appt.appointment_time}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm ✅', onPress: async () => {
          await supabase.from('appointments').update({
            status: 'confirmed',
            doctor_confirmed: true,
            doctor_confirmed_at: new Date().toISOString(),
          }).eq('id', appt.id);
          await supabase.from('notifications').insert({
            user_id: appt.patient_id,
            title: '✅ Appointment Confirmed!',
            body: `Your appointment on ${appt.appointment_date} at ${appt.appointment_time} has been confirmed.`,
            type: 'appointment',
            data: { icon: '✅' },
          });
          fetchAppointments();
        }
      }
    ]);
  };

  const handleReject = (appt) => {
    Alert.alert(
      'Reject Appointment',
      'Please provide a reason:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject', style: 'destructive', onPress: async () => {
            const reason = 'Doctor unavailable at this time';
            await supabase.from('appointments').update({
              status: 'cancelled',
              doctor_cancel_reason: reason,
              payment_status: 'refunded',
            }).eq('id', appt.id);
            await supabase.from('notifications').insert({
              user_id: appt.patient_id,
              title: '❌ Appointment Rejected',
              body: `Your appointment on ${appt.appointment_date} was rejected. Reason: ${reason}. Your payment will be refunded.`,
              type: 'appointment',
              data: { icon: '❌' },
            });
            const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
            if (admins && admins.length > 0) {
              await supabase.from('notifications').insert(
                admins.map(a => ({
                  user_id: a.id,
                  title: '↩️ Refund Required',
                  body: `Doctor rejected appointment for ${appt.patient_name}. Refund of $${appt.fee} needed.`,
                  type: 'refund',
                  data: { icon: '↩️' },
                }))
              );
            }
            fetchAppointments();
          }
        }
      ]
    );
  };

  const handleComplete = async (appt) => {
    Alert.alert('Complete Appointment', 'Mark this appointment as completed? This will release payment to you.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete ✅', onPress: async () => {
          const commission = (appt.fee || 0) * ((doctorProfile.commission_rate || 10) / 100);
          const net = (appt.fee || 0) - commission;
          await supabase.from('appointments').update({
            status: 'completed',
            payment_status: 'released',
          }).eq('id', appt.id);
          await supabase.from('doctor_profiles').update({
            total_earnings: (doctorProfile.total_earnings || 0) + net,
          }).eq('id', doctorProfile.id);
          await supabase.from('commissions').insert({
            appointment_id: appt.id,
            from_user_id: appt.patient_id,
            amount: commission,
            status: 'collected',
            collected_at: new Date().toISOString(),
          });
          await supabase.from('notifications').insert({
            user_id: appt.patient_id,
            title: '✅ Appointment Completed',
            body: `Your appointment is completed. Payment of $${appt.fee} has been processed. Please leave a review!`,
            type: 'appointment',
            data: { icon: '✅' },
          });
          fetchAppointments();
          Alert.alert('Done! ✅', `$${net.toFixed(2)} added to your earnings.`);
        }
      }
    ]);
  };

  const handleRescheduleResponse = async (appt, approved) => {
    if (approved) {
      await supabase.from('appointments').update({
        appointment_date: appt.reschedule_date,
        appointment_time: appt.reschedule_time,
        status: 'confirmed',
        reschedule_status: 'approved',
      }).eq('id', appt.id);
      await supabase.from('notifications').insert({
        user_id: appt.patient_id,
        title: '✅ Reschedule Approved',
        body: `Your reschedule to ${appt.reschedule_date} at ${appt.reschedule_time} has been approved.`,
        type: 'reschedule',
        data: { icon: '📅' },
      });
    } else {
      await supabase.from('appointments').update({
        status: 'confirmed',
        reschedule_status: 'rejected',
      }).eq('id', appt.id);
      await supabase.from('notifications').insert({
        user_id: appt.patient_id,
        title: '❌ Reschedule Rejected',
        body: 'Your reschedule request was rejected. Your original appointment stands.',
        type: 'reschedule',
        data: { icon: '❌' },
      });
    }
    fetchAppointments();
  };

  const tabs = [
    { id: 'pending', label: '⏳ Pending' },
    { id: 'confirmed', label: '✅ Confirmed' },
    { id: 'completed', label: '🏁 Completed' },
    { id: 'cancelled', label: '❌ Cancelled' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Appointments</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === tab.id ? COLORS.doctorColor : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.doctorColor} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAppointments(); }} />}
          ListEmptyComponent={<EmptyState icon="📅" title={`No ${activeTab} appointments`} subtitle="Pull down to refresh" />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>
                    {item.patient_age}yr • {item.patient_gender} • {item.language}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 2 }}>Reason</Text>
                <Text style={{ fontSize: 13, color: COLORS.text }}>{item.reason}</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>📅 {item.appointment_date}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>🕐 {item.appointment_time}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_type === 'video' ? '📹 Video' : '🏥 In-Person'}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>⏱ {item.session_duration_minutes}min</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: item.status === 'rescheduled' ? 10 : 0 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>${item.fee}</Text>
                <StatusBadge status={item.payment_status} />
              </View>

              {item.status === 'rescheduled' && item.reschedule_status === 'pending' && (
                <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#FED7AA' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 4 }}>📅 Reschedule Request</Text>
                  <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 2 }}>New Date: {item.reschedule_date} at {item.reschedule_time}</Text>
                  <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 10 }}>Reason: {item.reschedule_reason}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 8, alignItems: 'center' }} onPress={() => handleRescheduleResponse(item, true)}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white }}>✅ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 10, paddingVertical: 8, alignItems: 'center' }} onPress={() => handleRescheduleResponse(item, false)}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => handleConfirm(item)}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>✅ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => handleReject(item)}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.status === 'confirmed' && (
                  <>
                    {item.appointment_type === 'video' && (
                      <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.doctorColor, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => onNavigate('videoCall', { appointment: item })}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>📹 Start Call</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => handleComplete(item)}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>🏁 Complete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

function DoctorAvailability({ user, doctorProfile }) {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    const { data } = await supabase.from('doctor_availability').select('*').eq('doctor_id', doctorProfile.id);
    const fullWeek = days.map(day => {
      const existing = (data || []).find(a => a.day_of_week === day.id);
      return existing || { day_of_week: day.id, start_time: '09:00', end_time: '17:00', is_available: false, doctor_id: doctorProfile.id };
    });
    setAvailability(fullWeek);
    setLoading(false);
  };

  const toggleDay = (dayId) => setAvailability(prev => prev.map(a => a.day_of_week === dayId ? { ...a, is_available: !a.is_available } : a));
  const updateTime = (dayId, field, value) => setAvailability(prev => prev.map(a => a.day_of_week === dayId ? { ...a, [field]: value } : a));

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('doctor_availability').delete().eq('doctor_id', doctorProfile.id);
      const toInsert = availability.filter(a => a.is_available).map(a => ({
        doctor_id: doctorProfile.id,
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
        is_available: true,
      }));
      if (toInsert.length > 0) await supabase.from('doctor_availability').insert(toInsert);
      await supabase.from('doctor_profiles').update({ is_available: toInsert.length > 0 }).eq('id', doctorProfile.id);
      Alert.alert('Saved ✅', 'Your availability has been updated.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.doctorColor} />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Set Availability</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Choose when patients can book you</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' }}>
          <Text style={{ fontSize: 13, color: '#1E40AF', lineHeight: 18 }}>
            💡 Toggle days on/off and set your working hours. Patients will only see available days.
          </Text>
        </View>

        {availability.map((slot) => {
          const dayLabel = days.find(d => d.id === slot.day_of_week)?.label;
          return (
            <View key={slot.day_of_week} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: slot.is_available ? COLORS.doctorColor : COLORS.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: slot.is_available ? 14 : 0 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: slot.is_available ? COLORS.text : COLORS.gray }}>{dayLabel}</Text>
                <Switch
                  value={slot.is_available}
                  onValueChange={() => toggleDay(slot.day_of_week)}
                  trackColor={{ false: COLORS.border, true: COLORS.doctorColor }}
                />
              </View>
              {slot.is_available && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>Start Time</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['08:00', '09:00', '10:00', '11:00'].map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: slot.start_time === t ? COLORS.doctorColor : COLORS.lightGray }}
                          onPress={() => updateTime(slot.day_of_week, 'start_time', t)}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: slot.start_time === t ? COLORS.white : COLORS.text }}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>End Time</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['15:00', '17:00', '18:00', '20:00'].map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: slot.end_time === t ? COLORS.doctorColor : COLORS.lightGray }}
                          onPress={() => updateTime(slot.day_of_week, 'end_time', t)}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: slot.end_time === t ? COLORS.white : COLORS.text }}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Button
          label="💾 Save Availability"
          onPress={handleSave}
          loading={saving}
          color={COLORS.doctorColor}
          style={{ marginTop: 8, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
}

function DoctorEarnings({ doctorProfile }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, pending: 0 });

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    try {
      const { data: appts } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorProfile.id)
        .in('payment_status', ['released', 'held'])
        .order('created_at', { ascending: false });

      const all = appts || [];
      const now = new Date();
      const commission = (doctorProfile.commission_rate || 10) / 100;

      const thisMonth = all.filter(a => {
        const d = new Date(a.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && a.payment_status === 'released';
      });

      setStats({
        total: doctorProfile.total_earnings || 0,
        thisMonth: thisMonth.reduce((s, a) => s + ((a.fee || 0) * (1 - commission)), 0),
        pending: all.filter(a => a.payment_status === 'held').reduce((s, a) => s + ((a.fee || 0) * (1 - commission)), 0),
      });

      setTransactions(all);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Earnings</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: COLORS.doctorColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Earnings</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>
            ${stats.total.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            After {doctorProfile.commission_rate || 10}% platform commission
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'This Month', value: stats.thisMonth, icon: '📅', color: '#EFF6FF' },
            { label: 'Pending', value: stats.pending, icon: '🔒', color: '#FFF7ED' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.color, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>${s.value.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Transaction History</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.doctorColor} />
        ) : transactions.length === 0 ? (
          <Card><Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>No transactions yet</Text></Card>
        ) : (
          transactions.map((item) => {
            const commission = (doctorProfile.commission_rate || 10) / 100;
            const net = (item.fee || 0) * (1 - commission);
            return (
              <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.payment_status === 'released' ? '#F0FDF4' : '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 22 }}>{item.payment_status === 'released' ? '✅' : '🔒'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.appointment_date} • {item.appointment_type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.payment_status === 'released' ? COLORS.success : COLORS.warning }}>
                    ${net.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 10, color: COLORS.textLight }}>of ${item.fee}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function DoctorProfileView({ user, profile, doctorProfile, onLogout, onEdit }) {
  const { setShowNotifications } = useApp();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>👨‍⚕️</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 }}>Dr. {profile.full_name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{doctorProfile.specialty}</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>📍 {doctorProfile.location}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>✅ Verified Doctor</Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '⭐', label: 'Rating', value: doctorProfile.rating?.toFixed(1) || 'New' },
            { icon: '💬', label: 'Reviews', value: doctorProfile.total_reviews || 0 },
            { icon: '💰', label: 'Earnings', value: `$${(doctorProfile.total_earnings || 0).toFixed(0)}` },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.doctorColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Button label="✏️ Edit Profile" onPress={onEdit} color={COLORS.doctorColor} style={{ marginBottom: 16 }} />

        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '💳', label: 'Payment Details' },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '📞', label: 'Contact Admin' },
            { icon: '❓', label: 'Help & Support' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0 • Doctor Portal{'\n'}© 2026 Reine Mande Ltd.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

function DoctorProfileEditor({ user, profile, doctorProfile, onBack, onSaved }) {
  const [form, setForm] = useState({
    bio: doctorProfile.bio || '',
    consultationFee: String(doctorProfile.consultation_fee || ''),
    videoFee: String(doctorProfile.video_call_fee || ''),
    hospital: doctorProfile.hospital_affiliation || '',
    location: doctorProfile.location || '',
    phone: profile.phone || '',
  });
  const [isAvailable, setIsAvailable] = useState(doctorProfile.is_available || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('doctor_profiles').update({
        bio: form.bio,
        consultation_fee: parseFloat(form.consultationFee) || 0,
        video_call_fee: parseFloat(form.videoFee) || 0,
        hospital_affiliation: form.hospital,
        location: form.location,
        is_available: isAvailable,
      }).eq('id', doctorProfile.id);
      await supabase.from('profiles').update({ phone: form.phone }).eq('id', user.id);
      Alert.alert('Saved ✅', 'Your profile has been updated.');
      onSaved();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.doctorColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>Available for Bookings</Text>
            <Text style={{ fontSize: 12, color: COLORS.textLight }}>Patients can book you when on</Text>
          </View>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: COLORS.border, true: COLORS.success }} />
        </View>
        <Input label="Location" value={form.location} onChangeText={(v) => setForm({ ...form, location: v })} placeholder="e.g. London, UK" icon="📍" />
        <Input label="Hospital / Clinic" value={form.hospital} onChangeText={(v) => setForm({ ...form, hospital: v })} placeholder="e.g. St. Mary's Hospital" icon="🏥" />
        <Input label="Phone Number" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="+44 7000 000000" keyboard="phone-pad" icon="📞" />
        <Input label="In-Person Fee (USD)" value={form.consultationFee} onChangeText={(v) => setForm({ ...form, consultationFee: v })} placeholder="e.g. 150" keyboard="numeric" icon="💵" />
        <Input label="Video Call Fee (USD)" value={form.videoFee} onChangeText={(v) => setForm({ ...form, videoFee: v })} placeholder="e.g. 120" keyboard="numeric" icon="📹" />
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Professional Bio</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, height: 120, textAlignVertical: 'top', backgroundColor: COLORS.lightGray }}
            placeholder="Describe your experience..."
            value={form.bio}
            onChangeText={(v) => setForm({ ...form, bio: v })}
            multiline
          />
        </View>
        <Button label="💾 Save Changes" onPress={handleSave} loading={saving} color={COLORS.doctorColor} style={{ marginBottom: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// PHARMACY SHELL
// ============================================
function PharmacyShell({ profile, pharmacyProfile: initialPharmacyProfile, onLogout }) {
  const { user, setShowNotifications } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [pharmacyProfile, setPharmacyProfile] = useState(initialPharmacyProfile);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) return;
    const sub = supabase
      .channel(`pharmacy_notif_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setToast({
          title: payload.new.title,
          body: payload.new.body,
          icon: payload.new.data?.icon || '🔔',
        });
      })
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [user]);

  const refreshPharmacy = async () => {
    const { data } = await supabase.from('pharmacy_profiles').select('*').eq('user_id', user.id).single();
    if (data) setPharmacyProfile(data);
  };

  const navigate = (screenName, params = {}) => {
    setScreen(screenName);
    setScreenParams(params);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setScreen(tabName);
    setScreenParams({});
  };

  if (screen === 'editProfile') {
    return (
      <PharmacyProfileEditor
        user={user}
        pharmacyProfile={pharmacyProfile}
        onBack={() => switchTab('profile')}
        onSaved={() => { refreshPharmacy(); switchTab('profile'); }}
      />
    );
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <PharmacyHome
            user={user}
            profile={profile}
            pharmacyProfile={pharmacyProfile}
            onNavigate={(s, p = {}) => {
              if (tabs.find(t => t.id === s)) switchTab(s);
              else navigate(s, p);
            }}
          />
        )}
        {activeTab === 'orders' && <PharmacyOrders user={user} pharmacyProfile={pharmacyProfile} />}
        {activeTab === 'inventory' && <PharmacyInventory pharmacyProfile={pharmacyProfile} />}
        {activeTab === 'earnings' && <PharmacyEarnings pharmacyProfile={pharmacyProfile} />}
        {activeTab === 'profile' && (
          <PharmacyProfileView
            user={user}
            profile={profile}
            pharmacyProfile={pharmacyProfile}
            onLogout={onLogout}
            onEdit={() => navigate('editProfile')}
          />
        )}
      </View>

      <ToastNotification message={toast} visible={!!toast} onHide={() => setToast(null)} />

      <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => switchTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.pharmacyColor, borderRadius: 2, marginBottom: 4 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.pharmacyColor : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function PharmacyHome({ user, profile, pharmacyProfile, onNavigate }) {
  const { setShowNotifications } = useApp();
  const [stats, setStats] = useState({ todayOrders: 0, pendingOrders: 0, activeDeliveries: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('pharmacy_id', pharmacyProfile.id)
        .order('created_at', { ascending: false });
      const all = orders || [];
      setStats({
        todayOrders: all.filter(o => o.created_at?.startsWith(today)).length,
        pendingOrders: all.filter(o => o.status === 'pending').length,
        activeDeliveries: all.filter(o => o.status === 'out_for_delivery').length,
      });
      setRecentOrders(all.slice(0, 5));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDashboard(); }} />}
    >
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Pharmacy Dashboard 🏪</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{pharmacyProfile.pharmacy_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>📍 {pharmacyProfile.city}, {pharmacyProfile.country}</Text>
          </View>
          <NotificationBell userId={user?.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📦', label: "Today's Orders", value: stats.todayOrders, color: '#F0FDF4', textColor: COLORS.pharmacyColor },
            { icon: '⏳', label: 'Pending', value: stats.pendingOrders, color: '#FFF7ED', textColor: COLORS.warning },
            { icon: '🚚', label: 'Active Deliveries', value: stats.activeDeliveries, color: '#EFF6FF', textColor: COLORS.doctorColor },
            { icon: '💰', label: 'Total Earnings', value: `$${(pharmacyProfile.total_earnings || 0).toFixed(0)}`, color: '#F5F3FF', textColor: COLORS.adminColor },
          ].map((stat) => (
            <View key={stat.label} style={{ width: (width - 52) / 2, backgroundColor: stat.color, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📦', label: 'Orders', screen: 'orders' },
            { icon: '💊', label: 'Inventory', screen: 'inventory' },
            { icon: '💰', label: 'Earnings', screen: 'earnings' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Recent Orders</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.pharmacyColor} />
        ) : recentOrders.length === 0 ? (
          <Card>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>📦</Text>
              <Text style={{ fontSize: 15, color: COLORS.textLight }}>No orders yet</Text>
            </View>
          </Card>
        ) : (
          recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: order.status === 'delivered' ? COLORS.success : order.status === 'pending' ? COLORS.warning : COLORS.pharmacyColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              onPress={() => onNavigate('orders')}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{order.patient_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{(order.items || []).length} items • ${order.total_amount?.toFixed(2)}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function PharmacyOrders({ user, pharmacyProfile }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'pending', label: '⏳ Pending' },
    { id: 'confirmed', label: '✅ Confirmed' },
    { id: 'preparing', label: '⚗️ Preparing' },
    { id: 'out_for_delivery', label: '🚚 Delivering' },
    { id: 'delivered', label: '📦 Delivered' },
    { id: 'cancelled', label: '❌ Cancelled' },
  ];

  useEffect(() => { fetchOrders(); }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('pharmacy_id', pharmacyProfile.id)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (order, newStatus, notifyMsg) => {
    await supabase.from('orders').update({
      status: newStatus,
      pharmacy_confirmed: newStatus !== 'pending',
      pharmacy_confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : order.pharmacy_confirmed_at,
      delivered_at: newStatus === 'delivered' ? new Date().toISOString() : null,
      payment_status: newStatus === 'delivered' ? 'released' : order.payment_status,
    }).eq('id', order.id);

    if (newStatus === 'delivered') {
      const commission = (order.total_amount || 0) * ((pharmacyProfile.commission_rate || 10) / 100);
      const net = (order.total_amount || 0) - commission;
      await supabase.from('pharmacy_profiles').update({
        total_earnings: (pharmacyProfile.total_earnings || 0) + net,
      }).eq('id', pharmacyProfile.id);
      await supabase.from('commissions').insert({
        order_id: order.id,
        from_user_id: order.patient_id,
        amount: commission,
        status: 'collected',
        collected_at: new Date().toISOString(),
      });
    }

    await supabase.from('notifications').insert({
      user_id: order.patient_id,
      title: notifyMsg.title,
      body: notifyMsg.body,
      type: 'order',
      data: { icon: '📦' },
    });
    fetchOrders();
  };

  const handleConfirm = (order) => {
    Alert.alert('Confirm Order', `Confirm order from ${order.patient_name} for $${order.total_amount?.toFixed(2)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm ✅', onPress: () => updateOrderStatus(order, 'confirmed', {
          title: '✅ Order Confirmed!',
          body: `${pharmacyProfile.pharmacy_name} confirmed your order. They are now preparing it.`,
        })
      }
    ]);
  };

  const handleReject = (order) => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject', style: 'destructive', onPress: async () => {
          const reason = 'Items unavailable';
          await supabase.from('orders').update({
            status: 'cancelled',
            pharmacy_cancel_reason: reason,
            payment_status: 'refunded',
          }).eq('id', order.id);
          await supabase.from('notifications').insert({
            user_id: order.patient_id,
            title: '❌ Order Rejected',
            body: `Your order was rejected by ${pharmacyProfile.pharmacy_name}. Reason: ${reason}. Your payment will be refunded.`,
            type: 'order',
            data: { icon: '❌' },
          });
          const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
          if (admins && admins.length > 0) {
            await supabase.from('notifications').insert(
              admins.map(a => ({
                user_id: a.id,
                title: '↩️ Refund Required',
                body: `${pharmacyProfile.pharmacy_name} rejected order for ${order.patient_name}. Refund of $${order.total_amount?.toFixed(2)} needed.`,
                type: 'refund',
                data: { icon: '↩️' },
              }))
            );
          }
          fetchOrders();
        }
      }
    ]);
  };

  const statusFlow = {
    confirmed: { next: 'preparing', label: '⚗️ Start Preparing', notify: { title: '⚗️ Preparing Your Order', body: 'Your medications are being prepared.' } },
    preparing: { next: 'out_for_delivery', label: '🚚 Out for Delivery', notify: { title: '🚚 On the Way!', body: 'Your order is out for delivery!' } },
    out_for_delivery: { next: 'delivered', label: '📦 Mark Delivered', notify: { title: '📦 Order Delivered!', body: 'Your order has been delivered. Please leave a review!' } },
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 16, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: activeTab === tab.id ? COLORS.white : 'rgba(255,255,255,0.2)' }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === tab.id ? COLORS.pharmacyColor : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.pharmacyColor} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} />}
          ListEmptyComponent={<EmptyState icon="📦" title={`No ${activeTab} orders`} subtitle="Pull down to refresh" />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.patient_age}yr • {item.patient_gender}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {item.delivery_reason && (
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 2 }}>Reason</Text>
                  <Text style={{ fontSize: 13, color: COLORS.text }}>{item.delivery_reason}</Text>
                </View>
              )}

              <View style={{ marginBottom: 10 }}>
                {(item.items || []).map((med, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: i < item.items.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}>
                    <Text style={{ fontSize: 13, color: COLORS.text }}>{med.name} × {med.quantity}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.pharmacyColor }}>${(med.price * med.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>${item.total_amount?.toFixed(2)}</Text>
                <StatusBadge status={item.payment_status} />
              </View>

              {item.delivery_address && (
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 10 }}>📍 {item.delivery_address}</Text>
              )}

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => handleConfirm(item)}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>✅ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.error, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => handleReject(item)}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>❌ Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {statusFlow[item.status] && (
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: COLORS.pharmacyColor, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                    onPress={() => updateOrderStatus(item, statusFlow[item.status].next, statusFlow[item.status].notify)}
                  >
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{statusFlow[item.status].label}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

function PharmacyInventory({ pharmacyProfile }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', requires_prescription: false, in_stock: true, stock_quantity: '', icon: '💊' });
  const categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Digestive', 'Allergy', 'Cardiovascular', 'Diabetes', 'Skincare', 'Other'];
  const icons = ['💊', '💉', '🌟', '🔵', '🟡', '🟢', '🧴', '🩺'];

  useEffect(() => { fetchMedications(); }, []);

  const fetchMedications = async () => {
    const { data } = await supabase.from('medications').select('*').eq('pharmacy_id', pharmacyProfile.id).order('name');
    setMedications(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: '', category: '', description: '', price: '', requires_prescription: false, in_stock: true, stock_quantity: '', icon: '💊' });
    setEditingMed(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { Alert.alert('Error', 'Name and price are required'); return; }
    try {
      if (editingMed) {
        await supabase.from('medications').update({
          name: form.name, category: form.category, description: form.description,
          price: parseFloat(form.price), requires_prescription: form.requires_prescription,
          in_stock: form.in_stock, stock_quantity: parseInt(form.stock_quantity) || 0, icon: form.icon,
        }).eq('id', editingMed.id);
      } else {
        await supabase.from('medications').insert({
          pharmacy_id: pharmacyProfile.id,
          name: form.name, category: form.category, description: form.description,
          price: parseFloat(form.price), requires_prescription: form.requires_prescription,
          in_stock: form.in_stock, stock_quantity: parseInt(form.stock_quantity) || 0, icon: form.icon,
        });
      }
      setShowModal(false);
      resetForm();
      fetchMedications();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (med) => {
    Alert.alert('Delete', `Remove ${med.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await supabase.from('medications').delete().eq('id', med.id); fetchMedications(); } }
    ]);
  };

  const openEdit = (med) => {
    setEditingMed(med);
    setForm({ name: med.name, category: med.category || '', description: med.description || '', price: String(med.price), requires_prescription: med.requires_prescription, in_stock: med.in_stock, stock_quantity: String(med.stock_quantity || ''), icon: med.icon || '💊' });
    setShowModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Inventory</Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}
            onPress={() => { resetForm(); setShowModal(true); }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.pharmacyColor }}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.pharmacyColor} />
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<EmptyState icon="💊" title="No medications yet" subtitle="Tap + Add to add your first medication" />}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{item.category}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.pharmacyColor }}>${item.price}</Text>
                  <View style={{ backgroundColor: item.in_stock ? '#F0FDF4' : '#FEE2E2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 11, color: item.in_stock ? COLORS.success : COLORS.error, fontWeight: '600' }}>
                      {item.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => openEdit(item)} style={{ padding: 8 }}><Text style={{ fontSize: 18 }}>✏️</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 8 }}><Text style={{ fontSize: 18 }}>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: COLORS.white }}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{editingMed ? 'Edit Medication' : 'Add Medication'}</Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20 }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Icon</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {icons.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: form.icon === ic ? COLORS.pharmacyColor : COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => setForm({ ...form, icon: ic })}
                  >
                    <Text style={{ fontSize: 22 }}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Input label="Medication Name *" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Paracetamol 500mg" icon="💊" />
            <Input label="Price (USD) *" value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} placeholder="e.g. 5.99" keyboard="numeric" icon="💵" />
            <Input label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} placeholder="Brief description" icon="📝" />
            <Input label="Stock Quantity" value={form.stock_quantity} onChangeText={(v) => setForm({ ...form, stock_quantity: v })} placeholder="e.g. 100" keyboard="numeric" icon="📦" />
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: form.category === cat ? COLORS.pharmacyColor : COLORS.white, borderWidth: 1, borderColor: form.category === cat ? COLORS.pharmacyColor : COLORS.border }}
                      onPress={() => setForm({ ...form, category: cat })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.category === cat ? COLORS.white : COLORS.text }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            {[
              { key: 'in_stock', label: 'In Stock', icon: '✅' },
              { key: 'requires_prescription', label: 'Requires Prescription', icon: '📋' },
            ].map((toggle) => (
              <View key={toggle.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 20 }}>{toggle.icon}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{toggle.label}</Text>
                </View>
                <Switch
                  value={form[toggle.key]}
                  onValueChange={(v) => setForm({ ...form, [toggle.key]: v })}
                  trackColor={{ false: COLORS.border, true: COLORS.pharmacyColor }}
                />
              </View>
            ))}
            <Button label={`💾 ${editingMed ? 'Save Changes' : 'Add Medication'}`} onPress={handleSave} color={COLORS.pharmacyColor} style={{ marginBottom: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function PharmacyEarnings({ pharmacyProfile }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, pending: 0 });

  useEffect(() => { fetchEarnings(); }, []);

  const fetchEarnings = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('pharmacy_id', pharmacyProfile.id)
      .in('payment_status', ['released', 'held'])
      .order('created_at', { ascending: false });
    const all = data || [];
    const now = new Date();
    const commission = (pharmacyProfile.commission_rate || 10) / 100;
    const thisMonth = all.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.payment_status === 'released';
    });
    setStats({
      total: pharmacyProfile.total_earnings || 0,
      thisMonth: thisMonth.reduce((s, o) => s + ((o.total_amount || 0) * (1 - commission)), 0),
      pending: all.filter(o => o.payment_status === 'held').reduce((s, o) => s + ((o.total_amount || 0) * (1 - commission)), 0),
    });
    setOrders(all);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Earnings</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: COLORS.pharmacyColor, borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Total Earnings</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 }}>${stats.total.toFixed(2)}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>After {pharmacyProfile.commission_rate || 10}% platform commission</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'This Month', value: stats.thisMonth, icon: '📅', color: '#F0FDF4' },
            { label: 'Pending', value: stats.pending, icon: '🔒', color: '#FFF7ED' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.color, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>${s.value.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{s.label}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Order History</Text>
        {loading ? <ActivityIndicator color={COLORS.pharmacyColor} /> : orders.map((item) => {
          const commission = (pharmacyProfile.commission_rate || 10) / 100;
          const net = (item.total_amount || 0) * (1 - commission);
          return (
            <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.payment_status === 'released' ? '#F0FDF4' : '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 22 }}>{item.payment_status === 'released' ? '✅' : '🔒'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.patient_name}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{(item.items || []).length} items • {new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: item.payment_status === 'released' ? COLORS.success : COLORS.warning }}>${net.toFixed(2)}</Text>
                <Text style={{ fontSize: 10, color: COLORS.textLight }}>of ${item.total_amount?.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function PharmacyProfileView({ user, profile, pharmacyProfile, onLogout, onEdit }) {
  const { setShowNotifications } = useApp();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 40 }}>🏪</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 2 }}>{pharmacyProfile.pharmacy_name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>📍 {pharmacyProfile.address}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 }}>
          <Text style={{ fontSize: 13, color: COLORS.white }}>✅ Verified Pharmacy</Text>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '⭐', label: 'Rating', value: pharmacyProfile.rating?.toFixed(1) || 'New' },
            { icon: '💬', label: 'Reviews', value: pharmacyProfile.total_reviews || 0 },
            { icon: '💰', label: 'Earnings', value: `$${(pharmacyProfile.total_earnings || 0).toFixed(0)}` },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.pharmacyColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <Button label="✏️ Edit Profile" onPress={onEdit} color={COLORS.pharmacyColor} style={{ marginBottom: 16 }} />
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => setShowNotifications(true) },
            { icon: '🕐', label: pharmacyProfile.is_open_24h ? 'Open 24 Hours' : 'Limited Hours' },
            { icon: '🚚', label: `Delivery Radius: ${pharmacyProfile.delivery_radius_km}km` },
            { icon: '📞', label: 'Contact Admin' },
            { icon: '❓', label: 'Help & Support' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 18, color: COLORS.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: COLORS.error + '15', borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 }}
          onPress={onLogout}
        >
          <Text style={{ fontSize: 20 }}>🚪</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>Log Out</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>
          MediConnect v2.0 • Pharmacy Portal{'\n'}© 2026 Reine Mande Ltd.
        </Text>
        <View style={{ height: 20 }} />
      </View>
    </ScrollView>
  );
}

function PharmacyProfileEditor({ user, pharmacyProfile, onBack, onSaved }) {
  const [form, setForm] = useState({
    pharmacyName: pharmacyProfile.pharmacy_name || '',
    address: pharmacyProfile.address || '',
    city: pharmacyProfile.city || '',
    country: pharmacyProfile.country || '',
    phone: pharmacyProfile.phone || '',
    deliveryRadius: String(pharmacyProfile.delivery_radius_km || 10),
    isOpen24h: pharmacyProfile.is_open_24h || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('pharmacy_profiles').update({
        pharmacy_name: form.pharmacyName,
        address: form.address,
        city: form.city,
        country: form.country,
        phone: form.phone,
        delivery_radius_km: parseInt(form.deliveryRadius) || 10,
        is_open_24h: form.isOpen24h,
      }).eq('id', pharmacyProfile.id);
      Alert.alert('Saved ✅', 'Pharmacy profile updated.');
      onSaved();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.pharmacyColor, paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: COLORS.white }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Edit Profile</Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Input label="Pharmacy Name" value={form.pharmacyName} onChangeText={(v) => setForm({ ...form, pharmacyName: v })} placeholder="Pharmacy name" icon="🏪" />
        <Input label="Address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} placeholder="Street address" icon="📍" />
        <Input label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} placeholder="City" icon="🏙️" />
        <Input label="Country" value={form.country} onChangeText={(v) => setForm({ ...form, country: v })} placeholder="Country" icon="🌍" />
        <Input label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="+44 20 1234 5678" keyboard="phone-pad" icon="📞" />
        <Input label="Delivery Radius (km)" value={form.deliveryRadius} onChangeText={(v) => setForm({ ...form, deliveryRadius: v })} placeholder="10" keyboard="numeric" icon="🚚" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 20 }}>🕐</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Open 24 Hours</Text>
          </View>
          <Switch value={form.isOpen24h} onValueChange={(v) => setForm({ ...form, isOpen24h: v })} trackColor={{ false: COLORS.border, true: COLORS.pharmacyColor }} />
        </View>
        <Button label="💾 Save Changes" onPress={handleSave} loading={saving} color={COLORS.pharmacyColor} style={{ marginBottom: 40 }} />
      </ScrollView>
    </View>
  );
}
