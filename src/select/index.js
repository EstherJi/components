(function(){
    var Select = function(){
        this.data = {
            elClass: 'pz-select',
            inputElClass: 'pz-select-input',
            dropdownClass: 'pz-select-dropdown',
            dropdownItemClass: 'pz-select-dropdown-item',
            dropdownItemSelectedClass: 'pz-select-dropdown-item-selected',
            activeClass: 'pz-active'
        }

        this.selectIndex = [];

        this.init();
    }

    Select.prototype = {
        constructor: Select,

        init: function(){
            var self = this;

            var els = document.getElementsByClassName(this.data.elClass),
                num = els.length;
            for(var i = 0; i < num; i++){
                var inputEl = els[i].getElementsByClassName(this.data.inputElClass)[0],
                    dropdownEl = els[i].getElementsByClassName(this.data.dropdownClass)[0];
                inputEl.index = i;

                if(dropdownEl.getElementsByClassName(this.data.dropdownItemSelectedClass)[0]){
                    var dropdownItemEl = dropdownEl.getElementsByClassName(this.data.dropdownItemClass),
                        dropdownItemSelectedEl = dropdownEl.getElementsByClassName(this.data.dropdownItemSelectedClass)[0];
                    this.__appendText(inputEl, dropdownItemSelectedEl);
                    this.__findIndex(i, dropdownItemEl);
                }              

                inputEl.addEventListener('click', function(e){
                    var dropdownItemEl = els[this.index].getElementsByClassName(self.data.dropdownClass)[0].getElementsByClassName(self.data.dropdownItemClass);

                    this.classList.add(self.data.activeClass);
                    self.__dropdownClick(this, this.index, dropdownItemEl);
                })
            }
        },

        __findIndex: function(index, dropdownItemEl){
            for(var i = 0; i < dropdownItemEl.length; i++){
                dropdownItemEl[i].index = i;
                if(dropdownItemEl[i].classList.contains(this.data.dropdownItemSelectedClass)){
                    this.selectIndex[index] = dropdownItemEl[i].index;
                }
            }
        },

        __appendText: function(inputEl, dropdownItemSelectedEl){
            var selected = dropdownItemSelectedEl.textContent,
                dataValue = dropdownItemSelectedEl.getAttribute('data-value');
            inputEl.textContent = selected;
            inputEl.setAttribute('data-value', dataValue);
        },

        __dropdownClick: function(inputEl, index, dropdownItemEl){
            var self = this,
                len = dropdownItemEl.length,
                dropdownItemSelectedClass = self.data.dropdownItemSelectedClass;

            for(var i = 0; i < len; i++){
                dropdownItemEl[i].addEventListener('click', function(e){                    
                    dropdownItemEl[self.selectIndex[index]].classList.remove(dropdownItemSelectedClass);
                    this.classList.add(dropdownItemSelectedClass);
                    self.selectIndex[index] = this.index;
                    inputEl.textContent = this.textContent;
                    inputEl.setAttribute('data-value', this.getAttribute('data-value'));
                    inputEl.classList.remove(self.data.activeClass);
                })
            }
        }
    }

    new Select();
})()