import React, { useState, useRef } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Send } from 'lucide-react-native';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { CHATBOT_URL } from '@/config';
import { colors, font, radius } from '@/constants/theme';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const SUGESTOES = ['Resumo', 'Taxa de refugo', 'Status dos sensores', 'Comparar materiais', 'Melhor dia'];

export default function ChatbotScreen() {
  const [message, setMessage] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou o assistente da produção. Pergunte sobre refugos, sensores, peças, eficiência ou peça um resumo. Digite "ajuda" para ver tudo.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const rolarParaFim = () => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  const enviarTexto = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || enviando) return;

    const userMessage: Message = { id: Date.now().toString(), text: limpo, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setEnviando(true);
    rolarParaFim();

    try {
      const response = await axios.post(`${CHATBOT_URL}/chat`, { mensagem: limpo });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.resposta || 'Desculpe, não consegui entender a resposta.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), text: 'Não consegui falar com o servidor agora. Tente novamente.', sender: 'bot', timestamp: new Date() },
      ]);
    } finally {
      setEnviando(false);
      rolarParaFim();
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={80}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatMessage message={item} />}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.sugestoesWrap}>
            <FlatList
              horizontal
              data={SUGESTOES}
              keyExtractor={(s) => s}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sugestoesList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.chip} onPress={() => enviarTexto(item)} disabled={enviando}>
                  <Text style={styles.chipText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem…"
              placeholderTextColor={colors.slate400}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={() => enviarTexto(message)}
              returnKeyType="send"
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!message.trim() || enviando) && styles.sendButtonDisabled]}
              onPress={() => enviarTexto(message)}
              disabled={!message.trim() || enviando}
            >
              <Send size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  messageList: { paddingHorizontal: 16, paddingVertical: 12 },
  sugestoesWrap: { borderTopWidth: 1, borderTopColor: colors.slate100 },
  sugestoesList: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.slate300,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: { fontFamily: font.medium, fontSize: 13, color: colors.slate700 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  input: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.slate900,
    backgroundColor: colors.slate100,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green600,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: { backgroundColor: colors.green500, opacity: 0.5 },
});
