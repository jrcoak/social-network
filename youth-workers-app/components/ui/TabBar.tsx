import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface TabBarProps {
  showAdminTab?: boolean;
}

export function TabBar({ showAdminTab = false }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Chat', path: '/chat' },
    { name: 'Directory', path: '/directory' },
    { name: 'Map', path: '/map' },
    { name: 'Events', path: '/events' },
    { name: 'Profile', path: '/profile' },
  ];

  if (showAdminTab) {
    tabs.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <View className="flex-row bg-white border-t border-neutral-200 shadow-lg">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.path}
            className={`flex-1 items-center py-3 ${isActive ? 'border-b-2 border-primary' : ''}`}
            onPress={() => router.push(tab.path as any)}
          >
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-primary' : 'text-neutral-600'
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
