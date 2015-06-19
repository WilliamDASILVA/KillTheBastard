/*	--------------------------------------------------- *\
		[class] Camera()

		* Crée une camera *

		Return: camera
\*	--------------------------------------------------- */
class Camera extends Scene{

	position : any;
	parentScene : any;

	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand une camera est crée *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(scene:any){
		super();
		this.parentScene = scene;
        this.position = { x: 0, y: 0 };
		
	}

	/*	--------------------------------------------------- *\
			[function] setPosition()
	
			* Set la position de la camera *
	
			Return: nil
	\*	--------------------------------------------------- */
	setPosition(x : number, y : number){
		var sceneOrigin = this.parentScene.getOrigin();
		this.position = {x : sceneOrigin.x + x, y : sceneOrigin.y + y};
	}


	/*	--------------------------------------------------- *\
			[function] getPosition()
	
			* Get la position de la camera *
	
			Return: position
	\*	--------------------------------------------------- */
	getPosition(){
		return this.position;
	}

	/*	--------------------------------------------------- *\
			[function] getOrigin()
	
			* Retourne la position d'origine de la camera *
	
			Return: position
	\*	--------------------------------------------------- */
	getOrigin(){
        return { x: this.position.x - (sX / 2), y: this.position.y - (sY / 2) };
	}


}