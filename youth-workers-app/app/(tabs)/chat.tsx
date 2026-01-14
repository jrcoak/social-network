import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar } from '@/components/ui';
import type { Database } from '@/types/database.types';

type Channel = Database['public']['Tables']['channels']['Row'];
type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: {
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
};

export default function Chat() {
  const { user, profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      subscribeToMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');

      if (error) throw error;
      setChannels(data || []);
      
      // Select first channel by default
      if (data && data.length > 0) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            profile_picture_url
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data as any || []);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = (channelId: string) => {
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Fetch the full message with profile data
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              profiles:user_id (
                first_name,
                last_name,
                profile_picture_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as any]);
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      setSending(true);
      const { error } = await supabase.from('messages').insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.user_id === user?.id;
    
    return (
      <View className={`flex-row mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && (
          <Avatar
            name={`${item.profiles.first_name} ${item.profiles.last_name}`}
            imageUrl={item.profiles.profile_picture_url}
            size="sm"
          />
        )}
        <View className={`ml-2 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {!isOwnMessage && (
            <Text className="text-xs text-gray-600 mb-1">
              {item.profiles.first_name} {item.profiles.last_name}
            </Text>
          )}
          <View
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <Text className={isOwnMessage ? 'text-white' : 'text-gray-900'}>
              {item.content}
            </Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading chat..." />;
  }

  if (!profile || profile.status !== 'approved') {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Chat Unavailable</Text>
        <Text className="text-gray-600 text-center">
          Your account needs to be approved by an administrator before you can access chat.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with channel selector */}
      <View className="px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-3">Chat</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              className={`px-4 py-2 rounded-full mr-2 border-2 ${
                selectedChannel?.id === channel.id 
                  ? 'bg-neutral-200 border-primary' 
                  : 'bg-white border-neutral-300'
              }`}
              onPress={() => setSelectedChannel(channel)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedChannel?.id === channel.id ? 'text-neutral-700' : 'text-neutral-600'
                }`}
              >
                #{channel.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center">
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />

        {/* Message input */}
        <View className="flex-row items-center p-4 border-t border-gray-200">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base mr-2"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            className={`w-12 h-12 rounded-full items-center justify-center ${
              newMessage.trim() && !sending ? 'bg-primary' : 'bg-gray-300'
            }`}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Text className="text-white text-xl">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
