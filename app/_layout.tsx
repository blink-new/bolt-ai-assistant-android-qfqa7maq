import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MessageCircle, Settings, History } from 'lucide-react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a1a', // Original dark background
            borderTopColor: '#333333',
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#007AFF', // Original active tint
          tabBarInactiveTintColor: '#888888', // Original inactive tint
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Chat', // Original title
            tabBarIcon: ({ color, size }) => (
              <MessageCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History', // Original title
            tabBarIcon: ({ color, size }) => (
              <History color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings', // Original title
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
    </>
  );
}