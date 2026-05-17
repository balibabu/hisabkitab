import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from '@react-native-firebase/firestore';
import { useAuth } from './AuthContext';
import WorkspaceScreen from '../screens/home/WorkspaceScreen';
import MyIndicator from '../components/MyIndicator';

const WorkspaceContext = createContext();
const db = getFirestore();

export const WorkspaceProvider = ({ children }) => {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'workspaces'), where('members', 'array-contains', user.uid));
        const subscriber = onSnapshot(q, snapshot => {
            const list = [];
            snapshot.forEach(docSnap => list.push({ id: docSnap.id, ...docSnap.data() }));
            setWorkspaces(list);
            setLoading(false);
        }, () => setLoading(false));

        return () => subscriber();
    }, [user]);

    const createWorkspace = async (name) => {
        await addDoc(collection(db, 'workspaces'), {
            name,
            createdBy: user.uid,
            members: [user.uid],
            createdAt: serverTimestamp(),
        });
    };

    const updateWorkspace = async (id, newName) => {
        await updateDoc(doc(db, 'workspaces', id), { name: newName });
    };

    const deleteWorkspace = async (id) => {
        await deleteDoc(doc(db, 'workspaces', id));
    };

    const ctxValue = {
        activeWorkspace, setActiveWorkspace,
        workspaces,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace
    };
    return (
        <WorkspaceContext.Provider value={ctxValue}>
            {loading ? <MyIndicator text={'loading workspaces please wait'}/> : activeWorkspace ? children : <WorkspaceScreen />}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);