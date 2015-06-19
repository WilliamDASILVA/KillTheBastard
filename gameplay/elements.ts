var _elements = [];
var collisionGroups = [];
var collisionNumber = 0;

/*	--------------------------------------------------- *\
		[class] Elements()

		* Un element dans le jeu, peu importe quoi *

\*	--------------------------------------------------- */
class Elements extends p2.Body{

    haveCollision: boolean;
    backupShape: any;

    drawable : any;
    eType: string;
    datas: any[];

    canCollide: string[];
    colGroup: number;

    /*    --------------------------------------------------- *\
            [function] constructor()
    
            * Quand un element est crée *
    
            Return: nil
    \*    --------------------------------------------------- */
    constructor(){
        super({
            mass: 100,
            position: [0,0],
            velocity: [0,0],
            angle: 0,
            angularVelocity: 0,
            force: [0,0],
            angularForce: 0,
            fixedRotation: 0,
        });

        this.drawable = null;
        this.datas = [];
        this.canCollide = [];

        this.haveCollision = false;
        this.colGroup = 0;
        this.eType = "";


        _elements.push(this);
    }


    /*    --------------------------------------------------- *\
            [function] setPosition(x, y)
    
            * Set la position de l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    setPosition(x : number, y : number){
        this.position[0] = x;
        this.position[1] = y;
        
        if(this.drawable){
            this.getAssignedDrawable().setPosition(x, y);
        }
    }

    /*    --------------------------------------------------- *\
            [function] addShape(shape)
    
            * Ajoute une shape a l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    addShape(shape : any){
        shape = this.updateCollisions(shape);

        var offset = p2.vec2.fromValues(0,0);
        this.shapes      .push(shape);
        this.shapeOffsets.push(offset);
        this.updateMassProperties();
        this.aabbNeedsUpdate = true;
        this.updateBoundingRadius();
    }

    /*    --------------------------------------------------- *\
            [function] getPosition()
    
            * Retourne la position de l'element *
    
            Return: position
    \*    --------------------------------------------------- */
    getPosition(){
        return {x : this.position[0], y : this.position[1]};
    }

    /*    --------------------------------------------------- *\
            [function] assignDrawable(drawable)
    
            * Assigne un drawable à un element *
    
            Return: nil
    \*    --------------------------------------------------- */
    assignDrawable(drawable:any){
        this.drawable = drawable;
        this.drawable.setPosition(this.position[0], this.position[1]);
    }

    /*    --------------------------------------------------- *\
            [function] getAssignedDrawable()
    
            * Retourne le drawable assigné à l'element *
    
            Return: drawable
    \*    --------------------------------------------------- */
    getAssignedDrawable(){
        return this.drawable;
    }

    /*    --------------------------------------------------- *\
            [function] setType(type)
    
            * Set le type de l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    setType(eType:string){
        this.eType = eType;

        var newEntry = true;
        for (var i = collisionGroups.length - 1; i >= 0; i--) {
            if(collisionGroups[i].name == eType){
                newEntry = false;
            }
        }

        if(newEntry){
            collisionNumber++;

            var group = { name: eType, value: collisionNumber};
            collisionGroups.push(group);
        }
        this.colGroup = collisionNumber;
        //this.updateCollisions();
        
    }

    /*    --------------------------------------------------- *\
            [function] getType()
    
            * Retourne le type de l'element *
    
            Return: type
    \*    --------------------------------------------------- */
    getType(){
        return this.eType;
    }

    /*    --------------------------------------------------- *\
            [function] setData(dataName, value)
    
            * Set la data de la tile *
    
            Return: nil
    \*    --------------------------------------------------- */
    setData(dataName: string, dataValue : any){
        var data = {
            name: dataName,
            value: dataValue
        };

        this.datas.push(data);
    }

    /*    --------------------------------------------------- *\
            [function] getData(dataName)
    
            * Retourne la data d'une tile *
    
            Return: dataValue
    \*    --------------------------------------------------- */
    getData(dataName:string){
        var valueToReturn = null;
        for (var i = this.datas.length - 1; i >= 0; i--) {
            if(this.datas[i].name == dataName){
                valueToReturn = this.datas[i].value;
            }
        }

        return valueToReturn;
    }

