var util = require("../utils/util.js");

class DBUser {
    constructor(userId) {
        this.storageKeyName = 'userInfo';
        this.userId = userId;
    }

    /*初始化缓存数据*/
    execSetStorageSync(data) {
        wx.setStorageSync(this.storageKeyName, data);
    }

};

export { DBUser }