// pages/note/note.js
import { DBNote } from '../../db/DBNote.js';
var config = require('../../config');
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        //与笔记相关的初始化工作
        var dbNote = new DBNote();
        this.dbNote = new DBNote();
        this.notes = dbNote.getNotes();
        //将数据渲染到界面上
        this.setData({
            notes: this.notes
        })
    },

    //按键：新建笔记
    onCreateNoteTap: function (event) {
        var id = event.currentTarget.dataset.planId;
        wx.navigateTo({
            url: 'note-add/note-add?id=' + id
        })
    },

    //按键：修改笔记
    onTapToChange(event) {
        var noteId = event.currentTarget.dataset.noteId;
        wx.navigateTo({
            url: 'note-add/note-add?noteId=' + noteId
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
                    that.notes = that.dbNote.getNotes();
                    that.setData({
                        notes: that.notes
                    });
                }
                //显示操作结果
                wx.showToast({
                    title: "删除成功",
                    duration: 1000,
                    icon: "success"
                })
            }
        });
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