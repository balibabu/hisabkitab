import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../../contexts/DataContext';
import { fonts } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { useDashboardData } from '../../hooks/useDashboardData';
import StatCard from './StatCard';
import SegmentedControl from '../../components/SegmentedControl';
import FloatingButton from '../../components/FloatingButton';
import TransactionItem from './TransactionItem';
import { useWorkspace } from '../../contexts/WorkspaceContext';


export default function Home() {
    const navigation = useNavigation();
    const { data } = useData();
    const { activeWorkspace } = useWorkspace();
    const [filter, setFilter] = useState('Yearly');
    const dashboardData = useDashboardData(data, filter);
    const filterOps = ['Weekly', 'Monthly', 'Yearly'];

    return (
        <SafeAreaView style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor="#4A90E2" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{activeWorkspace.name}</Text>
                <SegmentedControl options={filterOps} activeOption={filter} onChange={setFilter} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.mainBalanceCard]}>
                    <View style={styles.balanceHeader}>
                        <View style={styles.balanceInfo}>
                            <Text style={styles.balanceLabel}>Net Balance</Text>
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{filter}</Text>
                            </View>
                        </View>
                        <Icon name="wallet-outline" size={24} color="#134E4A" opacity={0.6} />
                    </View>
                    <Text style={[styles.balanceText, dashboardData.balance < 0 ? { color: '#E11D48' } : { color: '#0D9488' }]}>
                        <Text style={[styles.currencySymbol, dashboardData.balance < 0 ? { color: '#E11D48' } : { color: '#0D9488' }]}>Rs </Text>
                        {Math.abs(dashboardData.balance)}
                    </Text>
                </View>
                <View style={styles.statsRow}>
                    <StatCard label="Income" amount={dashboardData.income} type="income" />
                    <StatCard label="Expense" amount={dashboardData.expense} type="expense" />
                </View>

                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {dashboardData.filtered.length === 0 ?
                    <Text style={styles.emptyText}>No transactions found for this period.</Text> :
                    dashboardData.filtered.slice(0, 10).map((item) => <View key={item.id}><TransactionItem item={item} /><View style={{ height: 9 }} /></View>)}
            </ScrollView>
            <FloatingButton onPress={() => navigation.navigate('Form')} />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { backgroundColor: '#4A90E2', paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 28, marginBottom: 15, letterSpacing: 0.5, fontFamily: fonts.bold },
    scrollContent: { padding: 20 },
    mainBalanceCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, elevation: 6, marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
    balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    balanceInfo: { flexDirection: 'row', alignItems: 'center' },
    balanceLabel: { fontSize: 14, fontFamily: fonts.regular, color: '#64748B' },
    filterBadge: { backgroundColor: '#CCFBF1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
    filterBadgeText: { fontSize: 10, color: '#0D9488', fontFamily: fonts.bold, textTransform: 'uppercase' },
    balanceText: { fontSize: 32, fontFamily: fonts.bold },
    currencySymbol: { fontSize: 20, color: '#94A3B8' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 5 },
    emptyText: { textAlign: 'center', color: '#999', padding: 20 },
    listContent: { padding: 2, paddingBottom: 100, gap: 10 },
});