    /*    --------------------------------------------------- *\
            [function] setMass()
    
            * Set la masse d'un element *
    
            Return: nil
    \*    --------------------------------------------------- */
    setMass(mass:number){
        this.mass = mass;
        this.updateMassProperties();
    }

    /*    --------------------------------------------------- *\
            [function] getMass()
    
            * Retourne la masse d'un element *
    
            Return: mass
    \*    --------------------------------------------------- */
    getMass(){
        return this.mass;
    }

    /*    --------------------------------------------------- *\
            [function] setFixedRotation(boolean)
    
            * Set si l'element a une rotation fixe *
    
            Return: nil
    \*    --------------------------------------------------- */
    setFixedRotation(value : boolean){
        if(value){
            this.fixedRotation = 1;
        }
        else{
            this.fixedRotation = 0;
        }
    }

    /*    --------------------------------------------------- *\
            [function] getFixedRotation()
    
            * Retourne si la rotation est fixe ou non *
    
            Return: true, false
    \*    --------------------------------------------------- */
    getFixedRotation():boolean{
        if(this.fixedRotation == 1){
            return true;
        }
        else{
            return false;
        }
    }

    /*    --------------------------------------------------- *\
            [function] enableCollision()
    
            * Active toute collision avec le monde *
    
            Return: nil
    \*    --------------------------------------------------- */
    enableCollision(){
        this.haveCollision = true;
        if(this.backupShape){
            this.addShape(this.backupShape);
        }
        this.updateBoundingRadius();
    }

    /*    --------------------------------------------------- *\
            [function] disableCollision()
    
            * Désactive toute collision avec le monde *
    
            Return: nil
    \*    --------------------------------------------------- */
    disableCollision(){
        this.haveCollision = false;
        if(!this.haveCollision){
            this.backupShape = this.shapes[0];
            this.removeShape(this.shapes[0]);
        }
        this.updateBoundingRadius();
    }

    /*    --------------------------------------------------- *\
            [function] canCollideWith(elements...)
    
            * Set la liste des elements avec lequel cet element peut avoir une collision *
    
            Return: nil
    \*    --------------------------------------------------- */
    canCollideWith(...parameters : string[]){
        if(parameters){
            for (var i = parameters.length - 1; i >= 0; i--) {
                this.canCollide.push(parameters[i]);
            }
        }

    }

    /*    --------------------------------------------------- *\
            [function] updateCollisions()
    
            * Met a jour les groupes de collision *
    
            Return: nil
    \*    --------------------------------------------------- */
    updateCollisions(shape : any){
        if(shape){

            // On va créer les collisionGroups si ils n'existent pas.
            for (var i = this.canCollide.length - 1; i >= 0; i--) {
                var exists = false;
                for (var k = collisionGroups.length - 1; k >= 0; k--) {
                    if(collisionGroups[k].name == this.canCollide[i]){
                        exists = true;
                    }
                }

                if(!exists){
                    var groupName = this.canCollide[i];
                    var newEntry = true;
                    for (var z = collisionGroups.length - 1; z >= 0; z--) {
                        if(collisionGroups[z].name == groupName){
                            newEntry = false;
                        }
                    }
                    if(newEntry){
                        collisionNumber++;
                        var group = { name: groupName, value: collisionNumber};
                        collisionGroups.push(group);
                    }
                }
            }


            for (var j = collisionGroups.length - 1; j >= 0; j--) {
                if(collisionGroups[j].name == this.getType()){
                    this.colGroup = collisionGroups[j].value;
                }
            }

            // On set le groupe auquel appartient l'element
            shape.collisionGroup = Math.pow(2, this.colGroup);
            
            // On assigne les masques de collision
            var valueToSet = 0;
            for (var i = this.canCollide.length - 1; i >= 0; i--) {
                for (var k = collisionGroups.length - 1; k >= 0; k--) {
                    if(collisionGroups[k].name == this.canCollide[i]){
                        valueToSet = valueToSet + Math.pow(2, collisionGroups[k].value);
                    }
                }
            }

            if(valueToSet != 0){
                shape.collisionMask = valueToSet;
            }


            return shape;
        }
    }


}