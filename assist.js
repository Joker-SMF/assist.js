// assist.js
// (c) 2012-2013 Siddhartha Gupta
// assist.js may be freely distributed under the MIT license.


(function() {
	var root = this;
	var assist;
	
	if (typeof exports !== 'undefined') {
		assist = exports;
	} else {
		assist = root.assist = {};
	}

	assist.getType = function(obj) {
		return toString.call(obj).toLowerCase();
	};

	assist.explodeNumber = function(input) {
		input = input.toString();
		return input.toString().match(/(\d+)(\.\d+)?/);
	}

	assist.isUndefined = function (input) {
		var type = this.getType(input);
		if(type === '[object undefined]') {
			return true;
		}
		return false;
	};

	assist.isString = function (input) {
		var type = this.getType(input);
		if(type === '[object string]') {
			return true;
		} 
		return false;
	};

	assist.isArray = function (input) {
		var type = this.getType(input);
		if(type === '[object array]') {
			return true;
		}
		return false;
	};

	assist.isObject = function (input) {
		var type = this.getType(input);
		if(type === '[object object]' ) {
			return true;
		}
		return false;
	};

	assist.isNumber = function (input) {
		var type = this.getType(input);
		var explode = this.explodeNumber(input);
		if(type === '[object number]' && explode[2] === undefined) {
			return true;
		}
		return false;
	};

	assist.isFloat = function (input) {
		var type = this.getType(input);
		var explode = this.explodeNumber(input);
		if(type === '[object number]' && explode[2] !== undefined) {
			return true;
		}
		return false;
	};

	assist.isBoolean = function(input) {
		var type = this.getType(input);
		if(type === '[object boolean]') {
			return true;
		}
		return false;
	};

	assist.isNull = function(input) {
		var type = this.getType(input);
		if(type === '[object null]') return true;
		if(type === '[object undefined]') return true;
		if (type !== '[object object]') return input.length === 0;
		for(var i in input) if (input.hasOwnProperty(i)) return false;
		return true;
	};

	assist.isFunction = function(input) {
		var type = this.getType(input);
		if(type === '[object function]') {
			return true;
		}
		return false;
	};

	assist.convertArrayToLowerCase = function(input) {
		console.log('convertArrayToLowerCase');
		if(_.isArray(input)) {
			var newArray = input.join(",").toLowerCase().split(",");
			return newArray;	
		} else if(_.isString(input)) {
			assist.log('this is a string')
			var newArray = input.toLowerCase().split(',');
			assist.log('new array');
			assist.log(newArray)
			return newArray;
		} else {
			return input;
		}
	};
}).call(this);