/**
 * Created by Braynstorm on 9.4.2016 г..
 */
'use strict';

function $ (str) {
	var list = document.querySelectorAll(str);

	if (list.length == 1)
		return list[0];

	return list;
}

function $$ (str) {
	return document.querySelectorAll(str);
}

function debug(f){
	console.log(f);
}

function $create (tagName, attributes) {
	var element = document.createElement(tagName);

	for(var i in attributes)
		element.setAttribute(i, attributes[i]);

	return element;
}

function $createDiv(attributes){
	return $create("div", attributes);
}

class Animation {
	constructor (element, property, endValue, time, callback) {
		if (typeof BoxObject !== "undefined" && element instanceof BoxObject)
			this.element = element.obj;
		else
			this.element = element;

		this.property   = property;
		this.totalTime  = time;
		this.passedTime = 0;
		this.suffix     = "";
		this.callback = callback;

		var computedStyle = window.getComputedStyle(element, null);

		this.startValue = computedStyle[property];

		if (typeof this.startValue === "string") {
			this.startValue = Utils.stripPx(this.startValue);
			this.suffix     = "px";
		}

		this.endValue = endValue;

		if (typeof endValue === "string") {
			this.endValue = Utils.stripPx(this.endValue);
			this.suffix   = "px";
		}

		this.currentValue = this.startValue;

		this.operationsPerMs = (this.endValue - this.startValue) / time;
	}

	go () {
		if (this.alreadyWent)
			this.goBackwards();
		else
			this.goForwards();

	}

	goForwards () {
		if (this.passedTime < this.totalTime) {// a.k.a Epsilon
			this.alreadyWent = true;
			setTimeout(() => {
				this.passedTime += 10;
				this.currentValue += this.operationsPerMs * 10;
				this.element.style[this.property] =  Math.round(this.currentValue) + this.suffix;

				this.goForwards();
			}, 10);
		} else {
			if(this.callback !== undefined && typeof this.callback === "function")
				this.callback();
		}
	}

	goBackwards () {
		var t                = this.startValue;
		this.startValue      = this.endValue;
		this.endValue        = t;
		this.passedTime      = 0;
		this.currentValue    = this.startValue;
		this.operationsPerMs = -this.operationsPerMs;
		this.alreadyWent     = false;

		this.goForwards();
	}
}

class Utils {
	/**
	 * 25px => 25.
	 * @param str
	 * @returns {Number}
	 */
	static stripPx (str) {
		return parseInt(str.substring(0, str.indexOf("p")));
	}

	static sqr (n) {
		return n * n;
	}

	/**@param {Number} val
	 * @param {Number} min
	 * @param {Number} max
	 * @return {Number} */
	static clamp(val, min, max){
		return val > max ? max : (val < min ? min : val);
	}

}