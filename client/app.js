//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
    onLaunch: function () {
        /*
        qcloud.setLoginUrl(config.service.loginUrl)
        //this._getUserInfo();
        */
        var that = this
        qcloud.setLoginUrl(config.service.loginUrl)
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        /*wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })*/
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    
                    this.doRequest();
                }
                else {
                    wx.redirectTo({
                        url: '../auth/auth',
                    })
                }
            }
        })
    },
    //获取用户信息
    _getUserInfo: function () {
      var userInfoStorage = wx.getStorageSync('user');
      if (!userInfoStorage) {
        var that = this;
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.g_userInfo = res.userInfo
                wx.setStorageSync('user', res.userInfo)
              },
              fail: function (res) {
              }
            })
          }
        })
      }
      else {
        this.globalData.g_userInfo = userInfoStorage;
      }
    },
    //全局变量
    globalData: {
      g_userInfo: null,
      doubanBase: "https://api.douban.com",
      userInfo: null,
      logged: false,
      openId: null,
      userInfo: {},
      logged: false,
      takeSession: true,
      requestResult: '',
    },
    doRequest: function () {
      util.showBusy('登录...')
      var that = this
      var options = {
        url: config.service.requestUrl,
        login: true,
        success(result) {
          util.showSuccess('登录成功')
          wx.setStorageSync("userInfo", result.data.data);
          /*that.setData({
            requestResult: JSON.stringify(result.data)
          })*/
          wx.switchTab({
            url: '../plan/plan'
          })
        },
        fail(error) {
          util.showModel('请求失败', error);
        }
      }
      if (this.globalData.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    login: function () {
      if (this.globalData.logged) return

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
})

