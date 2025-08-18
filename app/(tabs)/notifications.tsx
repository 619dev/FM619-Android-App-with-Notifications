import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Switch,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { Bell, BellOff, Settings as SettingsIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
    loadNotifications();
    
    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        title: notification.request.content.title || 'FufflyChat',
        body: notification.request.content.body || '新消息',
        time: new Date().toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        read: false,
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      saveNotifications([newNotification, ...notifications]);
    });

    return () => subscription.remove();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.enabled ?? true);
        setSoundEnabled(parsed.sound ?? true);
        setVibrationEnabled(parsed.vibration ?? true);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (enabled: boolean, sound: boolean, vibration: boolean) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify({
        enabled,
        sound,
        vibration
      }));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (notifs: NotificationItem[]) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(notifs));
    } catch (error) {
      console.log('Error saving notifications:', error);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await saveSettings(value, soundEnabled, vibrationEnabled);
    
    if (!value) {
      Alert.alert('通知已关闭', '您将不会收到新消息提醒');
    }
  };

  const handleToggleSound = async (value: boolean) => {
    setSoundEnabled(value);
    await saveSettings(notificationsEnabled, value, vibrationEnabled);
  };

  const handleToggleVibration = async (value: boolean) => {
    setVibrationEnabled(value);
    await saveSettings(notificationsEnabled, soundEnabled, value);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    Alert.alert(
      '清除通知',
      '确定要清除所有通知记录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            setNotifications([]);
            saveNotifications([]);
          }
        }
      ]
    );
  };

  const testNotification = async () => {
    if (!notificationsEnabled) {
      Alert.alert('通知已关闭', '请先开启通知功能');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'FufflyChat 测试',
        body: '这是一条测试通知消息',
        sound: soundEnabled,
      },
      trigger: null,
    });
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, item.read && styles.readText]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationBody, item.read && styles.readText]}>
          {item.body}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通知中心</Text>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text style={styles.clearButton}>清除全部</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>通知设置</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            {notificationsEnabled ? (
              <Bell size={20} color="#2563EB" strokeWidth={2} />
            ) : (
              <BellOff size={20} color="#6B7280" strokeWidth={2} />
            )}
            <Text style={styles.settingLabel}>接收通知</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
            thumbColor={notificationsEnabled ? '#2563EB' : '#9CA3AF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <SettingsIcon size={20} color="#6B7280" strokeWidth={2} />
            <Text style={styles.settingLabel}>声音提醒</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={handleToggleSound}
            disabled={!notificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
            thumbColor={soundEnabled ? '#2563EB' : '#9CA3AF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <SettingsIcon size={20} color="#6B7280" strokeWidth={2} />
            <Text style={styles.settingLabel}>振动提醒</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={handleToggleVibration}
            disabled={!notificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
            thumbColor={vibrationEnabled ? '#2563EB' : '#9CA3AF'}
          />
        </View>

        <TouchableOpacity style={styles.testButton} onPress={testNotification}>
          <Text style={styles.testButtonText}>发送测试通知</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>通知历史</Text>
        
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#D1D5DB" strokeWidth={1} />
            <Text style={styles.emptyText}>暂无通知</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    fontSize: 16,
    color: '#BFDBFE',
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  testButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsSection: {
    flex: 1,
    margin: 16,
    marginTop: 0,
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  readText: {
    color: '#9CA3AF',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
});