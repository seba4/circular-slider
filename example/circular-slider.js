/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularSlider = void 0;
var circular_slider_options_model_1 = __webpack_require__(1);
var CircularSlider = /** @class */ (function () {
    function CircularSlider(options) {
        this._currStep = 0;
        this.isDragging = false;
        this.options = new circular_slider_options_model_1.CircularSliderOptions(options);
        this.validateOptions();
        this.initSlider();
        this.initEventHandlers();
    }
    /**
     * Checks whether passed options are valid and rendering should succeed.
     */
    CircularSlider.prototype.validateOptions = function () {
        var min = this.options.minValue;
        var max = this.options.maxValue;
        var step = this.options.stepValue;
        if (min > max) {
            throw new Error("Minimum Value (" + min + ") must be smaller than maximum Value (" + max + ")!");
        }
        if (max % step !== 0 || min % step !== 0) {
            throw new Error("Minimum Value " + min + " and maximum value " + max + " must be divisible by step " + step + "!");
        }
    };
    Object.defineProperty(CircularSlider.prototype, "handlerRadius", {
        /**
         * Calculates Radius for handler
         */
        get: function () {
            return this.options.strokeWidth / 2 + 2;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Based on Angle it calculates new Position
     * @param angleRad selected angle from which we calculate position
     */
    CircularSlider.prototype.calculateNewPosition = function (angleRad) {
        var newX = Math.round(Math.sin(angleRad) * this.radius);
        var newY = Math.round(Math.cos(angleRad) * this.radius) * -1;
        // we have our coordinates right, but angles need to be adjusted to positive number
        // basically just add 2PI - 360 degrees
        var radians360 = angleRad < 0 ? angleRad + 2 * Math.PI : angleRad;
        var angelDegrees = (radians360 * 180.0) / Math.PI;
        var path = Math.round(this.radius * radians360);
        return {
            x: Math.floor(angleRad) === 359 ? -1 : newX,
            y: newY,
            degrees: angelDegrees,
            radians: radians360,
            path: path
        };
    };
    /**
     * Initializes base slider
     * @private
     */
    CircularSlider.prototype.initSlider = function () {
        this.circleCenterX = 0;
        this.circleCenterY = 0;
        this.radius = this.options.radius - this.options.strokeWidth / 2;
        this.circumference = this.radius * 2 * Math.PI;
        this.currValue = this.options.minValue;
        this.position = this.calculateNewPosition(this.cord2Radius(this.circleCenterX, this.circleCenterY - this.radius));
        // Find container where we will render slider
        this.container = document.getElementById(this.options.container);
        if (this.container === null) {
            throw new Error("Container with name '" + this.options.container + "' can't be found.");
        }
        // Create SVG element with all the required attributes so we can draw slider.
        this.SVG = document.getElementById('sliderSVG');
        if (this.SVG === null) {
            this.SVG = this.createSVG(this.container.offsetWidth);
            this.container.appendChild(this.SVG);
        }
        this.slider = this.createSliderCircle();
        this.handle = this.createHandle();
        this.clickCircle = this.createClickCircle();
        this.SVG.appendChild(this.createEmptyCircle());
        this.SVG.appendChild(this.clickCircle);
        this.SVG.appendChild(this.slider);
        this.SVG.appendChild(this.handle);
        this.actOnValueChange();
    };
    /**
     * Method which is called when we expect that callback is called.
     * @param value Optional value which we want to pass to callback.
     */
    CircularSlider.prototype.actOnValueChange = function (value) {
        if (this.options.onValueChange && typeof this.options.onValueChange === 'function') {
            this.options.onValueChange(value || this.step2Value(this._currStep));
        }
    };
    Object.defineProperty(CircularSlider.prototype, "currStep", {
        /**
         * Setter for current step
         * @param step Current step number to which we want to move slider
         */
        set: function (step) {
            var _this = this;
            if (isNaN(step) || step < 0 || this.maxSteps < step) {
                throw new Error("Current step can be any number between 0 and " + this.maxSteps + " (" + step + ")");
            }
            this._currStep = step;
            this.actOnValueChange();
            this.handle.style.transition = 'all 0.5s ease-in-out';
            this.slider.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
            var radius = this.step2Radius(this._currStep);
            requestAnimationFrame(function () {
                _this.slider.style.strokeDashoffset = "" + _this.calculateSliderCircleOffset();
                _this.handle.style.transform = "rotate(" + radius + "deg)";
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initializes all event listeners for Slider to act on user input
     * @private
     */
    CircularSlider.prototype.initEventHandlers = function () {
        var _this = this;
        this.container.addEventListener('mousemove', function (event) { return _this.handleDrag(event); });
        this.container.addEventListener('mouseup', function (event) { return _this.cancelDrag(event); });
        this.container.addEventListener('mouseleave', function (event) { return _this.cancelDrag(event); });
        this.handle.addEventListener('touchmove', function (event) { return _this.handleTouch(event); });
        this.container.addEventListener('touchcancel', function (event) { return _this.handleTouch(event); });
        this.container.addEventListener('touchend', function (event) { return _this.handleTouch(event); });
        this.clickCircle.addEventListener('click', function (event) { return _this.handleSliderClick(event); });
        this.clickCircle.addEventListener('touchend', function (event) { return _this.handleTouch(event); });
        this.clickCircle.addEventListener('touchstart', function (event) { return _this.handleTouch(event); });
        this.slider.addEventListener('click', function (event) { return _this.handleSliderClick(event); });
        this.slider.addEventListener('touchend', function (event) { return _this.handleTouch(event); });
        this.slider.addEventListener('touchstart', function (event) { return _this.handleTouch(event); });
        this.handle.addEventListener('touchstart', function (event) { return _this.handleTouch(event); });
        this.handle.addEventListener('mousedown', function (event) { return _this.startDrag(event); });
    };
    /**
     * Acts on user touch events
     * @param event
     */
    CircularSlider.prototype.handleTouch = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        if (touches.length > 1)
            return;
        var touch = touches[0];
        var events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        var mouseEvents = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];
        var ev = events.indexOf(event.type);
        if (ev === -1)
            return;
        var type = event.type === events[2] && this.lastTouchType === events[0] ? 'click' : mouseEvents[ev];
        var simulatedEvent = document.createEvent('MouseEvent');
        simulatedEvent.initMouseEvent(type, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        touch.target.dispatchEvent(simulatedEvent);
        this.lastTouchType = event.type;
    };
    Object.defineProperty(CircularSlider.prototype, "dragTolerance", {
        /**
         * Offset as a tolerance which is used for checking when drag is stopped.
         */
        get: function () {
            return this.options.strokeWidth * 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularSlider.prototype, "color", {
        /**
         * Simple getter from which we can get back main slider color.
         */
        get: function () {
            return this.options.color;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Handler which moves the slider or cancels the drag because mouse went over tolerance limit.
     * @param event
     */
    CircularSlider.prototype.handleDrag = function (event) {
        event.preventDefault();
        if (this.isDragging === false) {
            return;
        }
        var point = this.SVG.createSVGPoint();
        var coords = this.transformToLocalCoordinate(point, event);
        var mouseEvent = event;
        var mHandleOffsetY = this.position.y - mouseEvent.y;
        var mHandleOffsetX = this.position.x - mouseEvent.x;
        if (mHandleOffsetX > this.dragTolerance || mHandleOffsetY > this.dragTolerance) {
            this.cancelDrag(event);
        }
        else {
            var angleRadians = this.cord2Radius(coords.x, coords.y);
            this.moveSlider(angleRadians);
        }
    };
    /**
     * Tests whether we can move slider to new position or not.
     * @param position
     */
    CircularSlider.prototype.canMoveSlider = function (position) {
        return !(this.position.y < 0 &&
            ((this.position.x >= 0 && position.x < 0) || (this.position.x < 0 && position.x >= 0)));
    };
    /**
     * Updates all the required attributes for slider to change view
     * @param nextStep Next step number to which we want to move slider
     * @param newPosition New Position object which includes all information for moving to next Step
     */
    CircularSlider.prototype.updateSlider = function (nextStep, newPosition) {
        this.position = newPosition;
        this.value = this.deg2Value(newPosition.degrees);
        if (this.currStep !== nextStep) {
            this.actOnValueChange(this.step2Value(nextStep));
        }
    };
    /**
     * Tries to move the slider to new position
     * @param radians
     */
    CircularSlider.prototype.moveSlider = function (radians) {
        var _this = this;
        var newPosition = this.calculateNewPosition(radians);
        if (!this.canMoveSlider(newPosition)) {
            return;
        }
        var nextStep = this.deg2Step(newPosition.degrees);
        this.updateSlider(nextStep, newPosition);
        this.handle.style.transition = '';
        this.slider.style.transition = '';
        requestAnimationFrame(function () {
            _this.slider.style.strokeDashoffset = "" + (_this.circumference - newPosition.path);
            _this.handle.style.transform = "rotate(" + newPosition.degrees + "deg)";
        });
    };
    /**
     * Marks slider state as it is dragging
     * @param event Mouse event
     */
    CircularSlider.prototype.startDrag = function (event) {
        event.preventDefault();
        this.value = this.currValue;
        this.isDragging = true;
    };
    /**
     * Marks slider state that it is not dragging anymore and if was dragging before updates it with new slider step.
     * @param event Mouse event
     */
    CircularSlider.prototype.cancelDrag = function (event) {
        event.preventDefault();
        if (this.isDragging) {
            this.currValue = this.value;
            this.currStep = this.value2Step(this.currValue);
        }
        this.isDragging = false;
    };
    /**
     * Handles users click directly on slider and recalculates new step which then re-renders.
     * @param event
     * @private
     */
    CircularSlider.prototype.handleSliderClick = function (event) {
        var svgPoint = this.SVG.createSVGPoint();
        var localCoords = this.transformToLocalCoordinate(svgPoint, event);
        var newPosition = this.calculateNewPosition(this.cord2Radius(localCoords.x, localCoords.y));
        var nextStep = this.deg2Step(newPosition.degrees);
        if (this._currStep !== nextStep) {
            this.currValue = this.step2Value(nextStep);
            this.currValue = this.value = this.step2Value(nextStep);
            this.currStep = nextStep;
        }
    };
    CircularSlider.prototype.transformToLocalCoordinate = function (point, event) {
        point.x = event.clientX;
        point.y = event.clientY;
        return point.matrixTransform(this.SVG.getScreenCTM().inverse());
    };
    /**
     * Calculates Radius from passed coordinates
     * @param x X coordinate
     * @param y Y coordinate
     * @private
     */
    CircularSlider.prototype.cord2Radius = function (x, y) {
        return Math.atan2(x - this.circleCenterX, -y - this.circleCenterY);
    };
    /**
     * Calculates Step from passed Degree
     * @param deg Degree which is used for calculating step
     * @private
     */
    CircularSlider.prototype.deg2Step = function (deg) {
        var val = this.deg2Value(deg);
        return this.value2Step(val);
    };
    /**
     * Calculates Value from passed degree
     * @param deg Degree which is used for calculating value
     * @private
     */
    CircularSlider.prototype.deg2Value = function (deg) {
        var range = this.options.maxValue - this.options.minValue;
        return Math.round(deg * (range / 360.0)) + this.options.minValue;
    };
    /**
     * Calculates Value from passed step
     * @param step Step which is used for calculating value
     * @private
     */
    CircularSlider.prototype.step2Value = function (step) {
        return step * this.options.stepValue + this.options.minValue;
    };
    /**
     * Calculates Step from passed value
     * @param val Value which is used for calculating step
     * @private
     */
    CircularSlider.prototype.value2Step = function (val) {
        return Math.round((val - this.options.minValue) / this.options.stepValue);
    };
    /**
     * Calculates Radius from passed step
     * @param step Step which is used for calculating radius
     */
    CircularSlider.prototype.step2Radius = function (step) {
        return this.maxSteps === step ? 359.99 : (360 / this.maxSteps) * step;
    };
    /**
     * Renders SVG element
     * @param size
     * @private
     */
    CircularSlider.prototype.createSVG = function (size) {
        var svg = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'svg');
        svg.setAttributeNS(null, 'viewBox', "-300 -300 600 600");
        svg.setAttributeNS(null, 'width', size.toString());
        svg.setAttributeNS(null, 'height', size.toString());
        svg.setAttributeNS(null, 'id', 'sliderSVG');
        return svg;
    };
    /**
     * Generates Slider background circle which includes dotted stroke
     * @private
     */
    CircularSlider.prototype.createEmptyCircle = function () {
        var circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'dashed-circle');
        circle.setAttributeNS(null, 'stroke', 'lightgray');
        circle.style.strokeWidth = this.options.strokeWidth + "px";
        circle.style.strokeDasharray = '5, 2';
        return circle;
    };
    /**
     * Generates Circle which is used for click/touch events
     * @private
     */
    CircularSlider.prototype.createClickCircle = function () {
        var circle = this.createCircle();
        circle.style.stroke = 'transparent';
        circle.style.strokeWidth = this.options.strokeWidth + "px";
        return circle;
    };
    /**
     * Generates Circle which marks the value && shows to the user which part of slider is selected.
     * @private
     */
    CircularSlider.prototype.createSliderCircle = function () {
        var circle = this.createCircle();
        circle.setAttributeNS(null, 'class', 'slider');
        circle.style.strokeWidth = this.options.strokeWidth + "px";
        circle.style.stroke = "rgba(" + this.options.color + ", 0.5)";
        circle.style.stroke = this.options.color;
        circle.style.opacity = '0.8';
        circle.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
        circle.style.strokeDashoffset = "" + this.circumference;
        return circle;
    };
    /**
     * Generates Handle for slider which is then used for Drag movement
     * @private
     */
    CircularSlider.prototype.createHandle = function () {
        var handle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        handle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        handle.setAttributeNS(null, 'cy', (this.circleCenterY - this.options.radius + this.options.strokeWidth / 2).toString());
        handle.setAttributeNS(null, 'r', this.handlerRadius.toString());
        handle.setAttributeNS(null, 'fill', '#fff');
        handle.setAttributeNS(null, 'class', 'circle-handle');
        handle.setAttributeNS(null, 'id', "circle-handle-" + this.radius);
        handle.style.transition = 'all 0.5s ease-in-out';
        handle.style.transform = 'rotate(' + this.step2Radius(this._currStep) + 'deg)';
        return handle;
    };
    CircularSlider.prototype.calculateSliderCircleOffset = function () {
        return (this.maxSteps - this._currStep) * this.getCircumferenceStep();
    };
    Object.defineProperty(CircularSlider.prototype, "maxSteps", {
        /**
         * Calculates how many steps should be available based on min and max value
         * @private
         */
        get: function () {
            return (this.options.maxValue - this.options.minValue) / this.options.stepValue;
        },
        enumerable: false,
        configurable: true
    });
    CircularSlider.prototype.getCircumferenceStep = function () {
        return this.circumference / this.maxSteps;
    };
    /**
     * Base SVG Circle helper which generates based circle element.
     * @private
     */
    CircularSlider.prototype.createCircle = function () {
        var circle = document.createElementNS(CircularSlider.SVG_NAMESPACE, 'circle');
        circle.setAttributeNS(null, 'r', this.radius.toString());
        circle.setAttributeNS(null, 'cx', this.circleCenterX.toString());
        circle.setAttributeNS(null, 'cy', this.circleCenterY.toString());
        circle.setAttributeNS(null, 'transform', "rotate(-90 " + this.circleCenterX + " " + this.circleCenterY + ")");
        circle.setAttributeNS(null, 'stroke-dasharray', this.circumference.toString());
        circle.setAttributeNS(null, 'fill', 'none');
        return circle;
    };
    CircularSlider.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    return CircularSlider;
}());
exports.CircularSlider = CircularSlider;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IPosition = exports.CircularSliderOptions = void 0;
var CircularSliderOptions = /** @class */ (function () {
    function CircularSliderOptions(options) {
        this.container = 'slider';
        this.color = 'green';
        this.maxValue = 4;
        this.minValue = 0;
        this.stepValue = 1;
        this.radius = 200;
        this.strokeWidth = 20;
        Object.assign(this, options);
    }
    return CircularSliderOptions;
}());
exports.CircularSliderOptions = CircularSliderOptions;
var IPosition = /** @class */ (function () {
    function IPosition() {
    }
    return IPosition;
}());
exports.IPosition = IPosition;


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })
/******/ ]);