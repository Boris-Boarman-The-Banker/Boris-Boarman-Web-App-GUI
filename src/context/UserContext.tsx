import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  userName: string;
  credits: number;
  googleCredential: string | null;
  setIsLoggedIn: (value: boolean) => void;
  setUserName: (name: string) => void;
  setCredits: (credits: number) => void;
  setGoogleCredential: (credential: string | null) => void;
  fetchUserDetails: (googleCredential: string) => void;
  handleLogout: () => void;
  handleLoginSuccess: (credentialResponse: { credential: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [credits, setCredits] = useState(0);
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);

  useEffect(() => {
    const storedGoogleCredential = localStorage.getItem("googleCredential");
    if (storedGoogleCredential) {
      setIsLoggedIn(true);
      setGoogleCredential(storedGoogleCredential);
      fetchUserDetails(storedGoogleCredential);
    }
  }, []);

  const fetchUserDetails = (googleCredential: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ google_credential: googleCredential }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserName(data.name);
        setCredits(data.credits);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleLoginSuccess = (credentialResponse: { credential: string }) => {
    const googleCred = credentialResponse.credential;
    setIsLoggedIn(true);
    setGoogleCredential(googleCred);
    localStorage.setItem("googleCredential", googleCred);
    fetchUserDetails(googleCred);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setGoogleCredential(null);
    localStorage.removeItem("googleCredential");
  };

  const value = {
    isLoggedIn,
    userName,
    credits,
    googleCredential,
    setIsLoggedIn,
    setUserName,
    setCredits,
    setGoogleCredential,
    fetchUserDetails,
    handleLogout,
    handleLoginSuccess
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 