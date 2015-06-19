/*	--------------------------------------------------- *\
		[class] Ennemy()

		* Créer un ennemy *

\*	--------------------------------------------------- */
class Ennemy extends Character{
	
	/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée un ennemy *
		
				Return: nil
		\*	--------------------------------------------------- */
	constructor(x : number, y : number, world: any) {
		super(world);
		this.setType("ennemy");
		this.canCollideWith("tile", "bullet");

		// assign texture
		var texture = new Render.Texture("interface/img/blobies_static.svg");
		var drawable = new Render.Sprite(texture, 0, 0, 128, 128, 256, 256, 10, 0);


    	// spawn the ennemy
    	mainCanvas.set(this);
		this.assignDrawable(drawable);
		this.setPosition(x, y);

	}
}