import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';

export interface NotificationHook {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForPushNotifications: () => Promise<string | undefined>;
  scheduleNotification: (title: string, body: string) => Promise<void>;
  checkXiaomiPermissions: () => Promise<void>;
  checkPengpaiOSPermissions: () => Promise<void>;
}

// 定义后台任务
const BACKGROUND_NOTIFICATION_TASK = 'background-notification';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }
  
  // 在后台保持通知服务活跃
  console.log('Background notification task running');
});

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

    // 检测澎湃OS
    const isPengpaiOS = await checkIfPengpaiOS();

    if (Platform.OS === 'android') {
      // 为小米手机和澎湃OS创建高优先级通知渠道
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: isPengpaiOS ? Notifications.AndroidImportance.HIGH : Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        sound: true,
        enableLights: true,
        enableVibration: true,
        showBadge: true,
      });

      // 创建专门的消息通知渠道（澎湃OS优化）
      await Notifications.setNotificationChannelAsync('messages', {
        name: '消息通知',
        importance: isPengpaiOS ? Notifications.AndroidImportance.MAX : Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        sound: true,
        enableLights: true,
        enableVibration: true,
        showBadge: true,
        description: 'FufflyChat 消息提醒',
      });

      // 澎湃OS专用通知渠道
      if (isPengpaiOS) {
        await Notifications.setNotificationChannelAsync('pengpai_priority', {
          name: '澎湃OS优先通知',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 100, 100, 100, 100, 100],
          lightColor: '#FF6900',
          sound: true,
          enableLights: true,
          enableVibration: true,
          showBadge: true,
          description: '澎湃OS专用高优先级通知渠道',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }
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

  async function checkIfPengpaiOS(): Promise<boolean> {
    try {
      const osVersion = Device.osVersion;
      const brand = Device.brand?.toLowerCase();
      const manufacturer = Device.manufacturer?.toLowerCase();
      
      // 检测澎湃OS的特征
      const isPengpai = (brand?.includes('xiaomi') || manufacturer?.includes('xiaomi') || 
                        brand?.includes('redmi') || manufacturer?.includes('redmi')) &&
                       (osVersion?.includes('14') || parseInt(osVersion || '0') >= 14);
      
      return isPengpai;
    } catch (error) {
      console.log('Error detecting PengpaiOS:', error);
      return false;
    }
  }

  async function checkPengpaiOSPermissions(): Promise<void> {
    const isPengpaiOS = await checkIfPengpaiOS();
    
    if (isPengpaiOS) {
      Alert.alert(
        '澎湃OS通知设置',
        '澎湃OS需要特殊的通知权限设置，请按以下步骤操作：\n\n' +
        '1. 设置 > 应用设置 > 应用管理 > FufflyChat\n' +
        '2. 通知管理 > 允许通知 > 开启\n' +
        '3. 锁屏显示 > 开启\n' +
        '4. 横幅样式 > 开启\n' +
        '5. 自启动管理 > 允许自启动\n' +
        '6. 省电策略 > 无限制\n' +
        '7. 后台弹出界面 > 允许\n\n' +
        '是否现在前往设置？',
        [
          { text: '稍后设置', style: 'cancel' },
          { 
            text: '前往设置', 
            onPress: () => {
              Linking.openSettings().catch(() => {
                Alert.alert('提示', '请手动前往 设置 > 应用设置 > 应用管理 > FufflyChat 进行设置');
              });
            }
          }
        ]
      );
    }
  }

  async function checkXiaomiPermissions(): Promise<void> {
    const isPengpaiOS = await checkIfPengpaiOS();
    
    // 如果是澎湃OS，使用专门的设置指南
    if (isPengpaiOS) {
      await checkPengpaiOSPermissions();
      return;
    }
    
    // 传统MIUI设置
    if (Platform.OS === 'android') {
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
    const isPengpaiOS = await checkIfPengpaiOS();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: isPengpaiOS ? Notifications.AndroidNotificationPriority.MAX : Notifications.AndroidNotificationPriority.HIGH,
        channelId: isPengpaiOS ? 'pengpai_priority' : 'messages',
        categoryIdentifier: 'message',
        badge: 1,
        sticky: isPengpaiOS, // 澎湃OS使用粘性通知
        data: {
          pengpaiOS: isPengpaiOS,
          timestamp: Date.now(),
        },
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
    checkPengpaiOSPermissions,
  };
}