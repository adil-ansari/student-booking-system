import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isUserAuthenticated = () => {
    return user !== null;
  };

  const hasSjsuEmail = () => {
    return user?.email.endsWith('@sjsu.edu');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isUserAuthenticated, hasSjsuEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
