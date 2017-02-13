/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Point = __webpack_require__(1);

	/*       */
	function foo(str       ) {
	  return str + ' World!';
	}
	foo("abc");

	function world()         {
	  return '123';
	}  
	world(); 
	 
	var add = function ( a, b ) { return a + b; };

	console.log(Point);

	var xx = new Point(5,6);

	alert('Hello!'+add(xx.x,xx.y));


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*       */ 
	var Point = function Point(x      , y      ) {
	  this.x = x;
	  this.y = y;
	};

	Point.prototype.move = function move (x      , y      ) {
	  this.x += x;
	  this.y += y;
	};

	Point.prototype.copy = function copy ()      {
	  return new Point(this.x, this.y);
	};
	module.exports = Point;


/***/ }
/******/ ]);