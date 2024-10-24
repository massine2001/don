import { createContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();

    if (session) {
      fetchUser(session.user.id);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          fetchUser(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId) => {
    const { data: user, error } = await supabase
      .from('users_')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user', error);
    } else {
      setUser(user);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Erreur lors de l\'inscription :', error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    if (!supabase.auth) {
      throw new Error('Supabase auth is not initialized');
    }

    const response = await supabase.auth.signIn({ email, password });

    if (typeof response !== 'object') {
      throw new Error('Invalid response from Supabase signIn');
    }

    const { error, user } = response;

    if (error) throw error;
    else setUser(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    updateUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
