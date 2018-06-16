var util = require("../utils/util.js");
var config = require('../config');

import { DBNote } from './DBNote.js';

class DBPlan {
    constructor(PlanId) {
        this.storageKeyName = 'planList';
        this.PlanId = PlanId;
    }

    //获取指定id号的文章数据
    getPlanItemById() {
        var PlansData = this.getAllPlanData();
        var len = PlansData.length;
        for (var i = 0; i < len; i++) {
            if (PlansData[i].planId == this.PlanId) {
                return {
                    index: i,
                    data: PlansData[i]
                }
            }
        }
    }

    getPlanItemById(id, that) {
        if(that)
        {
          wx.request({
            url: `${config.service.host}/weapp/Plan/getCertainPlan/${id}`,
            success: function(res) {
              that.plan = res.data[0];
              that.plan.description = that.plan.description.replace(/\\n/g, "\n");
              var a = that.plan.pagesFinished;
              var b = that.plan.pagesTotal;
              var percent = Math.floor(a / b * 100);
              that.plan.planPercent = percent;//添加表示阅读百分比的percent

              var array_page = Array.from(new Array(parseInt(b) + 1), (val, index) => index);
              that.plan.pageArray = array_page;//添加表示页数的pageArray数组

              //将数据渲染到界面上
              that.setData({
                plan: that.plan
              })
            }
          })
          wx.request({
                url: `${config.service.host}/weapp/Note/getPlanNote/${id}`,
                success: function(res) {
                    if(res.data[0] == id){

                    }
                    else
                    {
                        var len = res.data.length;
                        var resList = [];
                        for (var i = 0; i < len; i++) {
                            res.data[i]['content'] = res.data[i]['content'].replace(/\\n/g, "\n");
                            if (res.data[i].isPrivate == 1) {
                                resList.push({
                                    index: i,
                                    data: res.data[i]
                                });
                            }
                        }
                        //按时间降序排列笔记
                        resList.sort(this.compareWithTime);
                        var len = resList.length;
                        for (var i = 0; i < len; i++) {
                            //将note中的时间戳转换成可以阅读的格式
                            resList[i].data.createTime = util.getDiffTime(resList[i].data.createTime, true);
                        }
                        that.setData({
                            notes: resList
                        })
                    }
                }
            })
        }
        else
        {
            var PlansData = this.getAllPlanData();
            var len = PlansData.length;
            for (var i = 0; i < len; i++) {
                if (PlansData[i].planId == id) {
                return {
                    index: i,
                    data: PlansData[i]
                }
                }
            }
        }
        
    }

    /*得到全部文章信息*/
    getAllPlanData(e) {
        var openId = wx.getStorageSync("userInfo");
        var id = openId['openId'];
        var res = wx.getStorageSync(this.storageKeyName);
        var that = this;
        if (!res) {
            wx.request({
                url: `${config.service.host}/weapp/Plan/getPlanList/${id}`,
                success(result) {
                    if(!result.data[0].bookName) return
                    res = (result.data);
                    var count = Object.keys(res).length;
                    for (var i = 0; i < count; i = i + 1) {
                        res[i]['description'] = res[i]['description'].replace(/\\n/g, "\n");
                        var Privacy = res[i]['isPrivate'];
                        if (Privacy == 0) {
                            res[i]['isPrivate'] = true;
                        }
                        else {
                            res[i]['isPrivate'] = false;
                        }
                    }
                    that.execSetStorageSync(res);
                    if(e.data.pageName == 'plan'){
                        var ress = new Array();
                        var ii = 0;
                        for (var i = 0, l = res.length; i < l; i++) {
                            var now, total;
                            for (var key in res[i]) {
                                if (key == "pagesFinished") {
                                    now = res[i][key];
                                }
                                if (key == "pagesTotal") {
                                    total = res[i][key];
                                }
                            }
                            if (now != total) {
                                ress[ii] = res[i];
                                ii++;
                            }
                        }
                        e.setData({
                            planList: ress
                        })
                        res = ress;
                        e.onShow();
                    }
                    else{
                        e.setData({
                            planList: res
                        })
                    }
                    return res;
                    
                },
                fail(error) {
                    util.showModel('请求失败', error);
                    return res;
                }
            })
        }
        return res;
    }

    getActivePlanData(e) {
        var openId = wx.getStorageSync("userInfo");
        var id = openId['openId'];
        var res = wx.getStorageSync(this.storageKeyName);
        var that = this;
        if (!res) {
            wx.request({
                url: `${config.service.host}/weapp/Plan/getActivePlan/${id}`,
                success(result) {
                    if (!result.data[0].bookName) return
                    res = (result.data);
                    var count = Object.keys(res).length;
                    for (var i = 0; i < count; i = i + 1) {
                        var Privacy = res[i]['isPrivate'];
                        if (Privacy == 0) {
                            res[i]['isPrivate'] = true;
                        }
                        else {
                            res[i]['isPrivate'] = false;
                        }
                    }
                    that.execSetStorageSync(res);
                    var ress = new Array();
                    var ii = 0;
                    for (var i = 0, l = res.length; i < l; i++) {
                        var now, total;
                        for (var key in res[i]) {
                            if (key == "pagesFinished") {
                                now = res[i][key];
                            }
                            if (key == "pagesTotal") {
                                total = res[i][key];
                            }
                        }
                        if (now != total) {
                            ress[ii] = res[i];
                            ii++;
                        }
                    }
                    e.setData({
                        planList: ress
                    })
                },
                fail(error) {
                    util.showModel('请求失败', error);
                }
            })
        }
        var ress = Array();
        var ii = 0;
        for (var i = 0, l = res.length; i < l; i++) {
            var now,total;
            for (var key in res[i]) {
                if(key == "pagesFinished"){
                    now = res[i][key];
                }
                if (key == "pagesTotal") {
                    total = res[i][key];
                }
            }
            if(now != total){
                ress[ii] = res[i];
                ii++;
            }
        }
        return ress;
    }

    /*初始化缓存数据*/
    execSetStorageSync(data) {
        wx.setStorageSync(this.storageKeyName, data);
    }

    //更新本地的数据
    updatePlanData(operator) {

    }

    //从首页更新进度写入storage
    updateSchedule(id, page) {
        var itemData = this.getPlanItemById(id);
        var planData = itemData.data;
        var allPlanData = this.getAllPlanData();
        planData.pagesFinished = page;
        allPlanData[itemData.index] = planData;
        this.execSetStorageSync(allPlanData);
        return planData;
    }

    //从首页删除计划写入storage
    deletePlan(id) {
        var itemData = this.getPlanItemById(id),
            planData = itemData.data,
            allPlanData = this.getAllPlanData();
        for (var i = itemData.index; i < allPlanData.length; i++) {
            allPlanData[i] = allPlanData[i + 1];
        }
        allPlanData.length--;
        this.execSetStorageSync(allPlanData);
        wx.request({
            url: `${config.service.host}/weapp/Plan/deletePlan/${id}`,
        })
        return planData;
    }

    //新建计划
    updateNewPlan(Plan) {
        var allPlanData = this.getAllPlanData();
        if(allPlanData == "" || !allPlanData) allPlanData = new Array(Plan)
        else
        {
          allPlanData.unshift(Plan);
        }
        this.execSetStorageSync(allPlanData);
    }

    //修改计划
    updateChangedPlan(planChanged) {
        var itemData = this.getPlanItemById(planChanged.planId),
            planData = itemData.data,
            allPlanData = this.getAllPlanData();
        allPlanData[itemData.index] = planChanged;
        this.execSetStorageSync(allPlanData);
    }

};

export { DBPlan }