import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, where } from '@react-native-firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';
import { useWorkspace } from './WorkspaceContext';

const DataContext = createContext();
const db = getFirestore();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const { activeWorkspace } = useWorkspace();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsRef = collection(db, 'users', user.uid, 'transactions');
        const q = query(transactionsRef, where('workspace', '==', activeWorkspace?.id || ''), orderBy('date', 'desc'));
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
            Alert.alert("Error fetching transactions:", error.message);
            setLoading(false);
        });
        return () => subscriber();
    }, [user, activeWorkspace]);

    async function save(item) {
        const { id, ...payload } = item;
        if (id) {
            const docRef = doc(db, 'users', user.uid, 'transactions', id);
            await updateDoc(docRef, payload);
        } else {
            const collectionRef = collection(db, 'users', user.uid, 'transactions');
            await addDoc(collectionRef, { ...payload, workspace: activeWorkspace?.id });
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