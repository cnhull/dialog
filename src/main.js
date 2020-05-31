// Nathan Altice
// Created: 5/13/18
// Ported to Phaser 3: 5/9/20
// Updated: 5/15/20
// Dialogging
// Simple "teletext-style" dialog example that reads from a JSON file

// BE STRIK
"use strict";


// game config
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ Title, Talking]
};

const game = new Phaser.Game(config);

// globals
const centerX = game.config.width / 2;
const centerY = game.config.height / 2;
const mod = 64;

//game.A;
//game.B;

let cursors = null;

 game.buttonConfig = {
    fontFamily: 'Courier',
    fontSize: '24px',
    strokeThickness: 1,
    //backgroundColor: '#F3B141',
    color: '#FFFFFF',
    //align: 'right',
    fixedWidth: 0
}

let fun = function(){
    console.log("hewwooo?? misteww obama???");
}

game.dec = new Set();
