// assist.js
// (c) 2012-2013 Siddhartha Gupta
// assist.js may be freely distributed under the MIT license.


(function() {
	var root = this;
	var assist;

	if (typeof exports !== 'undefined') assist = exports;
	else assist = root.assist = {};

	assist.enableLog = true;

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

	assist.convertDataToLowerCase = function(input) {
		if(assist.isNull(input)) {
			return input;
		} else if(assist.isString(input)) {
			return input.toLowerCase();
		} else if(assist.isArray(input)) {
			var newArray = input.join(",").toLowerCase().split(",");
			return newArray;
		} else if (assist.isObject(input)) {
			var newObject = {};
			for(var i in input) {
				var key = i.toLowerCase();
				if(assist.isString(input[i])) input[i] = input[i].toLowerCase();
				newObject[key] = input[i];
			}
			return newObject;
		} else {
			return input;
		}
	};

	assist.log = function(msg) {
		if(assist.enableLog) console.log.apply(console, arguments);
	};
}).call(this);