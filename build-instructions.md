# APK 构建详细说明

## 前置准备

### 1. 创建 Expo 账户
访问 [expo.dev](https://expo.dev) 注册账户

### 2. 获取 Project ID
1. 在 Expo 仪表板创建新项目
2. 复制项目 ID
3. 在 `app.json` 中更新 `extra.eas.projectId`

## 构建步骤

### 快速构建（推荐）

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录账户
eas login

# 3. 构建预览版 APK
eas build --platform android --profile preview
```

### 详细构建流程

#### 步骤 1: 环境准备
```bash
# 确保 Node.js 版本 >= 18
node --version

# 安装全局工具
npm install -g @expo/cli eas-cli

# 验证安装
expo --version
eas --version
```

#### 步骤 2: 项目配置
```bash
# 进入项目目录
cd your-project-directory

# 安装依赖
npm install

# 登录 Expo
eas login
```

#### 步骤 3: 构建配置
```bash
# 如果没有 eas.json，运行此命令创建
eas build:configure
```

#### 步骤 4: 执行构建
```bash
# 开发版本（包含调试信息）
eas build --platform android --profile development

# 预览版本（用于测试分发）
eas build --platform android --profile preview

# 生产版本（用于应用商店）
eas build --platform android --profile production
```

## 构建配置说明

### eas.json 配置文件

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 构建类型说明

- **development**: 包含开发工具，用于调试
- **preview**: 优化版本，用于内部测试
- **production**: 最终发布版本

## 下载和安装

### 构建完成后

1. 构建完成后，EAS 会提供下载链接
2. 下载 APK 文件到设备
3. 在 Android 设备上启用"未知来源"安装
4. 安装 APK 文件

### 分发选项

1. **直接分发**: 将 APK 文件发送给用户
2. **内部测试**: 使用 Google Play Console 内部测试
3. **应用商店**: 发布到 Google Play Store

## 签名和安全

### 自动签名（推荐）
EAS Build 自动处理应用签名，无需手动配置。

### 手动签名
如需自定义签名：

```bash
# 生成密钥库
eas credentials
```

## 故障排除

### 常见构建错误

1. **Project ID 错误**
   - 确保 `app.json` 中的 `projectId` 正确
   - 验证 Expo 账户权限

2. **依赖冲突**
   - 清除 node_modules: `rm -rf node_modules && npm install`
   - 检查 package.json 依赖版本

3. **权限问题**
   - 验证 Android 权限配置
   - 检查敏感权限使用说明

### 调试技巧

```bash
# 查看构建日志
eas build:list

# 查看特定构建详情
eas build:view [BUILD_ID]

# 本地预览构建
eas build --platform android --local
```

## 性能优化

### APK 大小优化

1. **启用 Proguard**（生产构建自动启用）
2. **移除未使用的资源**
3. **压缩图片资源**

### 启动性能

1. **预加载关键资源**
2. **优化 WebView 初始化**
3. **减少启动时的网络请求**

## 发布检查清单

- [ ] 更新版本号（`app.json` 中的 `version` 和 `versionCode`）
- [ ] 测试所有核心功能
- [ ] 验证推送通知工作正常
- [ ] 检查应用图标和启动画面
- [ ] 测试不同屏幕尺寸
- [ ] 验证网络连接处理
- [ ] 确认隐私政策和用户协议

构建完成后，你将获得一个可以直接安装在 Android 设备上的 APK 文件。