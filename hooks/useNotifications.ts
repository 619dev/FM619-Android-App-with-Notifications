import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

export interface NotificationHook {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForPushNotifications: () => Promise<string | undefined>;
  scheduleNotification: (title: string, body: string) => Promise<void>;
  checkXiaomiPermissions: () => Promise<void>;
}

export function useNotifications(): NotificationHook {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotifications().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  async function registerForPushNotifications(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
      // 为小米手机创建高优先级通知渠道
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        sound: true,
        enableLights: true,
        enableVibration: true,
        showBadge: true,
      });

      // 创建专门的消息通知渠道
      await Notifications.setNotificationChannelAsync('messages', {
        name: '消息通知',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        sound: true,
        enableLights: true,
        enableVibration: true,
        showBadge: true,
        description: 'FufflyChat 消息提醒',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }
      
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } catch (e) {
        console.error('Error getting push token:', e);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  async function checkXiaomiPermissions(): Promise<void> {
    if (Platform.OS === 'android') {
      // 检测是否为小米设备
      const brand = Device.brand?.toLowerCase();
      const manufacturer = Device.manufacturer?.toLowerCase();
      
      if (brand?.includes('xiaomi') || manufacturer?.includes('xiaomi') || 
          brand?.includes('redmi') || manufacturer?.includes('redmi')) {
        
        Alert.alert(
          '小米手机通知设置',
          '为了确保能正常接收消息通知，请按以下步骤设置：\n\n' +
          '1. 允许应用自启动\n' +
          '2. 关闭省电策略限制\n' +
          '3. 允许后台活动\n' +
          '4. 设置通知为重要\n\n' +
          '是否现在前往设置？',
          [
            { text: '稍后设置', style: 'cancel' },
            { 
              text: '前往设置', 
              onPress: () => {
                // 尝试打开应用设置页面
                Linking.openSettings().catch(() => {
                  Alert.alert('提示', '请手动前往设置 > 应用管理 > FufflyChat 进行设置');
                });
              }
            }
          ]
        );
      }
    }
  }
  async function scheduleNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        channelId: 'messages',
        categoryIdentifier: 'message',
        badge: 1,
      },
      trigger: null,
    });
  }

  return {
    expoPushToken,
    notification,
    registerForPushNotifications,
    scheduleNotification,
    checkXiaomiPermissions,
  };
}