import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Smartphone, CircleCheck as CheckCircle, Settings, Battery, Bell, Shield, Eye } from 'lucide-react-native';

interface PengpaiOSNotificationGuideProps {
  onClose: () => void;
}

export default function PengpaiOSNotificationGuide({ onClose }: PengpaiOSNotificationGuideProps) {
  const steps = [
    {
      icon: Settings,
      title: '打开应用设置',
      description: '设置 > 应用设置 > 应用管理 > FufflyChat',
      details: '在澎湃OS设置中找到应用设置，然后找到 FufflyChat 应用'
    },
    {
      icon: Bell,
      title: '通知管理设置',
      description: '通知管理 > 允许通知 > 开启',
      details: '确保允许应用发送通知，并开启所有通知类型'
    },
    {
      icon: Eye,
      title: '锁屏显示',
      description: '锁屏显示 > 开启',
      details: '允许通知在锁屏界面显示，确保不会错过重要消息'
    },
    {
      icon: Settings,
      title: '横幅样式',
      description: '横幅样式 > 开启',
      details: '开启横幅通知样式，获得更好的通知体验'
    },
    {
      icon: CheckCircle,
      title: '自启动管理',
      description: '自启动管理 > 允许自启动',
      details: '允许应用自启动，确保能够及时接收推送通知'
    },
    {
      icon: Battery,
      title: '省电策略',
      description: '省电策略 > 无限制',
      details: '将应用设置为无限制模式，防止系统杀死应用进程'
    },
    {
      icon: Shield,
      title: '后台弹出界面',
      description: '后台弹出界面 > 允许',
      details: '允许应用在后台弹出界面，确保通知能够正常显示'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Smartphone size={32} color="#FF6900" strokeWidth={2} />
        <Text style={styles.title}>澎湃OS通知设置指南</Text>
        <Text style={styles.subtitle}>
          澎湃OS基于Android 14，需要特殊的通知权限设置才能正常接收 FufflyChat 消息
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

        <View style={styles.importantContainer}>
          <Text style={styles.importantTitle}>⚠️ 重要提醒</Text>
          <Text style={styles.importantText}>
            澎湃OS对通知管理更加严格，建议按顺序完成所有设置步骤。如果仍然无法接收通知，请尝试：
          </Text>
          <View style={styles.additionalSteps}>
            <Text style={styles.additionalStep}>• 重启应用</Text>
            <Text style={styles.additionalStep}>• 重启手机</Text>
            <Text style={styles.additionalStep}>• 检查系统更新</Text>
            <Text style={styles.additionalStep}>• 清除应用缓存后重新设置</Text>
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 澎湃OS专用技巧</Text>
          <Text style={styles.tipText}>
            • 澎湃OS的"智能省电"功能可能影响通知，建议关闭{'\n'}
            • 在"安全中心"中将FufflyChat添加到白名单{'\n'}
            • 使用"通知助手"功能可以提升通知优先级{'\n'}
            • 定期检查应用权限，系统更新后可能需要重新设置
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
    marginBottom: 20,
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
  importantContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  importantText: {
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
    marginBottom: 8,
  },
  additionalSteps: {
    marginLeft: 8,
  },
  additionalStep: {
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
  },
  tipContainer: {
    backgroundColor: '#EBF4FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
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