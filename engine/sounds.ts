/*	--------------------------------------------------- *\
		Sounds
\*	--------------------------------------------------- */
module Sounds{

	var elementsToDownload = [];
	var functionToCallWhenDownloadReady = null;
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

						if(elementsDownloaded == elementsToDownload.length){
							if(functionToCallWhenDownloadReady){
								functionToCallWhenDownloadReady();
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
		functionToCallWhenDownloadReady = functionToCall;
	}

	/*	--------------------------------------------------- *\
			[class] Sound()
	
			* Crée un son *
	
	\*	--------------------------------------------------- */
	export class Sound{
		
		element: any;
		path: string;
		duration: number;
		currentTime: number;
		volume: number;
		muted: boolean;
		muteTemp: number;

		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Crée un son *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(path : string){
			this.element = document.createElement("audio");
			document.body.appendChild(this.element);
			this.setPath(path);

			this.duration = this.element.duration;
			this.volume = this.element.volume;
			this.currentTime = 0;
			this.muted = false;
			this.muteTemp = 1;
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
				[function] getDUration()
		
				* Retourne la longeur de la bande don *
		
				Return: duration
		\*	--------------------------------------------------- */
		getDuration(){
			return this.duration;
		}

		/*	--------------------------------------------------- *\
				[function] getVolume()
		
				* Retourne le volume du son *
		
				Return: volume
		\*	--------------------------------------------------- */
		getVolume(){
			return this.volume;
		}

		/*	--------------------------------------------------- *\
				[function] setVolume(volume)
		
				* Set le volume du son *
		
				Return: nil
		\*	--------------------------------------------------- */
		setVolume(volume : number){
			if(volume >= 0){
				this.volume = volume;
				this.element.volume = this.getVolume();
			}
		}

		/*	--------------------------------------------------- *\
				[function] setCurrentTime(time)
		
				* Set le currentTime du son en secondes *
		
				Return: nil
		\*	--------------------------------------------------- */
		setCurrentTime(time : number){
			this.currentTime = time;
			this.element.currentTIme = this.getCurrentTime();
		}

		/*	--------------------------------------------------- *\
				[function] getCurrentTime()
		
				* Retourne le temps actuel en secondes *
		
				Return: currentTime
		\*	--------------------------------------------------- */
		getCurrentTime(){
			return this.currentTime;
		}

		/*	--------------------------------------------------- *\
				[function] isMute()
		
				* Retourne si le son est mute ou pas *
		
				Return: true, false
		\*	--------------------------------------------------- */
		isMute(){
			return this.muted;
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

		/*	--------------------------------------------------- *\
				[function] stop()
		
				* Stoppe le son et le restart *
		
				Return: nil
		\*	--------------------------------------------------- */
		stop(){
			this.pause();
			this.setCurrentTime(0);
		}

		/*	--------------------------------------------------- *\
				[function] mute()
		
				* Mute le son *
		
				Return: nil
		\*	--------------------------------------------------- */
		mute(){
			this.muteTemp = this.getVolume();
			this.setVolume(0);
			this.muted = true;
		}

		/*	--------------------------------------------------- *\
				[function] unmute()
		
				* Demute le son *
		
				Return: nil
		\*	--------------------------------------------------- */
		unmute(){
			if(this.muteTemp){
				this.setVolume(this.muteTemp);
			}
			this.muted = false;
		}
	}
}