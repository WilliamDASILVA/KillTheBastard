/*	--------------------------------------------------- *\
		Map
\*	--------------------------------------------------- */
module Maps{

	var mapsPath = "./maps/";


	/*	--------------------------------------------------- *\
			[class] Download()
	
			* Télécharger une map *
	
	\*	--------------------------------------------------- */
	export class Download{

		functionToCallWhenReady: any;
		request: any;


		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on charge une map *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(name : string){
			this.request = new Global.XHR(mapsPath + name + "/map.json");
			this.request.ready((data) => {
				if(data.readyState == 4){
					var jsonData = JSON.parse(data.response);
					if(jsonData){
						this.functionToCallWhenReady(jsonData);
					}
				}
			});
		}

		/*	--------------------------------------------------- *\
				[function] downloaded()
		
				* Quand la map est finalement chargé *
		
				Return: nil
		\*	--------------------------------------------------- */
		downloaded(functionToCall: any){
			this.functionToCallWhenReady = functionToCall;
		}
	}


	/*	--------------------------------------------------- *\
			[class] Tile()
	
			* Créer une tile *
	
	\*	--------------------------------------------------- */
	export class Tile extends Elements{
		
		associatedTileGrid: any;

		/*	--------------------------------------------------- *\
				[function] constructor()
		
				* Quand on crée une tile *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(world : any, tileGrid : any){
			super();

			this.setMass(0);
			this.setFixedRotation(true);
			this.setType("tile");
			this.canCollideWith("player", "bullet", "ennemy");

			this.associatedTileGrid = tileGrid;

			world.addBody(this);
		}

		/*	--------------------------------------------------- *\
				[function] setCollisionType(collisionType)
		
				* Set le type de collision *
		
				Return: nil
		\*	--------------------------------------------------- */
		setCollisionType(type : string, ...direction  : string[]){
			var shape: any;

			if(type == "triangle" && direction[0]){
				var size = this.associatedTileGrid.getTileSize() / 2;
				var verts: any;
				if(direction[0] == "left"){
    				verts = [
                        [-size, size],
                        [size, -size],
                        [size, size]
                    ];
                }
                else{
                    verts = [
                        [-size, size],
                        [-size, -size],
                        [size, size]
                    ];
                }
                shape = new p2.Convex(verts);
			}
			else{
				shape = new p2.Rectangle(this.associatedTileGrid.getTileSize(), this.associatedTileGrid.getTileSize());
			}

			if(shape != null){
				this.addShape(shape);
			}

		}
	}

	/*	--------------------------------------------------- *\
			[class] Load()
	
			* Charger une map *
	
	\*	--------------------------------------------------- */
	export class Load{
		
		mapName: string;
		mapType: string;
		mapVersion: number;
		mapSpawns: any;
		mapPickups: any;
		size: any;
		mapProperties: any;

		grid: any;
		world : any

		textures: any;
		mapLayers: any;

		functionToCallWhenReady: any;

