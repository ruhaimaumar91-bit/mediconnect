import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
  InteractionManager,
  AppState,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://zwkxmayoknvfpxshhbzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3a3htYXlva252ZnB4c2hoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTE5MTgsImV4cCI6MjA1OTk2NzkxOH0.24GuRH1YtSC3uJ1sD-J7TE00yWfATcoAWo0_ilQyo3Sc';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── AGORA ────────────────────────────────────────────────────────────────────
const AGORA_APP_ID = '94855af449ce443d98a45a14f0adc897';

// ─── COMMISSION ───────────────────────────────────────────────────────────────
const DEFAULT_COMMISSION_RATE = 15;

// ─── COLORS ───────────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#2A9D8F',
  primaryLight: '#E8F5F3',
  secondary: '#264653',
  accent: '#E76F51',
  admin: '#1B4332',
  white: '#FFFFFF',
  gray: '#6B7280',
  textLight: '#9CA3AF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  text: '#1F2937',
  background: '#F9FAFB',
  border: '#E5E7EB',
  lightGray: '#F3F4F6',
};

// ─── NOTIFICATIONS CONFIG ─────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── AGORA ────────────────────────────────────────────────────────────────────
const AGORA_APP_ID = '94855af449ce443d98a45a14f0adc897';

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
};

const TRANSLATIONS = {
  en: {
    welcome: 'Welcome back 👋',
    goodDay: 'Good day 👋',
    findDoctor: 'Find Doctor',
    pharmacy: 'Pharmacy',
    myBookings: 'My Bookings',
    messages: 'Messages',
    home: 'Home',
    search: 'Search',
    bookings: 'Bookings',
    records: 'Records',
    profile: 'Profile',
    map: 'Map',
    logOut: 'Log Out',
    bookAppointment: 'Book Appointment',
    messageDoctor: 'Message Doctor',
    findADoctor: 'Find a Doctor 🔍',
    searchPlaceholder: 'Name, specialty, location...',
    noResults: 'No Doctors Found',
    perSession: 'per hour',
    videoCall: 'Video Call',
    physicalVisit: 'Physical Visit',
    available: 'Available',
    notAvailable: 'Not Available',
    rating: 'Rating',
    reviews: 'reviews',
    experience: 'yrs exp',
    howCanWeHelp: 'How can we help you today?',
    medicationsDelivered: '💊 Medications Delivered',
    getMemsDelivered: 'Get meds delivered fast to your door',
    orderNow: 'Order Now',
    howItWorks: 'How It Works',
    notifications: 'Notifications 🔔',
    noNotifications: 'No Notifications',
    allCaughtUp: "You're all caught up!",
    clearAll: 'Clear All',
    complete: 'Complete',
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    next: 'Next',
    back: 'Back',
    loading: 'Loading...',
  },
  fr: {
    welcome: 'Bon retour 👋',
    goodDay: 'Bonjour 👋',
    findDoctor: 'Trouver Médecin',
    pharmacy: 'Pharmacie',
    myBookings: 'Mes Réservations',
    messages: 'Messages',
    home: 'Accueil',
    search: 'Rechercher',
    bookings: 'Réservations',
    records: 'Dossiers',
    profile: 'Profil',
    map: 'Carte',
    logOut: 'Se Déconnecter',
    bookAppointment: 'Prendre Rendez-vous',
    messageDoctor: 'Envoyer Message',
    findADoctor: 'Trouver un Médecin 🔍',
    searchPlaceholder: 'Nom, spécialité, lieu...',
    noResults: 'Aucun Médecin Trouvé',
    perSession: 'par heure',
    videoCall: 'Appel Vidéo',
    physicalVisit: 'Visite Physique',
    available: 'Disponible',
    notAvailable: 'Non Disponible',
    rating: 'Note',
    reviews: 'avis',
    experience: 'ans exp',
    howCanWeHelp: "Comment pouvons-nous vous aider aujourd'hui?",
    medicationsDelivered: '💊 Médicaments Livrés',
    getMemsDelivered: 'Recevez vos médicaments rapidement',
    orderNow: 'Commander',
    howItWorks: 'Comment Ça Marche',
    notifications: 'Notifications 🔔',
    noNotifications: 'Aucune Notification',
    allCaughtUp: 'Vous êtes à jour!',
    clearAll: 'Tout Effacer',
    complete: 'Terminé',
    pending: 'En Attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    submit: 'Soumettre',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    next: 'Suivant',
    back: 'Retour',
    loading: 'Chargement...',
  },
  ar: {
    welcome: 'مرحباً بعودتك 👋',
    goodDay: 'يوم سعيد 👋',
    findDoctor: 'ابحث عن طبيب',
    pharmacy: 'صيدلية',
    myBookings: 'حجوزاتي',
    messages: 'الرسائل',
    home: 'الرئيسية',
    search: 'بحث',
    bookings: 'الحجوزات',
    records: 'السجلات',
    profile: 'الملف',
    map: 'الخريطة',
    logOut: 'تسجيل الخروج',
    bookAppointment: 'حجز موعد',
    messageDoctor: 'مراسلة الطبيب',
    findADoctor: 'ابحث عن طبيب 🔍',
    searchPlaceholder: 'الاسم، التخصص، الموقع...',
    noResults: 'لا يوجد أطباء',
    perSession: 'في الساعة',
    videoCall: 'مكالمة فيديو',
    physicalVisit: 'زيارة شخصية',
    available: 'متاح',
    notAvailable: 'غير متاح',
    rating: 'التقييم',
    reviews: 'تقييمات',
    experience: 'سنوات خبرة',
    howCanWeHelp: 'كيف يمكننا مساعدتك اليوم؟',
    medicationsDelivered: '💊 توصيل الأدوية',
    getMemsDelivered: 'احصل على أدويتك بسرعة',
    orderNow: 'اطلب الآن',
    howItWorks: 'كيف يعمل',
    notifications: 'الإشعارات 🔔',
    noNotifications: 'لا توجد إشعارات',
    allCaughtUp: 'أنت على اطلاع بكل شيء!',
    clearAll: 'مسح الكل',
    complete: 'مكتمل',
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغي',
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    next: 'التالي',
    back: 'رجوع',
    loading: 'جاري التحميل...',
  },
  es: {
    welcome: 'Bienvenido de nuevo 👋',
    goodDay: 'Buenos días 👋',
    findDoctor: 'Buscar Médico',
    pharmacy: 'Farmacia',
    myBookings: 'Mis Reservas',
    messages: 'Mensajes',
    home: 'Inicio',
    search: 'Buscar',
    bookings: 'Reservas',
    records: 'Registros',
    profile: 'Perfil',
    map: 'Mapa',
    logOut: 'Cerrar Sesión',
    bookAppointment: 'Reservar Cita',
    messageDoctor: 'Mensaje al Médico',
    findADoctor: 'Buscar Médico 🔍',
    searchPlaceholder: 'Nombre, especialidad, ubicación...',
    noResults: 'No Se Encontraron Médicos',
    perSession: 'por hora',
    videoCall: 'Videollamada',
    physicalVisit: 'Visita Física',
    available: 'Disponible',
    notAvailable: 'No Disponible',
    rating: 'Calificación',
    reviews: 'reseñas',
    experience: 'años exp',
    howCanWeHelp: '¿Cómo podemos ayudarte hoy?',
    medicationsDelivered: '💊 Medicamentos a Domicilio',
    getMemsDelivered: 'Recibe tus medicamentos rápido',
    orderNow: 'Pedir Ahora',
    howItWorks: 'Cómo Funciona',
    notifications: 'Notificaciones 🔔',
    noNotifications: 'Sin Notificaciones',
    allCaughtUp: '¡Estás al día!',
    clearAll: 'Borrar Todo',
    complete: 'Completado',
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    submit: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    next: 'Siguiente',
    back: 'Atrás',
    loading: 'Cargando...',
  },
};

// ─── LANGUAGE CONTEXT ─────────────────────────────────────────────────────────
const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

function useLanguage() {
  return React.useContext(LanguageContext);
}

// ─── PERFORMANCE UTILITIES ────────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

async function cachedFetch(key, fetcher, maxAge = CACHE_DURATION) {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < maxAge) return cached.data;
  const data = await fetcher();
  dataCache.set(key, { data, timestamp: Date.now() });
  return data;
}

function clearCache(keyPrefix) {
  if (keyPrefix) {
    for (const key of dataCache.keys()) {
      if (key.startsWith(keyPrefix)) dataCache.delete(key);
    }
  } else {
    dataCache.clear();
  }
}

async function robustQuery(queryFn, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data, error } = await queryFn();
      if (error) throw error;
      return data;
    } catch (error) {
      if (attempt === retries) { console.log('Query failed:', error.message); return null; }
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

function runAfterInteractions(callback) {
  InteractionManager.runAfterInteractions(callback);
}

async function registerForPushNotifications(userId) {
  if (!Device.isDevice) return null;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return null;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId: 'your-expo-project-id' });
    const token = tokenData.data;
    await supabase.from('push_tokens').upsert({ user_id: userId, token, platform: Platform.OS, updated_at: new Date().toISOString() });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'ReineCare',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2A9D8F',
      });
    }
    return token;
  } catch (error) {
    console.log('Push notification error:', error.message);
    return null;
  }
}
// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: COLORS.background }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>Something went wrong</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>ReineCare encountered an unexpected error. Please restart the app.</Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

// ─── SKELETON COMPONENTS ──────────────────────────────────────────────────────
const SkeletonBox = memo(function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const animValue = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(animValue, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);
  return (
    <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#E5E7EB', opacity: animValue }, style]} />
  );
});

function DoctorCardSkeleton() {
  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, marginHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <SkeletonBox width={56} height={56} borderRadius={16} style={{ marginRight: 14 }} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="70%" height={16} />
          <SkeletonBox width="50%" height={12} />
          <SkeletonBox width="80%" height={12} />
        </View>
      </View>
    </View>
  );
}

function BookingCardSkeleton() {
  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <SkeletonBox width={50} height={50} borderRadius={14} style={{ marginRight: 14 }} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="60%" height={15} />
          <SkeletonBox width="80%" height={12} />
          <SkeletonBox width="40%" height={12} />
        </View>
        <SkeletonBox width={60} height={26} borderRadius={10} />
      </View>
    </View>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => onDone());
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.05)', top: -100, right: -100 }} />
      <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -80, left: -80 }} />
      <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)', top: 100, left: -60 }} />
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <View style={{ width: 100, height: 100, borderRadius: 28, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 }}>
          <Text style={{ fontSize: 52 }}>🏥</Text>
        </View>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>ReineCare</Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', letterSpacing: 2 }}>HEALTHCARE REIMAGINED</Text>
        </Animated.View>
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim, position: 'absolute', bottom: 60 }}>
        <ActivityIndicator color="rgba(255,255,255,0.6)" size="small" />
      </Animated.View>
    </View>
  );
}

// ─── ONBOARDING SCREEN ────────────────────────────────────────────────────────
function OnboardingScreen({ onDone, onLogin }) {
  const [currentPage, setCurrentPage] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;

  const pages = [
    {
      id: 1,
      emoji: '👨‍⚕️',
      emojiBackground: '#DBEAFE',
      title: 'Find the Right Doctor',
      subtitle: 'Instantly',
      description: 'Browse hundreds of verified doctors by specialty, location and availability. Book appointments in minutes.',
      features: ['🔍 Advanced doctor search', '⭐ Verified reviews & ratings', '📍 Find doctors near you'],
    },
    {
      id: 2,
      emoji: '📹',
      emojiBackground: '#D1FAE5',
      title: 'Consult From',
      subtitle: 'Anywhere',
      description: 'Video consultations and physical appointments — healthcare that fits your lifestyle and schedule.',
      features: ['📹 HD video consultations', '🏥 Physical visit booking', '⏰ Flexible scheduling'],
    },
    {
      id: 3,
      emoji: '💊',
      emojiBackground: '#FEF3C7',
      title: 'Pharmacy',
      subtitle: 'Delivered',
      description: 'Order medications from verified pharmacies and get them delivered straight to your door.',
      features: ['🚀 Fast delivery', '✅ Verified pharmacies', '💳 Secure payments'],
    },
    {
      id: 4,
      emoji: '🔒',
      emojiBackground: '#EDE9FE',
      title: 'Your Health',
      subtitle: 'Secured',
      description: 'Your medical data is encrypted and private. Full control over who sees your health information.',
      features: ['🔒 End-to-end encryption', '📋 Digital prescriptions', '❤️ Health tracking'],
    },
  ];

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: (currentPage + 1) / pages.length, duration: 400, useNativeDriver: false }).start();
  }, [currentPage]);

  const animateTransition = (nextPage) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.spring(cardScaleAnim, { toValue: 0.95, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start(() => {
      setCurrentPage(nextPage);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.spring(cardScaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    if (currentPage < pages.length - 1) animateTransition(currentPage + 1);
    else onDone();
  };

  const goPrev = () => {
    if (currentPage > 0) animateTransition(currentPage - 1);
  };

  const page = pages[currentPage];
  const isLast = currentPage === pages.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.04)', top: -80, right: -80 }} />
        <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 200, left: -60 }} />
      </View>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>🏥</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>ReineCare</Text>
        </View>
        <TouchableOpacity onPress={onDone} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
          <Text style={{ fontSize: 14, color: COLORS.white, fontWeight: '600' }}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 24, marginTop: 20, height: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
        <Animated.View style={{ height: 3, backgroundColor: COLORS.white, borderRadius: 2, width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {pages.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => animateTransition(index)} style={{ height: 6, width: currentPage === index ? 24 : 6, borderRadius: 3, backgroundColor: currentPage === index ? COLORS.white : 'rgba(255,255,255,0.3)' }} />
        ))}
      </View>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: cardScaleAnim }], paddingHorizontal: 24, paddingTop: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 130, height: 130, borderRadius: 36, backgroundColor: page.emojiBackground, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }}>
            <Text style={{ fontSize: 70 }}>{page.emoji}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: COLORS.white, textAlign: 'center', lineHeight: 38 }}>{page.title}</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: COLORS.accent, textAlign: 'center', lineHeight: 38 }}>{page.subtitle}</Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24, marginTop: 12, maxWidth: 300 }}>{page.description}</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, gap: 12 }}>
          {page.features.map((feature, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>{feature.split(' ')[0]}</Text>
              </View>
              <Text style={{ fontSize: 15, color: COLORS.white, flex: 1 }}>{feature.split(' ').slice(1).join(' ')}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20, gap: 12 }}>
        <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 18, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }} onPress={goNext} activeOpacity={0.9}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.secondary }}>{isLast ? '🚀 Get Started' : 'Continue'}</Text>
          {!isLast && <Text style={{ fontSize: 18, color: COLORS.secondary }}>→</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 14, alignItems: 'center' }} onPress={onLogin}>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Already have an account? <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Sign In</Text></Text>
        </TouchableOpacity>
        {currentPage > 0 && (
          <TouchableOpacity style={{ paddingVertical: 8, alignItems: 'center' }} onPress={goPrev}>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>← Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password'); return; }
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (authError) throw authError;
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      onLogin(data.user, profileData);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 60, paddingBottom: 50, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
          <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
          <View style={{ position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: -30 }} />
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 42 }}>🏥</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>Welcome Back!</Text>
            <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>Sign in to your ReineCare account</Text>
          </Animated.View>
        </View>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], padding: 24, paddingTop: 32 }}>
          {error !== '' && (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
              <Text style={{ fontSize: 13, color: '#991B1B', flex: 1 }}>{error}</Text>
            </View>
          )}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Email Address</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1.5, borderColor: email ? COLORS.primary : COLORS.border, paddingHorizontal: 16, elevation: 1 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>📧</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Password</Text>
              <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Enter your email to receive a reset link', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Reset Link', onPress: async () => {
                  if (!email) { Alert.alert('Enter Email', 'Please enter your email first'); return; }
                  await supabase.auth.resetPasswordForEmail(email);
                  Alert.alert('Sent! ✅', 'Check your email for the reset link');
                }}
              ])}>
                <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1.5, borderColor: password ? COLORS.primary : COLORS.border, paddingHorizontal: 16, elevation: 1 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                placeholder="Your password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.white }}>Sign In →</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ marginHorizontal: 14, fontSize: 13, color: COLORS.textLight }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>
          <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={onRegister} activeOpacity={0.9}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.secondary }}>Create New Account</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 32, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
            {[{ icon: '🔒', label: 'Secure' }, { icon: '✅', label: 'Verified' }, { icon: '🏥', label: 'HIPAA Safe' }].map((badge) => (
              <View key={badge.label} style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 20 }}>{badge.icon}</Text>
                <Text style={{ fontSize: 10, color: COLORS.textLight }}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── REGISTER SCREEN ──────────────────────────────────────────────────────────
function RegisterScreen({ onRegister, onLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const roles = [
    { id: 'patient', icon: '🙋', label: 'Patient', description: 'Book appointments & manage health' },
    { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor', description: 'Accept patients & earn income' },
    { id: 'pharmacy', icon: '🏪', label: 'Pharmacy', description: 'Sell medications & deliver' },
  ];

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agreed) { setError('Please agree to the Terms & Privacy Policy'); return; }
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (authError) throw authError;
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email: email.trim().toLowerCase(),
        role,
        verification_status: role === 'patient' ? 'approved' : 'pending',
        is_verified: role === 'patient',
      });
      if (role === 'doctor') await supabase.from('doctor_profiles').upsert({ id: data.user.id });
      else if (role === 'pharmacy') await supabase.from('pharmacy_profiles').upsert({ id: data.user.id });
      else await supabase.from('patient_profiles').upsert({ id: data.user.id });
      Alert.alert(
        'Account Created! 🎉',
        role === 'patient' ? 'Welcome to ReineCare! You can start booking appointments right away.' : 'Your account has been created. Please wait for admin verification before you can start.',
        [{ text: 'Sign In Now', onPress: onRegister }]
      );
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 56, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
          <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
          <TouchableOpacity onPress={onLogin} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>← Back to Sign In</Text>
          </TouchableOpacity>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>Create Account</Text>
            <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>Join thousands of patients and doctors</Text>
          </Animated.View>
        </View>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], padding: 24, paddingTop: 28 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>I am joining as *</Text>
          <View style={{ gap: 10, marginBottom: 24 }}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 2, borderColor: role === r.id ? COLORS.primary : COLORS.border, backgroundColor: role === r.id ? COLORS.primaryLight : COLORS.white, gap: 14 }}
                onPress={() => setRole(r.id)}
              >
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: role === r.id ? COLORS.primary : COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 26 }}>{r.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: role === r.id ? COLORS.primary : COLORS.text }}>{r.label}</Text>
                  <Text style={{ fontSize: 12, color: role === r.id ? COLORS.primary : COLORS.textLight, marginTop: 2 }}>{r.description}</Text>
                </View>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: role === r.id ? COLORS.primary : COLORS.border, backgroundColor: role === r.id ? COLORS.primary : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                  {role === r.id && <Text style={{ fontSize: 12, color: COLORS.white }}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {error !== '' && (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
              <Text style={{ fontSize: 13, color: '#991B1B', flex: 1 }}>{error}</Text>
            </View>
          )}
          {[
            { label: 'Full Name', icon: '👤', value: fullName, setter: setFullName, placeholder: 'Your full name', keyboard: 'default', capitalize: 'words' },
            { label: 'Email Address', icon: '📧', value: email, setter: setEmail, placeholder: 'your@email.com', keyboard: 'email-address', capitalize: 'none' },
          ].map((field) => (
            <View key={field.label} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1.5, borderColor: field.value ? COLORS.primary : COLORS.border, paddingHorizontal: 16, elevation: 1 }}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{field.icon}</Text>
                <TextInput
                  style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textLight}
                  value={field.value}
                  onChangeText={(t) => { field.setter(t); setError(''); }}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.capitalize}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1.5, borderColor: password ? COLORS.primary : COLORS.border, paddingHorizontal: 16, elevation: 1 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                placeholder="Min 6 characters"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Confirm Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1.5, borderColor: confirmPassword && confirmPassword === password ? COLORS.success : confirmPassword ? COLORS.error : COLORS.border, paddingHorizontal: 16, elevation: 1 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>🔑</Text>
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text }}
                placeholder="Re-enter password"
                placeholderTextColor={COLORS.textLight}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                secureTextEntry={!showPassword}
              />
              {confirmPassword.length > 0 && <Text style={{ fontSize: 18 }}>{confirmPassword === password ? '✅' : '❌'}</Text>}
            </View>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24, backgroundColor: agreed ? COLORS.primaryLight : COLORS.white, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: agreed ? COLORS.primary : COLORS.border }}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: agreed ? COLORS.primary : COLORS.border, backgroundColor: agreed ? COLORS.primary : 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 1 }}>
              {agreed && <Text style={{ fontSize: 14, color: COLORS.white }}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: COLORS.text, lineHeight: 20 }}>
                I agree to the <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Terms of Service</Text> and <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Privacy Policy</Text>
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>For inquiries: hello@reinecare.com</Text>
              {role !== 'patient' && (
                <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>
                  {role === 'doctor' ? '👨‍⚕️ Doctor accounts require admin verification' : '🏪 Pharmacy accounts require admin verification'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: loading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6, marginBottom: 16 }}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.white }}>Create Account 🎉</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 32 }} onPress={onLogin}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign In</Text></Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────
const NotificationBell = memo(function NotificationBell({ userId, onPress }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('is_read', false)
        .limit(50);
      if (error) throw error;
      setUnreadCount((data || []).length);
    } catch (error) {
      console.log('Error fetching unread count:', error.message);
    }
  }, [userId]);

  useEffect(() => {
    fetchUnreadCount();
    const subscription = supabase
      .channel(`notifications-bell-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        fetchUnreadCount();
      })
      .subscribe();
    return () => subscription.unsubscribe();
  }, [userId]);

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative', padding: 4 }}>
      <Text style={{ fontSize: 24 }}>🔔</Text>
      {unreadCount > 0 && (
        <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.error, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.white }}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// ─── NOTIFICATIONS SCREEN ─────────────────────────────────────────────────────
function NotificationsScreen({ userId, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.log('Error fetching notifications:', error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.log('Error marking all read:', error.message);
    }
  };

  const markRead = async (notifId) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    } catch (error) {
      console.log('Error marking read:', error.message);
    }
  };

  const deleteNotification = async (notifId) => {
    try {
      await supabase.from('notifications').delete().eq('id', notifId);
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (error) {
      console.log('Error deleting notification:', error.message);
    }
  };

  const clearAll = async () => {
    Alert.alert('Clear All', 'Delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All', style: 'destructive', onPress: async () => {
          await supabase.from('notifications').delete().eq('user_id', userId);
          setNotifications([]);
        }
      }
    ]);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'booking': return '📅';
      case 'payment': return '💰';
      case 'verification': return '✅';
      case 'general': return '📢';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Notifications 🔔</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={markAllRead}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Clear all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>🔔</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No Notifications</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>You're all caught up! We'll notify you of important updates here.</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={{ backgroundColor: notif.is_read ? COLORS.white : COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 10, elevation: 2, borderLeftWidth: notif.is_read ? 0 : 4, borderLeftColor: COLORS.primary }}
              onPress={() => markRead(notif.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: notif.is_read ? COLORS.lightGray : COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 22 }}>{getTypeIcon(notif.type)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontWeight: notif.is_read ? '500' : 'bold', color: COLORS.text, flex: 1, marginRight: 8 }}>{notif.title}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>{getTimeAgo(notif.created_at)}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4, lineHeight: 18 }}>{notif.message}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteNotification(notif.id)} style={{ padding: 4, marginLeft: 4 }}>
                  <Text style={{ fontSize: 16, color: COLORS.textLight }}>✕</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── LANGUAGE SELECTOR ────────────────────────────────────────────────────────
function LanguageSelector({ onClose }) {
  const { language, setLanguage } = useLanguage();
  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
      <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>🌍 Select Language</Text>
        <Text style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 20 }}>Choose your preferred language</Text>
        {Object.values(LANGUAGES).map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 8, backgroundColor: language === lang.code ? COLORS.primaryLight : COLORS.lightGray, borderWidth: language === lang.code ? 2 : 0, borderColor: COLORS.primary }}
            onPress={() => { setLanguage(lang.code); onClose(); }}
          >
            <Text style={{ fontSize: 28, marginRight: 14 }}>{lang.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>{lang.name}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{lang.code.toUpperCase()}</Text>
            </View>
            {language === lang.code && (
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: COLORS.white }}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 }} onPress={onClose}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── BROADCAST BANNER ─────────────────────────────────────────────────────────
const BroadcastBanner = memo(function BroadcastBanner({ userRole }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const { data } = await supabase
        .from('broadcasts')
        .select('*')
        .or(`target_audience.eq.all,target_audience.eq.${userRole}s`)
        .gt('expires_at', new Date().toISOString())
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);
      setBroadcasts(data || []);
    } catch (error) {
      console.log('Error fetching broadcasts:', error.message);
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'maintenance': return { icon: '🔧', color: '#FEE2E2', textColor: '#991B1B' };
      case 'promotion': return { icon: '🎉', color: '#D1FAE5', textColor: '#065F46' };
      case 'health_tip': return { icon: '💡', color: '#DBEAFE', textColor: '#1E40AF' };
      default: return { icon: '📢', color: '#FEF3C7', textColor: '#92400E' };
    }
  };

  const activeBroadcasts = broadcasts.filter(b => !dismissed.has(b.id));
  if (activeBroadcasts.length === 0) return null;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 12, gap: 8 }}>
      {activeBroadcasts.map((broadcast) => {
        const info = getTypeInfo(broadcast.type);
        return (
          <View key={broadcast.id} style={{ backgroundColor: info.color, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 22, marginRight: 10 }}>{info.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: info.textColor }}>{broadcast.title}</Text>
                {broadcast.is_pinned && (
                  <View style={{ backgroundColor: info.textColor, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 }}>
                    <Text style={{ fontSize: 9, color: COLORS.white, fontWeight: 'bold' }}>📌 PINNED</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 13, color: info.textColor, lineHeight: 18 }}>{broadcast.message}</Text>
              {broadcast.action_text && (
                <TouchableOpacity style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: info.textColor, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.white }}>{broadcast.action_text}</Text>
                </TouchableOpacity>
              )}
            </View>
            {!broadcast.is_pinned && (
              <TouchableOpacity onPress={() => setDismissed(prev => new Set([...prev, broadcast.id]))}>
                <Text style={{ fontSize: 16, color: info.textColor, padding: 4 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
});

// ─── TELEMEDICINE BADGE ───────────────────────────────────────────────────────
const TelemedicineBadge = memo(function TelemedicineBadge({ level, certified, totalSessions, size = 'normal' }) {
  if (!certified && level === 'none') return null;
  const getBadgeInfo = () => {
    switch (level) {
      case 'gold': return { icon: '🥇', color: '#F59E0B', bg: '#FEF3C7', label: 'Gold Telemedicine', description: '50+ video sessions' };
      case 'silver': return { icon: '🥈', color: '#6B7280', bg: '#F3F4F6', label: 'Silver Telemedicine', description: '25+ video sessions' };
      case 'bronze': return { icon: '🥉', color: '#92400E', bg: '#FEF3C7', label: 'Bronze Telemedicine', description: '10+ video sessions' };
      default: return { icon: '📹', color: COLORS.primary, bg: COLORS.primaryLight, label: 'Telemedicine Certified', description: 'Certified provider' };
    }
  };
  const info = getBadgeInfo();
  if (size === 'small') {
    return (
      <View style={{ backgroundColor: info.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12 }}>{info.icon}</Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: info.color }}>{info.label}</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: info.bg, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: info.color + '20', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28 }}>{info.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: info.color }}>{info.label}</Text>
        <Text style={{ fontSize: 12, color: info.color, opacity: 0.8 }}>{info.description}</Text>
        {totalSessions > 0 && <Text style={{ fontSize: 11, color: info.color, opacity: 0.7, marginTop: 2 }}>{totalSessions} video sessions completed</Text>}
      </View>
      <View style={{ backgroundColor: info.color, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>✓ Verified</Text>
      </View>
    </View>
  );
});

// ─── APPOINTMENT REMINDERS ────────────────────────────────────────────────────
const AppointmentReminders = memo(function AppointmentReminders({ bookingId }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data } = await supabase.from('appointment_reminders').select('*').eq('booking_id', bookingId).order('scheduled_for', { ascending: true });
        setReminders(data || []);
      } catch (error) {
        console.log('Error fetching reminders:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, [bookingId]);

  const getReminderInfo = (type) => {
    switch (type) {
      case '24h': return { icon: '📅', label: '24 Hours Before', color: '#DBEAFE', textColor: '#1E40AF' };
      case '1h': return { icon: '⏰', label: '1 Hour Before', color: '#FEF3C7', textColor: '#92400E' };
      case '30min': return { icon: '🚨', label: '30 Minutes Before', color: '#FEE2E2', textColor: '#991B1B' };
      default: return { icon: '🔔', label: 'Reminder', color: COLORS.lightGray, textColor: COLORS.text };
    }
  };

  if (loading) return <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} />;
  if (reminders.length === 0) return null;

  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>⏰ Appointment Reminders</Text>
      <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 14 }}>You will be notified automatically before your appointment</Text>
      {reminders.map((reminder) => {
        const info = getReminderInfo(reminder.reminder_type);
        return (
          <View key={reminder.id} style={{ backgroundColor: info.color, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 24 }}>{info.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: info.textColor }}>{info.label}</Text>
              <Text style={{ fontSize: 12, color: info.textColor, marginTop: 2 }}>{new Date(reminder.scheduled_for).toLocaleString()}</Text>
            </View>
            <View style={{ backgroundColor: reminder.sent ? '#D1FAE5' : 'rgba(0,0,0,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: reminder.sent ? '#065F46' : info.textColor }}>{reminder.sent ? '✅ Sent' : '⏳ Pending'}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});
// ─── CHAT SCREEN ──────────────────────────────────────────────────────────────
function ChatScreen({ currentUserId, otherUserId, otherUserName, otherUserRole, bookingId, onBack, accentColor }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollViewRef = useRef(null);

  const quickReplies = otherUserRole === 'doctor' ? [
    'I have a question about my appointment',
    'Can we reschedule?',
    'Thank you doctor!',
    'I am feeling better',
    'What medications should I take?',
  ] : [
    'Your appointment is confirmed',
    'Please arrive 10 minutes early',
    'Take your medication as prescribed',
    'How are you feeling today?',
    'Please come in for a follow up',
  ];

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    setLoading(true);
    try {
      const patientId = otherUserRole === 'doctor' ? currentUserId : otherUserId;
      const doctorId = otherUserRole === 'doctor' ? otherUserId : currentUserId;
      const { data: existing } = await supabase.from('conversations').select('*').eq('patient_id', patientId).eq('doctor_id', doctorId).single();
      let convId = existing?.id;
      if (!convId) {
        const { data: newConv, error } = await supabase.from('conversations').insert({ patient_id: patientId, doctor_id: doctorId, booking_id: bookingId || null }).select().single();
        if (error) throw error;
        convId = newConv.id;
      }
      setConversationId(convId);
      await fetchMessages(convId);
      await markAsRead(convId, patientId, doctorId);
      const subscription = supabase
        .channel(`messages:${convId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        })
        .subscribe();
      return () => subscription.unsubscribe();
    } catch (error) {
      console.log('Error initializing conversation:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data || []);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.log('Error fetching messages:', error.message);
    }
  };

  const markAsRead = async (convId, patientId, doctorId) => {
    try {
      const isPatient = currentUserId === patientId;
      const updateData = {};
      if (isPatient) updateData.patient_unread = 0;
      else updateData.doctor_unread = 0;
      await supabase.from('conversations').update(updateData).eq('id', convId);
      await supabase.from('messages').update({ is_read: true }).eq('conversation_id', convId).eq('receiver_id', currentUserId);
    } catch (error) {
      console.log('Error marking as read:', error.message);
    }
  };

  const sendMessage = async (messageText) => {
    const text = messageText || newMessage.trim();
    if (!text || !conversationId) return;
    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message: text,
        message_type: 'text',
      });
      if (error) throw error;
      await supabase.from('notifications').insert({
        user_id: otherUserId,
        title: '💬 New Message',
        message: `You have a new message: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`,
        type: 'general',
        data: { conversation_id: conversationId },
      });
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 100);
  };

  const getTimeString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDateString = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const shouldShowDate = (index) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].created_at).toDateString();
    const prevDate = new Date(messages[index - 1].created_at).toDateString();
    return currentDate !== prevDate;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: accentColor, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <Text style={{ fontSize: 20, color: COLORS.white }}>←</Text>
        </TouchableOpacity>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 22 }}>{otherUserRole === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{otherUserRole === 'doctor' ? 'Dr. ' : ''}{otherUserName}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' }}>{otherUserRole}</Text>
        </View>
        <View style={{ backgroundColor: '#D1FAE5', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#065F46' }}>🔒 Secure</Text>
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading messages...</Text>
        </View>
      ) : (
        <>
          <ScrollView ref={scrollViewRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollToBottom()}>
            {messages.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 50, marginBottom: 16 }}>💬</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Start a Conversation</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>
                  {otherUserRole === 'doctor' ? 'Ask your doctor any questions about your appointment or health' : 'Send a message to your patient about their appointment'}
                </Text>
              </View>
            )}
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <View key={msg.id}>
                  {shouldShowDate(index) && (
                    <View style={{ alignItems: 'center', marginVertical: 16 }}>
                      <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, color: COLORS.textLight }}>{getDateString(msg.created_at)}</Text>
                      </View>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                    {!isMe && (
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: accentColor + '20', justifyContent: 'center', alignItems: 'center', marginRight: 8, alignSelf: 'flex-end' }}>
                        <Text style={{ fontSize: 16 }}>{otherUserRole === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
                      </View>
                    )}
                    <View style={{ maxWidth: '75%' }}>
                      <View style={{ backgroundColor: isMe ? accentColor : COLORS.white, borderRadius: 18, borderBottomRightRadius: isMe ? 4 : 18, borderBottomLeftRadius: isMe ? 18 : 4, paddingHorizontal: 14, paddingVertical: 10, elevation: 1 }}>
                        <Text style={{ fontSize: 14, color: isMe ? COLORS.white : COLORS.text, lineHeight: 20 }}>{msg.message}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                        <Text style={{ fontSize: 10, color: COLORS.textLight }}>{getTimeString(msg.created_at)}</Text>
                        {isMe && <Text style={{ fontSize: 10, color: msg.is_read ? accentColor : COLORS.textLight }}>{msg.is_read ? '✓✓' : '✓'}</Text>}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, maxHeight: 44 }} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity key={index} style={{ backgroundColor: accentColor + '15', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: accentColor + '30' }} onPress={() => sendMessage(reply)}>
                <Text style={{ fontSize: 12, color: accentColor, fontWeight: '500' }}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 10, paddingBottom: 30, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, minHeight: 44, maxHeight: 120, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 15, color: COLORS.text, maxHeight: 100 }}
                placeholder="Type a message..."
                placeholderTextColor={COLORS.textLight}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                onFocus={() => scrollToBottom()}
              />
            </View>
            <TouchableOpacity
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: newMessage.trim() ? accentColor : COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => sendMessage()}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={{ fontSize: 20 }}>📤</Text>}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// ─── CONVERSATIONS LIST ───────────────────────────────────────────────────────
function ConversationsList({ currentUserId, currentUserRole, onSelectConversation, accentColor }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const field = currentUserRole === 'patient' ? 'patient_id' : 'doctor_id';
      const { data, error } = await supabase.from('conversations').select('*').eq(field, currentUserId).order('updated_at', { ascending: false }).limit(20);
      if (error) throw error;
      if (!data || data.length === 0) { setConversations([]); return; }
      const otherIds = data.map(conv => currentUserRole === 'patient' ? conv.doctor_id : conv.patient_id);
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, role').in('id', otherIds);
      const profileMap = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });
      const enriched = data.map(conv => {
        const otherId = currentUserRole === 'patient' ? conv.doctor_id : conv.patient_id;
        return { ...conv, otherUser: profileMap[otherId], otherId };
      });
      setConversations(enriched);
    } catch (error) {
      console.log('Error fetching conversations:', error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserRole]);

  useEffect(() => {
    fetchConversations();
    const subscription = supabase
      .channel(`conversations-${currentUserId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, () => { fetchConversations(); })
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getUnreadCount = (conv) => currentUserRole === 'patient' ? conv.patient_unread : conv.doctor_unread;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>💬</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No Messages Yet</Text>
        <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>
          {currentUserRole === 'patient' ? 'Book an appointment with a doctor to start chatting' : 'Messages from your patients will appear here'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
      {conversations.map((conv) => {
        const unread = getUnreadCount(conv);
        const otherRole = currentUserRole === 'patient' ? 'doctor' : 'patient';
        return (
          <TouchableOpacity
            key={conv.id}
            style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, elevation: 2, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onSelectConversation(conv, conv.otherId, conv.otherUser?.full_name, otherRole)}
          >
            <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: accentColor + '20', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 26 }}>{otherRole === 'doctor' ? '👨‍⚕️' : '🙋'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{otherRole === 'doctor' ? 'Dr. ' : ''}{conv.otherUser?.full_name || 'User'}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{getTimeAgo(conv.last_message_time)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }} numberOfLines={1}>{conv.last_message || 'No messages yet'}</Text>
                {unread > 0 && (
                  <View style={{ backgroundColor: accentColor, borderRadius: 12, minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 8, paddingHorizontal: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>{unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
// ─── PRESCRIPTION WRITER ──────────────────────────────────────────────────────
function PrescriptionWriter({ booking, doctorProfile, doctorName, onClose, onSaved }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly'];
  const durations = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '3 months', 'Ongoing'];

  const addMedication = () => setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const updateMedication = (index, field, value) => { const updated = [...medications]; updated[index][field] = value; setMedications(updated); };
  const removeMedication = (index) => { if (medications.length === 1) return; setMedications(medications.filter((_, i) => i !== index)); };

  const savePrescription = async () => {
    if (!diagnosis) { Alert.alert('Missing Info', 'Please enter the diagnosis'); return; }
    if (medications.some(m => !m.name)) { Alert.alert('Missing Info', 'Please enter medication names'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('prescriptions').insert({
        booking_id: booking.id,
        doctor_id: booking.doctor_id,
        patient_id: booking.patient_id,
        patient_name: booking.patient_name,
        diagnosis,
        medications: medications.filter(m => m.name),
        instructions: generalInstructions,
        follow_up_date: followUpDate,
        notes,
        is_valid: true,
      });
      if (error) throw error;
      await supabase.from('notifications').insert({
        user_id: booking.patient_id,
        title: '💊 Prescription Ready!',
        message: `Dr. ${doctorName} has written a prescription for you. Check your prescriptions section.`,
        type: 'general',
      });
      Alert.alert('Prescription Saved! ✅', 'The prescription has been saved and the patient has been notified.', [{ text: 'OK', onPress: onSaved }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <TouchableOpacity onPress={onClose} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💊 Write Prescription</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{booking.patient_name}</Text>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🏥 Prescription Details</Text>
          {[{ label: 'Doctor', value: `Dr. ${doctorName}` }, { label: 'Specialty', value: doctorProfile?.specialty || 'General' }, { label: 'Patient', value: booking.patient_name }, { label: 'Date', value: new Date().toLocaleDateString() }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>🔍 Diagnosis *</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top', elevation: 1 }} placeholder="Enter diagnosis or clinical findings..." value={diagnosis} onChangeText={setDiagnosis} multiline />
        </View>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💊 Medications *</Text>
        {medications.map((med, index) => (
          <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary }}>Medication {index + 1}</Text>
              {medications.length > 1 && (
                <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }} onPress={() => removeMedication(index)}>
                  <Text style={{ fontSize: 12, color: '#991B1B', fontWeight: '600' }}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 6 }}>Medication Name *</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. Amoxicillin 500mg" value={med.name} onChangeText={(v) => updateMedication(index, 'name', v)} />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 6 }}>Dosage</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. 1 tablet" value={med.dosage} onChangeText={(v) => updateMedication(index, 'dosage', v)} />
            </View>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 8 }}>Frequency</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {frequencies.map((freq) => (
                  <TouchableOpacity key={freq} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: med.frequency === freq ? COLORS.secondary : COLORS.border, backgroundColor: med.frequency === freq ? COLORS.secondary : COLORS.white }} onPress={() => updateMedication(index, 'frequency', freq)}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: med.frequency === freq ? COLORS.white : COLORS.gray }}>{freq}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 8 }}>Duration</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {durations.map((dur) => (
                  <TouchableOpacity key={dur} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: med.duration === dur ? COLORS.secondary : COLORS.border, backgroundColor: med.duration === dur ? COLORS.secondary : COLORS.white }} onPress={() => updateMedication(index, 'duration', dur)}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: med.duration === dur ? COLORS.white : COLORS.gray }}>{dur}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View>
              <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 6 }}>Special Instructions</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. Take with food, avoid alcohol..." value={med.instructions} onChangeText={(v) => updateMedication(index, 'instructions', v)} />
            </View>
          </View>
        ))}
        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.secondary, borderRadius: 14, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }} onPress={addMedication}>
          <Text style={{ fontSize: 18 }}>➕</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary }}>Add Another Medication</Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>📋 General Instructions</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top', elevation: 1 }} placeholder="e.g. Rest well, drink plenty of water..." value={generalInstructions} onChangeText={setGeneralInstructions} multiline />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>📅 Follow Up Date</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, elevation: 1 }} placeholder="DD/MM/YYYY (optional)" value={followUpDate} onChangeText={setFollowUpDate} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>📝 Doctor Notes</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top', elevation: 1 }} placeholder="Private notes about this prescription..." value={notes} onChangeText={setNotes} multiline />
        </View>
        <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }} onPress={savePrescription} disabled={saving}>
          {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Save Prescription ✅</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={onClose}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── PATIENT PRESCRIPTIONS ────────────────────────────────────────────────────
const PatientPrescriptions = memo(function PatientPrescriptions({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from('prescriptions').select('*').eq('patient_id', patientId).eq('is_valid', true).order('created_at', { ascending: false });
        setPrescriptions(data || []);
      } catch (error) {
        console.log('Error fetching prescriptions:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [patientId]);

  if (loading) return <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />;
  if (prescriptions.length === 0) return null;

  if (selectedPrescription) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <TouchableOpacity onPress={() => setSelectedPrescription(null)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💊 Prescription</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{new Date(selectedPrescription.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={{ padding: 24 }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🏥 Prescription Info</Text>
            {[{ label: 'Date', value: new Date(selectedPrescription.created_at).toLocaleDateString() }, { label: 'Patient', value: selectedPrescription.patient_name }, { label: 'Diagnosis', value: selectedPrescription.diagnosis }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💊 Medications</Text>
          {selectedPrescription.medications?.map((med, index) => (
            <View key={index} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 2 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 8 }}>{med.name}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {med.dosage && <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontSize: 12, color: COLORS.primary }}>💊 {med.dosage}</Text></View>}
                {med.frequency && <View style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontSize: 12, color: '#065F46' }}>🔄 {med.frequency}</Text></View>}
                {med.duration && <View style={{ backgroundColor: '#DBEAFE', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontSize: 12, color: '#1E40AF' }}>📅 {med.duration}</Text></View>}
              </View>
              {med.instructions && <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 8, lineHeight: 20 }}>⚠️ {med.instructions}</Text>}
            </View>
          ))}
          {selectedPrescription.instructions && (
            <View style={{ backgroundColor: '#FEF3C7', borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#92400E', marginBottom: 8 }}>📋 General Instructions</Text>
              <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>{selectedPrescription.instructions}</Text>
            </View>
          )}
          {selectedPrescription.follow_up_date && (
            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 24 }}>📅</Text>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary }}>Follow Up Appointment</Text>
                <Text style={{ fontSize: 13, color: COLORS.primary }}>{selectedPrescription.follow_up_date}</Text>
              </View>
            </View>
          )}
          <View style={{ backgroundColor: '#D1FAE5', borderRadius: 14, padding: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#065F46' }}>✅ Valid Prescription</Text>
            <Text style={{ fontSize: 12, color: '#065F46', marginTop: 4 }}>Issued on {new Date(selectedPrescription.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💊 My Prescriptions ({prescriptions.length})</Text>
      {prescriptions.map((prescription) => (
        <TouchableOpacity key={prescription.id} style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedPrescription(prescription)}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Text style={{ fontSize: 22 }}>💊</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{prescription.diagnosis}</Text>
            <Text style={{ fontSize: 12, color: COLORS.textLight }}>{prescription.medications?.length} medication{prescription.medications?.length !== 1 ? 's' : ''}</Text>
            <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(prescription.created_at).toLocaleDateString()}</Text>
          </View>
          <Text style={{ fontSize: 16, color: COLORS.textLight }}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// ─── PATIENT REFERRALS ────────────────────────────────────────────────────────
const PatientReferrals = memo(function PatientReferrals({ patientId }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from('referrals').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
        setReferrals(data || []);
      } catch (error) {
        console.log('Error fetching referrals:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [patientId]);

  if (loading) return <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} />;
  if (referrals.length === 0) return null;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'soon': return { bg: '#FEF3C7', text: '#92400E' };
      default: return { bg: '#D1FAE5', text: '#065F46' };
    }
  };

  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📋 My Referrals ({referrals.length})</Text>
      {referrals.map((referral) => {
        const urgencyColor = getUrgencyColor(referral.urgency);
        return (
          <View key={referral.id} style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>📋 Referral</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{referral.reason}</Text>
              </View>
              <View style={{ backgroundColor: urgencyColor.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: urgencyColor.text, textTransform: 'capitalize' }}>{referral.urgency}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(referral.created_at).toLocaleDateString()}</Text>
          </View>
        );
      })}
    </View>
  );
});

// ─── REFERRAL FORM ────────────────────────────────────────────────────────────
function ReferralForm({ currentDoctorId, currentDoctorName, booking, onClose, onSaved }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [referralReason, setReferralReason] = useState('');
  const [referralNotes, setReferralNotes] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const { data } = await supabase.from('doctors_directory').select('*').neq('id', currentDoctorId);
        setDoctors(data || []);
      } catch (error) {
        console.log('Error fetching doctors:', error.message);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d =>
    d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveReferral = async () => {
    if (!selectedDoctor) { Alert.alert('Select Doctor', 'Please select a doctor to refer to'); return; }
    if (!referralReason) { Alert.alert('Missing Info', 'Please enter the reason for referral'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('referrals').insert({
        referring_doctor_id: currentDoctorId,
        referred_doctor_id: selectedDoctor.id,
        patient_id: booking.patient_id,
        booking_id: booking.id,
        reason: referralReason,
        notes: referralNotes,
        urgency,
        status: 'pending',
      });
      if (error) throw error;
      await supabase.from('notifications').insert([
        { user_id: selectedDoctor.id, title: '📋 New Patient Referral', message: `Dr. ${currentDoctorName} has referred a patient to you. Reason: ${referralReason}`, type: 'booking' },
        { user_id: booking.patient_id, title: '📋 You Have Been Referred', message: `Dr. ${currentDoctorName} has referred you to Dr. ${selectedDoctor.full_name} (${selectedDoctor.specialty})`, type: 'booking' },
      ]);
      Alert.alert('Referral Sent! ✅', `Patient referred to Dr. ${selectedDoctor.full_name}. Both the patient and doctor have been notified.`, [{ text: 'OK', onPress: onSaved }]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <TouchableOpacity onPress={onClose} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📋 Refer Patient</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{booking.patient_name}</Text>
      </View>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>Select Specialist *</Text>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput style={{ flex: 1, paddingVertical: 12, fontSize: 14 }} placeholder="Search by name or specialty..." value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        {selectedDoctor ? (
          <View style={{ backgroundColor: '#D1FAE5', borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>👨‍⚕️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#065F46' }}>Dr. {selectedDoctor.full_name}</Text>
              <Text style={{ fontSize: 13, color: '#065F46' }}>{selectedDoctor.specialty}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedDoctor(null)}><Text style={{ fontSize: 18, color: '#065F46' }}>✕</Text></TouchableOpacity>
          </View>
        ) : (
          <View style={{ maxHeight: 200, marginBottom: 16 }}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {loadingDoctors ? <ActivityIndicator color={COLORS.secondary} /> : filteredDoctors.slice(0, 10).map((doctor) => (
                <TouchableOpacity key={doctor.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.lightGray, borderRadius: 10, marginBottom: 6 }} onPress={() => { setSelectedDoctor(doctor); setSearchQuery(''); }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>👨‍⚕️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Dr. {doctor.full_name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.primary }}>{doctor.specialty}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>${doctor.consultation_fee}/hr • ⭐ {doctor.rating || 'New'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Urgency *</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[{ id: 'routine', label: '✅ Routine', color: '#D1FAE5', textColor: '#065F46' }, { id: 'soon', label: '⚠️ Soon', color: '#FEF3C7', textColor: '#92400E' }, { id: 'urgent', label: '🚨 Urgent', color: '#FEE2E2', textColor: '#991B1B' }].map((u) => (
            <TouchableOpacity key={u.id} style={{ flex: 1, borderWidth: 2, borderColor: urgency === u.id ? u.textColor : COLORS.border, borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: urgency === u.id ? u.color : COLORS.white }} onPress={() => setUrgency(u.id)}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: urgency === u.id ? u.textColor : COLORS.gray }}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Reason for Referral *</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top', elevation: 1 }} placeholder="e.g. Patient requires specialist evaluation for..." value={referralReason} onChangeText={setReferralReason} multiline />
        </View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Clinical Notes (Optional)</Text>
          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top', elevation: 1 }} placeholder="Additional clinical information for the specialist..." value={referralNotes} onChangeText={setReferralNotes} multiline />
        </View>
        <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }} onPress={saveReferral} disabled={saving}>
          {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Send Referral 📋</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={onClose}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── SYMPTOM CHECKER ──────────────────────────────────────────────────────────
function SymptomChecker({ userId, patientProfile, onBookDoctor }) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(patientProfile?.gender || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const commonSymptoms = [
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'fever', label: 'Fever', icon: '🌡️' },
    { id: 'cough', label: 'Cough', icon: '😷' },
    { id: 'chest_pain', label: 'Chest Pain', icon: '💔' },
    { id: 'shortness_breath', label: 'Shortness of Breath', icon: '😮‍💨' },
    { id: 'stomach_pain', label: 'Stomach Pain', icon: '🤢' },
    { id: 'nausea', label: 'Nausea', icon: '🤮' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'dizziness', label: 'Dizziness', icon: '💫' },
    { id: 'back_pain', label: 'Back Pain', icon: '🦴' },
    { id: 'joint_pain', label: 'Joint Pain', icon: '🦵' },
    { id: 'skin_rash', label: 'Skin Rash', icon: '🔴' },
    { id: 'sore_throat', label: 'Sore Throat', icon: '🗣️' },
    { id: 'runny_nose', label: 'Runny Nose', icon: '🤧' },
    { id: 'eye_pain', label: 'Eye Pain', icon: '👁️' },
    { id: 'ear_pain', label: 'Ear Pain', icon: '👂' },
    { id: 'toothache', label: 'Toothache', icon: '🦷' },
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'depression', label: 'Depression', icon: '😔' },
    { id: 'insomnia', label: 'Insomnia', icon: '🌙' },
  ];

  const durations = ['Today', '2-3 days', 'A week', '2 weeks', 'A month', 'Over a month'];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await supabase.from('symptom_checks').select('*').eq('patient_id', userId).order('created_at', { ascending: false }).limit(5);
      setHistory(data || []);
    } catch (error) {
      console.log('Error fetching history:', error.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => prev.includes(symptomId) ? prev.filter(s => s !== symptomId) : [...prev, symptomId]);
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const getSymptomAnalysis = (symptoms, severity, duration) => {
    const emergencySymptoms = ['chest_pain', 'shortness_breath'];
    if (symptoms.some(s => emergencySymptoms.includes(s)) && severity === 'severe') {
      return { urgency: 'emergency', urgencyLabel: 'EMERGENCY', specialty: 'Emergency Medicine', advice: '🚨 SEEK IMMEDIATE MEDICAL ATTENTION. Your symptoms suggest a potentially serious condition that requires emergency care. Please call emergency services or go to the nearest emergency room immediately.', color: '#FEE2E2', textColor: '#991B1B', icon: '🚨', symptomLabels: symptoms.map(s => { const found = commonSymptoms.find(cs => cs.id === s); return found ? found.label : s; }), recommendations: ['Call emergency services immediately', 'Do not drive yourself', 'Stay calm and sit down', 'Loosen any tight clothing', 'Call 112 or 911'] };
    }
    const specialtyMap = { headache: { specialty: 'Neurologist', urgency: severity === 'severe' ? 'urgent' : 'routine' }, fever: { specialty: 'General Practitioner', urgency: severity === 'severe' ? 'soon' : 'routine' }, cough: { specialty: 'General Practitioner', urgency: 'routine' }, chest_pain: { specialty: 'Cardiologist', urgency: 'urgent' }, shortness_breath: { specialty: 'General Practitioner', urgency: 'soon' }, stomach_pain: { specialty: 'General Practitioner', urgency: severity === 'severe' ? 'soon' : 'routine' }, nausea: { specialty: 'General Practitioner', urgency: 'routine' }, fatigue: { specialty: 'General Practitioner', urgency: 'routine' }, dizziness: { specialty: 'Neurologist', urgency: severity === 'severe' ? 'soon' : 'routine' }, back_pain: { specialty: 'Orthopedic', urgency: 'routine' }, joint_pain: { specialty: 'Orthopedic', urgency: 'routine' }, skin_rash: { specialty: 'Dermatologist', urgency: 'routine' }, sore_throat: { specialty: 'General Practitioner', urgency: 'routine' }, runny_nose: { specialty: 'General Practitioner', urgency: 'routine' }, eye_pain: { specialty: 'Ophthalmologist', urgency: severity === 'severe' ? 'soon' : 'routine' }, ear_pain: { specialty: 'General Practitioner', urgency: 'routine' }, toothache: { specialty: 'Dentist', urgency: severity === 'severe' ? 'soon' : 'routine' }, anxiety: { specialty: 'Psychiatrist', urgency: 'routine' }, depression: { specialty: 'Psychiatrist', urgency: 'routine' }, insomnia: { specialty: 'Psychiatrist', urgency: 'routine' } };
    let primarySpecialty = 'General Practitioner';
    let highestUrgency = 'routine';
    symptoms.forEach(symptom => {
      const mapping = specialtyMap[symptom];
      if (mapping) {
        primarySpecialty = mapping.specialty;
        if (mapping.urgency === 'urgent' || (mapping.urgency === 'soon' && highestUrgency === 'routine')) highestUrgency = mapping.urgency;
      }
    });
    if (severity === 'severe') highestUrgency = highestUrgency === 'routine' ? 'soon' : 'urgent';
    const urgencyConfig = {
      routine: { label: 'Routine', color: '#D1FAE5', textColor: '#065F46', icon: '✅', advice: 'Your symptoms appear to be manageable. Schedule an appointment at your convenience within the next 1-2 weeks.' },
      soon: { label: 'See Doctor Soon', color: '#FEF3C7', textColor: '#92400E', icon: '⚠️', advice: 'Your symptoms suggest you should see a doctor within the next 2-3 days to prevent worsening.' },
      urgent: { label: 'Urgent Care Needed', color: '#FEE2E2', textColor: '#991B1B', icon: '🚨', advice: 'Your symptoms require prompt medical attention. Please see a doctor today or tomorrow.' },
    };
    const config = urgencyConfig[highestUrgency] || urgencyConfig.routine;
    const symptomLabels = symptoms.map(s => { const found = commonSymptoms.find(cs => cs.id === s); return found ? found.label : s; });
    return { urgency: highestUrgency, urgencyLabel: config.label, specialty: primarySpecialty, advice: config.advice, color: config.color, textColor: config.textColor, icon: config.icon, symptomLabels, recommendations: [`See a ${primarySpecialty} for proper evaluation`, 'Stay hydrated and get adequate rest', severity === 'severe' ? 'Monitor symptoms closely and seek emergency care if worsening' : 'Track your symptoms and note any changes', 'Avoid self-medication without professional advice', 'Bring a list of your current medications to your appointment'] };
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) { Alert.alert('No Symptoms', 'Please select at least one symptom'); return; }
    setAnalyzing(true);
    try {
      const analysisResult = getSymptomAnalysis(selectedSymptoms, severity, duration);
      const { error } = await supabase.from('symptom_checks').insert({ patient_id: userId, symptoms: selectedSymptoms, severity, duration, age: parseInt(age) || null, gender, suggested_specialty: analysisResult.specialty, suggested_urgency: analysisResult.urgency, ai_response: analysisResult.advice });
      if (error) throw error;
      setResult(analysisResult);
      setStep(3);
      fetchHistory();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'urgent': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'soon': return { bg: '#FEF3C7', text: '#92400E' };
      default: return { bg: '#D1FAE5', text: '#065F46' };
    }
  };

  const resetChecker = () => { setStep(1); setSelectedSymptoms([]); setCustomSymptom(''); setSeverity('mild'); setDuration(''); setResult(null); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>🩺 Symptom Checker</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20 }}>Describe your symptoms and get guidance on which specialist to see</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: COLORS.white, lineHeight: 18 }}>⚠️ This tool provides general guidance only. Always consult a qualified healthcare professional for medical advice.</Text>
          </View>
        </View>
        {step < 3 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            {[1, 2].map((s, index) => (
              <View key={s} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: step >= s ? COLORS.primary : COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: step >= s ? COLORS.white : COLORS.textLight }}>{step > s ? '✓' : s}</Text>
                </View>
                {index < 1 && <View style={{ flex: 1, height: 2, backgroundColor: step > s ? COLORS.primary : COLORS.border, marginHorizontal: 6 }} />}
              </View>
            ))}
          </View>
        )}
        {step === 1 && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>What symptoms do you have?</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 16 }}>Select all that apply</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {commonSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <TouchableOpacity key={symptom.id} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: isSelected ? COLORS.primary : COLORS.border, backgroundColor: isSelected ? COLORS.primaryLight : COLORS.white, flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => toggleSymptom(symptom.id)}>
                    <Text style={{ fontSize: 16 }}>{symptom.icon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? COLORS.primary : COLORS.gray }}>{symptom.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Other Symptom</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="Type a symptom..." value={customSymptom} onChangeText={setCustomSymptom} onSubmitEditing={addCustomSymptom} />
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' }} onPress={addCustomSymptom}>
                  <Text style={{ fontSize: 20, color: COLORS.white }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {selectedSymptoms.length > 0 && (
              <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 12, marginBottom: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>{selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected</Text>
              </View>
            )}
            <TouchableOpacity style={{ backgroundColor: selectedSymptoms.length === 0 ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => selectedSymptoms.length > 0 && setStep(2)} disabled={selectedSymptoms.length === 0}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Next: Rate Severity →</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>How severe are your symptoms?</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 20 }}>This helps us give better guidance</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Severity *</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {[{ id: 'mild', icon: '😊', label: 'Mild', color: '#D1FAE5', textColor: '#065F46' }, { id: 'moderate', icon: '😐', label: 'Moderate', color: '#FEF3C7', textColor: '#92400E' }, { id: 'severe', icon: '😣', label: 'Severe', color: '#FEE2E2', textColor: '#991B1B' }].map((level) => (
                <TouchableOpacity key={level.id} style={{ flex: 1, borderWidth: 2, borderColor: severity === level.id ? level.textColor : COLORS.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: severity === level.id ? level.color : COLORS.white }} onPress={() => setSeverity(level.id)}>
                  <Text style={{ fontSize: 28, marginBottom: 4 }}>{level.icon}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: severity === level.id ? level.textColor : COLORS.gray }}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>How long have you had these symptoms?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {durations.map((d) => (
                <TouchableOpacity key={d} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: duration === d ? COLORS.primary : COLORS.border, backgroundColor: duration === d ? COLORS.primaryLight : COLORS.white }} onPress={() => setDuration(d)}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: duration === d ? COLORS.primary : COLORS.gray }}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Age</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="Your age" value={age} onChangeText={setAge} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Gender</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity key={g} style={{ flex: 1, borderWidth: 1.5, borderColor: gender === g ? COLORS.primary : COLORS.border, borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: gender === g ? COLORS.primaryLight : COLORS.white }} onPress={() => setGender(g)}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: gender === g ? COLORS.primary : COLORS.gray }}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={{ flex: 1, borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => setStep(1)}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 2, backgroundColor: analyzing ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={analyzeSymptoms} disabled={analyzing}>
                {analyzing ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>🩺 Analyze Symptoms</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
        {step === 3 && result && (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>🩺 Analysis Results</Text>
            <View style={{ backgroundColor: result.color, borderRadius: 20, padding: 20, marginBottom: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>{result.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: result.textColor, marginBottom: 4 }}>{result.urgencyLabel}</Text>
              <Text style={{ fontSize: 14, color: result.textColor, textAlign: 'center', lineHeight: 22 }}>{result.advice}</Text>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>👨‍⚕️ Suggested Specialist</Text>
              <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <Text style={{ fontSize: 36 }}>🏥</Text>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>{result.specialty}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary, opacity: 0.8 }}>Recommended specialist</Text>
                </View>
              </View>
              <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => onBookDoctor && onBookDoctor(result.specialty)}>
                <Text style={{ fontSize: 16 }}>📅</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Find {result.specialty}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>📋 Your Symptoms</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {result.symptomLabels.map((symptom, index) => (
                  <View key={index} style={{ backgroundColor: COLORS.lightGray, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 13, color: COLORS.text }}>{symptom}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: getUrgencyColor(result.urgency).bg, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: getUrgencyColor(result.urgency).text }}>Severity</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: getUrgencyColor(result.urgency).text, textTransform: 'capitalize' }}>{severity}</Text>
                </View>
                {duration !== '' && (
                  <View style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>Duration</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{duration}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💡 Recommendations</Text>
              {result.recommendations.map((rec, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.primary }}>{index + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 22 }}>{rec}</Text>
                </View>
              ))}
            </View>
            <View style={{ backgroundColor: '#FEF3C7', borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#92400E', marginBottom: 4 }}>⚠️ Medical Disclaimer</Text>
              <Text style={{ fontSize: 12, color: '#92400E', lineHeight: 18 }}>This symptom checker provides general guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</Text>
            </View>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={resetChecker}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>🔄 Check Again</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 1 && history.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }} onPress={() => setShowHistory(!showHistory)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>📚 Previous Checks</Text>
              <Text style={{ fontSize: 14, color: COLORS.primary }}>{showHistory ? '▲ Hide' : '▼ Show'}</Text>
            </TouchableOpacity>
            {showHistory && (
              <View>
                {loadingHistory ? <ActivityIndicator color={COLORS.primary} /> : history.map((check) => {
                  const urgencyColor = getUrgencyColor(check.suggested_urgency);
                  return (
                    <View key={check.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{check.suggested_specialty}</Text>
                        <View style={{ backgroundColor: urgencyColor.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: urgencyColor.text, textTransform: 'capitalize' }}>{check.suggested_urgency}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {check.symptoms.slice(0, 4).map((s, i) => (
                          <View key={i} style={{ backgroundColor: COLORS.lightGray, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, color: COLORS.textLight }}>{s.replace('_', ' ')}</Text>
                          </View>
                        ))}
                        {check.symptoms.length > 4 && <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, color: COLORS.textLight }}>+{check.symptoms.length - 4} more</Text></View>}
                      </View>
                      <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(check.created_at).toLocaleDateString()}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── WAITING ROOM ─────────────────────────────────────────────────────────────
function WaitingRoom({ booking, userId, userRole, doctorProfile, patientProfile, onClose, onSessionStart }) {
  const [waitingRoom, setWaitingRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waitTime, setWaitTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [markingReady, setMarkingReady] = useState(false);
  const [tips] = useState(['💡 Make sure your camera and microphone are working', '🔇 Find a quiet place with good lighting', '📋 Have your medical history ready to discuss', '💊 Keep any medications nearby for reference', '🔋 Ensure your device is charged or plugged in', '📶 Check your internet connection is stable', '🖊️ Have a pen and paper to note important information', '👓 Wear your glasses if you need them to read']);
  const [currentTip, setCurrentTip] = useState(0);
  const timerRef = useRef(null);
  const tipRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    initWaitingRoom();
    timerRef.current = setInterval(() => setWaitTime(prev => prev + 1), 1000);
    tipRef.current = setInterval(() => setCurrentTip(prev => (prev + 1) % tips.length), 5000);
    return () => { clearInterval(timerRef.current); clearInterval(tipRef.current); clearInterval(pollingRef.current); };
  }, []);

  const initWaitingRoom = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase.from('waiting_rooms').select('*').eq('booking_id', booking.id).single();
      if (existing) { setWaitingRoom(existing); setIsReady(userRole === 'patient' ? existing.patient_ready : existing.doctor_ready); }
      else {
        const { data: newRoom, error } = await supabase.from('waiting_rooms').insert({ booking_id: booking.id, patient_id: booking.patient_id, doctor_id: booking.doctor_id, status: 'waiting', patient_joined_at: userRole === 'patient' ? new Date().toISOString() : null, doctor_joined_at: userRole === 'doctor' ? new Date().toISOString() : null }).select().single();
        if (error) throw error;
        setWaitingRoom(newRoom);
      }
      pollingRef.current = setInterval(async () => {
        try {
          const { data } = await supabase.from('waiting_rooms').select('*').eq('booking_id', booking.id).single();
          if (data) {
            setWaitingRoom(data);
            if (data.patient_ready && data.doctor_ready && data.status !== 'in_session') {
              await supabase.from('waiting_rooms').update({ status: 'in_session', session_started_at: new Date().toISOString() }).eq('id', data.id);
              if (onSessionStart) onSessionStart();
            }
          }
        } catch (error) { console.log('Polling error:', error.message); }
      }, 3000);
    } catch (error) {
      console.log('Error initializing waiting room:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markReady = async () => {
    setMarkingReady(true);
    try {
      const updateData = { updated_at: new Date().toISOString() };
      if (userRole === 'patient') { updateData.patient_ready = true; updateData.patient_joined_at = new Date().toISOString(); }
      else { updateData.doctor_ready = true; updateData.doctor_joined_at = new Date().toISOString(); updateData.status = 'doctor_ready'; }
      const { error } = await supabase.from('waiting_rooms').update(updateData).eq('booking_id', booking.id);
      if (error) throw error;
      setIsReady(true);
      const notifyUserId = userRole === 'patient' ? booking.doctor_id : booking.patient_id;
      await supabase.from('notifications').insert({ user_id: notifyUserId, title: userRole === 'patient' ? '👤 Patient is Ready!' : '👨‍⚕️ Doctor is Ready!', message: `${userRole === 'patient' ? 'Your patient' : 'Dr. ' + (doctorProfile?.specialty || '')} is ready to start the session`, type: 'booking' });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setMarkingReady(false);
    }
  };

  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`; };

  const getStatusInfo = () => {
    if (!waitingRoom) return { label: 'Connecting...', icon: '⏳' };
    if (waitingRoom.status === 'in_session') return { label: 'Session Started!', icon: '🟢' };
    if (waitingRoom.patient_ready && waitingRoom.doctor_ready) return { label: 'Both Ready — Starting...', icon: '🚀' };
    if (userRole === 'patient' && waitingRoom.doctor_ready) return { label: 'Doctor is Ready!', icon: '👨‍⚕️' };
    if (userRole === 'doctor' && waitingRoom.patient_ready) return { label: 'Patient is Ready!', icon: '👤' };
    return { label: 'Waiting...', icon: '⏳' };
  };

  const statusInfo = getStatusInfo();
  const otherPartyReady = userRole === 'patient' ? waitingRoom?.doctor_ready : waitingRoom?.patient_ready;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={{ color: COLORS.white, marginTop: 16, fontSize: 16 }}>Setting up waiting room...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <View style={{ paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={onClose} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>← Leave Waiting Room</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>📹 Waiting Room</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{userRole === 'patient' ? `Waiting for Dr. ${booking.doctor_name || 'your doctor'}` : `Waiting for ${booking.patient_name}`}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 50, marginBottom: 12 }}>{statusInfo.icon}</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 }}>{statusInfo.label}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Wait time: {formatTime(waitTime)}</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: isReady ? COLORS.success : 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 24 }}>{userRole === 'patient' ? '👤' : '👨‍⚕️'}</Text>
              </View>
              <Text style={{ fontSize: 12, color: COLORS.white }}>You</Text>
              <Text style={{ fontSize: 10, color: isReady ? '#4ADE80' : 'rgba(255,255,255,0.5)' }}>{isReady ? '✓ Ready' : 'Not ready'}</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>⟷</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: otherPartyReady ? COLORS.success : 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 24 }}>{userRole === 'patient' ? '👨‍⚕️' : '👤'}</Text>
              </View>
              <Text style={{ fontSize: 12, color: COLORS.white }}>{userRole === 'patient' ? 'Doctor' : 'Patient'}</Text>
              <Text style={{ fontSize: 10, color: otherPartyReady ? '#4ADE80' : 'rgba(255,255,255,0.5)' }}>{otherPartyReady ? '✓ Ready' : 'Not joined'}</Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white, marginBottom: 10 }}>📋 Session Details</Text>
          {[{ label: 'Date', value: booking.preferred_date }, { label: 'Time', value: booking.preferred_time }, { label: 'Type', value: '📹 Video Call' }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.white }}>{item.value}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>💡 Tip while you wait</Text>
          <Text style={{ fontSize: 14, color: COLORS.white, lineHeight: 22 }}>{tips[currentTip]}</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 }}>✅ Pre-Session Checklist</Text>
          {[{ label: 'Camera working', icon: '📸' }, { label: 'Microphone working', icon: '🎤' }, { label: 'Good internet connection', icon: '📶' }, { label: 'Quiet environment', icon: '🔇' }, { label: 'Good lighting', icon: '💡' }].map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{item.label}</Text>
              <Text style={{ fontSize: 16, color: '#4ADE80', marginLeft: 'auto' }}>✓</Text>
            </View>
          ))}
        </View>
        {!isReady ? (
          <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 18, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }} onPress={markReady} disabled={markingReady}>
            {markingReady ? <ActivityIndicator color={COLORS.white} /> : <><Text style={{ fontSize: 22 }}>🟢</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>I'm Ready to Start</Text></>}
          </TouchableOpacity>
        ) : (
          <View style={{ backgroundColor: COLORS.success, borderRadius: 18, paddingVertical: 18, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>{otherPartyReady ? '🚀 Starting Session...' : '✅ Ready — Waiting for other party'}</Text>
          </View>
        )}
        <TouchableOpacity style={{ marginTop: 12, paddingVertical: 14, alignItems: 'center' }} onPress={onClose}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Leave waiting room</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
// ─── VIDEO CALL SCREEN ────────────────────────────────────────────────────────
function VideoCallScreen({ booking, userId, userRole, onCallEnd }) {
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSession, setVideoSession] = useState(null);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const timerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const channelName = useRef(`reinecare-${booking.id.replace(/-/g, '').slice(0, 16)}`);

  useEffect(() => {
    initAgora();
    return () => { cleanup(); };
  }, []);

  useEffect(() => {
    if (joined) {
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [joined]);

  const initAgora = async () => {
    setLoading(true);
    try {
      const AgoraRTC = require('react-native-agora');
      const { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } = AgoraRTC;
      const session = await getOrCreateVideoSession();
      setVideoSession(session);
      const agoraEngine = createAgoraRtcEngine();
      setEngine(agoraEngine);
      agoraEngine.initialize({ appId: AGORA_APP_ID, channelProfile: ChannelProfileType.ChannelProfileCommunication });
      agoraEngine.enableVideo();
      agoraEngine.enableAudio();
      agoraEngine.setEnableSpeakerphone(true);
      agoraEngine.addListener('onUserJoined', (connection, uid) => { setRemoteUid(uid); updateSessionStatus('active'); });
      agoraEngine.addListener('onUserOffline', (connection, uid) => { setRemoteUid(null); });
      agoraEngine.addListener('onUserMuteVideo', (connection, uid, muted) => { setRemoteVideoOn(!muted); });
      agoraEngine.addListener('onConnectionStateChanged', (connection, state) => { if (state === 5) setError('Connection lost. Please check your internet.'); });
      agoraEngine.addListener('onNetworkQuality', (connection, uid, txQuality, rxQuality) => {
        const quality = Math.max(txQuality, rxQuality);
        if (quality <= 2) setConnectionQuality('good');
        else if (quality <= 4) setConnectionQuality('fair');
        else setConnectionQuality('poor');
      });
      await agoraEngine.joinChannel(session.agora_token || '', channelName.current, userId.replace(/-/g, '').slice(0, 8).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), { clientRoleType: ClientRoleType.ClientRoleBroadcaster, publishMicrophoneTrack: true, publishCameraTrack: true, autoSubscribeAudio: true, autoSubscribeVideo: true });
      setJoined(true);
      updateParticipantStatus();
      autoHideControls();
    } catch (err) {
      console.log('Agora init error:', err);
      setError('Failed to join video call. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateVideoSession = async () => {
    try {
      const { data: existing } = await supabase.from('video_sessions').select('*').eq('booking_id', booking.id).single();
      if (existing) return existing;
      const { data: newSession, error } = await supabase.from('video_sessions').insert({ booking_id: booking.id, doctor_id: booking.doctor_id, patient_id: booking.patient_id, channel_name: channelName.current, agora_token: null, status: 'created' }).select().single();
      if (error) throw error;
      return newSession;
    } catch (error) {
      console.log('Error getting video session:', error.message);
      return { channel_name: channelName.current, agora_token: null };
    }
  };

  const updateSessionStatus = async (status) => {
    if (!videoSession?.id) return;
    try {
      await supabase.from('video_sessions').update({ status, started_at: status === 'active' ? new Date().toISOString() : undefined }).eq('id', videoSession.id);
    } catch (error) { console.log('Error updating session status:', error.message); }
  };

  const updateParticipantStatus = async () => {
    if (!videoSession?.id) return;
    try {
      const updateData = userRole === 'doctor' ? { doctor_joined: true } : { patient_joined: true };
      await supabase.from('video_sessions').update(updateData).eq('id', videoSession.id);
    } catch (error) { console.log('Error updating participant status:', error.message); }
  };

  const cleanup = async () => {
    clearInterval(timerRef.current);
    clearTimeout(controlsTimerRef.current);
    if (engine) {
      try {
        await engine.leaveChannel();
        engine.removeAllListeners();
        engine.release();
      } catch (err) { console.log('Cleanup error:', err); }
    }
  };

  const endCall = async () => {
    Alert.alert('End Call', 'Are you sure you want to end this video call?', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'End Call', style: 'destructive', onPress: async () => {
          if (videoSession?.id) {
            await supabase.from('video_sessions').update({ status: 'ended', ended_at: new Date().toISOString(), duration_seconds: callDuration }).eq('id', videoSession.id);
          }
          const notifyId = userRole === 'doctor' ? booking.patient_id : booking.doctor_id;
          await supabase.from('notifications').insert({ user_id: notifyId, title: '📹 Video Call Ended', message: `Your video consultation has ended. Duration: ${formatDuration(callDuration)}`, type: 'booking' });
          await cleanup();
          onCallEnd();
        }
      }
    ]);
  };

  const toggleMute = async () => {
    if (!engine) return;
    try { await engine.muteLocalAudioStream(!isMuted); setIsMuted(!isMuted); } catch (err) { console.log('Mute error:', err); }
  };

  const toggleCamera = async () => {
    if (!engine) return;
    try { await engine.muteLocalVideoStream(!isCameraOff); setIsCameraOff(!isCameraOff); } catch (err) { console.log('Camera error:', err); }
  };

  const switchCamera = async () => {
    if (!engine) return;
    try { await engine.switchCamera(); } catch (err) { console.log('Switch camera error:', err); }
  };

  const toggleSpeaker = async () => {
    if (!engine) return;
    try { await engine.setEnableSpeakerphone(!isSpeakerOn); setIsSpeakerOn(!isSpeakerOn); } catch (err) { console.log('Speaker error:', err); }
  };

  const autoHideControls = () => {
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 5000);
  };

  const handleScreenTap = () => { setShowControls(true); autoHideControls(); };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getQualityColor = () => { switch (connectionQuality) { case 'good': return '#4ADE80'; case 'fair': return '#FCD34D'; default: return '#F87171'; } };
  const getQualityIcon = () => { switch (connectionQuality) { case 'good': return '📶'; case 'fair': return '📶'; default: return '⚠️'; } };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.white, marginTop: 20, fontSize: 16 }}>Connecting to video call...</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: 13 }}>{userRole === 'doctor' ? `Patient: ${booking.patient_name}` : `Dr. ${booking.doctor_name}`}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <Text style={{ fontSize: 50, marginBottom: 16 }}>📵</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 8, textAlign: 'center' }}>Connection Failed</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>{error}</Text>
        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28, marginBottom: 12 }} onPress={() => { setError(null); setLoading(true); initAgora(); }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>🔄 Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 12 }} onPress={onCallEnd}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Leave</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const AgoraRTC = (() => { try { return require('react-native-agora'); } catch { return null; } })();
  const RtcSurfaceView = AgoraRTC?.RtcSurfaceView;
  const VideoSourceType = AgoraRTC?.VideoSourceType;

  return (
    <TouchableOpacity style={{ flex: 1, backgroundColor: '#0F172A' }} activeOpacity={1} onPress={handleScreenTap}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" hidden />
      {remoteUid !== null && RtcSurfaceView ? (
        <View style={{ flex: 1 }}>
          {remoteVideoOn ? (
            <RtcSurfaceView style={{ flex: 1 }} canvas={{ uid: remoteUid, sourceType: VideoSourceType?.VideoSourceRemote }} />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B' }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 50 }}>{userRole === 'patient' ? '👨‍⚕️' : '🙋'}</Text>
              </View>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>Camera is off</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B' }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 50 }}>{userRole === 'patient' ? '👨‍⚕️' : '🙋'}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 }}>Waiting for {userRole === 'patient' ? 'Doctor' : 'Patient'}...</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{userRole === 'patient' ? `Dr. ${booking.doctor_name || 'Doctor'}` : booking.patient_name}</Text>
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        </View>
      )}
      {joined && RtcSurfaceView && !isCameraOff && (
        <View style={{ position: 'absolute', top: 60, right: 16, width: 100, height: 140, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.white, elevation: 8 }}>
          <RtcSurfaceView style={{ flex: 1 }} canvas={{ uid: 0, sourceType: VideoSourceType?.VideoSourceCamera }} zOrderMediaOverlay={true} />
        </View>
      )}
      {joined && isCameraOff && (
        <View style={{ position: 'absolute', top: 60, right: 16, width: 100, height: 140, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.white, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30 }}>😶</Text>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Camera off</Text>
        </View>
      )}
      {showControls && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{userRole === 'patient' ? `Dr. ${booking.doctor_name || 'Doctor'}` : booking.patient_name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: joined ? '#4ADE80' : '#FCD34D' }} />
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{joined ? remoteUid ? 'Connected' : 'Waiting...' : 'Connecting...'}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>{formatDuration(callDuration)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Text style={{ fontSize: 12 }}>{getQualityIcon()}</Text>
                <Text style={{ fontSize: 11, color: getQualityColor() }}>{connectionQuality}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {showControls && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 50, paddingTop: 20, paddingHorizontal: 24, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: isMuted ? '#EF4444' : 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={toggleMute}>
              <Text style={{ fontSize: 26 }}>{isMuted ? '🔇' : '🎤'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', elevation: 4 }} onPress={endCall}>
              <Text style={{ fontSize: 30 }}>📵</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: isCameraOff ? '#EF4444' : 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={toggleCamera}>
              <Text style={{ fontSize: 26 }}>{isCameraOff ? '📵' : '📹'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
            {[
              { icon: '🔄', label: 'Flip', onPress: switchCamera },
              { icon: isSpeakerOn ? '🔊' : '🔈', label: 'Speaker', onPress: toggleSpeaker, active: isSpeakerOn },
              { icon: '💬', label: 'Chat', onPress: () => Alert.alert('Chat', 'Use the in-app chat for messaging during your call') },
              { icon: '⚠️', label: 'Report', onPress: () => Alert.alert('Report Issue', 'What issue are you experiencing?', [{ text: 'Poor audio', onPress: () => Alert.alert('Noted', 'Issue reported') }, { text: 'Poor video', onPress: () => Alert.alert('Noted', 'Issue reported') }, { text: 'Connection drop', onPress: () => Alert.alert('Noted', 'Issue reported') }, { text: 'Cancel', style: 'cancel' }]) },
            ].map((btn) => (
              <TouchableOpacity key={btn.label} style={{ alignItems: 'center', gap: 4 }} onPress={btn.onPress}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: btn.active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{btn.icon}</Text>
                </View>
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── HEALTH DASHBOARD ─────────────────────────────────────────────────────────
function HealthDashboard({ userId, patientProfile }) {
  const [metrics, setMetrics] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState('blood_pressure');
  const [metricValue, setMetricValue] = useState('');
  const [metricNotes, setMetricNotes] = useState('');
  const [savingMetric, setSavingMetric] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [activePrescriptions, setActivePrescriptions] = useState([]);

  const metricTypes = [
    { id: 'blood_pressure', icon: '❤️', label: 'Blood Pressure', unit: 'mmHg', placeholder: 'e.g. 120/80', color: '#FEE2E2', textColor: '#991B1B' },
    { id: 'blood_sugar', icon: '🩸', label: 'Blood Sugar', unit: 'mg/dL', placeholder: 'e.g. 90', color: '#DBEAFE', textColor: '#1E40AF' },
    { id: 'weight', icon: '⚖️', label: 'Weight', unit: 'kg', placeholder: 'e.g. 70', color: '#D1FAE5', textColor: '#065F46' },
    { id: 'heart_rate', icon: '💓', label: 'Heart Rate', unit: 'bpm', placeholder: 'e.g. 72', color: '#FEE2E2', textColor: '#991B1B' },
    { id: 'temperature', icon: '🌡️', label: 'Temperature', unit: '°C', placeholder: 'e.g. 37.0', color: '#FEF3C7', textColor: '#92400E' },
    { id: 'oxygen', icon: '💨', label: 'Oxygen Level', unit: '%', placeholder: 'e.g. 98', color: '#EDE9FE', textColor: '#5B21B6' },
  ];

  useEffect(() => { fetchHealthData(); }, []);

  const fetchHealthData = async () => {
    setLoadingMetrics(true);
    try {
      const [metricsRes, bookingsRes, prescriptionsRes] = await Promise.all([
        supabase.from('health_metrics').select('*').eq('patient_id', userId).order('recorded_at', { ascending: false }).limit(50),
        supabase.from('bookings').select('*').eq('patient_id', userId).eq('status', 'completed').order('created_at', { ascending: false }).limit(5),
        supabase.from('prescriptions').select('*').eq('patient_id', userId).eq('is_valid', true).order('created_at', { ascending: false }).limit(3),
      ]);
      setMetrics(metricsRes.data || []);
      setCompletedBookings(bookingsRes.data || []);
      setActivePrescriptions(prescriptionsRes.data || []);
    } catch (error) {
      console.log('Error fetching health data:', error.message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const saveMetric = async () => {
    if (!metricValue) { Alert.alert('Missing Info', 'Please enter a value'); return; }
    setSavingMetric(true);
    try {
      const metricInfo = metricTypes.find(m => m.id === selectedMetricType);
      const { error } = await supabase.from('health_metrics').insert({ patient_id: userId, metric_type: selectedMetricType, value: metricValue, unit: metricInfo?.unit, notes: metricNotes, recorded_at: new Date().toISOString() });
      if (error) throw error;
      Alert.alert('Saved! ✅', 'Health metric recorded successfully.');
      setMetricValue('');
      setMetricNotes('');
      setShowAddMetric(false);
      fetchHealthData();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSavingMetric(false);
    }
  };

  const getLatestMetric = (type) => metrics.find(m => m.metric_type === type);
  const getMetricHistory = (type) => metrics.filter(m => m.metric_type === type).slice(0, 7);

  const getHealthScore = () => {
    let score = 50;
    if (patientProfile?.blood_type) score += 10;
    if (patientProfile?.emergency_contact_name) score += 10;
    if (metrics.length > 0) score += 15;
    if (completedBookings.length > 0) score += 10;
    if (activePrescriptions.length > 0) score += 5;
    return Math.min(score, 100);
  };

  const healthScore = getHealthScore();
  const getScoreColor = () => { if (healthScore >= 80) return '#065F46'; if (healthScore >= 60) return '#92400E'; return '#991B1B'; };
  const getScoreBg = () => { if (healthScore >= 80) return '#D1FAE5'; if (healthScore >= 60) return '#FEF3C7'; return '#FEE2E2'; };
  const getScoreLabel = () => { if (healthScore >= 80) return 'Excellent 🌟'; if (healthScore >= 60) return 'Good 👍'; return 'Needs Attention ⚠️'; };

  if (loadingMetrics) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading health data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: getScoreBg(), borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: getScoreColor(), marginBottom: 8 }}>Your Health Score</Text>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 4, borderColor: getScoreColor() }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: getScoreColor() }}>{healthScore}</Text>
            <Text style={{ fontSize: 10, color: getScoreColor() }}>/ 100</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: getScoreColor() }}>{getScoreLabel()}</Text>
          <Text style={{ fontSize: 12, color: getScoreColor(), marginTop: 4, textAlign: 'center', opacity: 0.8 }}>Complete your profile and track metrics to improve your score</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[{ icon: '📅', label: 'Sessions', value: completedBookings.length, color: COLORS.primaryLight, textColor: COLORS.primary }, { icon: '💊', label: 'Prescriptions', value: activePrescriptions.length, color: '#D1FAE5', textColor: '#065F46' }, { icon: '📊', label: 'Metrics', value: metrics.length, color: '#DBEAFE', textColor: '#1E40AF' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 14, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: stat.textColor }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>👤 Profile Completeness</Text>
          {[
            { label: 'Blood Type', complete: !!patientProfile?.blood_type, value: patientProfile?.blood_type },
            { label: 'Date of Birth', complete: !!patientProfile?.date_of_birth, value: patientProfile?.date_of_birth },
            { label: 'Emergency Contact', complete: !!patientProfile?.emergency_contact_name, value: patientProfile?.emergency_contact_name },
            { label: 'Allergies Listed', complete: patientProfile?.allergies?.length > 0, value: patientProfile?.allergies?.length > 0 ? `${patientProfile.allergies.length} listed` : null },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: item.complete ? '#D1FAE5' : '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 12 }}>{item.complete ? '✓' : '!'}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 12, color: item.complete ? '#065F46' : COLORS.textLight }}>{item.complete ? (item.value || 'Set') : 'Not set'}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }} onPress={() => setShowAddMetric(true)}>
          <Text style={{ fontSize: 20 }}>➕</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Record Health Metric</Text>
        </TouchableOpacity>
        {showAddMetric && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📊 Record Metric</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Select Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {metricTypes.map((type) => (
                <TouchableOpacity key={type.id} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: selectedMetricType === type.id ? COLORS.primary : COLORS.border, backgroundColor: selectedMetricType === type.id ? COLORS.primaryLight : COLORS.white, flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => setSelectedMetricType(type.id)}>
                  <Text style={{ fontSize: 14 }}>{type.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedMetricType === type.id ? COLORS.primary : COLORS.gray }}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {(() => {
              const typeInfo = metricTypes.find(m => m.id === selectedMetricType);
              return (
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{typeInfo?.label} ({typeInfo?.unit}) *</Text>
                  <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder={typeInfo?.placeholder} value={metricValue} onChangeText={setMetricValue} />
                </View>
              );
            })()}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Notes (Optional)</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="Any additional notes..." value={metricNotes} onChangeText={setMetricNotes} />
            </View>
            <TouchableOpacity style={{ backgroundColor: savingMetric ? COLORS.gray : COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }} onPress={saveMetric} disabled={savingMetric}>
              {savingMetric ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Save Metric ✅</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }} onPress={() => { setShowAddMetric(false); setMetricValue(''); setMetricNotes(''); }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {metricTypes.some(type => getLatestMetric(type.id)) && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📊 Latest Readings</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {metricTypes.map((type) => {
                const latest = getLatestMetric(type.id);
                if (!latest) return null;
                return (
                  <View key={type.id} style={{ width: '47%', backgroundColor: type.color, borderRadius: 14, padding: 14 }}>
                    <Text style={{ fontSize: 20, marginBottom: 6 }}>{type.icon}</Text>
                    <Text style={{ fontSize: 11, color: type.textColor, opacity: 0.8 }}>{type.label}</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: type.textColor }}>{latest.value}</Text>
                    <Text style={{ fontSize: 11, color: type.textColor, opacity: 0.7 }}>{latest.unit}</Text>
                    <Text style={{ fontSize: 10, color: type.textColor, opacity: 0.6, marginTop: 4 }}>{new Date(latest.recorded_at).toLocaleDateString()}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        {metricTypes.map((type) => {
          const history = getMetricHistory(type.id);
          if (history.length < 2) return null;
          return (
            <View key={type.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>{type.icon} {type.label} History</Text>
              {history.map((metric, index) => (
                <View key={metric.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: index < history.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: type.textColor, marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: type.textColor }}>{metric.value} {metric.unit}</Text>
                    {metric.notes && <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{metric.notes}</Text>}
                  </View>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(metric.recorded_at).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          );
        })}
        {completedBookings.length > 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📅 Recent Sessions</Text>
            {completedBookings.map((booking) => (
              <View key={booking.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 20 }}>{booking.session_type === 'video' ? '📹' : '🏥'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{booking.session_type === 'video' ? 'Video Consultation' : 'Physical Visit'}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{booking.preferred_date}</Text>
                </View>
                <View style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#065F46' }}>✅ Done</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        {activePrescriptions.length > 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💊 Active Prescriptions</Text>
            {activePrescriptions.map((prescription) => (
              <View key={prescription.id} style={{ backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 6 }}>{prescription.diagnosis}</Text>
                <Text style={{ fontSize: 12, color: COLORS.primary }}>{prescription.medications?.length} medication{prescription.medications?.length !== 1 ? 's' : ''}</Text>
                <Text style={{ fontSize: 11, color: COLORS.primary, opacity: 0.7, marginTop: 4 }}>Issued: {new Date(prescription.created_at).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}
        {metrics.length === 0 && completedBookings.length === 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 40, alignItems: 'center', elevation: 2 }}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>❤️</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Start Tracking Your Health</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>Record your health metrics to get insights about your wellbeing over time</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── RATE APP PROMPT ──────────────────────────────────────────────────────────
function RateAppPrompt({ onDismiss }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRating = async (stars) => {
    setRating(stars);
    if (stars >= 4) {
      setTimeout(async () => {
        try {
          const StoreReview = require('expo-store-review');
          if (await StoreReview.isAvailableAsync()) await StoreReview.requestReview();
        } catch (error) { console.log('Store review not available'); }
        onDismiss();
      }, 500);
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) { Alert.alert('Please Rate', 'Please select a star rating'); return; }
    setSubmitting(true);
    try {
      await supabase.from('notifications').insert({ user_id: '00000000-0000-0000-0000-000000000000', title: `⭐ App Rating: ${rating} stars`, message: feedback || 'No feedback provided', type: 'general' });
      setSubmitted(true);
      setTimeout(onDismiss, 2000);
    } catch (error) {
      console.log('Error submitting feedback:', error.message);
      onDismiss();
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 32, alignItems: 'center', width: '100%' }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>🎉</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Thank You!</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>Your feedback helps us improve ReineCare</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
      <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🏥</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>Enjoying ReineCare?</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>Your feedback helps us connect more people with quality healthcare</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)} style={{ padding: 4 }}>
              <Text style={{ fontSize: 44 }}>{star <= rating ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
              {rating === 1 && '😞 Poor'}{rating === 2 && '😐 Fair'}{rating === 3 && '🙂 Good'}{rating === 4 && '😊 Very Good'}{rating === 5 && '🤩 Excellent!'}
            </Text>
          </View>
        )}
        {rating > 0 && rating < 4 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>How can we improve?</Text>
            <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray, minHeight: 80, textAlignVertical: 'top' }} placeholder="Tell us what we can do better..." value={feedback} onChangeText={setFeedback} multiline />
          </View>
        )}
        <View style={{ gap: 10 }}>
          {rating > 0 && rating < 4 && (
            <TouchableOpacity style={{ backgroundColor: submitting ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={submitFeedback} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Submit Feedback</Text>}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 12, alignItems: 'center' }} onPress={onDismiss}>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── EMERGENCY SOS BUTTON ─────────────────────────────────────────────────────
function EmergencySOSButton({ userId, patientProfile, patientName }) {
  const [showSOSPanel, setShowSOSPanel] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('general');
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const countdownRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const emergencyTypes = [
    { id: 'medical', icon: '🚑', label: 'Medical Emergency', color: '#991B1B' },
    { id: 'mental_health', icon: '🧠', label: 'Mental Health Crisis', color: '#5B21B6' },
    { id: 'accident', icon: '⚠️', label: 'Accident', color: '#92400E' },
    { id: 'general', icon: '🆘', label: 'General Emergency', color: '#065F46' },
  ];

  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]));
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (countdown === 0) { clearTimeout(countdownRef.current); sendSOS(); }
    else if (countdown !== null && countdown > 0) { countdownRef.current = setTimeout(() => setCountdown(prev => prev - 1), 1000); }
    return () => clearTimeout(countdownRef.current);
  }, [countdown]);

  const getLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    } catch (error) { console.log('Location error:', error.message); } finally { setGettingLocation(false); }
  };

  const startCountdown = async () => { await getLocation(); setCountdown(5); };
  const cancelCountdown = () => { clearTimeout(countdownRef.current); setCountdown(null); };

  const sendSOS = async () => {
    setSending(true);
    try {
      const { error } = await supabase.from('emergency_alerts').insert({ patient_id: userId, patient_name: patientName || 'Patient', emergency_type: selectedEmergencyType, location_lat: location?.lat, location_lng: location?.lng, message: emergencyMessage || `Emergency reported by ${patientName}`, status: 'active', admin_notified: true });
      if (error) throw error;
      await supabase.from('notifications').insert({ user_id: userId, title: '🆘 EMERGENCY ALERT SENT', message: 'Your emergency alert has been sent. Help is on the way. Emergency contact has been notified.', type: 'general' });
      setSent(true);
      setCountdown(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSending(false);
    }
  };

  const resetSOS = () => { setSent(false); setShowSOSPanel(false); setSelectedEmergencyType('general'); setEmergencyMessage(''); setCountdown(null); setLocation(null); };

  if (sent) {
    return (
      <View style={{ backgroundColor: '#FEE2E2', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 50, marginBottom: 12 }}>🆘</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#991B1B', marginBottom: 8 }}>Emergency Alert Sent!</Text>
        <Text style={{ fontSize: 14, color: '#991B1B', textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>Your emergency has been reported. {patientProfile?.emergency_contact_name ? `${patientProfile.emergency_contact_name} has been notified.` : ''} Help is being arranged.</Text>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16, width: '100%', marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#991B1B', marginBottom: 10 }}>🚨 Emergency Numbers</Text>
          {[{ label: 'Ambulance / Emergency', number: '112' }, { label: 'Police', number: '911' }, { label: 'Crisis Helpline', number: '988' }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
              <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#991B1B' }}>{item.number}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={{ borderWidth: 2, borderColor: '#991B1B', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 }} onPress={resetSOS}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#991B1B' }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 20 }}>
      {!showSOSPanel && (
        <TouchableOpacity onPress={() => setShowSOSPanel(true)} activeOpacity={0.8}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={{ backgroundColor: '#EF4444', borderRadius: 20, padding: 20, alignItems: 'center', flexDirection: 'row', gap: 14 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 32 }}>🆘</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white }}>Emergency SOS</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>Tap to send emergency alert</Text>
              </View>
              <Text style={{ fontSize: 24, color: COLORS.white }}>›</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}
      {showSOSPanel && (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 20, elevation: 4, borderWidth: 2, borderColor: '#EF4444' }}>
          {countdown !== null && (
            <View style={{ backgroundColor: '#EF4444', borderRadius: 14, padding: 20, alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 50, fontWeight: 'bold', color: COLORS.white }}>{countdown}</Text>
              <Text style={{ fontSize: 16, color: COLORS.white, marginBottom: 12 }}>Sending SOS in {countdown} seconds...</Text>
              <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 }} onPress={cancelCountdown}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#EF4444' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          {countdown === null && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#991B1B' }}>🆘 Emergency SOS</Text>
                <TouchableOpacity onPress={() => setShowSOSPanel(false)}><Text style={{ fontSize: 22, color: COLORS.textLight }}>✕</Text></TouchableOpacity>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Type of Emergency</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {emergencyTypes.map((type) => (
                  <TouchableOpacity key={type.id} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: selectedEmergencyType === type.id ? type.color : COLORS.border, backgroundColor: selectedEmergencyType === type.id ? type.color + '20' : COLORS.white, flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => setSelectedEmergencyType(type.id)}>
                    <Text style={{ fontSize: 14 }}>{type.icon}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: selectedEmergencyType === type.id ? type.color : COLORS.gray }}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Additional Info (Optional)</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, backgroundColor: COLORS.lightGray, minHeight: 60, textAlignVertical: 'top' }} placeholder="Describe your emergency..." value={emergencyMessage} onChangeText={setEmergencyMessage} multiline />
              </View>
              <View style={{ backgroundColor: location ? '#D1FAE5' : '#FEF3C7', borderRadius: 10, padding: 10, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {gettingLocation ? <ActivityIndicator size="small" color="#92400E" /> : <Text style={{ fontSize: 16 }}>{location ? '📍' : '⚠️'}</Text>}
                <Text style={{ fontSize: 13, color: location ? '#065F46' : '#92400E' }}>{gettingLocation ? 'Getting your location...' : location ? 'Location detected — will be shared' : 'Location will be detected when you send SOS'}</Text>
              </View>
              {patientProfile?.emergency_contact_name && (
                <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>📞 Emergency Contact: {patientProfile.emergency_contact_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.primary, marginTop: 2 }}>{patientProfile.emergency_contact_phone} will be notified</Text>
                </View>
              )}
              <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <Text style={{ fontSize: 12, color: '#991B1B', lineHeight: 18 }}>⚠️ This will alert the ReineCare team and your emergency contact. Only use in genuine emergencies. For life-threatening situations, call 112 or 911 directly.</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#EF4444', borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }} onPress={startCountdown} disabled={sending}>
                {sending ? <ActivityIndicator color={COLORS.white} /> : <><Text style={{ fontSize: 22 }}>🆘</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>Send SOS Alert</Text></>}
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 12, marginTop: 6 }} onPress={() => setShowSOSPanel(false)}>
                <Text style={{ fontSize: 14, color: COLORS.textLight }}>Cancel — I'm okay</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
// ─── SCHEDULE TEMPLATES ───────────────────────────────────────────────────────
function ScheduleTemplates({ doctorId, onApplyTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];
  const [selectedSlots, setSelectedSlots] = useState({ monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] });

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('schedule_templates').select('*').eq('doctor_id', doctorId).order('created_at', { ascending: false });
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) { console.log('Error fetching templates:', error.message); } finally { setLoading(false); }
  };

  const toggleSlot = (day, time) => {
    setSelectedSlots(prev => ({ ...prev, [day]: prev[day].includes(time) ? prev[day].filter(t => t !== time) : [...prev[day], time] }));
  };

  const saveTemplate = async () => {
    if (!templateName) { Alert.alert('Missing Info', 'Please enter a template name'); return; }
    const hasSlots = days.some(day => selectedSlots[day].length > 0);
    if (!hasSlots) { Alert.alert('No Slots', 'Please select at least one time slot'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('schedule_templates').insert({ doctor_id: doctorId, template_name: templateName, monday_slots: selectedSlots.monday, tuesday_slots: selectedSlots.tuesday, wednesday_slots: selectedSlots.wednesday, thursday_slots: selectedSlots.thursday, friday_slots: selectedSlots.friday, saturday_slots: selectedSlots.saturday, sunday_slots: selectedSlots.sunday, is_active: false });
      if (error) throw error;
      Alert.alert('Template Saved! ✅', `"${templateName}" has been saved.`);
      setTemplateName('');
      setSelectedSlots({ monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] });
      setShowCreateForm(false);
      fetchTemplates();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSaving(false); }
  };

  const applyTemplate = async (template, weeksAhead = 4) => {
    Alert.alert('Apply Template', `Apply "${template.template_name}" to the next ${weeksAhead} weeks?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Apply', onPress: async () => {
          setApplying(true);
          try {
            const slotsToInsert = [];
            const today = new Date();
            for (let week = 0; week < weeksAhead; week++) {
              days.forEach((day, dayIndex) => {
                const slots = template[`${day}_slots`] || [];
                if (slots.length === 0) return;
                const targetDay = dayIndex === 6 ? 0 : dayIndex + 1;
                const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysUntilTarget + (week * 7));
                const dateStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;
                slots.forEach(time => {
                  const [hour, minute] = time.split(':');
                  const endHour = minute === '30' ? String(parseInt(hour) + 1).padStart(2, '0') : hour;
                  const endMinute = minute === '30' ? '00' : '30';
                  slotsToInsert.push({ doctor_id: doctorId, date: dateStr, start_time: time, end_time: `${endHour}:${endMinute}`, is_available: true, is_booked: false });
                });
              });
            }
            if (slotsToInsert.length > 0) {
              const { error } = await supabase.from('time_slots').insert(slotsToInsert);
              if (error) throw error;
            }
            await supabase.from('schedule_templates').update({ is_active: true }).eq('id', template.id);
            Alert.alert('Template Applied! ✅', `${slotsToInsert.length} time slots added to your calendar for the next ${weeksAhead} weeks.`);
            fetchTemplates();
            if (onApplyTemplate) onApplyTemplate();
          } catch (error) { Alert.alert('Error', error.message); } finally { setApplying(false); }
        }
      }
    ]);
  };

  const deleteTemplate = async (templateId) => {
    Alert.alert('Delete Template', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await supabase.from('schedule_templates').delete().eq('id', templateId); fetchTemplates(); } }
    ]);
  };

  const getTotalSlots = (template) => days.reduce((sum, day) => sum + (template[`${day}_slots`]?.length || 0), 0);
  const getActiveDays = (template) => days.filter(day => template[`${day}_slots`]?.length > 0).length;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>📋 Schedule Templates</Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>Create reusable weekly schedules</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => setShowCreateForm(!showCreateForm)}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{showCreateForm ? '← Cancel' : '➕ New'}</Text>
        </TouchableOpacity>
      </View>
      {showCreateForm && (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Create New Template</Text>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Template Name *</Text>
            <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. Standard Week, Busy Season..." value={templateName} onChangeText={setTemplateName} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 12 }}>Select Time Slots Per Day</Text>
          {days.map((day, index) => (
            <View key={day} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.secondary }}>{dayLabels[index]}</Text>
                {selectedSlots[day].length > 0 && (
                  <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600' }}>{selectedSlots[day].length} slots</Text>
                  </View>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {timeSlots.map((time) => {
                    const isSelected = selectedSlots[day].includes(time);
                    return (
                      <TouchableOpacity key={time} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5, borderColor: isSelected ? COLORS.secondary : COLORS.border, backgroundColor: isSelected ? COLORS.secondary : COLORS.white }} onPress={() => toggleSlot(day, time)}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: isSelected ? COLORS.white : COLORS.gray }}>{time}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ))}
          {days.some(day => selectedSlots[day].length > 0) && (
            <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>{days.reduce((sum, day) => sum + selectedSlots[day].length, 0)} total slots across {days.filter(day => selectedSlots[day].length > 0).length} days</Text>
            </View>
          )}
          <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }} onPress={saveTemplate} disabled={saving}>
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Save Template ✅</Text>}
          </TouchableOpacity>
        </View>
      )}
      {loading ? <ActivityIndicator color={COLORS.secondary} style={{ marginVertical: 20 }} /> : templates.length === 0 ? (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 32, alignItems: 'center', elevation: 2 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>No Templates Yet</Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center' }}>Create a template to quickly populate your weekly schedule</Text>
        </View>
      ) : templates.map((template) => (
        <View key={template.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{template.template_name}</Text>
                {template.is_active && <View style={{ backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, fontWeight: 'bold', color: '#065F46' }}>Active</Text></View>}
              </View>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{getTotalSlots(template)} slots • {getActiveDays(template)} days/week</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>Created {new Date(template.created_at).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 8 }} onPress={() => deleteTemplate(template.id)}>
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {days.map((day, index) => {
              const slots = template[`${day}_slots`] || [];
              if (slots.length === 0) return null;
              return (
                <View key={day} style={{ backgroundColor: COLORS.lightGray, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 11, color: COLORS.text, fontWeight: '600' }}>{dayLabels[index].slice(0, 3)}: {slots.length}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[{ label: '2 Weeks', weeks: 2 }, { label: '4 Weeks', weeks: 4 }, { label: '8 Weeks', weeks: 8 }].map((option) => (
              <TouchableOpacity key={option.label} style={{ flex: 1, backgroundColor: COLORS.secondary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => applyTemplate(template, option.weeks)} disabled={applying}>
                {applying ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.white }}>Apply {option.label}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── OFFICE HOURS MANAGER ─────────────────────────────────────────────────────
function OfficeHoursManager({ doctorId }) {
  const [officeHours, setOfficeHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [autoPopulate, setAutoPopulate] = useState(true);
  const [weeksAhead, setWeeksAhead] = useState(4);
  const [isActive, setIsActive] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotDurations = [15, 30, 45, 60, 90];
  const timeOptions = [];
  for (let h = 6; h <= 22; h++) { timeOptions.push(`${String(h).padStart(2, '0')}:00`); timeOptions.push(`${String(h).padStart(2, '0')}:30`); }

  useEffect(() => { fetchOfficeHours(); }, []);

  const fetchOfficeHours = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('office_hours').select('*').eq('doctor_id', doctorId).order('created_at', { ascending: true });
      setOfficeHours(data || []);
    } catch (error) { console.log('Error fetching office hours:', error.message); } finally { setLoading(false); }
  };

  const saveOfficeHour = async (day) => {
    if (!startTime || !endTime) { Alert.alert('Missing Info', 'Please set start and end times'); return; }
    if (startTime >= endTime) { Alert.alert('Invalid Times', 'End time must be after start time'); return; }
    setSaving(true);
    try {
      const existing = officeHours.find(oh => oh.day_of_week === day);
      if (existing) {
        await supabase.from('office_hours').update({ start_time: startTime, end_time: endTime, slot_duration: slotDuration, is_active: isActive, auto_populate: autoPopulate, weeks_ahead: weeksAhead, updated_at: new Date().toISOString() }).eq('id', existing.id);
      } else {
        await supabase.from('office_hours').insert({ doctor_id: doctorId, day_of_week: day, start_time: startTime, end_time: endTime, slot_duration: slotDuration, is_active: isActive, auto_populate: autoPopulate, weeks_ahead: weeksAhead });
      }
      setEditingDay(null);
      fetchOfficeHours();
      Alert.alert('Saved! ✅', `Office hours for ${day} saved.`);
    } catch (error) { Alert.alert('Error', error.message); } finally { setSaving(false); }
  };

  const deleteOfficeHour = async (day) => {
    Alert.alert('Remove Office Hours', `Remove ${day} from your office hours?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => { await supabase.from('office_hours').delete().eq('doctor_id', doctorId).eq('day_of_week', day); fetchOfficeHours(); } }
    ]);
  };

  const generateSlots = async () => {
    const activeHours = officeHours.filter(oh => oh.is_active && oh.auto_populate);
    if (activeHours.length === 0) { Alert.alert('No Active Hours', 'Please add and activate office hours first'); return; }
    Alert.alert('Generate Time Slots', `This will generate time slots for the next ${Math.max(...activeHours.map(oh => oh.weeks_ahead))} weeks based on your office hours. Continue?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Generate', onPress: async () => {
          setGenerating(true);
          try {
            const slotsToInsert = [];
            const today = new Date();
            const maxWeeks = Math.max(...activeHours.map(oh => oh.weeks_ahead));
            for (let week = 0; week < maxWeeks; week++) {
              for (const oh of activeHours) {
                const dayIndex = days.indexOf(oh.day_of_week);
                const targetDay = dayIndex + 1 === 7 ? 0 : dayIndex + 1;
                const daysUntil = (targetDay - today.getDay() + 7) % 7;
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysUntil + (week * 7));
                if (targetDate <= today) continue;
                const dateStr = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;
                let currentTime = oh.start_time;
                while (currentTime < oh.end_time) {
                  const [hour, minute] = currentTime.split(':').map(Number);
                  const totalMinutes = hour * 60 + minute + oh.slot_duration;
                  const endHour = Math.floor(totalMinutes / 60);
                  const endMinute = totalMinutes % 60;
                  const slotEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
                  if (slotEndTime <= oh.end_time) slotsToInsert.push({ doctor_id: doctorId, date: dateStr, start_time: currentTime, end_time: slotEndTime, is_available: true, is_booked: false });
                  currentTime = slotEndTime;
                  if (slotEndTime >= oh.end_time) break;
                }
              }
            }
            if (slotsToInsert.length > 0) {
              const { data: existing } = await supabase.from('time_slots').select('date, start_time').eq('doctor_id', doctorId);
              const existingSet = new Set((existing || []).map(s => `${s.date}-${s.start_time}`));
              const newSlots = slotsToInsert.filter(s => !existingSet.has(`${s.date}-${s.start_time}`));
              if (newSlots.length > 0) await supabase.from('time_slots').insert(newSlots);
              Alert.alert('Slots Generated! ✅', `${newSlots.length} new time slots added to your calendar.`);
            } else { Alert.alert('No New Slots', 'All slots for this period already exist.'); }
          } catch (error) { Alert.alert('Error', error.message); } finally { setGenerating(false); }
        }
      }
    ]);
  };

  const startEditDay = (day) => {
    const existing = officeHours.find(oh => oh.day_of_week === day);
    if (existing) { setStartTime(existing.start_time); setEndTime(existing.end_time); setSlotDuration(existing.slot_duration); setIsActive(existing.is_active); setAutoPopulate(existing.auto_populate); setWeeksAhead(existing.weeks_ahead); }
    else { setStartTime('09:00'); setEndTime('17:00'); setSlotDuration(30); setIsActive(true); setAutoPopulate(true); setWeeksAhead(4); }
    setEditingDay(day);
  };

  const getSlotsCount = (oh) => {
    if (!oh) return 0;
    const [startH, startM] = oh.start_time.split(':').map(Number);
    const [endH, endM] = oh.end_time.split(':').map(Number);
    return Math.floor(((endH * 60 + endM) - (startH * 60 + startM)) / oh.slot_duration);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>🕐 Office Hours</Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>Set recurring weekly availability</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: generating ? COLORS.gray : COLORS.success, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={generateSlots} disabled={generating}>
          {generating ? <ActivityIndicator size="small" color={COLORS.white} /> : <><Text style={{ fontSize: 14 }}>⚡</Text><Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.white }}>Generate</Text></>}
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <Text style={{ fontSize: 13, color: COLORS.primary, lineHeight: 20 }}>💡 Set your weekly office hours once, then tap "Generate" to automatically create time slots for upcoming weeks.</Text>
      </View>
      {loading ? <ActivityIndicator color={COLORS.secondary} style={{ marginVertical: 20 }} /> : (
        <View>
          {days.map((day) => {
            const oh = officeHours.find(h => h.day_of_week === day);
            const isEditing = editingDay === day;
            return (
              <View key={day} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, elevation: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isEditing ? 16 : 0 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{day}</Text>
                    {oh && !isEditing && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <Text style={{ fontSize: 13, color: oh.is_active ? COLORS.primary : COLORS.textLight }}>{oh.start_time} — {oh.end_time}</Text>
                        <View style={{ backgroundColor: oh.is_active ? '#D1FAE5' : '#FEE2E2', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, fontWeight: '600', color: oh.is_active ? '#065F46' : '#991B1B' }}>{oh.is_active ? '✅ Active' : '⏸ Paused'}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: COLORS.textLight }}>~{getSlotsCount(oh)} slots</Text>
                      </View>
                    )}
                    {!oh && !isEditing && <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>Not working</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity style={{ backgroundColor: isEditing ? COLORS.border : COLORS.secondary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }} onPress={() => isEditing ? setEditingDay(null) : startEditDay(day)}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: isEditing ? COLORS.gray : COLORS.white }}>{isEditing ? 'Cancel' : oh ? '✏️ Edit' : '+ Add'}</Text>
                    </TouchableOpacity>
                    {oh && !isEditing && (
                      <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }} onPress={() => deleteOfficeHour(day)}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#991B1B' }}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {isEditing && (
                  <View>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Start Time</Text>
                        <ScrollView style={{ maxHeight: 120, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.lightGray }}>
                          {timeOptions.map((time) => (
                            <TouchableOpacity key={time} style={{ padding: 10, backgroundColor: startTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setStartTime(time)}>
                              <Text style={{ fontSize: 14, fontWeight: startTime === time ? 'bold' : '400', color: startTime === time ? COLORS.white : COLORS.text, textAlign: 'center' }}>{time}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>End Time</Text>
                        <ScrollView style={{ maxHeight: 120, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.lightGray }}>
                          {timeOptions.map((time) => (
                            <TouchableOpacity key={time} style={{ padding: 10, backgroundColor: endTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setEndTime(time)}>
                              <Text style={{ fontSize: 14, fontWeight: endTime === time ? 'bold' : '400', color: endTime === time ? COLORS.white : COLORS.text, textAlign: 'center' }}>{time}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Slot Duration</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
                      {slotDurations.map((d) => (
                        <TouchableOpacity key={d} style={{ flex: 1, borderWidth: 2, borderColor: slotDuration === d ? COLORS.secondary : COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: slotDuration === d ? COLORS.secondary : COLORS.white }} onPress={() => setSlotDuration(d)}>
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: slotDuration === d ? COLORS.white : COLORS.gray }}>{d}m</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Generate How Far Ahead</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
                      {[2, 4, 6, 8].map((w) => (
                        <TouchableOpacity key={w} style={{ flex: 1, borderWidth: 2, borderColor: weeksAhead === w ? COLORS.secondary : COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: weeksAhead === w ? COLORS.secondary : COLORS.white }} onPress={() => setWeeksAhead(w)}>
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: weeksAhead === w ? COLORS.white : COLORS.gray }}>{w}w</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {[{ label: 'Active', description: 'Enable this day', value: isActive, setter: setIsActive }, { label: 'Auto Generate', description: 'Include in slot generation', value: autoPopulate, setter: setAutoPopulate }].map((toggle) => (
                      <TouchableOpacity key={toggle.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 12, marginBottom: 10 }} onPress={() => toggle.setter(!toggle.value)}>
                        <View>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{toggle.label}</Text>
                          <Text style={{ fontSize: 11, color: COLORS.textLight }}>{toggle.description}</Text>
                        </View>
                        <View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: toggle.value ? COLORS.success : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.white, alignSelf: toggle.value ? 'flex-end' : 'flex-start' }} />
                        </View>
                      </TouchableOpacity>
                    ))}
                    {startTime && endTime && startTime < endTime && (
                      <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <Text style={{ fontSize: 13, color: COLORS.primary }}>{day}: {startTime} — {endTime} • ~{getSlotsCount({ start_time: startTime, end_time: endTime, slot_duration: slotDuration })} slots of {slotDuration} minutes</Text>
                      </View>
                    )}
                    <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }} onPress={() => saveOfficeHour(day)} disabled={saving}>
                      {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Save {day} Hours ✅</Text>}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─── DOCTOR AVAILABILITY CALENDAR ─────────────────────────────────────────────
function DoctorAvailabilityCalendar({ doctorId }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthSlots, setMonthSlots] = useState({});
  const [daySlots, setDaySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDay, setLoadingDay] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [addStartTime, setAddStartTime] = useState('09:00');
  const [addEndTime, setAddEndTime] = useState('09:30');
  const [saving, setSaving] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkDates, setBulkDates] = useState([]);
  const [bulkStartTime, setBulkStartTime] = useState('09:00');
  const [bulkEndTime, setBulkEndTime] = useState('17:00');
  const [bulkSlotDuration, setBulkSlotDuration] = useState(30);

  const timeOptions = [];
  for (let h = 6; h <= 22; h++) { timeOptions.push(`${String(h).padStart(2, '0')}:00`); timeOptions.push(`${String(h).padStart(2, '0')}:30`); }
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => { fetchMonthSlots(); }, [currentMonth]);
  useEffect(() => { if (selectedDate) fetchDaySlots(selectedDate); }, [selectedDate]);

  const formatDate = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  const fetchMonthSlots = async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const monthStr = `/${String(month).padStart(2, '0')}/${year}`;
      const { data } = await supabase.from('time_slots').select('date, start_time, end_time, is_available, is_booked, id').eq('doctor_id', doctorId).like('date', `%${monthStr}`);
      const slotMap = {};
      (data || []).forEach(slot => {
        if (!slotMap[slot.date]) slotMap[slot.date] = { total: 0, available: 0, booked: 0 };
        slotMap[slot.date].total += 1;
        if (slot.is_booked) slotMap[slot.date].booked += 1;
        else if (slot.is_available) slotMap[slot.date].available += 1;
      });
      setMonthSlots(slotMap);
    } catch (error) { console.log('Error fetching month slots:', error.message); } finally { setLoading(false); }
  };

  const fetchDaySlots = async (date) => {
    setLoadingDay(true);
    try {
      const { data } = await supabase.from('time_slots').select('*').eq('doctor_id', doctorId).eq('date', date).order('start_time', { ascending: true });
      setDaySlots(data || []);
    } catch (error) { console.log('Error fetching day slots:', error.message); } finally { setLoadingDay(false); }
  };

  const addSlot = async (date) => {
    if (!addStartTime || !addEndTime) return;
    if (addStartTime >= addEndTime) { Alert.alert('Invalid Times', 'End time must be after start time'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('time_slots').insert({ doctor_id: doctorId, date, start_time: addStartTime, end_time: addEndTime, is_available: true, is_booked: false });
      if (error) throw error;
      setShowAddSlot(false);
      fetchDaySlots(date);
      fetchMonthSlots();
    } catch (error) { Alert.alert('Error', error.message.includes('unique') ? 'This time slot already exists' : error.message); } finally { setSaving(false); }
  };

  const toggleSlotAvailability = async (slotId, currentAvailable) => {
    try {
      await supabase.from('time_slots').update({ is_available: !currentAvailable }).eq('id', slotId);
      fetchDaySlots(selectedDate);
      fetchMonthSlots();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const deleteSlot = async (slotId) => {
    Alert.alert('Delete Slot', 'Remove this time slot?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await supabase.from('time_slots').delete().eq('id', slotId); fetchDaySlots(selectedDate); fetchMonthSlots(); } }
    ]);
  };

  const generateBulkSlots = async () => {
    if (bulkDates.length === 0) { Alert.alert('No Dates', 'Please select dates first'); return; }
    if (bulkStartTime >= bulkEndTime) { Alert.alert('Invalid Times', 'End time must be after start time'); return; }
    setSaving(true);
    try {
      const slotsToInsert = [];
      bulkDates.forEach(date => {
        let currentTime = bulkStartTime;
        while (currentTime < bulkEndTime) {
          const [hour, minute] = currentTime.split(':').map(Number);
          const totalMinutes = hour * 60 + minute + bulkSlotDuration;
          const endHour = Math.floor(totalMinutes / 60);
          const endMinute = totalMinutes % 60;
          const slotEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
          if (slotEndTime <= bulkEndTime) slotsToInsert.push({ doctor_id: doctorId, date, start_time: currentTime, end_time: slotEndTime, is_available: true, is_booked: false });
          currentTime = slotEndTime;
          if (currentTime >= bulkEndTime) break;
        }
      });
      if (slotsToInsert.length > 0) {
        const { error } = await supabase.from('time_slots').insert(slotsToInsert);
        if (error && !error.message.includes('unique')) throw error;
      }
      Alert.alert('Done! ✅', `${slotsToInsert.length} slots generated across ${bulkDates.length} days`);
      setBulkDates([]);
      setBulkMode(false);
      fetchMonthSlots();
      if (selectedDate) fetchDaySlots(selectedDate);
    } catch (error) { Alert.alert('Error', error.message); } finally { setSaving(false); }
  };

  const toggleBulkDate = (date) => { setBulkDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]); };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = formatDate(date);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = date.toDateString() === today.toDateString();
      const slots = monthSlots[dateStr];
      days.push({ date: d, dateStr, isPast, isToday, slots });
    }
    return days;
  };

  const prevMonth = () => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); setSelectedDate(null); };
  const calDays = getDaysInMonth();

  return (
    <View>
      <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={prevMonth}>
            <Text style={{ fontSize: 18, color: COLORS.text }}>‹</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>{monthNames[currentMonth.getMonth()]}</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>{currentMonth.getFullYear()}</Text>
          </View>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={nextMonth}>
            <Text style={{ fontSize: 18, color: COLORS.text }}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {daysOfWeek.map((day) => (
            <View key={day} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.textLight }}>{day}</Text>
            </View>
          ))}
        </View>
        {loading ? <ActivityIndicator color={COLORS.secondary} style={{ marginVertical: 20 }} /> : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {calDays.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={{ width: '14.28%', aspectRatio: 1 }} />;
              const isSelected = selectedDate === day.dateStr;
              const isBulkSelected = bulkDates.includes(day.dateStr);
              const hasSlots = !!day.slots;
              const hasAvailable = day.slots?.available > 0;
              const isFullyBooked = hasSlots && day.slots.available === 0 && day.slots.booked > 0;
              return (
                <TouchableOpacity key={day.date} style={{ width: '14.28%', aspectRatio: 1, padding: 2 }} onPress={() => { if (bulkMode) { if (!day.isPast) toggleBulkDate(day.dateStr); } else { setSelectedDate(day.dateStr); setShowAddSlot(false); } }} disabled={day.isPast && !bulkMode}>
                  <View style={{ flex: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: isSelected ? COLORS.secondary : isBulkSelected ? COLORS.primary : day.isToday ? COLORS.primaryLight : 'transparent', borderWidth: day.isToday && !isSelected ? 2 : 0, borderColor: COLORS.primary, opacity: day.isPast ? 0.4 : 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: isSelected || day.isToday ? 'bold' : '400', color: isSelected || isBulkSelected ? COLORS.white : day.isToday ? COLORS.primary : COLORS.text }}>{day.date}</Text>
                    {hasSlots && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isSelected || isBulkSelected ? COLORS.white : isFullyBooked ? COLORS.error : hasAvailable ? COLORS.success : COLORS.gray, marginTop: 2 }} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'center' }}>
          {[{ color: COLORS.success, label: 'Available' }, { color: COLORS.error, label: 'Fully Booked' }, { color: COLORS.secondary, label: 'Selected' }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
              <Text style={{ fontSize: 10, color: COLORS.textLight }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: bulkMode ? COLORS.primary : COLORS.white, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: bulkMode ? COLORS.primary : COLORS.border, flexDirection: 'row', justifyContent: 'center', gap: 6 }} onPress={() => { setBulkMode(!bulkMode); setBulkDates([]); setSelectedDate(null); }}>
          <Text style={{ fontSize: 16 }}>{bulkMode ? '✅' : '📋'}</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: bulkMode ? COLORS.white : COLORS.secondary }}>{bulkMode ? 'Bulk Mode ON' : 'Bulk Add Slots'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', justifyContent: 'center', gap: 6 }} onPress={() => setCurrentMonth(new Date())}>
          <Text style={{ fontSize: 16 }}>📅</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>Today</Text>
        </TouchableOpacity>
      </View>
      {bulkMode && (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>📋 Bulk Slot Generator</Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 14 }}>{bulkDates.length > 0 ? `${bulkDates.length} days selected` : 'Tap dates on the calendar to select'}</Text>
          {bulkDates.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {bulkDates.sort().map(date => (
                <TouchableOpacity key={date} style={{ backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => toggleBulkDate(date)}>
                  <Text style={{ fontSize: 12, color: COLORS.primary }}>{date}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.primary }}>✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Start Time</Text>
              <ScrollView style={{ maxHeight: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.lightGray }}>
                {timeOptions.map((time) => (
                  <TouchableOpacity key={time} style={{ padding: 8, backgroundColor: bulkStartTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setBulkStartTime(time)}>
                    <Text style={{ fontSize: 13, textAlign: 'center', fontWeight: bulkStartTime === time ? 'bold' : '400', color: bulkStartTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>End Time</Text>
              <ScrollView style={{ maxHeight: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.lightGray }}>
                {timeOptions.map((time) => (
                  <TouchableOpacity key={time} style={{ padding: 8, backgroundColor: bulkEndTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setBulkEndTime(time)}>
                    <Text style={{ fontSize: 13, textAlign: 'center', fontWeight: bulkEndTime === time ? 'bold' : '400', color: bulkEndTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Slot Duration</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {[15, 30, 45, 60].map((d) => (
              <TouchableOpacity key={d} style={{ flex: 1, borderWidth: 2, borderColor: bulkSlotDuration === d ? COLORS.secondary : COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: bulkSlotDuration === d ? COLORS.secondary : COLORS.white }} onPress={() => setBulkSlotDuration(d)}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: bulkSlotDuration === d ? COLORS.white : COLORS.gray }}>{d}m</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={generateBulkSlots} disabled={saving || bulkDates.length === 0}>
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>⚡ Generate {bulkDates.length > 0 ? `Slots for ${bulkDates.length} Days` : 'Slots'}</Text>}
          </TouchableOpacity>
        </View>
      )}
      {selectedDate && !bulkMode && (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>📅 {selectedDate}</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight }}>{daySlots.length} slot{daySlots.length !== 1 ? 's' : ''} • {daySlots.filter(s => s.is_available && !s.is_booked).length} available</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }} onPress={() => setShowAddSlot(!showAddSlot)}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{showAddSlot ? 'Cancel' : '+ Add Slot'}</Text>
            </TouchableOpacity>
          </View>
          {showAddSlot && (
            <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>New Time Slot</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Start</Text>
                  <ScrollView style={{ maxHeight: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.white }}>
                    {timeOptions.map((time) => (
                      <TouchableOpacity key={time} style={{ padding: 8, backgroundColor: addStartTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setAddStartTime(time)}>
                        <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: addStartTime === time ? 'bold' : '400', color: addStartTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>End</Text>
                  <ScrollView style={{ maxHeight: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.white }}>
                    {timeOptions.map((time) => (
                      <TouchableOpacity key={time} style={{ padding: 8, backgroundColor: addEndTime === time ? COLORS.secondary : 'transparent' }} onPress={() => setAddEndTime(time)}>
                        <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: addEndTime === time ? 'bold' : '400', color: addEndTime === time ? COLORS.white : COLORS.text }}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.secondary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => addSlot(selectedDate)} disabled={saving}>
                {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Add Slot ✅</Text>}
              </TouchableOpacity>
            </View>
          )}
          {loadingDay ? <ActivityIndicator color={COLORS.secondary} /> : daySlots.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📅</Text>
              <Text style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 6 }}>No slots for this day</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight, textAlign: 'center' }}>Tap "+ Add Slot" or use Bulk Add to create slots</Text>
            </View>
          ) : (
            <View>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {[{ label: 'Available', count: daySlots.filter(s => s.is_available && !s.is_booked).length, color: '#D1FAE5', textColor: '#065F46' }, { label: 'Booked', count: daySlots.filter(s => s.is_booked).length, color: '#DBEAFE', textColor: '#1E40AF' }, { label: 'Paused', count: daySlots.filter(s => !s.is_available && !s.is_booked).length, color: '#FEE2E2', textColor: '#991B1B' }].map((stat) => (
                  <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 10, padding: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: stat.textColor }}>{stat.count}</Text>
                    <Text style={{ fontSize: 10, color: stat.textColor }}>{stat.label}</Text>
                  </View>
                ))}
              </View>
              {daySlots.map((slot) => (
                <View key={slot.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: slot.is_booked ? '#DBEAFE' : slot.is_available ? '#D1FAE5' : '#FEE2E2', borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{slot.start_time} — {slot.end_time}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <View style={{ backgroundColor: slot.is_booked ? '#1E40AF' : slot.is_available ? '#065F46' : '#991B1B', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.white }}>{slot.is_booked ? '📅 BOOKED' : slot.is_available ? '✅ AVAILABLE' : '⏸ PAUSED'}</Text>
                      </View>
                    </View>
                  </View>
                  {!slot.is_booked && (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: 8 }} onPress={() => toggleSlotAvailability(slot.id, slot.is_available)}>
                        <Text style={{ fontSize: 14 }}>{slot.is_available ? '⏸' : '▶️'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: 8 }} onPress={() => deleteSlot(slot.id)}>
                        <Text style={{ fontSize: 14 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📊 {monthNames[currentMonth.getMonth()]} Summary</Text>
        {(() => {
          const allSlots = Object.values(monthSlots);
          const totalSlots = allSlots.reduce((sum, d) => sum + d.total, 0);
          const totalAvailable = allSlots.reduce((sum, d) => sum + d.available, 0);
          const totalBooked = allSlots.reduce((sum, d) => sum + d.booked, 0);
          const activeDays = allSlots.length;
          return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {[{ label: 'Active Days', value: activeDays, icon: '📅', color: COLORS.primaryLight, textColor: COLORS.primary }, { label: 'Total Slots', value: totalSlots, icon: '🕐', color: COLORS.lightGray, textColor: COLORS.text }, { label: 'Available', value: totalAvailable, icon: '✅', color: '#D1FAE5', textColor: '#065F46' }, { label: 'Booked', value: totalBooked, icon: '📋', color: '#DBEAFE', textColor: '#1E40AF' }].map((stat) => (
                <View key={stat.label} style={{ width: '47%', backgroundColor: stat.color, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 22 }}>{stat.icon}</Text>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
                    <Text style={{ fontSize: 11, color: stat.textColor }}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })()}
      </View>
    </View>
  );
}

// ─── DOCTOR PERFORMANCE DASHBOARD ─────────────────────────────────────────────
function DoctorPerformanceDashboard({ doctorId, doctorName }) {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentReviews, setRecentReviews] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => { fetchPerformanceData(); }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const [perfRes, reviewsRes, bookingsRes] = await Promise.all([
        supabase.from('doctor_performance').select('*').eq('id', doctorId).single(),
        supabase.from('reviews').select('*').eq('doctor_id', doctorId).order('created_at', { ascending: false }).limit(5),
        supabase.from('bookings').select('status, session_type, created_at, amount').eq('doctor_id', doctorId).order('created_at', { ascending: false }),
      ]);
      const perf = perfRes.data;
      setPerformance(perf);
      setRecentReviews(reviewsRes.data || []);
      const bookings = bookingsRes.data || [];
      const now = new Date();
      const monthMap = {};
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        monthMap[key] = { label: month.toLocaleString('default', { month: 'short' }), bookings: 0, completed: 0 };
      }
      bookings.forEach(b => {
        const date = new Date(b.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthMap[key]) { monthMap[key].bookings += 1; if (b.status === 'completed') monthMap[key].completed += 1; }
      });
      setMonthlyStats(Object.values(monthMap));
      if (perf) {
        setGoals([
          { label: 'Complete 10 Sessions', current: perf.completed_bookings, target: 10, icon: '📅', color: COLORS.primary },
          { label: 'Achieve 4.5+ Rating', current: parseFloat(perf.avg_rating || 0), target: 4.5, icon: '⭐', color: '#F59E0B', isDecimal: true },
          { label: 'Help 20 Patients', current: perf.total_patients_helped, target: 20, icon: '👥', color: COLORS.secondary },
          { label: 'Earn Bronze Badge (10 Video Sessions)', current: perf.total_video_sessions, target: 10, icon: '🥉', color: '#92400E' },
        ]);
      }
    } catch (error) { console.log('Error fetching performance:', error.message); } finally { setLoading(false); }
  };

  const getPerformanceScore = () => {
    if (!performance) return 0;
    let score = 0;
    if (performance.avg_rating >= 4.5) score += 30;
    else if (performance.avg_rating >= 4.0) score += 20;
    else if (performance.avg_rating >= 3.0) score += 10;
    if (performance.completed_bookings >= 20) score += 25;
    else if (performance.completed_bookings >= 10) score += 15;
    else if (performance.completed_bookings >= 5) score += 10;
    if (performance.total_patients_helped >= 15) score += 20;
    else if (performance.total_patients_helped >= 5) score += 10;
    if (performance.telemedicine_badge_level === 'gold') score += 25;
    else if (performance.telemedicine_badge_level === 'silver') score += 15;
    else if (performance.telemedicine_badge_level === 'bronze') score += 10;
    return Math.min(score, 100);
  };

  const score = getPerformanceScore();
  const getScoreGrade = () => {
    if (score >= 80) return { grade: 'A', label: 'Excellent', color: '#065F46', bg: '#D1FAE5' };
    if (score >= 60) return { grade: 'B', label: 'Good', color: '#92400E', bg: '#FEF3C7' };
    if (score >= 40) return { grade: 'C', label: 'Average', color: '#1E40AF', bg: '#DBEAFE' };
    return { grade: 'D', label: 'Needs Improvement', color: '#991B1B', bg: '#FEE2E2' };
  };
  const gradeInfo = getScoreGrade();
  const maxMonthly = Math.max(...monthlyStats.map(m => m.bookings), 1);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading performance data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: gradeInfo.bg, borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: gradeInfo.color, marginBottom: 10 }}>Performance Score</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}>
            <Text style={{ fontSize: 56, fontWeight: 'bold', color: gradeInfo.color }}>{score}</Text>
            <Text style={{ fontSize: 20, color: gradeInfo.color, marginBottom: 10 }}>/100</Text>
          </View>
          <View style={{ backgroundColor: gradeInfo.color, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6, marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Grade {gradeInfo.grade} — {gradeInfo.label}</Text>
          </View>
          <Text style={{ fontSize: 13, color: gradeInfo.color, textAlign: 'center', opacity: 0.8 }}>Based on ratings, sessions, patients and badges</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: 'Total Bookings', value: performance?.total_bookings || 0, color: COLORS.primaryLight, textColor: COLORS.primary },
            { icon: '✅', label: 'Completed', value: performance?.completed_bookings || 0, color: '#D1FAE5', textColor: '#065F46' },
            { icon: '👥', label: 'Patients Helped', value: performance?.total_patients_helped || 0, color: '#DBEAFE', textColor: '#1E40AF' },
            { icon: '⭐', label: 'Avg Rating', value: parseFloat(performance?.avg_rating || 0).toFixed(1), color: '#FEF3C7', textColor: '#92400E' },
            { icon: '📹', label: 'Video Sessions', value: performance?.video_bookings || 0, color: '#EDE9FE', textColor: '#5B21B6' },
            { icon: '🏥', label: 'Physical Visits', value: performance?.physical_bookings || 0, color: '#FEE2E2', textColor: '#991B1B' },
          ].map((stat) => (
            <View key={stat.label} style={{ width: '47%', backgroundColor: stat.color, borderRadius: 14, padding: 14 }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: stat.textColor, opacity: 0.8 }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>📈 Monthly Bookings</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 16 }}>Last 6 months</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {monthlyStats.map((month, index) => {
              const height = (month.bookings / maxMonthly) * 80;
              const completedHeight = month.bookings > 0 ? (month.completed / month.bookings) * height : 0;
              return (
                <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                  {month.bookings > 0 && <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 4 }}>{month.bookings}</Text>}
                  <View style={{ width: '100%', height: Math.max(height, 4), borderRadius: 4, overflow: 'hidden', backgroundColor: COLORS.lightGray }}>
                    <View style={{ width: '100%', height: Math.max(completedHeight, 0), backgroundColor: COLORS.success, position: 'absolute', bottom: 0, borderRadius: 4 }} />
                    <View style={{ width: '100%', height: Math.max(height - completedHeight, 0), backgroundColor: COLORS.primary, opacity: 0.3, position: 'absolute', top: 0, borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 9, color: COLORS.textLight, marginTop: 4 }}>{month.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            {[{ color: COLORS.success, label: 'Completed' }, { color: COLORS.primary, label: 'Other', opacity: 0.3 }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, opacity: item.opacity || 1 }} />
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {performance?.total_bookings > 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📊 Success Rates</Text>
            {[{ label: 'Completion Rate', rate: performance.total_bookings > 0 ? Math.round((performance.completed_bookings / performance.total_bookings) * 100) : 0, color: COLORS.success }, { label: 'Video Session Rate', rate: performance.total_bookings > 0 ? Math.round(((performance.video_bookings || 0) / performance.total_bookings) * 100) : 0, color: COLORS.primary }].map((item) => (
              <View key={item.label} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 14, color: COLORS.text }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: item.color }}>{item.rate}%</Text>
                </View>
                <View style={{ height: 10, backgroundColor: COLORS.lightGray, borderRadius: 5, overflow: 'hidden' }}>
                  <View style={{ height: 10, width: `${item.rate}%`, backgroundColor: item.color, borderRadius: 5 }} />
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🎯 Performance Goals</Text>
          {goals.map((goal, index) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isAchieved = goal.isDecimal ? goal.current >= goal.target : goal.current >= goal.target;
            return (
              <View key={index} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 18 }}>{goal.icon}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{goal.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: goal.color }}>{goal.isDecimal ? goal.current.toFixed(1) : goal.current}/{goal.isDecimal ? goal.target.toFixed(1) : goal.target}</Text>
                    {isAchieved && <Text style={{ fontSize: 16 }}>🏆</Text>}
                  </View>
                </View>
                <View style={{ height: 8, backgroundColor: COLORS.lightGray, borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ height: 8, width: `${Math.min(progress, 100)}%`, backgroundColor: isAchieved ? COLORS.success : goal.color, borderRadius: 4 }} />
                </View>
              </View>
            );
          })}
        </View>
        {recentReviews.length > 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>⭐ Recent Patient Reviews</Text>
            {recentReviews.map((review) => (
              <View key={review.id} style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={{ fontSize: 16 }}>{star <= review.rating ? '⭐' : '☆'}</Text>
                  ))}
                  <Text style={{ fontSize: 11, color: COLORS.textLight, marginLeft: 8, alignSelf: 'center' }}>{new Date(review.created_at).toLocaleDateString()}</Text>
                </View>
                {review.comment && <Text style={{ fontSize: 13, color: COLORS.text, lineHeight: 20 }}>"{review.comment}"</Text>}
              </View>
            ))}
          </View>
        )}
        <View style={{ backgroundColor: COLORS.secondary, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 }}>💡 Tips to Improve Your Score</Text>
          {[
            score < 30 && '📅 Complete your first few sessions to build your profile',
            performance?.avg_rating < 4.5 && '⭐ Focus on patient experience to improve your rating',
            performance?.total_video_sessions < 10 && '📹 Complete 10 video sessions to earn your Bronze badge',
            performance?.total_patients_helped < 20 && '👥 Help more patients to increase your reach',
          ].filter(Boolean).slice(0, 4).map((tip, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.white }}>{index + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 20 }}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
// ─── ANALYTICS DASHBOARD ──────────────────────────────────────────────────────
function AnalyticsDashboard({ allUsers, allBookings }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [sessionTypeStats, setSessionTypeStats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, bookingsRes, doctorsRes] = await Promise.all([
        supabase.from('platform_analytics').select('*').single(),
        supabase.from('profiles').select('role, created_at').order('created_at', { ascending: true }),
        supabase.from('bookings').select('status, session_type, created_at').order('created_at', { ascending: true }),
        supabase.from('doctors_directory').select('id, full_name, specialty, rating, total_reviews, total_patients_helped').order('rating', { ascending: false }).limit(5),
      ]);
      setAnalytics(analyticsRes.data);
      setTopDoctors(doctorsRes.data || []);
      const users = usersRes.data || [];
      const bookings = bookingsRes.data || [];
      const now = new Date();
      const monthlyU = [];
      const monthlyB = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const label = month.toLocaleString('default', { month: 'short' });
        const monthUsers = users.filter(u => { const d = new Date(u.created_at); return d >= month && d < nextMonth; });
        const monthBookings = bookings.filter(b => { const d = new Date(b.created_at); return d >= month && d < nextMonth; });
        monthlyU.push({ label, patients: monthUsers.filter(u => u.role === 'patient').length, doctors: monthUsers.filter(u => u.role === 'doctor').length, total: monthUsers.length });
        monthlyB.push({ label, completed: monthBookings.filter(b => b.status === 'completed').length, pending: monthBookings.filter(b => b.status === 'pending').length, cancelled: monthBookings.filter(b => b.status === 'cancelled').length, total: monthBookings.length });
      }
      setMonthlyUsers(monthlyU);
      setMonthlyBookings(monthlyB);
      const videoCount = bookings.filter(b => b.session_type === 'video').length;
      const physicalCount = bookings.filter(b => b.session_type === 'physical').length;
      setSessionTypeStats([
        { label: 'Video', count: videoCount, icon: '📹', color: COLORS.primary },
        { label: 'Physical', count: physicalCount, icon: '🏥', color: COLORS.secondary },
      ]);
    } catch (error) { console.log('Error fetching analytics:', error.message); } finally { setLoading(false); setRefreshing(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchAnalytics(); };

  const maxMonthlyUsers = Math.max(...monthlyUsers.map(m => m.total), 1);
  const maxMonthlyBookings = Math.max(...monthlyBookings.map(m => m.total), 1);
  const completionRate = analytics ? analytics.total_bookings > 0 ? Math.round((analytics.completed_bookings / analytics.total_bookings) * 100) : 0 : 0;
  const verificationRate = analytics ? (analytics.total_doctors + analytics.total_patients + analytics.total_pharmacies) > 0 ? Math.round((analytics.verified_users / (analytics.total_doctors + analytics.total_patients + analytics.total_pharmacies)) * 100) : 0 : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
        <ActivityIndicator size="large" color={COLORS.admin} />
        <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.admin]} />}>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>Platform Overview</Text>
          <TouchableOpacity style={{ backgroundColor: COLORS.admin, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }} onPress={onRefresh}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.white }}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          {[{ icon: '🙋', label: 'Patients', value: analytics?.total_patients || 0, color: '#DBEAFE', textColor: '#1E40AF' }, { icon: '👨‍⚕️', label: 'Doctors', value: analytics?.total_doctors || 0, color: '#D1FAE5', textColor: '#065F46' }, { icon: '🏪', label: 'Pharmacies', value: analytics?.total_pharmacies || 0, color: '#EDE9FE', textColor: '#5B21B6' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 14, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: stat.textColor }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[{ icon: '📅', label: 'Total Bookings', value: analytics?.total_bookings || 0, color: COLORS.white, textColor: COLORS.text }, { icon: '✅', label: 'Completed', value: analytics?.completed_bookings || 0, color: '#D1FAE5', textColor: '#065F46' }, { icon: '❌', label: 'Cancelled', value: analytics?.cancelled_bookings || 0, color: '#FEE2E2', textColor: '#991B1B' }, { icon: '⏳', label: 'Pending', value: analytics?.pending_bookings || 0, color: '#FEF3C7', textColor: '#92400E' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 12, padding: 10, alignItems: 'center', elevation: stat.color === COLORS.white ? 2 : 0 }}>
              <Text style={{ fontSize: 18, marginBottom: 2 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 9, color: stat.textColor, textAlign: 'center' }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>📊 Key Metrics</Text>
          {[{ label: 'Booking Completion Rate', value: completionRate, suffix: '%', color: completionRate >= 70 ? COLORS.success : completionRate >= 50 ? '#F59E0B' : COLORS.error }, { label: 'User Verification Rate', value: verificationRate, suffix: '%', color: verificationRate >= 80 ? COLORS.success : '#F59E0B' }].map((metric) => (
            <View key={metric.label} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.text }}>{metric.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: metric.color }}>{metric.value}{metric.suffix}</Text>
              </View>
              <View style={{ height: 8, backgroundColor: COLORS.lightGray, borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ height: 8, width: `${Math.min(metric.value, 100)}%`, backgroundColor: metric.color, borderRadius: 4 }} />
              </View>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.text }}>Platform Rating</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F59E0B' }}>{parseFloat(analytics?.avg_platform_rating || 0).toFixed(1)} ⭐</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            {[{ label: 'Prescriptions', value: analytics?.total_prescriptions || 0, icon: '💊' }, { label: 'Referrals', value: analytics?.total_referrals || 0, icon: '📋' }, { label: 'Reviews', value: analytics?.total_reviews || 0, icon: '⭐' }].map((item) => (
              <View key={item.label} style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{item.value}</Text>
                <Text style={{ fontSize: 10, color: COLORS.textLight }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>👥 User Growth</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 16 }}>New users per month</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {monthlyUsers.map((month, index) => {
              const totalHeight = Math.max((month.total / maxMonthlyUsers) * 90, 4);
              const patientHeight = month.total > 0 ? (month.patients / month.total) * totalHeight : 0;
              const doctorHeight = month.total > 0 ? (month.doctors / month.total) * totalHeight : 0;
              return (
                <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                  {month.total > 0 && <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.admin, marginBottom: 4 }}>{month.total}</Text>}
                  <View style={{ width: '100%', height: Math.max(totalHeight, 4), borderRadius: 4, overflow: 'hidden', backgroundColor: COLORS.lightGray, justifyContent: 'flex-end' }}>
                    <View style={{ width: '100%', height: patientHeight, backgroundColor: '#3B82F6' }} />
                    <View style={{ width: '100%', height: doctorHeight, backgroundColor: '#10B981' }} />
                  </View>
                  <Text style={{ fontSize: 9, color: COLORS.textLight, marginTop: 4 }}>{month.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, justifyContent: 'center' }}>
            {[{ color: '#3B82F6', label: 'Patients' }, { color: '#10B981', label: 'Doctors' }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>📅 Booking Trends</Text>
          <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 16 }}>Bookings per month</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {monthlyBookings.map((month, index) => {
              const totalHeight = Math.max((month.total / maxMonthlyBookings) * 90, 4);
              const completedHeight = month.total > 0 ? (month.completed / month.total) * totalHeight : 0;
              const cancelledHeight = month.total > 0 ? (month.cancelled / month.total) * totalHeight : 0;
              const pendingHeight = totalHeight - completedHeight - cancelledHeight;
              return (
                <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                  {month.total > 0 && <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.admin, marginBottom: 4 }}>{month.total}</Text>}
                  <View style={{ width: '100%', height: Math.max(totalHeight, 4), borderRadius: 4, overflow: 'hidden', backgroundColor: COLORS.lightGray }}>
                    <View style={{ width: '100%', height: completedHeight, backgroundColor: COLORS.success, position: 'absolute', bottom: 0 }} />
                    <View style={{ width: '100%', height: cancelledHeight, backgroundColor: COLORS.error, position: 'absolute', bottom: completedHeight }} />
                    <View style={{ width: '100%', height: Math.max(pendingHeight, 0), backgroundColor: '#F59E0B', position: 'absolute', bottom: completedHeight + cancelledHeight }} />
                  </View>
                  <Text style={{ fontSize: 9, color: COLORS.textLight, marginTop: 4 }}>{month.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'center' }}>
            {[{ color: COLORS.success, label: 'Completed' }, { color: '#F59E0B', label: 'Pending' }, { color: COLORS.error, label: 'Cancelled' }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>📹 Session Types</Text>
          {sessionTypeStats.map((stat) => {
            const total = sessionTypeStats.reduce((sum, s) => sum + s.count, 0);
            const pct = total > 0 ? Math.round((stat.count / total) * 100) : 0;
            return (
              <View key={stat.label} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 18 }}>{stat.icon}</Text>
                    <Text style={{ fontSize: 14, color: COLORS.text }}>{stat.label}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: stat.color }}>{stat.count} ({pct}%)</Text>
                </View>
                <View style={{ height: 10, backgroundColor: COLORS.lightGray, borderRadius: 5, overflow: 'hidden' }}>
                  <View style={{ height: 10, width: `${pct}%`, backgroundColor: stat.color, borderRadius: 5 }} />
                </View>
              </View>
            );
          })}
        </View>
        {topDoctors.length > 0 && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>🏆 Top Rated Doctors</Text>
            {topDoctors.map((doctor, index) => (
              <View key={doctor.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: index < topDoctors.length - 1 ? 1 : 0, borderBottomColor: COLORS.border }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: index === 0 ? '#FEF3C7' : index === 1 ? '#F3F4F6' : COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 16 }}>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>Dr. {doctor.full_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.primary }}>{doctor.specialty}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F59E0B' }}>⭐ {parseFloat(doctor.rating || 0).toFixed(1)}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>{doctor.total_reviews || 0} reviews</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ backgroundColor: COLORS.admin, borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white, marginBottom: 14 }}>✅ Verification Status</Text>
          {[{ label: 'Verified Users', value: analytics?.verified_users || 0, icon: '✅' }, { label: 'Pending Verification', value: analytics?.pending_verification || 0, icon: '⏳' }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── REVENUE REPORT ───────────────────────────────────────────────────────────
function RevenueReport({ allUsers, allBookings }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({ grossRevenue: 0, commissionEarned: 0, doctorPayouts: 0, totalTransactions: 0, refundCount: 0, totalRefunded: 0 });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [withdrawalStats, setWithdrawalStats] = useState({ pending: 0, paid: 0, total: 0 });

  useEffect(() => { fetchRevenueData(); }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, withdrawalsRes] = await Promise.all([
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('withdrawal_requests').select('*'),
      ]);
      const transactions = transactionsRes.data || [];
      const withdrawals = withdrawalsRes.data || [];
      const released = transactions.filter(t => t.status === 'released');
      const refunded = transactions.filter(t => t.status === 'refunded');
      setTotalStats({ grossRevenue: released.reduce((sum, t) => sum + t.total_amount, 0), commissionEarned: released.reduce((sum, t) => sum + t.commission_amount, 0), doctorPayouts: released.reduce((sum, t) => sum + t.doctor_amount, 0), totalTransactions: released.length, refundCount: refunded.length, totalRefunded: refunded.reduce((sum, t) => sum + t.total_amount, 0) });
      setWithdrawalStats({ pending: withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0), paid: withdrawals.filter(w => w.status === 'paid').reduce((sum, w) => sum + w.amount, 0), total: withdrawals.reduce((sum, w) => sum + w.amount, 0) });
      const monthMap = {};
      transactions.forEach(t => {
        const date = new Date(t.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthMap[key]) monthMap[key] = { key, label, grossRevenue: 0, commission: 0, doctorPayouts: 0, transactions: 0, refunds: 0, appointments: 0, deliveries: 0 };
        if (t.status === 'released') { monthMap[key].grossRevenue += t.total_amount; monthMap[key].commission += t.commission_amount; monthMap[key].doctorPayouts += t.doctor_amount; monthMap[key].transactions += 1; if (t.type === 'appointment') monthMap[key].appointments += 1; if (t.type === 'delivery') monthMap[key].deliveries += 1; }
        if (t.status === 'refunded') monthMap[key].refunds += 1;
      });
      setMonthlyData(Object.values(monthMap).sort((a, b) => b.key.localeCompare(a.key)));
    } catch (error) { console.log('Error fetching revenue data:', error.message); } finally { setLoading(false); }
  };

  const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;
  const maxRevenue = Math.max(...monthlyData.map(m => m.commission), 1);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📊 Revenue Report</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Platform financial overview</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }} onPress={fetchRevenueData}>
            <Text style={{ fontSize: 13, color: COLORS.white, fontWeight: '600' }}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
          <ActivityIndicator size="large" color={COLORS.admin} />
          <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading revenue data...</Text>
        </View>
      ) : (
        <View style={{ padding: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1, backgroundColor: COLORS.admin, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Gross Revenue</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{formatCurrency(totalStats.grossRevenue)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: COLORS.success, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Commission (15%)</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{formatCurrency(totalStats.commissionEarned)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, elevation: 2 }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Doctor Payouts</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.secondary }}>{formatCurrency(totalStats.doctorPayouts)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 12, color: '#991B1B', marginBottom: 4 }}>Total Refunded</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#991B1B' }}>{formatCurrency(totalStats.totalRefunded)}</Text>
              <Text style={{ fontSize: 10, color: '#991B1B' }}>{totalStats.refundCount} refunds</Text>
            </View>
          </View>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💸 Withdrawal Summary</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[{ label: 'Pending', value: withdrawalStats.pending, color: '#FEF3C7', textColor: '#92400E' }, { label: 'Paid Out', value: withdrawalStats.paid, color: '#D1FAE5', textColor: '#065F46' }, { label: 'Total Requested', value: withdrawalStats.total, color: COLORS.lightGray, textColor: COLORS.text }].map((stat) => (
                <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: stat.textColor }}>{formatCurrency(stat.value)}</Text>
                  <Text style={{ fontSize: 10, color: stat.textColor, marginTop: 2, textAlign: 'center' }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
          {monthlyData.length > 0 && (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>📈 Monthly Commission</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 16 }}>Commission earned per month</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100 }}>
                {monthlyData.slice(0, 6).reverse().map((month, index) => {
                  const height = maxRevenue > 0 ? (month.commission / maxRevenue) * 80 : 4;
                  const isSelected = selectedMonth?.key === month.key;
                  return (
                    <TouchableOpacity key={month.key} style={{ flex: 1, alignItems: 'center' }} onPress={() => setSelectedMonth(isSelected ? null : month)}>
                      {month.commission > 0 && <Text style={{ fontSize: 9, fontWeight: 'bold', color: COLORS.admin, marginBottom: 4 }}>${month.commission.toFixed(0)}</Text>}
                      <View style={{ width: '100%', height: Math.max(height, 4), backgroundColor: isSelected ? COLORS.admin : COLORS.primary, borderRadius: 4, opacity: 0.8 }} />
                      <Text style={{ fontSize: 8, color: COLORS.textLight, marginTop: 4, textAlign: 'center' }}>{month.label.slice(0, 3)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedMonth && (
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginTop: 14 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>{selectedMonth.label}</Text>
                  {[{ label: 'Gross Revenue', value: formatCurrency(selectedMonth.grossRevenue) }, { label: 'Commission (15%)', value: formatCurrency(selectedMonth.commission) }, { label: 'Doctor Payouts', value: formatCurrency(selectedMonth.doctorPayouts) }, { label: 'Appointments', value: selectedMonth.appointments }, { label: 'Deliveries', value: selectedMonth.deliveries }, { label: 'Refunds', value: selectedMonth.refunds }].map((item) => (
                    <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📋 Monthly Breakdown</Text>
            <View style={{ flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: COLORS.border, marginBottom: 8 }}>
              <Text style={{ flex: 2, fontSize: 11, fontWeight: 'bold', color: COLORS.textLight }}>MONTH</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: 'bold', color: COLORS.textLight, textAlign: 'right' }}>GROSS</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: 'bold', color: COLORS.success, textAlign: 'right' }}>COMM.</Text>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: 'bold', color: COLORS.textLight, textAlign: 'right' }}>TXN</Text>
            </View>
            {monthlyData.length === 0 ? (
              <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center', paddingVertical: 20 }}>No revenue data yet</Text>
            ) : (
              monthlyData.map((month, index) => (
                <TouchableOpacity key={month.key} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: index < monthlyData.length - 1 ? 1 : 0, borderBottomColor: COLORS.border, backgroundColor: selectedMonth?.key === month.key ? COLORS.primaryLight : 'transparent', borderRadius: 8, paddingHorizontal: 4 }} onPress={() => setSelectedMonth(selectedMonth?.key === month.key ? null : month)}>
                  <Text style={{ flex: 2, fontSize: 13, color: COLORS.text }}>{month.label}</Text>
                  <Text style={{ flex: 1, fontSize: 13, color: COLORS.text, textAlign: 'right' }}>{formatCurrency(month.grossRevenue)}</Text>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: COLORS.success, textAlign: 'right' }}>{formatCurrency(month.commission)}</Text>
                  <Text style={{ flex: 1, fontSize: 13, color: COLORS.textLight, textAlign: 'right' }}>{month.transactions}</Text>
                </TouchableOpacity>
              ))
            )}
            {monthlyData.length > 0 && (
              <View style={{ flexDirection: 'row', paddingTop: 12, borderTopWidth: 2, borderTopColor: COLORS.admin, marginTop: 8 }}>
                <Text style={{ flex: 2, fontSize: 13, fontWeight: 'bold', color: COLORS.text }}>TOTAL</Text>
                <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: COLORS.text, textAlign: 'right' }}>{formatCurrency(totalStats.grossRevenue)}</Text>
                <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: COLORS.success, textAlign: 'right' }}>{formatCurrency(totalStats.commissionEarned)}</Text>
                <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: COLORS.textLight, textAlign: 'right' }}>{totalStats.totalTransactions}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── ADMIN MATCHING ───────────────────────────────────────────────────────────
function AdminMatching({ adminId, allUsers }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [matchReason, setMatchReason] = useState('');
  const [matchNotes, setMatchNotes] = useState('');
  const [priority, setPriority] = useState('normal');
  const [saving, setSaving] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const matchReasons = ['Specialty match for condition', 'Language preference', 'Location proximity', 'Insurance compatibility', 'Urgent care needed', 'Follow-up care', 'Second opinion', 'Chronic condition management'];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, doctorsRes, matchesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'patient').order('created_at', { ascending: false }),
        supabase.from('doctors_directory').select('*'),
        supabase.from('admin_matches').select('*').order('created_at', { ascending: false }),
      ]);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
      setMatches(matchesRes.data || []);
    } catch (error) { console.log('Error fetching matching data:', error.message); } finally { setLoading(false); }
  };

  const createMatch = async () => {
    if (!selectedPatient || !selectedDoctor) { Alert.alert('Missing Info', 'Please select both a patient and a doctor'); return; }
    if (!matchReason) { Alert.alert('Missing Info', 'Please select a match reason'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('admin_matches').insert({ admin_id: adminId, patient_id: selectedPatient.id, doctor_id: selectedDoctor.id, match_reason: matchReason, match_notes: matchNotes, priority, status: 'pending' });
      if (error) throw error;
      await supabase.from('notifications').insert([
        { user_id: selectedPatient.id, title: '👨‍⚕️ Doctor Matched For You!', message: `Our team has matched you with Dr. ${selectedDoctor.full_name} (${selectedDoctor.specialty}). Reason: ${matchReason}`, type: 'booking' },
        { user_id: selectedDoctor.id, title: '👤 Patient Matched To You', message: `Admin has matched a patient to you. Reason: ${matchReason}. Please reach out to them.`, type: 'booking' },
      ]);
      Alert.alert('Match Created! ✅', `${selectedPatient.full_name} has been matched with Dr. ${selectedDoctor.full_name}. Both have been notified.`);
      setSelectedPatient(null); setSelectedDoctor(null); setMatchReason(''); setMatchNotes(''); setPriority('normal'); setShowCreateForm(false);
      fetchData();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSaving(false); }
  };

  const updateMatchStatus = async (matchId, status) => {
    try {
      await supabase.from('admin_matches').update({ status, updated_at: new Date().toISOString() }).eq('id', matchId);
      fetchData();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const filteredPatients = patients.filter(p => p.full_name?.toLowerCase().includes(patientSearch.toLowerCase()) || p.email?.toLowerCase().includes(patientSearch.toLowerCase()));
  const filteredDoctors = doctors.filter(d => d.full_name?.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialty?.toLowerCase().includes(doctorSearch.toLowerCase()));
  const getFilteredMatches = () => filterStatus === 'all' ? matches : matches.filter(m => m.status === filterStatus);
  const getPriorityColor = (p) => { switch (p) { case 'urgent': return { bg: '#FEE2E2', text: '#991B1B' }; case 'high': return { bg: '#FEF3C7', text: '#92400E' }; default: return { bg: '#D1FAE5', text: '#065F46' }; } };
  const getStatusColor = (s) => { switch (s) { case 'accepted': return { bg: '#D1FAE5', text: '#065F46' }; case 'completed': return { bg: '#DBEAFE', text: '#1E40AF' }; case 'declined': return { bg: '#FEE2E2', text: '#991B1B' }; default: return { bg: '#FEF3C7', text: '#92400E' }; } };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
        <ActivityIndicator size="large" color={COLORS.admin} />
        <Text style={{ marginTop: 12, color: COLORS.textLight }}>Loading matching data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>🔗 Patient-Doctor Matching</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>{matches.length} total matches created</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: COLORS.admin, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 }} onPress={() => setShowCreateForm(!showCreateForm)}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{showCreateForm ? '← Cancel' : '➕ New Match'}</Text>
          </TouchableOpacity>
        </View>
        {showCreateForm && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 }}>Create New Match</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>👤 Select Patient *</Text>
            {selectedPatient ? (
              <View style={{ backgroundColor: '#D1FAE5', borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, marginRight: 10 }}>🙋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#065F46' }}>{selectedPatient.full_name}</Text>
                  <Text style={{ fontSize: 13, color: '#065F46' }}>{selectedPatient.email}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedPatient(null)}><Text style={{ fontSize: 18, color: '#065F46' }}>✕</Text></TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', backgroundColor: COLORS.lightGray, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: COLORS.border }}>
                  <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                  <TextInput style={{ flex: 1, paddingVertical: 10, fontSize: 14 }} placeholder="Search patients..." value={patientSearch} onChangeText={setPatientSearch} />
                </View>
                <View style={{ maxHeight: 180, marginBottom: 16 }}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {filteredPatients.slice(0, 10).map((patient) => (
                      <TouchableOpacity key={patient.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.lightGray, borderRadius: 10, marginBottom: 6 }} onPress={() => { setSelectedPatient(patient); setPatientSearch(''); }}>
                        <Text style={{ fontSize: 20, marginRight: 10 }}>🙋</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{patient.full_name || 'No Name'}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.textLight }}>{patient.email}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>👨‍⚕️ Select Doctor *</Text>
            {selectedDoctor ? (
              <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, marginRight: 10 }}>👨‍⚕️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>Dr. {selectedDoctor.full_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>{selectedDoctor.specialty} • ⭐ {selectedDoctor.rating || 'New'}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedDoctor(null)}><Text style={{ fontSize: 18, color: COLORS.primary }}>✕</Text></TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', backgroundColor: COLORS.lightGray, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: COLORS.border }}>
                  <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
                  <TextInput style={{ flex: 1, paddingVertical: 10, fontSize: 14 }} placeholder="Search doctors by name or specialty..." value={doctorSearch} onChangeText={setDoctorSearch} />
                </View>
                <View style={{ maxHeight: 200, marginBottom: 16 }}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {filteredDoctors.slice(0, 10).map((doctor) => (
                      <TouchableOpacity key={doctor.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.lightGray, borderRadius: 10, marginBottom: 6 }} onPress={() => { setSelectedDoctor(doctor); setDoctorSearch(''); }}>
                        <Text style={{ fontSize: 20, marginRight: 10 }}>👨‍⚕️</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>Dr. {doctor.full_name}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.primary }}>{doctor.specialty}</Text>
                          <Text style={{ fontSize: 11, color: COLORS.textLight }}>${doctor.consultation_fee}/hr • ⭐ {doctor.rating || 'New'}</Text>
                        </View>
                        {doctor.telemedicine_certified && <Text style={{ fontSize: 16 }}>🏅</Text>}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>📋 Match Reason *</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {matchReasons.map((reason) => (
                <TouchableOpacity key={reason} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: matchReason === reason ? COLORS.admin : COLORS.border, backgroundColor: matchReason === reason ? COLORS.admin : COLORS.white }} onPress={() => setMatchReason(reason)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: matchReason === reason ? COLORS.white : COLORS.gray }}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>⚡ Priority</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {[{ id: 'normal', label: '✅ Normal', color: '#D1FAE5', textColor: '#065F46' }, { id: 'high', label: '⚠️ High', color: '#FEF3C7', textColor: '#92400E' }, { id: 'urgent', label: '🚨 Urgent', color: '#FEE2E2', textColor: '#991B1B' }].map((p) => (
                <TouchableOpacity key={p.id} style={{ flex: 1, borderWidth: 2, borderColor: priority === p.id ? p.textColor : COLORS.border, borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: priority === p.id ? p.color : COLORS.white }} onPress={() => setPriority(p.id)}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: priority === p.id ? p.textColor : COLORS.gray }}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Notes (Optional)</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray, minHeight: 80, textAlignVertical: 'top' }} placeholder="Additional context for this match..." value={matchNotes} onChangeText={setMatchNotes} multiline />
            </View>
            {selectedPatient && selectedDoctor && (
              <View style={{ backgroundColor: COLORS.admin, borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white, marginBottom: 12 }}>🔗 Match Preview</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 30 }}>🙋</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white, textAlign: 'center' }} numberOfLines={2}>{selectedPatient.full_name}</Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Patient</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, color: COLORS.white }}>🔗</Text>
                    {matchReason && <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 80 }}>{matchReason}</Text>}
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 30 }}>👨‍⚕️</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white, textAlign: 'center' }} numberOfLines={2}>Dr. {selectedDoctor.full_name}</Text>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{selectedDoctor.specialty}</Text>
                  </View>
                </View>
              </View>
            )}
            <TouchableOpacity style={{ backgroundColor: saving ? COLORS.gray : COLORS.admin, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={createMatch} disabled={saving}>
              {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>🔗 Create Match & Notify</Text>}
            </TouchableOpacity>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[{ label: 'Total', value: matches.length, color: COLORS.lightGray, textColor: COLORS.text }, { label: 'Pending', value: matches.filter(m => m.status === 'pending').length, color: '#FEF3C7', textColor: '#92400E' }, { label: 'Accepted', value: matches.filter(m => m.status === 'accepted').length, color: '#D1FAE5', textColor: '#065F46' }, { label: 'Done', value: matches.filter(m => m.status === 'completed').length, color: '#DBEAFE', textColor: '#1E40AF' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 12, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: stat.textColor }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['all', 'pending', 'accepted', 'completed', 'declined'].map((status) => (
              <TouchableOpacity key={status} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filterStatus === status ? COLORS.admin : COLORS.white, borderWidth: 1, borderColor: filterStatus === status ? COLORS.admin : COLORS.border }} onPress={() => setFilterStatus(status)}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: filterStatus === status ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{status === 'all' ? '👥 All' : status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {getFilteredMatches().length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 40, alignItems: 'center', elevation: 2 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔗</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>No Matches Yet</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center' }}>Create your first patient-doctor match above</Text>
          </View>
        ) : getFilteredMatches().map((match) => {
          const priorityColor = getPriorityColor(match.priority);
          const statusColor = getStatusColor(match.status);
          return (
            <View key={match.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={{ backgroundColor: priorityColor.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: priorityColor.text, textTransform: 'capitalize' }}>{match.priority}</Text>
                  </View>
                  <View style={{ backgroundColor: statusColor.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: statusColor.text, textTransform: 'capitalize' }}>{match.status}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(match.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 24 }}>🙋</Text><Text style={{ fontSize: 12, color: COLORS.text, textAlign: 'center' }} numberOfLines={1}>Patient</Text></View>
                <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 16, color: COLORS.textLight }}>🔗</Text></View>
                <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 24 }}>👨‍⚕️</Text><Text style={{ fontSize: 12, color: COLORS.text, textAlign: 'center' }} numberOfLines={1}>Doctor</Text></View>
              </View>
              {match.match_reason && (
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 8, padding: 8, marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, color: COLORS.text }}>📋 {match.match_reason}</Text>
                </View>
              )}
              {match.status === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: '#D1FAE5', borderRadius: 10, paddingVertical: 8, alignItems: 'center' }} onPress={() => updateMatchStatus(match.id, 'completed')}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065F46' }}>✅ Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 8, alignItems: 'center' }} onPress={() => updateMatchStatus(match.id, 'declined')}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#991B1B' }}>❌ Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
// ─── DOCTOR CALENDAR PICKER (PATIENT SIDE) ───────────────────────────────────
function DoctorCalendarPicker({ doctorId, onSelectSlot, selectedSlot }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState({});
  const [daySlots, setDaySlots] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDate = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  useEffect(() => { fetchAvailableDates(); }, [currentMonth, doctorId]);
  useEffect(() => { if (selectedDate) fetchDaySlots(selectedDate); }, [selectedDate]);

  const fetchAvailableDates = async () => {
    setLoadingDates(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const monthStr = `/${String(month).padStart(2, '0')}/${year}`;
      const { data } = await supabase.from('time_slots').select('date').eq('doctor_id', doctorId).eq('is_available', true).eq('is_booked', false).like('date', `%${monthStr}`);
      const dateMap = {};
      (data || []).forEach(slot => { dateMap[slot.date] = true; });
      setAvailableDates(dateMap);
    } catch (error) { console.log('Error fetching available dates:', error.message); } finally { setLoadingDates(false); }
  };

  const fetchDaySlots = async (date) => {
    setLoadingSlots(true);
    try {
      const { data } = await supabase.from('time_slots').select('*').eq('doctor_id', doctorId).eq('date', date).eq('is_available', true).eq('is_booked', false).order('start_time', { ascending: true });
      setDaySlots(data || []);
    } catch (error) { console.log('Error fetching day slots:', error.message); } finally { setLoadingSlots(false); }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = formatDate(date);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = date.toDateString() === today.toDateString();
      days.push({ date: d, dateStr, isPast, isToday, hasSlots: !!availableDates[dateStr] });
    }
    return days;
  };

  const prevMonth = () => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)); setSelectedDate(null); setDaySlots([]); };
  const nextMonth = () => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)); setSelectedDate(null); setDaySlots([]); };
  const calDays = getDaysInMonth();

  return (
    <View>
      <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={prevMonth}>
            <Text style={{ fontSize: 16, color: COLORS.text }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={nextMonth}>
            <Text style={{ fontSize: 16, color: COLORS.text }}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {daysOfWeek.map((day) => (
            <View key={day} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.textLight }}>{day}</Text>
            </View>
          ))}
        </View>
        {loadingDates ? <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} /> : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {calDays.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={{ width: '14.28%', aspectRatio: 1 }} />;
              const isSelected = selectedDate === day.dateStr;
              const canSelect = !day.isPast && day.hasSlots;
              return (
                <TouchableOpacity key={day.date} style={{ width: '14.28%', aspectRatio: 1, padding: 2 }} onPress={() => canSelect && setSelectedDate(day.dateStr)} disabled={!canSelect}>
                  <View style={{ flex: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: isSelected ? COLORS.primary : day.isToday ? COLORS.primaryLight : 'transparent', borderWidth: day.isToday && !isSelected ? 1.5 : 0, borderColor: COLORS.primary, opacity: day.isPast || !day.hasSlots ? 0.35 : 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: isSelected || day.isToday ? 'bold' : '400', color: isSelected ? COLORS.white : day.isToday ? COLORS.primary : day.hasSlots ? COLORS.text : COLORS.textLight }}>{day.date}</Text>
                    {day.hasSlots && !day.isPast && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: isSelected ? COLORS.white : COLORS.primary, marginTop: 2 }} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 10, justifyContent: 'center' }}>
          {[{ color: COLORS.primary, label: 'Available' }, { color: COLORS.primary, label: 'Selected', filled: true }].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, opacity: item.filled ? 1 : 0.4 }} />
              <Text style={{ fontSize: 10, color: COLORS.textLight }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      {selectedDate && (
        <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, elevation: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>🕐 Available Times for {selectedDate}</Text>
          {loadingSlots ? <ActivityIndicator color={COLORS.primary} /> : daySlots.length === 0 ? (
            <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center', paddingVertical: 12 }}>No available slots for this date</Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {daySlots.map((slot) => {
                const isSlotSelected = selectedSlot?.id === slot.id;
                return (
                  <TouchableOpacity key={slot.id} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderColor: isSlotSelected ? COLORS.primary : COLORS.border, backgroundColor: isSlotSelected ? COLORS.primaryLight : COLORS.white }} onPress={() => onSelectSlot({ ...slot, dateStr: selectedDate })}>
                    <Text style={{ fontSize: 13, fontWeight: isSlotSelected ? 'bold' : '500', color: isSlotSelected ? COLORS.primary : COLORS.text }}>{slot.start_time} — {slot.end_time}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── PATIENT DASHBOARD ────────────────────────────────────────────────────────
function PatientDashboard({ user, profile, onLogout }) {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');

  // Doctors state
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [specialties] = useState(['All', 'General Practitioner', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Ophthalmologist', 'Dentist', 'Gynecologist', 'Urologist', 'Oncologist', 'Endocrinologist', 'Radiologist']);

  // Booking state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [sessionType, setSessionType] = useState('video');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Pharmacy state
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [medications, setMedications] = useState([]);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [pharmacyTab, setPharmacyTab] = useState('browse');
  const [myOrders, setMyOrders] = useState([]);

  // Patient profile state
  const [patientProfile, setPatientProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [insuranceGroupNumber, setInsuranceGroupNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);

  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatDoctor, setChatDoctor] = useState(null);
  const [showConversations, setShowConversations] = useState(false);

  // Video call
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallBooking, setVideoCallBooking] = useState(null);

  // Waiting room
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [waitingRoomBooking, setWaitingRoomBooking] = useState(null);

  // Favourites
  const [favouriteDoctors, setFavouriteDoctors] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());

  // Map
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapPharmacies, setMapPharmacies] = useState([]);
  const [mapDoctors, setMapDoctors] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapFilter, setMapFilter] = useState('all');
  const [loadingMapData, setLoadingMapData] = useState(false);
  const mapRef = useRef(null);

  // Misc
  const [showRateApp, setShowRateApp] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showTermsScreen, setShowTermsScreen] = useState(false);
  const [reviewDoctor, setReviewDoctor] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Records
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [uploadingRecord, setUploadingRecord] = useState(false);
  const [recordType, setRecordType] = useState('lab_result');
  const [recordName, setRecordName] = useState('');
  const [recordNotes, setRecordNotes] = useState('');
  const [showAddRecord, setShowAddRecord] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: t('home') },
    { id: 'search', icon: '🔍', label: t('search') },
    { id: 'symptom', icon: '🩺', label: 'Check' },
    { id: 'bookings', icon: '📅', label: t('bookings') },
    { id: 'pharmacy', icon: '💊', label: t('pharmacy') },
    { id: 'health', icon: '❤️', label: 'Health' },
    { id: 'map', icon: '🗺️', label: t('map') },
    { id: 'records', icon: '📋', label: t('records') },
    { id: 'profile', icon: '👤', label: t('profile') },
  ];

  useEffect(() => {
    fetchPatientProfile();
    const notifListener = Notifications.addNotificationReceivedListener(n => console.log('Notification:', n));
    const responseListener = Notifications.addNotificationResponseReceivedListener(r => console.log('Response:', r));
    return () => { notifListener.remove(); responseListener.remove(); };
  }, []);

  useEffect(() => {
    runAfterInteractions(() => {
      if (activeTab === 'search') { fetchDoctors(); fetchFavourites(); }
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'pharmacy') { fetchPharmacies(); fetchMyOrders(); }
      if (activeTab === 'records') fetchMedicalRecords();
      if (activeTab === 'map') { getUserLocation(); fetchMapData(); }
      if (activeTab === 'home') fetchFavourites();
    });
  }, [activeTab, debouncedSearch, selectedSpecialty]);

  const fetchPatientProfile = async () => {
    try {
      const { data } = await supabase.from('patient_profiles').select('*').eq('id', user.id).single();
      if (data) {
        setPatientProfile(data);
        setBloodType(data.blood_type || '');
        setAllergies(data.allergies || []);
        setEmergencyContactName(data.emergency_contact_name || '');
        setEmergencyContactPhone(data.emergency_contact_phone || '');
        setInsuranceProvider(data.insurance_provider || '');
        setInsuranceNumber(data.insurance_number || '');
        setInsuranceType(data.insurance_type || '');
        setInsuranceExpiry(data.insurance_expiry || '');
        setInsuranceGroupNumber(data.insurance_group_number || '');
        setDateOfBirth(data.date_of_birth || '');
        setHeight(data.height || '');
        setWeight(data.weight || '');
      }
    } catch (error) { console.log('Error fetching patient profile:', error.message); }
  };

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const cacheKey = `doctors-${debouncedSearch}-${selectedSpecialty}`;
      const data = await cachedFetch(cacheKey, async () => {
        let query = supabase.from('doctors_directory').select('*').order('rating', { ascending: false }).limit(20);
        if (debouncedSearch) query = query.or(`full_name.ilike.%${debouncedSearch}%,specialty.ilike.%${debouncedSearch}%`);
        if (selectedSpecialty && selectedSpecialty !== 'All') query = query.eq('specialty', selectedSpecialty);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }, 2 * 60 * 1000);
      setDoctors(data);
    } catch (error) { console.log('Error fetching doctors:', error.message); } finally { setLoadingDoctors(false); }
  }, [debouncedSearch, selectedSpecialty]);

  const fetchFavourites = async () => {
    try {
      const { data } = await supabase.from('favourite_doctors').select('doctor_id').eq('patient_id', user.id);
      const ids = new Set((data || []).map(f => f.doctor_id));
      setFavouriteIds(ids);
      if (ids.size > 0) {
        const { data: favDoctors } = await supabase.from('doctors_directory').select('*').in('id', [...ids]);
        setFavouriteDoctors(favDoctors || []);
      } else { setFavouriteDoctors([]); }
    } catch (error) { console.log('Error fetching favourites:', error.message); }
  };

  const toggleFavourite = async (doctorId) => {
    try {
      if (favouriteIds.has(doctorId)) {
        await supabase.from('favourite_doctors').delete().eq('patient_id', user.id).eq('doctor_id', doctorId);
        setFavouriteIds(prev => { const next = new Set(prev); next.delete(doctorId); return next; });
        setFavouriteDoctors(prev => prev.filter(d => d.id !== doctorId));
      } else {
        await supabase.from('favourite_doctors').insert({ patient_id: user.id, doctor_id: doctorId });
        setFavouriteIds(prev => new Set([...prev, doctorId]));
        fetchFavourites();
      }
    } catch (error) { console.log('Error toggling favourite:', error.message); }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase.from('bookings').select('*').eq('patient_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) { console.log('Error fetching bookings:', error.message); } finally { setLoadingBookings(false); }
  };

  const fetchPharmacies = async () => {
    try {
      const { data } = await supabase.from('pharmacy_profiles').select('*, profiles!inner(full_name, email)').eq('profile_complete', true);
      setPharmacies(data || []);
    } catch (error) { console.log('Error fetching pharmacies:', error.message); }
  };

  const fetchMedications = async (pharmacyId) => {
    try {
      const { data } = await supabase.from('medications').select('*').eq('pharmacy_id', pharmacyId).eq('is_available', true);
      setMedications(data || []);
    } catch (error) { console.log('Error fetching medications:', error.message); }
  };

  const fetchMyOrders = async () => {
    try {
      const { data } = await supabase.from('delivery_orders').select('*').eq('patient_id', user.id).order('created_at', { ascending: false });
      setMyOrders(data || []);
    } catch (error) { console.log('Error fetching orders:', error.message); }
  };

  const fetchMedicalRecords = async () => {
    setLoadingRecords(true);
    try {
      const { data } = await supabase.from('medical_records').select('*').eq('patient_id', user.id).order('created_at', { ascending: false });
      setMedicalRecords(data || []);
    } catch (error) { console.log('Error fetching records:', error.message); } finally { setLoadingRecords(false); }
  };

  const getUserLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocationError('Location permission denied. Please enable location access in settings.'); return; }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    } catch (error) { setLocationError('Could not get your location. Please try again.'); } finally { setLoadingLocation(false); }
  };

  const fetchMapData = async () => {
    setLoadingMapData(true);
    try {
      const [pharmacyData, doctorData] = await Promise.all([
        supabase.from('pharmacy_profiles').select('*, profiles!inner(full_name, email)').eq('profile_complete', true),
        supabase.from('doctors_directory').select('*').eq('available_for_physical', true),
      ]);
      setMapPharmacies(pharmacyData.data || []);
      setMapDoctors(doctorData.data || []);
    } catch (error) { console.log('Error fetching map data:', error.message); } finally { setLoadingMapData(false); }
  };

  const savePatientProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('patient_profiles').upsert({
        id: user.id,
        blood_type: bloodType,
        allergies,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        insurance_provider: insuranceProvider,
        insurance_number: insuranceNumber,
        insurance_type: insuranceType,
        insurance_expiry: insuranceExpiry,
        insurance_group_number: insuranceGroupNumber,
        date_of_birth: dateOfBirth,
        height,
        weight,
        profile_complete: true,
      });
      if (error) throw error;
      Alert.alert('Profile Updated! ✅', 'Your health profile has been saved.');
      setEditingProfile(false);
      fetchPatientProfile();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingProfile(false); }
  };

  const createBooking = async () => {
    if (!reason) { Alert.alert('Missing Info', 'Please describe the reason for your appointment'); return; }
    if (!preferredDate && !selectedSlot) { Alert.alert('Missing Info', 'Please select a date and time'); return; }
    setBookingLoading(true);
    try {
      const bookingDate = selectedSlot ? selectedSlot.dateStr : preferredDate;
      const bookingTime = selectedSlot ? selectedSlot.start_time : preferredTime;
      const fee = sessionType === 'video' ? (selectedDoctor.video_consultation_fee || selectedDoctor.consultation_fee) : (selectedDoctor.physical_consultation_fee || selectedDoctor.consultation_fee);
      const totalAmount = fee * durationHours;
      const { error } = await supabase.from('bookings').insert({
        patient_id: user.id,
        doctor_id: selectedDoctor.id,
        patient_name: patientName || profile?.full_name,
        patient_age: parseInt(patientAge) || null,
        doctor_name: selectedDoctor.full_name,
        session_type: sessionType,
        preferred_date: bookingDate,
        preferred_time: bookingTime,
        duration_hours: durationHours,
        reason,
        amount: totalAmount,
        status: 'pending',
        payment_status: 'unpaid',
      });
      if (error) throw error;
      if (selectedSlot?.id) {
        await supabase.from('time_slots').update({ is_booked: true }).eq('id', selectedSlot.id);
      }
      await supabase.from('notifications').insert({
        user_id: selectedDoctor.id,
        title: '📅 New Appointment Request',
        message: `${patientName || profile?.full_name} has requested a ${sessionType} consultation on ${bookingDate} at ${bookingTime}`,
        type: 'booking',
      });
      Alert.alert('Booking Sent! ✅', 'Your appointment request has been sent to the doctor. You will be notified once confirmed.', [{ text: 'OK', onPress: () => { setShowBookingForm(false); setSelectedDoctor(null); setBookingStep(1); setReason(''); setSelectedSlot(null); setPreferredDate(''); setPreferredTime(''); fetchBookings(); } }]);
    } catch (error) { Alert.alert('Error', error.message); } finally { setBookingLoading(false); }
  };

  const placeOrder = async () => {
    if (cart.length === 0) { Alert.alert('Empty Cart', 'Please add items to your cart'); return; }
    if (!deliveryAddress) { Alert.alert('Missing Info', 'Please enter your delivery address'); return; }
    setPlacingOrder(true);
    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const { error } = await supabase.from('delivery_orders').insert({
        patient_id: user.id,
        pharmacy_id: selectedPharmacy.id,
        items: cart,
        total_amount: total,
        delivery_address: deliveryAddress,
        delivery_notes: deliveryNotes,
        status: 'pending',
      });
      if (error) throw error;
      await supabase.from('notifications').insert({
        user_id: selectedPharmacy.id,
        title: '🛒 New Order Received',
        message: `New delivery order received. Total: $${total.toFixed(2)}`,
        type: 'general',
      });
      Alert.alert('Order Placed! ✅', 'Your order has been sent to the pharmacy.', [{ text: 'OK', onPress: () => { setCart([]); setDeliveryAddress(''); setDeliveryNotes(''); setSelectedPharmacy(null); setPharmacyTab('orders'); fetchMyOrders(); } }]);
    } catch (error) { Alert.alert('Error', error.message); } finally { setPlacingOrder(false); }
  };

  const submitReview = async () => {
    if (!reviewDoctor) return;
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert({ doctor_id: reviewDoctor.doctor_id, patient_id: user.id, booking_id: reviewDoctor.id, rating: reviewRating, comment: reviewComment });
      if (error) throw error;
      Alert.alert('Review Submitted! ⭐', 'Thank you for your feedback!');
      setReviewDoctor(null); setReviewRating(5); setReviewComment('');
      fetchBookings();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSubmittingReview(false); }
  };

  const addMedicalRecord = async () => {
    if (!recordName) { Alert.alert('Missing Info', 'Please enter a record name'); return; }
    setUploadingRecord(true);
    try {
      const { error } = await supabase.from('medical_records').insert({ patient_id: user.id, record_type: recordType, record_name: recordName, notes: recordNotes, file_url: null });
      if (error) throw error;
      Alert.alert('Record Added! ✅', 'Medical record saved successfully.');
      setRecordName(''); setRecordNotes(''); setShowAddRecord(false);
      fetchMedicalRecords();
    } catch (error) { Alert.alert('Error', error.message); } finally { setUploadingRecord(false); }
  };

  const addToCart = (medication) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medication.id);
      if (existing) return prev.map(item => item.id === medication.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...medication, quantity: 1 }];
    });
  };

  const removeFromCart = (medicationId) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === medicationId);
      if (existing?.quantity === 1) return prev.filter(item => item.id !== medicationId);
      return prev.map(item => item.id === medicationId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── SPECIAL SCREENS ──────────────────────────────────────────────────────────
  if (showNotifications) return <NotificationsScreen userId={user.id} onBack={() => setShowNotifications(false)} />;
  if (showChat && chatDoctor) return <ChatScreen currentUserId={user.id} otherUserId={chatDoctor.id} otherUserName={chatDoctor.name} otherUserRole="doctor" bookingId={chatDoctor.bookingId} onBack={() => { setShowChat(false); setChatDoctor(null); }} accentColor={COLORS.primary} />;
  if (showConversations) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <TouchableOpacity onPress={() => setShowConversations(false)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Messages 💬</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Chat with your doctors</Text>
        </View>
        <ConversationsList currentUserId={user.id} currentUserRole="patient" onSelectConversation={(conv, otherId, otherName) => { setChatDoctor({ id: otherId, name: otherName, bookingId: conv.booking_id }); setShowConversations(false); setShowChat(true); }} accentColor={COLORS.primary} />
      </View>
    );
  }
  if (showVideoCall && videoCallBooking) {
    return (
      <VideoCallScreen booking={videoCallBooking} userId={user.id} userRole="patient" onCallEnd={() => { setShowVideoCall(false); setVideoCallBooking(null); Alert.alert('Call Ended 📹', 'Your video consultation has ended. Please rate your experience.', [{ text: 'Rate Session', onPress: () => setShowRateApp(true) }, { text: 'Later', style: 'cancel' }]); }} />
    );
  }
  if (showWaitingRoom && waitingRoomBooking) {
    return (
      <WaitingRoom booking={waitingRoomBooking} userId={user.id} userRole="patient" patientProfile={patientProfile} onClose={() => { setShowWaitingRoom(false); setWaitingRoomBooking(null); }} onSessionStart={() => Alert.alert('Session Starting! 🎉', 'Your video session is now beginning. Please join the call.')} />
    );
  }

  // ── RENDER HOME ───────────────────────────────────────────────────────────────
  const renderHome = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{t('goodDay')}</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name || 'Patient'}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{t('howCanWeHelp')}</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>
      <BroadcastBanner userRole="patient" />
      <View style={{ padding: 24 }}>
        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ icon: '👨‍⚕️', label: t('findDoctor'), tab: 'search' }, { icon: '🩺', label: 'Symptom Check', tab: 'symptom' }, { icon: '📅', label: t('myBookings'), tab: 'bookings' }, { icon: '💬', label: t('messages'), tab: 'messages' }].map((item) => (
            <TouchableOpacity key={item.tab} style={{ width: '47%', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 }} onPress={() => item.tab === 'messages' ? setShowConversations(true) : setActiveTab(item.tab)}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Favourites */}
        {favouriteDoctors.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>❤️ Your Favourites</Text>
              <TouchableOpacity onPress={() => setActiveTab('search')}><Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>See All ›</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {favouriteDoctors.slice(0, 5).map((doctor) => (
                  <TouchableOpacity key={doctor.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, width: 130, alignItems: 'center', elevation: 2 }} onPress={() => { setActiveTab('search'); setSelectedDoctor(doctor); }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 22 }}>👨‍⚕️</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' }} numberOfLines={2}>Dr. {doctor.full_name}</Text>
                    <Text style={{ fontSize: 10, color: COLORS.primary, marginTop: 2, textAlign: 'center' }} numberOfLines={1}>{doctor.specialty}</Text>
                    <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginTop: 8 }} onPress={() => { setActiveTab('search'); setSelectedDoctor(doctor); setShowBookingForm(true); setBookingStep(1); }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.white }}>Book Again</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        {/* Pharmacy banner */}
        <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 20, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center' }} onPress={() => setActiveTab('pharmacy')}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>{t('medicationsDelivered')}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{t('getMemsDelivered')}</Text>
            <View style={{ backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{t('orderNow')}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 50 }}>💊</Text>
        </TouchableOpacity>
        {/* How it works */}
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>{t('howItWorks')}</Text>
        {[{ step: '1', title: 'Find a Doctor', desc: 'Browse and choose from verified specialists', icon: '🔍' }, { step: '2', title: 'Book Appointment', desc: 'Select date, time and session type', icon: '📅' }, { step: '3', title: 'Consult & Heal', desc: 'Video or physical consultation with your doctor', icon: '💊' }].map((item) => (
          <View key={item.step} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>{item.desc}</Text>
            </View>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{item.step}</Text>
            </View>
          </View>
        ))}
        {/* Emergency SOS */}
        <View style={{ marginTop: 8 }}>
          <EmergencySOSButton userId={user.id} patientProfile={patientProfile} patientName={profile?.full_name} />
        </View>
      </View>
    </ScrollView>
  );

  // ── RENDER SEARCH ─────────────────────────────────────────────────────────────
  const renderSearch = () => {
    if (selectedDoctor && !showBookingForm) return renderDoctorDetail();
    if (showBookingForm && selectedDoctor) return renderBookingForm();
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white }}>{t('findADoctor')}</Text>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.text }} placeholder={t('searchPlaceholder')} placeholderTextColor={COLORS.textLight} value={searchQuery} onChangeText={setSearchQuery} />
            {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={{ fontSize: 18, color: COLORS.textLight }}>✕</Text></TouchableOpacity>}
          </View>
        </View>
        {/* Favourites */}
        {favouriteDoctors.length > 0 && !searchQuery && selectedSpecialty === 'All' && (
          <View style={{ backgroundColor: COLORS.white, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: 16, marginBottom: 10 }}>❤️ Favourite Doctors</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {favouriteDoctors.map((doctor) => (
                <TouchableOpacity key={doctor.id} style={{ backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 14, width: 140, alignItems: 'center' }} onPress={() => setSelectedDoctor(doctor)}>
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 26 }}>👨‍⚕️</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' }} numberOfLines={2}>Dr. {doctor.full_name}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.primary, marginTop: 2, textAlign: 'center' }} numberOfLines={1}>{doctor.specialty}</Text>
                  <TouchableOpacity style={{ marginTop: 8 }} onPress={() => toggleFavourite(doctor.id)}>
                    <Text style={{ fontSize: 18 }}>❤️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Specialty filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: COLORS.white, paddingVertical: 8, maxHeight: 50 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {specialties.map((spec) => (
            <TouchableOpacity key={spec} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: selectedSpecialty === spec ? COLORS.primary : COLORS.lightGray }} onPress={() => setSelectedSpecialty(spec)}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: selectedSpecialty === spec ? COLORS.white : COLORS.gray }}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {loadingDoctors ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            {[1, 2, 3, 4].map((i) => <DoctorCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={doctors}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{t('noResults')}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>Try a different search term</Text>
              </View>
            )}
            renderItem={({ item: doctor }) => (
              <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }} onPress={() => setSelectedDoctor(doctor)}>
                <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }} onPress={() => toggleFavourite(doctor.id)}>
                  <Text style={{ fontSize: 22 }}>{favouriteIds.has(doctor.id) ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
                  </View>
                  <View style={{ flex: 1, paddingRight: 30 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Dr. {doctor.full_name}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.primary, marginTop: 2 }}>{doctor.specialty}</Text>
                    {doctor.telemedicine_certified && <View style={{ marginTop: 4 }}><TelemedicineBadge level={doctor.telemedicine_badge_level} certified={doctor.telemedicine_certified} size="small" /></View>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>⭐ {doctor.rating || 'New'}</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>•</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>{doctor.experience_years} yrs exp</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>•</Text>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.secondary }}>${doctor.consultation_fee}/hr</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      {doctor.available_for_video && <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, color: COLORS.primary }}>📹 Video</Text></View>}
                      {doctor.available_for_physical && <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, color: '#92400E' }}>🏥 Physical</Text></View>}
                      {doctor.free_first_consultation && <View style={{ backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, color: '#065F46' }}>🎁 Free 1st</Text></View>}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  // ── RENDER DOCTOR DETAIL ──────────────────────────────────────────────────────
  const renderDoctorDetail = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => setSelectedDoctor(null)}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => toggleFavourite(selectedDoctor.id)}>
            <Text style={{ fontSize: 18 }}>{favouriteIds.has(selectedDoctor.id) ? '❤️' : '🤍'}</Text>
            <Text style={{ fontSize: 13, color: COLORS.white, fontWeight: '600' }}>{favouriteIds.has(selectedDoctor.id) ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 44 }}>👨‍⚕️</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Dr. {selectedDoctor.full_name}</Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{selectedDoctor.specialty}</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{selectedDoctor.qualification}</Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[{ icon: '⏳', label: 'Experience', value: `${selectedDoctor.experience_years} yrs` }, { icon: '👥', label: 'Patients', value: selectedDoctor.total_patients_helped || '0' }, { icon: '⭐', label: 'Rating', value: selectedDoctor.rating || 'New' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2 }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {/* Telemedicine badge */}
        {selectedDoctor.telemedicine_certified && (
          <View style={{ marginBottom: 16 }}>
            <TelemedicineBadge level={selectedDoctor.telemedicine_badge_level} certified={selectedDoctor.telemedicine_certified} totalSessions={selectedDoctor.total_video_sessions} />
          </View>
        )}
        {/* Bio */}
        {selectedDoctor.bio && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>About</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22 }}>{selectedDoctor.bio}</Text>
          </View>
        )}
        {/* Fees */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💰 Consultation Fees</Text>
          {selectedDoctor.available_for_video && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <Text style={{ fontSize: 14, color: COLORS.text }}>📹 Video Consultation</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary }}>${selectedDoctor.video_consultation_fee || selectedDoctor.consultation_fee}/hr</Text>
            </View>
          )}
          {selectedDoctor.available_for_physical && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, color: COLORS.text }}>🏥 Physical Visit</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary }}>${selectedDoctor.physical_consultation_fee || selectedDoctor.consultation_fee}/hr</Text>
            </View>
          )}
          {selectedDoctor.free_first_consultation && (
            <View style={{ backgroundColor: '#D1FAE5', borderRadius: 10, padding: 10, marginTop: 8 }}>
              <Text style={{ fontSize: 13, color: '#065F46', fontWeight: '600' }}>🎁 First consultation is FREE!</Text>
            </View>
          )}
        </View>
        {/* Clinic location */}
        {selectedDoctor.available_for_physical && selectedDoctor.clinic_name && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🏥 Clinic Location</Text>
            {[{ icon: '🏥', label: 'Clinic Name', value: selectedDoctor.clinic_name }, { icon: '📍', label: 'Address', value: selectedDoctor.clinic_address || 'Not specified' }, { icon: '🌆', label: 'City', value: selectedDoctor.clinic_city || 'Not specified' }, { icon: '🌍', label: 'Country', value: selectedDoctor.clinic_country || 'Not specified' }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                <View>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
                </View>
              </View>
            ))}
            {selectedDoctor.directions_notes && (
              <View style={{ backgroundColor: '#FEF3C7', borderRadius: 12, padding: 14, marginTop: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#92400E', marginBottom: 6 }}>🗺️ How to Find Us</Text>
                <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>{selectedDoctor.directions_notes}</Text>
              </View>
            )}
          </View>
        )}
        {/* Action buttons */}
        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }} onPress={() => { setPatientName(profile?.full_name || ''); setShowBookingForm(true); setBookingStep(1); }} activeOpacity={0.9}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.white }}>📅 {t('bookAppointment')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => { setChatDoctor({ id: selectedDoctor.id, name: selectedDoctor.full_name, bookingId: null }); setSelectedDoctor(null); setShowChat(true); }}>
          <Text style={{ fontSize: 18 }}>💬</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{t('messageDoctor')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── RENDER BOOKING FORM ───────────────────────────────────────────────────────
  const renderBookingForm = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <TouchableOpacity onPress={() => { bookingStep === 1 ? (setShowBookingForm(false), setSelectedDoctor(null)) : setBookingStep(bookingStep - 1); }} style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>📅 Book Appointment</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Dr. {selectedDoctor?.full_name}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: bookingStep >= step ? COLORS.white : 'rgba(255,255,255,0.3)' }} />
          ))}
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {bookingStep === 1 && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 }}>Step 1: Session Type & Patient</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 }}>Session Type *</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {[{ id: 'video', icon: '📹', label: t('videoCall'), available: selectedDoctor?.available_for_video, fee: selectedDoctor?.video_consultation_fee || selectedDoctor?.consultation_fee }, { id: 'physical', icon: '🏥', label: t('physicalVisit'), available: selectedDoctor?.available_for_physical, fee: selectedDoctor?.physical_consultation_fee || selectedDoctor?.consultation_fee }].filter(t => t.available).map((type) => (
                <TouchableOpacity key={type.id} style={{ flex: 1, borderWidth: 2, borderColor: sessionType === type.id ? COLORS.primary : COLORS.border, borderRadius: 14, padding: 16, alignItems: 'center', backgroundColor: sessionType === type.id ? COLORS.primaryLight : COLORS.white }} onPress={() => setSessionType(type.id)}>
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{type.icon}</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: sessionType === type.id ? COLORS.primary : COLORS.text }}>{type.label}</Text>
                  <Text style={{ fontSize: 12, color: sessionType === type.id ? COLORS.primary : COLORS.textLight, marginTop: 4 }}>${type.fee}/hr</Text>
                </TouchableOpacity>
              ))}
            </View>
            {[{ label: 'Your Name *', value: patientName, setter: setPatientName, placeholder: 'Full name' }, { label: 'Your Age', value: patientAge, setter: setPatientAge, placeholder: 'Age', keyboard: 'numeric' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
              </View>
            ))}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Duration (hours)</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[1, 1.5, 2].map((d) => (
                  <TouchableOpacity key={d} style={{ flex: 1, borderWidth: 2, borderColor: durationHours === d ? COLORS.primary : COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: durationHours === d ? COLORS.primaryLight : COLORS.white }} onPress={() => setDurationHours(d)}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: durationHours === d ? COLORS.primary : COLORS.gray }}>{d}h</Text>
                    <Text style={{ fontSize: 11, color: durationHours === d ? COLORS.primary : COLORS.textLight }}>${((sessionType === 'video' ? selectedDoctor?.video_consultation_fee : selectedDoctor?.physical_consultation_fee) || selectedDoctor?.consultation_fee) * d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => setBookingStep(2)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{t('next')}: Select Date & Time →</Text>
            </TouchableOpacity>
          </View>
        )}
        {bookingStep === 2 && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 }}>Step 2: Date & Time</Text>
            <DoctorCalendarPicker doctorId={selectedDoctor?.id} onSelectSlot={(slot) => { setSelectedSlot(slot); setPreferredDate(slot.dateStr); setPreferredTime(slot.start_time); }} selectedSlot={selectedSlot} />
            {!selectedSlot && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Or enter date manually:</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, marginBottom: 12 }} placeholder="DD/MM/YYYY" value={preferredDate} onChangeText={setPreferredDate} />
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white }} placeholder="HH:MM (e.g. 09:00)" value={preferredTime} onChangeText={setPreferredTime} />
              </View>
            )}
            <TouchableOpacity style={{ backgroundColor: (selectedSlot || (preferredDate && preferredTime)) ? COLORS.primary : COLORS.gray, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 20 }} onPress={() => (selectedSlot || (preferredDate && preferredTime)) && setBookingStep(3)} disabled={!selectedSlot && !(preferredDate && preferredTime)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>{t('next')}: Add Reason →</Text>
            </TouchableOpacity>
          </View>
        )}
        {bookingStep === 3 && (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 }}>Step 3: Reason & Confirm</Text>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Reason for Appointment *</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 100, textAlignVertical: 'top' }} placeholder="Describe your symptoms or reason for the appointment..." value={reason} onChangeText={setReason} multiline />
            </View>
            {/* Summary */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📋 Booking Summary</Text>
              {[
                { label: 'Doctor', value: `Dr. ${selectedDoctor?.full_name}` },
                { label: 'Patient', value: patientName },
                { label: 'Session Type', value: sessionType === 'video' ? '📹 Video Call' : '🏥 Physical Visit' },
                { label: 'Date', value: preferredDate },
                { label: 'Time', value: selectedSlot ? selectedSlot.start_time : preferredTime },
                { label: 'Duration', value: `${durationHours} hour${durationHours !== 1 ? 's' : ''}` },
                ...(sessionType === 'physical' && selectedDoctor?.clinic_address ? [{ label: 'Clinic Address', value: selectedDoctor.clinic_address }] : []),
                ...(patientProfile?.insurance_provider ? [{ label: 'Insurance', value: `${patientProfile.insurance_provider} — ${patientProfile.insurance_number || 'N/A'}` }] : []),
                { label: 'Total Amount', value: `$${(((sessionType === 'video' ? selectedDoctor?.video_consultation_fee : selectedDoctor?.physical_consultation_fee) || selectedDoctor?.consultation_fee) * durationHours).toFixed(2)}` },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={{ backgroundColor: bookingLoading ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }} onPress={createBooking} disabled={bookingLoading} activeOpacity={0.9}>
              {bookingLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.white }}>Confirm & Send Request ✅</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // ── RENDER BOOKINGS ───────────────────────────────────────────────────────────
  const renderPatientBookings = () => {
    if (selectedBooking) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => setSelectedBooking(null)} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Bookings</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Appointment Details</Text>
          </View>
          <View style={{ padding: 24 }}>
            {/* Basic info */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 28 }}>{selectedBooking.session_type === 'video' ? '📹' : '🏥'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>Dr. {selectedBooking.doctor_name}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.textLight }}>{selectedBooking.session_type === 'video' ? 'Video Consultation' : 'Physical Visit'}</Text>
                </View>
                <View style={{ backgroundColor: selectedBooking.status === 'completed' ? '#D1FAE5' : selectedBooking.status === 'confirmed' ? '#DBEAFE' : selectedBooking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedBooking.status === 'completed' ? '#065F46' : selectedBooking.status === 'confirmed' ? '#1E40AF' : selectedBooking.status === 'cancelled' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{selectedBooking.status}</Text>
                </View>
              </View>
              {[{ label: 'Date', value: selectedBooking.preferred_date }, { label: 'Time', value: selectedBooking.preferred_time }, { label: 'Duration', value: `${selectedBooking.duration_hours} hour${selectedBooking.duration_hours !== 1 ? 's' : ''}` }, { label: 'Patient', value: selectedBooking.patient_name }, { label: 'Reason', value: selectedBooking.reason }, { label: 'Amount', value: `$${selectedBooking.amount}` }, { label: 'Payment', value: selectedBooking.payment_status || 'unpaid' }].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right', textTransform: 'capitalize' }}>{item.value}</Text>
                </View>
              ))}
            </View>
            {/* Reminders */}
            {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'completed') && (
              <AppointmentReminders bookingId={selectedBooking.id} />
            )}
            {/* Actions */}
            {selectedBooking.status === 'confirmed' && selectedBooking.session_type === 'video' && (
              <>
                <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 12 }} onPress={() => { setWaitingRoomBooking(selectedBooking); setSelectedBooking(null); setShowWaitingRoom(true); }}>
                  <Text style={{ fontSize: 22 }}>📹</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Join Waiting Room</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 12 }} onPress={() => { setVideoCallBooking(selectedBooking); setSelectedBooking(null); setShowVideoCall(true); }}>
                  <Text style={{ fontSize: 22 }}>📹</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Start Video Call</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedBooking.status === 'completed' && !selectedBooking.has_review && (
              <TouchableOpacity style={{ backgroundColor: '#FEF3C7', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setReviewDoctor(selectedBooking)}>
                <Text style={{ fontSize: 18 }}>⭐</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#92400E' }}>Leave a Review</Text>
              </TouchableOpacity>
            )}
            {selectedBooking.status === 'completed' && (
              <TouchableOpacity style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setShowRateApp(true)}>
                <Text style={{ fontSize: 18 }}>⭐</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>Rate ReineCare</Text>
              </TouchableOpacity>
            )}
            {selectedBooking.status === 'pending' && (
              <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={async () => {
                Alert.alert('Cancel Booking', 'Are you sure you want to cancel this appointment?', [
                  { text: 'Keep Appointment', style: 'cancel' },
                  { text: 'Cancel Appointment', style: 'destructive', onPress: async () => {
                    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', selectedBooking.id);
                    setSelectedBooking(null); fetchBookings();
                  }}
                ]);
              }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#991B1B' }}>Cancel Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      );
    }

    // Review form
    if (reviewDoctor) {
      return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => setReviewDoctor(null)} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>⭐ Leave a Review</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Dr. {reviewDoctor.doctor_name}</Text>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 16 }}>How was your experience?</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setReviewRating(star)} style={{ padding: 4 }}>
                    <Text style={{ fontSize: 40 }}>{star <= reviewRating ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Your Comment (Optional)</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.white, minHeight: 100, textAlignVertical: 'top' }} placeholder="Tell others about your experience with this doctor..." value={reviewComment} onChangeText={setReviewComment} multiline />
            </View>
            <TouchableOpacity style={{ backgroundColor: submittingReview ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={submitReview} disabled={submittingReview}>
              {submittingReview ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Submit Review ⭐</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📅 {t('myBookings')}</Text>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((filter) => (
                <TouchableOpacity key={filter} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: bookingFilter === filter ? COLORS.white : 'rgba(255,255,255,0.2)' }} onPress={() => setBookingFilter(filter)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: bookingFilter === filter ? COLORS.primary : COLORS.white, textTransform: 'capitalize' }}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {loadingBookings ? (
          <View style={{ padding: 16 }}>
            {[1, 2, 3].map((i) => <BookingCardSkeleton key={i} />)}
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews={true}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>No Bookings Yet</Text>
                <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 6, textAlign: 'center' }}>Book your first appointment to get started</Text>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24, marginTop: 16 }} onPress={() => setActiveTab('search')}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Find a Doctor</Text>
                </TouchableOpacity>
              </View>
            )}
            renderItem={({ item: booking }) => (
              <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }} onPress={() => setSelectedBooking(booking)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <Text style={{ fontSize: 24 }}>{booking.session_type === 'video' ? '📹' : '🏥'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>Dr. {booking.doctor_name}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.textLight }}>{booking.preferred_date} at {booking.preferred_time}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.primary, marginTop: 2 }}>{booking.session_type === 'video' ? '📹 Video Call' : '🏥 Physical Visit'}</Text>
                  </View>
                  <View style={{ backgroundColor: booking.status === 'completed' ? '#D1FAE5' : booking.status === 'confirmed' ? '#DBEAFE' : booking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: booking.status === 'completed' ? '#065F46' : booking.status === 'confirmed' ? '#1E40AF' : booking.status === 'cancelled' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{booking.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  // ── RENDER PHARMACY ───────────────────────────────────────────────────────────
  const renderPharmacy = () => {
    if (selectedPharmacy) {
      return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => { setSelectedPharmacy(null); setMedications([]); setCart([]); }} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Pharmacies</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{selectedPharmacy.pharmacy_name || selectedPharmacy.profiles?.full_name}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{selectedPharmacy.address || 'Pharmacy'}</Text>
            {cartCount > 0 && (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.accent }}>🛒 {cartCount} items — ${cartTotal.toFixed(2)}</Text>
                <TouchableOpacity style={{ backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 }} onPress={() => setPharmacyTab('checkout')}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>Checkout →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            {pharmacyTab === 'checkout' ? (
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>🛒 Your Order</Text>
                {cart.map((item) => (
                  <View key={item.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>${item.price} each</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={() => removeFromCart(item.id)}>
                        <Text style={{ fontSize: 18, color: COLORS.text }}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{item.quantity}</Text>
                      <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }} onPress={() => addToCart(item)}>
                        <Text style={{ fontSize: 18, color: COLORS.white }}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary, marginLeft: 10 }}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📍 Delivery Details</Text>
                  {[{ label: 'Delivery Address *', value: deliveryAddress, setter: setDeliveryAddress, placeholder: 'Enter your full delivery address', multiline: false }, { label: 'Delivery Notes', value: deliveryNotes, setter: setDeliveryNotes, placeholder: 'Any special instructions...', multiline: true }].map((field) => (
                    <View key={field.label} style={{ marginBottom: 14 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                      <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray, minHeight: field.multiline ? 60 : undefined, textAlignVertical: field.multiline ? 'top' : undefined }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} multiline={field.multiline} />
                    </View>
                  ))}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 2, borderTopColor: COLORS.border }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total:</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.accent }}>${cartTotal.toFixed(2)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ backgroundColor: placingOrder ? COLORS.gray : COLORS.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={placeOrder} disabled={placingOrder}>
                  {placingOrder ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Place Order 🛒</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: 12, alignItems: 'center', marginTop: 8 }} onPress={() => setPharmacyTab('browse')}>
                  <Text style={{ fontSize: 14, color: COLORS.textLight }}>← Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>💊 Available Medications</Text>
                {medications.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <Text style={{ fontSize: 40, marginBottom: 12 }}>💊</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>No medications available</Text>
                  </View>
                ) : medications.map((med) => {
                  const inCart = cart.find(item => item.id === med.id);
                  return (
                    <View key={med.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                          <Text style={{ fontSize: 22 }}>💊</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{med.name}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.textLight }}>{med.category} {med.requires_prescription ? '• 📋 Prescription Required' : ''}</Text>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.accent, marginTop: 2 }}>${med.price}</Text>
                        </View>
                        {inCart ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }} onPress={() => removeFromCart(med.id)}>
                              <Text style={{ fontSize: 18 }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{inCart.quantity}</Text>
                            <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' }} onPress={() => addToCart(med)}>
                              <Text style={{ fontSize: 18, color: COLORS.white }}>+</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity style={{ backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }} onPress={() => addToCart(med)}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>Add</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💊 Pharmacy</Text>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
          </View>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Order medications & get them delivered</Text>
          <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4, marginTop: 14 }}>
            {[{ id: 'browse', label: '🏪 Browse' }, { id: 'orders', label: '📦 My Orders' }].map((tab) => (
              <TouchableOpacity key={tab.id} style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: pharmacyTab === tab.id ? COLORS.white : 'transparent' }} onPress={() => setPharmacyTab(tab.id)}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: pharmacyTab === tab.id ? COLORS.accent : COLORS.white }}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {pharmacyTab === 'orders' ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>📦 My Orders</Text>
            {myOrders.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>No Orders Yet</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>Your medication orders will appear here</Text>
              </View>
            ) : myOrders.map((order) => (
              <View key={order.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>${order.total_amount?.toFixed(2)}</Text>
                  <View style={{ backgroundColor: order.status === 'delivered' ? '#D1FAE5' : order.status === 'preparing' ? '#DBEAFE' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: order.status === 'delivered' ? '#065F46' : order.status === 'preparing' ? '#1E40AF' : '#92400E', textTransform: 'capitalize' }}>{order.status}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>📍 {order.delivery_address}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{new Date(order.created_at).toLocaleDateString()}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 }}>🏪 Available Pharmacies</Text>
            {pharmacies.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🏪</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>No Pharmacies Yet</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>Pharmacies will appear here once verified</Text>
              </View>
            ) : pharmacies.map((pharmacy) => (
              <TouchableOpacity key={pharmacy.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }} onPress={() => { setSelectedPharmacy(pharmacy); fetchMedications(pharmacy.id); setPharmacyTab('browse'); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <Text style={{ fontSize: 26 }}>🏪</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{pharmacy.pharmacy_name || pharmacy.profiles?.full_name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>{pharmacy.address || 'Pharmacy'}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      {pharmacy.delivery_available && <View style={{ backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, color: '#065F46' }}>🚀 Delivery</Text></View>}
                      <Text style={{ fontSize: 11, color: COLORS.textLight }}>{pharmacy.opening_time} - {pharmacy.closing_time}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 20, color: COLORS.textLight }}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // ── RENDER MAP ────────────────────────────────────────────────────────────────
  const renderMap = () => {
    const MapView = (() => { try { return require('react-native-maps').default; } catch { return null; } })();
    const MapModules = (() => { try { return require('react-native-maps'); } catch { return null; } })();
    if (!MapView) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>🗺️</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>Map Not Available</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>Please run: npx expo install react-native-maps</Text>
        </View>
      );
    }
    const { Marker, Circle } = MapModules;
    const defaultRegion = { latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.1, longitudeDelta: 0.1 };
    const region = userLocation || defaultRegion;
    const getRandomOffset = () => (Math.random() - 0.5) * 0.01;
    const getFilteredMarkers = () => {
      let markers = [];
      if (mapFilter === 'all' || mapFilter === 'pharmacy') {
        mapPharmacies.forEach((pharmacy) => {
          markers.push({ id: `pharmacy-${pharmacy.id}`, type: 'pharmacy', title: pharmacy.pharmacy_name || pharmacy.profiles?.full_name, subtitle: pharmacy.address || 'Pharmacy', latitude: region.latitude + getRandomOffset(), longitude: region.longitude + getRandomOffset(), data: pharmacy });
        });
      }
      if (mapFilter === 'all' || mapFilter === 'doctor') {
        mapDoctors.forEach((doctor) => {
          markers.push({ id: `doctor-${doctor.id}`, type: 'doctor', title: doctor.full_name, subtitle: doctor.specialty || 'Doctor', latitude: region.latitude + getRandomOffset(), longitude: region.longitude + getRandomOffset(), data: doctor });
        });
      }
      return markers;
    };
    const markers = getFilteredMarkers();
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>🗺️ Find Nearby</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Doctors and pharmacies near you</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            {[{ id: 'all', label: '👥 All' }, { id: 'doctor', label: '👨‍⚕️ Doctors' }, { id: 'pharmacy', label: '💊 Pharmacies' }].map((filter) => (
              <TouchableOpacity key={filter.id} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: mapFilter === filter.id ? COLORS.white : 'rgba(255,255,255,0.2)' }} onPress={() => { setMapFilter(filter.id); setSelectedMarker(null); }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: mapFilter === filter.id ? COLORS.primary : COLORS.white }}>{filter.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {loadingLocation && (
          <View style={{ backgroundColor: '#FEF3C7', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 12, borderRadius: 12 }}>
            <ActivityIndicator size="small" color="#92400E" />
            <Text style={{ fontSize: 13, color: '#92400E' }}>Getting your location...</Text>
          </View>
        )}
        {locationError && !loadingLocation && (
          <View style={{ backgroundColor: '#FEE2E2', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 12, borderRadius: 12 }}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
            <Text style={{ fontSize: 13, color: '#991B1B', flex: 1 }}>{locationError}</Text>
            <TouchableOpacity onPress={getUserLocation}><Text style={{ fontSize: 13, color: '#991B1B', fontWeight: '600' }}>Retry</Text></TouchableOpacity>
          </View>
        )}
        <View style={{ flex: 1, marginTop: 8 }}>
          <MapView ref={mapRef} style={{ flex: 1 }} region={region} showsUserLocation={!!userLocation} showsMyLocationButton={true} showsCompass={true} onPress={() => setSelectedMarker(null)}>
            {userLocation && <Circle center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} radius={2000} fillColor="rgba(42,157,143,0.1)" strokeColor="rgba(42,157,143,0.3)" strokeWidth={1} />}
            {markers.map((marker) => (
              <Marker key={marker.id} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} onPress={() => setSelectedMarker(marker)}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ backgroundColor: marker.type === 'pharmacy' ? COLORS.accent : COLORS.secondary, borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white }}>
                    <Text style={{ fontSize: 18 }}>{marker.type === 'pharmacy' ? '💊' : '👨‍⚕️'}</Text>
                  </View>
                  <View style={{ backgroundColor: marker.type === 'pharmacy' ? COLORS.accent : COLORS.secondary, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 }}>
                    <Text style={{ fontSize: 9, color: COLORS.white, fontWeight: '600' }} numberOfLines={1}>{marker.title?.split(' ')[0]}</Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
          {/* Stats overlay */}
          <View style={{ position: 'absolute', top: 12, right: 12, gap: 8 }}>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, elevation: 4, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14 }}>👨‍⚕️</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.secondary }}>{mapDoctors.length}</Text>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, elevation: 4, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14 }}>💊</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.accent }}>{mapPharmacies.length}</Text>
            </View>
          </View>
          {/* Locate button */}
          <TouchableOpacity style={{ position: 'absolute', bottom: selectedMarker ? 220 : 20, right: 12, backgroundColor: COLORS.white, borderRadius: 30, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 4 }} onPress={() => { getUserLocation(); if (userLocation && mapRef.current) mapRef.current.animateToRegion(userLocation, 500); }}>
            <Text style={{ fontSize: 22 }}>📍</Text>
          </TouchableOpacity>
        </View>
        {/* Selected marker detail */}
        {selectedMarker && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, elevation: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: selectedMarker.type === 'pharmacy' ? '#FEF3C7' : COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 28 }}>{selectedMarker.type === 'pharmacy' ? '🏪' : '👨‍⚕️'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.text }}>{selectedMarker.type === 'doctor' ? 'Dr. ' : ''}{selectedMarker.title}</Text>
                <Text style={{ fontSize: 13, color: selectedMarker.type === 'pharmacy' ? COLORS.accent : COLORS.primary, fontWeight: '500' }}>{selectedMarker.subtitle}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedMarker(null)}><Text style={{ fontSize: 22, color: COLORS.textLight }}>✕</Text></TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {selectedMarker.type === 'pharmacy' ? (
                <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => { setSelectedMarker(null); setActiveTab('pharmacy'); setPharmacyTab('browse'); }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>💊 Order Meds</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.secondary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => { setSelectedMarker(null); setActiveTab('search'); }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>📅 Book Appointment</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={{ backgroundColor: COLORS.lightGray, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' }} onPress={() => setSelectedMarker(null)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // ── RENDER RECORDS ────────────────────────────────────────────────────────────
  const renderRecords = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📋 Medical Records</Text>
          <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }} onPress={() => setShowAddRecord(!showAddRecord)}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{showAddRecord ? '✕ Cancel' : '+ Add'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Your health documents & records</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {showAddRecord && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Add New Record</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Record Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['lab_result', 'prescription', 'scan', 'vaccination', 'surgical', 'allergy', 'chronic', 'other'].map((type) => (
                  <TouchableOpacity key={type} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: recordType === type ? COLORS.secondary : COLORS.border, backgroundColor: recordType === type ? COLORS.secondary : COLORS.white }} onPress={() => setRecordType(type)}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: recordType === type ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{type.replace('_', ' ')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {[{ label: 'Record Name *', value: recordName, setter: setRecordName, placeholder: 'e.g. Blood Test Results - Jan 2024' }, { label: 'Notes', value: recordNotes, setter: setRecordNotes, placeholder: 'Additional notes...' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} />
              </View>
            ))}
            <TouchableOpacity style={{ backgroundColor: uploadingRecord ? COLORS.gray : COLORS.secondary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={addMedicalRecord} disabled={uploadingRecord}>
              {uploadingRecord ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Save Record ✅</Text>}
            </TouchableOpacity>
          </View>
        )}
        {loadingRecords ? <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 20 }} /> : medicalRecords.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>📋</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No Records Yet</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 }}>Add your medical records to keep everything in one place</Text>
          </View>
        ) : medicalRecords.map((record) => (
          <View key={record.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 22 }}>📄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{record.record_name}</Text>
              <Text style={{ fontSize: 12, color: COLORS.primary, textTransform: 'capitalize' }}>{record.record_type?.replace('_', ' ')}</Text>
              {record.notes && <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{record.notes}</Text>}
              <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{new Date(record.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // ── RENDER PROFILE ────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 44 }}>🙋</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{profile?.email}</Text>
            <View style={{ backgroundColor: '#D1FAE5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#065F46' }}>✅ Verified Patient</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {/* Patient profile view */}
        {patientProfile && !editingProfile && (
          <>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🩺 Health Profile</Text>
              {[{ label: 'Blood Type', value: patientProfile.blood_type || 'Not set', icon: '🩸' }, { label: 'Date of Birth', value: patientProfile.date_of_birth || 'Not set', icon: '🎂' }, { label: 'Height', value: patientProfile.height || 'Not set', icon: '📏' }, { label: 'Weight', value: patientProfile.weight || 'Not set', icon: '⚖️' }, { label: 'Allergies', value: patientProfile.allergies?.length > 0 ? patientProfile.allergies.join(', ') : 'None listed', icon: '⚠️' }].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                  <View>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🆘 Emergency Contact</Text>
              {[{ label: 'Name', value: patientProfile.emergency_contact_name || 'Not set' }, { label: 'Phone', value: patientProfile.emergency_contact_phone || 'Not set' }].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
                </View>
              ))}
            </View>
            {patientProfile.insurance_provider && (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🛡️ Insurance Details</Text>
                {[{ label: 'Provider', value: patientProfile.insurance_provider || 'Not set' }, { label: 'Policy Number', value: patientProfile.insurance_number || 'Not set' }, { label: 'Insurance Type', value: patientProfile.insurance_type || 'Not set' }, { label: 'Expiry Date', value: patientProfile.insurance_expiry || 'Not set' }, { label: 'Group Number', value: patientProfile.insurance_group_number || 'Not set' }, { label: 'Verified', value: patientProfile.insurance_verified ? '✅ Verified' : '⏳ Not Verified' }].map((item) => (
                  <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                    <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}
            <PatientPrescriptions patientId={user.id} />
            <PatientReferrals patientId={user.id} />
          </>
        )}
        {/* Edit profile form */}
        {editingProfile ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Edit Health Profile</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Blood Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                <TouchableOpacity key={type} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: bloodType === type ? COLORS.primary : COLORS.border, backgroundColor: bloodType === type ? COLORS.primaryLight : COLORS.white }} onPress={() => setBloodType(type)}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: bloodType === type ? COLORS.primary : COLORS.gray }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {[{ label: 'Date of Birth', value: dateOfBirth, setter: setDateOfBirth, placeholder: 'DD/MM/YYYY' }, { label: 'Height', value: height, setter: setHeight, placeholder: 'e.g. 170cm' }, { label: 'Weight', value: weight, setter: setWeight, placeholder: 'e.g. 70kg' }, { label: 'Emergency Contact Name', value: emergencyContactName, setter: setEmergencyContactName, placeholder: 'Full name' }, { label: 'Emergency Contact Phone', value: emergencyContactPhone, setter: setEmergencyContactPhone, placeholder: '+1 234 567 8900', keyboard: 'phone-pad' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
              </View>
            ))}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Allergies</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <TextInput style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. Penicillin" value={allergyInput} onChangeText={setAllergyInput} />
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 14, justifyContent: 'center' }} onPress={() => { if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) { setAllergies([...allergies, allergyInput.trim()]); setAllergyInput(''); } }}>
                  <Text style={{ fontSize: 16, color: COLORS.white }}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {allergies.map((allergy) => (
                  <TouchableOpacity key={allergy} style={{ backgroundColor: '#FEE2E2', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => setAllergies(allergies.filter(a => a !== allergy))}>
                    <Text style={{ fontSize: 13, color: '#991B1B' }}>{allergy}</Text>
                    <Text style={{ fontSize: 12, color: '#991B1B' }}>✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14, marginTop: 8 }}>🛡️ Insurance (Optional)</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Insurance Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[{ id: 'nhis', label: 'NHIS', icon: '🏥' }, { id: 'private', label: 'Private', icon: '🛡️' }, { id: 'corporate', label: 'Corporate', icon: '🏢' }, { id: 'none', label: 'None', icon: '❌' }].map((type) => (
                <TouchableOpacity key={type.id} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: insuranceType === type.id ? COLORS.primary : COLORS.border, backgroundColor: insuranceType === type.id ? COLORS.primaryLight : COLORS.white, flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => setInsuranceType(type.id)}>
                  <Text style={{ fontSize: 16 }}>{type.icon}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: insuranceType === type.id ? COLORS.primary : COLORS.gray }}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {[{ label: 'Insurance Provider', value: insuranceProvider, setter: setInsuranceProvider, placeholder: 'e.g. NHIS, AXA, Prudential' }, { label: 'Policy Number', value: insuranceNumber, setter: setInsuranceNumber, placeholder: 'Your policy number' }, { label: 'Group Number', value: insuranceGroupNumber, setter: setInsuranceGroupNumber, placeholder: 'Group or employer number' }, { label: 'Expiry Date', value: insuranceExpiry, setter: setInsuranceExpiry, placeholder: 'MM/YYYY' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} />
              </View>
            ))}
            <TouchableOpacity style={{ backgroundColor: savingProfile ? COLORS.gray : COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 }} onPress={savePatientProfile} disabled={savingProfile}>
              {savingProfile ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Save Profile ✅</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => setEditingProfile(false)}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setEditingProfile(true)}>
            <Text style={{ fontSize: 18 }}>✏️</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Edit Health Profile</Text>
          </TouchableOpacity>
        )}
        {/* Language selector */}
        <TouchableOpacity style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setShowLanguageSelector(true)}>
          <Text style={{ fontSize: 18 }}>🌍</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text }}>{LANGUAGES[language]?.name || 'English'} — Change Language</Text>
        </TouchableOpacity>
        {/* Legal */}
        <TouchableOpacity style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setShowTermsScreen(true)}>
          <Text style={{ fontSize: 18 }}>📄</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text }}>Terms & Privacy Policy</Text>
        </TouchableOpacity>
        {/* Contact */}
        <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 4 }}>📧 Legal & Privacy Contact</Text>
          <Text style={{ fontSize: 13, color: COLORS.primary }}>hello@reinecare.com</Text>
        </View>
        {/* Logout */}
        <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log Out', style: 'destructive', onPress: onLogout }])}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#991B1B' }}>{t('logOut')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── TERMS SCREEN ──────────────────────────────────────────────────────────────
  if (showTermsScreen) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
          <TouchableOpacity onPress={() => setShowTermsScreen(false)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>📄 Terms & Privacy</Text>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Terms of Service</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginBottom: 20 }}>By using ReineCare, you agree to our terms and conditions. ReineCare is a healthcare marketplace connecting patients with verified medical professionals. All consultations are facilitated through our platform under Reine Mande Ltd, London, UK.</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Privacy Policy</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginBottom: 20 }}>We take your privacy seriously. Your medical data is encrypted and stored securely. We do not share your information with third parties without your consent. For full privacy details, contact us at hello@reinecare.com.</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>Contact</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginBottom: 8 }}>Legal & Privacy: hello@reinecare.com</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginBottom: 8 }}>Company: Reine Mande Ltd, London, UK</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, lineHeight: 22 }}>© {new Date().getFullYear()} ReineCare. All rights reserved.</Text>
        </ScrollView>
      </View>
    );
  }

  // ── MAIN RETURN ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {showRateApp && <RateAppPrompt onDismiss={() => setShowRateApp(false)} />}
      {showLanguageSelector && <LanguageSelector onClose={() => setShowLanguageSelector(false)} />}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderSearch()}
        {activeTab === 'symptom' && (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 0 }} />
            <SymptomChecker userId={user.id} patientProfile={patientProfile} onBookDoctor={(specialty) => { setSelectedSpecialty(specialty); setActiveTab('search'); }} />
          </View>
        )}
        {activeTab === 'bookings' && renderPatientBookings()}
        {activeTab === 'pharmacy' && renderPharmacy()}
        {activeTab === 'health' && (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>❤️ Health Dashboard</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Track and monitor your health</Text>
            </View>
            <HealthDashboard userId={user.id} patientProfile={patientProfile} />
          </View>
        )}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'records' && renderRecords()}
        {activeTab === 'profile' && renderProfile()}
      </View>
      {/* Bottom tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, maxHeight: 70 }} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={{ alignItems: 'center', paddingHorizontal: 16 }} onPress={() => setActiveTab(tab.id)}>
              <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: 6 }} />
              <Text style={{ fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2 }}>{tab.icon}</Text>
              <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.primary : COLORS.gray }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
// ─── DOCTOR DASHBOARD ─────────────────────────────────────────────────────────
function DoctorDashboard({ user, profile, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  // Doctor profile state
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [qualification, setQualification] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [videoFee, setVideoFee] = useState('');
  const [physicalFee, setPhysicalFee] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [availableVideo, setAvailableVideo] = useState(true);
  const [availablePhysical, setAvailablePhysical] = useState(true);
  const [freeFirst, setFreeFirst] = useState(false);
  const [cancellationFee, setCancellationFee] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Clinic location
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicCity, setClinicCity] = useState('');
  const [clinicCountry, setClinicCountry] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [directionsNotes, setDirectionsNotes] = useState('');

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState('pending');

  // Patients state
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);

  // Earnings state
  const [earnings, setEarnings] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [earningsStats, setEarningsStats] = useState({ totalEarned: 0, thisMonthEarned: 0, pendingAmount: 0, totalSessions: 0 });
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [mobileMoney, setMobileMoney] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  // Chat
  const [showDoctorChat, setShowDoctorChat] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [showDoctorConversations, setShowDoctorConversations] = useState(false);

  // Video call
  const [showDoctorVideoCall, setShowDoctorVideoCall] = useState(false);
  const [doctorVideoCallBooking, setDoctorVideoCallBooking] = useState(null);

  // Waiting room
  const [showDoctorWaitingRoom, setShowDoctorWaitingRoom] = useState(false);
  const [doctorWaitingRoomBooking, setDoctorWaitingRoomBooking] = useState(null);

  // Prescription
  const [showPrescriptionWriter, setShowPrescriptionWriter] = useState(false);
  const [prescriptionBooking, setPrescriptionBooking] = useState(null);

  // Referral
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralBooking, setReferralBooking] = useState(null);

  // Referrals tab
  const [myReferrals, setMyReferrals] = useState([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [referralFilter, setReferralFilter] = useState('sent');

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'calendar', icon: '📆', label: 'Calendar' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'referrals', icon: '📋', label: 'Referrals' },
    { id: 'performance', icon: '📈', label: 'Performance' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  useEffect(() => { fetchDoctorProfile(); }, []);

  useEffect(() => {
    runAfterInteractions(() => {
      if (activeTab === 'appointments') fetchAppointments();
      if (activeTab === 'patients') fetchPatients();
      if (activeTab === 'earnings') { fetchEarnings(); fetchWithdrawalRequests(); }
      if (activeTab === 'referrals') fetchMyReferrals();
    });
  }, [activeTab, appointmentFilter, referralFilter]);

  const fetchDoctorProfile = async () => {
    try {
      const { data } = await supabase.from('doctor_profiles').select('*').eq('id', user.id).single();
      if (data) {
        setDoctorProfile(data);
        setSpecialty(data.specialty || '');
        setQualification(data.qualification || '');
        setLicenseNumber(data.license_number || '');
        setExperienceYears(data.experience_years?.toString() || '');
        setConsultationFee(data.consultation_fee?.toString() || '');
        setVideoFee(data.video_consultation_fee?.toString() || '');
        setPhysicalFee(data.physical_consultation_fee?.toString() || '');
        setBio(data.bio || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        setCountry(data.country || '');
        setAvailableVideo(data.available_for_video ?? true);
        setAvailablePhysical(data.available_for_physical ?? true);
        setFreeFirst(data.free_first_consultation ?? false);
        setCancellationFee(data.cancellation_fee?.toString() || '');
        setClinicName(data.clinic_name || '');
        setClinicAddress(data.clinic_address || '');
        setClinicCity(data.clinic_city || '');
        setClinicCountry(data.clinic_country || '');
        setClinicPhone(data.clinic_phone || '');
        setClinicEmail(data.clinic_email || '');
        setDirectionsNotes(data.directions_notes || '');
      }
    } catch (error) { console.log('Error fetching doctor profile:', error.message); }
  };

  const saveProfile = async () => {
    if (!specialty) { Alert.alert('Missing Info', 'Please enter your specialty'); return; }
    if (!licenseNumber) { Alert.alert('Missing Info', 'Please enter your license number'); return; }
    setSavingProfile(true);
    try {
      const profileData = {
        id: user.id,
        specialty,
        qualification,
        license_number: licenseNumber,
        experience_years: parseInt(experienceYears) || 0,
        consultation_fee: parseFloat(consultationFee) || 0,
        video_consultation_fee: parseFloat(videoFee) || 0,
        physical_consultation_fee: parseFloat(physicalFee) || 0,
        bio,
        phone,
        location,
        country,
        available_for_video: availableVideo,
        available_for_physical: availablePhysical,
        free_first_consultation: freeFirst,
        cancellation_fee: parseFloat(cancellationFee) || 0,
        clinic_name: clinicName,
        clinic_address: clinicAddress,
        clinic_city: clinicCity,
        clinic_country: clinicCountry,
        clinic_phone: clinicPhone,
        clinic_email: clinicEmail,
        directions_notes: directionsNotes,
        profile_complete: true,
      };
      const { error } = await supabase.from('doctor_profiles').upsert(profileData);
      if (error) throw error;
      Alert.alert('Profile Updated! ✅', 'Your profile has been saved.');
      setEditingProfile(false);
      fetchDoctorProfile();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingProfile(false); }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      let query = supabase.from('bookings').select('*').eq('doctor_id', user.id).order('created_at', { ascending: false });
      if (appointmentFilter !== 'all') query = query.eq('status', appointmentFilter);
      const { data, error } = await query;
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) { console.log('Error fetching appointments:', error.message); } finally { setLoadingAppointments(false); }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await supabase.from('bookings').select('patient_id, patient_name, patient_age, created_at').eq('doctor_id', user.id).eq('status', 'completed').order('created_at', { ascending: false });
      const unique = [];
      const seen = new Set();
      (data || []).forEach(b => { if (!seen.has(b.patient_id)) { seen.add(b.patient_id); unique.push(b); } });
      setPatients(unique);
    } catch (error) { console.log('Error fetching patients:', error.message); }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      const { data } = await supabase.from('bookings').select('*').eq('doctor_id', user.id).eq('patient_id', patientId).order('created_at', { ascending: false });
      setPatientHistory(data || []);
    } catch (error) { console.log('Error fetching patient history:', error.message); }
  };

  const fetchEarnings = async () => {
    setLoadingEarnings(true);
    try {
      const { data } = await supabase.from('transactions').select('*').eq('doctor_id', user.id).eq('status', 'released').order('created_at', { ascending: false });
      const txns = data || [];
      const now = new Date();
      const thisMonth = txns.filter(t => { const d = new Date(t.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
      setEarnings(txns);
      setEarningsStats({
        totalEarned: txns.reduce((sum, t) => sum + t.doctor_amount, 0),
        thisMonthEarned: thisMonth.reduce((sum, t) => sum + t.doctor_amount, 0),
        pendingAmount: 0,
        totalSessions: txns.length,
      });
    } catch (error) { console.log('Error fetching earnings:', error.message); } finally { setLoadingEarnings(false); }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const { data } = await supabase.from('withdrawal_requests').select('*').eq('doctor_id', user.id).order('created_at', { ascending: false });
      setWithdrawalRequests(data || []);
    } catch (error) { console.log('Error fetching withdrawals:', error.message); }
  };

  const submitWithdrawalRequest = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) { Alert.alert('Invalid Amount', 'Please enter a valid amount'); return; }
    if (parseFloat(withdrawalAmount) > earningsStats.totalEarned) { Alert.alert('Insufficient Balance', `Your available balance is $${earningsStats.totalEarned.toFixed(2)}`); return; }
    if (paymentMethod === 'bank_transfer' && (!accountName || !accountNumber || !bankName)) { Alert.alert('Missing Info', 'Please fill in all bank details'); return; }
    if (paymentMethod === 'mobile_money' && !mobileMoney) { Alert.alert('Missing Info', 'Please enter your mobile money number'); return; }
    if (paymentMethod === 'paypal' && !paypalEmail) { Alert.alert('Missing Info', 'Please enter your PayPal email'); return; }
    setSubmittingWithdrawal(true);
    try {
      const { error } = await supabase.from('withdrawal_requests').insert({ doctor_id: user.id, amount: parseFloat(withdrawalAmount), payment_method: paymentMethod, account_name: accountName, account_number: accountNumber, bank_name: bankName, mobile_money_number: mobileMoney, paypal_email: paypalEmail, status: 'pending' });
      if (error) throw error;
      await supabase.from('notifications').insert({ user_id: user.id, title: '💰 Withdrawal Requested', message: `Your withdrawal request of $${withdrawalAmount} has been submitted and is being reviewed`, type: 'payment' });
      Alert.alert('Request Submitted! ✅', 'Your withdrawal request has been sent to admin for processing.', [{ text: 'OK', onPress: () => { setShowWithdrawalForm(false); setWithdrawalAmount(''); fetchWithdrawalRequests(); } }]);
    } catch (error) { Alert.alert('Error', error.message); } finally { setSubmittingWithdrawal(false); }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await supabase.from('bookings').update({ status }).eq('id', bookingId);
      if (status === 'confirmed') {
        const booking = appointments.find(a => a.id === bookingId);
        if (booking) {
          await supabase.from('notifications').insert({ user_id: booking.patient_id, title: '✅ Appointment Confirmed!', message: `Dr. ${profile?.full_name} confirmed your appointment on ${booking.preferred_date} at ${booking.preferred_time}`, type: 'booking' });
        }
      }
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const fetchMyReferrals = async () => {
    setLoadingReferrals(true);
    try {
      const field = referralFilter === 'sent' ? 'referring_doctor_id' : 'referred_doctor_id';
      const { data } = await supabase.from('referrals').select('*').eq(field, user.id).order('created_at', { ascending: false });
      setMyReferrals(data || []);
    } catch (error) { console.log('Error fetching referrals:', error.message); } finally { setLoadingReferrals(false); }
  };

  const updateReferralStatus = async (referralId, status) => {
    try {
      await supabase.from('referrals').update({ status, updated_at: new Date().toISOString() }).eq('id', referralId);
      Alert.alert('Updated! ✅', `Referral ${status}`);
      fetchMyReferrals();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  // ── SPECIAL SCREENS ──────────────────────────────────────────────────────────
  if (showNotifications) return <NotificationsScreen userId={user.id} onBack={() => setShowNotifications(false)} />;
  if (showDoctorChat && chatPatient) return <ChatScreen currentUserId={user.id} otherUserId={chatPatient.id} otherUserName={chatPatient.name} otherUserRole="patient" bookingId={chatPatient.bookingId} onBack={() => { setShowDoctorChat(false); setChatPatient(null); }} accentColor={COLORS.secondary} />;
  if (showDoctorConversations) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <TouchableOpacity onPress={() => setShowDoctorConversations(false)} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Messages 💬</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Chat with your patients</Text>
        </View>
        <ConversationsList currentUserId={user.id} currentUserRole="doctor" onSelectConversation={(conv, otherId, otherName) => { setChatPatient({ id: otherId, name: otherName, bookingId: conv.booking_id }); setShowDoctorConversations(false); setShowDoctorChat(true); }} accentColor={COLORS.secondary} />
      </View>
    );
  }
  if (showDoctorVideoCall && doctorVideoCallBooking) {
    return (
      <VideoCallScreen booking={doctorVideoCallBooking} userId={user.id} userRole="doctor" onCallEnd={() => { setShowDoctorVideoCall(false); setDoctorVideoCallBooking(null); Alert.alert('Call Ended 📹', 'The video consultation has ended.', [{ text: 'Write Prescription', onPress: () => { setPrescriptionBooking(doctorVideoCallBooking); setShowPrescriptionWriter(true); } }, { text: 'Done', style: 'cancel' }]); }} />
    );
  }
  if (showDoctorWaitingRoom && doctorWaitingRoomBooking) {
    return (
      <WaitingRoom booking={doctorWaitingRoomBooking} userId={user.id} userRole="doctor" doctorProfile={doctorProfile} onClose={() => { setShowDoctorWaitingRoom(false); setDoctorWaitingRoomBooking(null); }} onSessionStart={() => Alert.alert('Session Starting! 🎉', 'Your patient is ready. Please begin the video session.')} />
    );
  }
  if (showPrescriptionWriter && prescriptionBooking) {
    return (
      <PrescriptionWriter booking={prescriptionBooking} doctorProfile={doctorProfile} doctorName={profile?.full_name} onClose={() => { setShowPrescriptionWriter(false); setPrescriptionBooking(null); }} onSaved={() => { setShowPrescriptionWriter(false); setPrescriptionBooking(null); fetchAppointments(); }} />
    );
  }
  if (showReferralForm && referralBooking) {
    return (
      <ReferralForm currentDoctorId={user.id} currentDoctorName={profile?.full_name} booking={referralBooking} onClose={() => { setShowReferralForm(false); setReferralBooking(null); }} onSaved={() => { setShowReferralForm(false); setReferralBooking(null); fetchAppointments(); }} />
    );
  }

  // ── RENDER HOME ───────────────────────────────────────────────────────────────
  const renderHome = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Good day 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Dr. {profile?.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{doctorProfile?.specialty || 'Complete your profile'}</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>
      <BroadcastBanner userRole="doctor" />
      <View style={{ padding: 24 }}>
        {/* Profile incomplete warning */}
        {!doctorProfile?.profile_complete && (
          <TouchableOpacity style={{ backgroundColor: '#FEF3C7', borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }} onPress={() => { setActiveTab('profile'); setEditingProfile(true); }}>
            <Text style={{ fontSize: 24 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#92400E' }}>Complete Your Profile</Text>
              <Text style={{ fontSize: 12, color: '#92400E' }}>Patients cannot find you until your profile is complete</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#92400E' }}>›</Text>
          </TouchableOpacity>
        )}
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[{ icon: '📅', label: 'Total Bookings', value: appointments.length, color: COLORS.primaryLight, textColor: COLORS.primary }, { icon: '💰', label: 'This Month', value: `$${earningsStats.thisMonthEarned.toFixed(0)}`, color: '#D1FAE5', textColor: '#065F46' }, { icon: '⭐', label: 'Rating', value: doctorProfile?.rating || 'New', color: '#FEF3C7', textColor: '#92400E' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 14, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: stat.textColor }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {/* Telemedicine badge */}
        {doctorProfile?.telemedicine_certified && (
          <View style={{ marginBottom: 16 }}>
            <TelemedicineBadge level={doctorProfile.telemedicine_badge_level} certified={doctorProfile.telemedicine_certified} totalSessions={doctorProfile.total_video_sessions} />
          </View>
        )}
        {/* Progress to badge */}
        {!doctorProfile?.telemedicine_certified && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>📹 Telemedicine Badge Progress</Text>
            <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 10 }}>Complete {10 - (doctorProfile?.total_video_sessions || 0)} more video sessions to earn your Bronze badge</Text>
            <View style={{ height: 8, backgroundColor: COLORS.lightGray, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ height: 8, width: `${Math.min(((doctorProfile?.total_video_sessions || 0) / 10) * 100, 100)}%`, backgroundColor: COLORS.primary, borderRadius: 4 }} />
            </View>
            <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 6 }}>{doctorProfile?.total_video_sessions || 0} / 10 sessions</Text>
          </View>
        )}
        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[{ icon: '📅', label: 'View Appointments', tab: 'appointments' }, { icon: '📆', label: 'Manage Calendar', tab: 'calendar' }].map((item) => (
            <TouchableOpacity key={item.tab} style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2 }} onPress={() => setActiveTab(item.tab)}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Messages quick action */}
        <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2, marginBottom: 16 }} onPress={() => setShowDoctorConversations(true)}>
          <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 26 }}>💬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>Messages</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight }}>Chat with your patients</Text>
          </View>
          <Text style={{ fontSize: 20, color: COLORS.textLight }}>›</Text>
        </TouchableOpacity>
        {/* Profile card */}
        {doctorProfile?.profile_complete && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>👨‍⚕️ Your Profile</Text>
            {[{ label: 'Specialty', value: doctorProfile.specialty }, { label: 'Qualification', value: doctorProfile.qualification }, { label: 'Experience', value: `${doctorProfile.experience_years} years` }, { label: 'Consultation Fee', value: `$${doctorProfile.consultation_fee}/hr` }, { label: '🏥 Clinic', value: doctorProfile.clinic_name || 'Not set' }, { label: '📍 Clinic Address', value: doctorProfile.clinic_address || 'Not set' }].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  // ── RENDER APPOINTMENTS ───────────────────────────────────────────────────────
  const renderDoctorAppointments = () => {
    if (selectedAppointment) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => setSelectedAppointment(null)} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Appointments</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Appointment Details</Text>
          </View>
          <View style={{ padding: 24 }}>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 28 }}>🙋</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>{selectedAppointment.patient_name}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.textLight }}>{selectedAppointment.patient_age ? `${selectedAppointment.patient_age} years old` : 'Age not specified'}</Text>
                </View>
                <View style={{ backgroundColor: selectedAppointment.status === 'completed' ? '#D1FAE5' : selectedAppointment.status === 'confirmed' ? '#DBEAFE' : selectedAppointment.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedAppointment.status === 'completed' ? '#065F46' : selectedAppointment.status === 'confirmed' ? '#1E40AF' : selectedAppointment.status === 'cancelled' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{selectedAppointment.status}</Text>
                </View>
              </View>
              {[{ label: 'Date', value: selectedAppointment.preferred_date }, { label: 'Time', value: selectedAppointment.preferred_time }, { label: 'Session Type', value: selectedAppointment.session_type === 'video' ? '📹 Video' : '🏥 Physical' }, { label: 'Duration', value: `${selectedAppointment.duration_hours} hr${selectedAppointment.duration_hours !== 1 ? 's' : ''}` }, { label: 'Reason', value: selectedAppointment.reason }, { label: 'Amount', value: `$${selectedAppointment.amount}` }].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
                </View>
              ))}
            </View>
            {/* Action buttons */}
            {/* Message patient */}
            <TouchableOpacity style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => { setChatPatient({ id: selectedAppointment.patient_id, name: selectedAppointment.patient_name, bookingId: selectedAppointment.id }); setSelectedAppointment(null); setShowDoctorChat(true); }}>
              <Text style={{ fontSize: 18 }}>💬</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.primary }}>Message Patient</Text>
            </TouchableOpacity>
            {/* Refer patient */}
            <TouchableOpacity style={{ backgroundColor: '#EDE9FE', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => { setReferralBooking(selectedAppointment); setSelectedAppointment(null); setShowReferralForm(true); }}>
              <Text style={{ fontSize: 18 }}>📋</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#5B21B6' }}>Refer to Specialist</Text>
            </TouchableOpacity>
            {/* Video session buttons */}
            {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'pending') && selectedAppointment.session_type === 'video' && (
              <>
                <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => { setDoctorWaitingRoomBooking(selectedAppointment); setSelectedAppointment(null); setShowDoctorWaitingRoom(true); }}>
                  <Text style={{ fontSize: 18 }}>📹</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Start Video Session</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => { setDoctorVideoCallBooking(selectedAppointment); setSelectedAppointment(null); setShowDoctorVideoCall(true); }}>
                  <Text style={{ fontSize: 18 }}>📹</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Join Video Call</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Confirm */}
            {selectedAppointment.status === 'pending' && (
              <View style={{ gap: 12 }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateBookingStatus(selectedAppointment.id, 'confirmed')}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>✅ Confirm Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => { Alert.alert('Decline Appointment', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Decline', style: 'destructive', onPress: () => updateBookingStatus(selectedAppointment.id, 'cancelled') }]); }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>❌ Decline</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Write prescription & complete */}
            {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'completed') && (
              <View style={{ gap: 12, marginTop: selectedAppointment.status === 'confirmed' ? 0 : 0 }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => { setPrescriptionBooking(selectedAppointment); setShowPrescriptionWriter(true); }}>
                  <Text style={{ fontSize: 18 }}>💊</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Write Prescription</Text>
                </TouchableOpacity>
                {selectedAppointment.status === 'confirmed' && (
                  <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateBookingStatus(selectedAppointment.id, 'completed')}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>✅ Mark as Completed</Text>
                  </TouchableOpacity>
                )}
                {selectedAppointment.status === 'completed' && (
                  <View style={{ backgroundColor: '#D1FAE5', borderRadius: 16, padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, marginBottom: 8 }}>✅</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#065F46' }}>Session Completed</Text>
                    <Text style={{ fontSize: 13, color: '#065F46', marginTop: 4, textAlign: 'center' }}>Admin will release your payment shortly</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📅 Appointments</Text>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['pending', 'confirmed', 'completed', 'cancelled', 'all'].map((filter) => (
                <TouchableOpacity key={filter} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: appointmentFilter === filter ? COLORS.white : 'rgba(255,255,255,0.2)' }} onPress={() => setAppointmentFilter(filter)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: appointmentFilter === filter ? COLORS.secondary : COLORS.white, textTransform: 'capitalize' }}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {loadingAppointments ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.secondary} />
          </View>
        ) : appointments.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>📅</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>No Appointments</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 6, textAlign: 'center' }}>Patient appointment requests will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews={true}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: apt }) => (
              <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }} onPress={() => setSelectedAppointment(apt)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <Text style={{ fontSize: 24 }}>{apt.session_type === 'video' ? '📹' : '🏥'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{apt.patient_name}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.textLight }}>{apt.preferred_date} at {apt.preferred_time}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }} numberOfLines={1}>{apt.reason}</Text>
                  </View>
                  <View style={{ backgroundColor: apt.status === 'completed' ? '#D1FAE5' : apt.status === 'confirmed' ? '#DBEAFE' : apt.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: apt.status === 'completed' ? '#065F46' : apt.status === 'confirmed' ? '#1E40AF' : apt.status === 'cancelled' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{apt.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  // ── RENDER CALENDAR ───────────────────────────────────────────────────────────
  const renderCalendar = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📆 My Calendar</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Manage your availability and time slots</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 24 }}>
          <DoctorAvailabilityCalendar doctorId={user.id} />
          <View style={{ marginTop: 8 }}>
            <OfficeHoursManager doctorId={user.id} />
          </View>
          <View style={{ marginTop: 24 }}>
            <ScheduleTemplates doctorId={user.id} onApplyTemplate={() => {}} />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  // ── RENDER PATIENTS ───────────────────────────────────────────────────────────
  const renderPatients = () => {
    if (selectedPatient) {
      return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientHistory([]); }} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Patients</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{selectedPatient.patient_name}</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{selectedPatient.patient_age ? `${selectedPatient.patient_age} years old` : 'Age not specified'}</Text>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📅 Session History</Text>
            {patientHistory.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>No session history found</Text>
              </View>
            ) : patientHistory.map((session) => (
              <View key={session.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{session.preferred_date} at {session.preferred_time}</Text>
                  <View style={{ backgroundColor: session.status === 'completed' ? '#D1FAE5' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: session.status === 'completed' ? '#065F46' : '#92400E', textTransform: 'capitalize' }}>{session.status}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{session.reason}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>{session.session_type === 'video' ? '📹 Video' : '🏥 Physical'} • ${session.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>👥 My Patients</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Patients you have consulted with</Text>
        </View>
        {patients.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>👥</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>No Patients Yet</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 6, textAlign: 'center' }}>Your patients will appear here after completed sessions</Text>
          </View>
        ) : (
          <FlatList
            data={patients}
            keyExtractor={(item) => item.patient_id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: patient }) => (
              <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setSelectedPatient(patient); fetchPatientHistory(patient.patient_id); }}>
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 26 }}>🙋</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{patient.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{patient.patient_age ? `${patient.patient_age} years old` : 'Age not specified'}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>Last seen: {new Date(patient.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={{ fontSize: 20, color: COLORS.textLight }}>›</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  // ── RENDER REFERRALS ──────────────────────────────────────────────────────────
  const renderReferrals = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📋 Referrals</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Patient referrals sent and received</Text>
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4, marginTop: 16 }}>
          {[{ id: 'sent', label: '📤 Sent' }, { id: 'received', label: '📥 Received' }].map((tab) => (
            <TouchableOpacity key={tab.id} style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: referralFilter === tab.id ? COLORS.white : 'transparent' }} onPress={() => setReferralFilter(tab.id)}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: referralFilter === tab.id ? COLORS.secondary : COLORS.white }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loadingReferrals ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : myReferrals.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 50, marginBottom: 16 }}>📋</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 }}>No {referralFilter === 'sent' ? 'Sent' : 'Received'} Referrals</Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>{referralFilter === 'sent' ? 'Referrals you send to other specialists will appear here' : 'Referrals from other doctors will appear here'}</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          {myReferrals.map((referral) => {
            const urgencyColors = { urgent: { bg: '#FEE2E2', text: '#991B1B' }, soon: { bg: '#FEF3C7', text: '#92400E' }, routine: { bg: '#D1FAE5', text: '#065F46' } };
            const uc = urgencyColors[referral.urgency] || urgencyColors.routine;
            return (
              <View key={referral.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>Patient Referral</Text>
                    <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 4 }}>{referral.reason}</Text>
                    {referral.notes && <Text style={{ fontSize: 12, color: COLORS.textLight, fontStyle: 'italic' }}>{referral.notes}</Text>}
                    <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{new Date(referral.created_at).toLocaleDateString()}</Text>
                  </View>
                  <View style={{ gap: 6 }}>
                    <View style={{ backgroundColor: uc.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: uc.text, textTransform: 'capitalize' }}>{referral.urgency}</Text>
                    </View>
                    <View style={{ backgroundColor: referral.status === 'pending' ? '#FEF3C7' : referral.status === 'accepted' ? '#D1FAE5' : '#FEE2E2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: referral.status === 'pending' ? '#92400E' : referral.status === 'accepted' ? '#065F46' : '#991B1B', textTransform: 'capitalize' }}>{referral.status}</Text>
                    </View>
                  </View>
                </View>
                {referralFilter === 'received' && referral.status === 'pending' && (
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#D1FAE5', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => updateReferralStatus(referral.id, 'accepted')}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#065F46' }}>✅ Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => updateReferralStatus(referral.id, 'declined')}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#991B1B' }}>❌ Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {referralFilter === 'received' && referral.status === 'accepted' && (
                  <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => updateReferralStatus(referral.id, 'completed')}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>✅ Mark as Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  // ── RENDER EARNINGS ───────────────────────────────────────────────────────────
  const renderEarnings = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Earnings 💰</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Your income from ReineCare</Text>
      </View>
      <View style={{ padding: 24 }}>
        {loadingEarnings ? <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginTop: 40 }} /> : (
          <>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1, backgroundColor: COLORS.secondary, borderRadius: 16, padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Total Earned</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>${earningsStats.totalEarned.toFixed(2)}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 6 }}>This Month</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.secondary }}>${earningsStats.thisMonthEarned.toFixed(2)}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#FEF3C7', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#92400E', marginBottom: 4 }}>⏳ How Payouts Work</Text>
              <Text style={{ fontSize: 12, color: '#92400E', lineHeight: 18 }}>15% platform commission is deducted. Payments are released by admin after session completion. Request withdrawal anytime.</Text>
            </View>
            {earningsStats.totalEarned > 0 && (
              <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }} onPress={() => { setShowWithdrawalForm(true); fetchWithdrawalRequests(); }}>
                <Text style={{ fontSize: 20 }}>💸</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Request Withdrawal</Text>
              </TouchableOpacity>
            )}
            {showWithdrawalForm && (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>💸 Withdrawal Request</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 16 }}>Available balance: ${earningsStats.totalEarned.toFixed(2)}</Text>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Amount (USD) *</Text>
                  <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder={`Max: $${earningsStats.totalEarned.toFixed(2)}`} value={withdrawalAmount} onChangeText={setWithdrawalAmount} keyboardType="numeric" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Payment Method *</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                  {[{ id: 'bank_transfer', icon: '🏦', label: 'Bank' }, { id: 'mobile_money', icon: '📱', label: 'Mobile Money' }, { id: 'paypal', icon: '💳', label: 'PayPal' }].map((method) => (
                    <TouchableOpacity key={method.id} style={{ flex: 1, borderWidth: 2, borderColor: paymentMethod === method.id ? COLORS.secondary : COLORS.border, borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: paymentMethod === method.id ? COLORS.secondary : COLORS.white }} onPress={() => setPaymentMethod(method.id)}>
                      <Text style={{ fontSize: 18, marginBottom: 2 }}>{method.icon}</Text>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: paymentMethod === method.id ? COLORS.white : COLORS.gray }}>{method.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {paymentMethod === 'bank_transfer' && [{ label: 'Account Name *', value: accountName, setter: setAccountName, placeholder: 'Full name on account' }, { label: 'Account Number *', value: accountNumber, setter: setAccountNumber, placeholder: 'Bank account number', keyboard: 'numeric' }, { label: 'Bank Name *', value: bankName, setter: setBankName, placeholder: 'e.g. Barclays, GCB Bank' }].map((field) => (
                  <View key={field.label} style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                    <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
                  </View>
                ))}
                {paymentMethod === 'mobile_money' && (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Mobile Money Number *</Text>
                    <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="e.g. 0241234567" value={mobileMoney} onChangeText={setMobileMoney} keyboardType="phone-pad" />
                  </View>
                )}
                {paymentMethod === 'paypal' && (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>PayPal Email *</Text>
                    <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder="your@email.com" value={paypalEmail} onChangeText={setPaypalEmail} keyboardType="email-address" autoCapitalize="none" />
                  </View>
                )}
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 18 }}>ℹ️ Withdrawal requests are processed by admin within 2-5 business days.</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: submittingWithdrawal ? COLORS.gray : COLORS.success, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }} onPress={submitWithdrawalRequest} disabled={submittingWithdrawal}>
                  {submittingWithdrawal ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Submit Request 💸</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }} onPress={() => setShowWithdrawalForm(false)}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            {withdrawalRequests.length > 0 && (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📋 Withdrawal History</Text>
                {withdrawalRequests.map((req) => (
                  <View key={req.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: req.status === 'paid' ? '#D1FAE5' : req.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Text style={{ fontSize: 22 }}>{req.status === 'paid' ? '✅' : req.status === 'rejected' ? '❌' : '⏳'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>${req.amount}</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textLight, textTransform: 'capitalize' }}>{req.payment_method?.replace('_', ' ')}</Text>
                      <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(req.created_at).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ backgroundColor: req.status === 'paid' ? '#D1FAE5' : req.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: req.status === 'paid' ? '#065F46' : req.status === 'rejected' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{req.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {earnings.length === 0 ? (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 40, alignItems: 'center', elevation: 2 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>💰</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>No Earnings Yet</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center' }}>Complete sessions to start earning</Text>
              </View>
            ) : earnings.map((earning) => (
              <View key={earning.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <Text style={{ fontSize: 22 }}>{earning.session_type === 'video' ? '📹' : '🏥'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{earning.patient_name || 'Patient'}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>{earning.session_type === 'video' ? 'Video Call' : 'Physical Visit'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.success }}>+${earning.doctor_amount?.toFixed(2)}</Text>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>after 15% commission</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>Total Paid</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>${earning.total_amount?.toFixed(2)}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>Commission</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.error }}>-${earning.commission_amount?.toFixed(2)}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#D1FAE5', borderRadius: 8, padding: 8 }}>
                    <Text style={{ fontSize: 10, color: '#065F46' }}>You Got</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#065F46' }}>${earning.doctor_amount?.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );

  // ── RENDER PROFILE ────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 44 }}>👨‍⚕️</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Dr. {profile?.full_name}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{profile?.email}</Text>
          {doctorProfile?.specialty && <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{doctorProfile.specialty}</Text>}
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {editingProfile ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Edit Professional Profile</Text>
            {[{ label: 'Specialty *', value: specialty, setter: setSpecialty, placeholder: 'e.g. General Practitioner, Cardiologist' }, { label: 'Qualification', value: qualification, setter: setQualification, placeholder: 'e.g. MBBS, MD, PhD' }, { label: 'License Number *', value: licenseNumber, setter: setLicenseNumber, placeholder: 'Medical license number' }, { label: 'Years of Experience', value: experienceYears, setter: setExperienceYears, placeholder: 'e.g. 10', keyboard: 'numeric' }, { label: 'General Fee ($/hr)', value: consultationFee, setter: setConsultationFee, placeholder: 'e.g. 50', keyboard: 'numeric' }, { label: 'Video Consultation Fee ($/hr)', value: videoFee, setter: setVideoFee, placeholder: 'e.g. 40', keyboard: 'numeric' }, { label: 'Physical Visit Fee ($/hr)', value: physicalFee, setter: setPhysicalFee, placeholder: 'e.g. 60', keyboard: 'numeric' }, { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Contact number', keyboard: 'phone-pad' }, { label: 'Location / City', value: location, setter: setLocation, placeholder: 'e.g. London, Accra' }, { label: 'Country', value: country, setter: setCountry, placeholder: 'e.g. UK, Ghana' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
              </View>
            ))}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Bio / About You</Text>
              <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray, minHeight: 100, textAlignVertical: 'top' }} placeholder="Tell patients about your experience and approach..." value={bio} onChangeText={setBio} multiline />
            </View>
            {/* Toggles */}
            {[{ label: '📹 Available for Video', value: availableVideo, setter: setAvailableVideo }, { label: '🏥 Available for Physical', value: availablePhysical, setter: setAvailablePhysical }, { label: '🎁 Free First Consultation', value: freeFirst, setter: setFreeFirst }].map((toggle) => (
              <TouchableOpacity key={toggle.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 12 }} onPress={() => toggle.setter(!toggle.value)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>{toggle.label}</Text>
                <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: toggle.value ? COLORS.success : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, alignSelf: toggle.value ? 'flex-end' : 'flex-start' }} />
                </View>
              </TouchableOpacity>
            ))}
            {/* Clinic location */}
            {availablePhysical && (
              <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 }}>🏥 Clinic / Office Location</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 16 }}>Required for physical appointments</Text>
                {[{ label: 'Clinic / Hospital Name', value: clinicName, setter: setClinicName, placeholder: 'e.g. HealthPlus Medical Centre' }, { label: 'Street Address', value: clinicAddress, setter: setClinicAddress, placeholder: 'e.g. 45 Independence Avenue' }, { label: 'City', value: clinicCity, setter: setClinicCity, placeholder: 'e.g. Accra, London' }, { label: 'Country', value: clinicCountry, setter: setClinicCountry, placeholder: 'e.g. Ghana, UK' }, { label: 'Clinic Phone', value: clinicPhone, setter: setClinicPhone, placeholder: 'Direct clinic number', keyboard: 'phone-pad' }, { label: 'Clinic Email', value: clinicEmail, setter: setClinicEmail, placeholder: 'Clinic email address', keyboard: 'email-address' }].map((field) => (
                  <View key={field.label} style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                    <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.white }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
                  </View>
                ))}
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Directions / Landmarks</Text>
                  <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.white, minHeight: 80, textAlignVertical: 'top' }} placeholder="e.g. Next to the Mall, 2nd floor, Room 204..." value={directionsNotes} onChangeText={setDirectionsNotes} multiline />
                </View>
              </View>
            )}
            <TouchableOpacity style={{ backgroundColor: savingProfile ? COLORS.gray : COLORS.secondary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 }} onPress={saveProfile} disabled={savingProfile}>
              {savingProfile ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Save Profile ✅</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => setEditingProfile(false)}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setEditingProfile(true)}>
            <Text style={{ fontSize: 18 }}>✏️</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Edit Professional Profile</Text>
          </TouchableOpacity>
        )}
        {/* Legal contact */}
        <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 4 }}>📧 Legal & Privacy Contact</Text>
          <Text style={{ fontSize: 13, color: COLORS.primary }}>hello@reinecare.com</Text>
        </View>
        {/* Logout */}
        <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log Out', style: 'destructive', onPress: onLogout }])}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#991B1B' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── MAIN RETURN ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'appointments' && renderDoctorAppointments()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'referrals' && renderReferrals()}
        {activeTab === 'performance' && (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.secondary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📈 My Performance</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Track your growth and patient satisfaction</Text>
            </View>
            <DoctorPerformanceDashboard doctorId={user.id} doctorName={profile?.full_name} />
          </View>
        )}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'profile' && renderProfile()}
      </View>
      {/* Bottom tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, maxHeight: 70 }} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={{ alignItems: 'center', paddingHorizontal: 16 }} onPress={() => setActiveTab(tab.id)}>
              <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.secondary, borderRadius: 2, marginBottom: 6 }} />
              <Text style={{ fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2 }}>{tab.icon}</Text>
              <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.secondary : COLORS.gray }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
// ─── PHARMACY DASHBOARD ───────────────────────────────────────────────────────
function PharmacyDashboard({ user, profile, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [pharmacyProfile, setPharmacyProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [minOrder, setMinOrder] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('pending');
  const [medications, setMedications] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [medName, setMedName] = useState('');
  const [medCategory, setMedCategory] = useState('');
  const [medPrice, setMedPrice] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medRequiresPrescription, setMedRequiresPrescription] = useState(false);
  const [savingMed, setSavingMed] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'inventory', icon: '💊', label: 'Inventory' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  useEffect(() => { fetchPharmacyProfile(); }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'inventory') fetchMedications();
    if (activeTab === 'earnings') fetchEarnings();
  }, [activeTab, orderFilter]);

  const fetchPharmacyProfile = async () => {
    try {
      const { data } = await supabase.from('pharmacy_profiles').select('*').eq('id', user.id).single();
      if (data) {
        setPharmacyProfile(data);
        setPharmacyName(data.pharmacy_name || '');
        setLicenseNumber(data.license_number || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
        setOpeningTime(data.opening_time || '08:00');
        setClosingTime(data.closing_time || '20:00');
        setDeliveryAvailable(data.delivery_available ?? true);
        setMinOrder(data.min_order?.toString() || '');
        setDeliveryFee(data.delivery_fee?.toString() || '');
      }
    } catch (error) { console.log('Error fetching pharmacy profile:', error.message); }
  };

  const saveProfile = async () => {
    if (!pharmacyName) { Alert.alert('Missing Info', 'Please enter pharmacy name'); return; }
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('pharmacy_profiles').upsert({ id: user.id, pharmacy_name: pharmacyName, license_number: licenseNumber, address, phone, opening_time: openingTime, closing_time: closingTime, delivery_available: deliveryAvailable, min_order: parseFloat(minOrder) || 0, delivery_fee: parseFloat(deliveryFee) || 0, profile_complete: true });
      if (error) throw error;
      Alert.alert('Profile Updated! ✅', 'Your pharmacy profile has been saved.');
      setEditingProfile(false);
      fetchPharmacyProfile();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingProfile(false); }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      let query = supabase.from('delivery_orders').select('*').eq('pharmacy_id', user.id).order('created_at', { ascending: false });
      if (orderFilter !== 'all') query = query.eq('status', orderFilter);
      const { data } = await query;
      setOrders(data || []);
    } catch (error) { console.log('Error fetching orders:', error.message); } finally { setLoadingOrders(false); }
  };

  const updateOrderStatus = async (orderId, status, patientId) => {
    try {
      await supabase.from('delivery_orders').update({ status }).eq('id', orderId);
      await supabase.from('notifications').insert({ user_id: patientId, title: status === 'preparing' ? '🔧 Order Being Prepared' : status === 'out_for_delivery' ? '🚚 Order Out for Delivery' : '✅ Order Delivered!', message: status === 'delivered' ? 'Your medication order has been delivered!' : `Your order status: ${status.replace('_', ' ')}`, type: 'general' });
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const fetchMedications = async () => {
    setLoadingMeds(true);
    try {
      const { data } = await supabase.from('medications').select('*').eq('pharmacy_id', user.id).order('created_at', { ascending: false });
      setMedications(data || []);
    } catch (error) { console.log('Error fetching medications:', error.message); } finally { setLoadingMeds(false); }
  };

  const addMedication = async () => {
    if (!medName || !medPrice) { Alert.alert('Missing Info', 'Please enter medication name and price'); return; }
    setSavingMed(true);
    try {
      const { error } = await supabase.from('medications').insert({ pharmacy_id: user.id, name: medName, category: medCategory, price: parseFloat(medPrice) || 0, stock_quantity: parseInt(medStock) || 0, requires_prescription: medRequiresPrescription, is_available: true });
      if (error) throw error;
      setMedName(''); setMedCategory(''); setMedPrice(''); setMedStock(''); setMedRequiresPrescription(false); setShowAddMed(false);
      fetchMedications();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingMed(false); }
  };

  const toggleMedAvailability = async (medId, current) => {
    try {
      await supabase.from('medications').update({ is_available: !current }).eq('id', medId);
      fetchMedications();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const deleteMedication = async (medId) => {
    Alert.alert('Delete Medication', 'Remove this medication from inventory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await supabase.from('medications').delete().eq('id', medId); fetchMedications(); } }
    ]);
  };

  const fetchEarnings = async () => {
    setLoadingEarnings(true);
    try {
      const { data } = await supabase.from('delivery_orders').select('*').eq('pharmacy_id', user.id).eq('status', 'delivered').order('created_at', { ascending: false });
      setEarnings(data || []);
    } catch (error) { console.log('Error fetching earnings:', error.message); } finally { setLoadingEarnings(false); }
  };

  if (showNotifications) return <NotificationsScreen userId={user.id} onBack={() => setShowNotifications(false)} />;

  const renderHome = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Good day 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{pharmacyProfile?.pharmacy_name || profile?.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{pharmacyProfile?.address || 'Complete your profile'}</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>
      <BroadcastBanner userRole="pharmacy" />
      <View style={{ padding: 24 }}>
        {!pharmacyProfile?.profile_complete && (
          <TouchableOpacity style={{ backgroundColor: '#FEF3C7', borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }} onPress={() => { setActiveTab('profile'); setEditingProfile(true); }}>
            <Text style={{ fontSize: 24 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#92400E' }}>Complete Your Profile</Text>
              <Text style={{ fontSize: 12, color: '#92400E' }}>Complete your profile to start receiving orders</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#92400E' }}>›</Text>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[{ icon: '📦', label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, color: '#FEF3C7', textColor: '#92400E' }, { icon: '💰', label: 'Total Delivered', value: earnings.length, color: '#D1FAE5', textColor: '#065F46' }, { icon: '💊', label: 'Products', value: medications.length, color: '#DBEAFE', textColor: '#1E40AF' }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 14, padding: 14, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: stat.textColor, textAlign: 'center' }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {[{ icon: '📦', label: 'View Orders', desc: 'Manage incoming orders', tab: 'orders' }, { icon: '💊', label: 'Inventory', desc: 'Manage your medications', tab: 'inventory' }].map((item) => (
          <TouchableOpacity key={item.tab} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2, marginBottom: 12 }} onPress={() => setActiveTab(item.tab)}>
            <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.label}</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.desc}</Text>
            </View>
            <Text style={{ fontSize: 20, color: COLORS.textLight }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderOrders = () => {
    if (selectedOrder) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => setSelectedOrder(null)} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Orders</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>Order Details</Text>
          </View>
          <View style={{ padding: 24 }}>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Order Summary</Text>
                <View style={{ backgroundColor: selectedOrder.status === 'delivered' ? '#D1FAE5' : selectedOrder.status === 'preparing' ? '#DBEAFE' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: selectedOrder.status === 'delivered' ? '#065F46' : selectedOrder.status === 'preparing' ? '#1E40AF' : '#92400E', textTransform: 'capitalize' }}>{selectedOrder.status?.replace('_', ' ')}</Text>
                </View>
              </View>
              {selectedOrder.items?.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                  <Text style={{ fontSize: 13, color: COLORS.text }}>{item.name} x{item.quantity}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>Total</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.accent }}>${selectedOrder.total_amount?.toFixed(2)}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>📍 Delivery Details</Text>
              <Text style={{ fontSize: 14, color: COLORS.text }}>{selectedOrder.delivery_address}</Text>
              {selectedOrder.delivery_notes && <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6, fontStyle: 'italic' }}>{selectedOrder.delivery_notes}</Text>}
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>Ordered: {new Date(selectedOrder.created_at).toLocaleString()}</Text>
            </View>
            {selectedOrder.status === 'pending' && (
              <View style={{ gap: 12 }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateOrderStatus(selectedOrder.id, 'preparing', selectedOrder.patient_id)}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>🔧 Start Preparing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateOrderStatus(selectedOrder.id, 'cancelled', selectedOrder.patient_id)}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.error }}>❌ Cancel Order</Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedOrder.status === 'preparing' && (
              <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateOrderStatus(selectedOrder.id, 'out_for_delivery', selectedOrder.patient_id)}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>🚚 Mark Out for Delivery</Text>
              </TouchableOpacity>
            )}
            {selectedOrder.status === 'out_for_delivery' && (
              <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }} onPress={() => updateOrderStatus(selectedOrder.id, 'delivered', selectedOrder.patient_id)}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>✅ Mark as Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📦 Orders</Text>
            <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['pending', 'preparing', 'out_for_delivery', 'delivered', 'all'].map((filter) => (
                <TouchableOpacity key={filter} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: orderFilter === filter ? COLORS.white : 'rgba(255,255,255,0.2)' }} onPress={() => setOrderFilter(filter)}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: orderFilter === filter ? COLORS.accent : COLORS.white, textTransform: 'capitalize' }}>{filter.replace('_', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {loadingOrders ? <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 40 }} /> : orders.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ fontSize: 50, marginBottom: 16 }}>📦</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>No Orders</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 6, textAlign: 'center' }}>Orders from patients will appear here</Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            {orders.map((order) => (
              <TouchableOpacity key={order.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }} onPress={() => setSelectedOrder(order)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>${order.total_amount?.toFixed(2)}</Text>
                  <View style={{ backgroundColor: order.status === 'delivered' ? '#D1FAE5' : order.status === 'preparing' ? '#DBEAFE' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: order.status === 'delivered' ? '#065F46' : order.status === 'preparing' ? '#1E40AF' : '#92400E', textTransform: 'capitalize' }}>{order.status?.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>📍 {order.delivery_address}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{new Date(order.created_at).toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderInventory = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💊 Inventory</Text>
          <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }} onPress={() => setShowAddMed(!showAddMed)}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{showAddMed ? '✕ Cancel' : '+ Add'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{medications.length} medications in stock</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {showAddMed && (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Add Medication</Text>
            {[{ label: 'Medication Name *', value: medName, setter: setMedName, placeholder: 'e.g. Paracetamol 500mg' }, { label: 'Category', value: medCategory, setter: setMedCategory, placeholder: 'e.g. Painkiller, Antibiotic' }, { label: 'Price ($) *', value: medPrice, setter: setMedPrice, placeholder: 'e.g. 5.99', keyboard: 'numeric' }, { label: 'Stock Quantity', value: medStock, setter: setMedStock, placeholder: 'Number of units', keyboard: 'numeric' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
              </View>
            ))}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 12, marginBottom: 16 }} onPress={() => setMedRequiresPrescription(!medRequiresPrescription)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>📋 Requires Prescription</Text>
              <View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: medRequiresPrescription ? COLORS.primary : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.white, alignSelf: medRequiresPrescription ? 'flex-end' : 'flex-start' }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: savingMed ? COLORS.gray : COLORS.accent, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={addMedication} disabled={savingMed}>
              {savingMed ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Add to Inventory ✅</Text>}
            </TouchableOpacity>
          </View>
        )}
        {loadingMeds ? <ActivityIndicator color={COLORS.accent} style={{ marginTop: 20 }} /> : medications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>💊</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>No Medications Yet</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>Add medications to your inventory</Text>
          </View>
        ) : medications.map((med) => (
          <View key={med.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 22 }}>💊</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{med.name}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textLight }}>{med.category} {med.requires_prescription ? '• 📋 Prescription' : ''}</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.accent }}>${med.price}</Text>
              </View>
              <View style={{ gap: 6 }}>
                <TouchableOpacity style={{ backgroundColor: med.is_available ? '#D1FAE5' : '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }} onPress={() => toggleMedAvailability(med.id, med.is_available)}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: med.is_available ? '#065F46' : '#991B1B' }}>{med.is_available ? '✅ In Stock' : '❌ Out of Stock'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }} onPress={() => deleteMedication(med.id)}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#991B1B' }}>🗑️ Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderEarnings = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💰 Earnings</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Revenue from delivered orders</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[{ label: 'Total Delivered', value: earnings.length, color: '#D1FAE5', textColor: '#065F46' }, { label: 'Total Revenue', value: `$${earnings.reduce((sum, o) => sum + (o.total_amount || 0), 0).toFixed(2)}`, color: COLORS.white, textColor: COLORS.text }].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 12, color: stat.textColor, marginTop: 4 }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {loadingEarnings ? <ActivityIndicator color={COLORS.accent} /> : earnings.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>💰</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>No Earnings Yet</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 6 }}>Completed deliveries will appear here</Text>
          </View>
        ) : earnings.map((order) => (
          <View key={order.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 22 }}>✅</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>${order.total_amount?.toFixed(2)}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textLight }}>{order.items?.length} items delivered</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(order.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.accent, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 44 }}>🏪</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{pharmacyProfile?.pharmacy_name || profile?.full_name}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{profile?.email}</Text>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {editingProfile ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>Edit Pharmacy Profile</Text>
            {[{ label: 'Pharmacy Name *', value: pharmacyName, setter: setPharmacyName, placeholder: 'Your pharmacy name' }, { label: 'License Number', value: licenseNumber, setter: setLicenseNumber, placeholder: 'Pharmacy license' }, { label: 'Address', value: address, setter: setAddress, placeholder: 'Full address' }, { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Contact number', keyboard: 'phone-pad' }, { label: 'Opening Time', value: openingTime, setter: setOpeningTime, placeholder: 'HH:MM e.g. 08:00' }, { label: 'Closing Time', value: closingTime, setter: setClosingTime, placeholder: 'HH:MM e.g. 20:00' }, { label: 'Minimum Order ($)', value: minOrder, setter: setMinOrder, placeholder: 'e.g. 10', keyboard: 'numeric' }, { label: 'Delivery Fee ($)', value: deliveryFee, setter: setDeliveryFee, placeholder: 'e.g. 5', keyboard: 'numeric' }].map((field) => (
              <View key={field.label} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>{field.label}</Text>
                <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
              </View>
            ))}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 16 }} onPress={() => setDeliveryAvailable(!deliveryAvailable)}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>🚀 Delivery Available</Text>
              <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: deliveryAvailable ? COLORS.success : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, alignSelf: deliveryAvailable ? 'flex-end' : 'flex-start' }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: savingProfile ? COLORS.gray : COLORS.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 10 }} onPress={saveProfile} disabled={savingProfile}>
              {savingProfile ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Save Profile ✅</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={() => setEditingProfile(false)}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.gray }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={{ backgroundColor: COLORS.accent, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 }} onPress={() => setEditingProfile(true)}>
            <Text style={{ fontSize: 18 }}>✏️</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.white }}>Edit Pharmacy Profile</Text>
          </TouchableOpacity>
        )}
        <View style={{ backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: 4 }}>📧 Legal & Privacy Contact</Text>
          <Text style={{ fontSize: 13, color: COLORS.primary }}>hello@reinecare.com</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => Alert.alert('Log Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log Out', style: 'destructive', onPress: onLogout }])}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#991B1B' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'profile' && renderProfile()}
      </View>
      <View style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', paddingBottom: 24, paddingTop: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={{ flex: 1, alignItems: 'center' }} onPress={() => setActiveTab(tab.id)}>
            <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.accent, borderRadius: 2, marginBottom: 6 }} />
            <Text style={{ fontSize: activeTab === tab.id ? 24 : 22, marginBottom: 2 }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.accent : COLORS.gray }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user, profile, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalPatients: 0, totalPharmacies: 0, totalBookings: 0, totalRevenue: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedAdminBooking, setSelectedAdminBooking] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [commissionRate, setCommissionRate] = useState(DEFAULT_COMMISSION_RATE);
  const [platformSettings, setPlatformSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [supportEmail, setSupportEmail] = useState('hello@reinecare.com');
  const [supportPhone, setSupportPhone] = useState('');
  const [platformDescription, setPlatformDescription] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minWithdrawal, setMinWithdrawal] = useState('10');
  const [maxWithdrawal, setMaxWithdrawal] = useState('10000');
  const [autoApprovePatients, setAutoApprovePatients] = useState(true);
  const [requireDoctorLicense, setRequireDoctorLicense] = useState(true);
  const [videoCallEnabled, setVideoCallEnabled] = useState(true);
  const [pharmacyEnabled, setPharmacyEnabled] = useState(true);
  const [termsVersion, setTermsVersion] = useState('1.0');
  const [privacyVersion, setPrivacyVersion] = useState('1.0');
  const [broadcasts, setBroadcasts] = useState([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('announcement');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastPinned, setBroadcastPinned] = useState(false);
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastExpiry, setBroadcastExpiry] = useState('7');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [videoStats, setVideoStats] = useState({ total: 0, active: 0, totalMinutes: 0 });
  const [selectedVerifyUser, setSelectedVerifyUser] = useState(null);
  const [verifyUserDoctorProfile, setVerifyUserDoctorProfile] = useState(null);
  const [verifyDocuments, setVerifyDocuments] = useState([]);
  const [loadingVerifyDetails, setLoadingVerifyDetails] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [riskLevel, setRiskLevel] = useState('low');
  const [addingDocument, setAddingDocument] = useState(false);
  const [docType, setDocType] = useState('medical_license');
  const [docName, setDocName] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [savingDoc, setSavingDoc] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'verify', icon: '✅', label: 'Verify' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'revenue', icon: '💹', label: 'Revenue' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'matching', icon: '🔗', label: 'Match' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  useEffect(() => {
    fetchPlatformStats();
    fetchCommissionRate();
    fetchPlatformSettings();
    fetchEmergencyAlerts();
    fetchVideoStats();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'verify') fetchPending();
    if (activeTab === 'bookings') fetchAllBookings();
    if (activeTab === 'payments') { fetchTransactions(); fetchWithdrawalRequests(); }
    if (activeTab === 'settings') { fetchPlatformSettings(); fetchBroadcasts(); }
  }, [activeTab]);

  const fetchPlatformStats = async () => {
    try {
      const [usersRes, bookingsRes, txRes] = await Promise.all([
        supabase.from('profiles').select('role'),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('transactions').select('commission_amount').eq('status', 'released'),
      ]);
      const users = usersRes.data || [];
      setStats({
        totalUsers: users.length,
        totalDoctors: users.filter(u => u.role === 'doctor').length,
        totalPatients: users.filter(u => u.role === 'patient').length,
        totalPharmacies: users.filter(u => u.role === 'pharmacy').length,
        totalBookings: bookingsRes.count || 0,
        totalRevenue: (txRes.data || []).reduce((sum, t) => sum + t.commission_amount, 0),
      });
    } catch (error) { console.log('Error fetching stats:', error.message); }
  };

  const fetchCommissionRate = async () => {
    try {
      const { data } = await supabase.from('platform_settings').select('commission_rate').eq('id', 1).single();
      if (data) setCommissionRate(data.commission_rate || DEFAULT_COMMISSION_RATE);
    } catch (error) { console.log('Error fetching commission:', error.message); }
  };

  const updateCommissionRate = async (rate) => {
    try {
      await supabase.from('platform_settings').upsert({ id: 1, commission_rate: rate });
      setCommissionRate(rate);
      Alert.alert('Updated! ✅', `Commission rate set to ${rate}%`);
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const fetchPlatformSettings = async () => {
    setLoadingSettings(true);
    try {
      const { data } = await supabase.from('platform_settings').select('*').eq('id', 1).single();
      if (data) {
        setPlatformSettings(data);
        setSupportEmail(data.support_email || 'hello@reinecare.com');
        setSupportPhone(data.support_phone || '');
        setPlatformDescription(data.platform_description || '');
        setMaintenanceMode(data.maintenance_mode ?? false);
        setMinWithdrawal(data.min_withdrawal_amount?.toString() || '10');
        setMaxWithdrawal(data.max_withdrawal_amount?.toString() || '10000');
        setAutoApprovePatients(data.auto_approve_patients ?? true);
        setRequireDoctorLicense(data.require_doctor_license ?? true);
        setVideoCallEnabled(data.video_call_enabled ?? true);
        setPharmacyEnabled(data.pharmacy_enabled ?? true);
        setTermsVersion(data.terms_version || '1.0');
        setPrivacyVersion(data.privacy_version || '1.0');
      }
    } catch (error) { console.log('Error fetching settings:', error.message); } finally { setLoadingSettings(false); }
  };

  const savePlatformSettings = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('platform_settings').update({ support_email: supportEmail, support_phone: supportPhone, platform_description: platformDescription, maintenance_mode: maintenanceMode, min_withdrawal_amount: parseFloat(minWithdrawal) || 10, max_withdrawal_amount: parseFloat(maxWithdrawal) || 10000, auto_approve_patients: autoApprovePatients, require_doctor_license: requireDoctorLicense, video_call_enabled: videoCallEnabled, pharmacy_enabled: pharmacyEnabled, terms_version: termsVersion, privacy_version: privacyVersion, updated_at: new Date().toISOString() }).eq('id', 1);
      if (error) throw error;
      Alert.alert('Settings Saved! ✅', 'Platform settings have been updated successfully.');
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingSettings(false); }
  };

  const fetchEmergencyAlerts = async () => {
    try {
      const { data } = await supabase.from('emergency_alerts').select('*').eq('status', 'active').order('created_at', { ascending: false });
      setEmergencyAlerts(data || []);
    } catch (error) { console.log('Error fetching alerts:', error.message); }
  };

  const fetchVideoStats = async () => {
    try {
      const { data } = await supabase.from('video_sessions').select('status, duration_seconds');
      const sessions = data || [];
      setVideoStats({ total: sessions.length, active: sessions.filter(s => s.status === 'active').length, totalMinutes: Math.round(sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60) });
    } catch (error) { console.log('Error fetching video stats:', error.message); }
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('profiles').select('*').eq('verification_status', 'pending').in('role', ['doctor', 'pharmacy']).order('created_at', { ascending: false });
      setPendingUsers(data || []);
    } catch (error) { console.log('Error fetching pending:', error.message); } finally { setLoading(false); }
  };

  const handleVerify = async (userId, action) => {
    try {
      await supabase.from('profiles').update({ verification_status: action, is_verified: action === 'approved', verification_date: new Date().toLocaleDateString() }).eq('id', userId);
      await supabase.from('notifications').insert({ user_id: userId, title: action === 'approved' ? '✅ Account Approved!' : '❌ Account Not Approved', message: action === 'approved' ? 'Your account has been verified. You can now start accepting patients!' : 'Your account verification was not approved. Please contact support.', type: 'verification' });
      Alert.alert('Done! ✅', `User has been ${action}`);
      fetchPending();
      fetchPlatformStats();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const fetchVerificationDetails = async (userId) => {
    setLoadingVerifyDetails(true);
    try {
      const [doctorRes, docsRes] = await Promise.all([
        supabase.from('doctor_profiles').select('*').eq('id', userId).single(),
        supabase.from('verification_documents').select('*').eq('doctor_id', userId).order('created_at', { ascending: false }),
      ]);
      setVerifyUserDoctorProfile(doctorRes.data);
      setVerifyDocuments(docsRes.data || []);
      setVerificationNotes(doctorRes.data?.verification_notes || '');
      setRiskLevel(doctorRes.data?.risk_level || 'low');
    } catch (error) { console.log('Error fetching verification details:', error.message); } finally { setLoadingVerifyDetails(false); }
  };

  const saveVerificationNotes = async (userId) => {
    try {
      await supabase.from('doctor_profiles').update({ verification_notes: verificationNotes, risk_level: riskLevel }).eq('id', userId);
      Alert.alert('Saved! ✅', 'Verification notes updated');
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const addVerificationDocument = async (userId) => {
    if (!docName) { Alert.alert('Missing Info', 'Please enter document name'); return; }
    setSavingDoc(true);
    try {
      await supabase.from('verification_documents').insert({ doctor_id: userId, document_type: docType, document_name: docName, notes: docNotes, verified: false });
      setDocName(''); setDocNotes(''); setAddingDocument(false);
      fetchVerificationDetails(userId);
    } catch (error) { Alert.alert('Error', error.message); } finally { setSavingDoc(false); }
  };

  const verifyDocument = async (docId, userId) => {
    try {
      await supabase.from('verification_documents').update({ verified: true, verified_at: new Date().toISOString() }).eq('id', docId);
      fetchVerificationDetails(userId);
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const handleVerifyWithNotes = async (userId, action) => {
    try {
      const updateData = { verification_status: action, is_verified: action === 'approved', verification_date: new Date().toLocaleDateString() };
      if (action === 'rejected' && rejectionReason) updateData.rejection_reason = rejectionReason;
      await supabase.from('profiles').update(updateData).eq('id', userId);
      await supabase.from('notifications').insert({ user_id: userId, title: action === 'approved' ? '✅ Account Approved!' : '❌ Account Not Approved', message: action === 'approved' ? 'Your account has been verified. You can now start accepting patients!' : `Your account was not approved. Reason: ${rejectionReason || 'Please contact support'}`, type: 'verification' });
      Alert.alert('Done! ✅', `Doctor has been ${action}`);
      setSelectedVerifyUser(null);
      fetchPending();
      fetchPlatformStats();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(100);
      setAllBookings(data || []);
    } catch (error) { console.log('Error fetching bookings:', error.message); } finally { setLoadingBookings(false); }
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setAllUsers(data || []);
    } catch (error) { console.log('Error fetching users:', error.message); } finally { setLoadingUsers(false); }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(50);
      setTransactions(data || []);
    } catch (error) { console.log('Error fetching transactions:', error.message); } finally { setLoadingTransactions(false); }
  };

  const fetchWithdrawalRequests = async () => {
    setLoadingWithdrawals(true);
    try {
      const { data } = await supabase.from('withdrawal_requests').select('*, profiles!withdrawal_requests_doctor_id_fkey(full_name, email)').order('created_at', { ascending: false });
      setWithdrawalRequests(data || []);
    } catch (error) { console.log('Error fetching withdrawals:', error.message); } finally { setLoadingWithdrawals(false); }
  };

  const processWithdrawal = async (requestId, status, doctorId) => {
    try {
      await supabase.from('withdrawal_requests').update({ status, processed_at: new Date().toISOString() }).eq('id', requestId);
      await supabase.from('notifications').insert({ user_id: doctorId, title: status === 'paid' ? '💰 Withdrawal Paid!' : '❌ Withdrawal Rejected', message: status === 'paid' ? 'Your withdrawal request has been processed and paid!' : 'Your withdrawal request was rejected. Please contact admin.', type: 'payment' });
      Alert.alert('Updated! ✅', `Withdrawal has been marked as ${status}`);
      fetchWithdrawalRequests();
    } catch (error) { Alert.alert('Error', error.message); }
  };

  const releasePayment = async (bookingId, doctorId, patientId, amount) => {
    Alert.alert('Release Payment', `Release $${amount} to doctor?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Release', onPress: async () => {
          try {
            const commissionAmount = amount * (commissionRate / 100);
            const doctorAmount = amount - commissionAmount;
            await supabase.from('transactions').insert({ booking_id: bookingId, doctor_id: doctorId, patient_id: patientId, total_amount: amount, commission_amount: commissionAmount, doctor_amount: doctorAmount, commission_rate: commissionRate, status: 'released', type: 'appointment' });
            await supabase.from('bookings').update({ payment_status: 'released' }).eq('id', bookingId);
            await supabase.from('notifications').insert({ user_id: doctorId, title: '💰 Payment Released!', message: `$${doctorAmount.toFixed(2)} has been added to your balance (${commissionRate}% commission deducted)`, type: 'payment' });
            Alert.alert('Payment Released! ✅', `$${doctorAmount.toFixed(2)} released to doctor`);
            fetchAllBookings();
          } catch (error) { Alert.alert('Error', error.message); }
        }
      }
    ]);
  };

  const fetchBroadcasts = async () => {
    setLoadingBroadcasts(true);
    try {
      const { data } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
      setBroadcasts(data || []);
    } catch (error) { console.log('Error fetching broadcasts:', error.message); } finally { setLoadingBroadcasts(false); }
  };

  const sendBroadcast = async () => {
    if (!broadcastTitle || !broadcastMessage) { Alert.alert('Missing Info', 'Please fill in title and message'); return; }
    setSendingBroadcast(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(broadcastExpiry || 7));
      const { error } = await supabase.from('broadcasts').insert({ title: broadcastTitle, message: broadcastMessage, type: broadcastType, target_audience: broadcastTarget, is_pinned: broadcastPinned, action_text: broadcastActionText || null, created_by: user.id, expires_at: expiryDate.toISOString(), sent_count: allUsers.length });
      if (error) throw error;
      const targetUsers = broadcastTarget === 'all' ? allUsers : allUsers.filter(u => u.role === broadcastTarget.replace('s', ''));
      if (targetUsers.length > 0) {
        const notifications = targetUsers.map(u => ({ user_id: u.id, title: `📢 ${broadcastTitle}`, message: broadcastMessage, type: 'general' }));
        await supabase.from('notifications').insert(notifications);
      }
      Alert.alert('Broadcast Sent! ✅', `Announcement published to ${targetUsers.length} users`);
      setBroadcastTitle(''); setBroadcastMessage(''); setBroadcastType('announcement'); setBroadcastTarget('all'); setBroadcastPinned(false); setBroadcastActionText(''); setShowBroadcastForm(false);
      fetchBroadcasts();
    } catch (error) { Alert.alert('Error', error.message); } finally { setSendingBroadcast(false); }
  };

  const deleteBroadcast = async (broadcastId) => {
    Alert.alert('Delete Broadcast', 'Remove this announcement?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await supabase.from('broadcasts').delete().eq('id', broadcastId); fetchBroadcasts(); } }
    ]);
  };

  if (showNotifications) return <NotificationsScreen userId={user.id} onBack={() => setShowNotifications(false)} />;

  // ── RENDER HOME ───────────────────────────────────────────────────────────────
  const renderHome = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Admin Panel 🔑</Text>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>ReineCare Platform Admin</Text>
          </View>
          <NotificationBell userId={user.id} onPress={() => setShowNotifications(true)} />
        </View>
      </View>
      <View style={{ padding: 24 }}>
        {/* Emergency alerts */}
        {emergencyAlerts.length > 0 && (
          <View style={{ backgroundColor: '#FEE2E2', borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#991B1B', marginBottom: 12 }}>🆘 Active Emergency Alerts ({emergencyAlerts.length})</Text>
            {emergencyAlerts.map((alert) => (
              <View key={alert.id} style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#991B1B' }}>🆘 {alert.patient_name} — {alert.emergency_type?.replace('_', ' ')}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>{alert.message}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>{new Date(alert.created_at).toLocaleString()}</Text>
                    {alert.location_lat && <Text style={{ fontSize: 11, color: '#991B1B', marginTop: 2 }}>📍 {alert.location_lat?.toFixed(4)}, {alert.location_lng?.toFixed(4)}</Text>}
                  </View>
                  <TouchableOpacity style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }} onPress={async () => { await supabase.from('emergency_alerts').update({ status: 'acknowledged' }).eq('id', alert.id); fetchEmergencyAlerts(); }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065F46' }}>✓ Acknowledge</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Video call stats */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>📹 Video Consultations</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[{ label: 'Total Sessions', value: videoStats.total, color: COLORS.primaryLight, textColor: COLORS.primary, icon: '📹' }, { label: 'Active Now', value: videoStats.active, color: '#D1FAE5', textColor: '#065F46', icon: '🟢' }, { label: 'Total Minutes', value: videoStats.totalMinutes, color: '#EDE9FE', textColor: '#5B21B6', icon: '⏱️' }].map((stat) => (
              <View key={stat.label} style={{ flex: 1, backgroundColor: stat.color, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
                <Text style={{ fontSize: 9, color: stat.textColor, textAlign: 'center', marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Platform stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {[{ icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#DBEAFE', textColor: '#1E40AF' }, { icon: '👨‍⚕️', label: 'Doctors', value: stats.totalDoctors, color: '#D1FAE5', textColor: '#065F46' }, { icon: '🙋', label: 'Patients', value: stats.totalPatients, color: '#EDE9FE', textColor: '#5B21B6' }, { icon: '🏪', label: 'Pharmacies', value: stats.totalPharmacies, color: '#FEF3C7', textColor: '#92400E' }, { icon: '📅', label: 'Bookings', value: stats.totalBookings, color: '#FEE2E2', textColor: '#991B1B' }, { icon: '💰', label: 'Revenue (15%)', value: `$${stats.totalRevenue.toFixed(0)}`, color: '#D1FAE5', textColor: '#065F46' }].map((stat) => (
            <View key={stat.label} style={{ width: '47%', backgroundColor: stat.color, borderRadius: 14, padding: 16 }}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: stat.textColor }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: stat.textColor }}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {/* Commission control */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>💹 Commission Rate</Text>
          <Text style={{ fontSize: 13, color: COLORS.textLight, marginBottom: 14 }}>Current: {commissionRate}% per transaction</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[5, 10, 15, 20].map((rate) => (
              <TouchableOpacity key={rate} style={{ flex: 1, borderWidth: 2, borderColor: commissionRate === rate ? COLORS.admin : COLORS.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: commissionRate === rate ? COLORS.admin : COLORS.white }} onPress={() => updateCommissionRate(rate)}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: commissionRate === rate ? COLORS.white : COLORS.gray }}>{rate}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // ── RENDER VERIFY ─────────────────────────────────────────────────────────────
  const renderVerify = () => {
    if (selectedVerifyUser) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
            <TouchableOpacity onPress={() => { setSelectedVerifyUser(null); setVerifyUserDoctorProfile(null); }} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>← Back to Pending</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <Text style={{ fontSize: 30 }}>{selectedVerifyUser.role === 'doctor' ? '👨‍⚕️' : '🏪'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.white }}>{selectedVerifyUser.full_name}</Text>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' }}>{selectedVerifyUser.role}</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{selectedVerifyUser.email}</Text>
              </View>
            </View>
          </View>
          <View style={{ padding: 24 }}>
            {loadingVerifyDetails ? <ActivityIndicator size="large" color={COLORS.admin} style={{ marginTop: 20 }} /> : (
              <>
                <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>⚠️ Risk Assessment</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {[{ id: 'low', label: '🟢 Low Risk', color: '#D1FAE5', textColor: '#065F46' }, { id: 'medium', label: '🟡 Medium', color: '#FEF3C7', textColor: '#92400E' }, { id: 'high', label: '🔴 High Risk', color: '#FEE2E2', textColor: '#991B1B' }].map((level) => (
                      <TouchableOpacity key={level.id} style={{ flex: 1, borderWidth: 2, borderColor: riskLevel === level.id ? level.textColor : COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: riskLevel === level.id ? level.color : COLORS.white }} onPress={() => setRiskLevel(level.id)}>
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: riskLevel === level.id ? level.textColor : COLORS.gray }}>{level.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>👤 Account Information</Text>
                  {[{ label: 'Full Name', value: selectedVerifyUser.full_name || 'Not set' }, { label: 'Email', value: selectedVerifyUser.email }, { label: 'Role', value: selectedVerifyUser.role }, { label: 'Joined', value: new Date(selectedVerifyUser.created_at).toLocaleDateString() }, { label: 'Phone', value: selectedVerifyUser.phone || 'Not set' }].map((item) => (
                    <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
                    </View>
                  ))}
                </View>
                {verifyUserDoctorProfile && (
                  <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>👨‍⚕️ Medical Profile</Text>
                    {[{ label: 'Specialty', value: verifyUserDoctorProfile.specialty || '❌ Not Set', important: !verifyUserDoctorProfile.specialty }, { label: 'Qualification', value: verifyUserDoctorProfile.qualification || '❌ Not Set', important: !verifyUserDoctorProfile.qualification }, { label: 'License Number', value: verifyUserDoctorProfile.license_number || '❌ Not Set', important: !verifyUserDoctorProfile.license_number }, { label: 'Experience', value: verifyUserDoctorProfile.experience_years ? `${verifyUserDoctorProfile.experience_years} years` : '❌ Not Set' }, { label: 'Profile Complete', value: verifyUserDoctorProfile.profile_complete ? '✅ Yes' : '❌ No', important: !verifyUserDoctorProfile.profile_complete }].map((item) => (
                      <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: item.important ? '#FEF3C7' : 'transparent', paddingHorizontal: item.important ? 8 : 0, borderRadius: item.important ? 6 : 0 }}>
                        <Text style={{ fontSize: 13, color: COLORS.textLight, flex: 1 }}>{item.label}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: item.important ? '#92400E' : COLORS.text, flex: 2, textAlign: 'right' }}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>📄 Verification Documents</Text>
                    <TouchableOpacity style={{ backgroundColor: COLORS.admin, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }} onPress={() => setAddingDocument(!addingDocument)}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.white }}>{addingDocument ? 'Cancel' : '➕ Add'}</Text>
                    </TouchableOpacity>
                  </View>
                  {addingDocument && (
                    <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Document Type</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          {['medical_license', 'degree', 'id_card', 'specialty_certificate', 'insurance'].map((type) => (
                            <TouchableOpacity key={type} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: docType === type ? COLORS.admin : COLORS.border, backgroundColor: docType === type ? COLORS.admin : COLORS.white }} onPress={() => setDocType(type)}>
                              <Text style={{ fontSize: 11, fontWeight: '600', color: docType === type ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{type.replace('_', ' ')}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                      {[{ label: 'Document Name *', value: docName, setter: setDocName, placeholder: 'e.g. Medical License #12345' }, { label: 'Notes', value: docNotes, setter: setDocNotes, placeholder: 'Admin notes...' }].map((field) => (
                        <View key={field.label} style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                          <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, fontSize: 14, backgroundColor: COLORS.white }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} />
                        </View>
                      ))}
                      <TouchableOpacity style={{ backgroundColor: savingDoc ? COLORS.gray : COLORS.admin, borderRadius: 10, paddingVertical: 12, alignItems: 'center' }} onPress={() => addVerificationDocument(selectedVerifyUser.id)} disabled={savingDoc}>
                        {savingDoc ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Add Document</Text>}
                      </TouchableOpacity>
                    </View>
                  )}
                  {verifyDocuments.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                      <Text style={{ fontSize: 30, marginBottom: 8 }}>📄</Text>
                      <Text style={{ fontSize: 13, color: COLORS.textLight }}>No documents added yet</Text>
                    </View>
                  ) : verifyDocuments.map((doc) => (
                    <View key={doc.id} style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 }}>{doc.document_name}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.textLight, textTransform: 'capitalize', marginBottom: 4 }}>{doc.document_type?.replace('_', ' ')}</Text>
                          {doc.notes && <Text style={{ fontSize: 12, color: COLORS.textLight, fontStyle: 'italic' }}>{doc.notes}</Text>}
                        </View>
                        {!doc.verified ? (
                          <TouchableOpacity style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }} onPress={() => verifyDocument(doc.id, selectedVerifyUser.id)}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065F46' }}>✓ Verify</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065F46' }}>✅ Verified</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>📝 Admin Notes</Text>
                  <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: COLORS.lightGray, minHeight: 100, textAlignVertical: 'top', marginBottom: 12 }} placeholder="Internal notes about this verification..." value={verificationNotes} onChangeText={setVerificationNotes} multiline />
                  <TouchableOpacity style={{ backgroundColor: COLORS.secondary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={() => saveVerificationNotes(selectedVerifyUser.id)}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>Save Notes</Text>
                  </TouchableOpacity>
                </View>
                {selectedVerifyUser.verification_status === 'pending' && (
                  <View style={{ backgroundColor: '#FEE2E2', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#991B1B', marginBottom: 8 }}>❌ Rejection Reason (if rejecting)</Text>
                    <TextInput style={{ borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, fontSize: 14, backgroundColor: COLORS.white, marginBottom: 12 }} placeholder="Reason for rejection..." value={rejectionReason} onChangeText={setRejectionReason} />
                  </View>
                )}
                {selectedVerifyUser.verification_status === 'pending' && (
                  <View style={{ gap: 12, marginBottom: 24 }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => Alert.alert('Approve Doctor', `Approve ${selectedVerifyUser.full_name}?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Approve', onPress: () => handleVerifyWithNotes(selectedVerifyUser.id, 'approved') }])}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>✅ Approve Doctor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }} onPress={() => Alert.alert('Reject Application', `Reject ${selectedVerifyUser.full_name}?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Reject', style: 'destructive', onPress: () => handleVerifyWithNotes(selectedVerifyUser.id, 'rejected') }])}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.error }}>❌ Reject Application</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#FEF3C7', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }} onPress={async () => { await supabase.from('notifications').insert({ user_id: selectedVerifyUser.id, title: '📋 Additional Documents Required', message: verificationNotes || 'Please provide additional documentation to complete your verification.', type: 'verification' }); Alert.alert('Request Sent! ✅', 'The applicant has been notified to provide more documents.'); }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#92400E' }}>📋 Request More Documents</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      );
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>Verify Users ✅</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{pendingUsers.length} pending application{pendingUsers.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={{ padding: 24 }}>
          {loading ? <ActivityIndicator size="large" color={COLORS.admin} style={{ marginTop: 40 }} /> : pendingUsers.length === 0 ? (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>✅</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No pending applications</Text>
            </View>
          ) : pendingUsers.map((u) => (
            <View key={u.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Text style={{ fontSize: 24 }}>{u.role === 'doctor' ? '👨‍⚕️' : '🏪'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>{u.full_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{u.email}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                    <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 11, color: '#92400E', textTransform: 'capitalize' }}>{u.role}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>Applied {new Date(u.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }} onPress={() => { setSelectedVerifyUser(u); fetchVerificationDetails(u.id); }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.secondary }}>🔍 View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#D1FAE5', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }} onPress={() => handleVerify(u.id, 'approved')}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#065F46' }}>✅ Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }} onPress={() => handleVerify(u.id, 'rejected')}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#991B1B' }}>❌ Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );​​​​​​​​​​​​​​​​
  };

  // ── RENDER ADMIN BOOKINGS ─────────────────────────────────────────────────────
  const renderAdminBookings = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📅 All Bookings</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{allBookings.length} total bookings</Text>
      </View>
      {loadingBookings ? <ActivityIndicator size="large" color={COLORS.admin} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={allBookings}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>No bookings yet</Text>
            </View>
          )}
          renderItem={({ item: booking }) => (
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{booking.patient_name}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary }}>Dr. {booking.doctor_name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{booking.preferred_date} at {booking.preferred_time}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>{booking.session_type === 'video' ? '📹 Video' : '🏥 Physical'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <View style={{ backgroundColor: booking.status === 'completed' ? '#D1FAE5' : booking.status === 'confirmed' ? '#DBEAFE' : booking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: booking.status === 'completed' ? '#065F46' : booking.status === 'confirmed' ? '#1E40AF' : booking.status === 'cancelled' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{booking.status}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.secondary }}>${booking.amount}</Text>
                </View>
              </View>
              {booking.status === 'completed' && booking.payment_status !== 'released' && (
                <TouchableOpacity style={{ backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }} onPress={() => releasePayment(booking.id, booking.doctor_id, booking.patient_id, booking.amount)}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>💰 Release Payment (${(booking.amount * (1 - commissionRate / 100)).toFixed(2)} to doctor)</Text>
                </TouchableOpacity>
              )}
              {booking.payment_status === 'released' && (
                <View style={{ backgroundColor: '#D1FAE5', borderRadius: 12, paddingVertical: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#065F46' }}>✅ Payment Released</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  // ── RENDER PAYMENTS ───────────────────────────────────────────────────────────
  const renderPayments = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>💰 Payments</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Transactions & withdrawal requests</Text>
      </View>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>💸 Withdrawal Requests</Text>
        {loadingWithdrawals ? <ActivityIndicator color={COLORS.admin} /> : withdrawalRequests.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>💸</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>No withdrawal requests yet</Text>
          </View>
        ) : withdrawalRequests.map((req) => (
          <View key={req.id} style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: req.status === 'paid' ? '#D1FAE5' : req.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 22 }}>{req.status === 'paid' ? '✅' : req.status === 'rejected' ? '❌' : '⏳'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{req.profiles?.full_name || 'Doctor'}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>${req.amount} via {req.payment_method?.replace('_', ' ')}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(req.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={{ backgroundColor: req.status === 'paid' ? '#D1FAE5' : req.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: req.status === 'paid' ? '#065F46' : req.status === 'rejected' ? '#991B1B' : '#92400E', textTransform: 'capitalize' }}>{req.status}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10, marginBottom: req.status === 'pending' ? 10 : 0 }}>
              {req.payment_method === 'bank_transfer' && [{ label: 'Bank', value: req.bank_name }, { label: 'Account', value: req.account_number }, { label: 'Name', value: req.account_name }].map((item) => item.value ? (
                <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>{item.label}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
                </View>
              ) : null)}
              {req.payment_method === 'mobile_money' && <Text style={{ fontSize: 12, color: COLORS.text }}>📱 {req.mobile_money_number}</Text>}
              {req.payment_method === 'paypal' && <Text style={{ fontSize: 12, color: COLORS.text }}>💳 {req.paypal_email}</Text>}
            </View>
            {req.status === 'pending' && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#D1FAE5', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => processWithdrawal(req.id, 'paid', req.doctor_id)}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#065F46' }}>✅ Mark Paid</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }} onPress={() => processWithdrawal(req.id, 'rejected', req.doctor_id)}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#991B1B' }}>❌ Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 14, marginTop: 8 }}>💳 Recent Transactions</Text>
        {loadingTransactions ? <ActivityIndicator color={COLORS.admin} /> : transactions.length === 0 ? (
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 30, alignItems: 'center', elevation: 2 }}>
            <Text style={{ fontSize: 30, marginBottom: 8 }}>💳</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>No transactions yet</Text>
          </View>
        ) : transactions.map((txn) => (
          <View key={txn.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>${txn.total_amount?.toFixed(2)}</Text>
              <View style={{ backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#065F46', textTransform: 'capitalize' }}>{txn.status}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[{ label: 'Doctor Gets', value: `$${txn.doctor_amount?.toFixed(2)}`, color: '#065F46' }, { label: `Commission (${txn.commission_rate}%)`, value: `$${txn.commission_amount?.toFixed(2)}`, color: COLORS.admin }].map((item) => (
                <View key={item.label} style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 8, padding: 8 }}>
                  <Text style={{ fontSize: 10, color: COLORS.textLight }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: item.color }}>{item.value}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 8 }}>{new Date(txn.created_at).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // ── RENDER USERS ──────────────────────────────────────────────────────────────
  const renderUsers = () => {
    const filtered = allUsers.filter(u => {
      const matchesSearch = u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 16, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>👥 All Users</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: 12 }}>{filtered.length} users</Text>
          <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput style={{ flex: 1, paddingVertical: 10, fontSize: 14 }} placeholder="Search by name or email..." placeholderTextColor={COLORS.textLight} value={userSearch} onChangeText={setUserSearch} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['all', 'patient', 'doctor', 'pharmacy', 'admin'].map((role) => (
                <TouchableOpacity key={role} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: userRoleFilter === role ? COLORS.white : 'rgba(255,255,255,0.2)' }} onPress={() => setUserRoleFilter(role)}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: userRoleFilter === role ? COLORS.admin : COLORS.white, textTransform: 'capitalize' }}>{role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {loadingUsers ? <ActivityIndicator size="large" color={COLORS.admin} style={{ marginTop: 40 }} /> : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>👥</Text>
                <Text style={{ fontSize: 16, color: COLORS.textLight }}>No users found</Text>
              </View>
            )}
            renderItem={({ item: u }) => (
              <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 22 }}>{u.role === 'doctor' ? '👨‍⚕️' : u.role === 'pharmacy' ? '🏪' : u.role === 'admin' ? '🔑' : '🙋'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{u.full_name || 'No Name'}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textLight }}>{u.email}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                      <View style={{ backgroundColor: u.role === 'doctor' ? '#D1FAE5' : u.role === 'pharmacy' ? '#FEF3C7' : COLORS.primaryLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: u.role === 'doctor' ? '#065F46' : u.role === 'pharmacy' ? '#92400E' : COLORS.primary, textTransform: 'capitalize' }}>{u.role}</Text>
                      </View>
                      {u.is_verified && <View style={{ backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, fontWeight: '600', color: '#065F46' }}>✅ Verified</Text></View>}
                      {u.verification_status === 'pending' && <View style={{ backgroundColor: '#FEF3C7', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontSize: 10, fontWeight: '600', color: '#92400E' }}>⏳ Pending</Text></View>}
                    </View>
                  </View>
                  <Text style={{ fontSize: 11, color: COLORS.textLight }}>{new Date(u.created_at).toLocaleDateString()}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  };

  // ── RENDER SETTINGS ───────────────────────────────────────────────────────────
  const renderSettings = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>⚙️ Platform Settings</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Configure ReineCare platform</Text>
      </View>
      <View style={{ padding: 24 }}>
        {loadingSettings ? <ActivityIndicator size="large" color={COLORS.admin} style={{ marginTop: 20 }} /> : (
          <>
            {/* General settings */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🌐 General Settings</Text>
              {[{ label: 'Support Email', value: supportEmail, setter: setSupportEmail, placeholder: 'hello@reinecare.com', keyboard: 'email-address' }, { label: 'Support Phone', value: supportPhone, setter: setSupportPhone, placeholder: '+1 234 567 8900', keyboard: 'phone-pad' }, { label: 'Platform Description', value: platformDescription, setter: setPlatformDescription, placeholder: 'Brief description of the platform' }, { label: 'Minimum Withdrawal ($)', value: minWithdrawal, setter: setMinWithdrawal, placeholder: 'e.g. 10', keyboard: 'numeric' }, { label: 'Maximum Withdrawal ($)', value: maxWithdrawal, setter: setMaxWithdrawal, placeholder: 'e.g. 10000', keyboard: 'numeric' }, { label: 'Terms Version', value: termsVersion, setter: setTermsVersion, placeholder: 'e.g. 1.0' }, { label: 'Privacy Version', value: privacyVersion, setter: setPrivacyVersion, placeholder: 'e.g. 1.0' }].map((field) => (
                <View key={field.label} style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                  <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.lightGray }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} keyboardType={field.keyboard || 'default'} />
                </View>
              ))}
            </View>
            {/* Feature toggles */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>⚙️ Feature Toggles</Text>
              {[{ label: '📹 Video Calls Enabled', value: videoCallEnabled, setter: setVideoCallEnabled }, { label: '💊 Pharmacy Module', value: pharmacyEnabled, setter: setPharmacyEnabled }, { label: '✅ Auto-Approve Patients', value: autoApprovePatients, setter: setAutoApprovePatients }, { label: '📋 Require Doctor License', value: requireDoctorLicense, setter: setRequireDoctorLicense }].map((toggle) => (
                <TouchableOpacity key={toggle.label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }} onPress={() => toggle.setter(!toggle.value)}>
                  <Text style={{ fontSize: 14, color: COLORS.text }}>{toggle.label}</Text>
                  <View style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: toggle.value ? COLORS.success : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, alignSelf: toggle.value ? 'flex-end' : 'flex-start' }} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {/* Maintenance mode */}
            <View style={{ backgroundColor: maintenanceMode ? '#FEE2E2' : COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: maintenanceMode ? 12 : 0 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: maintenanceMode ? '#991B1B' : COLORS.text }}>🔧 Maintenance Mode</Text>
                  <Text style={{ fontSize: 12, color: maintenanceMode ? '#991B1B' : COLORS.textLight, marginTop: 2 }}>Disables access for all users</Text>
                </View>
                <TouchableOpacity style={{ width: 56, height: 30, borderRadius: 15, backgroundColor: maintenanceMode ? COLORS.error : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }} onPress={() => setMaintenanceMode(!maintenanceMode)}>
                  <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.white, alignSelf: maintenanceMode ? 'flex-end' : 'flex-start' }} />
                </TouchableOpacity>
              </View>
              {maintenanceMode && (
                <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#991B1B' }}>⚠️ Warning: Maintenance mode is ON — users cannot access the platform!</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={{ backgroundColor: savingSettings ? COLORS.gray : COLORS.admin, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 20 }} onPress={savePlatformSettings} disabled={savingSettings}>
              {savingSettings ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.white }}>Save Settings ✅</Text>}
            </TouchableOpacity>
            {/* Broadcast system */}
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>📢 Broadcasts</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>Send announcements to users</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: COLORS.admin, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }} onPress={() => setShowBroadcastForm(!showBroadcastForm)}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.white }}>{showBroadcastForm ? '✕ Cancel' : '➕ New'}</Text>
                </TouchableOpacity>
              </View>
              {showBroadcastForm && (
                <View style={{ backgroundColor: COLORS.lightGray, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>New Broadcast</Text>
                  {[{ label: 'Title *', value: broadcastTitle, setter: setBroadcastTitle, placeholder: 'Announcement title' }, { label: 'Message *', value: broadcastMessage, setter: setBroadcastMessage, placeholder: 'Your message to users...', multiline: true }, { label: 'Action Button Text (optional)', value: broadcastActionText, setter: setBroadcastActionText, placeholder: 'e.g. Learn More' }].map((field) => (
                    <View key={field.label} style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>{field.label}</Text>
                      <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: COLORS.white, minHeight: field.multiline ? 70 : undefined, textAlignVertical: field.multiline ? 'top' : undefined }} placeholder={field.placeholder} value={field.value} onChangeText={field.setter} multiline={field.multiline} />
                    </View>
                  ))}
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {['announcement', 'maintenance', 'promotion', 'health_tip'].map((type) => (
                        <TouchableOpacity key={type} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: broadcastType === type ? COLORS.admin : COLORS.border, backgroundColor: broadcastType === type ? COLORS.admin : COLORS.white }} onPress={() => setBroadcastType(type)}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: broadcastType === type ? COLORS.white : COLORS.gray, textTransform: 'capitalize' }}>{type.replace('_', ' ')}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>Target Audience</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                    {[{ id: 'all', label: '👥 All' }, { id: 'patients', label: '🙋 Patients' }, { id: 'doctors', label: '👨‍⚕️ Doctors' }, { id: 'pharmacies', label: '🏪 Pharmacies' }].map((target) => (
                      <TouchableOpacity key={target.id} style={{ flex: 1, borderWidth: 2, borderColor: broadcastTarget === target.id ? COLORS.admin : COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: broadcastTarget === target.id ? COLORS.admin : COLORS.white }} onPress={() => setBroadcastTarget(target.id)}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: broadcastTarget === target.id ? COLORS.white : COLORS.gray }}>{target.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 }}>Expires in (days)</Text>
                      <TextInput style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, fontSize: 14, backgroundColor: COLORS.white }} placeholder="7" value={broadcastExpiry} onChangeText={setBroadcastExpiry} keyboardType="numeric" />
                    </View>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border }} onPress={() => setBroadcastPinned(!broadcastPinned)}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>📌 Pinned</Text>
                      <View style={{ width: 40, height: 24, borderRadius: 12, backgroundColor: broadcastPinned ? COLORS.admin : COLORS.border, justifyContent: 'center', paddingHorizontal: 2 }}>
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white, alignSelf: broadcastPinned ? 'flex-end' : 'flex-start' }} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: sendingBroadcast ? COLORS.gray : COLORS.admin, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }} onPress={sendBroadcast} disabled={sendingBroadcast}>
                    {sendingBroadcast ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>📢 Send Broadcast</Text>}
                  </TouchableOpacity>
                </View>
              )}
              {loadingBroadcasts ? <ActivityIndicator color={COLORS.admin} /> : broadcasts.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>No broadcasts yet</Text>
                </View>
              ) : broadcasts.map((broadcast) => (
                <View key={broadcast.id} style={{ backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>{broadcast.title}</Text>
                        {broadcast.is_pinned && <Text style={{ fontSize: 12 }}>📌</Text>}
                      </View>
                      <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>{broadcast.message}</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ backgroundColor: COLORS.white, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: COLORS.textLight, textTransform: 'capitalize' }}>{broadcast.type?.replace('_', ' ')}</Text>
                        </View>
                        <View style={{ backgroundColor: COLORS.white, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: COLORS.textLight }}>👥 {broadcast.target_audience}</Text>
                        </View>
                        <Text style={{ fontSize: 10, color: COLORS.textLight }}>{new Date(broadcast.created_at).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 8, padding: 8, marginLeft: 8 }} onPress={() => deleteBroadcast(broadcast.id)}>
                      <Text style={{ fontSize: 14 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );

  // ── RENDER PROFILE ────────────────────────────────────────────────────────────
  const renderAdminProfile = () => (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 44 }}>🔑</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>{profile?.full_name}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{profile?.email}</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.white }}>🔑 Platform Administrator</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 }}>🏢 Company Info</Text>
          {[{ label: 'Company', value: 'Reine Mande Ltd' }, { label: 'Location', value: 'London, UK' }, { label: 'Legal Email', value: 'hello@reinecare.com' }, { label: 'Platform', value: 'ReineCare' }, { label: 'Commission Rate', value: `${commissionRate}%` }].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <Text style={{ fontSize: 13, color: COLORS.textLight }}>{item.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>{item.value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={{ backgroundColor: '#FEE2E2', borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }} onPress={() => Alert.alert('Log Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log Out', style: 'destructive', onPress: onLogout }])}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#991B1B' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── MAIN RETURN ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'verify' && renderVerify()}
        {activeTab === 'bookings' && renderAdminBookings()}
        {activeTab === 'analytics' && (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>📊 Analytics</Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Platform-wide insights</Text>
            </View>
            <AnalyticsDashboard allUsers={allUsers} allBookings={allBookings} />
          </View>
        )}
        {activeTab === 'revenue' && <RevenueReport allUsers={allUsers} allBookings={allBookings} />}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'matching' && (
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.admin, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.white }}>🔗 Patient Matching</Text>
            </View>
            <AdminMatching adminId={user.id} allUsers={allUsers} />
          </View>
        )}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'profile' && renderAdminProfile()}
      </View>
      {/* Bottom tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, maxHeight: 70 }} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={{ alignItems: 'center', paddingHorizontal: 14 }} onPress={() => setActiveTab(tab.id)}>
              <View style={{ width: activeTab === tab.id ? 36 : 0, height: 3, backgroundColor: COLORS.admin, borderRadius: 2, marginBottom: 6 }} />
              <Text style={{ fontSize: activeTab === tab.id ? 22 : 20, marginBottom: 2 }}>{tab.icon}</Text>
              <Text style={{ fontSize: 9, fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? COLORS.admin : COLORS.gray }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── ROOT APP COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [appLanguage, setAppLanguage] = useState('en');

  const t = (key) => TRANSLATIONS[appLanguage]?.[key] || TRANSLATIONS['en']?.[key] || key;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setScreen('splash');
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  const renderDashboard = () => {
    if (!profile) return null;
    if (profile.role === 'admin') return <AdminDashboard user={user} profile={profile} onLogout={handleLogout} />;
    if (profile.role === 'doctor') return <DoctorDashboard user={user} profile={profile} onLogout={handleLogout} />;
    if (profile.role === 'pharmacy') return <PharmacyDashboard user={user} profile={profile} onLogout={handleLogout} />;
    return <PatientDashboard user={user} profile={profile} onLogout={handleLogout} />;
  };

  useEffect(() => {
    const notifListener = Notifications.addNotificationReceivedListener(n => {
      console.log('Notification received:', n);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(r => {
      console.log('Notification response:', r);
    });
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        clearCache('doctors-');
        clearCache('notifications-');
      }
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          setUser(session.user);
          const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          setProfile(profileData);
          setScreen('main');
          await registerForPushNotifications(session.user.id);
        } catch (error) {
          console.log('Session restore error:', error.message);
          setScreen('splash');
        }
      } else {
        setScreen('splash');
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setScreen('splash');
      }
    });
    return () => {
      notifListener.remove();
      responseListener.remove();
      appStateListener?.remove();
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <LanguageContext.Provider value={{ language: appLanguage, setLanguage: setAppLanguage, t }}>
        <StatusBar barStyle="light-content" />
        {screen === 'splash' && (
          <SplashScreen onDone={() => setScreen('onboarding')} />
        )}
        {screen === 'onboarding' && (
          <OnboardingScreen
            onDone={() => setScreen('login')}
            onLogin={() => setScreen('login')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            onLogin={(u, p) => {
              setUser(u);
              setProfile(p);
              setScreen('main');
            }}
            onRegister={() => setScreen('register')}
          />
        )}
        {screen === 'register' && (
          <RegisterScreen
            onRegister={() => setScreen('login')}
            onLogin={() => setScreen('login')}
          />
        )}
        {screen === 'main' && renderDashboard()}
      </LanguageContext.Provider>
    </ErrorBoundary>
  );
}
