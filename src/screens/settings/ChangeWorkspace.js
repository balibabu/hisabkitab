import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export default function ChangeWorkspace() {
    const { setActiveWorkspace } = useWorkspace();
    
    return (
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveWorkspace(null)} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Icon name="layers-outline" size={22} color="#2563eb" />
            </View>
            <Text style={styles.menuText}>Change Workspace</Text>
            <Icon name="chevron-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
    },
});