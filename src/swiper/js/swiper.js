
var Swiper = function(){
	this.data = {
		ele: null,                                // 元素
		effect: 'fade',                          // 滑动效果，默认fade，可选scroll
		direction: 'horizontal',                // effect为scroll时参数，默认horizontal，可选vertical
		speed: 3000,                           // 轮播速度，默认3000ms
		index: 0,                             // 指定/当前显示第几个，默认第一个
		prevIndex: -1,                        // 当前显示的前一个索引，小于等于index
		viewNum: 1,                         // 当前可见数量，默认显示1个
		viewSlide: 1,                        //  轮播间隔个数，小于等于viewNum
		isAuto: true,                       // 是否自动轮播
		isMouseStop: true,                 // 鼠标移入时是否停止
		hasPagination: true,              // 是否显示分页小圆圈
		hasNavigation: false,               // 是否显示左右箭头按钮
		paginationEvent: 'mouseenter',     // 分页小圆圈触发事件，可选click
		isFullScroll: false,              // 是否全屏滚动，适用于vertical
		initCallback: null,
		changeBeforeCallback: null,
		changeEndCallback: null
	}	

	this.slideOption = {
		ele: null,
		item: null,
		num: 0,
		width: 0,
		height: 0
	}

	this.paginationOption = {
		ele: null,
		item: null,
		num: 0
	}

	this.navigationOption = {
		ele: null
	}

	this.timer = null;
	this.startTime = null;
	this.endTime = null;
	this.winWidth = window.innerWidth;
	this.winHeight = window.innerHeight;
}

