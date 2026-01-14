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
  const inputClasses = `border rounded-lg px-4 py-3 text-base ${
    error
      ? 'border-red-500 focus:border-red-600'
      : 'border-gray-300 focus:border-primary-600'
  } ${className}`;

  return (
    <View className={`${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClasses}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-600 mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="text-sm text-gray-500 mt-1">{helperText}</Text>
      )}
    </View>
  );
}
