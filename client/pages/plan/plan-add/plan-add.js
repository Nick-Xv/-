// pages/plan/plan-add/plan-add.js
import { DBPlan } from '../../../db/DBPlan.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        plan: {
            userId: "",
            planId: 1,
            isbn13: "",
            bookImgUrl: "/images/book-1.jpg",
            bookName: "",
            pagesFinished: "0",
            pagesTotal: "",
            description: "",
            price: "",
            isPrivate: false,
            realBookName:"自定义书籍",
            rating:"0",
            author:"佚名",
            tags:"未分类",
        },
        textNum: 0,
        changePlan: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.planId) {//更改计划的情况
            var dbPlan = new DBPlan();
            this.dbPlan = new DBPlan();

            var item = dbPlan.getPlanItemById(options.planId);
            this.setData({
                plan: item.data,
                changePlan: true,
                idx: item.index,
            });
        }
        else {
            var date = new Date();
            var dateInit = date.format("yyyy-MM-dd");
            this.setData({
                "plan.dateStart": dateInit,
                "plan.dateFinish": dateInit,
            })
        }

    },

    bindDateChangeStart: function (e) {
        this.setData({
            "plan.dateStart": e.detail.value
        })
        if (this.data.plan.dateStart > this.data.plan.dateFinish) this.setData({ "plan.dateFinish": this.data.plan.dateStart })
    },

    //输入计划结束日期
    bindDateChangeFinish: function (e) {
        this.setData({
            "plan.dateFinish": e.detail.value
        })
        if (this.data.plan.dateStart > this.data.plan.dateFinish) this.setData({ "plan.dateStart": this.data.plan.dateFinish })
    },

    //输入书名
    inputName: function (event) {
        var val = event.detail.value;
        this.data.plan.bookName = val;
    },

    //输入页数
    inputPage: function (event) {
        var val = event.detail.value;
        this.data.plan.pagesTotal = val;
    },

    //输入页数2
    inputPageF: function (event) {
        var val = event.detail.value;
        this.data.plan.pagesFinished = val;
    },

    //输入价格
    inputPrice: function (event) {
        var val = event.detail.value;
        this.data.plan.price = val;
    },

    //输入描述
    inputDescription: function (event) {
        var val = event.detail.value;
        this.data.plan.description = val;
        var len = val.length;
        this.setData({
            textNum: len
        });
    },

    //用户改变隐私设置
    switchChangePrivacy: function (e) {
        this.data.plan.isPrivate = !this.data.plan.isPrivate;
    },

    //按键：确认表单信息
    onTapToConfirm(event) {
        var validPlan = this.data.plan;
        if (validPlan.bookName === undefined || validPlan.pagesTotal === undefined || validPlan.bookName == "" || validPlan.pagesTotal == "") {
            wx.showModal({
                title: "请完善计划信息"
            })
            return;
        }

        if (this.data.plan.price == ""){
            this.data.plan.price = 0;
        }

        if (this.data.plan.pagesFinished == ""){
            this.data.plan.pagesFinished = 0;
        }

        if (parseInt(validPlan.pagesFinished) > parseInt(validPlan.pagesTotal)) {
            wx.showModal({
                content: "当前页数大于总页数，请更正"
            })
            return;
        }

        if (parseInt(validPlan.pagesTotal) > 3000) {
            wx.showModal({
                content: "页数太多啦，请更正"
            })
            return;
        }

        if (parseInt(validPlan.pagesTotal) > 1000000 || (this.data.plan.price != "" && parseFloat(this.data.plan.price) > 1000000) || isNaN(parseFloat(this.data.plan.price))) {
            wx.showModal({
                content: "价格有误，请更正"
            })
            return;
        }
        wx.setStorageSync("changed", "true");

        this.data.plan.pagesFinished = parseInt(this.data.plan.pagesFinished);
        this.data.plan.pagesTotal = parseInt(this.data.plan.pagesTotal);

        var oid = wx.getStorageSync("userInfo");
        var bookdetail = wx.getStorageSync("searchedbook");
        if (bookdetail == null || bookdetail.title != this.data.plan.bookName) {
            this.data.plan.isbn13 = "0";
            if (this.data.plan.price == "") {
                this.data.plan.price = "0";
            }
            else {
                this.data.plan.price = parseFloat(this.data.plan.price)
            }
        }
        else {
            this.data.plan.isbn13 = bookdetail.isbn13;
            this.data.plan.bookImgUrl = bookdetail.image;

            this.data.plan.realBookName = bookdetail.title;
            this.data.plan.rating = bookdetail.rating.average;
            this.data.plan.author = bookdetail.author[0];
            this.data.plan.tags = bookdetail.tags[0].title;

            if (this.data.plan.price == "") {
                this.data.plan.price = "0";
            }
            else {
                this.data.plan.price = parseFloat(this.data.plan.price)
            }
        }
        this.data.plan.userId = oid.openId;
        //PlanId唯一标识笔记：生成方式为userId+createTime
        this.data.plan.planId = this.data.plan.userId.toString() + new Date().getTime() / 1000;
        
        var dbPlan = new DBPlan();
        dbPlan.updateNewPlan(this.data.plan);

        //返回到计划详情页
        wx.navigateBack({
            delta: 1
        });

        //显示操作结果
        wx.showToast({
            title: "创建成功",
            duration: 1000,
            icon: "success"
        })
        wx.removeStorageSync('searchedbook')
    },

    onTapToConfirmChange(event) {
        var validPlan = this.data.plan;
        if (validPlan.bookName == "" || validPlan.pagesTotal == "") {
            wx.showToast({
                title: "请完善计划信息",
                duration: 1000,
                icon: "loading"
            })
            return;
        }

        if (this.data.plan.price == "") {
            this.data.plan.price = 0;
        }

        if (this.data.plan.pagesFinished == "") {
            this.data.plan.pagesFinished = 0;
        }

        if (parseInt(validPlan.pagesFinished) > parseInt(validPlan.pagesTotal)) {
            wx.showModal({
                content: "当前页数大于总页数，请更正"
            })
            return;
        }

        if (parseInt(validPlan.pagesTotal) > 3000){
            wx.showModal({
                content: "页数太多啦，请更正"
            })
            return;
        }

        if ((this.data.plan.price != "" && parseFloat(this.data.plan.price) > 1000000) || isNaN(parseFloat(this.data.plan.price)) ){
            wx.showModal({
                content: "价格有误，请更正"
            })
            return;
        }

        wx.setStorageSync("changed", "true");

        this.data.plan.pagesFinished = parseInt(this.data.plan.pagesFinished);
        this.data.plan.pagesTotal = parseInt(this.data.plan.pagesTotal);

        var dbPlan = new DBPlan();
        this.data.plan.price = parseFloat(this.data.plan.price)
        dbPlan.updateChangedPlan(this.data.plan);

        //返回到计划详情页
        wx.navigateBack({
            delta: 1
        });

        //显示操作结果
        wx.showToast({
            title: "修改成功",
            duration: 1000,
            icon: "success"
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
        if (!wx.getStorageSync('searchedbook')) return
        var that = this
        that.setData({
            'plan.bookName': wx.getStorageSync('searchedbook').title,
            'plan.pagesTotal': wx.getStorageSync('searchedbook').pages
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

    search: function (event) {
        wx.navigateTo({
            url: '../../search-in/search-in?immediateReturn=plan'
        })
    },

    scan: function () {
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
                    url: 'https://www.fkten.xyz/v2/book/isbn/:'+res.result,
                    header: {
                        "Content-Type": "application/text"
                    },
                    success:function(result1){
                        if(result1.data.msg == "book_not_found"){
                            wx.showModal({
                                content: '豆瓣查无此书，请手动录入',
                            })
                        }
                        else{
                            wx.setStorageSync('searchedbook', result1.data);
                            that.setData({
                                'plan.bookName': wx.getStorageSync('searchedbook').title,
                                'plan.pagesTotal': wx.getStorageSync('searchedbook').pages
                            })
                        }
                    }
                })

                that.data.plan.isbn13 = res.result;
            },
            fail: (res) => {
            },
            complete: (res) => {
            }
        })
    }
})