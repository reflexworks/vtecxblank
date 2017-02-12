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

  