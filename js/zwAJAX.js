function GetQueryString(name) {
     var reg = new RegExp(name +"=([^&]*)");
     var r = window.location.href.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[1]); return null;
}
var title = null;
$(function(){
    var loc = window.location.href;
    var wenid = loc.split("=")[1];
    var wzid = wenid.split("&")[0];
    var lmid = loc.split("=")[2];
    //wenzcx(wenzid,lmid,".zw_pre",".zw_next");
    getzw(wzid,lmid);
});
function getzw(wzid,lmid){
    // 动态获取正文
    $.ajax({
        type: 'GET',
        url: './zwjson.json',
        dataType: 'json',
        success:function(data) {
            $.each(data,function(key,value){
                if(key==wzid){
                    $('.content-text').html(value.text);
                }
            });
        }
    });
    //获取主页面数据接口
    $.ajax({
        type: 'GET',
        url: './datajson.json',
        dataType: 'json',
        success: function(data) {
            $.each(data,function(key,value){
                if(key==lmid){
                    // 将数据遍历一边
                    for(var i=0;i<value.length;i++){
                        // 判断两个接口中“标题”是否与一致
                        if(value[i].wzid == wzid){
                            // 判断图片路径不等于undefined，清楚报错
                            $('.zw_time').html(value[i].fbsj);
                            var bt = value[i].bt.substring(0,12)+'...';
                            $('.zw_bt').html(bt);
                            $('#wzbt').html(bt);
                            if(value[i].gdtpwj != undefined){
                                // 将图片插入标签
                                $('#head-img').html('<img src="'+ value[i].gdtpwj +'" />')
                            }
                        }
                    }
                }
            });
        }
    });
}