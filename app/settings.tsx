import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  Key,
  Moon,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  Save
} from 'lucide-react-native';
import Constants from 'expo-constants';

// A simple in-memory store for API key for this simplified version
// In a real app, use AsyncStorage or secure storage as done previously.
let inMemoryApiKey: string | null = null;

export default function Settings() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Attempt to load API key from Constants (passed via app.json extra)
    const loadedApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;
    if (loadedApiKey) {
      inMemoryApiKey = loadedApiKey;
      setIsApiKeySet(true);
      setApiKeyInput('••••••••••••••••••••••••••••••••••••'); // Mask the key
      console.log("API Key loaded from environment/app.json");
    } else {
      console.log("No API Key found in environment/app.json");
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim() || apiKeyInput.includes('•')) {
      Alert.alert('Invalid API Key', 'Please enter a valid OpenAI API key.');
      return;
    }
    inMemoryApiKey = apiKeyInput.trim();
    setIsApiKeySet(true);
    setApiKeyInput('••••••••••••••••••••••••••••••••••••'); // Mask after saving
    Alert.alert('API Key Saved', 'Your OpenAI API key has been saved for this session. Please update app.json for persistence across app restarts.');
    // Note: This only saves to memory. For persistence, it needs to be in app.json or secure storage.
    // And then the app needs to be rebuilt if app.json is changed.
    console.log("API Key saved to in-memory store. For persistence, update app.json and rebuild or use AsyncStorage.");
  };

  const handleRemoveApiKey = () => {
    inMemoryApiKey = null;
    setIsApiKeySet(false);
    setApiKeyInput('');
    Alert.alert('API Key Removed', 'Your OpenAI API key has been removed for this session.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your Bolt experience</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* API Key Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <View style={styles.sectionContent}>
            <TextInput
              style={styles.textInput}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="Enter your OpenAI API Key (sk-...)"
              placeholderTextColor="#555555"
              secureTextEntry={isApiKeySet && apiKeyInput.includes('•')}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
              <Save size={18} color="#FFFFFF" style={{marginRight: 8}}/>
              <Text style={styles.saveButtonText}>Save API Key</Text>
            </TouchableOpacity>
            {isApiKeySet && (
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveApiKey}>
                <Text style={styles.removeButtonText}>Remove API Key</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.apiKeyStatusText}>
              {isApiKeySet ? 'API Key is set.' : 'API Key is not set.'}
            </Text>
             <Text style={styles.apiNote}>Note: For the API key to persist, add it to app.json (extra.EXPO_PUBLIC_OPENAI_API_KEY) and rebuild, or implement AsyncStorage.</Text>
          </View>
        </View>

        {/* Appearance Settings (Original Style) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.sectionContentOriginal}>
            <SettingItemOriginal
              title="Dark Mode"
              subtitle="Use dark theme for better coding experience"
              icon={<Moon size={20} color="#007AFF" />}
              value={darkMode}
              onToggle={setDarkMode}
              type="toggle"
            />
          </View>
        </View>

        {/* Other Settings (Original Style) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          <View style={styles.sectionContentOriginal}>
            <SettingItemOriginal
              title="Notifications"
              subtitle="Receive updates about new features and tips"
              icon={<Bell size={20} color="#FF6B35" />}
              value={notifications}
              onToggle={setNotifications}
              type="toggle"
            />
            <SettingItemOriginal
              title="Help & Support"
              subtitle="Get help and contact support"
              icon={<HelpCircle size={20} color="#888888" />}
              type="navigation"
              onPress={() => Alert.alert('Help', 'For help and support, please contact our team.')}
            />
            <SettingItemOriginal
              title="About Bolt"
              subtitle="Version 1.0.0 • Learn more about your AI assistant"
              icon={<Info size={20} color="#888888" />}
              type="navigation"
              onPress={() => Alert.alert('About Bolt', 'Bolt AI Assistant v1.0.0')}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for developers</Text>
          <Text style={styles.footerVersion}>Bolt AI Assistant v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for original style settings items
const SettingItemOriginal = ({ title, subtitle, icon, type, value, onToggle, onPress }: any) => (
  <TouchableOpacity
    style={styles.settingItemOriginal}
    onPress={onPress}
    disabled={type === 'toggle'}
  >
    <View style={styles.settingIconOriginal}>{icon}</View>
    <View style={styles.settingContentItemOriginal}>
      <Text style={styles.settingTitleOriginal}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitleOriginal}>{subtitle}</Text>}
    </View>
    <View style={styles.settingActionOriginal}>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#333333', true: '#007AFF' }}
          thumbColor={value ? '#FFFFFF' : '#CCCCCC'}
        />
      )}
      {type === 'navigation' && <ChevronRight size={16} color="#888888" />}
    </View>
  </TouchableOpacity>
);

// Styles adapted from the original settings screen and new API key section
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
    paddingBottom: 40,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  sectionContent: { // For new API key section
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
  },
  sectionContentOriginal: { // For original style sections
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444444',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  apiKeyStatusText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 4,
  },
  apiNote: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  settingItemOriginal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingIconOriginal: {
    width: 40,
    alignItems: 'center',
  },
  settingContentItemOriginal: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitleOriginal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitleOriginal: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 18,
  },
  settingActionOriginal: {
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  footerVersion: {
    fontSize: 14,
    color: '#666666',
  },
});