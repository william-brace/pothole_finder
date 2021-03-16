import React, { useState, useContext, useEffect } from "react";
import { auth, firestore } from "../firebase";
import { getUserData } from "../firestoreQueries";

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
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        return firestore.collection("users").doc(credential.user.uid).set({
          email: email,
          role: "manager",
          potholes: [],
        });
      });
  };

  const signin = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const getCurrentUserData = (user) => {
    if (user) {
      getUserData(user.uid).then((userData) => {
        setCurrentUserData(userData.data());
        console.log(`current User data in authContext is ${currentUserData}`);
      });
    } else {
      setCurrentUserData(null);
      console.log(`current User data in authContext is ${currentUserData}`);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      getCurrentUserData(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    register,
    signin,
    currentUser,
    setCurrentUser,
    currentUserData,
    setCurrentUserData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
