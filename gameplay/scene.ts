/*	--------------------------------------------------- *\
		[class] Scene()

		* Crée une scene *

\*	--------------------------------------------------- */
class Scene{
	
	origin: any;

	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand une scene est crée *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(){
		this.origin = {x : 0, y : 0};
	}

	/*	--------------------------------------------------- *\
			[function] getOrigin()
	
			* Retourne l'origin *
	
			Return: origin
	\*	--------------------------------------------------- */
	getOrigin():any{
		return this.origin;
	}


}