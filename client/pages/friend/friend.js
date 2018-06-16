// pages/friend/friend.js
import { DBFriend } from '../../db/DBFriend.js';
var QR = require("../../utils/qrcode.js");
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        friends: {},
        hiddenmodalput: true,
        showModalStatus: false,
        imagePath: '',
        canvasHidden: false,
        maskHidden: true,
        placeholder: 'http://wxapp-union.com',
        device: [
            { iconurl: '/images/icon/wx_app_list.png', title: '好友读书排行榜', tap: 'onTapToRank' },

        ],
        data: []
    },

    modalinput: function () {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput
        })
    },
    //取消按钮  
    cancel: function () {
        this.setData({
            hiddenmodalput: true
        });
    },
    //确认  
    confirm: function () {
        this.setData({
            hiddenmodalput: true
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var dbFriend = new DBFriend();
        this.setData({
            friends: dbFriend.getAllFriendData()
        })
        var that = this
        var openId = wx.getStorageSync("userInfo");
        var qrcode1 = openId['openId'];
        wx.request({
            url: `${config.service.host}/weapp/friend/friendListDetail/${qrcode1}`,
            success: function (res) {
                var aaa;
                for (var i = 0; i < res.data.length; i++) {
                    aaa = 'data[' + i + '].userId'
                    that.setData({ [aaa]: res.data[i].openId })
                    aaa = 'data[' + i + '].avatarUrl'
                    that.setData({ [aaa]: res.data[i].avatarUrl })
                    aaa = 'data[' + i + '].nickName'
                    that.setData({ [aaa]: res.data[i].nickName })
                    aaa = 'data[' + i + '].planFinished'
                    that.setData({ [aaa]: res.data[i].annualPlanF })
                    aaa = 'data[' + i + '].planNumYear'
                    that.setData({ [aaa]: res.data[i].annualPlan })
                }
                dbFriend.execSetStorageSync(that.data.data)
                that.setData({
                    friends: dbFriend.getAllFriendData()
                })
            }
        })
    },

    //按键：跳转到好友读书排行榜
    onTapToRank(event) {
        wx.navigateTo({
            url: 'friend-rank/friend-rank'
        })
    },

    createQRCode(event) {
        wx.navigateTo({
            url: 'qrcode/qrcode'
        })
    },

    scanQRCode: function () {
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
                        wx.request({
                            url: `${config.service.host}/weapp/friend/friendListDetail/${qrcode1}`,
                            success: function (res) {
                                var aaa;
                                for (var i = 0; i < res.data.length; i++) {
                                    aaa = 'data[' + i + '].userId'
                                    that.setData({ [aaa]: res.data[i].openId })
                                    aaa = 'data[' + i + '].avatarUrl'
                                    that.setData({ [aaa]: res.data[i].avatarUrl })
                                    aaa = 'data[' + i + '].nickName'
                                    that.setData({ [aaa]: res.data[i].nickName })
                                    aaa = 'data[' + i + '].planFinished'
                                    that.setData({ [aaa]: res.data[i].annualPlanF })
                                    aaa = 'data[' + i + '].planNumYear'
                                    that.setData({ [aaa]: res.data[i].annualPlan })
                                }
                                wx.setStorageSync("friendList", that.data.data)
                                that.setData({
                                    friends: that.data.data
                                })
                            }
                        })
                    },
                    fail(error) {
                        util.showModel('请求失败', error);
                    }
                })
            },
            fail: (res) => {
            },
            complete: (res) => {
            }
        })
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
        var dbFriend = new DBFriend();
        this.setData({
            friends: dbFriend.getAllFriendData()
        })
        var that = this
        var openId = wx.getStorageSync("userInfo");
        var qrcode1 = openId['openId'];
        wx.request({
            url: `${config.service.host}/weapp/friend/friendListDetail/${qrcode1}`,
            success: function (res) {
                that.setData({
                    data: []
                })
                var aaa;
                for (var i = 0; i < res.data.length; i++) {
                    aaa = 'data[' + i + '].userId'
                    that.setData({ [aaa]: res.data[i].openId })
                    aaa = 'data[' + i + '].avatarUrl'
                    that.setData({ [aaa]: res.data[i].avatarUrl })
                    aaa = 'data[' + i + '].nickName'
                    that.setData({ [aaa]: res.data[i].nickName })
                    aaa = 'data[' + i + '].planFinished'
                    that.setData({ [aaa]: res.data[i].annualPlanF })
                    aaa = 'data[' + i + '].planNumYear'
                    that.setData({ [aaa]: res.data[i].annualPlan })
                }
                dbFriend.execSetStorageSync(that.data.data)
                that.setData({
                    friends: dbFriend.getAllFriendData()
                })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
        var size = this.setCanvasSize();//动态设置画布大小
        var initUrl = this.data.placeholder;
        this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    },

    util: function (currentStatu) {
        var animation = wx.createAnimation({
            duration: 200,  
            timingFunction: "linear",
            delay: 0  
        });
        this.animation = animation;
        animation.opacity(0).rotateX(-100).step();
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.opacity(1).rotateX(0).step();
            this.setData({
                animationData: animation
            })
            if (currentStatu == "close") {
                this.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
        if (currentStatu == "open") {
            this.setData(
                {
                    showModalStatus: true
                }
            );
        }
    },

    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
        }
        return size;
    },

    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        var res = wx.getStorageSync("userInfo");
        url = res['openId'];
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => { this.canvasToTempImage(); }, 1000);

    },

    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                that.setData({
                    imagePath: tempFilePath,
                    // canvasHidden:true
                });
            },
            fail: function (res) {
            }
        });
    },
    
    //点击图片进行预览，长按保存分享图片
    previewImg: function (e) {
        var img = this.data.imagePath;
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
        })
    },
})