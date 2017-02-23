/* @flow */
function foo(str: string) {
  return str + ' World!';
}
foo('abc');

function world(): string {
  return '123';
}
world();

const add = ( a, b ) => a + b;

var reflexcontext = require('reflexcontext');

reflexcontext.log('xxx');

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }
}
module.exports = Point;
