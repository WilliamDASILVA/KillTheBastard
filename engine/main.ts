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
/// <reference path="fonts.ts" />


/*    --------------------------------------------------- *\
        Main file
\*    --------------------------------------------------- */
if(Global.isAndroid()){
    document.addEventListener("deviceready", startApp);
}
else{
    startApp();
}

/*    --------------------------------------------------- *\
        Global vars
\*    --------------------------------------------------- */
var sX = window.innerWidth,
    sY = window.innerHeight;
var ratio = sX/sY;
var world = new Scene();
var cam = new Camera(world);
cam.setPosition(sX / 2, sY / 2);

new Fonts.FontFace("unfortunate", "fonts/unfortunate.ttf");

/*    --------------------------------------------------- *\
        Game
\*    --------------------------------------------------- */
var mainCanvas = new Render.Layer();
mainCanvas.setSmooth(false);
var interfaceCanvas = new Render.Layer();
var currentPage = "splash";

/*    --------------------------------------------------- *\
        [function] startTheApp()

        * Démarre l'application quand on est prêt. *

        Return: nil
\*    --------------------------------------------------- */
function startApp(){




    Render.add("images/background1.png");
    Render.add("images/background2.png");
    Render.add("images/background4.png");
    Render.add("images/characters/jon_snow/1.png");
    Render.add("images/characters/jon_snow/dead.png");
    Render.add("images/characters/olly/1.png");
    Render.add("images/characters/olly/attack.png");
    Render.add("images/characters/sam/1.png");
    Render.add("images/logo_white.png");
    Render.add("images/mute.png");
    Render.add("images/checkpoint.png");
    Render.add("images/torch.png");
    Render.add("images/checkpoint.png");
    Render.add("images/cursor.png");
    Render.add("images/background3.png");
    Render.add("images/logo2_white.png");
    Render.download();

    Render.ready(() => {
        /*    --------------------------------------------------- *\
                Sound
        \*    --------------------------------------------------- */
        var sounds = [];
        sounds['theme'] = new Sounds.Sound("sounds/background/theme.ogg");
        sounds['castamere'] = new Sounds.Sound("sounds/background/castamere.ogg");
        sounds['stab'] = new Sounds.Sound("sounds/effects/stab2.ogg");
        sounds['ftw'] = new Sounds.Sound("sounds/effects/forthewatch2.ogg");
        sounds['theme'].setVolume(0.3);
        sounds['castamere'].setVolume(0.3);
        

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

        setTimeout(() => {
            fade(false, 800, () => {
                setTimeout(() => {
                    fade(true, 500, () => {
                        hideInterface("splash");
                        showInterface("sound");
                        currentPage = "sound";
                        fade(false, 800, () => {
                            // wait for answer.
                        });
                    });
                }, 2000);
            });            
        }, 1000);    

        /*    --------------------------------------------------- *\
                Textures
        \*    --------------------------------------------------- */
        var textures = [];
        textures['logo'] = new Render.Texture("images/logo_white.png");
        textures['splashBackground'] = new Render.Texture("images/background3.png");
        textures['creditsBackground'] = new Render.Texture("images/background4.png");
        textures['logo2'] = new Render.Texture("images/logo2_white.png");
        textures['mute'] = new Render.Texture("images/mute.png");
        textures['torch'] = new Render.Texture("images/torch.png");
        textures['checkpoint'] = new Render.Texture("images/checkpoint.png");
        textures['cursor'] = new Render.Texture("images/cursor.png");
        textures['castle_black1'] = new Render.Texture("images/background1.png");
        textures['castle_black2'] = new Render.Texture("images/background2.png");
        textures['jon_snow1'] = new Render.Texture("images/characters/jon_snow/1.png");
        textures['jon_snow2'] = new Render.Texture("images/characters/jon_snow/dead.png");
        textures['olly1'] = new Render.Texture("images/characters/olly/1.png");
        textures['olly2'] = new Render.Texture("images/characters/olly/attack.png");
        textures['sam'] = new Render.Texture("images/characters/sam/1.png");

        /*    --------------------------------------------------- *\
                Interfaces
        \*    --------------------------------------------------- */
        var interfaces = [];

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
        interfaces['menu'].background.setDepth(0);
        interfaces['menu'].jon_snow = new Render.Drawable(textures['jon_snow1']);
        interfaces['menu'].jon_snow.setSize(sY, sY);
        interfaces['menu'].jon_snow.setPosition(sX - (sY / 2), 0);
        interfaces['menu'].jon_snow.setDepth(1);
        interfaces['menu'].logo = new Render.Drawable(textures['logo']);
        interfaces['menu'].logo.setSize(sX/3.5, (sX/3.5)/(115/35));
        interfaces['menu'].logo.setPosition((sX /2)-(sX/3.5)/2, 10);
        interfaces['menu'].logo.setDepth(1);
        interfaces['menu'].olly = new Render.Drawable(textures['olly1']);
        interfaces['menu'].olly.setSize(sY*(128/99), sY);
        interfaces['menu'].olly.setPosition(-(sY*(128/99) / 2), 0);
        interfaces['menu'].olly.setDepth(1);
        interfaces['menu'].mute = new Render.Sprite(textures['mute'],10, sY - 42,32,32,32,32,2,0);
        interfaces['menu'].mute.setFreeze(true);
        interfaces['menu'].mute.setDepth(2);
        interfaces['menu'].playButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].logo.getSize().height + 70, (sX/3.5), 35);
        interfaces['menu'].playButton.setValue("PLAY");
        interfaces['menu'].playButton.setDepth(2);
        interfaces['menu'].scoreButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].playButton.getPosition(false).y + 45, (sX/3.5), 35);
        interfaces['menu'].scoreButton.setValue("HIGHSCORE");
        interfaces['menu'].scoreButton.setDepth(2);
        interfaces['menu'].scoreButton.setOpacity(0.8);
        interfaces['menu'].creditsButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].scoreButton.getPosition(false).y + 45, (sX/3.5), 35);
        interfaces['menu'].creditsButton.setValue("CREDITS");
        interfaces['menu'].creditsButton.setDepth(2);
        interfaces['menu'].creditsButton.setOpacity(0.6);
        interfaces['menu'].quitButton = new UI.Button((sX/2) - (sX/3.5)/2, interfaces['menu'].creditsButton.getPosition(false).y + 45, (sX/3.5), 35);
        interfaces['menu'].quitButton.setValue("QUIT");
        interfaces['menu'].quitButton.setDepth(2);
        interfaces['menu'].quitButton.setOpacity(0.4);
        hideInterface("menu");

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
                for (var i in sounds) {
                    if(sounds[i].isMute()){
                        sounds[i].unmute();
                        interfaces['menu'].mute.setCurrentFrame(0);
                    }
                    else{
                        sounds[i].mute();
                        interfaces['menu'].mute.setCurrentFrame(1);
                    }
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

        interfaces['menu'].creditsButton.click(() => {
            if(currentPage == "menu"){
                fade(true, 800, () => {
                    hideInterface("menu");
                    showInterface("credits");
                    fade(false, 800);

                    currentPage = "credits";
                });
            }
        });


        /*    --------------------------------------------------- *\
                Interface :  Game
        \*    --------------------------------------------------- */
        interfaces['game'] = {};
        interfaces['game'].background = new Render.Drawable(textures['castle_black2']);
        interfaces['game'].background.setSize(sX, sX / (16/9));
        interfaces['game'].background.setDepth(0);
        interfaces['game'].attacker = new Render.Sprite(textures['olly2'], sX / 2 - 192,sY / 2 - (192/2.5), 192, 192, 64, 64, 3, 0);
        interfaces['game'].attacker.setDepth(2);
        interfaces['game'].attacker.setFrameSpeed(8);
        interfaces['game'].attacker.setUniqueLoop(true);
        interfaces['game'].attacker.setCurrentFrame(0);
        interfaces['game'].jon = new Render.Sprite(textures['jon_snow2'], sX / 2 - 128, sY / 2 - (192 / 2), 192, 192, 64, 64, 2, 0);
        interfaces['game'].jon.setFreeze(true);
        interfaces['game'].jon.setDepth(1);
        interfaces['game'].torch = new Render.Sprite(textures['torch'], sX /2 + 50, 64, 64,64, 32,32, 4, 0);
        interfaces['game'].torch.setDepth(1);
        interfaces['game'].scoreBackground = new Render.Draw.Rectangle(0, 0, sX, 50, "#000000");
        interfaces['game'].scoreBackground.setDepth(2);
        interfaces['game'].scoreBackground.setOpacity(0.4);
        interfaces['game'].points = new Render.Draw.Text(10, 0, "POINTS:", 300, 50);
        interfaces['game'].points.setDepth(3);
        interfaces['game'].points.setColor("#ffffff");
        interfaces['game'].points.setFontSize(18);
        interfaces['game'].points.setVerticalAlign("middle");
        interfaces['game'].time = new Render.Draw.Text(sX-10, -17.5, "00:00", 300, 50);
        interfaces['game'].time.setDepth(3);
        interfaces['game'].time.setAlign("right");
        interfaces['game'].time.setColor("#ffffff");
        interfaces['game'].time.setFontSize(35);
        interfaces['game'].time.setVerticalAlign("middle");
        interfaces['game'].level = new Render.Draw.Text(0, 0, "LEVEL: 0", sX - 300, 50);
        interfaces['game'].level.setDepth(3);
        interfaces['game'].level.setAlign("center");
        interfaces['game'].level.setColor("#ffffff");
        interfaces['game'].level.setFontSize(18);
        interfaces['game'].level.setVerticalAlign("middle");

        interfaces['game'].results = new UI.Window(sX / 2 - (sX / 4), (sY / 2) - (sY / 4), sX / 2, sY / 2);
        interfaces['game'].results_title = new UI.Label(0, 30, sX / 2, 50, "You win", interfaces['game'].results);
        interfaces['game'].results_title.setAlign("center");
        interfaces['game'].results_title.setFont("unfortunate");
        interfaces['game'].results_title.setFontSize(12);
        interfaces['game'].results_score = new UI.Label(10, 60, sX /2, 50, "Your points: 50", interfaces['game'].results);
        interfaces['game'].results_score.setAlign("center");
        interfaces['game'].results_points = new UI.Label(10, 85, sX /2, 50, "Points to win: 45", interfaces['game'].results);
        interfaces['game'].results_points.setAlign("center");
        interfaces['game'].results_duration = new UI.Label(10, 110, sX /2, 50, "Level duration: 15:00", interfaces['game'].results);
        interfaces['game'].results_duration.setAlign("center");
        interfaces["game"].home = new UI.Button(10, sY / 2 - 17.5, 100, 35, interfaces['game'].results);
        interfaces["game"].home.setValue("Go to menu");
        interfaces["game"].next = new UI.Button(sX / 2 - 110, sY / 2 - 17.5, 100, 35, interfaces['game'].results);
        interfaces["game"].next.setValue("Next level");
        interfaces['game'].results.setOpacity(0);
                
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
        var currentLevel = 0;
        var hasLose = null;

        var levels = [
            {time : 20000, points : 35},
            {time : 15000, points : 25},
            {time : 10000, points : 15},
            {time : 5000, points : 10}
        ];

        console.log(levels);

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
                newGame(currentLevel);
            }
        }
        /*    --------------------------------------------------- *\
                [function] newGame()
        
                * Commence une nouvelle partie *
        
                Return: nil
        \*    --------------------------------------------------- */
        function newGame(selectedLevel : number){
            var level = levels[selectedLevel];
            var time = level.time;

            interfaces['game'].level.setValue("Level: " + selectedLevel);

            gameStarted = true;
            continueSpawn = true;
            checkpoints = [];
            currentPage = "game";


            links = [];
            points = 0;
            var isLimitedTime = true;

            interfaces['game'].attacker.setFreeze(true);
            interfaces['game'].attacker.setCurrentFrame(0);
            interfaces['game'].jon.setCurrentFrame(0);
            interfaces['game'].results.setOpacity(0);

            // countdown
            var futureTime = Date.now() + time;
            timeUpdate = setInterval(() => {
                var currentTime = Date.now();
                if (futureTime - currentTime >= 0) {
                    var myTime = getFormatedTime(futureTime - currentTime);
                    interfaces['game'].time.setValue(myTime.seconds + ":" + myTime.ms);

                }
                else{
                    // fin
                    checkIfWin(points, level);

                    
                }
            }, 80);


            // spawn the first checkpoint
            var checkpoint = new Checkpoint(sX / 2, sY / 2, 32, textures['checkpoint']);
            checkpoints.push(checkpoint);
        }

        /*    --------------------------------------------------- *\
                [function] checkIfWin()
        
                *  *
        
                Return: true, false
        \*    --------------------------------------------------- */
        var gameFinished = false;
        function checkIfWin(points : number, level : any){
            interfaces['game'].time.setValue("00:00");
            interfaces['game'].points.setValue("POINTS: " + points);
            continueSpawn = false;
            clearInterval(timeUpdate);

            // clear the checkpoints if have
            for (var i = checkpoints.length - 1; i >= 0; i--) {
                checkpoints[i].delete();
            };

            interfaces['game'].results_score.setValue("Your points: " + points);
            interfaces['game'].results_points.setValue("Points to win: " + level.points);
            var theTime = getFormatedTime(level.time);
            interfaces['game'].results_duration.setValue("Level duration: " + theTime.seconds + ":" + theTime.ms);

            if(points >= level.points){
                hasLose = false;
                interfaces['game'].results_title.setValue("You win");

                sounds['stab'].play();
                interfaces['game'].attacker.setFreeze(false);
                interfaces['game'].attacker.playUniqueLoop();
                setTimeout(() => {
                    interfaces['game'].jon.setCurrentFrame(1);
                    sounds['ftw'].play();
                    setTimeout(() => {
                        setTimeout(() => {
                            currentPage = "results";
                            interfaces['game'].results.setOpacity(1);
                        }, 1000);
                    }, 800);
                }, 1000);

                if(levels[currentLevel + 1] === undefined){
                    gameFinished = true;
                    interfaces['game'].next.setValue("Save to highscore");
                }
                else{
                    interfaces['game'].next.setValue("Next level");

                }
                currentLevel++;
            }
            else{
                currentPage = "results";
                interfaces['game'].results.setOpacity(1);
                interfaces['game'].results_title.setValue("You lost");
                interfaces['game'].next.setValue("Retry");
                hasLose = true;
            }

            gameStarted = false;
        }

        /*    --------------------------------------------------- *\
                [function] getFormatedTime(time)
        
                * Retourne une date formaté *
        
                Return: seconds, milliseconds
        \*    --------------------------------------------------- */
        function getFormatedTime(time : number){
            var theTime = new Date(time);
            var seconds = "" + theTime.getSeconds();
            var milliseconds = "" + Global.getTrunc(theTime.getMilliseconds()/10);
            if(parseInt(seconds) <= 9){
                seconds = "0" + seconds;
            }if(parseInt(milliseconds) <= 9){
                milliseconds = "0" + milliseconds;
            }

            return {seconds : seconds, ms : milliseconds};
        }

        /*    --------------------------------------------------- *\
                Game : Home button
        \*    --------------------------------------------------- */
        interfaces["game"].home.click(() => {
            if(currentPage == "results"){
                interfaces['game'].results.setOpacity(0);
                fade(true, 800, () => {
                    showInterface("menu");
                    hideInterface("game");
                    currentPage = "menu";
                    fade(false, 800, () => {
                        if(!sounds['theme'].isPlaying()){
                            sounds['theme'].play(); 
                        }
                                                   
                    });        
                });
            }
        });

        /*    --------------------------------------------------- *\
                Game : Next level button
        \*    --------------------------------------------------- */
        interfaces['game'].next.click(() => {
            console.log(currentPage, gameFinished);
            if(currentPage == "results"){
                if(gameFinished){
                    console.log("LOAD THE HIGHSCORE");
                }
                else{
                    interfaces['game'].results.setOpacity(0);
                    fade(true, 800, () => {
                        fade(false, 800, () => {
                            newGame(currentLevel);                    
                        })
                    });                    
                }
            }
        });

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
                interfaces['game'].level.setVisible(true);
                isHUDVisible = true;
            }
            else{
                // Cache
                interfaces['game'].scoreBackground.setVisible(false);
                interfaces['game'].points.setVisible(false);
                interfaces['game'].time.setVisible(false);
                interfaces['game'].level.setVisible(false);

                isHUDVisible = false;
            }
        }

        /*    --------------------------------------------------- *\
                [function] spawnCheckpoint()
        
                * Spawn un checkpoint *
        
                Return: nil
        \*    --------------------------------------------------- */
        function spawnCheckpoint(...position : any[]){
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
        interfaces['tuto'].sam.setDepth(6);
        interfaces['tuto'].infobox = new UI.Window(sX / 2, 20, sX / 2-20, sY / 2);
        interfaces['tuto'].infobox_title = new UI.Label(30,30, (sX /2)-60, 100,"How to play", interfaces['tuto'].infobox);
        interfaces['tuto'].infobox_title.setFontSize(15);
        interfaces['tuto'].infobox_title.setAlign("center");
        interfaces['tuto'].infobox_title.setFont("unfortunate");
        interfaces['tuto'].ok = new UI.Button(0, sY/2 + 90, sX / 2-20, 50, interfaces['tuto'].infobox);
        interfaces['tuto'].ok.setValue("I got it Sam.");
        interfaces['tuto'].text1 = new UI.Label(30, 80, (sX / 2)-60, 100, "Connect all the dots as fast as you can without releasing to kill the  bastard.", interfaces['tuto'].infobox);
        interfaces['tuto'].text1.setAlign("center");
        interfaces['tuto'].checkpoint1 = new Render.Sprite(textures['checkpoint'], sX / 2 + 10, sY / 2 + 30, 64, 64, 32, 32, 7, 0);
        interfaces['tuto'].checkpoint1.setDepth(6);
        interfaces['tuto'].checkpoint2 = new Render.Sprite(textures['checkpoint'], sX - 94, sY / 2 + 30, 64, 64, 32, 32, 7, 0);
        interfaces['tuto'].checkpoint2.setDepth(6);
        interfaces['tuto'].cursor = new Render.Drawable(textures['cursor'], sX - 94, sY / 2 + 30, 32);
        interfaces['tuto'].cursor.setDepth(6);
        hideInterface("tuto");


        /*    --------------------------------------------------- *\
                Tutoriel : Animation
        \*    --------------------------------------------------- */
        var initialPosition = {x : sX / 2 + 10 + 32, y : sY / 2 + 62};
        var futurePosition = { x: sX - 94 + 32, y: sY / 2 + 30 + 32 };
        interfaces['tuto'].cursor.setPosition(initialPosition.x, initialPosition.y);

        var animationInterval = setInterval(() => {
            var vector = { x: futurePosition.x - initialPosition.x, y: futurePosition.y - initialPosition.y };
            var currentPosition = interfaces['tuto'].cursor.getPosition();

            interfaces['tuto'].cursor.setPosition(currentPosition.x + vector.x / 20, currentPosition.y + vector.y / 20);
            if (currentPosition.x > futurePosition.x || currentPosition.y > futurePosition.y) {
                interfaces['tuto'].cursor.setPosition(initialPosition.x, initialPosition.y);
            }
        }, 80);
        


        interfaces['tuto'].ok.click(() => {
            if(currentPage == "tuto"){
                fade(true, 1000, () => {
                    hideInterface("tuto");
                    showHUD(true);
                    sounds['theme'].stop();
                    interfaces['game'].results.setOpacity(0);
                    fade(false, 800, () => {
                        currentPage = "game";
                        sounds['castamere'].play();
                        newGame(currentLevel);     
                    })    
                });     
            }
        });

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
                currentPage = "tuto";
            }
            else{
                showHUD(true);

            }
        }


        /*    --------------------------------------------------- *\
                Credits
        \*    --------------------------------------------------- */
        interfaces['credits'] = {};
        interfaces['credits'].background = new Render.Drawable(textures['creditsBackground'], 0, 0, sX, sY);
        interfaces['credits'].background.setDepth(-1);
        interfaces['credits'].label1   = new Render.Draw.Text((sX/2 - 200), 0.1*sY, "A GAME BY", 400, 50);
        interfaces['credits'].label1.setColor("#FFFFFF");
        interfaces['credits'].label1.setAlign("center");
        interfaces['credits'].label2   = new Render.Draw.Text((sX/2 - 200), 0.18*sY, "WILLIAM DA SILVA", 400, 50);
        interfaces['credits'].label2.setColor("#FFFFFF");
        interfaces['credits'].label2.setAlign("center");
        interfaces['credits'].label2.setFontSize(30);
        interfaces['credits'].label3   = new Render.Draw.Text((sX/2 - 200), 0.25*sY, "www.williamdasilva.fr", 400, 50);
        interfaces['credits'].label3.setColor("#FFFFFF");
        interfaces['credits'].label3.setAlign("center");
        interfaces['credits'].label3.setFontSize(20);
        interfaces['credits'].label4   = new Render.Draw.Text((sX/2 - 200), 0.35*sY, "SOUND EFFECTS", 400, 50);
        interfaces['credits'].label4.setColor("#FFFFFF");
        interfaces['credits'].label4.setAlign("center");
        interfaces['credits'].label4.setFontSize(30);
        interfaces['credits'].label5   = new Render.Draw.Text((sX/2 - 200), 0.42*sY, "'For the watch' - Edited", 400, 50);
        interfaces['credits'].label5.setColor("#FFFFFF");
        interfaces['credits'].label5.setAlign("center");
        interfaces['credits'].label5.setFontSize(18);
        interfaces['credits'].label6   = new Render.Draw.Text((sX/2 - 200), 0.47*sY, "Home Box Office, 2015", 400, 50);
        interfaces['credits'].label6.setColor("#FFFFFF");
        interfaces['credits'].label6.setAlign("center");
        interfaces['credits'].label6.setFontSize(13);
        interfaces['credits'].label7   = new Render.Draw.Text((sX/2 - 200), 0.52*sY, "'Stab' - Edited", 400, 50);
        interfaces['credits'].label7.setColor("#FFFFFF");
        interfaces['credits'].label7.setAlign("center");
        interfaces['credits'].label7.setFontSize(18);
        interfaces['credits'].label8   = new Render.Draw.Text((sX/2 - 200), 0.57*sY, "Home Box Office, 2015", 400, 50);
        interfaces['credits'].label8.setColor("#FFFFFF");
        interfaces['credits'].label8.setAlign("center");
        interfaces['credits'].label8.setFontSize(13);
        interfaces['credits'].label9   = new Render.Draw.Text((sX/2 - 200), 0.63*sY, "SOUNDTRACK", 400, 50);
        interfaces['credits'].label9.setColor("#FFFFFF");
        interfaces['credits'].label9.setAlign("center");
        interfaces['credits'].label9.setFontSize(30);
        interfaces['credits'].label10   = new Render.Draw.Text((sX/2 - 200), 0.70*sY, "'Game of Thrones 8bit'", 400, 50);
        interfaces['credits'].label10.setColor("#FFFFFF");
        interfaces['credits'].label10.setAlign("center");
        interfaces['credits'].label10.setFontSize(18);
        interfaces['credits'].label11   = new Render.Draw.Text((sX/2 - 200), 0.75*sY, "FloatingPointMusic, 2012", 400, 50);
        interfaces['credits'].label11.setColor("#FFFFFF");
        interfaces['credits'].label11.setAlign("center");
        interfaces['credits'].label11.setFontSize(13);
        interfaces['credits'].label12   = new Render.Draw.Text((sX/2 - 200), 0.80*sY, "'Rains of Castamere 8bit'", 400, 50);
        interfaces['credits'].label12.setColor("#FFFFFF");
        interfaces['credits'].label12.setAlign("center");
        interfaces['credits'].label12.setFontSize(18);
        interfaces['credits'].label13   = new Render.Draw.Text((sX/2 - 200), 0.85*sY, "FloatingPointMusic, 2012", 400, 50);
        interfaces['credits'].label13.setColor("#FFFFFF");
        interfaces['credits'].label13.setAlign("center");
        interfaces['credits'].label13.setFontSize(13);
        interfaces['credits'].back = new UI.Button(sX - 160, sY - 45, 150, 35);
        interfaces['credits'].back.setValue("Back to menu");
        hideInterface("credits");

        /*    --------------------------------------------------- *\
                Back button
        \*    --------------------------------------------------- */
        interfaces['credits'].back.click(() => {
            if(currentPage == "credits"){
                fade(true, 800, () => {
                    currentPage = "menu";
                    hideInterface("credits");
                    showInterface("menu");
                    sounds['theme'].play();
                    fade(false, 800);
                });
            }
        });

        

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
        var hasPressedFirstTime = false;
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
                            hasPressedFirstTime = true;
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
            if(gameStarted && isPressing){
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
            if(gameStarted && hasPressedFirstTime){
                isPressing = false;
                clearInterval(timeUpdate);

                checkIfWin(points, levels[currentLevel]);
                hasPressedFirstTime = false;        
            }
        });


        /*    --------------------------------------------------- *\
                Splashscreen
        \*    --------------------------------------------------- */
        interfaces['splash'] = {}
        interfaces['splash'].background = new Render.Drawable(textures['splashBackground'], 0,0, sX, sY);
        interfaces['splash'].logo = new Render.Drawable(textures['logo2'], (sX/2) - ((sX / 2)/2), (sY/2)-((sX/2) / (247/106))/2, sX / 2, (sX/2) / (247/106));
        interfaces['splash'].logo.setDepth(1);
        interfaces['splash'].label = new Render.Draw.Text((sX/2) - ((sX / 2)/2), (sY/2)-((sX/2) / (247/106))/2 - 50, "A GAME BY", sX / 2, (sX/2) / (247/106));
        interfaces['splash'].label.setDepth(2);
        interfaces['splash'].label.setColor("#ffffff");
        interfaces['splash'].label.setAlign("center");
        interfaces['splash'].label.setFontSize(20);

        /*    --------------------------------------------------- *\
                Sound screen
        \*    --------------------------------------------------- */
        interfaces['sound'] = {}
        interfaces['sound'].background = new Render.Drawable(textures['splashBackground'], 0,0, sX, sY);
        interfaces['sound'].label = new Render.Draw.Text((sX/2) - ((sX / 2)/2), (sY/2) - 50, "DO YOU WANT TO ENABLE THE SOUND ?", sX / 2, (sX/2) / (247/106));
        interfaces['sound'].label.setDepth(2);
        interfaces['sound'].label.setColor("#ffffff");
        interfaces['sound'].label.setAlign("center");
        interfaces['sound'].label.setFontSize(18);
        interfaces['sound'].no = new UI.Button((sX/2) - ((sX / 2)/2), (sY/2) + 17.5, 150, 35);
        interfaces['sound'].no.setValue("No");
        interfaces['sound'].yes = new UI.Button((sX/2) - ((sX / 2)/2) + sX /2 - 150, (sY/2)+ 17.5, 150, 35);
        interfaces['sound'].yes.setValue("Yes");
        hideInterface("sound");


        /*    --------------------------------------------------- *\
                Sound choice
        \*    --------------------------------------------------- */
        interfaces['sound'].yes.click(() => {
            if(currentPage == "sound"){
                Sounds.setEnabled(true);
                fade(true, 500, () => {
                    hideInterface("sound");
                    showInterface("menu");
                    currentPage = "menu";                    
                    sounds['theme'].play();
                    fade(false, 800);
                });
            }
        });

        interfaces['sound'].no.click(() => {
            if(currentPage == "sound"){
                Sounds.setEnabled(false);
                fade(true, 500, () => {
                    hideInterface("sound");
                    showInterface("menu");
                    currentPage = "menu";
                    fade(false, 800);
                });
            }
        });


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
}