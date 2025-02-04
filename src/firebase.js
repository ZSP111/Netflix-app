import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBKlUGtTxqfwdY8Nccfi4rsU6tJ77bQoDo",
  authDomain: "netflix-clone-c126a.firebaseapp.com",
  projectId: "netflix-clone-c126a",
  storageBucket: "netflix-clone-c126a.firebasestorage.app",
  messagingSenderId: "146450881420",
  appId: "1:146450881420:web:27ae38b01fe9e91c0b94a9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db  = getFirestore(app);

 const signup = async (name , email , password) => {
  try {
     const res = await createUserWithEmailAndPassword(auth, email, password);
   const user = res.user;
   await addDoc(collection(db, "user"),{
    uid: user.uid,
    name,
    authProvider: "local",
    email,
    
})
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split('-').join("-"));
    
  }
  
}

const login = async (email, password)=>{
    try {
       await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split('-').join("-"));
        
    }

}

const logout = async ()=>{
    signOut(auth)
}

export{auth, db, login, signup, logout};