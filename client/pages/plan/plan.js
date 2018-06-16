// pages/plan/plan.js
import { DBPlan } from '../../db/DBPlan.js';
var config = require('../../config');
var util = require('../../utils/util.js');
var qcloud = require('../../vendor/wafer2-client-sdk/index');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        visitMode: false,//标识该页面是否处于游客访问模式
        userInfo: wx.getStorageSync("userInfo"),
        pageName:'plan'
    },

    //跳转到详情页面
    onTapToDetail(event) {
        var planId = event.currentTarget.dataset.planId;
        wx.navigateTo({
            url: 'plan-detail/plan-detail?id=' + planId,
        })
    },

    onTapToCreate(event) {
        wx.navigateTo({
            url: 'plan-add/plan-add'
        })
    },

    onTapToAllPlan(event) {
        wx.navigateTo({
            url: '../planAll/plan'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.data.data,
                    hasUserInfo: true,
                    openId: res.data.data.openId
                })
            }
        }
        wx.setStorageSync("changed", "false");
        var dbPlan = new DBPlan();
        this.dbPlan = new DBPlan();
    },

    //删除操作：弹出确认框
    openConfirm: function (e) {
        var planId = e.currentTarget.dataset.planId;
        var len = this.data.planList.length;
        var planList = this.data.planList;
        var that = this;

        wx.showModal({
            title: '确认删除',
            content: '您确认要删除当前选择的这个读书计划么',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {//删除这个计划
                    var idx;
                    for (idx = 0; idx < len; idx++) {
                        if (planList[idx].planId == planId)
                            break;
                    }
                    for (var i = idx; i < len; i++) {
                        planList[i] = planList[i + 1];
                    }
                    planList.length--;
                    that.setData({
                        planList: planList
                    })
                    that.dbPlan.deletePlan(planId);
                    
                    wx.request({
                        url: `${config.service.host}/weapp/Plan/deletePlan/${planId}`,
                    })
                }
                //显示操作结果
                wx.showToast({
                    title: "操作完成",
                    duration: 1000,
                    icon: "success"
                })
            }
        });
    },
    //更新操作：选择读到的页数
    bindPickerChange: function (e) {
        wx.setStorageSync("changed", "true");
        var planId = e.currentTarget.dataset.planId;
        for (var planidx in this.data.planList) {
            if (this.data.planList[planidx].planId == planId) {
                this.data.planList[planidx].pagesFinished = e.detail.value;
                this.dbPlan.updateSchedule(planId, e.detail.value);//将进度信息存到storage中
                //更新进度条
                var plan = this.data.planList[planidx];
                var a = plan.pagesFinished;
                var b = plan.pagesTotal;
                var percent = Math.floor(a / b * 100);
                //添加表示阅读百分比的percent
                this.data.planList[planidx].planPercent = percent;
            }
        }
        this.setData({
            planList: this.data.planList
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
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    //that.doRequest();
                }
                else {
                    wx.redirectTo({
                        url: '../auth/auth',
                    })
                }
            }
        })

        var that = this
        var planL = wx.getStorageSync("planList");
        if (!planL) {
            that.dbPlan = new DBPlan();
            planL = that.dbPlan.getAllPlanData(that);
        }
        this.setData({
            planList: that.dbPlan.getAllPlanData(that)
        });
        if (!this.data.planList){
            wx.setStorageSync("refresh", "true");
        }
        var length = this.data.planList.length;
        for (var i = 0; i < length; i++) {
            var plan = this.data.planList[i];
            var a = plan.pagesFinished;
            var b = plan.pagesTotal;
            var percent = Math.floor(a / b * 100);
            //添加表示阅读百分比的percent
            this.data.planList[i].planPercent = percent;
            //添加表示页数的pageArray数组
            var array_page = Array.from(new Array(parseInt(b) + 1), (val, index) => index);
            this.data.planList[i].pageArray = array_page;
        }
        //将数据渲染到界面上
        var allPlanList = this.data.planList;
        var activePlanList = new Array();
        var ii = 0;
        for (var i = 0; i < allPlanList.length; i++) {
            if (allPlanList[i].pagesFinished != allPlanList[i].pagesTotal) {
                activePlanList[ii] = allPlanList[i];
                var myDate = new Date();
                myDate = myDate.format('yyyy-MM-dd');
                if (that.daysBetween(activePlanList[ii].dateFinish, myDate) <= 7 && activePlanList[ii].dateFinish > myDate) {
                    var tmp = activePlanList[ii].dateFinish
                    tmp += "\n(";
                    tmp += that.daysBetween(activePlanList[ii].dateFinish, myDate);
                    tmp += "天后截止)";
                    activePlanList[ii].dateFinish = tmp;
                }
                else if (activePlanList[ii].dateFinish < myDate) {
                    activePlanList[ii].dateFinish += "\n(已截止)";
                }
                else if (activePlanList[ii].dateFinish == myDate) {
                    activePlanList[ii].dateFinish += "\n(今日截止)";
                }
                else {
                    activePlanList[ii].dateFinish += "  ";
                }
                ii++;
            }
        }
        this.setData({
            planList: activePlanList
        })
    
        
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if(wx.getStorageSync("changed") == "false"){
            return;
        }
        var data2 = wx.getStorageSync('planList');
        var count = Object.keys(data2).length;
        var data1 = "{";
        for (var i = 0; i < count; i++) {
            data1 += "\"" + "UserID" + i + "\"" + ":" + "\"" + data2[i].userId + "\"" + ",";
            data1 += "\"" + "PlanID" + i + "\"" + ":" + "\"" + data2[i].planId + "\"" + ",";
            data1 += "\"" + "DateStart" + i + "\"" + ":" + "\"" + data2[i].dateStart + "\"" + ",";
            data1 += "\"" + "DateEnd" + i + "\"" + ":" + "\"" + data2[i].dateFinish + "\"" + ",";
            data1 += "\"" + "Description" + i + "\"" + ":" + "\"" + data2[i].description + "\"" + ",";
            data1 += "\"" + "Process" + i + "\"" + ":" + "\"" + data2[i].pagesFinished + "\"" + ",";
            data1 += "\"" + "Privacy" + i + "\"" + ":" + "\"" + data2[i].isPrivate + "\"" + ",";
            data1 += "\"" + "Price" + i + "\"" + ":" + "\"" + data2[i].price + "\"" + ",";
            data1 += "\"" + "Pages" + i + "\"" + ":" + "\"" + data2[i].pagesTotal + "\"" + ",";
            data1 += "\"" + "ImageUrl" + i + "\"" + ":" + "\"" + data2[i].bookImgUrl + "\"" + ",";
            data1 += "\"" + "BookName" + i + "\"" + ":" + "\"" + data2[i].bookName + "\"" + ",";
            data1 += "\"" + "ISBN13" + i + "\"" + ":" + "\"" + data2[i].isbn13 + "\"" + ",";

            data1 += "\"" + "RealBookName" + i + "\"" + ":" + "\"" + data2[i].realBookName + "\"" + ",";
            data1 += "\"" + "Rating" + i + "\"" + ":" + "\"" + data2[i].rating + "\"" + ",";
            data1 += "\"" + "Author" + i + "\"" + ":" + "\"" + data2[i].author + "\"" + ",";
            data1 += "\"" + "Tags" + i + "\"" + ":" + "\"" + data2[i].tags + "\"" + ",";
        }
        data1 += "\"" + "count" + "\"" + ":" + count + "}";
        data1 = data1.replace(/\n/g, "\\\\n");
        wx.request({
            url: `${config.service.host}/weapp/plan/uploadPlanData`,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: JSON.parse(data1),
            complete: function (res) {
            }
        })
        wx.setStorageSync("changed", "false");
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
        this.onHide()
        var that = this
        wx.clearStorage()
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
    },

    doRequest: function () {
        util.showBusy('刷新...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success(result) {
                util.showSuccess('刷新成功')
                wx.setStorageSync("userInfo", result.data.data);
                wx.setStorageSync("changed", "false")
                wx.stopPullDownRefresh();
                that.onShow();
            },
            fail(error) {
                util.showModel('请求失败', error);
                wx.stopPullDownRefresh()
            }
        }
        qcloud.request(options)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    daysBetween: function(strDateStart, strDateEnd) {
        var strSeparator = "-"; //日期分隔符
        strDateStart += '';
        strDateEnd += '';
        var oDate1;
        var oDate2;
        var iDays;
        oDate1 = strDateStart.split(strSeparator);
        oDate2 = strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
        return iDays;
    }
})