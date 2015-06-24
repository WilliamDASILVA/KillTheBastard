/*	--------------------------------------------------- *\
		Render
\*	--------------------------------------------------- */
module Render{

	var renderCamera = null;
    var image_prefix = "./";
    var elementsToDownload = [];
    var fToCallWhenDownloadReady = [];
    var debugMode = false;
    var actualWorld = null;
    var layers = [];

    /*	--------------------------------------------------- *\
    		[class] Layer()
    
    		* Crée un layer *
    
    \*	--------------------------------------------------- */
    export class Layer{
    	
		canvasElement: any;
		context: any;
		elements: any;
		smooth: boolean;

    	/*	--------------------------------------------------- *\
    			[function] constructor()
    	
    			* Quand on crée un layer *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	constructor(){
			this.elements = [];

			this.canvasElement = document.createElement("canvas");
			this.context = this.canvasElement.getContext("2d");

			this.canvasElement.width = window.innerWidth;
			this.canvasElement.height = window.innerHeight;

			document.body.appendChild(this.canvasElement);

			this.render();

			this.smooth = true;

			layers.push(this);
    	}

    	render(){
			window.requestAnimationFrame(() => {
				updateRender(this);
				this.render();
			});
    	}

    	/*	--------------------------------------------------- *\
    			[function] set()
    	
    			* Set un element dans le layout *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	set(element : any){
			this.elements.push(element);
    	}

    	/*	--------------------------------------------------- *\
    			[function] del()
    	
    			* Delete un element du layout *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	del(element : any){
    		for (var i = this.elements.length - 1; i >= 0; i--) {
    			if(this.elements[i] == element){
					delete this.elements[i];
    			}
    		}
    	}

    	/*	--------------------------------------------------- *\
    			[function] getContext()
    	
    			* Retourne le context du layer *
    	
    			Return: context
    	\*	--------------------------------------------------- */
    	getContext(){
			return this.context;
    	}

    	/*	--------------------------------------------------- *\
    			[function] getCanvas()
    	
    			* Retourne le canvas du layer *
    	
    			Return: canvas
    	\*	--------------------------------------------------- */
    	getCanvas(){
			return this.canvasElement;
    	}

    	/*	--------------------------------------------------- *\
    			[function] getElements()
    	
    			* Retourne la liste de tous les elementsn *
    	
    			Return: elements
    	\*	--------------------------------------------------- */
    	getElements(){
			return this.elements;
    	}

    	/*	--------------------------------------------------- *\
    			[function] setSmooth(value)
    	
    			* Set toute le canvas en smooth ou pixelated *
    	
    			Return: nil
    	\*	--------------------------------------------------- */
    	setSmooth(value : boolean){
			this.smooth = value;
    	}

    	/*	--------------------------------------------------- *\
    			[function] isSmooth()
    	
    			* Retourne si le canvas est smooth ou pixelated *
    	
    			Return: true, false
    	\*	--------------------------------------------------- */
    	isSmooth(){
			return this.smooth;
    	}
    }

	/*	--------------------------------------------------- *\
			[class] Texture()
	
			* Create an image element *
	
	\*	--------------------------------------------------- */
	export class Texture{
		src : string;
		data : any;

		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée une texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(src:string){
			this.src = image_prefix + src;
			this.data = new Image();
			this.data.src = image_prefix + src;
		}

		/*	--------------------------------------------------- *\
				[function] getData()
		
				* Retourne l'image *
		
				Return: data
		\*	--------------------------------------------------- */
		getData(){
			if(this.data){
				return this.data;
			}
			else{
				return false;
			}
		}

		/*	--------------------------------------------------- *\
				[function] setSrc(src)
		
				* Set une nouvelle src pour la texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		setSrc(src:string){
			this.data.src = image_prefix + src;
			this.src = image_prefix + src;
		}

		/*	--------------------------------------------------- *\
				[event] onLoad()
		
				* Quand la texture est chargé *
		
		\*	--------------------------------------------------- */
		onLoad(functionToCall:any){
            var func = functionToCall;
            var texture = this;
            this.getData().addEventListener("load", function() {
                func(texture);
            });
		}
	}


	/*	--------------------------------------------------- *\
			[class] Drawable()
	
			* Crée un element drawable a un emplacement donnée *
	
	\*	--------------------------------------------------- */
	export class Drawable{
		texture : any;
        position: any;
		size : any;
		depth : number;
		rotation : number;
		sprite : boolean;
		opacity : number;
		fixed : boolean;
        type: string;
        flipped: boolean;
        fixedToCenter: boolean;
        rotationPoint: any;
        visible: boolean;
        layout: any;
        smooth: boolean;

