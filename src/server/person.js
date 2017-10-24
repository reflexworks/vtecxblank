/* @flow */
export default class Person {
	name:string
	constructor(
		name:string = 'dummy'
	) {
    	this.name = name
	}

	say():string {
    	return 'Hello, I\'m ' + this.name + '!!'
	}
}
