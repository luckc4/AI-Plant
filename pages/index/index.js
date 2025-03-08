// 智能植物培养箱微信小程序页面 - 文章式布局（可滚动）
Page({
  data: {
    // 轮播图数据
    bannerImages: [
      '/images/plant-box-1.jpg',
      '/images/plant-box-2.jpg',
      '/images/plant-box-3.jpg',
    ],
    // 页面标题
    title: "智能植物培养箱",
    // Logo数据
    logo: '/images/logo.jpg'
  },
  
  onLoad: function() {
    // 页面加载时的逻辑
    wx.setNavigationBarTitle({
      title: '智能植物培养箱'
    });
  },
  
  // 分享按钮点击事件
  onShareAppMessage: function() {
    return {
      title: '智能植物培养箱——用实验室级的环境控制技术',
      path: '/pages/index/index'
    }
  }
});