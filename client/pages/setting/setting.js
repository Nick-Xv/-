// pages/setting/setting.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var QR = require("../../utils/qrcode.js");
var config = require('../../config')
var util = require('../../utils/util.js')
import { DBUser } from '../../db/DBUser.js';
import { DBPlan } from '../../db/DBPlan.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        hiddenmodalput: true,//用来显示弹出窗口（修改年度计划）
        planNumYear: 15,
        planFinished: 3,
        cost: 998.8,
        userInfo: {},
        logged: false,
        takeSession: true,
        requestResult: '',
        imagePath: '',
        canvasHidden: false,
        maskHidden: true,
        placeholder: 'http://wxapp-union.com',
        cache: [
            { iconurl: '/images/icon/wx_app_clear.png', title: '刷新数据', tap: 'clearCache' }
        ],
        device: [
            { iconurl: '/images/icon/wx_app_compass.png', title: '修改年度计划数', tap: 'changeYearPlan' },
            { iconurl: '/images/icon/annualPlan.png', title: '查看年度计划', tap: 'yearPlan' },
            { iconurl: '/images/icon/wx_app_cellphone.png', title: '查看年度花费', tap: 'openAlert' },
            { iconurl: '/images/icon/wx_app_scan.png', title: '扫一扫加好友', tap: 'scanQRCode' },
            { iconurl: '/images/icon/wx_app_scan_code.png', title: '我的二维码', tap: 'powerDrawer' },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var info = wx.getStorageSync("userAnnualPlan");
        var id = wx.getStorageSync("userInfo");
        id = id.openId;
        wx.request({
            url: `${config.service.host}/weapp/user/calPlanF/${id}`,
            success: function (result) {
                that.setData({
                    planFinished: result.data.num
                })
            }
        })
        wx.request({
            url: `${config.service.host}/weapp/user/calAnnualCost/${id}`,
            success:function(result){
                that.setData({
                    cost : result.data.cost
                })
            }
        })
        if(!info){
            wx.request({
                url: `${config.service.host}/weapp/user/queryPlan/${id}`,
                success : function(res){
                    wx.setStorageSync("userAnnualPlan", res.data)
                    that.setData({
                        planNumYear: res.data.total,
                        planFinished: res.data.finished
                    })
                }
            })
        }
        that.setData({
            logged:true,
            userInfo:wx.getStorageSync("userInfo")
        })
    },
    //用户登录按钮
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            this.login();
            this.doRequest();
        } else {
            //用户按了拒绝按钮
        }
    },

    //显示模态窗口
    showModal: function (title, content, callback) {
        wx.showModal({
            title: title,
            content: content,
            confirmColor: '#1F4BA5',
            cancelColor: '#7F8389',
            success: function (res) {
                if (res.confirm) {
                    callback && callback();
                }
            }
        })
    },

    // 用户登录示例
    login: function () {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    // 缓存清理
    clearCache: function () {
        var that = this
        this.showModal('刷新数据', '确定要清除本地缓存并刷新数据吗？', function () {
            wx.clearStorage({
                success: function (msg) {
                    wx.showToast({
                        title: "缓存清理成功",
                        duration: 1000,
                        mask: true,
                        icon: "success"
                    })
                },
                fail: function (e) {
                }
            })
            qcloud.setLoginUrl(config.service.loginUrl)
            var logs = wx.getStorageSync('logs') || []
            logs.unshift(Date.now())
            wx.setStorageSync('logs', logs)
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        that.doRequest();
                    }
                    else {
                        wx.redirectTo({
                            url: '../auth/auth',
                        })
                    }
                }
            })
        });
    },

    // 缓存清理
    clearCacheTest: function () {
        var that = this
        this.showModal('刷新数据', '确定要清除本地缓存并刷新数据吗？', function () {
            wx.clearStorage({
                success: function (msg) {
                    wx.showToast({
                        title: "缓存清理成功",
                        duration: 1000,
                        mask: true,
                        icon: "success"
                    })
                },
                fail: function (e) {
                }
            })
        });
    },

    doRequest: function () {
        util.showBusy('刷新...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success(result) {
                util.showSuccess('刷新完成')
                wx.setStorageSync("userInfo", result.data.data);
                wx.setStorageSync("changed", "false")
                wx.switchTab({
                    url: '../plan/plan'
                })
            },
            fail(error) {
                util.showModel('请求失败', error);
            }
        }
        qcloud.request(options)
    },

    //修改年度计划
    changeYearPlan: function () {
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
        if (parseInt(this.data.planNumYear) > 1000000) {
            util.showModel('错误', '计划数过大！')
            return
        }
        var res = wx.getStorageSync("userAnnualPlan");
        res.total = this.data.planNumYear;
        wx.setStorageSync("userAnnualPlan", res);
        var oid = wx.getStorageSync("userInfo");
        oid = oid.openId;
        var num = res.total;
        wx.request({
            url: `${config.service.host}/weapp/user/setPlan/${oid}/${num}`,
            success : function  (ress){
            }
        })
        this.setData({
            hiddenmodalput: true
        })
    },
    //输入新的年度计划
    inputYearPlan: function (event) {
        var val = event.detail.value;
        this.setData({
            planNumYear: val
        })
    },

    //用户查看年度消费
    openAlert: function () {
        var that = this;
        var cost = Math.round(that.data.cost);
        wx.showModal({
            content: '您的年度消费为' + cost + '元。',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                }
            }
        });
    },

    //跳转到笔记栏
    gotoNote: function () {
        wx.navigateTo({
            url: '../note/note'
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
        var that = this;
        var info = wx.getStorageSync("userAnnualPlan");
        var id = wx.getStorageSync("userInfo");
        id = id.openId;
        wx.request({
            url: `${config.service.host}/weapp/user/calPlanF/${id}`,
            success: function (result) {
                that.setData({
                    planFinished: result.data.num
                })
                if(info){
                    info.finished = result.data.num
                    wx.setStorageSync("userAnnualPlan",info)
                }
            }
        })
        wx.request({
            url: `${config.service.host}/weapp/user/calAnnualCost/${id}`,
            success: function (result) {
                that.setData({
                    cost: result.data.cost
                })
            }
        })
        if (!info) {
            wx.request({
                url: `${config.service.host}/weapp/user/queryPlan/${id}`,
                success: function (res) {
                    wx.setStorageSync("userAnnualPlan", res.data)
                    that.setData({
                        planNumYear: res.data.total,
                        planFinished: res.data.finished
                    })
                }
            })
        }
        else{
            var annualPlan = wx.getStorageSync("userAnnualPlan");
            that.setData({
                planNumYear: annualPlan.total,
                planFinished: annualPlan.finished
            })
        }
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
    // onShareAppMessage: function () {

    // }

    createQRCode(event) {
        wx.navigateTo({
            url: '../friend/qrcode/qrcode'
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

    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
        var size = this.setCanvasSize();//动态设置画布大小
        var initUrl = this.data.placeholder;
        this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    },
    util: function (currentStatu) {
        var animation = wx.createAnimation({
            duration: 200,  //动画时长
            timingFunction: "linear", //线性
            delay: 0  //0则不延迟
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

        // 显示
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

    expense:function(){
        wx.navigateTo({
            url: '../expense/expense',
        })
    },

    yearPlan:function(){
        wx.navigateTo({
            url: '../plan-yearly/plan-yearly',
        })
    }
})