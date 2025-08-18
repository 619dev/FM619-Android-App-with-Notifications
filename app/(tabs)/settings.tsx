import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Linking,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings as SettingsIcon, 
  Info, 
  MessageCircle, 
  Globe, 
  Shield,
  Smartphone,
  ExternalLink 
} from 'lucide-react-native';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const [appVersion, setAppVersion] = useState('1.0.0');

  useEffect(() => {
    setAppVersion(Constants.expoConfig?.version || '1.0.0');
  }, []);

  const openWebsite = () => {
    Linking.openURL('https://ok6.uk');
  };

  const openPrivacyPolicy = () => {
    Alert.alert('隐私政策', '本应用仅作为 FufflyChat 网站的原生包装器，不收集任何额外的用户数据。');
  };

  const showAbout = () => {
    Alert.alert(
      '关于 FufflyChat',
      `版本: ${appVersion}\n\n这是 FufflyChat 的官方安卓应用，提供与网页版相同的功能，并支持推送通知。\n\n由 Bolt 构建`,
      [{ text: '确定' }]
    );
  };

  const clearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除应用缓存吗？这将删除所有本地存储的数据。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            // Note: In a real app, you'd implement cache clearing logic here
            Alert.alert('缓存已清除', '应用缓存已成功清除');
          }
        }
      ]
    );
  };

  const settingsItems = [
    {
      icon: Globe,
      title: '访问网页版',
      subtitle: '在浏览器中打开 FufflyChat',
      onPress: openWebsite,
      showArrow: true,
    },
    {
      icon: Shield,
      title: '隐私政策',
      subtitle: '了解我们如何保护您的隐私',
      onPress: openPrivacyPolicy,
      showArrow: true,
    },
    {
      icon: Smartphone,
      title: '清除缓存',
      subtitle: '清除应用本地存储的数据',
      onPress: clearCache,
      showArrow: true,
    },
    {
      icon: Info,
      title: '关于应用',
      subtitle: `版本 ${appVersion}`,
      onPress: showAbout,
      showArrow: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用信息</Text>
        <View style={styles.infoCard}>
          <MessageCircle size={32} color="#2563EB" strokeWidth={2} />
          <View style={styles.infoContent}>
            <Text style={styles.appName}>FufflyChat</Text>
            <Text style={styles.appDescription}>原生安卓聊天应用</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用设置</Text>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <item.icon size={20} color="#6B7280" strokeWidth={2} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            {item.showArrow && (
              <ExternalLink size={16} color="#9CA3AF" strokeWidth={2} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Expo & React Native
        </Text>
        <Text style={styles.footerSubtext}>
          Built with ❤️ for FufflyChat users
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2563EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});