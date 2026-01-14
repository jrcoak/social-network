import { Modal as RNModal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { ModalProps as RNModalProps } from 'react-native';

interface ModalProps extends RNModalProps {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Modal({
  title,
  children,
  onClose,
  size = 'md',
  visible,
  ...props
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full',
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className={`bg-white rounded-lg w-full ${sizeClasses[size]} max-h-[90%]`}>
          {title && (
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">{title}</Text>
              {onClose && (
                <TouchableOpacity onPress={onClose} className="p-1">
                  <Text className="text-2xl text-gray-500">×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <ScrollView className="p-4">{children}</ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
