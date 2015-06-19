/*	--------------------------------------------------- *\
		Particles
\*	--------------------------------------------------- */
module Particles{

	var particlesType = [];


	/*	--------------------------------------------------- *\
			[class] ParticleType()
	
			* Crée un type de particule *
	
	\*	--------------------------------------------------- */
	export class ParticleType{

		name: string;
		texture: any;
		
		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée un type de particule *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(name : string, texture : any){

			this.name = name;
			this.texture = texture;


			particlesType.push(this);
		}

		/*	--------------------------------------------------- *\
				[function] getName()
		
				* Retourne le nom de la particule *
		
				Return: name
		\*	--------------------------------------------------- */
		getName(){
			return this.name;
		}

		/*	--------------------------------------------------- *\
				[function] getTexture()
		
				* Retourne la texture de la particule *
		
				Return: texture
		\*	--------------------------------------------------- */
		getTexture(){
			return this.texture;
		}
	}

	/*	--------------------------------------------------- *\
			[class] Particle()
	
			* Crée une particule *
	
	\*	--------------------------------------------------- */
	export class Particle extends Elements{
		
		/*	--------------------------------------------------- *\
				[function] constructor(originX, originY)
		
				* Quand on crée une particule *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(x : number, y : number, particle : string){
			super();

			this.setPosition(x - 64, y - 64);
			this.setMass(0);


			for (var i = particlesType.length - 1; i >= 0; i--) {
				if(particlesType[i].getName() == particle){
					var sprite = new Render.Sprite(particlesType[i].getTexture(), x - 64, y - 64, 128, 128, 256, 256, 5, 0);
					sprite.setUniqueLoop(true);
					this.assignDrawable(sprite);
					particlesCanvas.set(sprite);
				}
			}

		}


		/*	--------------------------------------------------- *\
				[function] play()
		
				* Play the animation of the sprite *
		
				Return: nil
		\*	--------------------------------------------------- */
		play(){
			if(this.getAssignedDrawable()){
				this.getAssignedDrawable().playUniqueLoop();
			}
		}
	}

}