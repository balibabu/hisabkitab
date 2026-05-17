import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import AppLockSetup from './AppLockSetup'
import ChangePassword from './ChangePassword';
import SignOut from './SignOut';
import ChangeWorkspace from './ChangeWorkspace';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

export default function SettingsScreen() {
    const { user } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <View style={styles.menuContainer}>
                    <ChangePassword />
                    <ChangeWorkspace />
                    <AppLockSetup />
                    <SignOut />
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>made by balibabu</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', },
    header: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: 20, },
    avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#4a148c', justifyContent: 'center', alignItems: 'center', marginBottom: 15, },
    avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold', },
    email: { fontSize: 14, color: '#666', marginTop: 5, },
    menuContainer: { paddingHorizontal: 20, },
    footerContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20, marginTop: 20, },
    footerText: { fontSize: 16, fontWeight: '600', color: '#999', opacity: 0.2, }
});