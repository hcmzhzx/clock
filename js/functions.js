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

/**
 * 提示框
 * @param msg 描述
 * @param state 状态
 * @param timeout 隐藏时间
 * @param dom 要插入到的元素
 */
function showMsg (msg,state,dom,timeout){
    var state = state || 0,timeout = timeout || 1000,dom = dom || 'body';
    var icon = '',bgColor = '',pos = dom == 'body' ? 'fixed' : 'absolute';
    if(state == 0){
        bgColor = 'background:rgba(255,0,0,0.6)';
        icon = '<span style="position:absolute;top:16px;left:6px;right:6px;height:2px;background:#fff;transform:rotate(45deg);"></span><span style="position:absolute;top:16px;left:6px;right:6px;height:2px;background:#fff;transform:rotate(-45deg);"></span>';
    }else{
        bgColor = 'background:rgba(0,0,0,0.6)';
        icon = '<span style="position:absolute;top:18px;left:10px;width:24px;height:2px;background:#fff;transform:rotate(-45deg);"></span><span style="position:absolute;top:22px;left:2px;width:14px;height:2px;background:#fff;transform:rotate(45deg);"></span>';
    }
    var template = '<div id="msgBox" style="position:' + pos + ';top:50%;left:50%;width:160px;padding:10px;margin-left:-90px;' + bgColor +  ';border-radius:4px;transform:scale(0);transition:transform 0.2s linear;z-index:999;">' +
        '<div class="icon" style="position:relative;width:36px;height:36px;border-radius:50%;border:2px solid #fff;margin:0 auto;">' + icon + '</div>' +
        '<div class="msg" style="padding:8px 0;text-align:center;color:#fff;">' + msg + '</div>' +
        '</div>';
    $(template).appendTo($(dom));
    setTimeout(function (){
        var ih = ($('#msgBox').height() + 20)/2;
        $('#msgBox').css({'margin-top':-ih,'transform':'scale(1)'});
    },100);
    setTimeout(function (){
        $('#msgBox').remove();
    },timeout + 100);
}

// 表单验证
var checkForm = function (config){
    this.defaultRule = {
        "*": /^[\w\W]+$/,
        "*2-10": /^[\w\W]{2,10}$/,
        "n": /^\d+$/,
        "m": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/,
        "e": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        "cname": /^[\u0391-\uFFE5]{2,15}$/,
        "idcard": /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        "card" : /^\d{16,20}$/,
        "pwd" : /^[^\s]{6,16}$/,
        "domain" : /^[^\s]{3,6}$/
    };
    this.form = config.form || '#forms';
    this.btn = config.btn || '.submit';
    this.error = config.error || null;
    this.complete = config.complete || null;
    this.init();
};

checkForm.prototype.selector = function (selector,obj){
    var _ele = obj ? obj.querySelectorAll(selector) : document.querySelector(selector);
    return _ele;
};

checkForm.prototype.init = function (){
    var _this = this;
    var _btn = _this.selector(_this.btn),_form = _this.selector(_this.form);
    if(!_btn || !_form) return this;
    _btn.addEventListener('click',function (){
        var _formEle = _this.selector('input,select,textarea',_form);
        var _passed = true;
        for(var i = 0; i< _formEle.length; i ++){
            var _obj = _formEle[i],_rule = _obj.getAttribute('data-rule'),_disable = _obj.disabled,_sync = _obj.getAttribute('data-sync');
            if(_sync && _this.selector(_sync)){
                _rule = _this.selector(_sync).getAttribute('data-rule');
            }
            if(_rule && !_disable){
                var _ruleReg = _rule.indexOf('/') > -1 ? eval(_rule) : _this.defaultRule[_rule];
                if(_ruleReg){
                    var _errMsg = _obj.getAttribute('data-errmsg'),_val = _obj.value;
                    if(!_ruleReg.test(_val)){
                        _obj.focus();
                        if(_this.error) _this.error(_obj,_errMsg);
                        _passed = false;
                        break;
                    }
                    if(_sync && _this.selector(_sync)){
                        if(_obj.value != _this.selector(_sync).value){
                            _obj.focus();
                            if(_this.error) _this.error(_obj,_errMsg);
                            _passed = false;
                            break;
                        }
                    }
                }
            }
        }
        if(_passed && _this.complete) _this.complete(_form);
    },false);
};

checkForm.prototype.check = function (){
    if(arguments.length == 0) return false;
    var _this = this;
    for(var i = 0;i < arguments[0].length;i ++){
        var obj = arguments[0][i];
        var rule = obj.getAttribute('data-rule'),disable = obj.disabled,sync = obj.getAttribute('data-sync');
        if(sync && _this.selector(sync)) rule = _this.selector(sync).getAttribute('data-rule');
        if(sync && obj.value != _this.selector(sync).value && !disable){
            return obj.getAttribute('data-errmsg');
            break;
        }
        if(rule && !disable){
            var ruleReg = rule.indexOf('/') > -1 ? eval(rule) : _this.defaultRule[rule];
            if(ruleReg){
                var errMsg = obj.getAttribute('data-errmsg'),val = obj.value;
                if(!ruleReg.test(val)){
                    obj.focus();
                    return errMsg;
                    break;
                }
            }
        }
    }
};