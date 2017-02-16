var Point = require('./point');

/*       */
var add = function ( a, b ) { return a + b; };
var point = new Point(7,8);

alert('Result='+add(point.x,point.y));
