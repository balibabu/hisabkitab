import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import InAppReview from 'react-native-in-app-review';
import { fonts } from '../../constants';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.balibabu.hisabkitab';
const SHARE_MESSAGE = `Track your income and expenses easily with Hisab Kitab! 💰 Get it on Google Play:\n${PLAY_STORE_URL}`;

export default function RateShareButtons() {
    const handleShare = useCallback(async () => {
        try {
            await Share.open({
                title: 'Share Hisab Kitab',
                subject: 'Hisab Kitab',
                message: SHARE_MESSAGE,
                failOnCancel: false,
            });
        } catch { }
    }, []);

    const handleRate = useCallback(async () => {
        try {
            const launched = await InAppReview.RequestInAppReview();
            if (!launched) {
                await Linking.openURL(PLAY_STORE_URL);
            }
        } catch {
            try {
                await Linking.openURL(PLAY_STORE_URL);
            } catch {
                Alert.alert('Error', 'Unable to open the Play Store right now.');
            }
        }
    }, []);

    return (
        <View style={styles.row}>
            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={handleShare}
                accessibilityRole="button"
                accessibilityLabel="Share app"
            >
                <Icon name="share-social-outline" size={18} color="#2563eb" />
                <Text style={styles.label}>Share App</Text>
            </Pressable>

            <View style={styles.gap} />

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={handleRate}
                accessibilityRole="button"
                accessibilityLabel="Rate app"
            >
                <Icon name="star" size={18} color="#f59e0b" />
                <Text style={styles.label}>Rate App</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    gap: {
        width: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eff6ff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(37,99,235,0.28)',
        paddingVertical: 13,
        borderRadius: 14,
        gap: 8,
    },
    label: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: '#2563eb',
    },
    pressed: {
        opacity: 0.88,
        transform: [{ scale: 0.99 }],
    },
});
