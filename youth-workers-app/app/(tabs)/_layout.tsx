import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💬</Text>,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Directory',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
