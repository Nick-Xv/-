// pages/plan/plan-detail/plan-detail.js
import { DBPlan } from '../../../db/DBPlan.js';
import { DBNote } from '../../../db/DBNote.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        visitMode: false,//是否是游客访问状态
        plan: {
        },
        notes: {
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.planId = options.id;//取得查看详情传来的参数：planId
        if (options.visit) {
            //如果是游客访问状态那么加载公开的那些笔记
            this.setData({
                visitMode: true
            })
        }
    },

    onTapToMain() {
        wx.switchTab({
            url: '../plan',
        })
    },

    //按键：更改计划
    onTapToChangePlan(event) {
        var planId = event.currentTarget.dataset.planId;
        wx.navigateTo({
            url: '../plan-add/plan-add?planId=' + planId
        })
    },

    //按键：新建笔记
    onCreateNoteTap: function (event) {
        var id = event.currentTarget.dataset.planId;
        wx.navigateTo({
            url: '../../note/note-add/note-add?id=' + id
        })
    },

    //按键：修改笔记
    onTapToChange(event) {
        var noteId = event.currentTarget.dataset.noteId;
        wx.navigateTo({
            url: '../../note/note-add/note-add?noteId=' + noteId
        })
    },

    //按键：删除笔记
    onTapToDelete(event) {
        var noteId = event.currentTarget.dataset.noteId;
        var that = this;

        wx.showModal({
            title: '删除确认',
            content: '您确认要删除当前选择的这个笔记么',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {//删除这个笔记
                    that.dbNote = new DBNote();
                    that.dbNote.deleteNote(noteId);
                    that.notes = that.dbNote.getNotesByPlanId(that.data.plan.planId);
                    that.setData({
                        notes: that.notes
                    });
                    wx.showToast({
                        title: "删除成功",
                        duration: 1000,
                        icon: "success"
                    })
                }
            }
        });
    },

    //按键：删除读书计划
    openConfirm: function (e) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '您确认要删除当前选择的这个读书计划么',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {//删除这个计划
                    that.dbPlan.deletePlan(that.plan.planId);
                    wx.switchTab({
                        url: '/pages/plan/plan',
                    })
                    wx.showToast({
                        title: "删除成功",
                        duration: 1000,
                        icon: "success"
                    })
                }
            }
        });
    },

    //按键：完成读书计划
    openFinishConfirm: function (e) {
        var that = this;

        wx.showModal({
            title: '确认读完',
            content: '您确认已经完成这个读书计划么',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                wx.setStorageSync("changed", "true")
                if (res.confirm) {//完成这个计划
                    that.plan.pagesFinished = that.plan.pagesTotal;
                    that.dbPlan.updateSchedule(that.plan.planId, that.plan.pagesTotal);//将进度信息存到storage中
                    //更新进度条
                    that.plan.planPercent = 100;

                    that.setData({
                        plan: that.plan
                    })
                    wx.showToast({
                        title: "计划已完成",
                        duration: 1000,
                        icon: "success"
                    })
                }
            }
        });
    },

    //更新操作：选择读到的页数
    bindPickerChange: function (e) {
        wx.setStorageSync("changed", "true");
        this.plan.pagesFinished = e.detail.value;
        this.dbPlan.updateSchedule(this.plan.planId, e.detail.value);//将进度信息存到storage中
        //更新进度条
        var a = this.plan.pagesFinished;
        var b = this.plan.pagesTotal;
        var percent = Math.floor(a / b * 100);
        //添加表示阅读百分比的percent
        this.plan.planPercent = percent;

        this.setData({
            plan: this.plan
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
        var that = this
        var planId = that.data.planId;
        //与计划相关的初始化工作
        var dbPlan = new DBPlan(planId);
        this.dbPlan = new DBPlan(planId);//新建数据库操作类的对象，用于读取更新数据

        if (this.data.visitMode) {
            this.dbPlan.getPlanItemById(planId, that);//读取该计划的详情
            return
        }
        this.plan = this.dbPlan.getPlanItemById(planId).data;//读取该计划的详情
        var a = this.plan.pagesFinished;
        var b = this.plan.pagesTotal;
        var percent = Math.floor(a / b * 100);
        this.plan.planPercent = percent;//添加表示阅读百分比的percent

        var array_page = Array.from(new Array(parseInt(b) + 1), (val, index) => index);
        this.plan.pageArray = array_page;//添加表示页数的pageArray数组

        //与笔记相关的初始化工作
        var dbNote = new DBNote(planId);
        this.dbNote = new DBNote(planId);
        this.notes = dbNote.getNotesByPlanId(planId, this);

        //将数据渲染到界面上
        this.setData({
            plan: this.plan,
            notes: this.notes
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: `我正在读 ${this.data.plan.bookName}`,
            path: `/pages/plan/plan-detail/plan-detail?id=${this.data.planId}&visit=true`
        }
    }
})