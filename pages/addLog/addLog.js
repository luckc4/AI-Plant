// addLog.js
Page({
  data: {
    content: ''
  },

  // 输入内容改变时触发
  onInputChange: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 点击保存按钮
  saveLog: function() {
    // 检查是否有内容
    if (!this.data.content || this.data.content.trim() === '') {
      wx.showToast({
        title: '记录失败',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    // 获取当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const date = `${year}/${month}/${day}`;
    const time = `${hours}:${minutes}`;
    
    // 构建日志对象
    const log = {
      date: date,
      time: time,
      content: this.data.content
    };

    // 获取已有日志并添加新日志
    const that = this;
    wx.getStorage({
      key: 'logs',
      success: function(res) {
        const logs = res.data || [];
        logs.unshift(log); // 添加到开头
        
        // 保存到缓存
        wx.setStorage({
          key: 'logs',
          data: logs,
          success: function() {
            // 保存为JSON文件
            that.saveAsJson(logs);
            
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 1000
            });
            
            setTimeout(function() {
              wx.navigateBack();
            }, 1000);
          }
        });
      },
      fail: function() {
        // 如果没有已有日志，创建新数组
        const logs = [log];
        
        // 保存到缓存
        wx.setStorage({
          key: 'logs',
          data: logs,
          success: function() {
            // 保存为JSON文件
            that.saveAsJson(logs);
            
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 1000
            });
            
            setTimeout(function() {
              wx.navigateBack();
            }, 1000);
          }
        });
      }
    });
  },

  // 保存为JSON文件
  saveAsJson: function(logs) {
    const formattedLogs = logs.map(log => {
      return {
        date: log.date,
        time: log.time,
        content: [log.content]  // 使用数组格式
      };
    });
    
    const jsonString = JSON.stringify(formattedLogs, null, 2);
    
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/log.json`;
    
    fs.writeFile({
      filePath: filePath,
      data: jsonString,
      encoding: 'utf8',
      success: function() {
        console.log('JSON文件保存成功:', filePath);
      },
      fail: function(err) {
        console.error('保存JSON文件失败:', err);
      }
    });
  },

  // 点击返回按钮
  goBack: function() {
    if (this.data.content && this.data.content.trim() !== '') {
      wx.showModal({
        title: '提示',
        content: '您还没有保存日志，确定要返回吗？',
        success: function(res) {
          if (res.confirm) {
            wx.showToast({
              title: '记录失败',
              icon: 'none',
              duration: 1000
            });
            setTimeout(function() {
              wx.navigateBack();
            }, 1000);
          }
        }
      });
    } else {
      wx.showToast({
        title: '记录失败',
        icon: 'none',
        duration: 1000
      });
      setTimeout(function() {
        wx.navigateBack();
      }, 1000);
    }
  }
})