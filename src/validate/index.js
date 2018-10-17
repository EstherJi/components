
var Validate = function(){
    this.option = {
        form: null,
        rules: null,
        blurCheck: true,
        inputEl: '.valid',
        errorTipClass: 'error-tip',
        errorClass: 'has-error'
    };

    this.eles = [];
    this.defaultRulesPattern = {
        name: /^[a-zA-Z\u4e00-\u9fa5]{1,6}$/,
        mobile: /^1(3|4|5|7|8)\d{9}$/,
        code: /^\d{4}$/,
        password: /^[0-9A-Za-z]{6,16}$/
    };
}

Validate.prototype = {
    constructor: Validate,

    init: function(option){
        var self = this;

        if(!option) return;

        for(var key in option){
            this.option[key] = option[key];
        }

        var rules = this.option.rules;
        this.option.form.find(this.option.inputEl).each(function(index){
            var propName = $(this).attr('prop');
            if(propName in rules){
                self.eles.push({
                    obj: $(this),
                    objId: $(this).attr('id'),
                    objIndex: index,
                    objTip: $('<div class="' + self.option.errorTipClass + '"></div>'),
                    pattern: rules[propName]['pattern'] ? rules[propName]['pattern'] : propName in self.defaultRulesPattern ? self.defaultRulesPattern[propName] : '',
                    name: propName,
                    nullMsg: rules[propName]['nullMsg'] ? rules[propName]['nullMsg'] : '该项不能为空',
                    errorMsg: rules[propName]['errorMsg'] ? rules[propName]['errorMsg'] : '格式错误',
                    recheck: rules[propName]['recheck'] ? rules[propName]['recheck'] : ''
                })
            }
        })

        if(this.option.blurCheck){
            $.each(this.eles, function(index, val){
                val.obj.on('blur', function(){
                    self.__validate(index)
                })
            })
        }

        return this;
    },

    __validate: function(index){
        var target = this.eles[index],
            targetVal = target.obj.val(),
            result = true;

        if(targetVal){
            if(target.recheck){
                $.each(this.eles, function(index, val){
                    if(target.recheck === val.name){
                        result = targetVal === val.obj.val();
                    }
                })
            }else{
                result = target.pattern ? target.pattern.test(targetVal) : true;
            }

            target.objTip.html(result ? '' : target.errorMsg);
        }else{
            result = false;
            target.objTip.html(target.nullMsg);
        }

        if(!result){
            target.obj.parent().addClass(this.option.errorClass).append(target.objTip);
            target.objTip.fadeIn(200);
        }else{
            target.obj.parent().removeClass(this.option.errorClass);
            target.objTip.remove();
        }

        return result;
    },

    __getObjIndex: function(id){
        var index = -1;

        for(var i = 0; i < this.eles.length; i++){
            if(id == this.eles[i].objId){
                index = this.eles[i].objIndex;
            }
        }  

        return index;
    },

    setPattern: function(id, pattern){
        var index = this.__getObjIndex(id);
        this.eles[index].pattern = pattern;
    },

    check: function(id){
        var index = this.__getObjIndex(id),
            result = this.__validate(index);

        return result;
    },

    formCheck: function(){
        var self = this,
            form = {},
            result = true;

        $.each(this.eles, function(index, val){
            if(self.__validate(index)){
                form[val.name] = val.obj.val();
            }else{
                result = false;
            }
        })

        return result ? form : '';
    },

    resetFields: function(){
        for(var i = 0; i < this.eles.length; i++){
            this.eles[i].obj.parent().removeClass(this.option.errorClass);
            this.eles[i].obj.val('');
            this.eles[i].objTip.remove();
        }
    }
}