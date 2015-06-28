/*	--------------------------------------------------- *\
		Fonts
\*	--------------------------------------------------- */
module Fonts{
	var importedFonts = [];

	/*	--------------------------------------------------- *\
			[class] FontFace()
	
			* Crée une font-face *
	
	\*	--------------------------------------------------- */
	export class FontFace{

		name: string;
		path: string;
		styleElement: any;
		
		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée une font-face *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(name : string, path : string){
			this.styleElement = document.createElement("style");			
			document.body.appendChild(this.styleElement);
			
			this.setName(name);
			this.setPath(path);
			
			importedFonts.push(this);
		}

		/*	--------------------------------------------------- *\
				[function] updateCSS()
		
				* Met a jour le CSS avec les valeurs *
		
				Return: nil
		\*	--------------------------------------------------- */
		updateCSS(){
			this.styleElement.innerHTML = "@font-face{ font-family: " + this.getName() + "; src : url('" + this.getPath() + "');}";
		}

		/*	--------------------------------------------------- *\
				[function] setName(name)
		
				* Set le nom de la police *
		
				Return: nil
		\*	--------------------------------------------------- */
		setName(name : string){
			this.name = name;
			this.updateCSS();
		}
		
		/*	--------------------------------------------------- *\
				[function] setPath(path)
		
				* Set le chemin de la police *
		
				Return: nil
		\*	--------------------------------------------------- */
		setPath(path : string){
			this.path = "./"+path;
			this.updateCSS();
		}

		/*	--------------------------------------------------- *\
				[function] getName()
		
				* Retourne le nom de la police *
		
				Return: name
		\*	--------------------------------------------------- */
		getName(){
			return this.name;
		}

		/*	--------------------------------------------------- *\
				[function] getPath()
		
				* Retourne le path *
		
				Return: path
		\*	--------------------------------------------------- */
		getPath(){
			return this.path;
		}
	}
}