		/*	--------------------------------------------------- *\
				[function] constructor(texture, x, y, width, height)
		
				* Quand une texture est crée *
		
				Return: true, false
		\*	--------------------------------------------------- */
		constructor(texture:any, ...parameters  : any[]){
			this.texture = texture;
			if(texture == null){
				this.setSize(0, 0);
			}
			else{
				this.setSize(texture.getData().width, texture.getData().height);
			}

            this.setPosition(0, 0);
			if(parameters[0] != null && parameters[1] != null){
				this.setPosition(parameters[0], parameters[1]);
			}

			if(parameters[2] != null && parameters[3] != null){
				this.setSize(parameters[2], parameters[3]);
			}


			this.depth = 0;
			this.rotation = 0;
            this.opacity = 1;
            this.type = "drawable";
            this.flipped = false;
            this.fixedToCenter = true;
            this.rotationPoint = { x: 0, y: 0 };
            this.visible = true;
            this.smooth = true;
		}

		/*	--------------------------------------------------- *\
				[function] setPosition(x, y)
		
				* Set la position de la texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		setPosition(x:number, y : number){
			this.position = {x : x, y : y};
		}

		/*	--------------------------------------------------- *\
				[function] getPosition()
		
				* Retourne la position de la texture *
		
				Return: position
		\*	--------------------------------------------------- */
		getPosition(){
			return this.position;
		}

		/*	--------------------------------------------------- *\
				[function] getSize()
		
				* Retourne la taille de la texture *
		
				Return: size
		\*	--------------------------------------------------- */
		getSize(){
			return this.size;
		}

		/*	--------------------------------------------------- *\
				[function] setSize(width, height)
		
				* Set la taille de la texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		setSize(width:number, height:number){
			this.size = {width : width, height : height};
		}

		/*	--------------------------------------------------- *\
				[function] getData()
		
				* Retourne la texture en elle même *
		
				Return: image
		\*	--------------------------------------------------- */
		getData(){
			if(this.texture === null){
				return false;
			}
			else{
				return this.texture.getData();
			}
		}

		/*	--------------------------------------------------- *\
				[function] getDepth()
		
				* Retourne la profondeur de champ *
		
				Return: depth
		\*	--------------------------------------------------- */
		getDepth(){
			return this.depth;
		}

		/*	--------------------------------------------------- *\
				[function] setDepth(depth)
		
				* Set la profondeur de champ *
		
				Return: nil
		\*	--------------------------------------------------- */
		setDepth(depth:number){
			this.depth = depth;
		}

		/*	--------------------------------------------------- *\
				[function] setRotation(angle)
		
				* Set la rotation de la texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		setRotation(angle:number){
			this.rotation = angle;
		}

		/*	--------------------------------------------------- *\
				[function] getRotation()
		
				* Retourne la rotation *
		
				Return: rotation
		\*	--------------------------------------------------- */
		getRotation(){
			return this.rotation;
		}

		/*	--------------------------------------------------- *\
				[function] getOpacity()
		
				* Retourne l'opacity *
		
				Return: opacity
		\*	--------------------------------------------------- */
		getOpacity(){
			return this.opacity;
		}

		/*	--------------------------------------------------- *\
				[function] setOpacity(opacity)
		
				* Set l'opacité de la texture *
		
				Return: nil
		\*	--------------------------------------------------- */
		setOpacity(opacity:number){
			this.opacity = opacity;
		}

		/*	--------------------------------------------------- *\
				[function] isSprite()
		
				* Retourne si la texture est partielle ou complète *
		
				Return: true, false
		\*	--------------------------------------------------- */
		isSprite(sprite:boolean){
			if(sprite == true || sprite == false){
				this.sprite = sprite;
			}
			else{
				return this.sprite;
			}
		}

		/*	--------------------------------------------------- *\
				[function] setFixed()
		
				* Set la texture fixé à l'écran *
		
				Return: nil
		\*	--------------------------------------------------- */
		setFixed(isFixed:boolean){
			this.fixed = isFixed;
		}

		/*	--------------------------------------------------- *\
				[function] isFixed()
		
				* Check si la texture est fixé a l'écran *
		
				Return: true, false
		\*	--------------------------------------------------- */
		isFixed(){
			return this.fixed;
		}

		 /*    --------------------------------------------------- *\
	            [function] setType(type)
	    
	            * Set le type de l'element *
	    
	            Return: nil
	    \*    --------------------------------------------------- */
	    setType(type:string){
	        this.type = type;
	    }

	    /*    --------------------------------------------------- *\
	            [function] getType()
	    
	            * Retourne le type de l'element *
	    
	            Return: type
	    \*    --------------------------------------------------- */
	    getType(){
	        return this.type;
	    }

	    /*	--------------------------------------------------- *\
        		[function] isFlipped(boolean)
        
        		* Check/set si l'element est verticalement inversé *
        
        		Return: true, false
        \*	--------------------------------------------------- */
        isFlipped(value:boolean){
        	if(value == true || value == false){
                this.flipped = value;
        	}
        	else{
                return this.flipped;
        	}
        }

