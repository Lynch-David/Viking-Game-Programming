import State from "../../../lib/State.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  input,
  stateMachine,
  sounds,
  timer,
} from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import Input from "../../../lib/Input.js";
import Easing from "../../../lib/Easing.js";

export default class StatsState extends State {
  constructor() {
    super();
    this.reset();
    this.stats = {
      hops: 0,
      time: 0,
      height: 0,
    };
    this.alpha = 1;
  }

  reset() {
    this.textAlpha = { alpha: 1 }; // Start with full opacity
    this.textPosition = { y: -CANVAS_HEIGHT }; // Start text off-screen above
    this.backgroundAlpha = { alpha: 1 }; // Start with a transparent background
    this.subtextAlpha = { alpha: 1 }; // Start with a transparent subtext
    this.continueTextAlpha = { alpha: 1 }; // Start with a transparent continue text
  }

  enter(parameters) {
    this.stats.hops = parameters.hops;
    this.stats.time = parameters.time;
    this.stats.height = parameters.height;
    this.alpha = 1;

    // this.fadeIn();
    this.fadeInContinueText(); // Fade in the continue text

    this.startPulsatingContinueText(); // Start pulsating the continue text
  }

  update(dt) {
    timer.update(dt);

    if (input.isKeyPressed(Input.KEYS.ENTER)) {
        sounds.play(SoundName.MenuBlip);
        stateMachine.change(GameStateName.TitleScreen);
    }
  }

  async fadeInContinueText() {
    // console.log('Starting fadeInContinueText tween');
    await timer.tweenAsync(
      this.continueTextAlpha,
      { alpha: 1 },
      0.5,
      Easing.easeInOutQuad
    );
    // console.log('Completed fadeInContinueText tween');
  }

  startPulsatingContinueText() {
    const pulsate = () => {
      timer
        .tweenAsync(
          this.continueTextAlpha,
          { alpha: 0 },
          0.5,
          Easing.easeInOutQuad
        )
        .then(() =>
          timer.tweenAsync(
            this.continueTextAlpha,
            { alpha: 1 },
            0.5,
            Easing.easeInOutQuad
          )
        )
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

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "black";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);



    context.fillStyle = "#121212"; // Dark grey
    context.fillRect(
      CANVAS_WIDTH / 6,
      CANVAS_HEIGHT / 2.5,
      CANVAS_WIDTH / 1.5,
      CANVAS_HEIGHT / 2.5
    );

    context.strokeStyle = "#47474f"; // Dark grey
    context.strokeRect(
      CANVAS_WIDTH / 6,
      CANVAS_HEIGHT / 2.5,
      CANVAS_WIDTH / 1.5,
      CANVAS_HEIGHT / 2.5
    );

    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 5.6, CANVAS_HEIGHT / 2.42, 12, 0, Math.PI * 2);
    context.fillStyle = "#47474f";
    context.fill();
    context.closePath();
    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 6.1, CANVAS_HEIGHT / 2.5, 15, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(CANVAS_WIDTH / 1.236, CANVAS_HEIGHT / 2.42, 12, 0, Math.PI * 2);
    context.fillStyle = "#47474f";
    context.fill();
    context.closePath();
    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 1.216, CANVAS_HEIGHT / 2.5, 15, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 5.6, CANVAS_HEIGHT / 1.26, 12, 0, Math.PI * 2);
    context.fillStyle = "#47474f";
    context.fill();
    context.closePath();
    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 6.1, CANVAS_HEIGHT / 1.24, 15, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(CANVAS_WIDTH / 1.236, CANVAS_HEIGHT / 1.26, 12, 0, Math.PI * 2);
    context.fillStyle = "#47474f";
    context.fill();
    context.closePath();
    // Render a circle
    context.beginPath();
    context.arc(CANVAS_WIDTH / 1.216, CANVAS_HEIGHT / 1.24, 15, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
    context.closePath();

    context.fillStyle = "white";
    context.font = "40px Alagard";
    context.textAlign = "left";

    context.fillText("Stats", CANVAS_WIDTH / 3, CANVAS_HEIGHT / 4);

    context.fillStyle = "white";
    context.font = "20px Alagard";
    context.textAlign = "left";

    // context.fillText("Stats", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
    context.fillText(
      `Hops: ${this.stats.hops}`,
      CANVAS_WIDTH / 4,
      CANVAS_HEIGHT / 2
    );
    const minutes = Math.floor(this.stats.time / 60);
    const seconds = Math.floor(this.stats.time % 60);
    context.fillText(
      `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
      CANVAS_WIDTH / 4,
      CANVAS_HEIGHT / 2 + 40
    );
    context.fillText(
      `Height: ${1874 - this.stats.height}ft`,
      CANVAS_WIDTH / 4,
      CANVAS_HEIGHT / 2 + 80
    );

    // Render the "Press Enter to Continue" text
    context.font = "7px Dogica";
    context.fillStyle = `rgba(255, 255, 255, ${this.continueTextAlpha.alpha})`;
    context.fillText(
      "Press ENTER to Continue...",
      CANVAS_WIDTH / 4,
      CANVAS_HEIGHT / 2 + 150
    );

    context.restore();
  }
}
