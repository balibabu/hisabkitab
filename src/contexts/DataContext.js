import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy } from '@react-native-firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';

const DataContext = createContext();
const db = getFirestore();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setData([]);
            setLoading(false);
            return;
        }
        const transactionsRef = collection(db, 'users', user.uid, 'transactions');
        const q = query(transactionsRef, orderBy('date', 'desc'));

        const subscriber = onSnapshot(q, (querySnapshot) => {
            const transactions = [];
            querySnapshot.forEach(documentSnapshot => {
                transactions.push({
                    ...documentSnapshot.data(),
                    id: documentSnapshot.id,
                });
            });
            setData(transactions);
            setLoading(false);
        }, (error) => {
            // Alert.alert("Error fetching transactions:", error.message);
            setTimeout(() => {
                Alert.alert(
                    'Approval Pending',
                    'Your account is still pending verification. You will be able to access transactions once an admin approves your account.'
                  );
            }, 3000);
            setLoading(false);
        });
        return () => subscriber();
    }, [user]);

    async function save(item) {
        const { id, ...payload } = item;
        if (id) {
            const docRef = doc(db, 'users', user.uid, 'transactions', id);
            await updateDoc(docRef, payload);
        } else {
            const collectionRef = collection(db, 'users', user.uid, 'transactions');
            await addDoc(collectionRef, payload);
        }
    }

    async function remove(id) {
        const docRef = doc(db, 'users', user.uid, 'transactions', id);
        await deleteDoc(docRef);
    }

    return (
        <DataContext.Provider value={{ data, loading, save, remove }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);