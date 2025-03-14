// addLog.js
Page({
  data: {
    content: '',
    isEdit: false,
    editIndex: -1,
    date: '',
    time: ''
  },

  onLoad: function(options) {
    if (options.content) {
      this.setData({
        content: decodeURIComponent(options.content),
        isEdit: true,
        editIndex: parseInt(options.index),
        date: options.date,
        time: options.time
      });
    }
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

    const that = this;
    
    // 如果是编辑模式
    if (this.data.isEdit) {
      wx.getStorage({
        key: 'logs',
        success: function(res) {
          const logs = res.data || [];
          // 更新日志内容，保持时间不变
          logs[that.data.editIndex].content = that.data.content;
          
          // 保存到缓存
          wx.setStorage({
            key: 'logs',
            data: logs,
            success: function() {
              // 保存为JSON文件
              that.saveAsJson(logs);
              
              wx.showToast({
                title: '更新成功',
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
      return;
    }

    // 新建日志模式
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
    // 日志位置 C:\Users\Zhao\AppData\Local\微信开发者工具\User Data\eaaa0d18cc7146ef72d12a979e425647\WeappSimulator\WeappFileSystem\o6zAJs8wGQ_X83t0LCOO0jjxMTYg\wxfe0ef9c05ca14c4f\usr\log.json
    
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
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  }
});