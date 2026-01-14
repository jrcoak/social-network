import { View, Text, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  containerClassName = '',
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `border border-instagram-border rounded-sm px-3 py-2.5 text-sm bg-instagram-background ${
    error
      ? 'border-red-500'
      : 'focus:border-gray-400'
  } ${className}`;

  return (
    <View className={`${containerClassName}`}>
      {label && (
        <Text className="text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClasses}
        placeholderTextColor="#8E8E8E"
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="text-xs text-gray-500 mt-1">{helperText}</Text>
      )}
    </View>
  );
}
