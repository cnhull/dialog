class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        // load assets
        this.load.path = "./assets/";

        // load JSON (dialog)
        this.load.json('dialog', 'json/dialog.json');
        this.load.json('day2', 'json/day2.json');

        // load images
        this.load.image('dialogbox', 'img/dialogbox.png');
        this.load.image('homer', 'img/homer.png');
        this.load.image('minerva', 'img/minerva.png');
        this.load.image('jove', 'img/jove.png');
        this.load.image('neptune', 'img/neptune.png');

        // load bitmap font
        this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml');
    }

    create() {

        


        // add title text
        this.add.bitmapText(centerX, centerY - 32, 'gem_font', 'THE ODYSSEY', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem_font', 'Click anywhere to begin', 16).setOrigin(0.5);
        this.clickButton = new TextButton(this, centerX, centerY, '   ', game.buttonConfig, () => {this.scene.start("talkingScene");}).setOrigin(0.5);//.setStyle(menuConfig);
        this.clickButton.setFontSize(680);


        // create input
        cursors = this.input.keyboard.createCursorKeys();


        this.clickCount = 0;
        this.clickCountText = this.add.bitmapText(100, 200, 'gem_font', '', 16);
        this.clickCountText.alpha = 0;
    
        this.testButton = new TextButton(this, 100, 100, 'Click me!', game.buttonConfig, () => this.updateClickCountText());//.setStyle(menuConfig);
        //this.clickButton.alpha = 0;
        this.add.existing(this.clickButton);
    
        this.updateClickCountText();



      }
    
      updateClickCountText() {
          if(this.clickCount > 0){
            this.clickCountText.alpha = 1;
          }
        this.clickCountText.setText(`Button has been clicked ${this.clickCount} times.`);
        this.clickCount++;
      }

    
    

    update() {
        // wait for player input
        if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.scene.start("talkingScene");
        }
    }
}
