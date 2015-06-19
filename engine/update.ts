/*	--------------------------------------------------- *\
		Update
\*	--------------------------------------------------- */
module Update{
		
	var elements = [];

	export function set(element:any){
		elements.push(element);
	}


    /*    --------------------------------------------------- *\
            [class] Update()
        
    \*    --------------------------------------------------- */
    export class Update{
        
        functionToCall: any;
        timer: any;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                *  *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(functionToCall:any){
            this.functionToCall = functionToCall;
            var cache = this;
            this.timer = setInterval(function() {
                cache.functionToCall();
            }, 80);
        }
    }


	/*	--------------------------------------------------- *\
			Updating...
	\*	--------------------------------------------------- */
    var lastTime = 0;
	var interval = setInterval(function(){
		for (var i = elements.length - 1; i >= 0; i--) {
            // time
            var now = lastTime + 1;
            var delta = now - lastTime;
            lastTime = now;


            var forces = elements[i].getAssignedForces();
            for (var k = forces.length - 1; k >= 0; k--) {
            	if(forces[i]){
	            	if(forces[i].isAppliable()){
		                var velocity = forces[k].getVelocity();
		                var intensity = forces[k].getIntensity();
		                var position = elements[i].getPosition();
		                var direction = forces[k].getDirection();

		               	velocity.y = velocity.y + ((direction.y * intensity) / intensity * delta);
		                velocity.x = velocity.x + ((direction.x * intensity) / intensity * delta);
		                position.y = position.y + (velocity.y * delta);
		                position.x = position.x + (velocity.x * delta);

		                elements[i].setPosition(position.x, position.y);
		                forces[k].setVelocity(velocity.x, velocity.y);
	            	}
            	}

            }
		}
	}, 80);
}