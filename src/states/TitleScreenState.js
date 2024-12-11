import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import GameStateName from '../enums/GameStateName.js';
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    input,
    stateMachine,
    timer,
} from '../globals.js';

export default class TitleScreenState extends State {
    /**
     * Displays a title screen where the player
     * can press enter to start a new game.
     */
    constructor() {
        super();
    }

    enter() {
        // Any setup code for the title screen can go here
    }

    exit() {
        // Any cleanup code for the title screen can go here
    }

    update(dt) {
        timer.update(dt);

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.Play);
        }
    }

    render() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = '30px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText('Press Enter to Play', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}