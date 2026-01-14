import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Modal } from './Modal';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  containerClassName?: string;
}

export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  containerClassName = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`border rounded-lg px-4 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <Text className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>
      {error && <Text className="text-sm text-red-600 mt-1">{error}</Text>}

      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || 'Select'}
        size="sm"
      >
        <View className="gap-2">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`p-3 rounded-lg ${
                option.value === value ? 'bg-primary-50' : 'bg-gray-50'
              }`}
            >
              <Text
                className={`text-base ${
                  option.value === value
                    ? 'text-primary-700 font-semibold'
                    : 'text-gray-900'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}
