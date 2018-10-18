(function(){
    var Select = function(){
        this.data = {
            elClass: 'pz-select',
            inputElClass: 'pz-select-input',
            dropdownClass: 'pz-select-dropdown',
            dropdownItemClass: 'pz-select-dropdown-item',
            dropdownItemSelectedClass: 'pz-select-dropdown-item-selected',
            activeClass: 'pz-active',

            showSearch: false,
            onSearch: null     // showSearch设置为true时的回调函数，返回当前input对象
        }

        this.selectIndex = [];
    }

    Select.prototype = {
        constructor: Select,

        init: function(option){
            var self = this;

            if(option){
                for(var key in option){
                    this.data[key] = option[key];
                }
            }

            var els = document.getElementsByClassName(this.data.elClass),
                num = els.length;
            for(var i = 0; i < num; i++){
                var inputEl = els[i].getElementsByClassName(this.data.inputElClass)[0],
                    dropdownEl = els[i].getElementsByClassName(this.data.dropdownClass)[0],
                    dropdownItemEl = dropdownEl.getElementsByClassName(this.data.dropdownItemClass);
                inputEl.index = i;

                if(this.data.showSearch){
                    this.__canSearch(inputEl);
                }

                if(dropdownEl.getElementsByClassName(this.data.dropdownItemSelectedClass)[0]){
                    var dropdownItemSelectedEl = dropdownEl.getElementsByClassName(this.data.dropdownItemSelectedClass)[0];
                    this.__appendText(inputEl, dropdownItemSelectedEl);
                    this.__findIndex(i, dropdownItemEl);
                }else{
                    this.selectIndex[i] = -1;
                }      

                inputEl.addEventListener('click', function(e){
                    e.stopPropagation();
                    var _this = this,
                        dropdownItemEl = els[this.index].getElementsByClassName(self.data.dropdownClass)[0].getElementsByClassName(self.data.dropdownItemClass);
                    this.classList.add(self.data.activeClass);
                    self.__dropdownClick(this, this.index, dropdownItemEl);

                    document.addEventListener('click', function(e){
                        _this.classList.remove(self.data.activeClass);
                    })
                });
            }

            return this;
        },

        __findIndex: function(index, dropdownItemEl){
            for(var i = 0; i < dropdownItemEl.length; i++){
                if(dropdownItemEl[i].classList.contains(this.data.dropdownItemSelectedClass)){
                    this.selectIndex[index] = i;
                }
            }
        },

        __appendText: function(inputEl, dropdownItemSelectedEl){
            var selected = dropdownItemSelectedEl.textContent,
                dataValue = dropdownItemSelectedEl.getAttribute('data-value');
            inputEl.value = selected;
            inputEl.setAttribute('data-value', dataValue);
        },

        __dropdownClick: function(inputEl, index, dropdownItemEl){
            var self = this,
                len = dropdownItemEl.length,
                dropdownItemSelectedClass = self.data.dropdownItemSelectedClass;

            for(var i = 0; i < len; i++){
                dropdownItemEl[i].index = i;
                dropdownItemEl[i].addEventListener('mousedown', function(e){ 
                    e.stopPropagation();
                    if(self.selectIndex[index] !== -1){
                        dropdownItemEl[self.selectIndex[index]].classList.remove(dropdownItemSelectedClass);  
                    }                                                
                    this.classList.add(dropdownItemSelectedClass);
                    self.selectIndex[index] = this.index;
                    inputEl.value = this.textContent;
                    inputEl.setAttribute('data-value', this.getAttribute('data-value'));
                    inputEl.classList.remove(self.data.activeClass);
                })
            }
        },

        __canSearch: function(inputEl){
            inputEl.removeAttribute('readonly');
            this.data.onSearch && this.data.onSearch(inputEl);
        }
    }

    new Select().init()
})()