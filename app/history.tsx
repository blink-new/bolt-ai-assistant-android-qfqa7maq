import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl
} from 'react-native';
import { Clock, MessageCircle, Code2, Trash2 } from 'lucide-react-native';

// Mock data for now, will integrate with actual storage later
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  language?: string;
}

const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'React Performance Optimization',
    lastMessage: 'Thanks for the detailed explanation about memo and useMemo!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messageCount: 12,
    language: 'React',
  },
  {
    id: '2',
    title: 'Node.js API Architecture',
    lastMessage: 'The microservices approach you suggested looks perfect.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    messageCount: 8,
    language: 'Node.js',
  },
  {
    id: '3',
    title: 'Database Schema Design',
    lastMessage: 'Got it! The normalized structure will scale much better.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    messageCount: 15,
    language: 'SQL',
  },
];

export default function History() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      // In a real app, you would fetch updated sessions here
      setSessions(prevSessions => [...prevSessions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
            // In a real app, also delete from storage
          }
        }
      ]
    );
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getLanguageColor = (language?: string): string => {
    const colors: Record<string, string> = {
      React: '#61DAFB',
      'Node.js': '#339933',
      SQL: '#336791',
      Python: '#3776AB',
      TypeScript: '#3178C6',
    };
    return colors[language || ''] || '#888888';
  };

  const renderSession = (session: ChatSession) => (
    <TouchableOpacity key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionTitleContainer}>
          <Code2 size={16} color="#007AFF" />
          <Text style={styles.titleText} numberOfLines={1}>
            {session.title}
          </Text>
        </View>
        <View style={styles.sessionMeta}>
          {session.language && (
            <View
              style={[
                styles.languageTag,
                { backgroundColor: getLanguageColor(session.language) + '20' }, // Lighter background for tag
              ]}
            >
              <Text
                style={[
                  styles.languageText,
                  { color: getLanguageColor(session.language) },
                ]}
              >
                {session.language}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={() => handleDeleteSession(session.id)} style={styles.deleteButton}>
            <Trash2 size={14} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.lastMessage} numberOfLines={2}>
        {session.lastMessage}
      </Text>

      <View style={styles.sessionFooter}>
        <View style={styles.messageCount}>
          <MessageCircle size={14} color="#888888" />
          <Text style={styles.messageCountText}>
            {session.messageCount} messages
          </Text>
        </View>
        <View style={styles.timestampContainer}>
          <Clock size={14} color="#888888" />
          <Text style={styles.timestampText}>
            {formatTimestamp(session.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
        <Text style={styles.headerSubtitle}>Your previous conversations with Bolt</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF"/>
        }
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color="#666666" />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a new chat to see your conversation history here
            </Text>
          </View>
        ) : (
          sessions.map(renderSession)
        )}
      </ScrollView>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888888',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sessionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCountText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
});