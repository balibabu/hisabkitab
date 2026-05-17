import { ActivityIndicator, Text, View, StyleSheet } from "react-native";

export default function MyIndicator({ text = "Loading...", size = "large", color = "#4EA9FE" }) {
    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <ActivityIndicator size={size} color={color} />
                {text ? <Text style={styles.text}>{text}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AAD6FF',
    },
    card: {
        padding: 24,
        backgroundColor: '#CDE7FF',
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4, // Android shadow
    },
    text: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: '500',
        color: '#3A72A6',
        letterSpacing: 0.3,
    }
});