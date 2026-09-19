import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { tasks } from '../data/tasks';

interface HistoryItem {
  taskId: string;
  taskTitle: string;
  date: string;
  content: string;
}

export default function DashboardScreen() {
  const [completedCount, setCompletedCount] = useState(0);
  const [lifeStage, setLifeStage] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState('');

  const loadData = async () => {
    try {
      const stage = await AsyncStorage.getItem('@user_life_stage');
      if (stage) setLifeStage(stage);

      // Calculate completed tasks
      let count = 0;
      for (const task of tasks) {
        const isDone = await AsyncStorage.getItem(`@task_completed_${task.id}`);
        if (isDone === 'true') {
          count++;
        }
      }
      setCompletedCount(count);

      // Load history
      const historyStr = await AsyncStorage.getItem('@draft_history');
      if (historyStr) {
        setHistory(JSON.parse(historyStr));
      }

      // Load sponsor info (mock)
      const sponsored = await AsyncStorage.getItem('@is_sponsored');
      const name = await AsyncStorage.getItem('@sponsor_name');
      if (sponsored === 'true') {
        setIsSponsored(true);
        if (name) setSponsorName(name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>
            Your personalized guide for {lifeStage ? lifeStage.toLowerCase() : 'life'}.
          </Text>

          {isSponsored && (
            <View style={styles.sponsorBadge}>
              <Ionicons name="star" size={14} color="#D97706" />
              <Text style={styles.sponsorText}>Premium — sponsored by {sponsorName || 'a parent'}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTasks - completedCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}% of all guides completed</Text>
        </View>

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Document History</Text>
          </View>
          <Text style={styles.sectionDesc}>Past emails and scripts you've drafted with AI.</Text>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateText}>No documents generated yet.</Text>
            </View>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyCardTitle}>{item.taskTitle}</Text>
                  <Text style={styles.historyCardDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.historyCardContent} numberOfLines={3}>
                  {item.content}
                </Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Full Text</Text>
                  <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  sponsorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // amber-100
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 6,
  },
  sponsorText: {
    color: '#92400E', // amber-800
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  historySection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  historyCardDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  historyCardContent: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
