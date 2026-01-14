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
  const inputClasses = `border rounded-xl px-4 py-3 text-base bg-gray-50 ${
    error
      ? 'border-red-500'
      : 'border-gray-200'
  } ${className}`;

  return (
    <View className={`${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-900 mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClasses}
        placeholderTextColor="#8E8E93"
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