        /*    --------------------------------------------------- *\
                [function] setRotationPoint(x, y)
        
                * Set le point de rotation du drawable *
        
                Return: nil
        \*    --------------------------------------------------- */
        setRotationPoint(x : number, y : number){
            this.fixedToCenter = false;
            this.rotationPoint = { x: x, y: y };
        }

        /*    --------------------------------------------------- *\
                [function] getRotationPoint()
        
                * Retourne le point de rotation du drawable *
        
                Return: rotationPoint
        \*    --------------------------------------------------- */
        getRotationPoint(){
            return this.rotationPoint;
        }

        /*	--------------------------------------------------- *\
        		[function] isVisible()
        
        		* Check si le drawable est visible *
        
        		Return: true, false
        \*	--------------------------------------------------- */
        isVisible(){
			return this.visible;
        }

        /*	--------------------------------------------------- *\
        		[function] setVisibl(value)
        
        		* Set ou non le drawable en visible *
        
        		Return: nil
        \*	--------------------------------------------------- */
        setVisible(value : boolean){
			this.visible = value;
        }

        /*	--------------------------------------------------- *\
        		[function] setLayout(layout)
        
        		* Set le layout du drawable *
        
        		Return: nil
        \*	--------------------------------------------------- */
        setLayout(layout : any){
			this.layout = layout;
        }

        /*	--------------------------------------------------- *\
        		[function] setSmooth(boolean)
        
        		* Set si le drawable est smooth ou pixelated *
        
        		Return: nil
        \*	--------------------------------------------------- */
        setSmooth(value : boolean){
			this.smooth = value;
        }

        /*	--------------------------------------------------- *\
        		[function] isSmooth()
        
        		* Retourne si le drawable est smooth ou pas *
        
        		Return: true, false
        \*	--------------------------------------------------- */
        isSmooth(){
			return this.smooth;
        }

	}

	/*	--------------------------------------------------- *\
			[class] Sprite()
	
			* Crée une texture de type Sprite *
	
	\*	--------------------------------------------------- */
	export class Sprite extends Drawable{

		frameSize : any;
		frameAmount : number;
		currentFrame : number;
		currentInterval : any;
        frameLine: number;
        fps: number;
        freezed: boolean;
        loop: boolean;
        loopFinished: boolean;

		/*	--------------------------------------------------- *\
				[function] constructor(texture [optional : posX, posY, width, height, frameSizeX, frameSizeY, frameAmount, frameLine])
		
				* Quand on crée un sprite *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(texture:any, ...parameters : any[]){
			super(texture);
			this.sprite = true;
			this.currentFrame = 0;
			this.fps = 10;
            this.frameLine = parameters[7] || 0;
            this.position = { x: parameters[0], y: parameters[1] } || this.position;
            this.size = { width: parameters[2], height: parameters[3] } || this.size;
            this.frameSize = { width: parameters[4], height: parameters[5] };
            this.frameAmount = parameters[6] || 0;
            this.loop = false;
            this.loopFinished = false;


			var cache = this;
			this.currentInterval = setInterval(function(){
				var currentFrame = cache.getCurrentFrame();

				if(cache.loop){
					if (cache.loopFinished == false) {
						cache.setCurrentFrame(currentFrame += 1);
						if (currentFrame == cache.getFrameAmount() -1) {
							cache.loopFinished = true;
						}
					}
					else {
						// Animation not running cuz loop finished.
					}
				}
				else{
					cache.setCurrentFrame(currentFrame += 1);
				}

			}, 1000 / this.fps);
		}

		/*	--------------------------------------------------- *\
				[function] setFrameSize(width, height)
		
				* Set la taille d'une frame *
		
				Return: nil
		\*	--------------------------------------------------- */
		setFrameSize(width:number, height:number){
			this.frameSize = {width : width, height : height};
		}

		/*	--------------------------------------------------- *\
				[function] getFrameSize()
		
				* Retourne la taille d'une frame *
		
				Return: frameSize
		\*	--------------------------------------------------- */
		getFrameSize(){
			return this.frameSize;
		}

		/*	--------------------------------------------------- *\
				[function] setFrameAmount(frameAmount)
		
				* Set le nombre de frames dans la sprite *
		
				Return: nil
		\*	--------------------------------------------------- */
		setFrameAmount(frameAmount:number){
			this.frameAmount = frameAmount;
		}

		/*	--------------------------------------------------- *\
				[function] getFrameAmount()
		
				* Retourne le nombre de frames dans la sprite *
		
				Return: frameAmount
		\*	--------------------------------------------------- */
		getFrameAmount(){
			return this.frameAmount;
		}

		/*	--------------------------------------------------- *\
				[function] setCurrentFrame(frame)
		
				* Set la frame actuelle *
		
				Return: nil
		\*	--------------------------------------------------- */
		setCurrentFrame(frame:number){
			if(frame >= this.frameAmount){
				this.currentFrame = 0;	
			}
			else{
				this.currentFrame = frame;
			}
		}

