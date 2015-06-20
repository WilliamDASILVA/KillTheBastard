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
var canvas = document.getElementsByTagName("canvas")[0];
if(canvas){
	var context = canvas.getContext("2d");
}
else{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	document.appendChild(canvas);	
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var sX = canvas.width,
    sY = canvas.height,
    ratio = canvas.width/canvas.height;

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
var debugCanvas = new Render.Layer();
var interfaceCanvas = new Render.Layer();

Render.add("interface/img/snow_test.png");
Sounds.add("sounds/background/theme.mp3");

Render.download();

Render.ready(() => {
    Sounds.download();
    Sounds.ready(() => {
        
        
    });
});
