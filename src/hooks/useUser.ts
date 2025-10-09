import { useState, useEffect } from 'react';

export interface User {
  _id: string;
  [key: string]: any;
}

export interface UseUserReturn {
  user: User | null;
  userId: string | undefined;
  setUser: (user: User | null) => void;
}

/**
 * Hook pour récupérer l'utilisateur depuis localStorage
 * Centralise la logique d'accès aux données utilisateur
 */
export function useUser(): UseUserReturn {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('tridyme_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  });

  const userId = user?._id;

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('tridyme_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('tridyme_user');
    }
  };

  // Synchroniser avec les changements localStorage (entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tridyme_user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          setUserState(newUser);
        } catch (error) {
          console.error('Error parsing user from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user, userId, setUser };
}
