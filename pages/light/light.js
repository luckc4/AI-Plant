// pages/light/light.js
import * as echarts from '../../ec-canvas/echarts';

let chart = null;

// 初始化图表函数
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  // 设置图表配置项
  const option = {
    title: {
      text: '光照强度变化趋势',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        return params.name + ': ' + params.value[1] + ' lux';
      },
      axisPointer: {
        animation: false
      }
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '15%',
      bottom: '15%'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '光照强度(lux)',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '光照强度',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: [],
      itemStyle: {
        color: '#ff9800'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(255, 152, 0, 0.4)'
        }, {
          offset: 1,
          color: 'rgba(255, 152, 0, 0.1)'
        }])
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    historyData: [],
    currentLightIntensity: "加载中...",
    lastUpdateTime: "",
    averageLightIntensity: "--",
    maxLightIntensity: "--",
    minLightIntensity: "--",
    lightLevel: "--" // 光照级别评估
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadLightIntensityData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面初次渲染完成后，等待图表组件初始化完成
    setTimeout(() => {
      this.updateChart();
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时重新加载数据并更新图表
    this.loadLightIntensityData();
    setTimeout(() => {
      this.updateChart();
    }, 300);
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
    this.loadLightIntensityData();
    setTimeout(() => {
      this.updateChart();
      wx.stopPullDownRefresh();
    }, 500);
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

  // 加载光照强度历史数据
  loadLightIntensityData: function() {
    try {
      // 从本地存储获取历史数据
      const historyData = wx.getStorageSync('sensor_history_data') || [];
      
      if (historyData.length > 0) {
        // 按时间升序排序
        historyData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        
        // 筛选出有光照强度数据的记录
        const lightData = historyData.filter(item => item.lightIntensity !== undefined && item.lightIntensity !== "");
        
        // 计算统计数据
        if (lightData.length > 0) {
          const lightValues = lightData.map(item => parseFloat(item.lightIntensity));
          const maxLightIntensity = Math.max(...lightValues).toFixed(0);
          const minLightIntensity = Math.min(...lightValues).toFixed(0);
          const avgLightIntensity = (lightValues.reduce((a, b) => a + b, 0) / lightValues.length).toFixed(0);
          
          // 获取最新的光照强度数据和时间
          const latestData = lightData[lightData.length - 1];
          
          // 评估光照级别
          const lightLevel = this.evaluateLightLevel(parseFloat(latestData.lightIntensity));
          
          this.setData({
            historyData: lightData,
            currentLightIntensity: latestData.lightIntensity,
            lastUpdateTime: latestData.timestamp,
            maxLightIntensity: maxLightIntensity,
            minLightIntensity: minLightIntensity,
            averageLightIntensity: avgLightIntensity,
            lightLevel: lightLevel
          });
        }
      }
    } catch (e) {
      console.error("加载光照强度数据失败:", e);
    }
  },

  // 评估光照级别
  evaluateLightLevel: function(lightIntensity) {
    if (lightIntensity < 50) return "黑暗";
    if (lightIntensity < 200) return "很暗";
    if (lightIntensity < 500) return "暗";
    if (lightIntensity < 1000) return "室内照明";
    if (lightIntensity < 2000) return "明亮";
    if (lightIntensity < 5000) return "非常明亮";
    if (lightIntensity < 30000) return "白天自然光";
    return "直射阳光";
  },

  // 更新图表数据
  updateChart: function() {
    if (!chart) {
      console.log('图表还未初始化');
      return;
    }
    
    const chartData = this.data.historyData.map(item => {
      return {
        name: item.timestamp,
        value: [
          new Date(item.rawTimestamp),
          item.lightIntensity
        ]
      };
    });
    
    if (chartData.length > 0) {
      chart.setOption({
        series: [{
          data: chartData
        }]
      });
    }
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
})