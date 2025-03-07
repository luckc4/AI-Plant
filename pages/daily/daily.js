// daily.js
Page({
  data: {
    logs: [],
    showEmptyState: true
  },

  onLoad: function() {
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
  }
})