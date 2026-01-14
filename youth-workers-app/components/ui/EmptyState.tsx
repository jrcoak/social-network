import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-base text-gray-600 text-center mb-6 max-w-sm">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
    </View>
  );
}
