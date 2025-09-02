import { auth } from './firebaseconfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken,
} from "firebase/auth";


// Register with email/password using firebase auth
export const doCreateUserWithEmailAndPassword = async (email, password) =>{



    return createUserWithEmailAndPassword(auth, email,password);
}

// Login with email/password 
export const doSignInWithEmailAndPassword = (email,password) => {
    return signInWithEmailAndPassword(auth,email,password);
}


export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    //result.user
    return result 
};

export const doSignOut = () =>{
    return auth.signOut();
};

export const doPasswordReset = (password) =>{
    return sendPasswordResetEmail(auth,email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
}