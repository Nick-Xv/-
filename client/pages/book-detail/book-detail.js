// pages/detail/detail.js
const req = require("../../utils/requests.js");
var star = require("../../utils/star");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        pname:false,
    },
    upper: function () {

    },
    lower: function () {

    },
    scroll: function () {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({ id: options.id });
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        if(options.isIsbn){
            that.setData({
                pname:true
            })
            wx.request({
                url: 'https://www.fkten.xyz/v2/book/isbn/:' + options.id,
                header: { "Content-Type": "json" },
                method: 'GET',
                success:function(res){
                    var types = res.data;
                    var rating = types.rating;
                    rating.block = star.get_star(rating.average);
                    res.data = types;
                    that.setData({ bookInfo: res.data });
                    wx.hideToast();
                }
            })
            return;
        }
        req.getBookById(that.data.id, function (res) {
            var types = res.data;
            var rating = types.rating;
            rating.block = star.get_star(rating.average);
            res.data = types;
            that.setData({ bookInfo: res.data });
            wx.hideToast();
        });
    },

    onTapToCreate: function () {
        var that = this;
        var openId = wx.getStorageSync("userInfo");
        if(this.data.pname == true){
            wx.request({
                url: 'https://www.fkten.xyz/v2/book/isbn/:' + that.data.id,
                header: { "Content-Type": "json" },
                method: 'GET',
                success: function (res) {
                    wx.setStorageSync('searchedbook', res.data);
                }
            })
        }
        else{
            req.getBookById(that.data.id, function (res) {
                wx.setStorageSync('searchedbook', res.data);
            });
        }
        wx.showModal({
            title: '添加新计划',
            content: '添加当前查找书籍为新计划？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.redirectTo({
                        url: "../../pages/plan/plan-add/plan-add",
                    })
                }
                else{
                    wx.removeStorageSync("searchedbook")
                }
            }
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

    }
})