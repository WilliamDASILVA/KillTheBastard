/*	--------------------------------------------------- *\
		Input
\*	--------------------------------------------------- */
module Input{
	
	var events = [];
    var pressedKeys = [];


	/*	--------------------------------------------------- *\
			[class] MouseMove()
	
			* Quand l'utilisateur bouge la souris *
	
	\*	--------------------------------------------------- */
	export class MouseMove{
		
        functionToCall: any;
		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée l'event *
		
				Return: nil
		\*	--------------------------------------------------- */
        constructor(functionToCall: any){
            this.functionToCall = functionToCall;
            var cache = this;

            window.addEventListener("mousemove", function(e) {
                cache.functionToCall(e.clientX, e.clientY);
           	});

        }

	}

	/*	--------------------------------------------------- *\
			[class] Click()
	
			* Quand l'utilisateur clique sur une zone *
	
	\*	--------------------------------------------------- */
	export class Click{
		
        x: number;
        y: number;
        width: number;
        height: number;
        functionToCall: any;
        functionToCallWhenClickOutOfArea: any;


		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée l'event click *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(x:number, y : number, width:number, height:number, functionToCall:any, ...rest : any[]){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.functionToCall = functionToCall;
            if(rest[0]){
				this.functionToCallWhenClickOutOfArea = rest[0];
            }

            var cache = this;
            if(functionToCall != null){
                window.addEventListener("click", function(e){
                    if (e.clientX >= cache.x && e.clientX <= cache.x + cache.width && e.clientY >= cache.y && e.clientY <= cache.y + cache.height) {
                        cache.functionToCall(e.clientX, e.clientY);
                    }
                    else{
                    	if(cache.functionToCallWhenClickOutOfArea){
							cache.functionToCallWhenClickOutOfArea(e.clientX, e.clientY);
                    	}
                    }
               	});
            }
		}

		/*	--------------------------------------------------- *\
				[function] setPosition(x, y)
		
				* Set la position de la hitbox *
		
				Return: nil
		\*	--------------------------------------------------- */
		setPosition(x : number, y : number){
			this.x = x;
			this.y = y;
		}

		/*	--------------------------------------------------- *\
				[function] setSize(width, height)
		
				* Set la taille de la hitbox *
		
				Return: nil
		\*	--------------------------------------------------- */
		setSize(width : number, height : number){
			this.width = width;
			this.height = height;
		}

