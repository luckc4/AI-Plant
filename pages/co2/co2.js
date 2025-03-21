// pages/co2/co2.js
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
      text: 'CO₂浓度变化趋势',
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
        return params.name + ': ' + params.value[1] + ' ppm';
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
      name: 'CO₂ (ppm)',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: 'CO₂浓度',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: [],
      itemStyle: {
        color: '#8e44ad'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(142, 68, 173, 0.4)'
        }, {
          offset: 1,
          color: 'rgba(142, 68, 173, 0.1)'
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
    currentCO2: "加载中...",
    lastUpdateTime: "",
    averageCO2: "--",
    maxCO2: "--",
    minCO2: "--",
    airQuality: "--" // 空气质量评估
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCO2Data();
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
    this.loadCO2Data();
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
    this.loadCO2Data();
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

  // 加载CO2历史数据
  loadCO2Data: function() {
    try {
      // 从本地存储获取历史数据
      const historyData = wx.getStorageSync('sensor_history_data') || [];
      
      if (historyData.length > 0) {
        // 按时间升序排序
        historyData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        
        // 筛选出有CO2数据的记录
        const co2Data = historyData.filter(item => item.co2 !== undefined && item.co2 !== "");
        
        // 计算统计数据
        if (co2Data.length > 0) {
          const co2Values = co2Data.map(item => parseFloat(item.co2));
          const maxCO2 = Math.max(...co2Values).toFixed(0);
          const minCO2 = Math.min(...co2Values).toFixed(0);
          const avgCO2 = (co2Values.reduce((a, b) => a + b, 0) / co2Values.length).toFixed(0);
          
          // 获取最新的CO2数据和时间
          const latestData = co2Data[co2Data.length - 1];
          
          // 评估空气质量
          const airQuality = this.evaluateAirQuality(parseFloat(latestData.co2));
          
          this.setData({
            historyData: co2Data,
            currentCO2: latestData.co2,
            lastUpdateTime: latestData.timestamp,
            maxCO2: maxCO2,
            minCO2: minCO2,
            averageCO2: avgCO2,
            airQuality: airQuality
          });
        }
      }
    } catch (e) {
      console.error("加载CO2数据失败:", e);
    }
  },

  // 评估空气质量
  evaluateAirQuality: function(co2Level) {
    if (co2Level < 400) return "极佳";
    if (co2Level < 700) return "优良";
    if (co2Level < 1000) return "良好";
    if (co2Level < 1500) return "一般";
    if (co2Level < 2000) return "较差";
    if (co2Level < 5000) return "差";
    return "危险";
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
          item.co2
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