
### 一些适用于pc或wap端的常用组件


#### Swiper轮播组件

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
	ele: 'swiper-container',   // id
	effect: 'scroll',         // 滑动效果，fade/scroll
	isAuto: false,            // 是否自动轮播
	direction: 'vertical',    // effect为scroll时选择，不写默认水平滚动
	hasNavigation: true       // 是否显示左右箭头按钮
})

```

#### Select下拉框组件

代码示例：
```
new Select().init({
	showSearch: true,  // 可选，默认false
	onSearch: function(el){     // showSearch为true时使用，返回当前input对象
		console.info(el)
	}
})
```