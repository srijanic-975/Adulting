import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { tasks, Task } from '../data/tasks';

interface Reminder {
  taskId: string;
  dueDate: string;
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const recurringTasks = tasks.filter(t => t.isRecurring);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const saved = await AsyncStorage.getItem('@task_reminders');
      if (saved) {
        setReminders(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addReminder = async (task: Task) => {
    // For demo, just set due date to next month or next year based on interval
    const date = new Date();
    if (task.recurrenceInterval === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }

    const newReminder: Reminder = {
      taskId: task.id,
      dueDate: date.toISOString(),
    };

    const updated = [...reminders.filter(r => r.taskId !== task.id), newReminder];
    setReminders(updated);
    try {
      await AsyncStorage.setItem('@task_reminders', JSON.stringify(updated));
      Alert.alert('Success', `Reminder set for ${date.toLocaleDateString()}`);
    } catch (e) {
      console.error(e);
    }
  };

  const removeReminder = async (taskId: string) => {
    const updated = reminders.filter(r => r.taskId !== taskId);
    setReminders(updated);
    try {
      await AsyncStorage.setItem('@task_reminders', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    const reminder = reminders.find(r => r.taskId === item.id);
    const hasReminder = !!reminder;

    // Calculate days remaining if reminder exists
    let daysRemainingText = '';
    let isUrgent = false;

    if (hasReminder) {
      const dueDate = new Date(reminder.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        daysRemainingText = 'Overdue';
        isUrgent = true;
      } else if (diffDays === 0) {
        daysRemainingText = 'Due Today';
        isUrgent = true;
      } else {
        daysRemainingText = `Due in ${diffDays} days`;
        isUrgent = diffDays <= 7;
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Ionicons name="sync-circle" size={24} color="#4F46E5" />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <Text style={styles.intervalText}>
            {item.recurrenceInterval === 'monthly' ? 'Monthly' : 'Yearly'}
          </Text>
        </View>

        {hasReminder ? (
          <View style={styles.activeReminderContainer}>
            <View style={styles.dateContainer}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isUrgent ? '#EF4444' : '#64748B'}
              />
              <Text style={[styles.dateText, isUrgent && styles.dateTextUrgent]}>
                {new Date(reminder.dueDate).toLocaleDateString()}
              </Text>
              <View style={[styles.badge, isUrgent && styles.badgeUrgent]}>
                <Text style={[styles.badgeText, isUrgent && styles.badgeTextUrgent]}>
                  {daysRemainingText}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => removeReminder(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => addReminder(item)}
          >
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
            <Text style={styles.setButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coming Up</Text>
        <Text style={styles.headerSubtitle}>Keep track of recurring adulting deadlines</Text>
      </View>

      <FlatList
        data={recurringTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  intervalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeReminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  dateTextUrgent: {
    color: '#EF4444',
  },
  badge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badgeUrgent: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4338CA',
  },
  badgeTextUrgent: {
    color: '#B91C1C',
  },
  cancelButton: {
    padding: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  setButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  setButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
