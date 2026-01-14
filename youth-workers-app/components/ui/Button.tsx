import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded-lg items-center justify-center flex-row';
  
  const variantClasses = {
    primary: 'bg-instagram-blue active:opacity-80',
    secondary: 'bg-white active:bg-gray-50 border border-instagram-border',
    outline: 'border border-instagram-border bg-transparent active:bg-gray-50',
    ghost: 'bg-transparent active:bg-gray-50',
    danger: 'bg-red-500 active:opacity-80',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-1.5',
    md: 'px-6 py-2',
    lg: 'px-8 py-3',
  };
  
  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-black font-semibold',
    outline: 'text-black font-semibold',
    ghost: 'text-instagram-blue font-semibold',
    danger: 'text-white font-semibold',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const disabledClasses = 'opacity-50';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    disabled || loading ? disabledClasses : ''
  } ${className}`;
  
  const textClasses = `${textVariantClasses[variant]} ${textSizeClasses[size]}`;
  
  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? '#2563eb' : '#ffffff'}
          />
          <Text className={textClasses}>Loading...</Text>
        </View>
      ) : (
        <Text className={textClasses}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
