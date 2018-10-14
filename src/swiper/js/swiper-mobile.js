
var SwiperMobile = function(){
	this.data = {
		ele: null,
		direction: 'horizontal',     // 可选'vertical'
		speed: 3000,
		isAuto: false,
		hasPagination: true,
		isFullScroll: false,
		initCallback: null,
		changeBeforeCallback: null,
		changeEndCallback: null
	}

	this.slideOption = {
		ele: null,
		length: 0,
		width: 0,
		height: 0
	}

	this.paginationOption = {
		ele: null,
		item: null
	}

	this.timer = null;
	this.index = 0;
	this.prevIndex = -1;
	this.curPos = 0;
}

SwiperMobile.prototype = {
	constructor: SwiperMobile,

	init: function(option){

		if(!option) return;

		for(var key in option){
			this.data[key] = option[key];
		}

		this.data.ele = typeof(this.data.ele) == 'string' ? document.getElementById(this.data.ele) : this.data.ele;
		this.slideOption.ele = this.data.ele.getElementsByClassName('swiper-wrapper')[0];

		var slideItem = this.slideOption.ele.getElementsByClassName('swiper-slide');
		this.slideOption.length = slideItem.length;

		switch(this.data.direction){
			case 'horizontal':
				this.slideOption.ele.classList.add('swiper-wrapper-horizontal');
				this.slideOption.width = this.slideOption.ele.offsetWidth;
				this.slideOption.ele.style.width = this.slideOption.width * this.slideOption.length + 'px';
				for(var i = 0; i < this.slideOption.length; i++){
					slideItem[i].style.width = this.slideOption.width + 'px';
				}
				break;
			case 'vertical':
				this.slideOption.ele.classList.add('swiper-wrapper-vertical');
				if(this.data.isFullScroll){
					this.data.ele.style.width = this.slideOption.ele.style.width = window.innerWidth + 'px';
					this.data.ele.style.height = this.slideOption.ele.style.height = window.innerHeight + 'px';
				}
				this.slideOption.height = this.slideOption.ele.offsetHeight;
				break;
		}

		if(this.data.hasPagination)
			this.__appendPagination();

		this.__touchEvent();

		if(this.data.isAuto)
			this.__autoStart();

		return this;
	},

	__autoStart: function(){
		this.__stopAutoStart();
		this.timer = setInterval(this.toNext.bind(this), this.data.speed);
	},

	__stopAutoStart: function(){
		if(this.timer)
			clearInterval(this.timer);
	},

	__autoScrollEvent: function(){
		if(this.data.hasPagination){
			this.paginationOption.item[this.prevIndex].classList.remove('cur');
			this.paginationOption.item[this.index].classList.add('cur');
		}

		switch(this.data.direction){
			case 'horizontal': 
				this.slideOption.ele.style.transform = 'translate3d(' + (- this.slideOption.width * this.index) + 'px, 0, 0)';
				break;
			case 'vertical':
				this.slideOption.ele.style.transform = 'translate3d(0, ' + (- this.slideOption.height * this.index) + 'px, 0)';
				break;
		}
	},

	toPrev: function(){
		this.prevIndex = this.index;
		if(this.index > 0){
			this.index--;
			this.__changeCallback();
		}
	},

	toNext: function(){
		this.prevIndex = this.index;
		this.index++;
		if(this.index >= this.slideOption.length)
			this.index = 0;
		this.__changeCallback();
	},

	slideToIndex: function(index){
		this.prevIndex = this.index;
		this.index = index;
		this.__changeCallback();
	},

	__changeCallback: function(){
		this.data.changeBeforeCallback && this.data.changeBeforeCallback(this, this.prevIndex);
		this.__autoScrollEvent();
		this.data.changeEndCallback && this.data.changeEndCallback(this, this.index);
	},

	__touchEvent: function(){
		var _this = this,
			pageWidth = this.data.direction == 'horizontal' ? this.slideOption.width : this.slideOption.height,
			maxWidth = - pageWidth * (this.slideOption.length - 1),
			startX = 0,
			startY = 0,
			initPos = 0,
			startT = 0,
			isMove = false,
			moveLength = 0,
			direction = null,
			ele = this.slideOption.ele;

		ele.addEventListener('touchstart', function(e){
			e.preventDefault();
			this.style.transition = '0s';
			var touch = e.touches[0];
			startX = touch.pageX;
			startY = touch.pageY;
			initPos = _this.curPos;
			startT = new Date().getTime();
			isMove = false;
		});

		ele.addEventListener('touchmove', function(e){
			e.preventDefault();
			var touch = e.touches[0],
				deltaX = touch.pageX - startX,
				deltaY = touch.pageY - startY,
				translate = 0;

			moveLength = _this.data.direction == 'horizontal' ? deltaX : deltaY;
			direction = moveLength > 0 ? 'prev' : 'next';						
			translate = initPos + moveLength;
			
			if(translate <= 0 && translate >= maxWidth){								
				_this.__transform(translate);
				isMove = true;
			}
			if(translate > 0 || translate < maxWidth){
				translate = initPos + moveLength / 4;
				_this.__transform(translate);
				isMove = true;
			}
		});

		ele.addEventListener('touchend', function(e){
			e.preventDefault();
			var deltaT = new Date().getTime() - startT,
				translate = 0;

			if(isMove){
				this.style.transition = '.3s';

				if(deltaT < 200){
					translate = direction == 'next' ? _this.curPos - (pageWidth + moveLength) : _this.curPos + pageWidth - moveLength;
					translate = translate > 0 ? 0 : translate;
					translate = translate < maxWidth ? maxWidth : translate;
				}else{
					if(Math.abs(moveLength) / pageWidth < .5){
						translate = _this.curPos - moveLength;
						translate = _this.curPos > 0 ? 0 : translate;
						translate = _this.curPos < maxWidth ? maxWidth : translate;
					}else{
						translate = direction == 'next' ? _this.curPos - (pageWidth + moveLength) : _this.curPos + pageWidth - moveLength;
						translate = translate > 0 ? 0 : translate;
						translate = translate < maxWidth ? maxWidth : translate;
					}
				}

				_this.__transform(translate);
				_this.prevIndex = _this.index;
				_this.index = Math.round(Math.abs(translate) / pageWidth);

				if(_this.data.hasPagination){
					_this.paginationOption.item[_this.prevIndex].classList.remove('cur');
					_this.paginationOption.item[_this.index].classList.add('cur');
				}
			}
		});
	},

	__transform: function(translate){
		switch(this.data.direction){
			case 'horizontal': 
				this.slideOption.ele.style.transform = 'translate3d(' + translate + 'px, 0, 0)';
				break;
			case 'vertical':
				this.slideOption.ele.style.transform = 'translate3d(0, ' + translate + 'px, 0)';
				break;
		}
		this.curPos = translate;
	},

	__changePage: function(){
		for(var i = 0; i < this.slideOption.length; i++){
			this.paginationOption.item[i].addEventListener('touchenter', this.slideToIndex.bind(this, i));
		}
	},

	__appendPagination: function(){
		this.paginationOption.ele = document.createElement('div');
		this.paginationOption.ele.className = 'swiper-pagination';

		var paginationItem = [];
		for(var i = 0; i < this.slideOption.length; i++){
			paginationItem[i] = document.createElement('div');
			paginationItem[i].className = 'swiper-pagination-item';
			this.paginationOption.ele.appendChild(paginationItem[i]);
		}

		this.paginationOption.item = paginationItem;
		this.paginationOption.item[this.index].classList.add('cur');
		this.data.ele.appendChild(this.paginationOption.ele);	
		this.__changePage();
	}
}