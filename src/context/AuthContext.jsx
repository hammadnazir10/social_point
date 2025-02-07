import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
    const { token, ...userData } = response.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'success');
  };

  const updateProfile = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/profile`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser(response.data.data);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export const useAuth = () => useContext(AuthContext);