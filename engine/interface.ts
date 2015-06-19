/*    --------------------------------------------------- *\
        Interface
\*    --------------------------------------------------- */
module UI{

    var fields = [];

    /*    --------------------------------------------------- *\
            [class] GUI()
    
            * Crée une GUI *
    
    \*    --------------------------------------------------- */
    export class GUI extends Render.Draw.Draw{

        childrens: any;
        parent: any;
        renderElements: any;
        events: any;
        functionsToCall: any;
        functionsToCallWhenOut: any;
        relativePosition: any;
        absolutePosition: any;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un GUI *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(){
            super();

            this.renderElements = [];
            this.parent = null;
            this.childrens = [];
            this.events = {};
            this.functionsToCall = {};
            this.functionsToCallWhenOut = {};

            // Gestion de l'absolute & relative position
            this.relativePosition = { x: 0, y: 0 };
            this.absolutePosition = { x: 0, y: 0 };

            var position = this.getPosition();
            var size = this.getSize();

            // Events
            // Click
            this.functionsToCall.click = [];
            this.functionsToCallWhenOut.click = [];
            this.events.click = new Input.Click(position.x, position.y, size.width, size.height, () => {
                for (var i = 0; i < this.functionsToCall.click.length; ++i) {
                    this.functionsToCall.click[i]();
                }
            }, () => {
                for (var z = 0; z < this.functionsToCallWhenOut.click.length; ++z) {
                    this.functionsToCallWhenOut.click[z]();
                }
            });

            // Hover
            this.functionsToCall.hover = [];
            this.events.hover = new Input.MouseMove((posX, posY) => {
                if(posX >= this.getPosition().x && posY >= this.getPosition().y && posX <= this.getPosition().x + size.width && posY <= this.getPosition().y + size.height){
                    for (var k = 0; k < this.functionsToCall.hover.length; ++k) {
                        this.functionsToCall.hover[k]();
                    }
                }
            });
        }

        /*    --------------------------------------------------- *\
                [function] setParent(parentElement)
        
                * Set un parent à l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        setParent(parentElement: any){
            this.parent = parentElement;
            this.parent.setChildren(this);
        }

        /*    --------------------------------------------------- *\
                [function] getParent()
        
                * Retourne l'element parent *
        
                Return: parent
        \*    --------------------------------------------------- */
        getParent(){
            return this.parent;
        }

        /*    --------------------------------------------------- *\
                [function] setPosition(x, y, [optional : relative (true)/ absolute (false)])
        
                * Set la position de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        setPosition(x: number, y: number, ...parameters : any[]){
            if(parameters[0] == true){
                this.relativePosition = { x: x, y: y };
            }
            else if(parameters[0] == false){
                this.absolutePosition = { x: x, y: y };
            }
            

            for (var i in this.events) {
                var position = this.getPosition(false);
                this.events[i].x = position.x;
                this.events[i].y = position.y;
            }

            // move render elements
            if(this.renderElements){
                for (var k = 0; k < this.renderElements.length; ++k) {
                    this.renderElements[k].setPosition(x, y);
                }
            }

            // childrens
            if(this.childrens){
                for (var z = this.childrens.length - 1; z >= 0; z--) {
                    var childPosition = this.childrens[z].getPosition();
                    this.childrens[z].setPosition(x + childPosition.x, y + childPosition.y, false);
                }
            }
        }

        /*    --------------------------------------------------- *\
                [function] getPosition(relative(true) /  absolute (false))
        
                * Retourne la position absolute ou relative *
        
                Return: position
        \*    --------------------------------------------------- */
        getPosition(...parameter : any[]){
            if(parameter[0] == true){
                return this.relativePosition;
            }
            else if(parameter[0] == false){
                return this.absolutePosition;
            }
            else{
                if(this.parent){
                    return this.relativePosition;
                }
                else{
                    return this.absolutePosition;
                }
            }
        }

        /*    --------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        setSize(width : number, height : number){
            this.size.width = width;
            this.size.height = height;

            for (var i in this.events) {
                this.events[i].width = width;
                this.events[i].height = height;
            }
        }

        /*    --------------------------------------------------- *\
                [function] setChildren(child)
        
                * Set un enfant a l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        setChildren(child:any){
            this.childrens.push(child);
        }

        /*    --------------------------------------------------- *\
                [function] getChildrens()
        
                * Retourne la liste des enfants *
        
                Return: childrens
        \*    --------------------------------------------------- */
        getChildrens(){
            return this.childrens;
        }

