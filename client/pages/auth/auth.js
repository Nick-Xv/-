// pages/auth/auth.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        logged: false,
        takeSession: true,
        requestResult: '',
    },

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

    aftertap: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            this.doRequest();
        } else {
            //用户按了拒绝按钮
        }

    },

    doRequest: function () {
        util.showBusy('注册...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success(result) {
                util.showSuccess('注册成功')
                wx.setStorageSync("userInfo", result.data.data);
                wx.request({
                    url: `${config.service.host}/weapp/user/regist`,
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: result.data.data,
                    complete: function (res) {
                    }
                })
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
                wx.switchTab({
                    url: '../plan/plan'
                })
            },
            fail(error) {
                util.showModel('请求失败', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    warn: function () {
        wx.navigateBack({
            delta: -1
        })
    }
})