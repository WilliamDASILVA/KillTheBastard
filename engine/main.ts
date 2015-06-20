/// <reference path="p2.d.ts" />

/// <reference path="global.ts" />
/// <reference path="../gameplay/elements.ts" />

/// <reference path="../gameplay/scene.ts" />
/// <reference path="../gameplay/camera.ts" />
/// <reference path="../gameplay/character.ts" />
/// <reference path="../gameplay/player.ts" />
/// <reference path="../gameplay/ennemy.ts" />


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
var interfaceCanvas = new Render.Layer();

Render.add("interface/img/snow_test.png");
Render.add("images/background1.png");
Sounds.add("sounds/background/theme.mp3");

Render.download();

Render.ready(() => {
    Sounds.download();
    Sounds.ready(() => {
        var myMusic = new Sounds.Sound("sounds/background/theme.mp3");
        myMusic.play();

        var background = new Render.Texture("images/background1.png");
        var snow = new Render.Drawable(background);
        snow.setSmooth(false);
        snow.setPosition(0, 0);
        snow.setSize(sX, sY);



        mainCanvas.set(snow);
        Render.setCamera(cam);
    });
});
