import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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

// Respostas simuladas para o chatbot
const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Olá! Como posso te ajudar hoje com seus dados ou painel?";
  } else if (lowerMessage.includes('dashboard')) {
    return "Seu painel exibe métricas importantes como crescimento de usuários, receita, tarefas e taxas de conclusão. Você pode ver mais detalhes na seção de Análises.";
  } else if (lowerMessage.includes('chart') || lowerMessage.includes('graph')) {
    return "A seção de Análises oferece vários gráficos, incluindo linhas, barras e pizza. Você pode alternar entre eles e mudar o período para ver padrões diferentes nos seus dados.";
  } else if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
    return "Sua receita atual é de R$ 42.853, com um aumento de 8,1% em relação ao período anterior. Continue assim!";
  } else if (lowerMessage.includes('user') || lowerMessage.includes('customer')) {
    return "Você tem 12.592 usuários no total, com uma taxa de crescimento de 12,3% em relação ao último período. A maioria dos seus usuários está ativa nos dias de semana.";
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "Estou aqui para ajudar! Você pode me perguntar sobre métricas do painel, dados de gráficos ou como usar este aplicativo. Que informação específica você está procurando?";
  } else if (lowerMessage.includes('thank')) {
    return "De nada! Se tiver mais perguntas, é só me chamar.";
  } else {
    return "Não entendi bem. Você pode reformular sua pergunta sobre dados, painel ou gráficos?";
  }
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
  
  const handleSend = () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setMessage('');
      
      // Simulate bot response delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(message),
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
        
        // Scroll to bottom after bot response
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
      
      // Scroll to bottom after user message
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
              placeholder="Type your message..."
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