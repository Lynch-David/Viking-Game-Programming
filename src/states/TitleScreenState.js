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
        this.titleColor = { r: 255, g: 0, b: 0 }; // Initial color (red)
        this.targetColor = { r: 0, g: 0, b: 255 }; // Target color (blue)
        this.colorTransitionSpeed = 0.01; // Speed of color transition

        // Set up a timer to toggle the target color
        setInterval(() => {
            this.targetColor = this.targetColor.r === 0 ? { r: 255, g: 0, b: 0 } : { r: 0, g: 0, b: 255 };
        }, 3500); // Change target color every 3 seconds
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
        }, 3); // Proceed after 1 second
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
                window.close();
                break;
        }
    }

    lerpColor(start, end, t) {
        return {
            r: start.r + (end.r - start.r) * t,
            g: start.g + (end.g - start.g) * t,
            b: start.b + (end.b - start.b) * t,
        };
    }


    render() {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.strokeStyle = '#47474f';
        context.lineWidth = 2;
        context.strokeRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 12, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 4);

        context.fillStyle = '#121212';
        context.fillRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2.5, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 2.5);

        context.strokeStyle = '#47474f';
        context.strokeRect(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2.5, CANVAS_WIDTH / 1.5, CANVAS_HEIGHT / 2.5);

        // Smoothly transition the title color
        this.titleColor = this.lerpColor(this.titleColor, this.targetColor, this.colorTransitionSpeed);
        const titleColorString = `rgb(${Math.round(this.titleColor.r)}, ${Math.round(this.titleColor.g)}, ${Math.round(this.titleColor.b)})`;

        context.font = '50px Alagard';
        context.fillStyle = titleColorString; // Use the current title color
        context.textAlign = 'center';
        context.fillText('ViKing', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

        context.textAlign = 'left';
        context.font = '25px Alagard';

        // Render shadow effect by duplicating the text
        this.menuOptions.forEach((option, index) => {
            const x = CANVAS_WIDTH / 5;
            const y = CANVAS_HEIGHT / 2 + index * 40;

            // Render shadow
            if (this.blinking && this.currentSelection === index) {
                context.fillStyle = this.blinkState ? 'black' : 'transparent';
            } else {
                context.fillStyle = 'black';
            }
            context.fillText(option, x - 0, y + 0);

            // Render actual text
            if (this.blinking && this.currentSelection === index) {
                context.fillStyle = this.blinkState ? 'yellow' : 'black';
            } else {
                context.fillStyle = this.currentSelection === index ? 'yellow' : 'white';
            }

            // Shift the selected option right and up slightly
            if (this.currentSelection === index) {
                context.fillText(option, x + 4, y - 4);
            } else {
                context.fillText(option, x, y);
            }
        });
    }
}