		/*	--------------------------------------------------- *\
				[function] getCurrentFrame()
		
				* Retourne la frame actuelle *
		
				Return: frame
		\*	--------------------------------------------------- */
		getCurrentFrame():number{
			return this.currentFrame;
		}

		/*	--------------------------------------------------- *\
				[function] setFrameLine(line)
		
				* Set la ligne de la frame *
		
				Return: nil
		\*	--------------------------------------------------- */
		setFrameLine(line:number){
            this.frameLine = line;
		}

		/*	--------------------------------------------------- *\
				[function] getFrameLine()
		
				* Retourne la ligne de la frame *
		
				Return: line
		\*	--------------------------------------------------- */
		getFrameLine(){
            return this.frameLine;
		}

		/*	--------------------------------------------------- *\
				[function] setFrameSpeed(fps)
		
				* Set le nombre de frame par secondes *
		
				Return: nil
		\*	--------------------------------------------------- */
		setFrameSpeed(fps:number){
            this.fps = fps;

			var cache = this;
            clearInterval(this.currentInterval);
			this.currentInterval = setInterval(function(){
				var currentFrame = cache.getCurrentFrame();

				if(cache.loop){
					if (cache.loopFinished == false) {
						cache.setCurrentFrame(currentFrame += 1);
						if (currentFrame == cache.getFrameAmount() - 1) {
							cache.loopFinished = true;
						}
					}
					else {
						// Animation not running cuz loop finished.
					}
				}
				else{
					cache.setCurrentFrame(currentFrame += 1);
				}

			}, 1000/this.fps);
		}

		/*	--------------------------------------------------- *\
				[function] getFrameSpeed()
		
				* Retourne le nombre de frames par secondes *
		
				Return: fps
		\*	--------------------------------------------------- */
		getFrameSpeed(){
            return this.fps;
		}

        /*    --------------------------------------------------- *\
                [function] setFreeze()
        
                * Freeze la sprite sur une frame *
        
                Return: nil
        \*    --------------------------------------------------- */
        setFreeze(value : boolean){
            this.freezed = value;
            if(value){
                clearInterval(this.currentInterval);
            }
            else{
                this.setFrameSpeed(this.fps);
            }
        }

        /*	--------------------------------------------------- *\
        		[function] setUniqueLoop(boolean)
        
        		* Check/set une unique loop *
        
        		Return: true, false
        \*	--------------------------------------------------- */
        setUniqueLoop(loop:any){
			this.loop = loop;
        }

        /*	--------------------------------------------------- *\
        		[function] playUniqueLoop()
        
        		* Joue l'animation unique *
        
        		Return: nil
        \*	--------------------------------------------------- */
        playUniqueLoop(){
        	if(this.loop){
				this.loopFinished = false;
				this.setCurrentFrame(0);
        	}
        }

	}

	
	export module Draw{

		/*	--------------------------------------------------- *\
				[class] Draw()
		
				* Dessiner une forme *
		
		\*	--------------------------------------------------- */
		export class Draw extends Drawable{
			
			color: string;
			strokeSize: number;
			strokeColor: string;
			shape: string;

			/*	--------------------------------------------------- *\
					[function] constructor()
			
					* Quand on crée un Draw *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(){
				super(null);

				this.type = "draw";
				this.shape = null;
				this.strokeSize = 0;
				this.color = "#000";
			}

			/*	--------------------------------------------------- *\
					[function] setColor(hexdecimal)
			
					* Set la couleur de la forme *
			
					Return: nil
			\*	--------------------------------------------------- */
			setColor(color:string){
				this.color = color;
			}

			/*	--------------------------------------------------- *\
					[function] getColor()
			
					* Get la couleur de la forme *
			
					Return: color
			\*	--------------------------------------------------- */
			getColor(){
				return this.color;
			}

			/*	--------------------------------------------------- *\
					[function] setStrokeSize(size)
			
					* Set la taille de la bordure *
			
					Return: nil
			\*	--------------------------------------------------- */
			setStrokeSize(size: number){
				this.strokeSize = size;
			}

			/*	--------------------------------------------------- *\
					[function] getStrokeSize()
			
					* Retourne la taille de la bordure *
			
					Return: strokeSize
			\*	--------------------------------------------------- */
			getStrokeSize(){
				return this.strokeSize;
			}

			/*	--------------------------------------------------- *\
					[function] setStrokeColor(color)
			
					* Set la couleur de la bordure *
			
					Return: nil
			\*	--------------------------------------------------- */
			setStrokeColor(color:string){
				this.strokeColor = color;
			}

			/*	--------------------------------------------------- *\
					[function] getStrokeColor()
			
					* Retourne la couleur de la bordure *
			
					Return: color
			\*	--------------------------------------------------- */
			getStrokeColor(){
				return this.strokeColor;
			}

