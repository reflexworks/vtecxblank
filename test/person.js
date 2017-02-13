var reflexContext = require('reflexContext');

/*       */
var Person = function Person(
        name
) {
	if ( name === void 0 ) name    = 'dummy';

    	this.name = name;
};

Person.prototype.say = function say ()  {
//       reflexContext.log('Hello, I\'m ' + this.name + '!!');
       alert('Hello, I\'m ' + this.name + '!!');

};
module.exports = Person;
