"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const PUBLIC_PATHS = ['/auth'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);

      // Handle navigation after auth state change
      if (!user && !PUBLIC_PATHS.includes(pathname)) {
        router.replace('/auth');
      } else if (user && PUBLIC_PATHS.includes(pathname)) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Show auth page if not authenticated and on protected route
  if (!user && !PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);