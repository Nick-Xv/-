var config = require('../../../config');
import { DBPlan } from '../../../db/DBPlan.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        visitMode: false,//标识该页面是否处于游客访问模式
        userInfo: {},
    },
    //跳转到详情页面
    onTapToDetail(event) {
        var planId = event.currentTarget.dataset.planId;
        wx.navigateTo({
            url: '../../plan/plan-detail/plan-detail?id=' + planId + '&visit=true',
        })
    },

    onTapToCreate(event) {
        wx.navigateTo({
            url: 'plan-add/plan-add'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var dbPlan = new DBPlan();
        this.dbPlan = new DBPlan();
        this.setData({
            'userInfo.openId': options.id,
            'userInfo.avatarUrl': options.avatarUrl,
            'userInfo.nickName': options.nickName,
            'userInfo.planNumYear': parseInt(options.planNumYear),
            'userInfo.planFinished': parseInt(options.planFinished)
        })
    },

    deleteConfirm: function (e) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '您确认要删除该好友吗？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync("friendList");
                    var id = wx.getStorageSync("userInfo");
                    id = id.openId;
                    wx.request({
                        url: `${config.service.host}/weapp/friend/deleteFriend/${that.data.userInfo.openId}/${id}`,
                    })
                    wx.showToast({
                        title: "删除成功",
                        duration: 1000,
                        icon: "success"
                    })
                    wx.switchTab({
                        url: "../../friend/friend"
                    });
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
        var that = this
        wx.request({
            url: `${config.service.host}/weapp/Plan/getPlanList/${this.data.userInfo.openId}`,
            success(result) {
                if (result.data[0] == that.data.userInfo.openId) {

                }
                else {
                    var res = (result.data);
                    var count = Object.keys(res).length;
                    var ress = new Array();
                    var ii = 0;
                    for (var i = 0; i < count; i = i + 1) {
                        res[i]['description'] = res[i]['description'].replace(/\\n/g, "\n");
                        var Privacy = res[i]['isPrivate'];
                        if (Privacy == 1) {
                            res[i]['isPrivate'] = false;
                            ress[ii] = res[i];
                            ii++;
                        }
                        else {
                            res[i]['isPrivate'] = true;
                        }
                    }
                    that.setData({
                        planList: ress
                    })
                    var length = that.data.planList.length;
                    for (var i = 0; i < length; i++) {
                        var plan = that.data.planList[i];
                        var a = plan.pagesFinished;
                        var b = plan.pagesTotal;
                        var percent = Math.floor(a / b * 100);
                        //添加表示阅读百分比的percent
                        that.data.planList[i].planPercent = percent;
                        //添加表示页数的pageArray数组
                        var array_page = Array.from(new Array(parseInt(b) + 1), (val, index) => index);
                        that.data.planList[i].pageArray = array_page;
                    }
                    //将数据渲染到界面上
                    that.setData({
                        planList: that.data.planList
                    })
                }
            },
            fail(error) {
                util.showModel('请求失败', error);
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

    }
})