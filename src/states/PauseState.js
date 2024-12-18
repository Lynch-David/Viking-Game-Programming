import State from '../../../lib/State.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine, sounds, timer } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import Input from '../../../lib/Input.js';
import Easing from '../../../lib/Easing.js';

export default class PauseState extends State {
    constructor() {
        super();
        this.menuOptions = ['Resume', 'Save & Exit'];
        this.currentSelection = 0;
        this.textAlpha = { alpha: 1 };
        this.textPosition = { x: -CANVAS_WIDTH }; // Start text off-screen to the left
    }

    async enter(parameters) {
        this.playState = parameters.playState; // Assign the playState from parameters
        this.player = parameters.player; // Assign the player from parameters
        // timer.pause(); // Pause the timer when entering the pause state
        // console.log('Entering PauseState, starting fadeInText');
        await this.fadeInText(); // Tween in the text
    }

    async exit() {
        if (this.player) {
            this.savePlayerState(this.player);
        }
        // console.log('Exiting PauseState, starting fadeOutText');
        await this.fadeOutText(); // Tween out the text
        timer.resume(); // Resume the timer when exiting the pause state
    }

    savePlayerState(player) {
        const playerState = {
            x: player.position.x,
            y: player.position.y,
            hopCount: this.player.hopCount, // Save hop count
            state: player.stateMachine.currentState.name,
        };
        localStorage.setItem('playerState', JSON.stringify(playerState));
    }

    async fadeInText() {
        // console.log('Starting fadeInText tween');
        // await timer.tweenAsync(this.textAlpha, { alpha: 1 }, 0.5, Easing.easeOutQuad, (value) => {
        //     console.log(`Text Alpha: ${value.alpha}`);
        // });
        await timer.tweenAsync(this.textPosition, { x: CANVAS_WIDTH / 2 }, 0.5, Easing.easeOutQuad, (value) => {
            console.log(`Text Position X: ${value.x}`);
        });
        // console.log('Completed fadeInText tween');
    }

    async fadeOutText() {
        // console.log('Starting fadeOutText tween');
        // await timer.tweenAsync(this.textAlpha, { alpha: 0 }, 0.5, Easing.easeInQuad, (value) => {
        //     console.log(`Text Alpha: ${value.alpha}`);
        // });
        await timer.tweenAsync(this.textPosition, { x: -CANVAS_WIDTH }, 0.5, Easing.easeInQuad, (value) => {
            console.log(`Text Position X: ${value.x}`);
        });
        // console.log('Completed fadeOutText tween');
    }

    async update(dt) {

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            switch (this.menuOptions[this.currentSelection]) {
                case 'Resume':
                    // console.log('Resuming game');
                    sounds.play(SoundName.MenuBlip);
                    await this.fadeOutText();
                    stateMachine.change(GameStateName.Play);
                    break;
                case 'Save & Exit':
                    // console.log('Saving and exiting game');
                    sounds.play(SoundName.MenuBlip);
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
        // Render the PlayState in the background
        this.playState.render(context);

        // Render the pause overlay
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(this.textPosition.x - (CANVAS_WIDTH / 1.3)/2, CANVAS_HEIGHT / 6, CANVAS_WIDTH / 1.3, CANVAS_HEIGHT / 1.5);

        context.font = '50px Alagard';
        context.fillStyle = `rgba(255, 255, 255, 255)`;
        context.textAlign = 'center';
        context.fillText('Paused', this.textPosition.x, CANVAS_HEIGHT / 3);

        context.font = '30px Alagard';
        this.menuOptions.forEach((option, index) => {
            context.fillStyle = this.currentSelection === index ? `rgba(255, 255, 0, 255)` : `rgba(255, 255, 255, 255)`;
            context.fillText(option, this.textPosition.x, CANVAS_HEIGHT / 2 + index * 40);
        });
    }
}