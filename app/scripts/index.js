var Point = require('./point');

/* @flow */
const add = ( a, b ) => a + b;
var point = new Point(7,8);

alert('Result='+add(point.x,point.y));
