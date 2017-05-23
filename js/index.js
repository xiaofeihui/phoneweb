        var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0,pageNum = 1,allDataLoaded=false,isLoadingData = false,curLm = null,lmList,notifyApp = null;
        var rwtxt = null;
        $(document).ready(function() {
            $('.drawer').drawer({
            });
            initNav();//加载栏目
            initBanner('rdxw_div');
            loaded();
            var lmid = GetQueryString('lmid');
            if(!!lmid){
                selectLm(lmid);
            }else{
                selectLm('rdxw_div');//热点新闻lmid
            }
            
            $('#wrapper').css('top',$('.headerContainer').outerHeight());
            $('.open-drawer-menu-on-page').on('click',openDrawer);
            $('.open-drawer-menu-on-header').on('click',openDrawer);
        }); 
        function GetQueryString(name) {
            var reg = new RegExp(name +"=([^&]*)");
            var r = window.location.href.substr(1).match(reg);
            if(r!=null)return  decodeURI(r[1]); return null;
        }
        function initBanner(lmid){
            var timer = null,count = 0;
            $.ajax({
                type:'get',
                url: './datajson.json',
                dataType:'json',
                success:function(data){

                    $.each(data,function(key,value){
                        if(key==lmid){
                            var wzList = value;
                            var leng_all = 0;
                            var str = '',arr_bts=[],arr_ele=[];
                            $.each(wzList,function(i,v){
                                if(!!v.gdtpwj) arr_ele.push(v);
                            });
                            $.each(arr_ele,function(i,v){
                                if(i==0)$('.bt_style h2').html(v.bt);
                                if(i>=5)return false;
                                if(lmid==44016036){
                                    str += "<li style='width:"+$(window).width()+"px'><a href='./content.html?wzid="+v.wzid+"&lmid="+lmid+"'><img src='"+v.gdtpwj+"' ><p>"+v.bt+"</p></a></li>";
                                }else{
                                    str += "<li style='width:"+$(window).width()+"px'><a href='./content.html?wzid="+v.wzid+"&lmid="+lmid+"'><img src='"+v.gdtpwj+"' ><p>"+v.bt+"</p><em class='video-tb'></em></a></li>";
                                }

                            });

                            $('.banner ul').html(str);
                            $('.banner').terseBanner({});

                        }
                    });
                }
            });
        }


        function openDrawer(){
            $('.drawer').drawer('open');
        }
        function selectLm(lmid,lmmc){
            if(lmid != 'rdxw_div'){//热点新闻栏目id
                $('.banner').css('display','none')
            }else{
                $('.banner').css('display','block')
            }
            $('.drawer').drawer('close');

			curLm = { mc:lmmc, lmid:lmid };
            pullDownAction();
        }


        function initNav(){
			var lmListEl = $('#lmList');
			lmListEl.append('<li><span class="drawer-menu-item-icon"></span><a class="drawer-menu-item" href="javascript:selectLm(\'rdxw_div\',\'新闻中心\')">新闻中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-2"></span><a class="drawer-menu-item" href="javascript:selectLm(\'jgjs_div\',\'机构中心\')">机构中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-3"></span><a class="drawer-menu-item" href="javascript:selectLm(\'gfwh_div\',\'文化中心\')">文化中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-4"></span><a class="drawer-menu-item" href="javascript:selectLm(\'gfrw_div\',\'人物中心\')">人物中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-9"></span><a class="drawer-menu-item" href="javascript:selectLm(\'jlhz_div\',\'交流中心\')"> 交流中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-5"></span><a class="drawer-menu-item" href="javascript:selectLm(\'csgy_div\',\'公益中心\')">公益中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-6"></span><a class="drawer-menu-item" href="javascript:selectLm(\'spzx_div\',\'视频中心\')">视频中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-8"></span><a class="drawer-menu-item" href="javascript:selectLm(\'zahyzt_div\',\'专题中心\')">专题中心</a></li> '+
			'<li><span class="drawer-menu-item-icon drawer-menu-item-icon-7"></span><a class="drawer-menu-item" href="./contect.html">联系我们</a></li>');

        }

        function pullDownAction () {

            if(!isLoadingData){//防止重复加载
                isLoadingData = true;
                this.pageNum = 1;
                allDataLoaded = false;
                $('#lmmc').html(curLm.mc);
                var lmid = curLm.lmid;
                $.ajax({
                    type: 'GET',

                    url: './datajson.json',
                    dataType: 'json',
                    success:function(data){
                        $.each(data,function(key,value){
                            if(key==lmid){


                                var showPic = true;
                                var ret = null;
                                var start = 20*(pageNum- 1);
                                var end = start + 20;
                                //如果所有的文章都包含图片，即显示图片
                                for(var i = 0 ; i < value.length;i++){
                                    if(!!!value[i].gdtpwj){
                                        showPic = false;
                                    }
                                }
                                if(end > value.length){
                                    end = value.length;
                                }
                                if(start < end){
                                    ret = value.slice(start,end);
                                }
                                if(end == value.length){//所有数据已经读取完毕
                                    allDataLoaded = true;
                                    document.querySelector('.pullUpLabel').innerHTML = "数据已全部加载"
                                }else{
                                    allDataLoaded = false;
                                    document.querySelector('.pullUpLabel').innerHTML = "正在加载更多..."
                                }
                                $('.news-text').remove();
                                for(var j = 0 ; j < ret.length;j++){
                                    if(curLm.lmid=='spzx_div'){
                                        initBanner('spzx_div');
                                        $('#news').append(renderVideoRow(ret[j],j,key));
                                        $('.banner').css('display','block');
                                    }else if(curLm.lmid == 'gfwh_div'){
                                        $('#news').append(renderCultureRow(ret[j],key));
                                    }else if(showPic){
                                        if(curLm.lmid=='gfrw_div'){
                                            $('#news').append(renderRwRow(ret[j],key));
                                        }else{
                                            $('#news').append(renderPicRow(ret[j],key));
                                        }
                                    }else{
                                        $('#news').append(renderRow(ret[j],key))
                                    }
                                }
                                if(notifyApp != null){
                                    notifyApp();
                                }
                                pageNum++;
                                myScroll.refresh();
                                isLoadingData = false;


                            }
                        });
                    }
                });
            }
        }

        function pullUpAction () {
            if(!isLoadingData && !allDataLoaded){//防止重复加载
                isLoadingData = true;
                allDataLoaded = false;
                // console.log(curLm)
                var lmid = curLm.lmid;
                $.ajax({
                    type: 'GET',
                    url: './datajson.json',
                    dataType: 'json',
                    success:function(data){
                        $.each(data,function(key,value){
                            if(key==lmid){
                                var showPic = true;
                                //如果所有的文章都包含图片，即显示图片
                                for(var i = 0 ; i < value.length;i++){
                                    if(!!!value[i].gdtpwj){
                                        showPic = false;
                                    }
                                }
                                var ret = null;
                                var start = 20*(pageNum- 1);
                                var end = start + 20;
                                if(end > value.length){
                                    end = value.length;
                                }
                                if(start < end){
                                    ret = value.slice(start,end);

                                }
                                if(end == value.length){//所有数据已经读取完毕
                                    allDataLoaded = true;
                                    document.querySelector('.pullUpLabel').innerHTML = "数据已全部加载"
                                }else{
                                    allDataLoaded = false;
                                    document.querySelector('.pullUpLabel').innerHTML = "正在加载更多..."
                                }

                                for(var j = 0 ; j < ret.length;j++){
                                    if(curLm.lmid=='spzx_div'){
                                        initBanner('spzx_div');
                                        $('#news').append(renderVideoRow(ret[j],j,key));
                                        $('.banner').css('display','block');
                                    }else if(curLm.lmid == 'gfwh_div'){
                                        $('#news').append(renderCultureRow(ret[j],key));
                                    }else if(showPic){
                                        if(curLm.lmid=='gfrw_div'){
                                            $('#news').append(renderRwRow(ret[j],key));
                                        }else{
                                            $('#news').append(renderPicRow(ret[j],key));
                                        }
                                    }else{
                                        $('#news').append(renderRow(ret[j]))
                                    }
                                }
                                if(notifyApp != null){
                                    notifyApp();
                                }
                                pageNum++;
                                myScroll.refresh();
                                isLoadingData = false;

                            }
                        });
                    }
                });
            }
        }
        function formatDate(dateStr){
            var date = new Date(dateStr);
            return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
        }
        function loaded() {
            pullDownEl = document.getElementById('pullDown');
            pullDownOffset = pullDownEl.offsetHeight;
            pullUpEl = document.getElementById('pullUp');	
            pullUpOffset = pullUpEl.offsetHeight;
            hideHeader = false;
            myScroll = new iScroll('wrapper', {
                // useTransition: true,

                topOffset: 50,
                onRefresh: function () {
                    if (pullDownEl.className.match('loading')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '继续下拉刷新...';
                    } else if (pullUpEl.className.match('loading')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    }
                },
                onScrollMove: function () {
                    if(!hideHeader){
                        hideHeader = true;
                        $('#header').animate({top:-$('.header').innerHeight()});
                        $('#wrapper').animate({top:$('#news-title').innerHeight(),bottom:0},function(){
                            myScroll.refresh();
                            $('.open-drawer-menu-on-page').css('display','block');
                            
                        });
                        $('#footer').animate({bottom:-$('#footer').innerHeight()});
                        
                    }
                    if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新...';
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '继续下拉刷新...';
                        this.minScrollY = -pullDownOffset;
                    } 

                },
                onScrollEnd: function () {
                    if(allDataLoaded){
                        this.maxScrollY += $('#pullUp').innerHeight();
                    }
                    if (pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'loading';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
                        pullDownAction();	// Execute custom function (ajax call?)
                    }
                    if(this.maxScrollY+5 > this.y){
                       pullUpAction();
                    }


                }
            });
            

        }
        function renderRow(data,lmid){
            var bt = data.bt;
            bt = bt.substring(0,20) + '…';
            return '<a href="./content.html?wzid='+data.wzid+'&lmid='+lmid+'" class="news-a"><div class="news-text">'+

                    '<div class="news-p">'+
                        '<p class="news-p1">'+bt+'</p>'+
                    '</div>'+
                    '<div class="news-time clearfix">'+
                        '<span class="news-times">'+formatDate(data.fbsj)+'</span>'+
                        '<span class="news-times-icon"></span>'+
                    '</div>'+
                '</div></a>';
        }
        function renderPicRow(data,lmid){
            var bt = data.bt;
            bt = bt.substring(0,20) + '…';
            return '<a href="./content.html?wzid='+data.wzid+'&lmid='+lmid+'" class="news-a"><div class="news-text">'+
                    '<img class="news-img" src="'+data.gdtpwj+'" />'+
                    '<div class="news-p">'+
                        '<p class="news-p1">'+bt+'</p>'+
                    '</div>'+
                    '<div class="news-time clearfix">'+
                        '<span class="news-times">'+formatDate(data.fbsj)+'</span>'+
                        '<span class="news-times-icon"></span>'+
                    '</div>'+
                '</div></a>';
        }
		function renderVideoRow(data,i,lmid){
            var bt = data.bt;
            bt = bt.substring(0,20) + '…';
			return '<a href="./content.html?wzid='+data.wzid+'&lmid='+lmid+'" class="news-a"><div class="news-text show-'+i+'">'+
				'<span class="video-span"><img src="'+data.gdtpwj+'" /><em class="video-tb"></em></span>'+
				'<div class="news-p">'+
					'<p class="news-p1">'+bt+'</p>'+
					'</div>'+
				'<div class="news-time clearfix">'+
					'<span class="news-times">'+formatDate(data.fbsj)+'</span>'+
					'<span class="news-times-icon"></span>'+
					'</div>'+
				'</div></a>';
        }
        function renderCultureRow(data,lmid){
            var bt = data.bt;
            bt = bt.substring(0,20) + '…';
            return '<a href="./content.html?wzid='+data.wzid+'&lmid='+lmid+'" class="news-a"><div class="news-text">'+
                    '<img style="width: 87.6px;" class="news-img" src="'+data.gdtpwj+'" />'+
                    '<div class="news-p">'+
                        '<p class="news-p1">'+bt+'</p>'+
                    '</div>'+
                    '<div class="news-time clearfix">'+
                        '<span class="news-times">'+formatDate(data.fbsj)+'</span>'+
                        '<span class="news-times-icon"></span>'+
                    '</div>'+
                '</div></a>';
        }
        function renderRwRow(data,lmid){
            var bt = data.bt;
            bt = bt.substring(0,12) + '…';
            return '<a href="./content.html?wzid='+data.wzid+'&lmid='+lmid+'" class="news-a"><div class="news-text">'+
                    '<img style="width: 69px;height: 75px;" class="news-img" src="'+data.gdtpwj+'" />'+
                    '<div class="news-p">'+
                        '<p class="news-p1" style="font-size: 16px;font-weight: bold;line-height: 1.5;">'+bt+'</p>'+
                        '<p class="news-p2" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;word-break: break-all;font-size:12px;">'+data.zwwj.substring(0,40)+'...'+'</p>'+
                    '</div>'+
                 '</div>'+
                '</a>';
        }
		function removeHTMLTag(str) {
			str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
			str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
			//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
			str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
			str=str.replace(/\s/g,''); //将空格去掉
			return str;
		}
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);