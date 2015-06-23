/// <reference path="p2.d.ts" />

/// <reference path="global.ts" />
/// <reference path="../gameplay/elements.ts" />

/// <reference path="../gameplay/scene.ts" />
/// <reference path="../gameplay/camera.ts" />
/// <reference path="../gameplay/checkpoint.ts" />
/// <reference path="../gameplay/link.ts" />


/// <reference path="input.ts" />
/// <reference path="update.ts" />
/// <reference path="render.ts" />
/// <reference path="grid.ts" />
/// <reference path="interface.ts" />
/// <reference path="sounds.ts" />


/*	--------------------------------------------------- *\
		Main file
\*	--------------------------------------------------- */
var sX = window.innerWidth,
    sY = window.innerHeight;
var ratio = sX/sY;

/*    --------------------------------------------------- *\
        Global vars
\*    --------------------------------------------------- */
var world = new Scene();
var cam = new Camera(world);
cam.setPosition(sX / 2, sY / 2);


/*    --------------------------------------------------- *\
        Game
\*    --------------------------------------------------- */
var mainCanvas = new Render.Layer();
mainCanvas.setSmooth(false);
var interfaceCanvas = new Render.Layer();

Render.add("images/background1.png");
Render.add("images/background2.png");
Render.add("images/characters/jon_snow/1.png");
Render.add("images/characters/olly/1.png");
Render.add("images/logo_white.png");
Render.add("images/mute.png");
Render.add("images/checkpoint.png");
Render.add("images/torch.png");
Render.add("images/checkpoint.png");
Render.download();

