import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

axios.withCredentials = true;
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backEndUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backEndUrl + '/api/auth/user', { withCredentials: true });
            setUserData(data.user);
        } catch (err) {
            setUserData(null);
        }
    };

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backEndUrl + '/api/auth/is-auth', { withCredentials: true });
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    const value = {
        backEndUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        getAuthState
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