			/*	--------------------------------------------------- *\
					[function] getShape()
			
					* Retourne le type de forme *
			
					Return: shape
			\*	--------------------------------------------------- */
			getShape(){
				return this.shape;
			}




		}

		/*	--------------------------------------------------- *\
				[class] Rectangle()
		
				* Dessiner un rectangle *
		
		\*	--------------------------------------------------- */
		export class Rectangle extends Draw{

			color: string;
			
			/*	--------------------------------------------------- *\
					[function] constructor([optional : position.x, position.y, size.width, size.height, color])
			
					* Quand on crée un rectangle *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(...parameters: any[]){
				super();
				this.shape = "rectangle";

				this.position.x = parameters[0] || this.position.x;
				this.position.y = parameters[1] || this.position.y;
				this.size.width = parameters[2] || this.size.width;
				this.size.height = parameters[3] || this.size.height;
				this.color = parameters[4] || null;
				
			}
		}

		/*	--------------------------------------------------- *\
				[class] Circle()
		
				* Dessiner un cercle *
		
		\*	--------------------------------------------------- */
		export class Circle extends Draw{

			radius: number;

			/*	--------------------------------------------------- *\
					[function] constructor([optional : position.x, position.y, radius])
			
					* Quand on crée un cercle *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(...parameters: any[]){
				super();
				this.shape = "circle";

				this.position.x = parameters[0] || this.position.x;
				this.position.y = parameters[1] || this.position.y;
				this.radius = parameters[2] || this.radius;
				
			}
			
			/*	--------------------------------------------------- *\
					[function] setRadius(radius)
			
					* Set le radius du cercle *
			
					Return: nil
			\*	--------------------------------------------------- */
			setRadius(radius:number){
				this.radius = radius;
			}

			/*	--------------------------------------------------- *\
					[function] getRadius()
			
					* Retourne le radius du cercle *
			
					Return: radius
			\*	--------------------------------------------------- */
			getRadius(){
				return this.radius;
			}
		}

		/*	--------------------------------------------------- *\
				[class] Line()
		
				* Dessiner une ligne *
		
		\*	--------------------------------------------------- */
		export class Line extends Draw{

			target: any;
			
			/*	--------------------------------------------------- *\
					[function] constructor([optional : position.x, position.y, target.x, target.y])
			
					* Quand on crée une ligne *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(...parameters : any[]){
				super();

				this.target = { x: null, y: null };
				this.shape = "line";

				this.position.x = parameters[0] || this.position.x;
				this.position.y = parameters[1] || this.position.y;
				this.target.x = parameters[2] || this.target.x;
				this.target.y = parameters[3] || this.target.y;
			}

			/*	--------------------------------------------------- *\
					[function] setTarget(x, y)
			
					* Set la fin de la ligne *
			
					Return: nil
			\*	--------------------------------------------------- */
			setTarget(x : number, y : number){
				this.target = { x: x, y: y };
			}

			/*	--------------------------------------------------- *\
					[function] getTarget()
			
					* Retourne la position de la fin de la ligne *
			
					Return: target
			\*	--------------------------------------------------- */
			getTarget(){
				return this.target;
			}

		}

		/*	--------------------------------------------------- *\
				[class] Text()
		
				* Ecrire du texte *
		
		\*	--------------------------------------------------- */
		export class Text extends Draw{
			
			value: string;
			font: string;
			fontSize: number;
			fontStyle: string;
			baseLine: string;
			align: string;

			/*	--------------------------------------------------- *\
					[function] constructor([optional : position.x, position.y, texte])
			
					* Quand on ecrit du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(...parameters:any[]){
				super();
				this.shape = "text";

				this.value = "";
				this.font = "Arial";
				this.fontSize = 15;
				this.fontStyle = "normal";
				this.baseLine = "top";
				this.align = "start";


				this.position.x = parameters[0] || this.position.x;
				this.position.y = parameters[1] || this.position.y;
				this.value = parameters[2] || this.value;

			}

			/*	--------------------------------------------------- *\
					[function] getValue()
			
					* Retourne la valeur du texte *
			
					Return: value
			\*	--------------------------------------------------- */
			getValue(){
				return this.value;
			}

			/*	--------------------------------------------------- *\
					[function] setValue(value)
			
					* Set la valeur du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			setValue(value:string){
				this.value = value;
			}

			/*	--------------------------------------------------- *\
					[function] setFont(fontName)
			
					* Set la font du text *
			
					Return: nil
			\*	--------------------------------------------------- */
			setFont(fontName : string){
				this.font = fontName;
			}

			/*	--------------------------------------------------- *\
					[function] getFont()
			
					* Retourne la font du text *
			
					Return: font
			\*	--------------------------------------------------- */
			getFont(){
				return this.font;
			}

			/*	--------------------------------------------------- *\
					[function] setFontSize(size)
			
					* Set la taille du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			setFontSize(fontSize : number){
				this.fontSize = fontSize;
			}

			/*	--------------------------------------------------- *\
					[function] getfontSize()
			
					* Retourne la taille du texte *
			
					Return: fontSize
			\*	--------------------------------------------------- */
			getFontSize(){
				return this.fontSize;
			}

