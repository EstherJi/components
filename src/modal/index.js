
var Modal = function(option){
    this.data = {
        type: 'info',                  // 可传info, confirm
        title: '提示',          
        content: '',
        confirmText: '确定',
        cancelText: '取消',
        width: '500px',            // 弹出层宽度，默认500px
        closable: true,           // 是否自动触发弹框关闭
        maskClosable: false,     // 点击遮罩是否可关闭
        hasCloseIcon: false,    // 是否显示右上角关闭按钮
        wrapClassName: '',     // 对话框外层容器类名
        footer: true,         // 是否显示底部按钮
        dragable: false,     // 是否可拖拽
        onInit: '',
        onConfirm: '',
        onCancel: ''
    }

    this.pzMask = $('<div class="pz-modal-mask"></div>');
    this.pzWrap = $('<div class="pz-modal-wrap"></div>');
    this.pzClose = $('<i class="pz-modal-close"></i>');
    this.pzWrapFooter = $('<div class="pz-modal-footer"></div>');

    this.dragData = {
        disX: 0,        
        disY: 0, 
        left: 0,
        top: 0
    };

    this.init(option);
}

Modal.prototype = {
    constructor: Modal,

    init: function(option){
        var self = this;

        if(option){
            $.extend(this.data, option);
        }

        this.pzWrap.css('width', this.data.width);
        this.data.wrapClassName ? this.pzWrap.addClass(this.data.wrapClassName) : '';

        if(this.data.hasCloseIcon){
            this.pzClose.appendTo(this.pzWrap).on('click', function(){
                self.close();
            })
        }

        var wrapTitle = $('<div class="pz-modal-header">' + this.data.title + '</div>'),
            wrapContent = $('<div class="pz-modal-body">' + this.data.content + '</div>');
        this.pzWrap.append(wrapTitle, wrapContent);

        if(this.data.footer){
            this.pzWrap.append(this.pzWrapFooter);
            switch(this.data.type){
                case 'info':
                    this.__info();
                    break;
                case 'confirm':
                    this.__confirm();
                    break;
            }
        }

        if(this.data.maskClosable){
            this.pzMask.on('click', function(){
                self.close();
            })
        }

        this.data.onInit && this.data.onInit(this);
        $('body').append(this.pzMask, this.pzWrap);

        if(this.data.dragable){
            this.__drag();
        }

        return this;
    },

    __info: function(){
        var self = this,
            confirmBtn = $('<a class="btn confirm-btn">' + this.data.confirmText + '</a>');

        confirmBtn.appendTo(this.pzWrapFooter).on('click', function(){
            self.data.onConfirm && self.data.onConfirm(self);
            self.data.closable && self.close();
        })
    },

    __confirm: function(){
        var self = this,
            confirmBtn = $('<a class="btn confirm-btn">' + this.data.confirmText + '</a>'),
            cancelBtn = $('<a class="btn cancel-btn">' + this.data.cancelText + '</a>');

        cancelBtn.appendTo(this.pzWrapFooter).on('click', function(){
            self.data.onCancel && self.data.onCancel(self);
            self.data.closable && self.close();
        });

        confirmBtn.appendTo(this.pzWrapFooter).on('click', function(){
            self.data.onConfirm && self.data.onConfirm(self);
            self.data.closable && self.close();
        })
    },

    close: function(){
        this.pzMask.remove();
        this.pzWrap.remove();
    },

    __drag: function(){
        var self = this,
            flag = false,
            winHeight = $(window).height(),
            winWidth = $(window).width();

        this.pzWrap.css('cursor', 'move');

        this.pzWrap.on('mousedown', function(e){
            self.dragData.disX = e.pageX - self.pzWrap.offset().left;
            self.dragData.disY = e.pageY - self.pzWrap.offset().top;
            flag = true;
        });

        $(document).on('mousemove', function(e){
            if(flag){
                self.dragData.left = e.pageX - self.dragData.disX;
                self.dragData.top = e.pageY - self.dragData.disY;

                if(self.dragData.left < 0){
                    self.dragData.left = 0;
                }else if(self.dragData.left > winWidth - self.pzWrap.width()){
                    self.dragData.left = winWidth - self.pzWrap.width();
                }

                if(self.dragData.top < 0){
                    self.dragData.top = 0;
                }else if(self.dragData.top > winHeight - self.pzWrap.height()){
                    self.dragData.top = winHeight - self.pzWrap.height();
                }

                self.pzWrap.css({
                    transform: 'translate(0, 0)',
                    left: self.dragData.left + 'px',
                    top: self.dragData.top + 'px'
                })
            }
        }).on('mouseup', function(){
            flag = false;
        })
    }
}