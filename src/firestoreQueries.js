import { firestore } from "./firebase";

export const getUserData = (id) => {
  return firestore.collection("users").doc(id).get();
};
