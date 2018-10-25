
var Page = function(option){
    this.data = {
        el: null,
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        showPageCount: 5,       // 连续显示页码个数
        hasFLBtn: false,       // 是否显示首尾页码
        hasPNBtn: true,       // 是否显示上一页下一页页码
        jump: null
    }

    this.totalPage = 0;

    this.init(option);
}

Page.prototype = {
    constructor: Page,

    init: function(option){

        if(option){
            $.extend(this.data, option);
        }

        this.totalPage = Math.ceil(this.data.totalCount / this.data.pageSize);
        this.__createPageList();
        this.__changePage();

        return this;
    },

    __createPageList: function(){
        var data = this.data,
            flBtn = this.__showFLBtn(),
            pnBtn = this.__showPNBtn(),
            lastStr = '<span>...</span><a data-page="' + this.totalPage + '">' + this.totalPage + '</a>';
            str = '';

        str += flBtn.firstBtn;
        str += pnBtn.prevBtn;

        // 总页数小于连续显示页码个数
        if(this.totalPage < data.showPageCount){
            str += this.__prevFifthBtn(this.totalPage);
        }

        // 总页数大于连续显示页码个数
        if(this.totalPage > data.showPageCount){
            // 当前页码小于连续显示页码个数
            if(data.pageNo < data.showPageCount){
                str += this.__prevFifthBtn(data.showPageCount);
                str += lastStr;
            }

            // 当前页码大于等于连续显示页码个数
            if(data.pageNo >= data.showPageCount){
                str += '<a data-page="1">1</a><span>...</span>';

                var ceil = Math.ceil(data.showPageCount / 2),        // 向上取整
                    floor = Math.floor(data.showPageCount / 2);     // 向下取整

                if(this.totalPage - data.pageNo > floor - 1){
                    var hasSpan = (this.totalPage - data.pageNo !== floor && this.totalPage - data.pageNo !== ceil),
                        offset = this.totalPage - data.pageNo === ceil ? ceil : floor;

                    for(var i = data.pageNo - floor; i <= data.pageNo + offset; i++){
                        str += data.pageNo === i ? '<a class="cur" data-page="' + i + '">' + i + '</a>' : '<a data-page="' + i + '">' + i + '</a>';
                    }

                    if(hasSpan){
                        str += lastStr;
                    }
                }else{
                    for(var i = this.totalPage - data.showPageCount; i < this.totalPage; i++){
                        str += data.pageNo === (i + 1) ? '<a class="cur" data-page="' + (i + 1) + '">' + (i + 1) + '</a>' : '<a data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
                    }
                }
            }
        }

        str += pnBtn.nextBtn;
        str += flBtn.lastBtn;       

        $(this.data.el).html(str);
    },
    
    __prevFifthBtn: function(page){
        var prevFifthBtn = '';

        for(var i = 0; i < page; i++){
            if(this.data.pageNo === (i + 1)){
                prevFifthBtn += '<a class="cur" data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
            }else{
                prevFifthBtn += '<a data-page="' + (i + 1) + '">' + (i + 1) + '</a>';
            }
        }

        return prevFifthBtn;
    },

    __showFLBtn: function(){
        var flBtn = {
            firstBtn: '',
            lastBtn: ''
        };

        if(this.data.hasFLBtn){
            flBtn.firstBtn = this.data.pageNo === 1 ? '<a class="disable">首页</a>' : '<a data-page="1">首页</a>';
            flBtn.lastBtn = this.data.pageNo === this.totalPage ? '<a class="disable">尾页</a>' : '<a data-page="' + this.totalPage + '">尾页</a>';
        }

        return flBtn;
    },

    __showPNBtn: function(){
        var pnBtn = {
            prevBtn: '',
            nextBtn: ''
        };

        if(this.data.hasPNBtn){
            pnBtn.prevBtn = this.data.pageNo === 1 ? '<a class="disable">上一页</a>' : '<a data-page="' + (this.data.pageNo - 1) + '">上一页</a>';
            pnBtn.nextBtn = this.data.pageNo === this.totalPage ? '<a class="disable">下一页</a>' : '<a data-page="' + (this.data.pageNo + 1) + '">下一页</a>';
        }

        return pnBtn;
    },

    __changePage: function(){
        var self = this;

        $(this.data.el).on('click', 'a', function(){
            var pageNo = parseInt($(this).attr('data-page'));
            if(pageNo){
                self.data.pageNo = pageNo;
                self.__createPageList();
                self.data.jump && self.data.jump(self.data.pageNo);
            }
        })
    }
}