			/*	--------------------------------------------------- *\
					[function] setFontStyle(style)
			
					* Set le style du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			setFontStyle(style : string){
				this.fontStyle = style;
			}

			/*	--------------------------------------------------- *\
					[function] getFontStyle()
			
					* Retourne le style de la font *
			
					Return: style
			\*	--------------------------------------------------- */
			getFontStyle(){
				return this.fontStyle;
			}

			/*	--------------------------------------------------- *\
					[function] setBaseline(baseline)
			
					* Set la baseline du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			setBaseline(baseline : string){
				this.baseLine = baseline;
			}

			/*	--------------------------------------------------- *\
					[function] getBaseline()
			
					* Retourne la baseline du texte *
			
					Return: baseline
			\*	--------------------------------------------------- */
			getBaseline(){
				return this.baseLine;
			}

			/*	--------------------------------------------------- *\
					[function] setAlign(alignment)
			
					* Set l'alignement du texte *
			
					Return: nil
			\*	--------------------------------------------------- */
			setAlign(alignment : string){
				this.align = alignment;
			}

			/*	--------------------------------------------------- *\
					[function] getAlign()
			
					* Retourne l'alignement *
			
					Return: align
			\*	--------------------------------------------------- */
			getAlign(){
				return this.align;
			}
		}

		/*	--------------------------------------------------- *\
				[class] Point()
		
				* Dessine un point *
		
		\*	--------------------------------------------------- */
		export class Point extends Draw{
			
			/*	--------------------------------------------------- *\
					[function] constructor()
			
					* Quand on dessine un point *
			
					Return: nil
			\*	--------------------------------------------------- */
			constructor(x : number, y : number){
				super();

				this.setPosition(x, y);
				this.setColor("#000000");
				this.shape = "point";
				this.setStrokeSize(1);
			}
		}
	}

	/*	--------------------------------------------------- *\
			[function] setCamera()
	
			* Add une camera au Render *
	
			Return: nil
	\*	--------------------------------------------------- */
	export function setCamera(cam:any){
		renderCamera = cam;
	}

    /*    --------------------------------------------------- *\
            [function] add()
    
            * Add un element a download *
    
            Return: nil
    \*    --------------------------------------------------- */
    export function add(elementToDownload:any){
        var elementToDL = {
            element: elementToDownload,
            downloaded: false
        };

        elementsToDownload.push(elementToDL);
    }

    /*	--------------------------------------------------- *\
    		[function] setDebugMode(boolean)
    
    		* Set le mode debug *
    
    		Return: nil
    \*	--------------------------------------------------- */
    export function setDebugMode(value : boolean){
		debugMode = value;
    }

    /*	--------------------------------------------------- *\
    		[function] getWorld()
    
    		* Retourne le world *
    
    		Return: world
    \*	--------------------------------------------------- */
    export function getWorld(){
		return actualWorld;
    }

    /*	--------------------------------------------------- *\
    		[function] setWorld(world)
    
    		* Set le world *
    
    		Return: nil
    \*	--------------------------------------------------- */
    export function setWorld(world : any){
		actualWorld = world;
    }

    /*    --------------------------------------------------- *\
            [function] download()
    
            * Preload toute les images avant de commencer le jeu *
    
            Return: nil
    \*    --------------------------------------------------- */
    export function download(){
        var filesDownloaded = 0;
        for (var i = elementsToDownload.length - 1; i >= 0; i--) {
            var obj = new Image();
            obj.src = image_prefix + elementsToDownload[i].element;

            var elementName = elementsToDownload[i].element;
            obj.addEventListener("load", function() {
                for (var i = elementsToDownload.length - 1; i >= 0; i--) {
                    if(elementsToDownload[i].element == elementName){
                        elementsToDownload[i].downloaded = true;

                        // Vérifie si tous les download ne sont pas deja fini
                        for (var k = elementsToDownload.length - 1; k >= 0; k--) {
                            if(elementsToDownload[k].downloaded == true){
                                filesDownloaded += 1;
                            }
                        }

                    }
                }
                
		        // Tous les downlaod ont été effectués.
		        if(filesDownloaded == elementsToDownload.length){
		            for (var i = fToCallWhenDownloadReady.length - 1; i >= 0; i--) {
		                fToCallWhenDownloadReady[i]();
		            }
		        }
            });
        }


    }

    /*    --------------------------------------------------- *\
            [function] ready()
    
            * Fires quand toute les ressources sont téléchargés *
    
            Return: nil
    \*    --------------------------------------------------- */
    export function ready(functionToCall:any){
        fToCallWhenDownloadReady.push(functionToCall);
    }

	/*	--------------------------------------------------- *\
			Render loop
	\*	--------------------------------------------------- */
    var elementToDraw: any;

