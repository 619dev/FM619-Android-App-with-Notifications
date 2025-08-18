# FufflyChat Android App

这是 FufflyChat 的官方安卓应用，基于 Expo 和 React Native 构建。

## 功能特性

- 🌐 完整的 FufflyChat 网页功能
- 📱 原生安卓应用体验
- 🔔 推送通知支持
- 📊 通知历史记录
- ⚙️ 个性化设置选项

## 本地开发

### 环境要求

- Node.js 18+
- Expo CLI
- Android Studio（可选，用于本地构建）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

## 构建 APK

### 方式一：使用 EAS Build（推荐）

1. 安装 EAS CLI：
```bash
npm install -g eas-cli
```

2. 登录 Expo 账户：
```bash
eas login
```

3. 构建 APK：
```bash
# 预览版本（用于测试）
eas build --platform android --profile preview

# 生产版本
eas build --platform android --profile production
```

### 方式二：本地构建

1. 生成原生代码：
```bash
npx expo prebuild
```

2. 构建 APK：
```bash
cd android
./gradlew assembleRelease
```

## 配置说明

### Expo Project ID

在 `app.json` 中更新你的 Expo Project ID：

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id"
      }
    }
  }
}
```

### 推送通知

应用已配置推送通知功能：
- 支持本地通知
- 支持远程推送通知
- 可自定义通知声音和振动
- 通知历史记录管理

### 权限说明

应用请求以下权限：
- `INTERNET`: 访问网络
- `VIBRATE`: 通知振动
- `RECEIVE_BOOT_COMPLETED`: 开机自启动通知服务
- `WAKE_LOCK`: 保持设备唤醒状态

## 发布到应用商店

### Google Play Store

1. 在 Google Play Console 创建应用
2. 使用 EAS Submit 上传：
```bash
eas submit --platform android
```

### 直接分发 APK

构建完成后，你可以直接分发 APK 文件给用户安装。

## 故障排除

### 常见问题

1. **推送通知不工作**
   - 确保设备是真实设备（不是模拟器）
   - 检查通知权限是否已授予
   - 验证 Expo Project ID 配置

2. **WebView 加载失败**
   - 检查网络连接
   - 确认目标网站可访问
   - 查看错误日志

3. **构建失败**
   - 确保所有依赖已正确安装
   - 检查 Android SDK 配置
   - 查看构建日志详细信息

## 技术栈

- **框架**: Expo SDK 53
- **导航**: Expo Router
- **UI**: React Native
- **通知**: Expo Notifications
- **存储**: AsyncStorage
- **图标**: Lucide React Native

## 支持

如有问题，请查看 [Expo 文档](https://docs.expo.dev/) 或联系开发团队。