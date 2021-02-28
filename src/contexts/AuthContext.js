import React, { useState, useContext, useEffect } from "react";
import app from "../firebase";
import { auth, firestore } from "../firebase";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// const async connectUserDb = () => {
//     await firestore.collection("users").get;
// }

// {
//   React.useEffect(() => {
//     const fetchData = async () => {
//       const db = firebase.firestore().collection("users");
//       const data = await db.get();
//       const users = data.docs.map((doc) => doc.data());
//       setUsers(users);
//     };
//     fetchData();
//   }, []);
// }

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const register = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        return firestore.collection("users").doc(credential.user.uid).set({
          role: "manager",
        });
      });
  };

  const signin = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { register, signin, currentUser, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
