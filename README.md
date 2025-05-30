# 懒人绿洲 🌿

<div align="center">
  <img src="images\project_logo.png" alt="AI-Plant Logo" width="180"/>
  <p><strong>您的贴心智能植物养护助手</strong></p>
  <p><em>让每一颗植物都充满爱与阳光</em> ✨</p>
</div>

## 🌱 项目心语

在快节奏的现代生活中，我们常常渴望一片属于自己的宁静绿洲。AI-Plant 诞生的初衷，便是希望通过科技的力量，连接人与自然，让植物养护变得简单而愉悦。我们相信，即使是没有专业知识背景的用户，也能在 AI-Plant 的陪伴下，轻松养护自己的绿植，享受生命成长的喜悦。

正如您在小程序中看到的【项目背景】：
> 当今社会快节奏生活方式下，人们压力增大，而美丽的植物恰好能提供人们心灵的慰藉，尤其是自己亲手培育的绿植。
> 同时室内植物能改善生活环境、净化空气、缓解压力。
> 但许多人因缺乏专业知识和持续关注而导致植物生长状况不佳。
> 懒人绿洲正是针对这一痛点，将先进技术与植物学知识相结合，降低植物养护门槛，提高生活幸福度。

我们致力于将 AI-Plant 打造成您最温馨、最智能的植物伙伴。

## 🌟 核心功能一览

AI-Plant 集成了多项实用功能，旨在为您提供全方位的植物养护支持：

| 功能展示                                     | 描述                                                                 |
| :-------------------------------------------: | :------------------------------------------------------------------- |
| <img src="images\home.png" alt="首页天气" width="250"/> | **实时天气与环境感知** <br /> 温馨首页展示当地天气 (如北京东城，22℃)，以及植物生长所需关键环境因素，助您轻松掌握环境动态。 |
| <img src="images\monitor.png" alt="监测页面" width="250"/>     | **多维度生长监测** <br /> 精确监测环境温度、湿度、CO₂浓度、土壤湿度和光照强度，数据卡片式呈现，一目了然。更有历史数据追溯与生长监控。 |
| <img src="images\analysis.png" alt="AI分析" width="250"/>      | **AI 私人植物专家** <br /> "你好，我是你的私人植物专家，有什么需求都可向我询问，我会都帮你解答"。随时随地获得专业的养护建议和问题诊断。 |
| <img src="images\daily.png" alt="植物日志" width="250"/>    | **记录成长点滴** <br /> 便捷的植物生长日志功能，轻松记录浇水、施肥、发芽等重要时刻，回顾植物的每一个成长瞬间。     |

### 💡 技术创新
> 引入天气系统，可以以及时根据当前天气和未来天气，调整植物培养箱中传感器数值，改变温湿度，CO₂浓度，光照强度，土壤湿度。

## 🛠️ 技术栈揭秘

AI-Plant 的实现离不开以下这些优秀的技术：

### 前端
- 微信小程序原生框架
- WeUI 组件库 (用于基础样式)
- ECharts 图表库 (用于数据可视化)

### 后端 (基于微信云开发)
- 云函数 (Serverless 架构，处理业务逻辑)
- 云数据库 (存储用户信息、植物数据、日志等)
- 云存储 (存储图片等静态资源)

### 核心 AI 能力
- 集成先进大模型 (如 DeepSeek R1 或 腾讯混元)
- 计算机视觉分析 (辅助植物识别与状态评估)
- 自然语言处理 (赋能 AI 植物专家对话系统)

## 🚀 快速上手指南

想要体验 AI-Plant 吗？请遵循以下步骤：

### 环境准备
- Node.js (建议版本 >= 14.0.0)
- 最新版微信开发者工具
- 一个已开通的微信云开发环境

### 安装步骤
```bash
# 1. 克隆项目到本地
git clone https://github.com/luckc4/AI-Plant.git

# 2. 进入项目目录
cd AI-Plant

# 3. 初始化项目并安装依赖 (如果项目中有 package.json)
# npm init -y (如果还没有 package.json)
# npm install
```
*(请根据您的项目实际情况调整 `npm` 命令，如果项目中没有 `package.json` 或不需要额外依赖，则可跳过 `npm` 相关步骤)*

### ⚙️ 配置您的专属环境

