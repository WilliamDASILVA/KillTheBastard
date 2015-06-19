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
            [class] XHR()
    
            * Crée une request XHR *
    
    \*    --------------------------------------------------- */
    export class XHR{

        request: any;
        functionToCallWhenReady: any;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une request XHR *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(target: string){
            console.log(target);

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
            this.request.send(null);
            this.request.addEventListener("readystatechange", () => {
                if(this.functionToCallWhenReady){
                    this.functionToCallWhenReady(this.request);
                }
            });


        }

        /*    --------------------------------------------------- *\
                [function] ready()
        
                * Fires when the event is ready *
        
                Return: nil
        \*    --------------------------------------------------- */
        ready(functionToCall : any){
            this.functionToCallWhenReady = functionToCall;
        }
    }
}
