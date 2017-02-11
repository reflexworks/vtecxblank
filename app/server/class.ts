import * as reflexContext from 'reflexcontext';
class Person {
    constructor(
            private name:string = 'dummy'
    ) {}
		 
    public say():void {
           alert('Hello, I\'m ' + this.name + '!!');
	       var xx = reflexContext.log('ReflexWorks!!');
    }
}
export default Person; 