    /*	--------------------------------------------------- *\
    		[function] updateRender()
    
    		* Fonction appellé pour dispatcher le rendu *
    
    		Return: nil
    \*	--------------------------------------------------- */
    function updateRender(layer){
        
		var canvas = layer.getCanvas();
		var context = layer.getContext();
		var elements = layer.getElements();

		// Smooth
		if(!layer.isSmooth()){
			context.mozImageSmoothingEnabled = false;
			context.webkitImageSmoothingEnabled = false;
			context.msImageSmoothingEnabled = false;
			context.imageSmoothingEnabled = false;
		}

        if(context && canvas){
    		context.clearRect(0,0, canvas.width, canvas.height);


    		// Sort elements by depth
    		elements.sort(function(a, b){
				a.depth = a.depth || 0;
				b.depth = b.depth || 0;

				if (a.depth < b.depth) {
					return -1;
				}
				else if (a.depth > b.depth) {
					return 1;
				}
				else{
					return 0;
    			}
    		});

    		// Draw every elements			
    		if(elements){
    			for(var i = 0; i < elements.length; i++){

    				// Check if it's a normal drawable or a grid
                    elementToDraw = elements[i];

                    if(elementToDraw.getType() != "drawable"){
                    	switch (elementToDraw.getType()) {
                    		case "grid":
                    			var grid = elementToDraw;
	                            var tiles = grid.getTiles();
								for (var k = tiles.length - 1; k >= 0; k--) {

									//var pos = elementToDraw.getPosition();
									var posInGrid = tiles[k].getPositionIntoGrid();
									var pos = { x: posInGrid.x * grid.getTileSize(), y: posInGrid.y * grid.getTileSize() };

									elementToDraw = tiles[k].getAssignedDrawable();
									var size = elementToDraw.getSize();
									

									// Gestion de la camera
									var renderPos = { x: pos.x, y: pos.y };
									if (renderCamera) {
										var cPos = renderCamera.getPosition();
										// isFixed
										if (!elementToDraw.isFixed()) {
											renderPos.x = pos.x + ((canvas.width / 2) - cPos.x);
											renderPos.y = pos.y + ((canvas.height / 2) - cPos.y);
										}
									}

									drawElement(context, elementToDraw, renderPos, size);
								}

                    			break;
							case "draw":
								var position = elementToDraw.getPosition();
								if(!position){
									position = elementToDraw.absolutePosition;
								}
								var size = elementToDraw.getSize();
								drawElement(context, elementToDraw, position, size);
								break;
                    		
                    		default:
                    			// Draw player
	                            var assignedTexture = elementToDraw.getAssignedDrawable();
	    	                    var test = { x: 0, y: 0 };
	    	                    test.x = assignedTexture.getPosition().x;
	    	                    test.y = assignedTexture.getPosition().y;
	    						var size = assignedTexture.getSize();

	    						// Gestion de la camera
	    						var renderPos = {x : test.x, y : test.y};
	    						if(renderCamera){
	    							var cPos = renderCamera.getPosition();
	    							// isFixed
	    							if(!assignedTexture.isFixed()){
	    								renderPos.x = test.x + ((canvas.width /2 ) - cPos.x);
	    								renderPos.y = test.y + ((canvas.height /2 ) - cPos.y);
	    							}
	    						}
	    	                	drawElement(context, assignedTexture, renderPos, size);
                    			break;
                    	}

                    }
                    else{
                    	// Draw a normal drawable
                        var test = { x: 0, y: 0 };
                        test.x = elementToDraw.getPosition().x;
                        test.y = elementToDraw.getPosition().y;
    					var size = elementToDraw.getSize();



    					// Gestion de la camera
    					var renderPos = {x : test.x, y : test.y};
    					if(renderCamera){
    						var cPos = renderCamera.getPosition();
    						// isFixed
    						if(!elementToDraw.isFixed()){
    							renderPos.x = test.x + ((canvas.width /2 ) - cPos.x);
    							renderPos.y = test.y + ((canvas.height /2 ) - cPos.y);
    						}
    					}


                    	drawElement(context, elementToDraw, renderPos, size);
                    			
                    }
    			}
    		}
        }
	}
    
