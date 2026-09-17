import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, ScrollView, StatusBar, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import SwipeActions from '../../components/SwipeActions';
import { fonts } from '../../constants';

const AVATAR_TINTS = ['#4A90E2', '#10B981', '#0D9488', '#3B82F6'];

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + second).toUpperCase();
};

const tintFor = (id = '', index = 0) => {
    const sum = String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_TINTS[(sum + index) % AVATAR_TINTS.length];
};

export default function WorkspaceScreen() {
    const { workspaces, setActiveWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
    const { reauthenticate } = useAuth();
    const [workspaceName, setWorkspaceName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [password, setPassword] = useState('');
    const [deleting, setDeleting] = useState(false);

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

    const handleDeleteRequest = (ws) => {
        setPassword('');
        setDeleteTarget(ws);
    };

    const handleDeleteConfirm = async () => {
        if (!password.trim()) return Alert.alert("Error", "Please enter your password");
        setDeleting(true);
        try {
            await reauthenticate(password.trim());
            await deleteWorkspace(deleteTarget.id);
            setDeleteTarget(null);
            setPassword('');
        } catch (e) {
            const msg = e?.code === 'auth/invalid-credential' || e?.code === 'auth/wrong-password'
                ? "Incorrect password. Please try again."
                : e.message;
            Alert.alert("Delete Failed", msg);
        } finally {
            setDeleting(false);
        }
    };

    const resetEdit = () => {
        setEditingId(null);
        setWorkspaceName('');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <View style={styles.headerBadge}>
                            <Icon name="layers-outline" size={30} color="#4A90E2" />
                        </View>
                        <Text style={styles.welcomeText}>Select Workspace</Text>
                        <Text style={styles.subText}>Choose a HisabKitab to manage your money</Text>
                        <View style={styles.countPill}>
                            <Icon name="business-outline" size={12} color="#FFFFFF" />
                            <Text style={styles.countPillText}>
                                {workspaces.length} Workspace{workspaces.length === 1 ? '' : 's'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Workspaces</Text>
                            {workspaces.length > 0 && <Text style={styles.sectionHint}>Swipe for actions</Text>}
                        </View>

                        {workspaces.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconWrap}>
                                    <Icon name="folder-open-outline" size={40} color="#94A3B8" />
                                </View>
                                <Text style={styles.emptyTitle}>No workspaces yet</Text>
                                <Text style={styles.emptyText}>Create your first workspace below to get started.</Text>
                            </View>
                        ) : (
                            workspaces.map((ws, index) => {
                                const tint = tintFor(ws.id, index);
                                return (
                                    <SwipeActions
                                        key={ws.id}
                                        onEdit={() => handleEditSetup(ws)}
                                        onDelete={() => handleDeleteRequest(ws)}
                                    >
                                        <View style={styles.workspaceCard}>
                                            <TouchableOpacity style={styles.workspaceMain} onPress={() => setActiveWorkspace(ws)} activeOpacity={0.7}>
                                                <View style={[styles.avatar, { backgroundColor: tint + '1A' }]}>
                                                    <Text style={[styles.avatarText, { color: tint }]}>{getInitials(ws.name)}</Text>
                                                </View>
                                                <View style={styles.workspaceInfo}>
                                                    <Text style={styles.workspaceName} numberOfLines={1}>{ws.name}</Text>
                                                    <View style={styles.openHint}>
                                                        <Icon name="chevron-forward" size={12} color="#94A3B8" />
                                                        <Text style={styles.openHintText}>Open</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </SwipeActions>
                                );
                            })
                        )}
                    </View>

                    <View style={styles.createCard}>
                        <View style={styles.createHeader}>
                            <View style={styles.createBadge}>
                                <Icon name={editingId ? "pencil" : "add"} size={16} color="#FFFFFF" />
                            </View>
                            <Text style={styles.createTitle}>{editingId ? "Update Workspace" : "Create New Workspace"}</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <Icon name="briefcase-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={editingId ? "Edit name" : "e.g., Office, Travel"}
                                placeholderTextColor="#cbd5e1"
                                value={workspaceName}
                                onChangeText={setWorkspaceName}
                                autoCapitalize="words"
                            />
                            {editingId && (
                                <TouchableOpacity onPress={resetEdit} style={styles.clearBtn}>
                                    <Icon name="close-circle" size={20} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.button, editingId ? styles.buttonUpdate : styles.buttonCreate]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <Icon name={editingId ? "checkmark" : "add"} size={20} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>{editingId ? "Save Changes" : "Create Workspace"}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modal
                    visible={!!deleteTarget}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setDeleteTarget(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconCircle}>
                                <Icon name="trash-outline" size={28} color="#EF4444" />
                            </View>
                            <Text style={styles.modalTitle}>Delete Workspace</Text>
                            <Text style={styles.modalMessage}>
                                Are you sure you want to delete "{deleteTarget?.name}"?{"\n"}Enter your password to confirm.
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Password"
                                placeholderTextColor="#94A3B8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={[styles.modalButton, styles.modalDeleteButton]} onPress={handleDeleteConfirm} disabled={deleting} activeOpacity={0.8}>
                                {deleting ? <ActivityIndicator color="#fff" /> : (
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteTarget(null)} disabled={deleting}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#B9DDFF' },
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 30 },

    header: {
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 52,
        paddingBottom: 28,
        alignItems: 'center',
    },
    headerBadge: {
        width: 62, height: 62, borderRadius: 31,
        backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
        elevation: 5, shadowColor: '#000', shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    },
    welcomeText: { fontSize: 26, color: '#FFFFFF', fontFamily: fonts?.bold, fontWeight: 'bold', marginBottom: 6 },
    subText: { fontSize: 14, color: '#E0EEFF', fontFamily: fonts?.regular, textAlign: 'center' },
    countPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 14,
    },
    countPillText: { fontSize: 12, color: '#FFFFFF', fontFamily: fonts?.bold, fontWeight: 'bold' },

    body: { paddingHorizontal: 20, paddingTop: 24 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 2 },
    sectionTitle: { fontSize: 16, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: 'bold' },
    sectionHint: { fontSize: 12, color: '#64748B', fontFamily: fonts?.regular },

    emptyState: {
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 30,
        alignItems: 'center', justifyContent: 'center',
        elevation: 3, shadowColor: '#4A90E2', shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    emptyIconWrap: {
        width: 76, height: 76, borderRadius: 38,
        backgroundColor: '#F1F5F9',
        alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    emptyTitle: { fontSize: 16, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: 'bold', marginBottom: 4 },
    emptyText: { fontSize: 13, color: '#64748B', fontFamily: fonts?.regular, textAlign: 'center' },

    workspaceCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 18,
        marginBottom: 12, padding: 12,
        elevation: 3, shadowColor: '#4A90E2', shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
        borderWidth: 1, borderColor: '#EFF6FF',
    },
    workspaceMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { fontSize: 17, fontFamily: fonts?.bold, fontWeight: 'bold' },
    workspaceInfo: { flex: 1 },
    workspaceName: { fontSize: 16, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: '600', marginBottom: 3 },
    openHint: { flexDirection: 'row', alignItems: 'center', gap: 1 },
    openHintText: { fontSize: 11, color: '#94A3B8', fontFamily: fonts?.regular, marginLeft: 2 },

    createCard: {
        backgroundColor: '#FFFFFF', borderRadius: 22,
        marginHorizontal: 20, marginTop: 20, padding: 20,
        elevation: 6, shadowColor: '#4A90E2', shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 }, shadowRadius: 16,
    },
    createHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    createBadge: {
        width: 28, height: 28, borderRadius: 9,
        backgroundColor: '#4A90E2',
        alignItems: 'center', justifyContent: 'center',
    },
    createTitle: { fontSize: 15, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: 'bold' },

    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8FAFC', borderRadius: 14,
        borderWidth: 1.5, borderColor: '#E2E8F0',
        paddingHorizontal: 14, marginBottom: 16, height: 56,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#1E293B', fontFamily: fonts?.regular, padding: 0 },
    clearBtn: { padding: 4 },

    button: { flexDirection: 'row', height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
    buttonCreate: {
        backgroundColor: '#4A90E2', elevation: 4, shadowColor: '#4A90E2',
        shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
    },
    buttonUpdate: {
        backgroundColor: '#10B981', elevation: 4, shadowColor: '#10B981',
        shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
    },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontFamily: fonts?.bold, fontWeight: 'bold', letterSpacing: 0.3 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalContent: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
    modalIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    modalTitle: { fontSize: 20, fontFamily: fonts?.bold, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
    modalMessage: { fontSize: 14, fontFamily: fonts?.regular, color: '#64748B', textAlign: 'center', marginBottom: 18, lineHeight: 20 },
    modalInput: { width: '100%', height: 50, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, fontSize: 15, color: '#1E293B', fontFamily: fonts?.regular, marginBottom: 16, backgroundColor: '#F8FAFC' },
    modalButton: { width: '100%', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    modalDeleteButton: { backgroundColor: '#EF4444', elevation: 4, shadowColor: '#EF4444', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    modalButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: fonts?.bold, fontWeight: 'bold', letterSpacing: 0.5 },
    modalCancelButton: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 20 },
    modalCancelText: { fontSize: 15, fontFamily: fonts?.bold, fontWeight: '600', color: '#64748B' },
});
