import React, { useContext, useEffect, useState } from "react";
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";


const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}


export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); // when is user loggin the user data is gonna set
    const [userLoggedIn, setUserLoggedIn] = useState(false); // if the user is logged in this set will true otherwise false
    const [loading, setLoading] = useState(true); // this is true because it will findout the user data 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
            setCurrentUser({ ...user });
            setUserLoggedIn(true);

        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider >
    )
}