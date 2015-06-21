var checkpoints = [];

/*	--------------------------------------------------- *\
		[class] Checkpoint()

		* Crée un checkpoint *

\*	--------------------------------------------------- */
class Checkpoint{
	
	position: any;
	drawable: any;
	radius: number;
	valid: boolean;

	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand on crée un checkpoint *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(x : number, y : number, radius : number,  texture : any){
		this.position = { x: x, y: y };
		this.radius = radius;
		this.valid = false;
		this.drawable = new Render.Sprite(texture, this.position.x - radius, this.position.y - radius, radius * 2, radius * 2, 32, 32, 7, 0);
		this.drawable.setUniqueLoop(true);
		this.drawable.setFreeze(true);
		mainCanvas.set(this.drawable);

		checkpoints.push(this);
	}

	/*	--------------------------------------------------- *\
			[function] getRadius()
	
			* Retourne le radius du checkpoint *
	
			Return: radius
	\*	--------------------------------------------------- */
	getRadius(){
		return this.radius;
	}

	/*	--------------------------------------------------- *\
			[function] getPosition()
	
			* Retourne la position du checkpoint *
	
			Return: position
	\*	--------------------------------------------------- */
	getPosition(){
		return this.position;
	}

	/*	--------------------------------------------------- *\
			[function] setValid(value)
	
			* Set le checkpoint valide ou non *
	
			Return: nil
	\*	--------------------------------------------------- */
	setValid(value : boolean){
		this.valid = value;
		if(value){
			this.drawable.setFreeze(false);
			this.drawable.playUniqueLoop();
		}
	}
}