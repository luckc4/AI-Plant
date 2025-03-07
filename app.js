App({
  onLaunch: function() {
    // Initialize storage for logs if not exists
    wx.getStorage({
      key: 'logs',
      fail: function() {
        wx.setStorage({
          key: 'logs',
          data: []
        });
      }
    });
  }
});