import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[700],
        tabBarInactiveTintColor: Colors.text.hint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[300],
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flora"
        options={{
          title: 'Flora',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fauna"
        options={{
          title: 'Fauna',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="processes"
        options={{
          title: 'Procesos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
