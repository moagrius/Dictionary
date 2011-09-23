(function(){

	var Item = function(key, value){
		this.key = key;
		this.value = value;
	};
	Item.prototype.key = null;
	Item.prototype.value = null;
	Item.prototype.is = function(key){
		return (this.key === key);
	};
	Item.prototype.toString = function(){
		return this.key.toString() + ":" + this.value.toString();
	};
	
	function Dictionary(){
		this._map = [];
	};
	
	Dictionary.prototype._map = null;
	Dictionary.prototype.addItem = function(key, value){
		var item;
		var isin = false;
		for(var i = 0, l = this._map.length; i < l; i++){
			item = this._map[i];
			if(item.is(key)){
				item.value = value;
				isin = true;
				break;
			};
		};
		if(!isin){
			item = new Item(key, value);
			this._map.push(item);
		};
	};
	Dictionary.prototype.contains = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				return true;
			};
		};
		return false;
	};
	Dictionary.prototype.getItem = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				return item.value;
			};
		};
		return null;
	};
	Dictionary.prototype.removeItem = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				this._map.splice(i, 1);
				break;
			};
		};
	};
	Dictionary.prototype.removeAll = function(){
		this._map.length = 0;
	};
	Dictionary.prototype.count = Dictionary.prototype.length = function(){
		return this._map.length;
	};
	Dictionary.prototype.clone = function(){
		return new Dictionary().copy(this);
	};
	Dictionary.prototype.copy = function(source){
		this._map = source._map;
		return this;
	};
	
	// sugar
	Dictionary.prototype.each = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			iterator.call(scope, item.value, item.key, i, this);
		};
	};
	Dictionary.prototype.sort = Dictionary.prototype.sortOnKeys = function(iterator){
		this._map.sort(function(a, b){
			return iterator(a.key, b.key);
		});
	};
	Dictionary.prototype.sortOnValues = function(iterator){
		this._map.sort(function(a, b){
			return iterator(a.value, b.value);
		});
	};
	Dictionary.prototype.map = function(iterator, scope){
		var r = new Dictionary();
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			r.addItem(item.key, iterator.call(scope, item.value, item.key, i, this));
		};
		return r;
	};
	Dictionary.prototype.filter = function(iterator, scope){
		var r = new Dictionary();
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			var ok = iterator.call(scope, item.value, item.key, i, this);
			if(ok){
				r.addItem(item.key, item.value);
			};
		};
		return r;
	};
	Dictionary.prototype.keys = function(){
		var k = [];
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			k[i] = item.key;
		};
		return k;
	};
	Dictionary.prototype.values = function(){
		var v = [];
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			v[i] = item.value;
		};
		return v;
	};
	Dictionary.prototype.all = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(!iterator.call(scope, item.value, item.key, this)){
				return false;
			};
		};
		return true;
	};
	Dictionary.prototype.any = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(iterator.call(scope, item.value, item.key, this)){
				return true;
			};
		};
		return false;
	};
	Dictionary.prototype.subset = function(){
		var r = new Dictionary();
		var keys = Array.apply(null, arguments);
		for(var i = 0, l = keys.length; i < l; i++){
			var key = keys[i];
			if(this.contains(key)){
				var value = this.getItem(key);
				if(value){
					r.addItem(key, value);
				};
			};
		};
		return r;
	};
	Dictionary.prototype.toString = function(){
		var o = [];
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			o.push(item.toString());
		};
		return "{" + o.join(",") + "}";
	};
	
	return this.Dictionary = window.Dictionary = Dictionary;
	
})();