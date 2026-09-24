import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../constants';
import { formatMoney, formatDate } from '../../utils/formatters';
import useNow from '../../hooks/useNow';

const TransactionItem = ({ item }) => {
    const isIncome = item.category === 0;
    const now = useNow();

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.7}>
            <View style={styles.leftSection}>
                <View style={[styles.iconCircle, { backgroundColor: isIncome ? '#ECFDF5' : '#FFF1F2' }]}>
                    <Icon name={isIncome ? "arrow-up" : "arrow-down"} size={20} color={isIncome ? "#10B981" : "#EF4444"} />
                </View>
                <View style={styles.details}>
                    <Text style={styles.description} numberOfLines={1}>
                        {item.description || 'No Description'}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.date, now)}</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <Text style={[styles.amount, { color: isIncome ? '#059669' : '#DC2626' }]}>{formatMoney(item.amount)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12,
        paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 20, marginBottom: 0, elevation: 1.5
    },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    details: { flex: 1 },
    description: { fontSize: 15, fontFamily: fonts.bold, color: '#1E293B', marginBottom: 2 },
    date: { fontSize: 12, fontFamily: fonts.regular, color: '#94A3B8' },
    rightSection: { alignItems: 'flex-end' },
    amount: { fontSize: 16, fontFamily: fonts.bold, marginRight: 10 },
});

export default TransactionItem;