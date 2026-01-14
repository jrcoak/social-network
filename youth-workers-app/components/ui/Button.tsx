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
  const baseClasses = 'rounded-xl items-center justify-center flex-row';
  
  const variantClasses = {
    primary: 'bg-primary active:opacity-80',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border border-gray-300 bg-transparent active:bg-gray-100',
    ghost: 'bg-transparent active:bg-gray-100',
    danger: 'bg-red-500 active:opacity-80',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-3.5',
  };
  
  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-gray-900 font-semibold',
    outline: 'text-primary font-semibold',
    ghost: 'text-primary font-semibold',
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
