/*    --------------------------------------------------- *\
        Grid
\*    --------------------------------------------------- */
module Grid{

    /*    --------------------------------------------------- *\
            [class] Grid()
    
            * Crée une grille *
    
    \*    --------------------------------------------------- */
    export class Grid{
        
        position: any;
        size: any;
        parentScene: any;
        tileSize: number;
        table: any;
        tiles: any;
        type: string;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor( width : number, height : number, tileSize : number, scene : any){
            this.position = { x: 0, y: 0 };
            this.size = { width: width, height: height };
            this.parentScene = scene;
            this.tiles = [];
            this.type = "grid";
            this.tileSize = tileSize;
            this.table = [];

            // Pregenerate the grid
            for (var i = 0; i < Math.ceil(this.size.width / this.tileSize); ++i) {
                this.table[i] = [];
                for (var k = 0; k < Math.ceil(this.size.height / this.tileSize); ++k) {
                    this.table[i][k] = [];
                }
            }

        }

        /*    --------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        setSize(width: number, height : number){
            this.size = { width: width, height: height };
        }

        /*    --------------------------------------------------- *\
                [function] getSize()
        
                * Get la taille de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        getSize(){
            return this.size;
        }

        /*    --------------------------------------------------- *\
                [function] setTileSize()
        
                * Set la taille des tiles *
        
                Return: nil
        \*    --------------------------------------------------- */
        setTileSize(tileSize : number){
            this.tileSize = tileSize;
        }

        /*    --------------------------------------------------- *\
                [function] getTileSize()
        
                * Retourne la taille d'une tile *
        
                Return: tileSize
        \*    --------------------------------------------------- */
        getTileSize(){
            return this.tileSize;
        }

        /*    --------------------------------------------------- *\
                [function] getTiles()
        
                * Retourne toute les tiles *
        
                Return: tiles
        \*    --------------------------------------------------- */
        getTiles(){
            return this.tiles;
        }

        /*    --------------------------------------------------- *\
                [function] addTile(tile)
        
                * Ajoute une tile a la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        addTile(tile:any){
            // Set la tile dans la table
            var pos = tile.getPositionIntoGrid();
            if(!this.table[pos.x]){
                this.table[pos.x] = [];
            }

            if(!this.table[pos.x][pos.y]){
                this.table[pos.x][pos.y] = [];
            }


            this.table[pos.x][pos.y] = tile;
            this.tiles.push(tile);
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

        /*    --------------------------------------------------- *\
                [function] getTileFromPosition(posX, posY, relativeToTheGrid)
        
                * Retourne la tile correspondant a la tuile *
        
                Return: true, false
        \*    --------------------------------------------------- */
        getTileFromPosition(posX : number, posY : number, relativeToTheGrid : boolean){
            if(relativeToTheGrid){
                // On cherche la tile avec les positions relatives a la grille
                var tile = this.table[posX][posY];
                if(tile){
                    return tile;
                }
                else{
                    return false;
                }
            }
            else{
                // Position absolue
                var origin = this.getPosition();
                var tileSize = this.getTileSize();

                for (var x = this.table.length - 1; x >= 0; x--) {
                    for (var y = this.table[x].length - 1; y >= 0; y--) {
                        var realPos = {
                            x : origin.x + (tileSize * x),
                            y : origin.y + (tileSize * y)
                        }

                        if(posX >= realPos.x && posX <= realPos.x + tileSize && posY >= realPos.y && posY <= realPos.y + tileSize){
                            var supposedTile = this.table[realPos.x / tileSize][realPos.y / tileSize];
                            return {
                                tile : supposedTile,
                                gridPos : {
                                    x : realPos.x / tileSize,
                                    y : realPos.y / tileSize
                                }
                            };
                        }
                    }
                }

            }
        }


        /*    --------------------------------------------------- *\
                [function] getPosition()
        
                * Retourne la position de la grille *
        
                Return: position
        \*    --------------------------------------------------- */
        getPosition(){
            return this.position;
        }

        /*    --------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set la position de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        setPosition(x : number, y : number){
            this.position = { x: x, y: y };
        }

    }


    /*    --------------------------------------------------- *\
            [class] Tile()
    
            * Crée une tile *
    
    \*    --------------------------------------------------- */
    export class Tile extends Elements{

        parentGrid: any;
        gridPos: any;
        
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une tile *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(parentGrid : any, x : number, y : number){
            super();

            this.parentGrid = parentGrid;
            this.eType = "tile";
            this.gridPos = { x: x, y: y };

            this.parentGrid.addTile(this);
        }

        /*    --------------------------------------------------- *\
                [function] getParentGrid()
        
                * Retourne la grille parente *
        
                Return: grid
        \*    --------------------------------------------------- */
        getParentGrid(){
            return this.parentGrid;
        }

        /*    --------------------------------------------------- *\
                [function] getPositionIntoGrid()
        
                * Retourne la position de la tile dans la grille *
        
                Return: position
        \*    --------------------------------------------------- */
        getPositionIntoGrid(){
            return this.gridPos;
        }

    }
}