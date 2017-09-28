import should from 'should'
import Person from '../src/server/person'

let person

before(function(){
	person = new Person('Steve')
})

describe('Person', function(){
	it('person.say() is OK', function(){
		person.say().should.exactly('Hello, I\'m Steve!!')
	})
})