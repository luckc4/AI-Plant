// pages/history/history.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyData: [],
    isRefreshing: false, // 下拉刷新状态
    headerScrollLeft: 0 // 用于同步表头和数据的水平滚动位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从本地存储加载历史数据
    this.loadHistoryData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log("页面渲染完成");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时刷新数据
    this.loadHistoryData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 从本地存储加载历史数据
  loadHistoryData: function() {
    try {
      const historyData = wx.getStorageSync('sensor_history_data') || [];
      // 按时间倒序排列
      historyData.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
      
      this.setData({
        historyData: historyData
      });
      
      console.log("已加载历史数据, 共" + historyData.length + "条记录");
    } catch (e) {
      console.error("加载历史数据失败:", e);
    }
  },
  
  // 处理数据区域的滚动事件，同步表头滚动位置
  onDataScroll: function(e) {
    if (e.detail.scrollLeft !== undefined) {
      this.setData({
        headerScrollLeft: e.detail.scrollLeft
      });
      
      // 同步表头滚动位置
      const headerScrollView = wx.createSelectorQuery().select('.header-scroll-view');
      if (headerScrollView) {
        headerScrollView.node(function(res) {
          if (res && res.node) {
            res.node.scrollLeft = e.detail.scrollLeft;
          }
        }).exec();
      }
    }
  },
  
  // 清除历史数据
  clearHistoryData: function() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史数据吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('sensor_history_data');
            this.setData({
              historyData: []
            });
            wx.showToast({
              title: '数据已清除',
              icon: 'success'
            });
          } catch (e) {
            console.error("清除数据失败:", e);
          }
        }
      }
    });
  },

  // 返回首页
  goBack: function() {
    wx.navigateBack();
  },

  // 导出数据功能
  exportData: function() {
    const historyData = wx.getStorageSync('sensor_history_data') || [];
    
    if (historyData.length === 0) {
      wx.showToast({
        title: '无数据可导出',
        icon: 'none'
      });
      return;
    }
    
    // 转换为CSV格式
    let csvContent = "时间,温度,湿度,CO2,土壤湿度,光照强度,风扇强度\n";
    historyData.forEach(item => {
      csvContent += `${item.timestamp},${item.temperature},${item.humidity},${item.co2 || ''},${item.soilMoisture || ''},${item.lightIntensity || ''},${item.fanSpeed || ''}\n`;
    });
    
    // 使用文件系统API保存
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/sensor_data.csv`;
    
    try {
      fs.writeFileSync(filePath, csvContent, 'utf8');
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      });
      
      // 提供更多选项给用户
      wx.showModal({
        title: '导出成功',
        content: '数据已导出为CSV格式',
        confirmText: '分享文件',
        cancelText: '确定',
        success: (res) => {
          if (res.confirm) {
            // 尝试分享文件
            wx.shareFileMessage({
              filePath: filePath,
              success: () => {
                console.log('文件分享成功');
              },
              fail: (err) => {
                console.error('文件分享失败:', err);
                wx.showToast({
                  title: '分享失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    } catch (err) {
      console.error('导出数据失败:', err);
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      });
    }
  },

  // 下拉刷新相关函数
  onPulling: function() {
    // 下拉过程中触发
    console.log('下拉刷新中...');
  },
  
  onRefresh: function() {
    // 下拉刷新触发
    console.log('开始刷新数据');
    this.setData({
      isRefreshing: true
    });
    
    // 重新加载数据
    setTimeout(() => {
      this.loadHistoryData();
      this.setData({
        isRefreshing: false
      });
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1000
      });
    }, 800);
  },
  
  onRestore: function() {
    // 下拉刷新复位
    console.log('下拉刷新复位');
  },
  
  onAbort: function() {
    // 下拉刷新中断
    console.log('下拉刷新中断');
    this.setData({
      isRefreshing: false
    });
  }
})