	function drawElement(context, elementToDraw, position, size){

		position.x = Math.floor(position.x);
		position.y = Math.floor(position.y);				

		if (position.x > -size.width  && position.x <= sX + size.width && position.y > -size.height && position.y <= sY + size.height) {
			if(elementToDraw.isVisible(null)){
				context.save();
				// opacity
				context.globalAlpha = elementToDraw.getOpacity();

				// smooth
				if(!elementToDraw.isSmooth()){
					context.mozImageSmoothingEnabled = false;
					context.webkitImageSmoothingEnabled = false;
					context.msImageSmoothingEnabled = false;
					context.imageSmoothingEnabled = false;
				}

				// flipped
				if (elementToDraw.isFlipped(null)) {
					context.scale(-1, 1);

	                position.x = -position.x - size.width;
				}
                var rotationPoint = elementToDraw.getRotationPoint();
                if (elementToDraw.fixedToCenter) {
                    rotationPoint.x = position.x + (size.width / 2);
                    rotationPoint.y = position.y + (size.height / 2);
                }

               
				if (elementToDraw.getRotation() != 0) {
					context.translate(rotationPoint.x, rotationPoint.y);
					context.rotate(elementToDraw.getRotation() * (Math.PI / 180));
					context.translate(-rotationPoint.x, -rotationPoint.y);
				}

				if(elementToDraw.getType() == "draw"){
					context.fillStyle = elementToDraw.getColor();
					if (elementToDraw.getStrokeSize() != 0) {
						context.lineWidth = elementToDraw.getStrokeSize();
						context.strokeStyle = elementToDraw.getStrokeColor();
					}
					switch (elementToDraw.getShape()) {
						case "rectangle":
							context.fillRect(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)), Math.ceil(size.width), Math.ceil(size.height));
							if(elementToDraw.getStrokeSize() != 0){
								context.strokeRect(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)), Math.ceil(size.width), Math.ceil(size.height));
							}
							break;
						case "circle":
							context.beginPath();
							context.arc(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)), elementToDraw.getRadius(), 0, 2 * Math.PI, false);
							context.closePath();
							break;
						case "line":
							context.beginPath();
							context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)));
							context.lineTo(elementToDraw.getTarget().x, elementToDraw.getTarget().y);
							context.closePath();
							break;
						case "text":
							context.textAlign = elementToDraw.getAlign();
							context.font = elementToDraw.getFontStyle() + " " + elementToDraw.getFontSize() + "px " + elementToDraw.getFont();
							context.textBaseline = elementToDraw.getBaseline();
							if(elementToDraw.getStrokeSize() != 0){
								context.strokeText(elementToDraw.getValue(), Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)));
							}
							context.fillText(elementToDraw.getValue(), Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)));
							break;
						case "point":
							context.beginPath();
							context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)) - 5, Math.ceil(rotationPoint.y - (size.height / 2)));
							context.lineTo(Math.ceil(rotationPoint.x - (size.width / 2)) + 5, Math.ceil(rotationPoint.y - (size.height / 2)));
							context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)) - 5);
							context.lineTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)) + 5);
							context.closePath();
							break;
					}
					context.fill();
					if (elementToDraw.getStrokeSize() != 0) {
						context.stroke();
					}
				}
				else{
					var futurPosition = null;
					if (elementToDraw.getRotation() != 0) {
						futurPosition = {x : rotationPoint.x - (size.width / 2), y : rotationPoint.y - (size.height / 2)};
					}
					else{
						futurPosition = position;
					}

					if (elementToDraw.getData() != false) {
						if (elementToDraw.isSprite()) {
							var currentFrame = elementToDraw.getCurrentFrame();
							var frameSize = elementToDraw.getFrameSize();
	                    	var frameLine = elementToDraw.getFrameLine();
							context.drawImage(elementToDraw.getData(), Math.ceil(frameSize.width * currentFrame), Math.ceil(frameSize.height * frameLine), Math.ceil(frameSize.width), Math.ceil(frameSize.height), Math.ceil(futurPosition.x), Math.ceil(futurPosition.y), Math.ceil(size.width), Math.ceil(size.height));
						}
						else {
							context.drawImage(elementToDraw.getData(), Math.ceil(futurPosition.x), Math.ceil(futurPosition.y), Math.ceil(size.width), Math.ceil(size.height));
						}
					}

					// Debug mode
					if(debugMode){
						context.lineWidth = 2;
						// Drawables
						context.strokeStyle = "#FF0000";
						context.beginPath();
						context.moveTo(futurPosition.x, futurPosition.y);
						context.lineTo(futurPosition.x, futurPosition.y + size.height);
						context.lineTo(futurPosition.x + size.width, futurPosition.y + size.height);
						context.lineTo(futurPosition.x + size.width, futurPosition.y);
						context.closePath();
						context.stroke();


						context.beginPath();
						context.strokeStyle = "#00FF00";
						for (var i = _elements.length - 1; i >= 0; i--) {
							if(_elements[i].aabb && _elements[i].aabb.lowerBound[0] != 0){
								var aabb = _elements[i].aabb;
								var lower = Global.getPositionFromWorld(aabb.lowerBound[0]+64, aabb.lowerBound[1]+64, cam);
								var upper = Global.getPositionFromWorld(aabb.upperBound[0]+64, aabb.upperBound[1]+64, cam);

								context.moveTo(lower.x, lower.y);
								context.lineTo(upper.x, lower.y);
								context.lineTo(upper.x, upper.y);
								context.lineTo(lower.x, upper.y);
							}
						}
						context.closePath();
						context.stroke();



					}
				}
				context.restore();

			}
		}
		else {
			return;
		}
	}


}