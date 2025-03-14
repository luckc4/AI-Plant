// daily.js
Page({
  data: {
    logs: [],
    showEmptyState: true,
    windowHeight: 0,
    windowWidth: 0
  },

  onLoad: function() {
    // 获取系统信息设置背景图
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    });
    this.loadLogs();
  },

  onShow: function() {
    this.loadLogs();
  },

  // Load logs from storage
  loadLogs: function() {
    const that = this;
    wx.getStorage({
      key: 'logs',
      success: function(res) {
        const logs = res.data || [];
        that.setData({
          logs: logs,
          showEmptyState: logs.length === 0
        });
      },
      fail: function() {
        that.setData({
          logs: [],
          showEmptyState: true
        });
      }
    });
  },

  // Navigate to log entry page
  addNewLog: function() {
    wx.navigateTo({
      url: '/pages/addLog/addLog'
    });
  },

  // Edit existing log
  editLog: function(e) {
    const index = e.currentTarget.dataset.index;
    const log = this.data.logs[index];
    wx.navigateTo({
      url: `/pages/addLog/addLog?content=${encodeURIComponent(log.content)}&date=${log.date}&time=${log.time}&index=${index}`
    });
  }
})