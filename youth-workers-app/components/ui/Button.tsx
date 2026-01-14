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
  const baseClasses = 'rounded items-center justify-center flex-row';
  
  const variantClasses = {
    primary: 'bg-primary active:bg-primary-dark shadow-sm',
    secondary: 'bg-neutral-100 active:bg-neutral-200 border border-neutral-300',
    outline: 'border border-neutral-400 bg-transparent active:bg-neutral-100',
    ghost: 'bg-transparent active:bg-neutral-100',
    danger: 'bg-red-600 active:bg-red-700 shadow-sm',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-1.5',
    md: 'px-5 py-2',
    lg: 'px-6 py-2.5',
  };
  
  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-neutral-900 font-semibold',
    outline: 'text-neutral-900 font-semibold',
    ghost: 'text-neutral-700 font-semibold',
    danger: 'text-white font-semibold',
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
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
