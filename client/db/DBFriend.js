var util = require("../utils/util.js");

class DBFriend {
    constructor() {
        this.storageKeyName = 'friendList';
    }

    /*得到全部好友信息*/
    getAllFriendData() {
        var res = wx.getStorageSync(this.storageKeyName);
        if (!res) {
            res = require('../data/data.js').friendList;
            this.execSetStorageSync(res);
        }
        return res;
    }

    /*初始化缓存数据*/
    execSetStorageSync(data) {
        wx.setStorageSync(this.storageKeyName, data);
    }
}

export { DBFriend }