		/*	--------------------------------------------------- *\
				[function] constructor(name, gridToUse, worldToUse)
		
				* Quand on charge une map *
		
				Return: nil
		\*	--------------------------------------------------- */
		constructor(name: string, grid: any, world : any){
			this.mapSpawns = [];
			this.mapPickups = [];

			this.grid = grid;
			this.world = world;

			this.size = { width : 0, height : 0 };
			this.mapProperties = [];
			this.textures = [];
			this.mapName = name;
			this.mapLayers = [];


			var texturesToCreate = [];
			var downloadRequest = new Maps.Download(name);
			downloadRequest.downloaded((data) => {

				this.mapVersion = data.version;
				this.mapType = data.type;
				this.size = { width: data.width, height: data.height };

			    for (var x = data.layers.length - 1; x >= 0; x--) {
			        var lines = [];
			        var mapData = data.layers[x].data;
			        var totalTiles = mapData.length;

			        // On crée la "grille"
			        for (var i = 0; i < this.size.width; ++i) {
			            lines[i] = [];
			            for (var k = 0; k < this.size.height; ++k) {
			                lines[i][k] = [];
			            }
			        }
			        
			        // On rempli la grille
			        var currentLine = 0;
			        var currentColumn = 0;
			        for (var z = 0; z < totalTiles; ++z) {
			            if(currentColumn < this.size.width){
			                lines[currentColumn][currentLine] = mapData[z];
			                currentColumn++;

			            }
			            
			            if(currentColumn == this.size.width){
			                currentLine++;
			                currentColumn = 0;
			            }
			        }

			        this.mapLayers.push(lines);
			    }

			    // Getting map properties
			    var properties_path = data.tilesets[0].tileproperties;
			    for (var j = 0; j < Object.keys(properties_path).length; ++j) {
			        this.mapProperties[j] = properties_path[j];
			    }




				// On va charger le tileset & les sprites associés à la map.
			    for (var i = data.tilesets.length - 1; i >= 0; i--) {
			        if(data.tilesets[i]){
			            var tileImage = data.tilesets[i].image;
			            var txt: any;
			            txt = {};
			            txt.src = "maps/" + theMap.getName() + "/" + tileImage;
			            txt.name = "tileset";
			            Render.add(txt.src);
			            texturesToCreate.push(txt);
			            
			        }
			    }
			    
			    for (var p = data.sprites.length - 1; p >= 0; p--) {
			        if(data.sprites[p]){
			            var name = data.sprites[p].name;
			            var src = data.sprites[p].src;

			            var txt: any;
			            txt = {};
			            txt.name = "tile_" + name;
			            txt.src = "maps/" + theMap.getName() + "/" + src;

			            Render.add(txt.src);
			            texturesToCreate.push(txt);

			        }
			    }

			    for (var h = texturesToCreate.length - 1; h >= 0; h--) {
			        this.textures[texturesToCreate[h].name] = new Render.Texture(texturesToCreate[h].src);
			    }




			    // On affiche la map.
			    for (var x = this.mapLayers.length - 1; x >= 0; x--) {
					var lines: any[];
			        lines = this.mapLayers[x];
			        for (var i = lines.length - 1; i >= 0; i--) {
			            for (var k = lines[i].length - 1; k >= 0; k--) {
			                var tile = lines[i][k];

			                if(tile != 0){
			                    var theTile = new Grid.Tile(this.grid, i, k);

			                    var prop = this.getProperties()[tile - 1];
			                    if(prop.collision != "false"){
			                        
									var tileBody = new Maps.Tile(this.world, this.grid);
									tileBody.setPosition(i * this.grid.getTileSize(), k * this.grid.getTileSize());
									if(prop.collisionType == "triangle"){
										tileBody.setCollisionType("triangle", prop.collisionDirection);
									}
									else{
										tileBody.setCollisionType("rectangle", prop.collisionDirection);	
									}
									           
			                    }

			                    var tile_sprite = null;
			                    if (prop.sprite) {
			                        tile_sprite = new Render.Sprite(this.textures['tile_' + prop.sprite], 0, 0, this.grid.getTileSize(), this.grid.getTileSize(), 256, 256, 4);
			                    }
			                    else{
			                        tile_sprite = new Render.Sprite(this.textures['tileset'], 0, 0, this.grid.getTileSize(), this.grid.getTileSize(), 256, 256, 27);
			                        tile_sprite.setFreeze(true);
			                        tile_sprite.setDepth(-1);

			                        tile_sprite.setFrameLine(prop.line);
			                        tile_sprite.setCurrentFrame(prop.frame - 1);
			                    }
			                    theTile.assignDrawable(tile_sprite);          


			                    // Spawn the player at the spawner
			                    if (prop.line == 2 && prop.frame == 9) {
									var spawn = {
										x : i * this.grid.getTileSize(),
										y : k * this.grid.getTileSize()
									};
									this.mapSpawns.push(spawn);
			                    }
			                }
			            }
			        }
			    }


			    // On appelle l'event ready quand la map est totallement crée.
			    if(this.functionToCallWhenReady){
					this.functionToCallWhenReady();
			    }

			});
		}


		/*	--------------------------------------------------- *\
				[function] getName()
		
				* Retourne le nom de la map *
		
				Return: name
		\*	--------------------------------------------------- */
		getName():string{
			return this.mapName;
		}

		/*	--------------------------------------------------- *\
				[function] getType()
		
				* Retourne le type de la map *
		
				Return: type
		\*	--------------------------------------------------- */
		getType():string{
			return this.mapType;
		}

		/*	--------------------------------------------------- *\
				[function] getVersion()
		
				* Retourne la version de la map *
		
				Return: version
		\*	--------------------------------------------------- */
		getVersion():number{
			return this.mapVersion;
		}

		/*	--------------------------------------------------- *\
				[function] getSpawns()
		
				* Retourne tous les spawns de la map *
		
				Return: array
		\*	--------------------------------------------------- */
		getSpawns(){
			return this.mapSpawns;
		}

		/*	--------------------------------------------------- *\
				[function] getPickups()
		
				* Retourne tous les pickups de la map *
		
				Return: array
		\*	--------------------------------------------------- */
		getPickups(){
			return this.mapPickups;
		}

		/*	--------------------------------------------------- *\
				[function] getSize()
		
				* Retourne la taille de la map *
		
				Return: size
		\*	--------------------------------------------------- */
		getSize(){
			return this.size;
		}

		/*	--------------------------------------------------- *\
				[function] getProperties()
		
				* Retourne les propriétés de la map selon les tiles *
		
				Return: properties
		\*	--------------------------------------------------- */
		getProperties(){
			return this.mapProperties;
		}

		/*	--------------------------------------------------- *\
				[function] ready()
		
				* Quand la map est ready *
		
				Return: nil
		\*	--------------------------------------------------- */
		ready(functionToCall :any){
			this.functionToCallWhenReady = functionToCall;
		}
	}

}