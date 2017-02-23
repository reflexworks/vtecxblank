//var Point = require('./point');
import Point from './point';

/* @flow */
const add = ( a, b ) => a + b;
var point = new Point(1,1);

alert('Result='+add(point.x,point.y));
