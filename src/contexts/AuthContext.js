import React, { createContext, useState, useEffect, useContext } from 'react';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential,
    signInWithEmailAndPassword, signOut, updatePassword, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';

const AuthContext = createContext();
const auth = getAuth();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [isLoginPage, setIsLoginPage] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, u => { setUser(u); setInitializing(false); });
        return unsubscribe;
    }, []);
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);

    const signup = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            throw error;
        }
    };

    async function changePassword(currentPassword, newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        logout();
    }

    return (
        <AuthContext.Provider value={{ user, logout, changePassword }}>
            {initializing ? (<MyIndicator text="loading user info" />) : user ? (children) : isLoginPage ?
                (<LoginScreen login={login} setIsLoginPage={setIsLoginPage} />) :
                (<SignupScreen signup={signup} setIsLoginPage={setIsLoginPage} />)}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);