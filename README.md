# AI-Plant 智能植物培养箱


## 项目概述

AI-Plant是一个基于微信小程序的智能植物p培养箱助手应用，结合了AI技术与植物监测功能，帮助用户更好地了解和照顾植物。该项目利用微信云开发服务与AI大模型能力，为植物爱好者提供一站式植物养护解决方案。


## 主要功能
- **天气查询**：接入和风天气api,实现当日24小时和7天的天气查询功能
- **AI问答**：接入deepseek r1大模型，技术分析植物状况，提供养护建议
- **植物监测**：实时监测植物生长环境数据
- **养护日志**：用户自行记录植物的生长历程



## 安装指南

```bash
git clone https://github.com/luckc4/AI-Plant.git
cd AI-Plant
npm init
npm install -y
```

## 配置说明

### 1. 前置条件

#### 1.1 开通微信云开发

AI-Plant依赖微信云开发AI服务，请确保已开通微信云开发服务。如已开通，请前往云开发平台(`https://tcb.cloud.tencent.com/dev`)创建AI服务。

#### 1.2 创建AI服务

- 直接使用agent智能体服务


### 2. 项目配置

#### 2.1 配置云开发环境ID

在`app.js`文件中配置您的云开发环境ID：

```javascript
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "你的云环境ID", // 填入您的环境id
        traceUser: true,
      });
    }
  },
});
```

#### 2.2 配置AI服务

在对应页面JS文件中配置agent-ui组件，根据您的需求选择配置方式：

**方式一：对接agent服务**

```javascript
agentConfig: {
  type: "bot",
  botId: "your-bot-id", 
  modelName: "", 
  model: "",
  logo: "",
  welcomeMessage: ""
}
```

**方式二：对接AI大模型**

```javascript
agentConfig: {
  type: "model",
  botId: "", 
  modelName: "hunyuan", // 可选：hunyuan, deepseek等
  model: "hunyuan-lite", // 具体的模型版本
  logo: "",
  welcomeMessage: ""
}
```

## 项目结构

```
AI-Plant
├── components          // 自定义组件
│   ├── agent-ui        // AI交互组件
│   └── navigation-bar  // 导航栏组件
├── images              // 图片资源
├── pages               // 小程序页面
│   ├── index           // 首页
│   ├── monitor         // 监测页面
│   ├── analysis        // 分析页面
│   ├── daily           // 日志页面
│   └── addLog          // 添加日志页面
├── utils               // 工具函数
├── app.js              // 小程序入口文件
├── app.json            // 小程序全局配置
└── app.wxss            // 小程序全局样式
```

## 小程序使用指南

1. **首页**：展示植物概况和快捷入口
2. **监测页**：查看植物生长环境数据，包括温度、湿度、光照等
3. **分析页**：上传植物照片或描述问题，获取AI分析和建议
4. **日志页**：记录和查看植物生长历程，添加养护记录

## 注意事项

1. 使用前请确保已正确配置云环境和AI服务
2. 请使用微信开发者工具2.2.3或以上版本
3. AI功能需要网络连接才能正常使用


## 联系方式

QQ:1143829504@qq.com
WeChat:18569872119
---

© 2025.03.17 AI-Plant. All Rights Reserved.
