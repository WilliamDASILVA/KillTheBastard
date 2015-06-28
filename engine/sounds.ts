/*	--------------------------------------------------- *\
		Sounds
\*	--------------------------------------------------- */
module Sounds{

	var elementsToDownload = [];
	var functionToCallWhenDownloadReady = null;
	//var Media = Media || null;

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
		request: any;
		source: any;

		functionsToCallWhenEnd: any;
		functionsToCallWhenPause: any;
		functionToCallWhenReady: any;

		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Crée un son *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(path : string){
			this.functionsToCallWhenEnd = [];
			this.functionsToCallWhenPause = [];
			this.functionToCallWhenReady = null;

			this.element = null;

			if(Global.isAndroid()){
				this.element = new Media("/android_asset/www/" + path);			
			}
			else{
				this.element = new Audio(path);
				this.element.addEventListener("canplaythrough", () => {
					if(this.functionToCallWhenReady){
						this.functionToCallWhenReady();
					}
				});
			}

			this.path = path;

			this.duration = this.element.duration;
			this.volume = this.element.volume || 1;
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
				if(Media != undefined && Media.prototype.setVolume){
					this.element.setVolume(volume);
				}
				else{
					this.element.volume = volume;
				}
			}
		}

		/*	--------------------------------------------------- *\
				[function] setCurrentTime(time)
		
				* Set le currentTime du son en secondes *
		
				Return: nil
		\*	--------------------------------------------------- */
		setCurrentTime(time : number){
			this.currentTime = time;
			if(Media != undefined){
				this.element.seekTo(time);
			}
			else{
				this.element.currentTime = time;
			}
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
			if(this.element){
				this.element.play();				
			}
		}

		/*	--------------------------------------------------- *\
				[function] pause()
		
				* Pause le son *
		
				Return: nil
		\*	--------------------------------------------------- */
		pause(){
			this.element.pause();
			for (var i = this.functionsToCallWhenPause.length - 1; i >= 0; i--) {
				this.functionsToCallWhenPause[i]();
			}
		}

		/*	--------------------------------------------------- *\
				[function] stop()
		
				* Stoppe le son et le restart *
		
				Return: nil
		\*	--------------------------------------------------- */
		stop(){
			this.pause();
			this.setCurrentTime(0);
			if(this.element.stop()){
				this.element.stop();
			}
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

		/*	--------------------------------------------------- *\
				[function] onEnd(functionToCall)
		
				* Quand le son est fini *
		
				Return: nil
		\*	--------------------------------------------------- */
		onEnd(functionToCall : any){
			this.functionsToCallWhenEnd.push(functionToCall);
		}

		/*	--------------------------------------------------- *\
				[function] onPause(functionToCall)
		
				* Quand le son est mis en pause *
		
				Return: nil
		\*	--------------------------------------------------- */
		onPause(functionToCall :any){
			this.functionsToCallWhenPause.push(functionToCall);
		}

		/*	--------------------------------------------------- *\
				[function] ready(functionToCall)
		
				* Quand le son est pret a être joué *
		
				Return: nil
		\*	--------------------------------------------------- */
		ready(functionToCall : any){
			this.functionToCallWhenReady = functionToCall;
		}
	}
}