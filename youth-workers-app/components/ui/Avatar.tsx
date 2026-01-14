import { View, Image, Text } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ uri, name, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary-100 items-center justify-center ${className}`}
    >
      {uri ? (
        <Image
          source={{ uri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text className={`${textSizeClasses[size]} font-semibold text-primary-700`}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