		/*	--------------------------------------------------- *\
				[function] out()
		
				* Quand on clique en dehors de la zone *
		
				Return: nil
		\*	--------------------------------------------------- */
		out(functionToCall : any){
			this.functionToCallWhenClickOutOfArea = functionToCall;
		}

	}



	/*	--------------------------------------------------- *\
			[class] Touch()
	
			* Créer une zone où l'utilisateur peut toucher *
	
	\*	--------------------------------------------------- */
	export class Touch{

		x : number;
		y : number;
		width : number;
		height : number;
		pressE : any;
		leaveE : any;
		
		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée une zone de toucher *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(x : number, y : number, width : number, height : number){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;


		}


		/*	--------------------------------------------------- *\
				[function] press()
		
				* Quand l'utilisateur appuie sur la zone *
		
				Return: nil
		\*	--------------------------------------------------- */
		press(functionToCall : any){
			var cache = this;
			document.body.addEventListener("touchstart", function(e:any){
                for (var i = e.changedTouches.length - 1; i >= 0; i--) {
					if(e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height){
						this.pressE = functionToCall(e.changedTouches[i].clientX, e.changedTouches[i].clientY);

					}
                }
			}, false);
		}

		/*	--------------------------------------------------- *\
				[function] release()
		
				* Quand l'utilisateur relache la zone *
		
				Return: nil
		\*	--------------------------------------------------- */
		release(functionToCall : any){
			var cache = this;
			document.body.addEventListener("touchend", function(e:any){
				for (var i = e.changedTouches.length - 1; i >= 0; i--) {
					if(e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height){
						this.leaveE = functionToCall(e.changedTouches[i].clientX, e.changedTouches[i].clientY);

					}
				}
			}, false);
		}

		/*	--------------------------------------------------- *\
				[function] move()
		
				* Quand l'utilisateur glisse sur la zone *
		
				Return: nil
		\*	--------------------------------------------------- */
		move(functionToCall : any){
			var cache = this;
			document.body.addEventListener("touchmove", function(e:any){
				for (var i = e.changedTouches.length - 1; i >= 0; i--) {
					if(e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height){
						this.leaveE = functionToCall(e.changedTouches[i].clientX, e.changedTouches[i].clientY);

					}
				}
			}, false);
		}


	}

	/*	--------------------------------------------------- *\
			[class] Key()
	
			* Crée un event de type Key press *
	
	\*	--------------------------------------------------- */
	export class Key{
		
        keyPressed: any;
        functionsToCall: any;

		/*	--------------------------------------------------- *\
				[function] constructor(keyPressed : any)
		
				* Quand on crée l'event *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(...rest : any[]){
			if(rest[0]){
            	this.keyPressed = rest[0];
			}
            this.functionsToCall = {};
            window.addEventListener("keydown", (e) => {
            	if(this.keyPressed){
	                if (this.keyPressed == e.key || this.keyPressed == e.keyCode || this.keyPressed == e.charCode) {
	                    if(this.functionsToCall.down){
	                        pressedKeys.push({ key: e.key, code: e.keyCode, func : this.functionsToCall.down});
	                    }
	                    else{
	                        pressedKeys.push({ key: e.key, code: e.keyCode});
	                    }
	                }
            	}
            	else{
            		if(this.functionsToCall.down){
						this.functionsToCall.down(e.key, e.keyCode, e.charCode);
            		}
            	}
            });

            window.addEventListener("keyup", (e) => {
            	if(this.keyPressed){
					if (this.keyPressed == e.key || this.keyPressed == e.keyCode || this.keyPressed == e.charCode) {
						if (this.functionsToCall.up) {
							this.functionsToCall.up(e.key, e.keyCode, e.charCode);
						}

						for (var i = pressedKeys.length - 1; i >= 0; i--) {
							if (pressedKeys[i]) {
								if (pressedKeys[i].key == e.key || pressedKeys[i].code == e.keyCode) {
									delete pressedKeys[i];
								}
							}
						}
					}
            	}
            	else{
            		if(this.functionsToCall.up){
						this.functionsToCall.up(e.key, e.keyCode, e.charCode);
            		}
            	}
            });
		}


		/*	--------------------------------------------------- *\
				[function] down()
		
				* Quand l'utilisateur appuie sur la touche *
		
				Return: nil
		\*	--------------------------------------------------- */
		down(functionToCall:any){
            this.functionsToCall.down = functionToCall;
		}

		/*	--------------------------------------------------- *\
				[function] up()
		
				* Quand l'utilisateur relache la touche *
		
				Return: nil
		\*	--------------------------------------------------- */
		up(functionToCall : any){
            this.functionsToCall.up = functionToCall;
        }

        /*	--------------------------------------------------- *\
        		[function] setKey(key)
        
        		* Set une nouvelle key *
        
        		Return: nil
        \*	--------------------------------------------------- */
        setKey(newKey : any){
			this.keyPressed = newKey;
        }

	}


    updateKeys();
    function updateKeys(){
        requestAnimationFrame(updateKeys);
        for (var i = pressedKeys.length - 1; i >= 0; i--) {
            if(pressedKeys[i]){
                pressedKeys[i].func(pressedKeys[i].key, pressedKeys[i].code);
            }
        }
    }


    /*	--------------------------------------------------- *\
    		[class] Scroll()
    
    		* Mouse scroll *
    
    \*	--------------------------------------------------- */
    export class Scroll{
    		
		functionToCallWhenUp: any;
		functionToCallWhenDown: any;

    	/*	--------------------------------------------------- *\
    			[function] constructor()
    	
    			* Quand on crée un event scroll *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	constructor(){
			window.addEventListener("DOMMouseScroll", (e) => {
				if(e){
					if(e['detail'] && e['detail'] > 0){
						if(this.functionToCallWhenDown){
							this.functionToCallWhenDown();
						}
					}
					else{
						if (this.functionToCallWhenUp) {
							this.functionToCallWhenUp();
						}
					}
					
				}
			});
    	}

    	/*	--------------------------------------------------- *\
    			[function] up()
    	
    			* Quand on scroll vers le haut *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	up(functionToCall:any){
			this.functionToCallWhenUp = functionToCall;
    	}

    	/*	--------------------------------------------------- *\
    			[function] down()
    	
    			* Quand on scroll vers le bas *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	down(functionToCall:any){
			this.functionToCallWhenDown = functionToCall;

    	}
    }

    // Prevent context menu
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });




}