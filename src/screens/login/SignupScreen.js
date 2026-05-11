import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { fonts } from '../../constants';

export default function SignupScreen({ signup, setIsLoginPage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const[loading, setLoading] = useState(false);

    const handlePress = async () => {
        if(password!=password2) return Alert.alert("Error", "Password Didnt Match");
        if (!email || !password) return Alert.alert("Error", "Please enter all required fields");
        setLoading(true);
        try { 
            await signup(email, password); 
            Alert.alert(
                'Approval Request Submitted',
                'Your account has been created successfully. Access will be granted after admin approval. For faster approval, please contact balibabu403@gmail.com.'
              );
        } 
        catch (e) { 
            Alert.alert("Signup Failed", e.message); 
        } 
        finally { 
            setLoading(false); 
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Create Account</Text>
                    <Text style={styles.subText}>Sign up to start your khatabook</Text>
                </View>

                <View style={styles.formContainer}>

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Email Address</Text>
                        <TextInput 
                            style={styles.floatingInput} 
                            placeholder="name@example.com" 
                            placeholderTextColor="#cbd5e1" 
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address" 
                            autoCapitalize="none" 
                        />
                    </View>

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Choose Password</Text>
                        <View style={styles.passwordInputWrapper}>
                            <TextInput 
                                style={[styles.floatingInput, { flex: 1, borderWidth: 0 }]} 
                                placeholder="••••••••" 
                                placeholderTextColor="#cbd5e1" 
                                value={password} 
                                onChangeText={setPassword} 
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Confirm Password</Text>
                        <View style={styles.passwordInputWrapper}>
                            <TextInput 
                                style={[styles.floatingInput, { flex: 1, borderWidth: 0 }]} 
                                placeholder="••••••••" 
                                placeholderTextColor="#cbd5e1" 
                                value={password2} 
                                onChangeText={setPassword2} 
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={loading} activeOpacity={0.8}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toggleContainer} onPress={()=>setIsLoginPage(true)}>
                        <Text style={styles.toggleText}>Already have an account? <Text style={styles.toggleTextBold}>Sign In</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#B9DDFF', justifyContent: 'center', paddingHorizontal: 24 },
    headerContainer: { marginBottom: 40, alignItems: 'center' },
    welcomeText: { fontSize: 34, color: '#1E293B', fontFamily: fonts.bold, marginBottom: 4 },
    subText: { fontSize: 16, color: '#475569', fontFamily: fonts.regular },
    formContainer: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 30, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
    fieldWrapper: { position: 'relative', marginBottom: 20 },
    floatingLabel: { position: 'absolute', top: -10, left: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 6, fontSize: 12, color: '#64748B', zIndex: 10, fontFamily: fonts.bold, textTransform: 'uppercase' },
    floatingInput: { height: 56, borderRadius: 12, backgroundColor: 'transparent', paddingHorizontal: 16, fontSize: 16, color: '#1E293B', borderWidth: 1.5, borderColor: '#E2E8F0', fontFamily: fonts.regular },
    passwordInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12 },
    eyeIcon: { paddingHorizontal: 15 },
    button: { backgroundColor: '#4A90E2', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4, shadowColor: '#4A90E2', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    buttonText: { color: '#FFFFFF', fontSize: 17, fontFamily: fonts.bold, letterSpacing: 0.5 },
    toggleContainer: { marginTop: 24, alignItems: 'center' },
    toggleText: { color: '#64748B', fontSize: 14, fontFamily: fonts.regular },
    toggleTextBold: { color: '#4A90E2', fontFamily: fonts.bold }
});