#### 1. 微信云开发环境
1.  打开微信开发者工具，导入本项目。
2.  登录您的微信云开发控制台。
3.  创建一个新的云开发环境，或使用现有环境。
4.  复制您的云开发环境 ID。
5.  在项目根目录下的 `app.js` 文件中，找到如下代码并替换为您自己的环境 ID：

```javascript
// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "your-cloud-env-id",  // 替换成您的云开发环境 ID
      traceUser: true,
    });
  }
});
```

#### 2. AI 服务配置 (智能诊断功能)
为了启用 AI 智能诊断功能，您需要在 `pages/analysis/analysis.js` 文件中配置 AI 服务。

**选项一：使用 Bot 服务 (示例)**
```javascript
// pages/analysis/analysis.js
// ... 其他代码 ...
data: {
  agentConfig: {
    type: "bot", // 类型为 bot
    botId: "your-bot-id", // 替换成您的 Bot ID
    modelName: "", 
    model: "",
    logo: "", // 可选：机器人头像
    welcomeMessage: "" // 可选：欢迎语
  },
  // ... 其他 data 属性 ...
},
// ... 其他代码 ...
```

**选项二：直接对接 AI 大模型 (示例)**
```javascript
// pages/analysis/analysis.js
// ... 其他代码 ...
data: {
  agentConfig: {
    type: "model", // 类型为 model
    botId: "", 
    modelName: "hunyuan", // 例如：'hunyuan', 'deepseek' 等
    model: "hunyuan-lite", // 模型的具体版本
    logo: "", // 可选：模型提供方 Logo
    welcomeMessage: "" // 可选：自定义欢迎语
  },
  // ... 其他 data 属性 ...
},
// ... 其他代码 ...
```
*请根据您选择的 AI 服务商和模型，填写正确的配置信息。*

## 📂 项目文件结构

```
AI-Plant/
├── components/          # 自定义组件 (如 AI 交互、导航栏)
│   ├── agent-ui/
│   └── navigation-bar/
├── images/              # 项目图片资源 (Logo, 截图等)
├── pages/               # 小程序的核心页面
│   ├── index/           # 温馨首页
│   ├── monitor/         # 生长监测页
│   ├── analysis/        # AI 分析与诊断页
│   ├── daily/           # 植物日志列表页
│   └── addLog/          # 添加/编辑日志页
├── utils/               # 工具函数库
├── app.js               # 小程序逻辑入口
├── app.json             # 小程序公共配置
├── app.wxss             # 小程序公共样式表
└── README.md            # 就是您现在看到的这个文件 :)
```

## 📱 使用小贴士

### 首页 (`pages/index/`)
-   快速概览植物的整体状况。
-   便捷访问天气信息和各项核心功能。
-   接收智能养护提醒。

### 监测页面 (`pages/monitor/`)
-   实时查看各项环境数据。
-   通过图表分析历史数据趋势。
-   留意异常数据预警。

### 分析页面 (`pages/analysis/`)
-   上传植物照片，让 AI 帮您看看。
-   获取智能诊断结果和个性化养护建议。

### 日志页面 (`pages/daily/` & `pages/addLog/`)
-   随时记录植物的生长变化和养护操作。
-   回顾植物的成长历程。

## ⚠️ 温馨提示

1.  **开发环境**：请确保使用最新稳定版的微信开发者工具，并正确配置云开发环境。
2.  **网络要求**：AI 功能、天气服务等需要稳定的网络连接。
3.  **API 限制**：若使用第三方 API 服务，请留意其调用频率限制。
4.  **用户授权**：部分功能（如获取位置信息用于天气）可能需要用户明确授权。

## 🤝 一起贡献

我们热忱欢迎您为 AI-Plant 项目贡献代码或提出宝贵建议！
-   发现 Bug？请提交 Issue。
-   有新功能想法或改进？欢迎提交 Pull Request。
-   在贡献代码前，请尽量确保代码风格统一，并添加必要的注释。

## 📞 联系我们

-   **邮箱**：1143829504@qq.com
-   **微信**：18569872119
-   **项目 GitHub**：[https://github.com/luckc4/AI-Plant](https://github.com/luckc4/AI-Plant)

## 📄 开源许可

本项目基于 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---
<div align="center">
  <p><em>AI-Plant © 2025.03.17 (示例日期) - 用❤️智养每一株生命</em></p>
</div>
