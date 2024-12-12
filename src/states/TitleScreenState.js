import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    input,
    stateMachine,
    timer,
    sounds,
} from '../globals.js';

export default class TitleScreenState extends State {
    constructor() {
        super();
        this.menuOptions = ['Continue', 'New Game', 'Quit'];
        this.currentSelection = 0;
        this.blinking = false;
        this.blinkState = true;
    }

    enter() {
        sounds.play(SoundName.TitleMusic);
    }

    exit() {
        sounds.stop(SoundName.TitleMusic);
    }

    update(dt) {
        timer.update(dt);

        if (this.blinking) {
            return;
        }

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            sounds.play(SoundName.MenuBlip);
            this.startBlinking();
        }

        if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
            this.currentSelection = (this.currentSelection - 1 + this.menuOptions.length) % this.menuOptions.length;
            sounds.play(SoundName.MenuBlip);
        }

        if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
            this.currentSelection = (this.currentSelection + 1) % this.menuOptions.length;
            sounds.play(SoundName.MenuBlip);
        }
    }

    startBlinking() {
        this.blinking = true;
        this.blinkState = true;

        timer.addTask(() => {
            this.blinkState = !this.blinkState;
        }, 0.2, 20); // Blink every 0.1 seconds for 1 second (10 times)

        timer.addTask(() => {
            this.blinking = false;
            this.proceed();
        }, 2); // Proceed after 1 second
    }

    proceed() {
        switch (this.menuOptions[this.currentSelection]) {
            case 'Continue':
                stateMachine.change(GameStateName.Play);
                break;
            case 'New Game':
                stateMachine.change(GameStateName.Play);
                break;
            case 'Quit':
                stateMachine.change(GameStateName.TitleScreen);
                break;
        }
    }

    render() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.strokeStyle = '#47474f';
        context.lineWidth = 5;
        context.strokeRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 12, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 4);

        context.fillStyle = '#121212';
        // context.lineWidth = 5;
        context.fillRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2.5, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 2.5);

        context.strokeStyle = '#47474f';
        // context.lineWidth = 5;
        context.strokeRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2.5, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 2.5);
        
    
        context.font = '50px Alagard';
        context.fillStyle = 'Red';
        context.textAlign = 'center';
        context.fillText('ViKing', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

        context.textAlign = 'left';

        context.font = '25px Alagard';
        this.menuOptions.forEach((option, index) => {
            if (this.blinking && this.currentSelection === index) {
                context.fillStyle = this.blinkState ? 'yellow' : 'black';
            } else {
                context.fillStyle = this.currentSelection === index ? 'yellow' : 'white';
            }
            context.fillText(option, CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + index * 40);
        });
    }
}