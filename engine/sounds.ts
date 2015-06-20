/*	--------------------------------------------------- *\
		Sounds
\*	--------------------------------------------------- */
module Sounds{

	var elementsToDownload = [];
	var functionsToCallWhenDownloadReady = [];
	var preloadElement = document.createElement("audio");
	document.body.appendChild(preloadElement);

	/*	--------------------------------------------------- *\
			[function] add(path)
	
			* Ajoute un son a télécharger *
	
			Return: nil
	\*	--------------------------------------------------- */
	export function add(path : string){
		var element = {
			state: "pending",
			path: path
		};
		elementsToDownload.push(element);
	}

	/*	--------------------------------------------------- *\
			[function] download()
	
			* Télécharge tous les sons *
	
			Return: nil
	\*	--------------------------------------------------- */
	export function download(){
		var downloadComplete = false;
		var elementsDownloaded = 0;

		for (var i = elementsToDownload.length - 1; i >= 0; i--) {
			if(elementsToDownload[i].state == "pending"){
				var theAudio = preloadElement;
				if(theAudio){
					theAudio.src = elementsToDownload[i].path;
					elementsToDownload[i].state = "downloading";
					
					var temp = elementsToDownload[i];
					theAudio.addEventListener("canplaythrough", () => {
						temp.state = "downloaded";

						for (var k = elementsToDownload.length - 1; k >= 0; k--) {
							if(elementsToDownload[k].state == "downloaded"){
								elementsDownloaded++;
							}
						}

						console.log(elementsDownloaded, elementsToDownload.length);
						if(elementsDownloaded == elementsToDownload.length){
							for (var z = functionsToCallWhenDownloadReady.length - 1; z >= 0; z--) {
								functionsToCallWhenDownloadReady[z]();
								
							}
						}
					});
					
				}
			}
		}
	}

	/*	--------------------------------------------------- *\
			[function] ready(functionToCall)
	
			* Appelle cette fonction quand le téléchargement est fini *
	
			Return: nil
	\*	--------------------------------------------------- */
	export function ready(functionToCall : any){
		functionsToCallWhenDownloadReady.push(functionToCall);
	}

	/*	--------------------------------------------------- *\
			[class] Sound()
	
			* Crée un son *
	
	\*	--------------------------------------------------- */
	export class Sound{
		
		element: any;
		path: string;

		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Crée un son *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(path : string){
			this.element = document.createElement("audio");
			document.body.appendChild(this.element);

			this.setPath(path);
		}

		/*	--------------------------------------------------- *\
				[function] getPath()
		
				* Retourne le path du sound *
		
				Return: path
		\*	--------------------------------------------------- */
		getPath(){
			return this.path;
		}

		/*	--------------------------------------------------- *\
				[function] setPath(path)
		
				* Set le path du sound *
		
				Return: nil
		\*	--------------------------------------------------- */
		setPath(path : string){
			this.path = path;
			this.element.src = path;
		}

		/*	--------------------------------------------------- *\
				[function] play()
		
				* Joue le son *
		
				Return: nil
		\*	--------------------------------------------------- */
		play(){
			this.element.play();
		}

		/*	--------------------------------------------------- *\
				[function] pause()
		
				* Pause le son *
		
				Return: nil
		\*	--------------------------------------------------- */
		pause(){
			this.element.pause();
		}
	}
}