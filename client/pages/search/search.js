// pages/search/search.js
const req = require("../../utils/requests.js");
var star = require("../../utils/star");
var config = require('../../config');
var util = require('../../utils/util.js');
var startt = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        immediateReturn: false,
        blocks: []
    },

    bookSearch: function (event) {
        wx.navigateTo({
            url: '../search-in/search-in'
        })
    },

    bookCode: function () {
        var that = this;
        var openId = wx.getStorageSync("userInfo");
        var qrcode1 = openId['openId'];
        wx.scanCode({
            success: (res) => {
                /*this.show = "结果:" + res.result + "条形码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;*/
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.request({
                    url: `${config.service.host}/weapp/Scancode/index/${qrcode1}/${res.result}`,
                    login: false,
                    success(result) {
                        util.showSuccess('请求成功完成')
                    },
                    fail(error) {
                        util.showModel('请求失败', error);
                    }
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '失败',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: (res) => {
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        var that = this

        startt = 0
        wx.request({
            url: `${config.service.host}/weapp/plan/getHotList`,
            header: {
                "Content-Type": "json"
            },
            success(result) {
                var books = result.data;
                for (var i = 0; i < 10; i++) {
                    var book = result.data[i];
                    book.blocks = star.get_star(book.rating);
                }
                that.setData({ books: result.data });
            }
        })
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

    }
})