
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
        onInit: '',
        onConfirm: '',
        onCancel: ''
    }

    this.pzMask = $('<div class="pz-modal-mask"></div>');
    this.pzWrap = $('<div class="pz-modal-wrap"></div>');
    this.pzClose = $('<i class="pz-modal-close"></i>');
    this.pzWrapFooter = $('<div class="pz-modal-footer"></div>');

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
    }
}