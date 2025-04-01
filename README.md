# AI-Plant 智能植物培养箱

<div align="center">
  <img src="images/logo.png" alt="AI-Plant Logo" width="200"/>
  <p>基于微信小程序的智能植物养护助手</p>
</div>

## 📋 项目概述

AI-Plant 是一款创新的智能植物养护小程序，将人工智能技术与植物监测功能完美结合，为用户提供全方位的植物养护解决方案。本项目采用微信云开发架构，结合先进的 AI 大模型技术，致力于帮助植物爱好者更好地了解和照顾他们的植物。

### 🌟 核心优势
- 智能化的植物生长环境监测
- 基于 AI 的植物健康诊断
- 个性化的养护建议
- 便捷的养护日志管理
- 实时的天气数据集成

## 🚀 主要功能

### 1. 智能天气查询
- 接入和风天气 API，提供精准的天气数据
- 支持 24 小时天气预报
- 7 天天气趋势分析
- 智能天气提醒服务

### 2. AI 智能诊断
- 集成 DeepSeek R1 大模型
- 植物健康状况智能分析
- 个性化养护建议生成
- 常见植物问题诊断

### 3. 植物生长监测
- 实时环境数据采集
- 温度、湿度、光照等关键指标监控
- 数据可视化展示
- 异常情况智能预警

### 4. 养护日志系统
- 便捷的日志记录功能
- 生长历程追踪
- 养护计划制定
- 数据统计分析

## 🛠️ 技术架构

### 前端技术栈
- 微信小程序原生框架
- WeUI 组件库
- ECharts 图表库

### 后端技术栈
- 微信云开发
- 云函数
- 云数据库
- 云存储

### AI 能力
- DeepSeek R1 大模型
- 计算机视觉分析
- 自然语言处理

## 📦 安装部署

### 环境要求
- Node.js >= 14.0.0
- 微信开发者工具 >= 2.2.3
- 微信云开发环境

### 安装步骤
```bash
git clone https://github.com/luckc4/AI-Plant.git
cd AI-Plant
npm init
npm install -y
```

## ⚙️ 配置说明

### 1. 云开发环境配置
1. 登录微信云开发控制台
2. 创建云开发环境
3. 获取环境 ID
4. 在 `app.js` 中配置环境 ID

```javascript
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "your-env-id",  //填写自己的云开发环境id
      traceUser: true,
    });
  }
});
```

### 2. AI 服务配置
// pages/analysis/analysis.js
```javascript
data: {
    agentConfig: {
      type: "bot", // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
      botId: "bot-80e6ea14", // agent id
      allowWebSearch: true, // 允许客户端选择启用联网搜索
      allowUploadFile: true, // 允许上传文件
      allowPullRefresh: true, // 允许下拉刷新
      allowUploadImage: true, // 允许上传图片
    },
  },
```


## 📁 项目结构
```
AI-Plant
├── components/          # 自定义组件
│   ├── agent-ui/       # AI 交互组件
│   └── navigation-bar/ # 导航栏组件
├── images/             # 图片资源
├── pages/              # 小程序页面
│   ├── index/         # 首页
│   ├── monitor/       # 监测页面
│   ├── analysis/      # 分析页面
│   ├── daily/         # 日志页面
│   └── addLog/        # 添加日志页面
├── utils/              # 工具函数
├── app.js              # 小程序入口文件
├── app.json            # 小程序全局配置
└── app.wxss            # 小程序全局样式
```

## 📱 使用指南

### 1. 首页功能
- 植物生长状态概览
- 快捷功能入口
- 重要数据展示
- 智能提醒

### 2. 监测页面
- 实时环境数据展示
- 历史数据趋势图
- 异常数据标记
- 数据导出功能

### 3. 分析页面
- 植物照片上传
- AI 智能诊断
- 养护建议生成
- 问题解决方案

### 4. 日志页面
- 养护记录管理
- 生长历程追踪
- 数据统计分析
- 养护计划制定

## ⚠️ 注意事项

1. 开发环境配置
   - 确保使用最新版本的微信开发者工具
   - 正确配置云开发环境
   - 安装所需依赖包

2. 运行要求
   - 保持网络连接稳定
   - 确保云开发服务正常运行
   - 检查 AI 服务配置是否正确

3. 使用限制
   - AI 功能需要网络连接
   - 部分功能可能需要用户授权
   - 注意 API 调用频率限制

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交代码前，请确保：
1. 代码符合项目规范
2. 添加必要的注释
3. 更新相关文档
4. 通过所有测试

## 📞 联系方式

- 邮箱：1143829504@qq.com
- 微信：18569872119
- 项目主页：[GitHub](https://github.com/luckc4/AI-Plant)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---
<div align="center">
  © 2025.03.17 AI-Plant. All Rights Reserved.
</div>
