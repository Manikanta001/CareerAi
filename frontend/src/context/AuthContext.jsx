import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUserFromStorage());
  const [token, setToken] = useState(localStorage.getItem('careerai_token'));
  const [onboardingRequired, setOnboardingRequired] = useState(
    localStorage.getItem('careerai_onboarding_required') === 'true'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('careerai_token');
      if (storedToken) {
        try {
          const userData = await authService.fetchMe();
          setUser(userData);
          localStorage.setItem('careerai_user', JSON.stringify(userData));
        } catch (err) {
          console.warn('Token validation failed, logging out');
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    localStorage.removeItem('careerai_onboarding_required');
    setOnboardingRequired(false);
    setUser(res.user);
    setToken(res.access_token);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    localStorage.setItem('careerai_onboarding_required', 'true');
    setOnboardingRequired(true);
    setUser(res.user);
    setToken(res.access_token);
    return res;
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('careerai_onboarding_required');
    setUser(null);
    setToken(null);
    setOnboardingRequired(false);
  };

  const completeOnboarding = () => {
    localStorage.removeItem('careerai_onboarding_required');
    setOnboardingRequired(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, onboardingRequired, login, register, logout, completeOnboarding, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
