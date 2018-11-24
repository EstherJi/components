
var Select = function(option){
	this.data = {
		el: '',
		defaultValue: '',
		values: [],
		canSearch: false,
		searchEvent: null,
		onChange: null
	}

	this.dropdownEl = $('<ul class="pz-select-dropdown"></ul>');
	this.defaultText = '';

	this.init(option);
}

Select.prototype = {
	constructor: Select,

	init: function(option){
		var self = this;

		if(!option) return;

		for(var key in option){
			this.data[key] = option[key];
		}
		
		var values = this.data.values,
			inputEl = $(this.data.el).find('.pz-select-input');

		for(var i = 0; i < values.length; i++){
			var selectedClass = '';
			if(this.data.defaultValue === values[i].value){
				this.defaultText = values[i].label;
				selectedClass = ' pz-select-dropdown-item-selected';
			}

			var _li = $('<li class="pz-select-dropdown-item' + selectedClass + '" data-value="' + values[i].value + '">' + values[i].label + '</li>')
			this.dropdownEl.append(_li);
		}
		$(this.data.el).append(this.dropdownEl);

		inputEl.val(this.defaultText).attr('data-value', this.data.defaultValue).on('click', function(e){
			e.stopPropagation();
			$(this).addClass('pz-active');
			self.__dropdownEvent();
		});

		if(this.data.canSearch){
			inputEl.removeAttr('readonly');
			this.data.searchEvent && this.data.searchEvent(inputEl.attr('data-value'));
		}

		$(document).on('click', function(){
			inputEl.removeClass('pz-active');
		})
	},

	__dropdownEvent: function(){
		var self = this;

		this.dropdownEl.on('mousedown', '.pz-select-dropdown-item', function(e){
			if(!$(this).hasClass('pz-select-dropdown-item-selected')){
				$(this).addClass('pz-select-dropdown-item-selected').siblings().removeClass('pz-select-dropdown-item-selected');
				$(this).parent().siblings('.pz-select-input').val($(this).text()).attr('data-value', $(this).attr('data-value'));

				self.data.onChange && self.data.onChange($(this).attr('data-value'));
			}
		})
	}
}