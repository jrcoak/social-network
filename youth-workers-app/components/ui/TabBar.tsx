import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface TabBarProps {
  showAdminTab?: boolean;
}

export function TabBar({ showAdminTab = false }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Chat', path: '/chat', icon: '💬' },
    { name: 'Directory', path: '/directory', icon: '👥' },
    { name: 'Map', path: '/map', icon: '🗺️' },
    { name: 'Events', path: '/events', icon: '📅' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  if (showAdminTab) {
    tabs.push({ name: 'Admin', path: '/admin', icon: '⚙️' });
  }

  return (
    <View className="flex-row bg-white border-t border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.path}
            className="flex-1 items-center py-2"
            onPress={() => router.push(tab.path as any)}
          >
            <Text className="text-2xl mb-1">{tab.icon}</Text>
            <Text
              className={`text-xs ${
                isActive ? 'text-primary-600 font-semibold' : 'text-gray-600'
              }`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
