
### 一些适用于pc或wap端的常用组件


#### [Swiper轮播](https://estherji.github.io/components/src/swiper/swiper.html)

- swiper.js适用于pc
- swiper-mobile.js适用于移动端，主要用于touch事件，adapt.js为rem适配代码
- html文件为简单demo示例

代码示例：
```
// html 代码，class为.swiper-container > .swiper-wrapper > .swiper-slide，这三个类名为必填，id可以随便定义
<div class="swiper-container" id="swiper-container">
	<ul class="swiper-wrapper">
		<li class="swiper-slide page1">111</li>
		<li class="swiper-slide page2">222</li>
		<li class="swiper-slide page3">333</li>
		<li class="swiper-slide page4">444</li>
	</ul>
</div>

// js 代码
new Swiper().init({
	ele: 'swiper-container',       // id
	effect: 'scroll',             // 滑动效果，fade/scroll
	isAuto: false,            	 // 是否自动轮播
	direction: 'vertical',    	// effect为scroll时选择，不写默认水平滚动
	hasNavigation: true        // 是否显示左右箭头按钮
})

```

#### [Select下拉框](https://estherji.github.io/components/src/select/index.html)

代码示例：
```
new Select({
    el: '.pz-select',
    values: [
        {
            value: 'SZ',
            label: 'shenzhen'
        },
        {
            value: 'DG',
            label: 'dongguan'
        },
        {
            value: 'GZ',
            label: 'guangzhou'
        }
    ],
    defaultValue: '',     // select默认选中的值，不传默认为空
    canSearch: false,    // 是否可以搜索
    searchEvent: function(val){     // canSearch为true时使用，返回当前输入框value
        console.info(val);
    },
    onChange: function(val){       // option改变时触发，返回当前选中的option value
        console.info(val);
    }
})
```

#### [Validate表单验证](https://estherji.github.io/components/src/validate/index.html)

```
<input type="text" class="valid" id="name" prop="name">  <!-- class默认为valid，id自定义，prop与rules中key对应 -->

var rules = {
	/*
		nullMsg: 输入框为空时提示
		errorMsg: 输入框正则校验错误时提示(可选)
		pattern: 输入框正则校验法则(可选)
		recheck: 与其他输入框的值比较，如confirmPwd与password(可选)
	*/
	name: { nullMsg: '', errorMsg: '', pattern: '' }    
}

var pzForm = new Validate({
    form: $('.form'),
    rules: rules,
    blurCheck: false,                // 输入框失去焦点时触发，默认true，可选
    inputEl: '.valid',              // 输入框类，默认'.valid'，可选
    errorTipClass: 'error-tip',    // 错误提示类名，可选
    errorClass: 'has-error'       // 错误提示时添加到input上的类名，可选
})
```

#### [Page分页](https://estherji.github.io/components/src/page/index.html)
```
new Page({
    el: '.page',                      // 分页div容器，必须传参
    totalCount: 124,                 //  总条数，必须传参
    hasFLBtn: false,                // 是否显示首页、尾页按钮，默认false
    hasPNBtn: true,                // 是否显示上一页、下一页按钮，默认true
    showPageCount: 5,             // 连续显示页码个数，默认5
    pageSize: 10,                // 每页显示条数，默认10条 
    jump: function(pageNo){
        console.info(pageNo);   // 返回当前页码，可ajax刷新加载，也可整页跳转
    }
})
```

#### [Modal弹框](https://estherji.github.io/components/src/modal/index.html)
```
var confirmModal = new Modal({
    type: 'confirm',                 // 弹框类型，默认info，可选confirm
    title: '提示',                  // 标题，可传html结构或string，不传默认显示'提示'
    content: '',                   // 弹框内容，可传html结构或string
    confirmText: '确定',          // 不传默认显示'确定'
    cancelText: '取消',          // 不传默认显示'取消'，info类型不显示
    width: '500px',             // 弹框宽度，默认500px，string类型
    closable: true,            // 是否自动触发弹框关闭，设为false时，须调用self.close()触发弹框关闭
    maskClosable: false,      // 点击遮罩是否可关闭，不传默认false
    hasCloseIcon: false,     // 是否显示右上角关闭按钮，不传默认false
    wrapClassName: '',      // 对话框容器类名，传值会给'.pz-modal-wrap'容器添加该类名
    footer: true,          // 是否显示底部按钮
    dragable: false,      // 是否可拖拽，默认false
    onInit: function(self){
        // 初始化调用函数，返回当前弹框对象
    },
    onConfirm: function(self){
        // 确定时回调函数，返回当前弹框对象，closable为false时，调用self.close()触发弹框关闭
    },
    onCancel: function(self){
        // 取消时回调函数，返回当前弹框对象
    }
})
```