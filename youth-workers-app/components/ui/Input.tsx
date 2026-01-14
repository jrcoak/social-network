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
  const inputClasses = `border-b-2 px-3 py-2 text-base bg-white ${
    error
      ? 'border-red-600'
      : 'border-neutral-300 focus:border-primary'
  } ${className}`;

  return (
    <View className={`${containerClassName}`}>
      {label && (
        <Text className="text-sm font-semibold text-neutral-900 mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={inputClasses}
        placeholderTextColor="#8A8A8A"
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-600 mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="text-xs text-neutral-600 mt-1">{helperText}</Text>
      )}
    </View>
  );
}