        /*    --------------------------------------------------- *\
                [function] click()
        
                * Quand l'utilisateur clique sur la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        click(functionToCall : any){
            this.functionsToCall.click.push(functionToCall);
        }

        /*    --------------------------------------------------- *\
                [function] out()
        
                * Quand l'utilisateur clique n'importe ou sauf dans la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        out(functionToCall : any){
            this.functionsToCallWhenOut.click.push(functionToCall);
        }

        /*    --------------------------------------------------- *\
                [function] hover()
        
                * Quand l'utilisateur passe la souris sur la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        hover(functionToCall : any){
            this.functionsToCall.hover.push(functionToCall);
        }

    }
    /*    --------------------------------------------------- *\
            [class] Window()
    
            * Crée une fenetre *
    
    \*    --------------------------------------------------- */
    export class Window extends GUI{

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une fenetre *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(x : number, y : number, width : number, height : number){
            super();

            this.setPosition(x, y, false);
            this.setSize(width, height);

            var position = this.getPosition();
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "rgba(0,0,0,0.1)");
            this.renderElements[0].setDepth(10);

            for (var i = 0; i < this.renderElements.length; ++i) {
                interfaceCanvas.set(this.renderElements[i]);
            }
        }
    }

    /*    --------------------------------------------------- *\
            [class] Button()
    
            * Crée un button *
    
    \*    --------------------------------------------------- */
    export class Button extends GUI{
    
        /*    --------------------------------------------------- *\
                [function] constructor(x, y, width, height, [optional : parent])
        
                * Quand on crée un button *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(x : number, y : number, width : number, height : number, ...rest : any[]){
            super();
            
            if(rest[0]){
                this.setParent(rest[0]);
                this.setPosition(x, y, true);
            }
            else{
                this.setPosition(x, y, false);
            }

            this.setSize(width, height);

            var position = this.getPosition();
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "#FF0000");
            this.renderElements[0].setDepth(10);

            for (var i = 0; i < this.renderElements.length; ++i) {
                interfaceCanvas.set(this.renderElements[i]);
            }
            
        }

    }

    /*    --------------------------------------------------- *\
            [class] Field()
    
            * Crée un input *
    
    \*    --------------------------------------------------- */
    export class Field extends GUI{
        
        value: string;
        visibleValue: string;
        placeholder: string;
        focus: boolean;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un field *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(x :number, y : number, width : number, height : number, ...rest : any[]){
            super();

            if(rest[0]){
                this.setParent(rest[0]);
                this.setPosition(x, y, true);
            }
            else{
                this.setPosition(x, y, false);
            }

            this.setSize(width, height);
            this.value = "";
            this.placeholder = "";

            // shape
            var position = this.getPosition();
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "#FF0000");
            this.renderElements[1] = new Render.Draw.Text(position.x + width/2, position.y + height/2, this.placeholder);
            this.renderElements[1].setColor("#FFFFFF");
            this.renderElements[1].setAlign("center");
            this.renderElements[1].setBaseline("middle");

            for (var i = 0; i < this.renderElements.length; ++i) {
                interfaceCanvas.set(this.renderElements[i]);
                this.renderElements[i].setDepth(10);
            }
            

            // key
            this.events.key = new Input.Key();
            this.events.key.down((key) => {
                if(this.isFocused(null)){
                    if(key == "Backspace"){
                        this.setValue(this.getValue().substring(0, this.getValue().length - 1));
                    }
                    else{
                        this.setValue(this.getValue() + key);
                    }
                }
            });

            this.click(() => {
                this.isFocused(true);
            });
            this.out(() => {
                this.isFocused(false);
            });


            // Stocker le field
            fields.push(this);

        }

        /*    --------------------------------------------------- *\
                [function] isFocused(boolean)
        
                * Check / set si l'input est focus *
        
                Return: true, false
        \*    --------------------------------------------------- */
        isFocused(bool : any){
            if(bool == true || bool == false){
                this.focus = bool;
            }
            else{
                return this.focus;
            }
        }

