// pages/friend/friend-rank/friend-rank.js
import { DBFriend } from '../../../db/DBFriend.js';

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
        var dbFriend = new DBFriend();
        this.data.friends = dbFriend.getAllFriendData();
        //根据完成计划的数量进行排序
        this.data.friends.sort(this.compareWithTime);
        this.setData({
            friends: this.data.friends
        })

    },

    //排序用的比较函数
    compareWithTime(value1, value2) {
        var flag = parseFloat(value1.planFinished) - parseFloat(value2.planFinished);
        if (flag < 0) {
            return 1;
        } else if (flag > 0) {
            return -1;
        } else {
            return 0;
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

    }
})