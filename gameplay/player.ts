/*	--------------------------------------------------- *\
		[class] Player()

		* Crée une instance d'un joueur *

\*	--------------------------------------------------- */
class Player extends Character{
	
	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand un joueur est crée *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(world : any){
		super(world);
		this.setType("player");
		this.canCollideWith("tile");

	}

}