        /*    --------------------------------------------------- *\
                [function] setValue(value)
        
                * Set la valeur du input *
        
                Return: nil
        \*    --------------------------------------------------- */
        setValue(value:string){
            this.value = value;
            this.renderElements[1].setValue(value);
        }

        /*    --------------------------------------------------- *\
                [function] getValue()
        
                * Retourne la valeur de l'input *
        
                Return: value
        \*    --------------------------------------------------- */
        getValue(){
            return this.value;
        }


    }


    /*    --------------------------------------------------- *\
            [class] Checkbox()
    
            * Créer un checkbox *
    
    \*    --------------------------------------------------- */
    export class Checkbox extends GUI{

        checked: boolean;
        functionsToCallWhenCheck: any;
        
        /*    --------------------------------------------------- *\
                [function] constructor(x, y, width, height)
        
                * Quand on crée un checkbox *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(x : number, y : number, width : number, height : number, ...rest : any[]){
            super();

            if(rest[0]){
                this.setParent(rest[0]);
                this.setPosition(x, y, true);
            }
            else{
                this.setPosition(x, y, false);
            }
            this.setSize(width, height);

            this.checked = false;
            this.functionsToCallWhenCheck = [];

            var position = this.getPosition();
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "rgba(0,0,0,0.1)");
            this.renderElements[0].setDepth(10);
            for (var i = 0; i < this.renderElements.length; ++i) {
                interfaceCanvas.set(this.renderElements[i]);
            }

            // Event
            this.click(() => {
                if(this.isChecked()){
                    this.setCheck(false);
                }
                else{
                    this.setCheck(true);

                }

                for (var i = this.functionsToCallWhenCheck.length - 1; i >= 0; i--) {
                    this.functionsToCallWhenCheck[i](this.isChecked());
                }
            });

        }

        /*    --------------------------------------------------- *\
                [function] isChecked()
        
                * Retourne si le checkbox est checké ou non *
        
                Return: true, false
        \*    --------------------------------------------------- */
        isChecked():boolean{
            return this.checked;
        }

        /*    --------------------------------------------------- *\
                [function] setCheck(boolean)
        
                * Set le checkbox a true ou false *
        
                Return: nil
        \*    --------------------------------------------------- */
        setCheck(bool:boolean){
            this.checked = bool;
        }

        /*    --------------------------------------------------- *\
                [function] check()
        
                * Quand l'utilisateur check le checkbox *
        
                Return: nil
        \*    --------------------------------------------------- */
        check(functionToCall:any){
            this.functionsToCallWhenCheck.push(functionToCall);
        }
    }

    /*    --------------------------------------------------- *\
            [class] Label()
    
            * Crée un label *
    
    \*    --------------------------------------------------- */
    export class Label extends GUI{
        
        value: string;

        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un label *
        
                Return: nil
        \*    --------------------------------------------------- */
        constructor(x : number, y : number, text :string, ...rest : any[]){
            super();

            if(rest[0]){
                this.setParent(rest[0]);
                this.setPosition(x, y, true);
            }
            else{
                this.setPosition(x, y, false);
            }

            this.value = text;

            var position = this.getPosition();
            this.renderElements[0] = new Render.Draw.Text(position.x, position.y, this.value);
            this.renderElements[0].setDepth(10);
            for (var i = 0; i < this.renderElements.length; ++i) {
                interfaceCanvas.set(this.renderElements[i]);
            }
        }

        /*    --------------------------------------------------- *\
                [function] setValue(value)
        
                * Set la valeur du label *
        
                Return: nil
        \*    --------------------------------------------------- */
        setValue(value:string){
            this.value = value;
            this.renderElements[0].setValue(this.value);
        }

        /*    --------------------------------------------------- *\
                [function] getValue()
        
                * Retourne la valeur du label *
        
                Return: value
        \*    --------------------------------------------------- */
        getValue():string{
            return this.value;
        }
    }


    /*    --------------------------------------------------- *\
            [function] isInputEnabled()
    
            * Check si l'input sur une GUI est activé *
    
            Return: true, false
    \*    --------------------------------------------------- */
    export function isInputEnabled(){
        var focus = false;
        for (var i = fields.length - 1; i >= 0; i--) {
            if(fields[i].isFocused(null)){
                focus = true;
            }
        }

        return focus;
    }

}