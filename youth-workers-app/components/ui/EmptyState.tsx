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
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
        <View className="w-10 h-10 bg-gray-300 rounded-full" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
        {title}
      </Text>
      {description && (
        <Text className="text-base text-gray-500 text-center mb-8 max-w-sm leading-relaxed">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
    </View>
  );
}
