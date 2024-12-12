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
    /**
     * Displays a title screen where the player
     * can press enter to start a new game.
     */
    constructor() {
        super();
        this.menuOptions = ['Continue', 'New Game', 'Quit'];
        this.currentSelection = 0;
    }

    enter() {
        // Any setup code for the title screen can go here
    }

    exit() {
        // Any cleanup code for the title screen can go here
        sounds.play(SoundName.MenuBlip);
    }

    update(dt) {
        timer.update(dt);

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.Play);
        }

        if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
            this.currentSelection = (this.currentSelection - 1 + this.menuOptions.length) % this.menuOptions.length;
            sounds.play(SoundName.MenuBlip);
        }

        if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
            this.currentSelection = (this.currentSelection + 1) % this.menuOptions.length;
            sounds.play(SoundName.MenuBlip);
        }

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            switch (this.menuOptions[this.currentSelection]) {
                case 'Continue':
                case 'New Game':
                case 'Quit':
                    stateMachine.change(GameStateName.Play);
                    break;
            }
        }
    }

    render() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = '50px Alagard';
        context.fillStyle = 'Red';
        context.textAlign = 'center';
        context.fillText('ViKing', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

        context.font = '30px Alagard';
        this.menuOptions.forEach((option, index) => {
            context.fillStyle = this.currentSelection === index ? 'yellow' : 'white';
            context.fillText(option, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + index * 40);
        });
    }
}