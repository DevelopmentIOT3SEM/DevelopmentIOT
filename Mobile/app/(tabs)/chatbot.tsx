import React, { useState, useRef } from 'react';
import axios from 'axios';
import { View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Send } from 'lucide-react-native';
import { ChatMessage } from '@/components/chatbot/ChatMessage';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatbotScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Olá! Sou seu assistente de dados. Como posso te ajudar hoje?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);
      const userInput = message;
      setMessage('');

      try {
      const response = await axios.post('http://192.168.66.11:500/chat', {
      mensagem: userInput,
      });


        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.resposta || "Desculpe, não consegui entender a resposta.",
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, botMessage]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

      } catch (error) {
        console.error('Erro ao chamar API:', error);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Ocorreu um erro ao tentar se comunicar com o servidor.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={80}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ChatMessage message={item} />}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={200}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#080C15',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputContainerDark: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1A2138',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  inputDark: {
    color: '#FFFFFF',
    backgroundColor: '#334155',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
