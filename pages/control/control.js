// pages/control/control.js

// 导入mqtt和aliyun连接配置
import mqtt from '../../utils/mqtt.js';
const aliyunOpt = require('../../utils/aliyun/aliyun_connect.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plants: [], // 当前添加的植物列表
    currentIndex: 0, // 当前显示的植物索引
    centerPlantId: '', // 当前中间植物的ID
    showAddPanel: false, // 是否显示添加面板
    showRemovePanel: false, // 是否显示删除面板
    
    scrollPosition: 0, // 控制滚动位置
    
    // 可用的蔬菜列表
    availableVegetables: [
      { name: '土豆', image: '土豆.png', type: 'vegetable' },
      { name: '大蒜', image: '大蒜.png', type: 'vegetable' },
      { name: '萝卜', image: '萝卜.png', type: 'vegetable' },
      { name: '菠菜', image: '菠菜.png', type: 'vegetable' }
    ],
    
    // 可用的花卉列表
    availableFlowers: [
      { name: '玫瑰', image: '玫瑰.png', type: 'flower' },
      { name: '牡丹', image: '牡丹.png', type: 'flower' },
      { name: '月季', image: '月季.png', type: 'flower' },
      { name: '茉莉', image: '茉莉.png', type: 'flower' }
    ],
    
    nextPlantId: 1, // 下一个植物ID

    // MQTT 连接相关
    client: null,
    reconnectCounts: 0,
    options: {
      protocolVersion: 4,
      clean: false,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      resubscribe: true,
      clientId: '',
      password: '',
      username: '',
    },
    aliyunInfo: {
      productKey: "a10exP5nHAz",
      deviceName: "WeChat",
      deviceSecret: "3fd715b1f05214b4893f1db9fec3fde3",
      regionId: 'cn-shanghai',
      pubTopic: '/a10exP5nHAz/WeChat/user/WeChat',
      subTopic: '/a1uej7IgjFk/weChat/user/get',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从本地缓存加载已保存的植物
    const plants = wx.getStorageSync('user_plants') || [];
    
    // 设置下一个植物ID
    let nextId = 1;
    if (plants.length > 0) {
      // 找出当前最大ID并+1
      const maxId = Math.max(...plants.map(p => p.id));
      nextId = maxId + 1;
    }
    
    this.setData({
      plants: plants,
      nextPlantId: nextId
    });
    
    // 更新可用植物列表
    this.updateAvailablePlants();
    
    // 如果有植物，设置中间植物ID
    if (plants.length > 0) {
      this.selectPlant({currentTarget: {dataset: {index: 0}}});
    }

    // 初始化MQTT连接
    this.initMqttConnection();
  },

  // 初始化MQTT连接
  initMqttConnection() {
    let that = this;
    let clientOpt = aliyunOpt.getAliyunIotMqttClient({
      productKey: that.data.aliyunInfo.productKey,
      deviceName: that.data.aliyunInfo.deviceName,
      deviceSecret: that.data.aliyunInfo.deviceSecret,
      regionId: that.data.aliyunInfo.regionId,
      port: that.data.aliyunInfo.port,
    });
    
    console.log("get data:" + JSON.stringify(clientOpt));
    let host = 'wxs://' + clientOpt.host;
    
    this.setData({
      'options.clientId': clientOpt.clientId,
      'options.password': clientOpt.password,
      'options.username': clientOpt.username,
    })
    
    // 访问服务器
    const client = mqtt.connect(host, this.data.options);
    this.setData({ client: client });
    
    client.on('connect', function (connack) {
      wx.showToast({
        title: '连接成功'
      })
      console.log("连接成功");
    });
    
    // 服务器连接异常的回调
    client.on("error", function (error) {
      console.log("服务器 error 的回调" + error)
    });
  },

  // 发送命令函数
  sendCommond(cmd, data) {
    let sendData = {
      // cmd: cmd,
      data: data,
    };
    // 发布消息
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish(this.data.aliyunInfo.pubTopic, JSON.stringify(sendData));
      console.log("发送控制命令:", this.data.aliyunInfo.pubTopic);
      console.log("发送数据:", JSON.stringify(sendData));
      
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 确认按钮点击事件
  onConfirm() {
    if (this.data.plants.length === 0 || this.data.currentIndex >= this.data.plants.length) {
      wx.showToast({
        title: '请先添加植物',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 获取当前选中的植物
    const currentPlant = this.data.plants[this.data.currentIndex];
    let controlCode = "a"; // 默认代码
    
    // 根据植物名称设置对应的控制代码
    switch(currentPlant.name) {
      case '菠菜':
        controlCode = "b";
        break;
      case '大蒜':
        controlCode = "b";
        break;
      case '萝卜':
        controlCode = "d";
        break;
      case '玫瑰':
        controlCode = "e";
        break;
      case '茉莉':
        controlCode = "f";
        break;
      case '牡丹':
        controlCode = "g";
        break;
      case '土豆':
        controlCode = "h";
        break;
      case '月季':
        controlCode = "i";
        break;
      default:
        controlCode = "j";
    }
    
    console.log("确认当前植物:", currentPlant.name, "控制代码:", controlCode);
    this.sendCommond('set', controlCode);
  },

  // 取消按钮点击事件
  onCancel() {
    console.log("取消操作");
    this.sendCommond('set', "0000");
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 滑动事件处理
  onScroll(e) {
    // 可以用于处理滚动动画，这里暂不实现具体逻辑
  },

  // 轮播图变化事件
  swiperChange(e) {
    const index = e.detail.current;
    this.selectPlant({currentTarget: {dataset: {index}}});
  },

  // 选择植物
  selectPlant(e) {
    const index = e.currentTarget.dataset.index;
    if (index < 0 || index >= this.data.plants.length) return;
    
    // 计算需要显示哪个植物ID
    const plantId = this.data.plants[index].id;
    
    this.setData({
      currentIndex: index,
      centerPlantId: `plant-${plantId}`
    });
    
    // 为了确保植物名称居中显示，需要在下一个渲染周期后计算滚动位置
    setTimeout(() => {
      // 获取植物名称元素，计算滚动位置
      const query = wx.createSelectorQuery();
      query.select(`#plant-${plantId}`).boundingClientRect();
      query.select('.plant-names-container').boundingClientRect();
      query.exec(res => {
        if (res[0] && res[1]) {
          const plantNameRect = res[0];
          const containerRect = res[1];
          // 计算需要滚动的位置，使选中的植物名称居中
          const scrollPosition = (plantNameRect.left + plantNameRect.width / 2) - (containerRect.left + containerRect.width / 2);
          this.setData({
            scrollPosition: scrollPosition
          });
        }
      });
    }, 50);
  },

  // 显示添加植物面板
  showAddPanel() {
    this.setData({
      showAddPanel: true,
      showRemovePanel: false
    });
  },

  // 显示删除植物面板
  showRemovePanel() {
    this.setData({
      showRemovePanel: true,
      showAddPanel: false
    });
  },

  // 隐藏面板
  hidePanel() {
    this.setData({
      showAddPanel: false,
      showRemovePanel: false
    });
  },

  // 添加植物
  addPlant(e) {
    const plant = e.currentTarget.dataset.plant;
    
    // 复制植物对象并添加ID
    const newPlant = {
      ...plant,
      id: this.data.nextPlantId
    };
    
    // 更新植物列表和下一个ID
    const plants = [...this.data.plants, newPlant];
    this.setData({
      plants: plants,
      nextPlantId: this.data.nextPlantId + 1,
      showAddPanel: false
    });
    
    // 设置新添加的植物为中心
    this.selectPlant({currentTarget: {dataset: {index: plants.length - 1}}});
    
    // 保存到本地存储
    wx.setStorageSync('user_plants', plants);
    
    // 更新可用植物列表
    this.updateAvailablePlants();
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除植物
  removePlant(e) {
    const id = e.currentTarget.dataset.id;
    
    // 找到要删除的植物
    const plantIndex = this.data.plants.findIndex(p => p.id === id);
    if (plantIndex === -1) return;
    
    const removedPlant = this.data.plants[plantIndex];
    
    // 更新植物列表
    const plants = this.data.plants.filter(p => p.id !== id);
    this.setData({
      plants: plants,
      showRemovePanel: false
    });
    
    // 如果还有植物，更新中心植物
    if (plants.length > 0) {
      // 如果删除的是当前显示的植物或之前的植物，则当前索引需要调整
      let newIndex = this.data.currentIndex;
      if (plantIndex <= this.data.currentIndex) {
        newIndex = Math.max(0, this.data.currentIndex - 1);
      }
      
      this.selectPlant({currentTarget: {dataset: {index: newIndex}}});
    }
    
    // 保存到本地存储
    wx.setStorageSync('user_plants', plants);
    
    // 更新可用植物列表
    this.updateAvailablePlants();
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  // 更新可用植物列表
  updateAvailablePlants() {
    // 获取当前已添加的植物名称
    const plantNames = this.data.plants.map(p => p.name);
    
    // 更新可用蔬菜列表
    const availableVegetables = [
      { name: '土豆', image: '土豆.png', type: 'vegetable' },
      { name: '大蒜', image: '大蒜.png', type: 'vegetable' },
      { name: '萝卜', image: '萝卜.png', type: 'vegetable' },
      { name: '菠菜', image: '菠菜.png', type: 'vegetable' }
    ].filter(v => !plantNames.includes(v.name));
    
    // 更新可用花卉列表
    const availableFlowers = [
      { name: '玫瑰', image: '玫瑰.png', type: 'flower' },
      { name: '牡丹', image: '牡丹.png', type: 'flower' },
      { name: '月季', image: '月季.png', type: 'flower' },
      { name: '茉莉', image: '茉莉.png', type: 'flower' }
    ].filter(f => !plantNames.includes(f.name));
    
    this.setData({
      availableVegetables,
      availableFlowers
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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

  }
})