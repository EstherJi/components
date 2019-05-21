var Ruler = function(option){
    this.data = {
        wrapperId: '',           // 容器id
        max: 10000,             // 最大值
        min: 0,              // 最小值
        minUnit: 100,         // 最小单位刻度
        unitSet: 10,         // 单位刻度组
        mult: 1,            // 单位刻度的倍数，最小为1，即每一刻度占10px
        value: 100,        // 默认值
        callback: ''      // 回调函数
    },

    this.limitLeft = 0;
    this.scrollerWidth = 0;
    this.wrapperWidth = 0;
    this.pLeft = 0;
    this.firstRand = true;
    this.fixedLen = 0;
    this.canTouch = true;

    this.init(option);
}

Ruler.prototype = {
    constructor: Ruler,

    init: function(option){
        var self = this;

        if(option){
            $.extend(this.data, option);
        }

        this.canTouch = true;
        this.fixedLen = this.data.minUnit.toString().split('.')[1] ? this.data.minUnit.toString().split('.')[1].length : 0;

        if(this.data.min > this.data.max) this.data.min = 0;
        $(this.data.wrapperId).addClass('ruler-wrapper').append('<div class="ruler-scroller"></div><div class="ruler-pointer"></div>');

        var setLen = Math.ceil((this.data.max - this.data.min) / (this.data.unitSet * this.data.minUnit)) + 4,
            setWidth = this.data.unitSet * 10 * this.data.mult,
            str = '',
            rulerStartNo = 0;

        if(this.firstRand){
            this.pLeft = $(this.data.wrapperId).find('.ruler-pointer').position().left;
        }

        for(var z = 1; z < setLen; z++){
            if(z * setWidth > this.pLeft){
                this.limitLeft = this.pLeft - z * setWidth;
                rulerStartNo = z;
                break;
            }
        }

        for(var i = 0; i < setLen; i++){
            str += '<span class="size-no" style="left: ' + (i * setWidth - setWidth / 2) + 'px; width: ' + setWidth + 'px"></span>' + 
                    '<ul style="width: ' + setWidth + 'px">';

            if(i >= rulerStartNo && i < setLen - 2){
                for(var j = 0; j < (this.data.unitSet - 1); j++){
                    str += '<li style="width: ' + (10 * this.data.mult) + 'px"></li>';
                }
            }
            
            str += '</ul>';
        }
        $(this.data.wrapperId).find('.ruler-scroller').append(str);

        $(this.data.wrapperId).find('.size-no').each(function(index, ele){
            if(index >= rulerStartNo && index < setLen - 1){
                var indexValue = (index - rulerStartNo) * self.data.minUnit * self.data.unitSet + self.data.min;
                if(self.fixedLen) indexValue = indexValue.toFixed(self.fixedLen);
                $(ele).html(indexValue);
            }
        })

        this.wrapperWidth = $(this.data.wrapperId).width();
        this.scrollerWidth = setLen * 10 * this.data.unitSet * this.data.mult;
        this.setValue(this.data.value);
        this.touchEvent();
    },

    touchEvent: function(){
        if(!this.canTouch) return;

        var self = this,
            startX = '',
            rulerScroller = $(this.data.wrapperId).find('.ruler-scroller');

        $(this.data.wrapperId).on('touchstart', function(e){
            var touch = e.originalEvent.targetTouches[0];
            startX = touch.pageX;
        })

        $(this.data.wrapperId).on('touchmove', function(e){
            var touch = e.originalEvent.targetTouches[0],
                x = touch.pageX,
                scrollerLeft = rulerScroller.position().left,
                dis = scrollerLeft + x - startX;

            if(scrollerLeft - 50 > self.limitLeft || self.wrapperWidth - self.scrollerWidth > scrollerLeft + 50) return;

            var pointerVal = Math.floor((self.limitLeft - dis) / (10 * self.data.mult)) > 0 ? Math.floor((self.limitLeft - dis) / (10 * self.data.mult)) : 0;
            pointerVal = self.data.minUnit * pointerVal + self.data.min;

            if(self.fixedLen) pointerVal = pointerVal.toFixed(self.fixedLen);
            self.data.callback && self.data.callback(pointerVal);
            rulerScroller.css('left', dis);
        })

        $(this.data.wrapperId).on('touchend', function(e){
            var scrollerLeft = rulerScroller.position().left,
                disNo = Math.round((scrollerLeft - self.pLeft) / (10 * self.data.mult)),
                nDis = disNo * 10 * self.data.mult + self.pLeft,
                pointerVal = Math.floor((self.limitLeft - nDis) / (10 * self.data.mult));

            if(scrollerLeft > self.limitLeft){
                rulerScroller.css('left', self.limitLeft);
                self.data.callback && self.data.callback(self.data.min);
                return;
            }else if(self.wrapperWidth - self.scrollerWidth > scrollerLeft){
                self.setValue(self.data.max);
                return;
            }

            pointerVal = self.data.minUnit * pointerVal + self.data.min;
            rulerScroller.css('left', nDis);
            if(self.fixedLen) pointerVal = pointerVal.toFixed(self.fixedLen);
            self.data.callback && self.data.callback(pointerVal);
        })
    },

    setValue: function(val){
        var nowValue = val ? val : this.data.min;

        if(nowValue > this.data.max) nowValue = this.data.max;
        if(nowValue < this.data.min) nowValue = this.data.min;

        var diff = nowValue - this.data.min;
        $(this.data.wrapperId).find('.ruler-scroller').css('left', this.limitLeft - diff * 10 * this.data.mult / this.data.minUnit);
        this.data.callback && this.data.callback(nowValue);
    },

    reDrawRuler: function(params){
        if(params){
            $.extend(this.data, params);
        }

        this.firstRand = false;
        this.canTouch = false;
        this.fixedLen = this.data.minUnit.toString().split('.')[1] ? this.data.minUnit.toString().split('.')[1].length : 0;
        $(this.data.wrapperId).html('');
        this.init(this.data);
    }
}