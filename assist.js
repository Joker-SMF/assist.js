// assist.js
// (c) 2012-2013 Siddhartha Gupta
// assist.js may be freely distributed under the MIT license.


(function() {
	var root = this,
	assist;

	if (typeof exports !== 'undefined') assist = exports;
	else assist = root.assist = {};

	assist.enableLog = true;
	assist.prevloadAjaxIds = {
		'domId' : [],
		'fileUrl' : [],
	};
	assist.ajaxCallback = {};

	var slice = Array.prototype.slice,
	objHasProperty = Object.prototype.hasOwnProperty
	objKeys = Object.keys;

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

	assist.convertDataToLowerCase = function(input, keys) {
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
				if(keys) var key = i.toLowerCase();
				else var key = i;
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

	assist.intToFloat = function(num, decPlaces) {
		return num.toFixed(decPlaces);
	}

	//all array related function
	/*
	 *can be used for array, multidimentional arrays (2d), strings
	*/
	assist.indexOf = function(data, search) {
		if(assist.isArray(data))
			for (var i = 0, z = data.length; i < z; i++) {
				if (assist.isArray(data[i]) && data[i].indexOf(search) != -1) return i;
				else if (assist.isString(data[i]) && data[i].indexOf(search) != -1) return i;
				else if(data[i] == search) return i;
			}
		else if(assist.isString(data)) var a = data.indexOf(search); if(a != -1) return a;
		return -1;
	};

	assist.lastArrayElem = function(input, num) {
		if(!assist.isArray(input)) return input;
		var len = input.length, range = Math.ceil(len - num);
		if(num > len) return input;
		if(!assist.isUndefined(num)) return slice.call(input, range)
		else return input[len - 1]
	}

	/*
	 * Functions related to objectss
	 * return in form of array, nested objects are preserved
	*/
	assist.lastObjectElem = function(input, num) {
		if(!assist.isObject(input)) return input;
		delete input.length;
		var oLen = assist.objLength(input),
			range = Math.ceil(oLen - num);
		if(num > oLen) return input;
		if(!assist.objHasKey(input, 'lenght')) input.length = oLen;
		if(!assist.isUndefined(num)) return slice.call(input, range);
		else return slice.call(input, oLen - 1);
	}

	assist.objHasKey = function(obj, key) {
		return objHasProperty.call(obj, key);
	};

	assist.objLength = function(obj) {
		return objKeys(obj).length;
	};

	/*
	 *options here contains - url, domId, success(), error(), cacheFile(false by default)
	*/
	assist.loadAjaxFile = function(options) {
		options = options || {};

		if(assist.isNull(options)) return;
		if(!(options.url)) return;

		var fileUrl = options.url,
		cacheFile = (options.cacheFile) ? options.cacheFile : false,
		id = (!cacheFile) ? 'assist_file_id' : ((options.domId !== undefined) ? 'assist_' + options.domId : 'assist_' + new Date().getTime());

		assist.ajaxCallback.success = (options.success) ? options.success : '';
		assist.ajaxCallback.error = (options.error) ? options.error : '';

		if(assist.inArray(assist.prevloadAjaxIds.domId, id)) return;
		if(assist.inArray(assist.prevloadAjaxIds.fileUrl, fileUrl)) return;

		if(cacheFile) {
			this.prevloadAjaxIds.domId.push(id);
			this.prevloadAjaxIds.fileUrl.push(fileUrl);	
		} else if(document.getElementById(id)) {
			document.getElementById(id).remove();
		}

		var oHead = document.getElementsByTagName('HEAD').item(0),
		oScript = document.createElement('script');
		oScript.setAttribute('id', id);
		oScript.type = 'text/javascript';
		oScript.src = fileUrl;
		oScript.onerror = this.loadAjaxFileError;
		oScript.onload = this.loadAjaxFileSuccess;

		try {
			oHead.appendChild(oScript);
		} catch(e) {
			assist.loadAjaxFileError(e);
		};
	};

	assist.loadAjaxFileError = function(err) {
		if(assist.ajaxCallback.error) assist.ajaxCallback.error(err);
	};

	assist.loadAjaxFileSuccess = function() {
		if(assist.ajaxCallback.success) assist.ajaxCallback.success();
	};

}).call(this);