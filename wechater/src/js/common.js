/*basic component*/
if (!window.JSON) {
	window.JSON = {
		parse: function(jsonStr) {
			return eval('(' + jsonStr + ')');
		},
		stringify: function(jsonObj) {
			var result = '',
				curVal;
			if (jsonObj === null) {
				return String(jsonObj);
			}
			switch (typeof jsonObj) {
				case 'number':
				case 'boolean':
					return String(jsonObj);
				case 'string':
					return '"' + jsonObj + '"';
				case 'undefined':
				case 'function':
					return undefined;
			}

			switch (Object.prototype.toString.call(jsonObj)) {
				case '[object Array]':
					result += '[';
					for (var i = 0, len = jsonObj.length; i < len; i++) {
						curVal = JSON.stringify(jsonObj[i]);
						result += (curVal === undefined ? null : curVal) + ",";
					}
					if (result !== '[') {
						result = result.slice(0, -1);
					}
					result += ']';
					return result;
				case '[object Date]':
					return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
				case '[object RegExp]':
					return "{}";
				case '[object Object]':
					result += '{';
					for (i in jsonObj) {
						if (jsonObj.hasOwnProperty(i)) {
							curVal = JSON.stringify(jsonObj[i]);
							if (curVal !== undefined) {
								result += '"' + i + '":' +curVal + ',';
							}
						}
					}
					if (result !== '{') {
						result = result.slice(0, -1);
					}
					result += '}';
					return result;

				case '[object String]':
					return '"' + jsonObj.toString() + '"';
				case '[object Number]':
				case '[object Boolean]':
					return jsonObj.toString();
			}
		}
	};
}
/* cookies */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.cookie=e()}}(function(){function e(e){var t=[],n="";for(n in e)e.hasOwnProperty(n)&&t.push(n);return t}function t(e){return!!e&&"[object Object]"===Object.prototype.toString.call(e)}function n(e){return e instanceof Array}function o(e){return Array.prototype.slice.call(e)}function r(){if(!(this instanceof r))return new r}r.prototype={get:function(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var r=n[o];" "==r.charAt(0);)r=r.substring(1,r.length);if(0==r.indexOf(t))return decodeURI(r.substring(t.length,r.length))}return!1},set:function(e,n,o){if(t(e))for(var r in e)e.hasOwnProperty(r)&&this.set(r,e[r],n);else{var i=t(o)?o:{expires:o},f=void 0!==i.expires?i.expires:"",u=typeof f,l=void 0!==i.path?";path="+i.path:";path=/",c=i.domain?";domain="+i.domain:"",a=i.secure?";secure":"";"string"===u&&""!==f?f=new Date(f):"number"===u&&(f=new Date(+new Date+864e5*f)),""!==f&&"toGMTString"in f&&(f=";expires="+f.toGMTString()),document.cookie=e+"="+encodeURI(n)+f+l+c+a}},remove:function(e){e=n(e)?e:o(arguments);for(var t=0,r=e.length;t<r;t++)this.set(e[t],"",-1);return e},clear:function(t){return t?this.remove(t):this.remove(e(this.all()))},all:function(){if(""===document.cookie)return{};for(var e=document.cookie.split("; "),t={},n=0,o=e.length;n<o;n++){var r=e[n].split("=");t[decodeURI(r[0])]=decodeURI(r[1])}return t}};var i=function(e,n,o){var i=arguments;return 0===i.length?r().all():1===i.length&&null===e?r().clear():2!==i.length||n?"string"!=typeof e||n?t(e)||i.length>1&&e&&n?r().set(e,n,o):null===n?r().remove(e):r().all():r().get(e):r().clear(e)};for(var f in r.prototype)i[f]=r.prototype[f];return i});

var _basic = {
	os: null,
	urlBase: 'http://model.dzhcn.cn/callback.php',
	wx: function(){
		var ua = window.navigator.userAgent.toLowerCase();
		var status = false;
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			status = true;
		}else{
			status = false;
		}
		this.wx = status;
		return status;
	},
	android: function(){
		var u = navigator.userAgent;
		var status = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
		this.os = status ? 'android' : this.os;
		this.android = status;
		return status;
	},
	ios: function(){
		var u = navigator.userAgent;
		var status = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		this.os = status ? 'ios' : this.os;
		this.ios = status;
		return status;
	},
	testAct: function(str,reg){
		return(typeof str === 'string' && reg.test(str));
	},
	testBasic: function(str){
		var bl = str ? true : false;
		return(bl);
	},
	testName: function(str){
		var myReg = /^([\u4e00-\u9fa5a-zA-Z0-9\.\s]{1,32})$/;
		return(this.testAct(str,myReg));
	},
	testMail: function(str){
		var myReg = /^[.-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
		return(this.testAct(str,myReg));
	},
	testPass: function(str){
		var myReg = /^[A-Za-z0-9]{6,20}$/;
		return(this.testAct(str,myReg));
	},
	testNumber: function(str){
		var myReg = /^[0-9]/;
		return(this.testAct(str,myReg));
	},
	testPhone: function(str){
		var myReg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
		return(this.testAct(str,myReg));
	},
	testMobile: function(str){
		var myReg = /^(1(([0-9][0-9])|(47)|[8][0123456789]))\d{8}$/;
		return(this.testAct(str,myReg));
	},
	testsmsNumber: function(str){
		var myReg = /^[0-9]{6}$/;
		return(this.testAct(str,myReg));
	},
	testCaptcha: function(str){
		var myReg = /^[A-Za-z0-9]{4}$/;
		return(this.testAct(str,myReg));
	},
	testCaptcha6: function(str){
		var myReg = /^[A-Za-z0-9]{6}$/;
		return(this.testAct(str,myReg));
	},
	testInviteCode: function(str){
		var myReg = /^[A-Za-z0-9]{0,20}$/;
		return(this.testAct(str,myReg));
	},
	testArray: function(str){
		return str.length > 0;
	},
	QueryString: function(str){
		var sValue=location.search.match(new RegExp("[\?\&]"+str+"=([^\&]*)(\&?)","i"));
		return sValue?sValue[1]:sValue;
	},
	debounce: function(func, wait, immediate) {
		var timeout, result;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) result = func.apply(context, args);
			return result;
		};
	},
	throttle: function(func, wait) {
		var context, args, timeout, result;
		var previous = 0;
		var later = function() {
			previous = new Date;
			timeout = null;
			result = func.apply(context, args);
		}
		return function() {
			var now = new Date;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
			}else if(!timeout) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		}
	},
	formatData: function(el,rule){
		var newEl = el;
		if(rule){
			for(var i in rule){
				if(typeof rule[i] === 'string'){
					newEl[i] = el[rule[i]];
					if(i!==rule[i]){
						delete newEl[rule[i]];
					}
				}else{
					rule[i].forEach(function(item,index){
						newEl[i] = !newEl[i] ? el[item] : newEl[i];
					});
				}
			}
		}
		return newEl;
	},
	init: function(){
		this.wx();
		this.android();
		this.ios();
	}
}
_basic.init();

// window.wst = {};
// window.wst.linktohtml = function(a,b,c){
// 	console.log(a,b,c)
// }
