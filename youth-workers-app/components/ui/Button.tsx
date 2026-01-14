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
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'border-2 border-primary-600 bg-transparent active:bg-primary-50',
    ghost: 'bg-transparent active:bg-gray-100',
    danger: 'bg-red-600 active:bg-red-700',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-primary-600 font-semibold',
    ghost: 'text-gray-700 font-semibold',
    danger: 'text-white font-semibold',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
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
