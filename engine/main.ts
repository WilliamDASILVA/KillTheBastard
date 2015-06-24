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
Render.add("images/characters/sam/1.png");
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
    var backgroundMusic = new Sounds.Sound("sounds/background/castamere.mp3");
    /*backgroundMusic.setVolume(0.3);
    backgroundMusic.play();
    backgroundMusic.onEnd(() => {
        backgroundMusic.play();
    });*/

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
    textures['sam'] = new Render.Texture("images/characters/sam/1.png");

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
                    interfaces[key][element].setVisible(false);
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
                    interfaces[key][element].setVisible(true);
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
    interfaces['menu'].jon_snow = new Render.Drawable(textures['jon_snow1']);
    interfaces['menu'].jon_snow.setSize(sY, sY);
    interfaces['menu'].jon_snow.setPosition(sX - (sY / 2), 0);
    interfaces['menu'].logo = new Render.Drawable(textures['logo']);
    interfaces['menu'].logo.setSize(sX/3.5, (sX/3.5)/(115/35));
    interfaces['menu'].logo.setPosition((sX /2)-(sX/3.5)/2, 10);
    interfaces['menu'].olly = new Render.Drawable(textures['olly1']);
    interfaces['menu'].olly.setSize(sY*(128/99), sY);
    interfaces['menu'].olly.setPosition(-(sY*(128/99) / 2), 0);
    interfaces['menu'].mute = new Render.Sprite(textures['mute'],10, sY - 42,32,32,32,32,2,0);
    interfaces['menu'].mute.setFreeze(true);
    interfaces['menu'].playButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].logo.getSize().height + 70, (sX/3.5), 35);
    interfaces['menu'].playButton.setValue("PLAY");
    interfaces['menu'].scoreButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].playButton.getPosition(false).y + 45, (sX/3.5), 35);
    interfaces['menu'].scoreButton.setValue("SCOREBOARD");
    for (var i = interfaces['menu'].scoreButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].scoreButton.getElements()[i].setOpacity(0.8);
    }
    interfaces['menu'].creditsButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].scoreButton.getPosition(false).y + 45, (sX/3.5), 35);
    interfaces['menu'].creditsButton.setValue("CREDITS");
    for (var i = interfaces['menu'].creditsButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].creditsButton.getElements()[i].setOpacity(0.6);
    }
    interfaces['menu'].quitButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].creditsButton.getPosition(false).y + 45, (sX/3.5), 35);
    interfaces['menu'].quitButton.setValue("QUIT");
    for (var i = interfaces['menu'].quitButton.getElements().length - 1; i >= 0; i--) {
        interfaces['menu'].quitButton.getElements()[i].setOpacity(0.4);
    }
    showInterface("menu");

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
                startGame();
                fade(false, 800);            
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
    interfaces['game'].scoreBackground = new Render.Draw.Rectangle(0, 0, sX, 50, "#000000");
    interfaces['game'].scoreBackground.setOpacity(0.4);
    interfaces['game'].points = new Render.Draw.Text(10, 25, "POINTS:");
    interfaces['game'].points.setColor("#ffffff");
    interfaces['game'].points.setFontSize(18);
    interfaces['game'].points.setBaseline("middle");
    interfaces['game'].time = new Render.Draw.Text(sX-10, 25, "00:00");
    interfaces['game'].time.setAlign("right");
    interfaces['game'].time.setBaseline("middle");
    interfaces['game'].time.setColor("#ffffff");
    interfaces['game'].time.setFontSize(35);
    //interfaces['game'].
    hideInterface("game");


    /*    --------------------------------------------------- *\
            Game
    \*    --------------------------------------------------- */
    var gameStarted = false;
    var checkpoints = [];
    var links = [];
    var timeUpdate = null;
    var points = 0;
    var continueSpawn = true;

    /*    --------------------------------------------------- *\
            [function] startGame()
    
            * Le jeu commence *
    
            Return: nil
    \*    --------------------------------------------------- */    
    function startGame() {
        currentPage = "game";
        if (needTutorial) {
            showTutorial(true);
        }
        else {
            newGame(10000);
        }
    }
    /*    --------------------------------------------------- *\
            [function] newGame()
    
            * Commence une nouvelle partie *
    
            Return: nil
    \*    --------------------------------------------------- */
    function newGame(time : number){
        gameStarted = true;
        continueSpawn = true;
        checkpoints = [];
        links = [];
        points = 0;
        var isLimitedTime = true;

        // countdown
        var futureTime = Date.now() + time;
        timeUpdate = setInterval(() => {
            var currentTime = Date.now();
            var remainTime = new Date(futureTime - currentTime);
            if (futureTime - currentTime >= 0) {
                var seconds = "" + remainTime.getSeconds();
                var milliseconds = "" + Global.getTrunc(remainTime.getMilliseconds()/10);
                if(parseInt(seconds) <= 9){
                    seconds = "0" + seconds;
                }if(parseInt(milliseconds) <= 9){
                    milliseconds = "0" + milliseconds;
                }
                interfaces['game'].time.setValue(seconds + ":" + milliseconds);

            }
            else{
                // fin
                interfaces['game'].time.setValue("00:00");
                interfaces['game'].points.setValue("POINTS: " + points);
                continueSpawn = false;
                clearInterval(timeUpdate);
            }
        }, 80);


        // spawn the first checkpoint
        var checkpoint = new Checkpoint(sX / 2, sY / 2, 32, textures['checkpoint']);
        checkpoints.push(checkpoint);
    }

    /*    --------------------------------------------------- *\
            [function] showHUD(value)
    
            * Affiche ou cache le HUD *
    
            Return: nil
    \*    --------------------------------------------------- */
    var isHUDVisible = false;
    function showHUD(value : boolean){
        if(value){
            // Affiche
            interfaces['game'].scoreBackground.setVisible(true);
            interfaces['game'].points.setVisible(true);
            interfaces['game'].time.setVisible(true);
            isHUDVisible = true;
        }
        else{
            // Cache
            interfaces['game'].scoreBackground.setVisible(false);
            interfaces['game'].points.setVisible(false);
            interfaces['game'].time.setVisible(false);

            isHUDVisible = false;
        }
    }

    /*    --------------------------------------------------- *\
            [function] spawnCheckpoint()
    
            * Spawn un checkpoint *
    
            Return: nil
    \*    --------------------------------------------------- */
    function spawnCheckpoint(){
        if(continueSpawn){
            var pos = {
                x: Global.getRandom(32+50, sX - 32),
                y : Global.getRandom(32+50, sY - 32)
            }
            var checkpoint = new Checkpoint(pos.x, pos.y, 32, textures['checkpoint']);
            checkpoints.push(checkpoint);
        }
    }

    /*    --------------------------------------------------- *\
            Tutoriel
    \*    --------------------------------------------------- */
    interfaces['tuto'] = {};
    interfaces['tuto'].sam = new Render.Drawable(textures['sam'], -100,0, sY,sY);
    interfaces['tuto'].infobox = new UI.Window(sX / 2, 20, sX / 2-20, sY - 40);
    interfaces['tuto'].infobox_title = new UI.Label(0,0, "HELLO", interfaces['tuto'].infobox);
    hideInterface("tuto");

    /*    --------------------------------------------------- *\
            [function] showTutorial()
    
            * Affiche le tutoriel avec Sam *
    
            Return: nil
    \*    --------------------------------------------------- */
    var isTutorialShowing = false;
    var needTutorial = true;
    function showTutorial(value: boolean){
        if(value){
            showHUD(false);
            showInterface("tuto");
        }
        else{
            showHUD(true);

        }
    }



    /*    --------------------------------------------------- *\
            [function] updatePoint()
    
            * Update les points *
    
            Return: nil
    \*    --------------------------------------------------- */
    function updatePoint(){
        points++;
        interfaces['game'].points.setValue("POINTS: " + points);
    }

    /*    --------------------------------------------------- *\
            Gestion des touches
    \*    --------------------------------------------------- */
    var isPressing = false;
    var currentLink = null;
    var touchEvent = new Input.Touch(0, 0, sX, sY);
    touchEvent.press((posX, posY) => {
        if(gameStarted){
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                if(checkpoints[i].valid == false){
                    var position = checkpoints[i].getPosition();
                    var radius = checkpoints[i].getRadius();
                    var distance = Global.getDistanceBetween2Points(position.x, position.y, posX, posY);
                    if(distance <= radius){
                        isPressing = true;
                        checkpoints[i].setValid(true);
                        currentLink = new Link(position.x, position.y);
                        updatePoint();

                        spawnCheckpoint();
                    }
                }
            }            
        }
    });

    touchEvent.move((posX, posY) => {
        if(gameStarted){
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                if (checkpoints[i].valid == false) {
                    var position = checkpoints[i].getPosition();
                    var radius = checkpoints[i].getRadius();
                    var distance = Global.getDistanceBetween2Points(position.x, position.y, posX, posY);

                    if (distance <= radius) {
                        isPressing = true;
                        checkpoints[i].setValid(true);
                        currentLink.setTarget(position.x, position.y);
                        links.push(currentLink);
                        updatePoint();

                        currentLink = new Link(position.x, position.y);
                        spawnCheckpoint();

                    }
                }
            }            
        }
    });

    touchEvent.release(() => {
       /* if(gameStarted){
            isPressing = false;
            clearInterval(timeUpdate);

            // Release the touch before complete all the checkpoints => lose
            if(!haveWeWon()){
                console.log("YOU FAILLED");
            }            
        }*/
    });


    /*    --------------------------------------------------- *\
            [function] haveWeWon()
    
            * Retourne vrai faux si le joueur a gagné la partie ou non *
    
            Return: true, false
    \*    --------------------------------------------------- */
    function haveWeWon(){
        var oneMissing = false;
        for (var i = checkpoints.length - 1; i >= 0; i--) {
            if(!checkpoints[i].valid){
                oneMissing = true;
            }
        }

        return !oneMissing
    }


    /*    --------------------------------------------------- *\
            Set all the interfaces on the screen.
    \*    --------------------------------------------------- */
    for(var key in interfaces){
        for(var element in interfaces[key]){
            mainCanvas.set(interfaces[key][element]);
        }
    }
       
    Render.setCamera(cam);

});
