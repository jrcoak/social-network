import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({
  size = 'large',
  text,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <View className={`items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color="#2563eb" />
      {text && (
        <Text className="text-gray-600 mt-2 text-center">{text}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        {content}
      </View>
    );
  }

  return content;
}
