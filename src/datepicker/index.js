
var DatePicker = function(option){
    this.data = {
        el: '',
        date: '',                   // 不填默认当前日期，格式yyyy-MM-dd
        formatDateSymbol: '-',     // 日期显示连接符，默认'-'，可选'/'
        className: '',            // 选择器className，会给el添加该类名
        dropdownClassName: '',   // 日期选择器className
        onChange: '',           // 点击日期回调
    }

    this.curDate = '';
    this.year = '';
    this.month = '';
    this.day = '';
    this.curYear = '';
    this.curMonth = '';
    this.curDay = '';
    this.selectedDate = '';

    this.datepickerPanel = $('<div class="pz-datepicker-panel"></div>');

    this.init(option);
}

DatePicker.prototype = {
    constructor: DatePicker,

    init: function(option){
        var self = this;

        if(!option) return;

        for(var key in option){
            this.data[key] = option[key];
        }

        this.curDate = this.data.date ? new Date(this.data.date) : new Date();
        this.year = this.curYear = this.curDate.getFullYear();
        this.month = this.curMonth = this.curDate.getMonth();
        this.day = this.curDay = this.curDate.getDate();
        this.data.className && $(this.data.el).addClass(this.data.className);
        this.data.dropdownClassName && this.datepickerPanel.addClass(this.data.dropdownClassName);

        var datepickerHd = '<div class="pz-datepicker-hd">' + 
                                '<span class="prev-year" id="prev-year"></span>' + 
                                '<span class="prev-month" id="prev-month"></span>' + 
                                '<span id="cur-month"></span>' + 
                                '<span class="next-month" id="next-month"></span>' + 
                                '<span class="next-year" id="next-year"></span>' +
                            '</div>',
            datepickerBd = '<div class="pz-datepicker-bd">' + 
                                '<ul class="week-hd">' + 
                                    '<li>日</li>' + 
                                    '<li>一</li>' + 
                                    '<li>二</li>' + 
                                    '<li>三</li>' + 
                                    '<li>四</li>' + 
                                    '<li>五</li>' + 
                                    '<li>六</li>' + 
                                '</ul>' + 
                                '<ul class="week-bd"></ul>' +
                            '</div>';

        this.datepickerPanel.html(datepickerHd + datepickerBd);
        this.__render();
        $(this.data.el).find('input').on('click', function(){
            $(this).addClass('active');
            $(self.data.el).append(self.datepickerPanel);
            self.__dateFn();
        });       

        $(this.data.el).on('click', function(e){
            switch(e.target.id){
                case 'prev-year': 
                    self.__prevYearFn();
                    break;
                case 'prev-month':
                    self.__prevMonthFn();
                    break;
                case 'next-month':
                    self.__nextMonthFn();
                    break;
                case 'next-year':
                    self.__nextYearFn();
                    break;
                default: 
                    break;
            }
        })

        return this;
    },

    __formatDate: function(y, m, d){
        m = (m.toString())[1] ? m : '0' + m;
        d = (d.toString())[1] ? d : '0' + d;
        return y + this.data.formatDateSymbol + m + this.data.formatDateSymbol + d;
    },

    __render: function(){
        var fullDay = new Date(this.year, this.month + 1, 0).getDate(),     // 当月总天数
            weekDay = new Date(this.year, this.month, 1).getDay(),         // 当月第一天是周几
            total = (fullDay + weekDay) % 7 == 0 ? (fullDay + weekDay) : fullDay + weekDay + (7 - (fullDay + weekDay) % 7),   // 当月元素总个数
            lastMonthDay = new Date(this.year, this.month, 0).getDate(),    // 上个月最后一天
            eleTemp = [];

        for(var i = 0; i < total; i++){
            if(i < weekDay){
                eleTemp.push('<li class="other-month"><span>' + (lastMonthDay - weekDay + 1 + i) + '</span></li>');
            }else if(i < weekDay + fullDay){
                var nowDate = this.__formatDate(this.year, this.month + 1, i + 1 - weekDay),
                    addClass = '';

                this.selectedDate == nowDate && (addClass = 'selected-day');
                this.__formatDate(this.curYear, this.curMonth + 1, this.curDay) == nowDate && (addClass = 'cur-day');
                eleTemp.push('<li class="cur-month"><span title="' + nowDate + '" class="' + addClass + '">' + (i + 1 - weekDay) + '</span></li>');
            }else{
                eleTemp.push('<li class="other-month"><span>' + (i + 1 - (weekDay + fullDay)) + '</span></li>');
            }
        }

        this.datepickerPanel.find('.week-bd').html(eleTemp.join(''));
        this.datepickerPanel.find('#cur-month').html(this.year + '年' + (this.month + 1) + '月');
    },

    __dateFn: function(){
        var self = this;

        this.datepickerPanel.on('click', '.cur-month', function(e){
            e.stopPropagation();
            self.selectedDate = $(this).find('span').attr('title');
            $(self.data.el).find('input').val(self.selectedDate).removeClass('active');

            self.__render();
            self.data.onChange && self.data.onChange(self.year, self.month + 1, parseInt($(this).find('span').text()));
            self.datepickerPanel.remove();
        })
    },

    __prevMonthFn: function(){
        if(this.month - 1 < 0){
            this.year -= 1;
            this.month = 11;
        }else{
            this.month -= 1;
        }

        this.__render();
    },

    __prevYearFn: function(){
        this.year -= 1;
        this.__render();
    },

    __nextMonthFn: function(){
        if(this.month + 1 > 11){
            this.year += 1;
            this.month = 0;
        }else{
            this.month += 1;
        }

        this.__render();
    },

    __nextYearFn: function(){
        this.year += 1;
        this.__render();
    }
}