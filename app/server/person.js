//var reflexContext = require('reflexContext');

/* @flow */
export default class Person {
	constructor(
            name:string = 'dummy'
    ) {
    	this.name = name
	}

	say():String {
    	return 'Hello, I\'m ' + this.name + '!!'
//           reflexContext.log('Hello, I\'m ' + this.name + '!!');
//           alert('Hello, I\'m ' + this.name + '!!');

	}
}
//module.exports = Person;
