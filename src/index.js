var Point = require('./index2');

/* @flow */
function foo(str:string) {
  return str + ' World!';
}
foo("abc");

function world(): string {
  return '123';
}  
world(); 
 
const add = ( a, b ) => a + b;

console.log(Point);

var xx = new Point(5,6);

alert('Hello!'+add(xx.x,xx.y));
