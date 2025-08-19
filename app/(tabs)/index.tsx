import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, Platform, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle } from 'lucide-react-native';

export default function ChatScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);

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

  // For web platform, show a message instead of WebView
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

  // Basic JavaScript injection for mobile optimization
  const injectedJavaScript = `
    document.addEventListener('DOMContentLoaded', function() {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      }
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.touchAction = 'manipulation';
    });
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2563EB" />
      
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>连接失败</Text>
          <Text style={styles.errorMessage}>无法加载 FM619</Text>
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
            userAgent="FM619-Android-App/1.0"
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>正在加载 FM619...</Text>
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