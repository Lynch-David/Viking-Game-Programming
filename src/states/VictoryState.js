import State from '../../../lib/State.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine, sounds, timer } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import Input from '../../../lib/Input.js';
import Easing from '../../../lib/Easing.js';

export default class VictoryState extends State {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.textAlpha = { alpha: 1 }; // Start with full opacity
        this.textPosition = { y: -CANVAS_HEIGHT }; // Start text off-screen above
        this.backgroundAlpha = { alpha: 0 }; // Start with a transparent background
        this.subtextAlpha = { alpha: 0 }; // Start with a transparent subtext
        this.continueTextAlpha = { alpha: 0 }; // Start with a transparent continue text
    }

    async enter(parameters) {
		this.resetPlayerState(); // Reset the player state
        this.reset(); 
        this.playState = parameters.playState; // Assign the playState from parameters
        this.player = parameters.player; // Assign the player from parameters
        console.log('Entering VictoryState, starting fadeInBackground');
        await this.fadeInBackground(); // Tween in the black background
        await this.tweenTextPosition(); // Tween in the text position
        await this.fadeInSubtext(); // Fade in the subtext
        await this.fadeInContinueText(); // Fade in the continue text
		this.startPulsatingContinueText(); // Start pulsating the continue text
    }

    async exit() {
        console.log('Exiting VictoryState');
    }

    async fadeInBackground() {
        console.log('Starting fadeInBackground tween');
        await timer.tweenAsync(this.backgroundAlpha, { alpha: 1 }, 0.5, Easing.easeInOutQuad);
        console.log('Completed fadeInBackground tween');
    }

    async tweenTextPosition() {
        console.log('Starting tweenTextPosition tween');
        await timer.tweenAsync(this.textPosition, { y: CANVAS_HEIGHT / 4 }, 0.5, Easing.easeInQuad);
		sounds.play(SoundName.Bump);
        await timer.tweenAsync(this.textPosition, { y: CANVAS_HEIGHT / 4 - 20 }, 0.1, Easing.easeOutQuad);
        await timer.tweenAsync(this.textPosition, { y: CANVAS_HEIGHT / 4 }, 0.1, Easing.easeInQuad);
		sounds.play(SoundName.Bump);
        console.log('Completed tweenTextPosition tween');
    }

    async fadeInSubtext() {
        console.log('Starting fadeInSubtext tween');
        await timer.tweenAsync(this.subtextAlpha, { alpha: 1 }, 2, Easing.easeInOutQuad);
        console.log('Completed fadeInSubtext tween');
    }

    async fadeInContinueText() {
        console.log('Starting fadeInContinueText tween');
        await timer.tweenAsync(this.continueTextAlpha, { alpha: 1 }, 0.5, Easing.easeInOutQuad);
        console.log('Completed fadeInContinueText tween');
    }

    startPulsatingContinueText() {
        const pulsate = () => {
            timer.tweenAsync(this.continueTextAlpha, { alpha: 0 }, 0.5, Easing.easeInOutQuad)
                .then(() => timer.tweenAsync(this.continueTextAlpha, { alpha: 1 }, 0.5, Easing.easeInOutQuad))
                .then(pulsate);
        };
        pulsate();
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            console.log('Returning to title screen');
			sounds.play(SoundName.MenuBlip);
            stateMachine.change(GameStateName.TitleScreen);
        }
    }

    resetPlayerState() {
        const playerState = {
            x: 114,
            y: 1874,
            hopCount: 0, // Save hop count            
            state: 'idling',
        };
        localStorage.setItem('playerState', JSON.stringify(playerState));
    }

    render() {
        // Render the black background
        context.fillStyle = `rgba(0, 0, 0, ${this.backgroundAlpha.alpha})`;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Render the "Victory" text
        context.font = '50px Alagard';
        context.fillStyle = `rgba(255, 0, 0, ${this.textAlpha.alpha})`;
        context.textAlign = 'center';
        context.fillText('VIKTORY', CANVAS_WIDTH / 2, this.textPosition.y);

        // Render the subtext
        context.font = '20px Alagard';
        context.fillStyle = `rgba(255, 255, 255, ${this.subtextAlpha.alpha})`;
        this.wrapText(context, 'You have reached Valhalla, now enjoy your sweet booze and endless treasure.', CANVAS_WIDTH / 2, this.textPosition.y + 60, CANVAS_WIDTH - 40, 25);

        // Render the "Press Enter to Continue" text
        context.font = '7px Dogica';
        context.fillStyle = `rgba(255, 255, 255, ${this.continueTextAlpha.alpha})`;
        context.fillText('Press ENTER to Continue...', CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 2 + 150);
    }

    wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let testWidth = 0;

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }
}