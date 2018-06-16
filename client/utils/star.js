//星级图Date 
const starDate =  {
    star : [
        {
            src: "../../res/star/icon_star_0.png",
            name : '零星'
        },
        {
            src : "../../res/star/icon_star_0_5.png",
            name : '半星'
        },
        {
            src : "../../res/star/icon_star_1.png",
            name : '一星'
        },
        {
            src : "../../res/star/icon_star_1_5.png",
            name : '一星半'
        },
        {
            src : "../../res/star/icon_star_2.png",
            name : '二星'
        },
        {
            src : "../../res/star/icon_star_2_5.png",
            name : '二星半'
        },
        {
            src : "../../res/star/icon_star_3.png",
            name : '三星'
        },
        {
            src : "../../res/star/icon_star_3_5.png",
            name : '三星半'
        },
        {
            src : "../../res/star/icon_star_4.png",
            name : '四星'
        },
        {
            src : "../../res/star/icon_star_4_5.png",
            name : '四星半'
        },
        {
            src : "../../res/star/icon_star_5.png",
            name : '五'
        }
    ]
};
//计算分数，插入对应的图片
function get_star(timer) {
    console.log("开始计算星星");
    var block = starDate.star[ Math.floor(timer)].src;
    return block;

}
//随机一个200内的数字，用于调用首页列表
function toRefresh(){
    var num = Math.random();  //Math.random()：得到一个0到1之间的随机数
    num = Math.ceil(num * 200);  //num*80的取值范围在0~80之间,使用向上取整就可以得到一个1~80的随机数
    var str;
    str = num.toString();
    return str;

}
//
module.exports = {
    starDate: starDate,
    get_star: get_star,
    toRefresh: toRefresh
}