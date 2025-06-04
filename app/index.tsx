import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Send, Bot, User, Code2 } from 'lucide-react-native';
import Constants from 'expo-constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Bolt, your expert AI assistant and senior software developer. I can help you with:\n\n• Code review and optimization\n• Architecture decisions\n• Debugging complex issues\n• Best practices across multiple languages\n• Framework recommendations\n• Performance optimization\n\nWhat can I help you build today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;

  useEffect(() => {
    console.log("Chat component mounted.");
    if (!OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is not defined. Please ensure it is set in your environment variables and app.json extra config.");
      Alert.alert(
        "API Key Missing",
        "OpenAI API key is not configured. Please go to Settings to add your API key."
      );
    } else {
      console.log("OPENAI_API_KEY loaded successfully.");
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    if (!OPENAI_API_KEY) {
      const botError: Message = {
        id: (Date.now() + 1).toString(),
        text: "I can't connect to the AI service. Please configure your OpenAI API key in the Settings screen.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botError]);
      setIsTyping(false);
      return;
    }

    try {
      console.log("Sending message to OpenAI with key:", `${OPENAI_API_KEY.substring(0,7)}...`);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are Bolt, an expert AI assistant and exceptional senior software developer. Provide concise and helpful answers.' },
            { role: 'user', content: userMessage.text },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", response.status, errorData);
        throw new Error(errorData.error?.message || `Failed to fetch response from OpenAI (Status: ${response.status})`);
      }

      const data = await response.json();
      const botText = data.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error: any) {
      console.error("Error sending message to OpenAI:", error);
      Alert.alert("API Error", error.message || "An unexpected error occurred.");
      const botError: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || "Could not connect to AI."}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botError]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <View style={styles.messageHeader}>
          {isUser ? (
            <User size={16} color={isUser ? "#FFFFFF" : "#007AFF"} />
          ) : (
            <Bot size={16} color="#FF6B35" />
          )}
          <Text style={[styles.senderName, {color: isUser ? "#FFFFFF" : "#E5E5EA"}]}>
            {isUser ? 'You' : 'Bolt'}
          </Text>
        </View>
        <Text style={[styles.messageText, {color: isUser ? "#FFFFFF" : "#E5E5EA"}]}>{message.text}</Text>
        <Text style={[styles.timestamp, {color: isUser ? "#E5E5EA" : "#888888"}]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Code2 size={24} color="#007AFF" />
          <Text style={styles.headerTitle}>Bolt AI Assistant</Text>
        </View>
        <Text style={styles.headerSubtitle}>Expert Software Developer</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjusted for original layout
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isTyping && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View style={styles.messageHeader}>
                <Bot size={16} color="#FF6B35" />
                <Text style={[styles.senderName, {color: "#E5E5EA"}]}>Bolt</Text>
              </View>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#FF6B35" />
                <Text style={styles.typingText}>Analyzing and crafting response...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about code, architecture, or development..."
            placeholderTextColor="#888888"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Send size={20} color={inputText.trim() ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Original Styles from the first working version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#1a1a1a',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 34,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#1a1a1a',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#2a2a2a',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333333',
  },
});