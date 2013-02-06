// assist.js
// (c) 2012-2013 Siddhartha Gupta
// assist.js may be freely distributed under the MIT license.


(function() {
	var root = this;
	var assist;

	if (typeof exports !== 'undefined') assist = exports;
	else assist = root.assist = {};

	assist.enableLog = true;
	assist.prevloadAjaxIds = {
		'domId' : [],
		'fileUrl' : [],
	};

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

	assist.inArray = function(array, search) {
		if(!assist.isArray(array)) return false;
		else if (array.indexOf(search) != -1) return true;
		return false
	};

	assist.loadAjaxFile = function(options) {
		options = options || {};

		if(assist.isNull(options)) return;
		if(!(options.url)) return;

		var tempId = (options.id) ? options.id : new Date().getTime();
		var id = 'assist_' + tempId;
		var fileUrl = options.url;

		if(assist.inArray(assist.prevloadAjaxIds.domId, id)) return;
		if(assist.inArray(assist.prevloadAjaxIds.fileUrl, fileUrl)) return;

		this.prevloadAjaxIds.domId.push(id);
		this.prevloadAjaxIds.fileUrl.push(fileUrl);
		var oHead = document.getElementsByTagName('HEAD').item(0);
		var oScript = document.createElement("script");
		oScript.setAttribute('id', id);
		oScript.type = "text/javascript";	
		oScript.src = fileUrl;
		oScript.onerror = this.loadAjaxFileError;
		oScript.onload = this.loadAjaxFileSuccess;

		try {
			oHead.appendChild(oScript);
		} catch(e) {
			assist.log('error loading file');
			assist.log(e);
		};
	};

	assist.loadAjaxFileError = function(err) {
		assist.log('loadAjaxFileError');
		assist.log(err)
	};

	assist.loadAjaxFileSuccess = function() {
		assist.log('loadAjaxFileSuccess');
	};

}).call(this);