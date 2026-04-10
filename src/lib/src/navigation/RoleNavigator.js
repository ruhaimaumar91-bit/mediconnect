import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Role Dashboards
import PatientDashboard from '../screens/patient/PatientDashboard';
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import PharmacyDashboard from '../screens/pharmacy/PharmacyDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

export default function RoleNavigator({ user, role }) {
  const [screen, setScreen] = useState('splash');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('onboarding');
  };

  // If logged in — show correct dashboard by role
  if (user) {
    if (role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }
    if (role === 'doctor') {
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }
    if (role === 'pharmacy') {
      return <PharmacyDashboard user={user} onLogout={handleLogout} />;
    }
    // Default — patient
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  }

  // Not logged in — show auth screens
  if (screen === 'splash') {
    return <SplashScreen onDone={() => setScreen('onboarding')} />;
  }
  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        onDone={() => setScreen('login')}
        onLogin={() => setScreen('login')}
      />
    );
  }
  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('login')}
        onRegister={() => setScreen('register')}
      />
    );
  }
  if (screen === 'register') {
    return (
      <RegisterScreen
        onRegister={() => setScreen('login')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  return null;
}
