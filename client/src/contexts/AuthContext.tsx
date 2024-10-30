import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

interface UserProfile {
  userUid: string;
  username: string;
  userEmail: string;
  userRole: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const db = getFirestore();

  const fetchUserProfile = async (userUid: string) => {
    const userDoc = await getDoc(doc(db, "users", userUid));
    if (userDoc.exists()) {
      const profileData = userDoc.data() as UserProfile;
      setUserProfile(profileData);
      localStorage.setItem("userProfile", JSON.stringify(profileData)); // Save profile to localStorage
    } else {
      setUserProfile(null);
      localStorage.removeItem("userProfile"); // Clear profile from localStorage if not found
    }
  };

  useEffect(() => {
    // Check if userProfile exists in localStorage on component mount
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem("userProfile"); // Clear localStorage on sign-out
      }
    });
    return () => unsubscribe();
  }, [db]);

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUserProfile: UserProfile = {
        username: result.user.email?.split("@")[0] || "",
        userRole: "user",
        userUid: result.user.uid,
        userEmail: result.user.email || "",
      };
      await setDoc(doc(db, "users", result.user.uid), newUserProfile);
      setUser(result.user);
      setUserProfile(newUserProfile);
      localStorage.setItem("userProfile", JSON.stringify(newUserProfile)); // Save new profile to localStorage
    } catch (error) {
      console.error("Registration failed:", (error as Error).message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(result.user.uid);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", (error as Error).message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem("userProfile"); // Clear localStorage on logout
    } catch (error) {
      console.error("Logout failed:", (error as Error).message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
