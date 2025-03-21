// pages/temperature/temperature.js
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
      text: '温度变化趋势',
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
        return params.name + ': ' + params.value[1] + '°C';
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
      name: '温度(°C)',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '温度',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: [],
      itemStyle: {
        color: '#f56c6c'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(245, 108, 108, 0.4)'
        }, {
          offset: 1,
          color: 'rgba(245, 108, 108, 0.1)'
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
    currentTemperature: "加载中...",
    lastUpdateTime: "",
    averageTemp: "--",
    maxTemp: "--",
    minTemp: "--"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadTemperatureData();
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
    this.loadTemperatureData();
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
    this.loadTemperatureData();
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

  // 加载温度历史数据
  loadTemperatureData: function() {
    try {
      // 从本地存储获取历史数据
      const historyData = wx.getStorageSync('sensor_history_data') || [];
      
      if (historyData.length > 0) {
        // 按时间升序排序
        historyData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        
        // 筛选出有温度数据的记录
        const tempData = historyData.filter(item => item.temperature !== undefined && item.temperature !== "");
        
        // 计算统计数据
        if (tempData.length > 0) {
          const temps = tempData.map(item => parseFloat(item.temperature));
          const maxTemp = Math.max(...temps).toFixed(1);
          const minTemp = Math.min(...temps).toFixed(1);
          const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
          
          // 获取最新的温度数据和时间
          const latestData = tempData[tempData.length - 1];
          
          this.setData({
            historyData: tempData,
            currentTemperature: latestData.temperature,
            lastUpdateTime: latestData.timestamp,
            maxTemp: maxTemp,
            minTemp: minTemp,
            averageTemp: avgTemp
          });
        }
      }
    } catch (e) {
      console.error("加载温度数据失败:", e);
    }
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
          item.temperature
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