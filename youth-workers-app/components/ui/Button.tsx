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
  const baseClasses = 'rounded-2xl items-center justify-center flex-row shadow-lg';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-purple-500 active:opacity-90',
    secondary: 'bg-gray-100 active:bg-gray-200',
    outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-50',
    ghost: 'bg-transparent active:bg-gray-100',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 active:opacity-90',
  };
  
  const sizeClasses = {
    sm: 'px-5 py-2.5',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4',
  };
  
  const textVariantClasses = {
    primary: 'text-white font-bold',
    secondary: 'text-gray-900 font-bold',
    outline: 'text-primary-600 font-bold',
    ghost: 'text-gray-700 font-semibold',
    danger: 'text-white font-bold',
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
