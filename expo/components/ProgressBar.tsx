import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { RAGStatus } from '@/mocks/dashboardData';

interface ProgressBarProps {
  progress: number;
  status?: RAGStatus;
  showLabel?: boolean;
  height?: number;
  animated?: boolean;
}

export default function ProgressBar({ 
  progress, 
  status, 
  showLabel = true, 
  height = 6,
  animated = true 
}: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated, animatedWidth]);

  const getProgressColor = () => {
    if (status) {
      switch (status) {
        case 'green': return Colors.success;
        case 'amber': return Colors.warning;
        case 'red': return Colors.danger;
      }
    }
    if (progress >= 80) return Colors.success;
    if (progress >= 50) return Colors.warning;
    return Colors.danger;
  };

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <Animated.View 
          style={[
            styles.fill, 
            { 
              height, 
              backgroundColor: getProgressColor(),
              width: widthInterpolate,
            }
          ]} 
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>{progress}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    minWidth: 40,
    textAlign: 'right' as const,
  },
});
