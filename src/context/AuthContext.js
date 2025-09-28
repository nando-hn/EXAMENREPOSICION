import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (usr) => {
      if (usr) {
        const data = {
          uid: usr.uid,
          email: usr.email,
          token: await usr.getIdToken(),
        };
        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data));
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = (email, password) =>
    auth().signInWithEmailAndPassword(email, password);

  const signOut = () => auth().signOut();

  const signUp = (email, password) =>
    auth().createUserWithEmailAndPassword(email, password);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);