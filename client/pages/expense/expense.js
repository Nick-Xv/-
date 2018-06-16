// pages/expense/expense.js

var chart = require("../../utils/chart.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 请参阅 https://github.com/ioneday/wxchart */
    chart.draw(this, 'canvas1', {
      hideYaxis: false,
      color: ['#394655', '#74DAE5', '#ED7672', '#F3AA59', '#FEE746'],
      title: {
        text: "年支出",
        color: "#333333",
        size: 16
      },
      xAxis: {
        color: "#666A73",
        size: 10,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月' , '12月']
      },
      series: [
        {
          name: " ",
          category: "bar", //切换柱状图或折线图
          data: [37, 63, 60, 78, 92, 63, 57, 48, 78, 38, 11, 34]
        }
      ]
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})