Swiper.prototype = {
	constructor: Swiper,

	init: function(option){

		if(!option) return;

		for(var key in option){
			this.data[key] = option[key];
		}

		this.data.initCallback && this.data.initCallback(this, this.data.index);

		this.data.ele = typeof(this.data.ele) == 'string' ? document.getElementById(this.data.ele) : this.data.ele;
		this.slideOption.ele = this.data.ele.getElementsByClassName('swiper-wrapper')[0];
		this.slideOption.item = this.slideOption.ele.getElementsByClassName('swiper-slide');
		this.slideOption.num = this.slideOption.item.length;
		this.paginationOption.num = this.data.viewNum == this.data.viewSlide ? this.slideOption.num / this.data.viewNum : this.slideOption.num - 1;

		var _this = this,
			data = this.data;

		switch(data.effect){
			case 'fade':
				this.slideOption.ele.classList.add('swiper-fade');
				this.slideOption.item[data.index].style.opacity = 1;
				this.slideOption.item[data.index].style.visibility = 'visible';
				break;
			case 'scroll': 
				this.slideOption.ele.classList.add('swiper-scroll');
				if(data.direction == 'horizontal'){
					this.slideOption.ele.classList.add('swiper-scroll-horizontal');

					if(data.viewNum == data.viewSlide){
						this.slideOption.ele.style.width = 100 * this.paginationOption.num + '%';
						this.slideOption.width = 100 / this.paginationOption.num;
						if(this.slideOption.num == this.paginationOption.num){
							for(var i = 0; i < this.paginationOption.num; i++)
								this.slideOption.item[i].style.width = this.slideOption.width + '%';
						}
					}else{
						var mrWidth = this.slideOption.item[0].currentStyle ? this.slideOption.item[0].currentStyle.marginRight : getComputedStyle(this.slideOption.item[0]).marginRight;
						this.slideOption.width = this.slideOption.item[0].offsetWidth + parseInt(mrWidth.split('px')[0]);
						this.slideOption.ele.style.width = this.slideOption.width * this.slideOption.num + 'px';						
					}
				}

				if(data.direction == 'vertical'){
					this.slideOption.ele.classList.add('swiper-scroll-vertical');

					if(data.isFullScroll){
						this.__getEleWH();
						window.onresize = this.__getEleWH.bind(this);

						if('onmousewheel' in document){
							this.slideOption.ele.addEventListener('mousewheel', function(e){
								_this.__fullScrollEvent(e.wheelDelta);
							});
						}else{
							this.slideOption.ele.addEventListener('DOMMouseScroll', function(e){
								_this.__fullScrollEvent(-e.detail);
							});
						}
					}
					this.slideOption.height = this.slideOption.ele.offsetHeight;
				}
				break;
		}

		if(data.isAuto)
			this.__autoStart();

		data.ele.addEventListener('mouseenter', function(){
			if(data.isMouseStop)
				_this.__stopAutoStart();
		})

		data.ele.addEventListener('mouseleave', function(){
			if(data.isAuto)
				_this.__autoStart();
		})

		this.__appendPagination();
		if(!data.hasPagination)
			this.paginationOption.ele.style.display = 'none';
		
		if(data.hasNavigation)
			this.__appendNavigation();

		return this;
	},

	__getEleWH: function(){
		this.data.ele.style.width = this.slideOption.ele.style.width = this.winWidth + 'px';
		this.data.ele.style.height = this.slideOption.ele.style.height = this.winHeight + 'px';
	},

	__autoStart: function(){
		this.__stopAutoStart();
		this.timer = setInterval(this.toNext.bind(this), this.data.speed);
	},

	__stopAutoStart: function(){
		if(this.timer)
			clearInterval(this.timer);
	},

	__fadeEvent: function(){
		this.slideOption.item[this.data.prevIndex].style.opacity = 0;
		this.slideOption.item[this.data.prevIndex].style.visibility = 'hidden';

		this.slideOption.item[this.data.index].style.opacity = 1;
		this.slideOption.item[this.data.index].style.visibility = 'visible';
	},

	__scrollEvent: function(){
		switch(this.data.direction){
			case 'horizontal': 
				if(this.data.viewNum == this.data.viewSlide){
					this.slideOption.ele.style.transform = 'translateX(' + (-this.slideOption.width * this.data.index) + '%)';
				}else{
					this.slideOption.ele.style.transform = 'translateX(' + (-this.slideOption.width * this.data.index) + 'px)';
				}
				break;

			case 'vertical': 
				this.slideOption.ele.style.transform = 'translateY(' + (-this.slideOption.height * this.data.index) + 'px)';
				break;
		}
	},

	__judgeEffect: function(){
		this.paginationOption.item[this.data.prevIndex].classList.remove('cur');
		this.paginationOption.item[this.data.index].classList.add('cur');

		this.data.changeBeforeCallback && this.data.changeBeforeCallback(this, this.data.prevIndex);
		this.data.effect == 'fade' ? this.__fadeEvent() : this.__scrollEvent();
		this.data.changeEndCallback && this.data.changeEndCallback(this, this.data.index);
	},

	__fullScrollEvent: function(delta){
		this.startTime = new Date().getTime();

		if(this.endTime - this.startTime < -1500){
			if(delta < 0){			
				this.toNext();			
			}else{
				this.toPrev();
			}
			this.endTime = new Date().getTime();
		}
	},

	toPrev: function(){
		this.data.prevIndex = this.data.index;
		if(this.data.index > 0){
			this.data.index--;
			this.__judgeEffect();
		}
	},

	toNext: function(){
		this.data.prevIndex = this.data.index;
		
		if(this.data.isAuto){
			this.data.index++;
			if(this.data.index >= this.paginationOption.num)
				this.data.index = 0;
			this.__judgeEffect();
		}else{
			if(this.data.index < this.paginationOption.num - 1){
				this.data.index++;
				this.__judgeEffect();
			}
		}
	},

	slideToIndex: function(index){
		this.data.prevIndex = this.data.index;
		this.data.index = index;
		this.__judgeEffect();
	},

	__changePage: function(){
		for(var i = 0; i < this.paginationOption.num; i++){
			this.paginationOption.item[i].addEventListener(this.data.paginationEvent, this.slideToIndex.bind(this, i));
		}
	},

	__appendPagination: function(){
		this.paginationOption.ele = document.createElement('div');
		this.paginationOption.ele.className = 'swiper-pagination';

		var paginationItem = [];
		for(var i = 0; i < this.paginationOption.num; i++){
			paginationItem[i] = document.createElement('div');
			paginationItem[i].className = 'swiper-pagination-item';
			this.paginationOption.ele.appendChild(paginationItem[i]);
		}

		this.paginationOption.item = paginationItem;
		this.paginationOption.item[this.data.index].classList.add('cur');
		this.data.ele.appendChild(this.paginationOption.ele);	
		this.__changePage();
	},

	__appendNavigation: function(){
		var _this = this;

		this.navigationOption.ele = document.createElement('div');
		this.navigationOption.ele.className = 'swiper-navigation';

		var prevBtn = document.createElement('a'),
			nextBtn = document.createElement('a');

		prevBtn.className = 'swiper-arrow prev';
		nextBtn.className = 'swiper-arrow next';

		this.navigationOption.ele.appendChild(prevBtn);
		this.navigationOption.ele.appendChild(nextBtn);
		this.data.ele.appendChild(this.navigationOption.ele);

		prevBtn.addEventListener('click', this.toPrev.bind(this));
		nextBtn.addEventListener('click', this.toNext.bind(this));
	}
}