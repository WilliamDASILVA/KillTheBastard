/*	--------------------------------------------------- *\
		[class] Link()

		* Crée un lien entre deux checkpoints *

\*	--------------------------------------------------- */
class Link{
	
	position: any;
	target: any;
	element: any;
	fadeTimer: any;

	/*	--------------------------------------------------- *\
			[function] constructor()
	
			* Quand on crée un lien entre deux checkpoints *
	
			Return: nil
	\*	--------------------------------------------------- */
	constructor(x : number, y : number){
		this.position = { x: x, y: y };
		this.target = { x: x, y: y };

		this.element = new Render.Draw.Line(this.position.x, this.position.y, this.target.x, this.target.y);
		this.element.setStrokeSize(10);
		this.element.setStrokeColor("#FFFFFF");

		this.fadeTimer = setInterval(() => {
			var opacity = this.element.getOpacity();
			this.element.setOpacity(opacity -= 0.05);
			if(opacity <= 0){
				this.element.setOpacity(0);
				clearInterval(this.fadeTimer);
			}
		}, 80);

		mainCanvas.set(this.element);
	}	

	/*	--------------------------------------------------- *\
			[function] setTarget(x, y)
	
			* Set le target du link *
	
			Return: nil
	\*	--------------------------------------------------- */
	setTarget(x : number, y : number){
		this.element.setTarget(x, y);
	}

}