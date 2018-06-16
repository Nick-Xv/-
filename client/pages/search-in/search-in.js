// pages/search/search.js
const req = require("../../utils/requests.js");
var star = require("../../utils/star");
var startt = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        immediateReturn: false
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    newPlan: function (e) {
        wx.setStorageSync('searchedbook', e.currentTarget.dataset.detail)
        wx.navigateBack({
        })
    },
    search: function () {
        var that = this
        if (that.data.inputVal == "") {
            return
        }
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 120000
        })
        startt = 0
        wx.request({
            url: 'https://www.fkten.xyz/v2/book/search?q=' + that.data.inputVal + '&start=' + startt + '&count=10',
            header: {
                "Content-Type": "json"
            },
            success(result) {
                var books = result.data.books;
                for (var i = 0; i < books.length; ++i) {
                    var book = books[i];
                    var rating = book.rating;

                    rating.block = star.get_star(rating.average);
                }
                that.setData({ books: result.data.books });
                wx.hideToast();
            }
        })
    },
    onReachBottom: function () {
        var that = this
        if (startt < 100) {
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 120000
            })
            startt += 10
            wx.request({
                url: 'https://www.fkten.xyz/v2/book/search?q=' + that.data.inputVal + '&start=' + startt + '&count=' + 10 + '',
                header: {
                    "Content-Type": "json"
                },
                success(result) {
                    var books = result.data.books;
                    for (var i = 0; i < books.length; ++i) {
                        var book = books[i];
                        var rating = book.rating;
                        rating.block = star.get_star(rating.average);
                    }
                    that.setData({ books: that.data.books.concat(result.data.books) });
                    wx.hideToast();
                }
            })

        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.immediateReturn) {
            this.setData({ immediateReturn: options.immediateReturn })
        }
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

    }
})