import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getDatabase(); // Referência ao Realtime Database do Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName:
            firebaseUser.displayName || firebaseUser.email.split("@")[0],
          photoURL: firebaseUser.photoURL,
        });

        // Adicionando dados do usuário no Realtime Database sempre que ele fizer login
        const userRef = ref(db, "users/" + firebaseUser.uid);
        set(userRef, {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || "default-avatar-url",
        })
          .then(() => {
            console.log("Dados do usuário salvos no Realtime Database!");
          })
          .catch(error => {
            console.error("Erro ao salvar dados no Realtime Database:", error);
          });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const updateUserProfile = async displayName => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setUser(prev => ({
        ...prev,
        displayName: displayName,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth).then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
