import vtecxapi from 'vtecxapi' 
import Person from './person'

const person = new Person('Steve')
vtecxapi.log(person.say())
vtecxapi.sendMessage(200, person.say())
