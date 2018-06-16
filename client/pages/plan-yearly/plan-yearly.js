// pages/plan-yearly/plan-yearly.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        finished:0,
        total:0,
            booksFinished:[],
            booksInProgress: [],
            booksToRead:[],
            toRead:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var res = wx.getStorageSync("userAnnualPlan")
        var bookInfo = wx.getStorageSync("planList")
        var length = bookInfo.length
        var i1=0,i2=0,i3=0
        var res1 = new Array();
        var res2 = new Array();
        var res3 = new Array();
        var myDate = new Date();
        myDate = myDate.format('yyyy-MM-dd');
            for(var i=0;i<length;i++){
                if (bookInfo[i].pagesTotal == bookInfo[i].pagesFinished){
                    res3[i3] = bookInfo[i];
                    i3++;
                }
                else if(bookInfo[i].dateStart > myDate){
                    res2[i2] = bookInfo[i];
                    i2++;
                }
                else if (bookInfo[i].dateEnd > myDate){
                    res1[i1] = bookInfo[i];
                    i1++;
                }
            }
            if(i2 == 0){
                this.setData({
                    toRead:false
                })
            }
            this.setData({
                finished:res.finished,
                total:res.total,
                booksFinished : res3,
                booksInProgress : res1,
                booksToRead : res2
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
        var res = wx.getStorageSync("userAnnualPlan")
        var bookInfo = wx.getStorageSync("planList")
        var length = bookInfo.length
        var i1 = 0, i2 = 0, i3 = 0
        var res1 = new Array();
        var res2 = new Array();
        var res3 = new Array();
        var myDate = new Date();
        myDate = myDate.format('yyyy-MM-dd');
        for (var i = 0; i < length; i++) {
            if (bookInfo[i].pagesTotal == bookInfo[i].pagesFinished) {
                res3[i3] = bookInfo[i];
                i3++;
            }
            else if (bookInfo[i].dateStart > myDate) {
                res2[i2] = bookInfo[i];
                i2++;
            }
            else if (bookInfo[i].dateFinish >= myDate) {
                res1[i1] = bookInfo[i];
                i1++;
            }
        }
        
        this.setData({
            finished: res.finished,
            total: res.total,
            booksFinished: res3,
            booksInProgress: res1,
            booksToRead: res2
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
    
    }
})