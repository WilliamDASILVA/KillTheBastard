/*	--------------------------------------------------- *\
		Global functions
\*	--------------------------------------------------- */
module Global{

	/*	--------------------------------------------------- *\
			[function] getDistanceBetween2Points(xA, xB, yA, yB)
	
			* Retourne la distance entre deux points *
	
			Return: distance
	\*	--------------------------------------------------- */
	export function getDistanceBetween2Points(aX : number, aY : number, bX : number, bY : number):number{
		return Math.sqrt(Math.pow((bY - aY), 2) + Math.pow((bX - aX), 2));
	}

    /*    --------------------------------------------------- *\
            [function] getPositionFromScreen(screeX, screenY, cam)
    
            * Retourne une position dans le world selon la position sur l'écran *
    
            Return: position
    \*    --------------------------------------------------- */
    export function getPositionFromScreen(screenX, screenY, cam){
        var camPosition = cam.getOrigin();
        return { x : camPosition.x + screenX, y : camPosition.y + screenY };
    }

    /*    --------------------------------------------------- *\
            [function] getPositionFromWorld(worldX, worldY, cam)
    
            * Retourne une position dans le screen selon la position sur le world *
    
            Return: position
    \*    --------------------------------------------------- */
    export function getPositionFromWorld(worldX, worldY, cam){
        var camPosition = cam.getOrigin();
        return { x: worldX - camPosition.x, y: worldY - camPosition.y};
    }

    /*    --------------------------------------------------- *\
            [function] findRotation(x, y, x, y)
    
            * Find the rotation between two points *
    
            Return: rotation
    \*    --------------------------------------------------- */
    export function findRotation(x1,y1,x2,y2){
        var t = -(Math.atan2(x2 - x1, y2 - y1) * (180/Math.PI));
        if(t < 0){
            t = t + 360;
        }

        return t;
    }

    /*    --------------------------------------------------- *\
            [function] getRandom(min, max)
    
            * Retourne un nombre random entre min & max *
    
            Return: number
    \*    --------------------------------------------------- */
    export function getRandom(min : number, max : number):number{
        return Math.random() * (max - min) + min;
    }

    /*    --------------------------------------------------- *\
            [function] getTrunc(x)
    
            * Retourne une valeur tronqué d'un nombre décimal *
    
            Return: number
    \*    --------------------------------------------------- */
    export function getTrunc(x : number):number {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }

    /*    --------------------------------------------------- *\
            [function] isAndroid()
    
            * Check si on tourne sous Android ou non *
    
            Return: true, false
    \*    --------------------------------------------------- */
    export function isAndroid(){
        if(navigator.userAgent.match(new RegExp("(Android|android)+", "g"))){
            return true;
        }
        else{
            return false;
        }
    }

    /*    --------------------------------------------------- *\
            [class] XHR()
    
            * Crée une request XHR *
    
    \*    --------------------------------------------------- */
    export class XHR{

        request: any;
        functionsToCallWhenReady: any;
        functionsToCallWhenLoaded: any;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une request XHR *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(target: string, ...parameters : any[]){
            this.functionsToCallWhenReady = [];
            this.functionsToCallWhenLoaded = [];

            try{
                this.request = new XMLHttpRequest();
            }
            catch(e){
                try{
                    this.request = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch(e){
                    try{
                        this.request = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    catch(e){}
                }
            }

            this.request.open("GET", target, true);

            if(parameters[0]){
                this.request.responseType = parameters[0];
            }

            this.request.send(null);
            this.request.addEventListener("readystatechange", () => {
                if(this.functionsToCallWhenReady){
                    for (var i = 0; i < this.functionsToCallWhenReady.length; i++) {
                        this.functionsToCallWhenReady[i](this.request);
                    }
                }
            });

            this.request.addEventListener("load", () => {
                if(this.functionsToCallWhenLoaded){
                    for (var i = 0; i < this.functionsToCallWhenLoaded.length; i++) {
                        this.functionsToCallWhenLoaded[i](this.request);
                    }
                }
            });


        }

        /*    --------------------------------------------------- *\
                [function] ready()
        
                * Fires when the event is ready *
        
                Return: nil
        \*    --------------------------------------------------- */
        ready(functionToCall : any){
            this.functionsToCallWhenReady.push(functionToCall);
        }

        /*    --------------------------------------------------- *\
                [function] load()
        
                * Quand la request est chargé *
        
                Return: nil
        \*    --------------------------------------------------- */
        load(functionToCall :any){
            this.functionsToCallWhenLoaded.push(functionToCall);
        }
    }
}
