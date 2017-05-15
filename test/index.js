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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var person = new _person2.default('Steve');
	return person.say();
};

var _person = __webpack_require__(3);

var _person2 = _interopRequireDefault(_person);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var reflexContext = function() {
};

reflexContext.fetch = function(url,init) {
/*
 var Exception = function(status,message) {
    this.status = status;
    this.message = message;
  }

  var handleErrors = function(response) {
    // 4xx系, 5xx系エラーでresponse.ok = false
    if (!response.ok) {
      throw new Exception(response.status,response.statusText);		// TODO detect server response
    }
    return response;
  }
*/
  var context = {};
  context.url = url;
  context.init = init;
  context.then = function(func,func_err) {

	  try {
      var response;
      if (typeof this.init === "undefined"||this.init.method==='GET') {        
            if (this.url.match(/[\?&]e(&.*)?$/)) {
              response = ReflexContext.getEntry(this.url.trim().slice(2));              
            }else {
              response = ReflexContext.getFeed(this.url.trim().slice(2));
            }
            if (!response.feed.title) {
              func(response);
            }else {
              func_err(response);              
            }
      }else if (this.init.method==='POST') {
            var response = ReflexContext.post(this.url.trim().slice(2),this.init.body);
            if (!response.feed.title) {
              func(response);
            }else {
              func_err(response);              
            }
      }else if (this.init.method==='PUT') {
            var response = ReflexContext.put(this.url.trim().slice(2),this.init.body);
            if (!response.feed.title) {
              func(response);
            }else {
              func_err(response);              
            }
      }else if (this.init.method==='DELETE') {
            var response = ReflexContext.delete(this.url.trim().slice(2));
            if (!response.feed.title) {
              func(response);
            }else {
              func_err(response);              
            }
      } 

   } catch (e) {
      fetch(this.url,this.init)
              .then(handleErrors)
              .then(function(response) {
                return response.json()
              })
              .then(func)
              .catch(func_err);
   }
}
   return context;

}

reflexContext.log = function(msg) {

  try {
    ReflexContext.log(msg);
  }catch(e) {
    console.log(this.URL+msg);
  }
}

reflexContext.sendError = function(sc,msg) {

  try {
    ReflexContext.sendError(sc,msg);
  }catch(e) {
    console.log('sc:'+sc+' msg='+msg);
  }
}

module.exports = reflexContext; 

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(0);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//alert(main());

var reflexcontext = __webpack_require__(1);

reflexcontext.log('result=' + (0, _main2.default)());

var ok = function ok(response) {
    reflexcontext.log('resultJSON=' + JSON.stringify(response));
};

var err = function err(response) {
    ReflexContext.log('check3');
    reflexcontext.log('resultJSONErr=' + JSON.stringify(response));
    ReflexContext.log('check4');
};

reflexcontext.fetch('/d/registration', { method: 'GET' }).then(ok, err);

//reflexcontext.sendError(200,'error!!!');

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//var reflexContext = require('reflexContext');

var Person = function () {
    function Person() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'dummy';

        _classCallCheck(this, Person);

        this.name = name;
    }

    _createClass(Person, [{
        key: 'say',
        value: function say() {
            return 'Hello, I\'m ' + this.name + '!!';
            //           reflexContext.log('Hello, I\'m ' + this.name + '!!');
            //           alert('Hello, I\'m ' + this.name + '!!');
        }
    }]);

    return Person;
}();
//module.exports = Person;


exports.default = Person;

/***/ })
/******/ ]);