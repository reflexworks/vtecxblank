var Point = require('./point');

/*       */
var add = function ( a, b ) { return a + b; };
var point = new Point(5,6);

alert('Result='+add(point.x,point.y));
