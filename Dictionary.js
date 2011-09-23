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
	
	/** 
	* Dictionary instance - manage key:value pairs using string equality (===) for key comparison, rather than the return of a key's toString method
	* @constructor
	* @function
	* @param {object} hash A Dictionary object or Object object to initialize the new Dictionary to.
	* @class The Dictionary class is used to manage key:value pairs, but uses strict equality for key comparison, and does not allow for direct array access (use getItem/addItem/etc methods instead) or for..in interation.  Additional sugar methods are included to help with iteration and common tasks.
	*/
	function Dictionary(hash){
		this._map = [];
		this.adopt(hash);
	};
	
	Dictionary.prototype._map = null;
	
	/**
	* Adopts all members from another Dictionary or Object instance
	* @function
	* @param {object} hash A Dictionary object or Object object to initialize the new Dictionary to.
	* @returns this
	*/
	Dictionary.prototype.adopt = function(hash){
		if(hash){
			if(hash instanceof Dictionary){
				hash.each(this.addItem, this);
			} else if (typeof hash == 'object'){
				for(var key in hash){
					this.addItem(key, hash[key]);
				};
			};			
		};
		return this;
	};
	
	/**
	* Adds a key:value pair to the Dictionary
	* @function
	* @param {mixed} key The key to register with the Dictionary.
	* @param {mixed} value The value object registered with the Dictionary.
	* @returns mixed (value)
	*/
	Dictionary.prototype.addItem = function(key, value){
		var item;
		for(var i = 0, l = this._map.length; i < l; i++){
			item = this._map[i];
			if(item.is(key)){
				return item.value = value;
			};
		};
		this._map.push(new Item(key, value));
		return value;
	};
	
	/**
	* Determines if a key is registered with the Dictionary.
	* @function
	* @param {mixed} key The key to test for.
	* @returns boolean
	*/
	Dictionary.prototype.contains = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				return true;
			};
		};
		return false;
	};
	
	/**
	* Retrieves a value from the Dictionary by key.
	* @function
	* @param {mixed} key The key of the value to be retrieved.
	* @returns mixed
	*/
	Dictionary.prototype.getItem = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				return item.value;
			};
		};
		return null;
	};
	
	/**
	* Removes (un-registers) a value from the Dictionary
	* @function
	* @param {mixed} key The key of the value to be removed.
	* @returns
	*/
	Dictionary.prototype.removeItem = function(key){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(item.is(key)){
				this._map.splice(i, 1);
				break;
			};
		};
	};
	
	/**
	* Removes (un-reigsters) all items from the Dictionary.
	* @function
	*/
	Dictionary.prototype.removeAll = function(){
		this._map.length = 0;
	};
	
	/**
	* Returns the number of items registered with the Dictionary.
	* @function
	* @returns number
	*/
	Dictionary.prototype.count = Dictionary.prototype.length = function(){
		return this._map.length;
	};
	
	/**
	* Creates a (separate) duplicate of the Dictionary.
	* @function
	* @returns Dictionary
	*/
	Dictionary.prototype.clone = function(){
		return new Dictionary().copy(this);
	};
	
	/**
	* Copies the registration from another Dictionary.  Note that this is different from .adopt in that items not registered with the source Dictionary will be removed from this.
	* @function
	* @param {Dictionary} source The Dictionary instance to copy registration from.
	* @returns this
	*/
	Dictionary.prototype.copy = function(source){
		if(!(source instanceof Dictionary)){
			throw new Error('Source must be a Dictionary object');
		};
		this._map = source._map.slice();
		return this;
	};
	
	// sugar
	
	/**
	* Iterates through all registered objects in the Dictionary, calling the iterator function with the following paramters: value, key, index, Dictionary
	* @function
	* @param {function} iterator The function to be called on each registered item.
	* @param {mixed} scope The context (scope) to be used by the iterator function (optional)
	*/
	Dictionary.prototype.each = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			iterator.call(scope, item.value, item.key, i, this);
		};
	};
	
	/**
	* Sorts a Dictionary's registration by keys.
	* @function
	* @param {function} iterator The comparison function used to sort the registered items.
	* @returns this
	*/
	Dictionary.prototype.sort = Dictionary.prototype.sortOnKeys = function(iterator){
		if(typeof iterator != 'function'){
			iterator = function(a, b){
				return a > b ? 1 : b > a ? -1 : 0;
			};
		};
		this._map.sort(function(a, b){
			return iterator(a.key, b.key);
		});
		return this;
	};
	
	/**
	* Sorts a Dictionary's registration by values.
	* @function
	* @param {function} iterator The comparison function used to sort the registered items.
	* @returns this
	*/
	Dictionary.prototype.sortOnValues = function(iterator){
		if(typeof iterator != 'function'){
			iterator = function(a, b){
				return a > b ? 1 : b > a ? -1 : 0;
			};
		};
		this._map.sort(function(a, b){
			return iterator(a.value, b.value);
		});
		return this;
	};
	
	/**
	*
	* @function
	* @param {function} iterator The function to be called on each registered item.
	* @param {mixed} scope The context (scope) to be used by the iterator function (optional)
	* @returns
	*/
	Dictionary.prototype.map = function(iterator, scope){
		var r = new Dictionary();
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			r.addItem(item.key, iterator.call(scope, item.value, item.key, i, this));
		};
		return r;
	};
	
	/**
	*
	* @function
	* @param {function} iterator The function to be called on each registered item.
	* @param {mixed} scope The context (scope) to be used by the iterator function (optional)
	* @returns
	*/
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
	
	/**
	* Returns an array of all registered keys.
	* @function
	* @returns array
	*/
	Dictionary.prototype.keys = function(){
		var k = [];
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			k[i] = item.key;
		};
		return k;
	};
	
	/**
	* Returns an array of all registered values.
	* @function
	* @returns array
	*/
	Dictionary.prototype.values = function(){
		var v = [];
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			v[i] = item.value;
		};
		return v;
	};
	
	/**
	* Tests each registered item against the iterator function - returns true if all iterator invocations return true, false otherwise.
	* @function
	* @param {function} iterator The function to be called on each registered item.
	* @param {mixed} scope The context (scope) to be used by the iterator function (optional)
	* @returns boolean
	*/
	Dictionary.prototype.all = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(!iterator.call(scope, item.value, item.key, this)){
				return false;
			};
		};
		return true;
	};
	
	/**
	* Tests registered items against the iterator function - returns true (and stops) if any iterator invocations return true, false if none do.
	* @function
	* @param {function} iterator The function to be called on each registered item.
	* @param {mixed} scope The context (scope) to be used by the iterator function (optional)
	* @returns
	*/
	Dictionary.prototype.any = function(iterator, scope){
		for(var i = 0, l = this._map.length; i < l; i++){
			var item = this._map[i];
			if(iterator.call(scope, item.value, item.key, this)){
				return true;
			};
		};
		return false;
	};
	
	/**
	* Returns a new Dictionary object with just the keys passed as arguments
	* @function
	* @param {arguments} Each argument is considered a key to retrieve from this.
	* @returns Dictionary
	*/
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
	
	/**
	* Returns the Dictionary expressed as a String value.
	* @function
	* @returns string
	*/
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