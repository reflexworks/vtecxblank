import reflexcontext from 'reflexcontext' 
import Person from './person'

const person = new Person('Steve')
reflexcontext.log(person.say())
reflexcontext.sendMessage(200, person.say())
