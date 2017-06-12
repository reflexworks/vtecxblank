//var Person = require('./person');
import Person from './person'

export default function() { 
	var person = new Person('Steve')
	return person.say()
}

//module.exports = main;
 
