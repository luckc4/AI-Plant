App({
  onLaunch: function() {
    // Initialize storage for logs if not exists

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "cloud1-4gaqbk1a32ca7043",
        traceUser: true,
      });
    }

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