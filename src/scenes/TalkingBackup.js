class TalkingBackup extends Phaser.Scene {
    constructor() {
        super("talkingScene");

        // dialog constants
        this.DBOX_X = 0;			    // dialog box x-position
        this.DBOX_Y = 400;			    // dialog box y-position
        this.DBOX_FONT = 'gem_font';	// dialog box font key

        this.TEXT_X = 50;			// text w/in dialog box x-position
        this.TEXT_Y = 445;			// text w/in dialog box y-position
        this.TEXT_SIZE = 24;		// text font size (in pixels)
        this.TEXT_MAX_WIDTH = 715;	// max width of text within box

        this.NEXT_TEXT = '[SPACE]';	// text to display for next prompt
        this.NEXT_X = 775;			// next text prompt x-position
        this.NEXT_Y = 574;			// next text prompt y-position

        this.LETTER_TIMER = 10;		// # ms each letter takes to "type" onscreen

        // dialog variables
        this.convo = 0;			// current "conversation" array
        this.line = 0;			// current line of conversation
        this.speaker = null;		// current speaker
        this.lastSpeaker = null;	// last speaker
        this.typing = false;		// flag to lock player input while text is "typing"
        this.displayText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing

        // character variables
        this.homer = null;
        this.minerva = null;
        this.neptune = null;
        this.jove = null;
        this.tweenDuration = 500;

        this.temp = null;
        this.num = null;

        this.OFFSCREEN_X = -500;        // x,y values to place characters offscreen
        this.OFFSCREEN_Y = 1000;

    }

    create() {
        // parse dialog from JSON file
        //this.dialog = this.cache.json.get('dialog');
        this.dialog = this.cache.json.get('dialog');
        //console.log(this.dialog);


        // add dialog box sprite
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0);

        // initialize dialog text objects (with no text)
        this.displayText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);

        this.clickButton = new TextButton(this, this.NEXT_X, this.NEXT_Y, '[CLICK]',  game.buttonConfig, () => this.checkType()).setOrigin(1);//.setStyle(menuConfig);
        this.clickButton.alpha = 0;
        this.add.existing(this.clickButton);

        this.buttonA = new TextButton(this, centerX, centerY - 2*mod, '', game.buttonConfig, () => this.gotoChoice("A")).setOrigin(0.5, 0.5);
        this.buttonA.alpha = 0;
        this.add.existing(this.buttonA);
        this.buttonB = new TextButton(this, centerX, centerY , '', game.buttonConfig, () => this.gotoChoice("B")).setOrigin(0.5, 0.5);
        this.buttonB.alpha = 0;
        this.add.existing(this.buttonB);

        // ready the character dialog images offscreen
        this.homer = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'homer').setOrigin(0, 1);
        this.minerva = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'minerva').setOrigin(0, 1);
        this.neptune = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'neptune').setOrigin(0, 1);
        this.jove = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'jove').setOrigin(0, 1);

        // input
        cursors = this.input.keyboard.createCursorKeys();

        // start dialog
        this.checkType();
        //this.typeText();
    }

    update() {
        // check for spacebar press
        if(Phaser.Input.Keyboard.JustDown(cursors.space) && !this.typing) {
            // trigger dialog
            //this.typeText();
        }
    }

    printText(scene){
        let hold = this.whatever.scenes[scene];

        this.typing = true;

        // clear text
        this.displayText.text = '';
        this.nextText.text = '';
        this.clickButton.alpha = 0;

        this.displayText.text = hold.dialog;


    }



    checkType(){
        this.num = this.dialog[this.convo][this.line]['num']
        this.temp = this.dialog[this.convo][this.line]['type']
        console.log(this.num);

       if(this.temp == "conv"){
           console.log("temp is: " + this.temp);
           if(!this.typing) {
                // trigger dialog
                this.typeText();
            }
       }
       else if (this.temp == "choice"){
           this.buttonA.text = this.dialog[this.convo][this.line]['choiceA']
           console.log(this.buttonA.text);
           this.buttonB.text  = this.dialog[this.convo][this.line]['choiceB']
           console.log(this.buttonB.text);
           this.buttonA.alpha = 1;
           this.buttonB.alpha = 1;
           console.log("temp is: " + this.temp);
        }
    }

    gotoChoice(val){
        if(val == "A"){
            console.log("chose A");
        }
        if(val == "B"){
            console.log("choseB");
        }
        console.log("choice made " + val)
        this.buttonA.alpha = 0;
        this.buttonB.alpha = 0;
    }

    typewriter(lines){
            // create a timer to iterate through each letter in the dialog text
            console.log("omae wa mou... shindeiru");
            let currentChar = 0; 
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: lines.length - 1,
                callback: () => { 
                    // concatenate next letter from lines
                    this.displayText.text += lines[currentChar];
                    // advance character position
                    currentChar++;
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.clickButton.alpha = 1;
                        //this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
                        // un-lock input
                        this.typing = false;
                        // destroy timer
                        this.textTimer.destroy();
                    }
                },
                callbackScope: this // keep Scene context
            });        
    }

    checkSpeaker(){
        // check if there's a new speaker (for exit/enter animations)
        if(this.dialog[this.convo][this.line]['newSpeaker']) {
            console.log(this.convo + " " + " " + this.line + " " + [this.convo][this.line]);
            // tween out prior speaker's image
            if(this.lastSpeaker) {
                this.fadeOut();
            }
            // tween in new speaker's image
            this.fadeIn();
        }
    }

    fadeIn(){
        this.tweens.add({
            targets: this[this.speaker],
            alpha: 1,
            x: this.DBOX_X + 50,
            duration: this.tweenDuration,
            ease: 'Linear'
        });
    }

    fadeOut(){
        this.tweens.add({
            targets: this[this.lastSpeaker],
            alpha: 0,
            x: this.OFFSCREEN_X,
            duration: this.tweenDuration,
            ease: 'Linear'
        });        
    }



    typeText() {
        
        
        // lock input while typing
        this.typing = true;

        // clear text
        this.displayText.text = '';
        this.nextText.text = '';
        this.clickButton.alpha = 0;

        


        /* Note: In my conversation data structure: 
                - each array within the main JSON array is a "conversation"
                - each object within a "conversation" is a "line"
                - each "line" can have 3 properties: 
                    1. a speaker
                    2. the dialog text
                    3. an (optional) flag indicating if this speaker is new
        */

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.line > this.dialog[this.convo].length - 1) {
            this.line = 0;
            // I increment conversations here, but you could create logic to exit the dialog here
            this.convo++;
        }
        
        // make sure we haven't run out of conversations...
        if(this.convo >= this.dialog.length) {
            // here I'm simply "exiting" the last speaker and removing the dialog box,
            // but you could build other logic to change game states here
            console.log('End of Conversations');
            // tween out prior speaker's image
            if(this.lastSpeaker) {
                this.fadeOut();
            }
            // make text box invisible
            this.dialogbox.visible = false;

        } else {
            // if not, set current speaker
            this.speaker = this.dialog[this.convo][this.line]['speaker'];
            console.log(this.speaker);
            this.checkSpeaker();


            // build dialog (concatenate speaker + line of text)
            this.lines = this.dialog[this.convo][this.line]['speaker'].toUpperCase() + ': ' + this.dialog[this.convo][this.line]['dialog'];

            this.typewriter(this.lines);
            // // create a timer to iterate through each letter in the dialog text

            
            // set bounds on dialog
            this.displayText.maxWidth = this.TEXT_MAX_WIDTH;

            // increment dialog line
            this.line++;

            // set past speaker
            this.lastSpeaker = this.speaker;
            
        }
    }
}