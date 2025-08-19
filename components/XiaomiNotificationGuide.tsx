import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Smartphone, CheckCircle, Settings, Battery, Bell } from 'lucide-react-native';

interface XiaomiNotificationGuideProps {
  onClose: () => void;
}

export default function XiaomiNotificationGuide({ onClose }: XiaomiNotificationGuideProps) {
  const steps = [
    {
      icon: Settings,
      title: '打开应用设置',
      description: '设置 > 应用管理 > FufflyChat',
      details: '在手机设置中找到应用管理，然后找到 FufflyChat 应用'
    },
    {
      icon: CheckCircle,
      title: '开启自启动',
      description: '允许应用自启动',
      details: '在应用信息页面，找到"自启动管理"，开启 FufflyChat 的自启动权限'
    },
    {
      icon: Battery,
      title: '关闭省电策略',
      description: '设置为"无限制"',
      details: '在"省电策略"或"电池优化"中，将 FufflyChat 设置为"无限制"模式'
    },
    {
      icon: Bell,
      title: '允许后台活动',
      description: '开启后台活动权限',
      details: '确保应用可以在后台运行，接收推送通知'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Smartphone size={32} color="#FF6900" strokeWidth={2} />
        <Text style={styles.title}>小米手机通知设置指南</Text>
        <Text style={styles.subtitle}>
          为了确保能正常接收 FufflyChat 消息通知，请按以下步骤进行设置
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepIcon}>
                <step.icon size={20} color="#FF6900" strokeWidth={2} />
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
            <Text style={styles.stepDetails}>{step.details}</Text>
          </View>
        ))}

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 小贴士</Text>
          <Text style={styles.tipText}>
            • 不同版本的 MIUI 界面可能略有差异{'\n'}
            • 如果找不到某个选项，可以在设置中搜索关键词{'\n'}
            • 设置完成后建议重启应用以确保生效
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>我知道了</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9A3412',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#C2410C',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6900',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6900',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepIcon: {
    marginRight: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: '#FF6900',
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 44,
  },
  stepDetails: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginLeft: 44,
  },
  tipContainer: {
    backgroundColor: '#EBF4FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#FF6900',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});