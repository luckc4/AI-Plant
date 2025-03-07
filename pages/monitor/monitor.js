Page({
  data: {
    activeCard: null,
    sensorData: {
      temperature: '25.4°C',
      humidity: '65%',
      soilMoisture: '78%',
      lightIntensity: '850lx',
      co2: '420ppm',
      fanSpeed: '3档'
    },
    progressData: {
      temperature: 70,
      humidity: 65,
      soilMoisture: 78,
      lightIntensity: 50,
      co2: 42,
      fanSpeed: 60
    }
  },

  handleCardTap: function(e) {
    const cardType = e.currentTarget.dataset.card;
    
    // 如果点击的是当前活跃卡片，则取消活跃状态
    if (this.data.activeCard === cardType) {
      this.setData({
        activeCard: null
      });
    } else {
      // 否则，设置当前卡片为活跃状态
      this.setData({
        activeCard: cardType
      });
      
      // 设置定时器，3秒后自动取消活跃状态
      setTimeout(() => {
        if (this.data.activeCard === cardType) {
          this.setData({
            activeCard: null
          });
        }
      }, 3000);
    }
  },

  handleLargeCardTap: function() {
    // 大卡片点击事件 - 可以用于显示图片
    wx.showToast({
      title: '正在加载图片...',
      icon: 'loading',
      duration: 2000
    });
    // 这里可以添加显示图片的逻辑
  }
});