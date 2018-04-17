/**
 * 弹窗组件
 * @param title string 标题
 * @param text string 内容
 * @param btns json [{},{}] 按钮
 * @param callback function 回调函数
 */
function showAlert (title,text,btns,callback){
    var name = title != '' ? '<div class="title">' + title + '</div>' : '';
    var button = '';
    for(var h = 0;h < btns.length;h++){
        var url = btns[h].u || "",w = 100 / btns.length;
        if(h==1){
            button += '<a href="javascript:;" class="flex center btns" data-url="' + url + '" style="width:' + w + '%;color:#4192d4">' + btns[h].t + '</a>';
        }else{
            button += '<a href="javascript:;" class="flex center btns" data-url="' + url + '" style="width:' + w + '%">' + btns[h].t + '</a>';
        }
    }
    var template = '<div id="alert">' +
        '<div class="mask" style="position:absolute;top:0;left:0;width:100%;height:100%;"></div>' +
        '<div class="content">' +
        name +
        '<div class="text">' + text + '</div>' +
        '<div class="flex button">' + button + '</div>' +
        '</div>' +
        '</div>';
    $('body').append(template);
    var offset = {'height':$('#alert .content').height(),'width': $('#alert .content').width()};
    $('#alert .content').css({
        'margin' : parseInt(-offset.height/2) + 'px 0 0 ' + parseInt(-offset.width/2) + 'px',
        'transform' : 'scale(0)',
        '-webkit-transform' : 'scale(0)'
    });
    setTimeout(function (){
        $('#alert .content').css({
            'visibility' : 'visible',
            'transform' : 'scale(1)',
            '-webkit-transform' : 'scale(1)'
        });
    },200);
    $('#alert .button a').click(function (){
        $('#alert').removeClass('show');
        setTimeout(function (){$('#alert').remove();},200);
        var index = $(this).index(),url = $(this).attr('data-url');
        if('function' == typeof callback) callback(index,url);
    });
    $('#alert .mask').click(function (){
        $('#alert').removeClass('show');
        setTimeout(function (){$('#alert').remove();},200);
    });
}