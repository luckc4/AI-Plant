import mqtt from'../../utils/mqtt.js';
const aliyunOpt = require('../../utils/aliyun/aliyun_connect.js');

let that = null;
Page({
    data:{

      //设置各项传感器参数
      temperature:"",
      humidity:"",
      co2:"",
      soilMoisture:"",
      lightIntensity:"",
      fanSpeed:"",
      activeCard: "", // 当前激活的卡片

      client:null,//记录重连的次数
      reconnectCounts:0,//MQTT连接的配置
      options:{
        protocolVersion: 4, //MQTT连接协议版本
        clean: false,
        reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
        connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
        resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
        clientId: '',
        password: '',
        username: '',
      },

      aliyunInfo: {
        productKey: "a1uej7IgjFk",
        deviceName: "weChat",
        deviceSecret: "d3627c63e3a025e25b591cc9938afc32",
        regionId: 'cn-shanghai', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
        pubTopic: '/a1uej7IgjFk/weChat/user/topic', //发布消息的主题
        subTopic: '/a1uej7IgjFk/weChat/user/topic', //订阅消息的主题
        
      },
    },

  onLoad:function(){
    that = this;
    
    // 获取系统信息设置背景图
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    });
    
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
    console.log("this.data.options host:" + host);
    console.log("this.data.options data:" + JSON.stringify(this.data.options));

    //访问服务器
    this.data.client = mqtt.connect(host, this.data.options);

    this.data.client.on('connect', function (connack) {
      wx.showToast({
        title: '连接成功'
      })
      console.log("连接成功");
      
      // 连接成功后立即订阅主题
      that.data.client.subscribe(that.data.aliyunInfo.subTopic, function(err) {
        if(!err) {
          console.log("订阅成功");
        }
      });
    })

    //接收消息监听
    this.data.client.on("message", function (topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload);
      try {
        const data = JSON.parse(payload);
        that.setData({
          temperature: data.currentTemperature || that.data.temperature,
          humidity: data.humidity || that.data.humidity,
          co2: data.co2 || that.data.co2,
          soilMoisture: data.soilMoisture || that.data.soilMoisture,
          lightIntensity: data.lightIntensity || that.data.lightIntensity,
          fanSpeed: data.fanSpeed || that.data.fanSpeed
        });
      } catch (e) {
        console.error("解析消息失败:", e);
      }
    })

    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)

    })
    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })
    //服务器连接异常的回调
    that.data.client.on("offline", function (errr) {
      console.log(" 服务器offline的回调")
    })
  },
  
  // 卡片点击事件处理函数
  onCardTap: function(e) {
    const type = e.currentTarget.dataset.type;
    
    // 如果点击的是当前已激活的卡片，则取消激活状态
    if (this.data.activeCard === type) {
      this.setData({
        activeCard: ""
      });
    } else {
      // 否则激活点击的卡片
      this.setData({
        activeCard: type
      });
    }
  }
})