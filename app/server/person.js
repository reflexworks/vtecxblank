var reflexContext = require('reflexContext');

/* @flow */
class Person {
    constructor(
            name:string = 'dummy'
    ) {
    	this.name = name;
    }

    say():void {
//           reflexContext.log('Hello, I\'m ' + this.name + '!!');
           alert('Hello, I\'m ' + this.name + '!!');

    }
}
module.exports = Person;
