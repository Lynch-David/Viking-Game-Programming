import State from '../../../lib/State.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine, sounds, timer } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import Input from '../../../lib/Input.js';
import SoundName from '../enums/SoundName.js';

export default class PauseState extends State {
    constructor() {
        super();
        this.menuOptions = ['Resume', 'Exit'];
        this.currentSelection = 0;
    }

    enter() {
        timer.pause(); // Pause the timer when entering the pause state
    }

    exit() {
        timer.resume(); // Resume the timer when exiting the pause state
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            switch (this.menuOptions[this.currentSelection]) {
                case 'Resume':
                    stateMachine.change(GameStateName.Play);
                    break;
                case 'Exit':
                    stateMachine.change(GameStateName.TitleScreen);
                    break;
            }
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

    render() {
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = '50px Alagard';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText('Paused', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

        context.font = '30px Alagard';
        this.menuOptions.forEach((option, index) => {
            context.fillStyle = this.currentSelection === index ? 'yellow' : 'white';
            context.fillText(option, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + index * 40);
        });
    }
}