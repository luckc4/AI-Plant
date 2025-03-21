// pages/soil/soil.js
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
      text: '土壤湿度变化趋势',
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
        return params.name + ': ' + params.value[1] + '%';
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
      name: '土壤湿度(%)',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '土壤湿度',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: [],
      itemStyle: {
        color: '#795548'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(121, 85, 72, 0.4)'
        }, {
          offset: 1,
          color: 'rgba(121, 85, 72, 0.1)'
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
    currentSoilMoisture: "加载中...",
    lastUpdateTime: "",
    averageSoilMoisture: "--",
    maxSoilMoisture: "--",
    minSoilMoisture: "--",
    soilState: "--" // 土壤湿度状态评估
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSoilMoistureData();
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
    this.loadSoilMoistureData();
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
    this.loadSoilMoistureData();
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

  // 加载土壤湿度历史数据
  loadSoilMoistureData: function() {
    try {
      // 从本地存储获取历史数据
      const historyData = wx.getStorageSync('sensor_history_data') || [];
      
      if (historyData.length > 0) {
        // 按时间升序排序
        historyData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        
        // 筛选出有土壤湿度数据的记录
        const soilData = historyData.filter(item => item.soilMoisture !== undefined && item.soilMoisture !== "");
        
        // 计算统计数据
        if (soilData.length > 0) {
          const soilValues = soilData.map(item => parseFloat(item.soilMoisture));
          const maxSoilMoisture = Math.max(...soilValues).toFixed(1);
          const minSoilMoisture = Math.min(...soilValues).toFixed(1);
          const avgSoilMoisture = (soilValues.reduce((a, b) => a + b, 0) / soilValues.length).toFixed(1);
          
          // 获取最新的土壤湿度数据和时间
          const latestData = soilData[soilData.length - 1];
          
          // 评估土壤湿度状态
          const soilState = this.evaluateSoilState(parseFloat(latestData.soilMoisture));
          
          this.setData({
            historyData: soilData,
            currentSoilMoisture: latestData.soilMoisture,
            lastUpdateTime: latestData.timestamp,
            maxSoilMoisture: maxSoilMoisture,
            minSoilMoisture: minSoilMoisture,
            averageSoilMoisture: avgSoilMoisture,
            soilState: soilState
          });
        }
      }
    } catch (e) {
      console.error("加载土壤湿度数据失败:", e);
    }
  },

  // 评估土壤湿度状态
  evaluateSoilState: function(soilMoistureLevel) {
    if (soilMoistureLevel < 20) return "干燥";
    if (soilMoistureLevel < 40) return "稍干";
    if (soilMoistureLevel < 60) return "适宜";
    if (soilMoistureLevel < 80) return "湿润";
    return "过湿";
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
          item.soilMoisture
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