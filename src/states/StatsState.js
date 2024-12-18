import State from '../../../lib/State.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine, sounds, timer } from '../globals.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import Input from '../../../lib/Input.js';
import Easing from '../../../lib/Easing.js';

export default class StatsState extends State {
    constructor() {
        super();
        this.reset();
        this.stats = {
            hops: 0,
            time: 0,
            height: 0
        };
        this.alpha = 0;
    }

    reset() {
        this.textAlpha = { alpha: 1 }; // Start with full opacity
        this.textPosition = { y: -CANVAS_HEIGHT }; // Start text off-screen above
        this.backgroundAlpha = { alpha: 0 }; // Start with a transparent background
        this.subtextAlpha = { alpha: 0 }; // Start with a transparent subtext
        this.continueTextAlpha = { alpha: 0 }; // Start with a transparent continue text

        // this.hops = 0;
        // this.time = 0;
    }

    enter(parameters) {
        this.stats.hops = parameters.hops;
        this.stats.time = parameters.time;
        this.stats.height = parameters.height;
        this.alpha = 0;

        this.fadeIn();
        this.fadeInContinueText(); // Fade in the continue text



        this.startPulsatingContinueText(); // Start pulsating the continue text
    }
    

    update(dt) {
        timer.update(dt);
    }

    async fadeInContinueText() {
        // console.log('Starting fadeInContinueText tween');
        await timer.tweenAsync(this.continueTextAlpha, { alpha: 1 }, 0.5, Easing.easeInOutQuad);
        // console.log('Completed fadeInContinueText tween');
    }

    startPulsatingContinueText() {
        const pulsate = () => {
            timer.tweenAsync(this.continueTextAlpha, { alpha: 0 }, 0.5, Easing.easeInOutQuad)
                .then(() => timer.tweenAsync(this.continueTextAlpha, { alpha: 1 }, 0.5, Easing.easeInOutQuad))
                .then(pulsate);
        };
        pulsate();
    }
    

    async fadeIn() {
        await timer.tweenAsync(this, { alpha: 1 }, 1, Easing.easeInOutQuad);
    }

    render() {
        context.save();
        context.globalAlpha = this.alpha;

        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.textAlign = 'center';

        context.fillText('Stats', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        context.fillText(`Hops: ${this.stats.hops}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        context.fillText(`Time: ${this.stats.time}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        context.fillText(`Height: ${1874 - this.stats.height}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);

                // Render the "Press Enter to Continue" text
                context.font = '7px Dogica';
                context.fillStyle = `rgba(255, 255, 255, ${this.continueTextAlpha.alpha})`;
                context.fillText('Press ENTER to Continue...', CANVAS_WIDTH / 1.55, CANVAS_HEIGHT / 2 + 150);

        context.restore();
    }
}