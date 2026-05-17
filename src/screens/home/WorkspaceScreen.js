import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { fonts } from '../../constants';

export default function WorkspaceScreen() {
    const { workspaces, setActiveWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
    const [workspaceName, setWorkspaceName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!workspaceName.trim()) return Alert.alert("Error", "Please enter a valid name");
        setLoading(true);
        try {
            if (editingId) {
                await updateWorkspace(editingId, workspaceName.trim());
                setEditingId(null);
            } else {
                await createWorkspace(workspaceName.trim());
            }
            setWorkspaceName('');
            Keyboard.dismiss();
        } catch (e) {
            Alert.alert("Action Failed", e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSetup = (ws) => {
        setEditingId(ws.id);
        setWorkspaceName(ws.name);
    };

    const handleDeleteConfirm = (ws) => {
        Alert.alert("Delete Workspace", `Are you sure you want to delete "${ws.name}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try { await deleteWorkspace(ws.id); }
                    catch (e) { Alert.alert("Error", e.message); }
                }
            }
        ]);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Select Workspace</Text>
                    <Text style={styles.subText}>Choose a HisabKitab to manage</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Your Workspaces</Text>

                    <ScrollView style={styles.workspacesWrapper} showsVerticalScrollIndicator={false}>
                        {workspaces.map((ws) => (
                            <View key={ws.id} style={styles.workspaceRow}>
                                <TouchableOpacity style={styles.workspaceButton} onPress={() => setActiveWorkspace(ws)} activeOpacity={0.7}>
                                    <Icon name="folder-open-outline" size={22} color="#4A90E2" style={styles.wsIcon} />
                                    <Text style={styles.workspaceButtonText} numberOfLines={1}>{ws.name}</Text>
                                </TouchableOpacity>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity onPress={() => handleEditSetup(ws)} style={styles.actionIcon}>
                                        <Icon name="pencil-outline" size={18} color="#64748B" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteConfirm(ws)} style={styles.actionIcon}>
                                        <Icon name="trash-outline" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.divider} />

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>{editingId ? "Update Workspace" : "Create New"}</Text>
                        <TextInput
                            style={styles.floatingInput}
                            placeholder={editingId ? "Edit name" : "e.g., Office, Travel"}
                            placeholderTextColor="#cbd5e1"
                            value={workspaceName}
                            onChangeText={setWorkspaceName}
                            autoCapitalize="words"
                        />
                        {editingId && (
                            <TouchableOpacity style={styles.cancelEdit} onPress={() => { setEditingId(null); setWorkspaceName(''); }}>
                                <Icon name="close-circle" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={[styles.button, editingId && styles.buttonUpdate]} onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <Text style={styles.buttonText}>{editingId ? "Save Changes" : "Create Workspace"}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#B9DDFF', justifyContent: 'center', paddingHorizontal: 24 },
    headerContainer: { marginBottom: 35, alignItems: 'center' },
    welcomeText: { fontSize: 32, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: 'bold', marginBottom: 4 },
    subText: { fontSize: 16, color: '#475569', fontFamily: fonts?.regular },
    formContainer: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 30, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, maxHeight: '75%' },
    sectionTitle: { fontSize: 13, color: '#64748B', fontFamily: fonts?.bold, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
    workspacesWrapper: { maxHeight: 220, marginBottom: 5 },
    workspaceRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12, borderWidth: 1.5, borderColor: '#E2E8F0', paddingRight: 8 },
    workspaceButton: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14 },
    wsIcon: { marginRight: 12 },
    workspaceButtonText: { flex: 1, fontSize: 16, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: '600' },
    actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionIcon: { padding: 8 },
    divider: { height: 1.5, backgroundColor: '#E2E8F0', marginVertical: 16 },
    fieldWrapper: { position: 'relative', marginBottom: 15, justifyContent: 'center' },
    floatingLabel: { position: 'absolute', top: -10, left: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 6, fontSize: 12, color: '#64748B', zIndex: 10, fontFamily: fonts?.bold, fontWeight: 'bold', textTransform: 'uppercase' },
    floatingInput: { height: 56, borderRadius: 12, backgroundColor: 'transparent', paddingLeft: 16, paddingRight: 45, fontSize: 16, color: '#1E293B', borderWidth: 1.5, borderColor: '#E2E8F0', fontFamily: fonts?.regular },
    cancelEdit: { position: 'absolute', right: 15 },
    button: { backgroundColor: '#4A90E2', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#4A90E2', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    buttonUpdate: { backgroundColor: '#10B981', shadowColor: '#10B981' },
    buttonText: { color: '#FFFFFF', fontSize: 17, fontFamily: fonts?.bold, fontWeight: 'bold', letterSpacing: 0.5 },
});