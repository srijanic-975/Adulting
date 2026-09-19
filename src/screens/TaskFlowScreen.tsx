import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { tasks, Task } from '../data/tasks';
import { generateAIDraft } from '../utils/api';

type TaskFlowRouteProp = RouteProp<RootStackParamList, 'TaskFlow'>;

export default function TaskFlowScreen() {
  const route = useRoute<TaskFlowRouteProp>();
  const navigation = useNavigation();
  const { taskId } = route.params;

  const task = tasks.find(t => t.id === taskId);

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isPremium, setIsPremium] = useState(true); // Default true for demo, handle actual check later

  // AI Form inputs (simplified for demo)
  const [input1, setInput1] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(`@task_progress_${taskId}`);
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStep = async (stepId: string) => {
    const newProgress = {
      ...completedSteps,
      [stepId]: !completedSteps[stepId]
    };
    setCompletedSteps(newProgress);

    try {
      await AsyncStorage.setItem(`@task_progress_${taskId}`, JSON.stringify(newProgress));

      // If all steps completed
      if (task && Object.values(newProgress).filter(Boolean).length === task.steps.length) {
        await AsyncStorage.setItem(`@task_completed_${taskId}`, 'true');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateDraft = async () => {
    if (!isPremium) {
      // @ts-ignore
      navigation.navigate('Paywall');
      return;
    }

    setIsGenerating(true);
    try {
      const draft = await generateAIDraft(task?.aiPromptTemplate || 'Draft this text');
      setGeneratedDraft(draft);

      // Save to history
      const historyItem = {
        taskId: task?.id,
        taskTitle: task?.title,
        date: new Date().toISOString(),
        content: draft
      };

      const existingHistoryStr = await AsyncStorage.getItem('@draft_history');
      const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      await AsyncStorage.setItem('@draft_history', JSON.stringify([historyItem, ...existingHistory]));

    } catch (error) {
      Alert.alert("Error", "Failed to generate draft. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!task) return <View style={styles.center}><Text>Task not found</Text></View>;

  const progress = task.steps.length > 0
    ? (Object.values(completedSteps).filter(Boolean).length / task.steps.length) * 100
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.explainer}>{task.explainer}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>
      </View>

      <View style={styles.stepsSection}>
        <Text style={styles.sectionTitle}>Checklist</Text>
        {task.steps.map((step, index) => {
          const isDone = completedSteps[step.id];
          return (
            <TouchableOpacity
              key={step.id}
              style={[styles.stepCard, isDone && styles.stepCardDone]}
              onPress={() => toggleStep(step.id)}
            >
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                {isDone && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.stepText, isDone && styles.stepTextDone]}>
                {index + 1}. {step.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {task.hasAIDraft && (
        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>AI Assistant</Text>
          <Text style={styles.aiDesc}>
            Let our AI draft a {task.draftType?.replace('_', ' ')} for you based on this task.
          </Text>

          {!generatedDraft ? (
            <View style={styles.aiForm}>
              <TextInput
                style={styles.input}
                placeholder="Enter details (e.g. Bank Name, Fee Amount)"
                value={input1}
                onChangeText={setInput1}
              />
              <TouchableOpacity
                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                onPress={handleGenerateDraft}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#FFF" />
                    <Text style={styles.generateButtonText}>Generate Draft</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.draftContainer}>
              <Text style={styles.draftText}>{generatedDraft}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => Alert.alert("Copied", "Draft copied to clipboard!")}
              >
                <Ionicons name="copy-outline" size={20} color="#4F46E5" />
                <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  explainer: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981', // emerald-500
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'right',
  },
  stepsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  stepCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  stepTextDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  aiSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiForm: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  draftContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  draftText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
    marginBottom: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderRadius: 8,
    gap: 8,
  },
  copyButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});
