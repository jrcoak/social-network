import { View } from 'react-native';
import type { ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
