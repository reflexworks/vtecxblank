var Point = require('./index2');

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
