import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isUser = message.sender === 'user';
  
  // Format time (e.g., "2:30 PM")
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer,
    ]}>
      <View style={[
        styles.messageBubble,
        isUser 
          ? [styles.userBubble, isDark && styles.userBubbleDark] 
          : [styles.botBubble, isDark && styles.botBubbleDark]
      ]}>
        <Text style={[
          styles.messageText,
          isUser 
            ? [styles.userText, isDark && styles.userTextDark] 
            : [styles.botText, isDark && styles.botTextDark]
        ]}>
          {message.text}
        </Text>
      </View>
      <Text style={[
        styles.timestamp,
        isUser ? styles.userTimestamp : styles.botTimestamp,
        isDark && styles.timestampDark
      ]}>
        {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  userBubbleDark: {
    backgroundColor: '#2563EB',
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  botBubbleDark: {
    backgroundColor: '#1E293B',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  userTextDark: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1A2138',
  },
  botTextDark: {
    color: '#E2E8F0',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  userTimestamp: {
    color: '#64748B',
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: '#64748B',
    alignSelf: 'flex-start',
  },
  timestampDark: {
    color: '#94A3B8',
  },
});