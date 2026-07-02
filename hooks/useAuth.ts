import { useState, useEffect } from 'react';

export function useAuth() {
  type DemoUser = {
    id: string;
    email?: string;
    user_metadata?: { name?: string };
  };

  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo-only: no real backend auth. Pretend to load session.
    const t = setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 150);

    return () => clearTimeout(t);
  }, []);

  const signIn = async (email: string, password: string) => {
    void password;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    const demo = { id: `demo_${email}`, email, user_metadata: { name: email.split('@')[0] } };
    setUser(demo);
    setLoading(false);
    return { user: demo, session: { user: demo } };
  };

  const signUp = async (email: string, password: string, options?: { name?: string }) => {
    void password;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const demo = { id: `demo_${email}`, email, user_metadata: { name: options?.name ?? email.split('@')[0] } };
    setUser(demo);
    setLoading(false);
    return { user: demo, session: { user: demo } };
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 150));
    setUser(null);
    setLoading(false);
  };

  return { user, loading, signIn, signUp, signOut };
}
