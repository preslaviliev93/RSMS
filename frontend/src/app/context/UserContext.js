'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, isLoggedIn, logout as performLogout } from '../utils/auth';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); 
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUserData());
      setRole(getUserData.role)
    }
    setLoadingUser(false);  // <-- done checking
  }, []);

  const login = () => {
    setUser(getUserData());
  };

  const logout = async () => {
    await performLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}