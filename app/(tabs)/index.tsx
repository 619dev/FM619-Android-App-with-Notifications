import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, Platform, TouchableOpacity, Linking, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { MessageCircle } from 'lucide-react-native';
import { useNotifications } from '@/hooks/useNotifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { expoPushToken, checkXiaomiPermissions, scheduleNotification } = useNotifications();
  const [hasCheckedXiaomi, setHasCheckedXiaomi] = useState(false);
  const [isPengpaiOS, setIsPengpaiOS] = useState(false);

  useEffect(() => {
    // 检测澎湃OS
    checkIfPengpaiOS();
    
    // 检查小米手机权限设置
    if (!hasCheckedXiaomi) {
      setTimeout(() => {
        if (isPengpaiOS) {
          // 澎湃OS使用专门的检查方法
          console.log('Detected PengpaiOS, using specialized notification setup');
        } else {
          checkXiaomiPermissions();
        }
        setHasCheckedXiaomi(true);
      }, 2000); // 延迟2秒显示，避免干扰用户体验
    }

    // Listen for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // You can handle notification taps here
    });

    // 监听应用状态变化
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        // 应用进入后台时发送保活通知（仅小米设备）
        const brand = Device.brand?.toLowerCase();
        if (brand?.includes('xiaomi') || brand?.includes('redmi')) {
          scheduleKeepAliveNotification();
        }
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      appStateSubscription?.remove();
    };
  }, []);

  const checkIfPengpaiOS = async () => {
    try {
      const brand = Device.brand?.toLowerCase();
      const manufacturer = Device.manufacturer?.toLowerCase();
      const osVersion = Device.osVersion;
      
      // 检测澎湃OS的特征
      const isPengpai = (brand?.includes('xiaomi') || manufacturer?.includes('xiaomi') || 
                        brand?.includes('redmi') || manufacturer?.includes('redmi')) &&
                       (osVersion?.includes('14') || parseInt(osVersion || '0') >= 14);
      
      setIsPengpaiOS(isPengpai);
    } catch (error) {
      console.log('Error detecting PengpaiOS:', error);
    }
  };

  const scheduleKeepAliveNotification = async () => {
    try {
      // 发送一个静默的保活通知（澎湃OS优化）
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'FM619',
          body: isPengpaiOS ? '澎湃OS保持连接中...' : '保持连接中...',
          sound: false,
          priority: isPengpaiOS ? Notifications.AndroidNotificationPriority.DEFAULT : Notifications.AndroidNotificationPriority.LOW,
          channelId: isPengpaiOS ? 'pengpai_priority' : 'default',
          data: { 
            type: 'keepalive',
            pengpaiOS: isPengpaiOS,
          },
        },
        trigger: {
          seconds: isPengpaiOS ? 60 : 30, // 澎湃OS使用更长的间隔
        },
      });
    } catch (error) {
      console.log('Keep alive notification error:', error);
    }
  };
  const openInBrowser = async () => {
    const url = 'https://ok6.uk';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('错误', '无法打开链接');
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    webViewRef.current?.reload();
  };

  // For web platform, show a message instead of WebView to avoid cross-origin issues
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#2563EB" />
        <View style={styles.webMessageContainer}>
          <MessageCircle size={64} color="#2563EB" />
          <Text style={styles.webMessageTitle}>FM619</Text>
          <Text style={styles.webMessageText}>
            在网页版中，请直接访问 FM619 网站获得最佳体验
          </Text>
          <TouchableOpacity style={styles.openButton} onPress={openInBrowser}>
            <Text style={styles.openButtonText}>打开 FM619</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Inject JavaScript to improve mobile experience
  const injectedJavaScript = `
    // Add mobile-specific optimizations
    document.addEventListener('DOMContentLoaded', function() {
      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      }
      
      // Hide browser UI elements if any
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      // Improve touch interactions
      document.body.style.touchAction = 'manipulation';
      
      // 澎湃OS专用优化
      if (window.navigator.userAgent.includes('PengpaiOS') || 
          window.navigator.userAgent.includes('Android 14')) {
        document.body.style.webkitTapHighlightColor = 'transparent';
        document.body.style.webkitTouchCallout = 'none';
      }
    });
    
    // Listen for new messages and trigger local notifications
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      // You can customize this to detect new messages based on the site's behavior
      if (args.some(arg => typeof arg === 'string' && arg.includes('message'))) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'NEW_MESSAGE',
          data: args
        }));
      }
      originalConsoleLog.apply(console, args);
    };
    
    true; // Required for injected JavaScript
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'NEW_MESSAGE') {
        // 使用针对澎湃OS优化的通知方法
        const title = isPengpaiOS ? 'FM619 澎湃OS' : 'FM619';
        const body = isPengpaiOS ? '您有新消息 (澎湃OS优化)' : '您有新消息';
        await scheduleNotification(title, body);
      }
    } catch (error) {
      console.log('Error handling message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2563EB" />
      
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>连接失败</Text>
          <Text style={styles.errorMessage}>无法加载 FufflyChat</Text>
          <Text style={styles.retryButton} onPress={handleRetry}>
            重新尝试
          </Text>
        </View>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://ok6.uk' }}
            style={styles.webview}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            onMessage={handleMessage}
            injectedJavaScript={injectedJavaScript}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            allowsLinkPreview={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            userAgent={isPengpaiOS ? "FM619-PengpaiOS-App/1.0" : "FM619-Android-App/1.0"}
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>
                {isPengpaiOS ? '正在加载 FM619 (澎湃OS优化)...' : '正在加载 FM619...'}
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  webMessageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  webMessageText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  openButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});