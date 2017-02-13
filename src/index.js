var Point = require('./point');

/* @flow */
const add = ( a, b ) => a + b;
var point = new Point(5,6);

alert('Result='+add(point.x,point.y));
