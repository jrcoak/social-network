import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, TabBar } from '@/components/ui';
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
            className={`px-4 py-2.5 rounded-3xl ${
              isOwnMessage ? 'bg-instagram-blue' : 'border border-instagram-border'
            }`}
          >
            <Text className={`text-sm ${isOwnMessage ? 'text-white' : 'text-black'}`}>
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
      <View className="px-4 pt-12 pb-3 border-b border-instagram-border">
        <Text className="text-xl font-bold text-black mb-3">Chat</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              className={`px-4 py-1.5 rounded-lg mr-2 border ${
                selectedChannel?.id === channel.id 
                  ? 'bg-black border-black' 
                  : 'bg-white border-instagram-border'
              }`}
              onPress={() => setSelectedChannel(channel)}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedChannel?.id === channel.id ? 'text-white' : 'text-black'
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
        <View className="flex-row items-center px-4 py-3 border-t border-instagram-border">
          <TextInput
            className="flex-1 border border-instagram-border rounded-full px-4 py-2 text-sm mr-2"
            placeholder="Message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Text className={`text-sm font-semibold ${
              newMessage.trim() && !sending ? 'text-instagram-blue' : 'text-gray-300'
            }`}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <TabBar showAdminTab={profile?.status === 'approved'} />
    </View>
  );
}