Render.ready(() => {
    /*    --------------------------------------------------- *\
            Sound
    \*    --------------------------------------------------- */
    var backgroundMusic = new Sounds.Sound("sounds/background/theme.ogg");
    backgroundMusic.setVolume(0.3);
    backgroundMusic.play();
    backgroundMusic.onEnd(() => {
        backgroundMusic.play();
    });

    /*    --------------------------------------------------- *\
            Fade
    \*    --------------------------------------------------- */
    var isFade = true;
    var isFadeFinish = null;
    var fadeTimer = null;
    var fadeInterval = null;
    var fadeElement = new Render.Draw.Rectangle(0, 0, sX, sY, "#000000");
    fadeElement.setDepth(10);
    fadeElement.setOpacity(1);
    interfaceCanvas.set(fadeElement);

    /*    --------------------------------------------------- *\
            [function] fade(value, time)
    
            * Fade l'ecran  *
    
            Return: nil
    \*    --------------------------------------------------- */
    function fade(value : boolean, time : number, ...functionToCall : any[]){
        isFade = value;
        if(!isFadeFinish){
            clearTimeout(fadeTimer);
            clearInterval(fadeInterval);
        }

        isFadeFinish = false;

        if(!isFadeFinish){
            clearInterval(fadeInterval);
            fadeInterval = setInterval(() => {
                var currentOpacity = fadeElement.getOpacity();
                if(isFade){
                    if(currentOpacity < 1){
                        fadeElement.setOpacity(currentOpacity + (50 / time));    
                    }
                }
                else{
                    if(currentOpacity > 0){
                        fadeElement.setOpacity(currentOpacity - (50 / time));    
                    }
                }
            }, 50);

            fadeTimer = setTimeout(() => {
                clearInterval(fadeInterval);
                clearTimeout(fadeTimer);
                console.log("FADE END");
                isFadeFinish = true;

                if (isFade) {
                    fadeElement.setOpacity(1);
                }
                else {
                    fadeElement.setOpacity(0);
                }

                if (functionToCall[0]) {
                    functionToCall[0]();
                }
            }, time + 1000);            
        }

    }

    fade(false, 800);


    /*    --------------------------------------------------- *\
            Textures
    \*    --------------------------------------------------- */
    var textures = [];
    textures['logo'] = new Render.Texture("images/logo_white.png");
    textures['mute'] = new Render.Texture("images/mute.png");
    textures['torch'] = new Render.Texture("images/torch.png");
    textures['checkpoint'] = new Render.Texture("images/checkpoint.png");
    textures['castle_black1'] = new Render.Texture("images/background1.png");
    textures['castle_black2'] = new Render.Texture("images/background2.png");
    textures['jon_snow1'] = new Render.Texture("images/characters/jon_snow/1.png");
    textures['olly1'] = new Render.Texture("images/characters/olly/1.png");

    /*    --------------------------------------------------- *\
            Interfaces
    \*    --------------------------------------------------- */
    var interfaces = [];
    var currentPage = "menu";

    /*    --------------------------------------------------- *\
            [function] hideInterface(name)
    
            * Cache toute une interface *
    
            Return: nil
    \*    --------------------------------------------------- */
    function hideInterface(name : string){
        for (var key in interfaces) {
            if(key == name){
                for (var element in interfaces[key]) {
                    interfaces[key][element].isVisible(false);
                }
            }
        }
    }

    /*    --------------------------------------------------- *\
            [function] showInterface(name)
    
            * Affiche une interface *
    
            Return: nil
    \*    --------------------------------------------------- */
    function showInterface(name : string){
        for (var key in interfaces) {
            if(key == name){
                for (var element in interfaces[key]) {
                    interfaces[key][element].isVisible(true);
                }
            }
        }
    }

    /*    --------------------------------------------------- *\
            Interface: Menu
    \*    --------------------------------------------------- */
    interfaces['menu'] = {};
    interfaces['menu'].background = new Render.Drawable(textures['castle_black1']);
    interfaces['menu'].background.setSize(sX, sY);
    interfaces['menu'].mute = new Render.Sprite(textures['mute'],10, sY - 42,32,32,32,32,2,0);
    interfaces['menu'].mute.setFreeze(true);
    interfaces['menu'].jon_snow = new Render.Drawable(textures['jon_snow1']);
    interfaces['menu'].jon_snow.setSize(sY, sY);
    interfaces['menu'].jon_snow.setPosition(sX - (sY / 2), 0);
    interfaces['menu'].logo = new Render.Drawable(textures['logo']);
    interfaces['menu'].logo.setSize(sX/3.5, (sX/3.5)/(115/35));
    interfaces['menu'].logo.setPosition((sX /2)-(sX/3.5)/2, 10);
    interfaces['menu'].olly = new Render.Drawable(textures['olly1']);
    interfaces['menu'].olly.setSize(sY*(128/99), sY);
    interfaces['menu'].olly.setPosition(-(sY*(128/99) / 2), 0);
    interfaces['menu'].playButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].logo.getSize().height + 70, (sX/3.5), 35);
    interfaces['menu'].playButton.setValue("PLAY");
    interfaces['menu'].scoreButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].playButton.getPosition().y + 45, (sX/3.5), 35);
    interfaces['menu'].scoreButton.setValue("SCOREBOARD");
    for (var i = interfaces['menu'].scoreButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].scoreButton.getElements()[i].setOpacity(0.8);
    }
    interfaces['menu'].creditsButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].scoreButton.getPosition().y + 45, (sX/3.5), 35);
    interfaces['menu'].creditsButton.setValue("CREDITS");
    for (var i = interfaces['menu'].creditsButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].creditsButton.getElements()[i].setOpacity(0.6);
    }
    interfaces['menu'].quitButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].creditsButton.getPosition().y + 45, (sX/3.5), 35);
    interfaces['menu'].quitButton.setValue("QUIT");
    for (var i = interfaces['menu'].quitButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].quitButton.getElements()[i].setOpacity(0.4);
    }
    showInterface("menu");

    mainCanvas.set(interfaces['menu'].background);
    mainCanvas.set(interfaces['menu'].jon_snow);
    mainCanvas.set(interfaces['menu'].olly);
    mainCanvas.set(interfaces['menu'].logo);
    mainCanvas.set(interfaces['menu'].mute);



    /*    --------------------------------------------------- *\
            Menu :  Character mouvement
    \*    --------------------------------------------------- */
    var sinusValue = 0;
    var mouvementInterval = setInterval(() => {
        sinusValue = sinusValue + 0.1;
        var jonPos = interfaces['menu'].jon_snow.getPosition();
        var ollyPos = interfaces['menu'].olly.getPosition();
        interfaces['menu'].jon_snow.setPosition(jonPos.x, jonPos.y + Math.sin(sinusValue) * 0.5);
        interfaces['menu'].olly.setPosition(ollyPos.x, ollyPos.y + Math.sin(sinusValue) * 0.5);
    }, 80);


    /*    --------------------------------------------------- *\
            Menu : Mute button
    \*    --------------------------------------------------- */
    var muteEvent = new Input.Click(10, sY - 42, 32, 32, () => {
        if(currentPage == "menu"){
            if(backgroundMusic.isMute()){
                backgroundMusic.unmute();
                interfaces['menu'].mute.setCurrentFrame(0);
            }
            else{
                backgroundMusic.mute();
                interfaces['menu'].mute.setCurrentFrame(1);
            }
        }
    });

    /*    --------------------------------------------------- *\
            Menu : Button events
    \*    --------------------------------------------------- */
    interfaces['menu'].playButton.click(() => {
        if(currentPage == "menu"){
            fade(true, 800, () => {
                hideInterface("menu");
                showInterface("game");
                fade(false, 800, () => {
                    startGame();
                });            
            });
        }
    });

    /*    --------------------------------------------------- *\
            Interface :  Game
    \*    --------------------------------------------------- */
    interfaces['game'] = {};
    interfaces['game'].background = new Render.Drawable(textures['castle_black2']);
    interfaces['game'].background.setSize(sX, sX / (16/9));
    interfaces['game'].torch = new Render.Sprite(textures['torch'], sX /2 + 50, 64, 64,64, 32,32, 4, 0);
    //interfaces['game'].

    hideInterface("game");

    mainCanvas.set(interfaces['game'].background);
    mainCanvas.set(interfaces['game'].torch);




    /*    --------------------------------------------------- *\
            Game
    \*    --------------------------------------------------- */
    function startGame(){
        var links = [];
        currentPage = "game";
        var isPressing = false;
        
        var checkpoint = new Checkpoint(sX/2, sY/2, 36, textures['checkpoint']);
        var worker = new Worker('gameplay/spawnWorker.js');

        var myInterval = setInterval(() => {
            var points = [];
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                var point = {
                    position : checkpoints[i].getPosition(),
                    radius : checkpoints[i].getRadius()
                }
                points.push(point);
            }

            worker.postMessage({
                    "checkpoints" : JSON.stringify(points),
                    "screenSize" : {width : sX, height : sY}
                });
            worker.addEventListener('message', (e) => {
                if(e.data.keep){
                    var checkpoint = new Checkpoint(e.data.position.x, e.data.position.y, 36, textures['checkpoint']);   
                }
                else{
                    worker.terminate();
                    clearInterval(myInterval);
                }
            }, false);

        }, 500);

        var currentLink = null;
        var touchEvent = new Input.Touch(0, 0, sX, sY);
        touchEvent.press((posX, posY) => {
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                if(checkpoints[i].valid == false){
                    var position = checkpoints[i].getPosition();
                    var radius = checkpoints[i].getRadius();
                    var distance = Global.getDistanceBetween2Points(position.x, position.y, posX, posY);
                    if(distance <= radius){
                        isPressing = true;
                        checkpoints[i].setValid(true);
                        currentLink = new Link(position.x, position.y);
                    }
                }
            }
        });

        touchEvent.move((posX, posY) => {
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                if (checkpoints[i].valid == false) {
                    var position = checkpoints[i].getPosition();
                    var radius = checkpoints[i].getRadius();
                    var distance = Global.getDistanceBetween2Points(position.x, position.y, posX, posY);
                    currentLink.end = {
                        x : posX,
                        y : posY
                    }

                    currentLink.element.setTarget(posX, posY);

                    if (distance <= radius) {
                        isPressing = true;
                        checkpoints[i].setValid(true);
                        currentLink.setTarget(position.x, position.y);
                        links.push(currentLink);

                        currentLink = new Link(position.x, position.y);
                    }
                }
            }
        });

        touchEvent.release(() => {
            isPressing = false;
            console.log("DONE");
        });

    }



       
    Render.setCamera(cam);

});
