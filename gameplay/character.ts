/*	--------------------------------------------------- *\
		[class] Character()

		* Crée un character *

\*	--------------------------------------------------- */
class Character extends Elements{
	
	moving : any;
	direction : string;
    falling: any;
    ground: any;
    spells: any;
	
	
	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand on crée un character *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(world : any){
		super();

		this.setMass(100);
        this.setFixedRotation(true);
        this.spells = [];
        this.setType("character");
        //this.canCollideWith("tile");

		var vertices = [[-33,64],[-36,19],[-23,-3],[-15,-39],[8,-40],[37,26],[30,63]];
		var elementShape = new p2.Convex(vertices); 
	    /*elementShape.collisionGroup = Math.pow(2, 1);
	    elementShape.collisionMask = Math.pow(2, 2) | Math.pow(2,3);*/
	    
	    this.addShape(elementShape);
	    world.addBody(this);
	}

	/*	--------------------------------------------------- *\
			[function] setDirection(direction)
	
			* Set la direction du joueur *
	
			Return: 
	\*	--------------------------------------------------- */
	setDirection(direction:string){
		this.direction = direction;
	}

	/*	--------------------------------------------------- *\
			[function] getDirection()
	
			* Retourne la direction vers laquelle va le joueur *
	
			Return: direction
	\*	--------------------------------------------------- */
	getDirection():string{
		return this.direction;
	}

	/*	--------------------------------------------------- *\
			[function] isMoving(moving)
	
			* Check si le joueur est entrant de bouger ou non *
	
			Return: true, false
	\*	--------------------------------------------------- */
	isMoving(moving:any){
		if(moving == true || moving == false){
			this.moving = moving;
		}
		else{
			return this.moving;
		}
	}

    /*    --------------------------------------------------- *\
            [function] isFalling(falling)
    
            * Vérifie si le joueur est entraint de tomber *
    
            Return: true, false
    \*    --------------------------------------------------- */
    isFalling(falling:any){
        if(falling == true || falling == false){
            this.falling = falling;
        }
        else{
            return this.falling;
        }
    }

    /*    --------------------------------------------------- *\
            [function] isOnGround()
    
            * Vérifie si le joueur est sur le sol *
    
            Return: true, false
    \*    --------------------------------------------------- */
    isOnGround(){
    	var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;
        for (var i = 0; i < this.world.narrowphase.contactEquations.length; i++) {
            var c = this.world.narrowphase.contactEquations[i];
            if (c.bodyA === this || c.bodyB === this) {
                var d = p2.vec2.dot(c.normalA, yAxis);
                if (c.bodyA === this) {
                    d = d * -1;
                }
                if(d == -1){
                    result = true;
                }
            }
        }
        return result;
    }

    /*	--------------------------------------------------- *\
    		[function] associateSpell(spell)
    
    		* Associe un spell a un joueur *
    
    		Return: nil
    \*	--------------------------------------------------- */
    associateSpell(spell : any){
		this.spells.push(spell);
		spell.associateElement(this);
    }

}