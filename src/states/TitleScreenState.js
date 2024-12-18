// src/states/TitleScreenState.js

import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  input,
  stateMachine,
  timer,
  sounds,
} from "../globals.js";

export default class TitleScreenState extends State {
  constructor() {
    super();
    this.menuOptions = ["Continue", "New Game", "Quit"];
    this.currentSelection = 0;
    this.blinking = false;
    this.blinkState = true;
    this.titleColor = { r: 255, g: 0, b: 0 }; // Initial color (red)
    this.targetColor = { r: 0, g: 0, b: 255 }; // Target color (blue)
    this.colorTransitionSpeed = 0.01; // Speed of color transition

    this.height = 0;
    this.hops = 0;
    this.continueColor = "white";

    // Set up a timer to toggle the target color
    setInterval(() => {
      this.targetColor =
        this.targetColor.r === 0
          ? { r: 255, g: 0, b: 0 }
          : { r: 0, g: 0, b: 255 };
    }, 3500); // Change target color every 3.5 seconds
  }

  enter() {
    this.loadPlayerState();
    this.checkGameCompletion();
  }

  exit() {
    timer.clear();
    sounds.stop(SoundName.TitleMusic);
  }

  update(dt) {
    timer.update(dt);

    if (this.blinking) {
      return;
    }

    if (input.isKeyPressed(Input.KEYS.ENTER)) {
     if (this.menuOptions[this.currentSelection] === "---") {
        sounds.play(SoundName.WallBump);
        return;
      }
      sounds.play(SoundName.Select);
      this.startBlinking();
    }

    if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
      this.currentSelection =
        (this.currentSelection - 1 + this.menuOptions.length) %
        this.menuOptions.length;
      sounds.play(SoundName.MenuBlip);
    }

    if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
      this.currentSelection =
        (this.currentSelection + 1) % this.menuOptions.length;
      sounds.play(SoundName.MenuBlip);
    }
  }

  startBlinking() {
    this.blinking = true;
    this.blinkState = true;

    timer.addTask(
      () => {
        this.blinkState = !this.blinkState;
      },
      0.2,
      20
    ); // Blink every 0.2 seconds for 4 seconds (20 times)

    timer.addTask(() => {
      this.blinking = false;
      this.proceed();
    }, 3); // Proceed after 3 seconds
  }

  proceed() {
    switch (this.menuOptions[this.currentSelection]) {
      case "Continue":
        const savedState = localStorage.getItem("playerState");
        if (savedState) {
          stateMachine.change(GameStateName.Play, { loadState: true });
        } else {
          stateMachine.change(GameStateName.Play);
        }
        break;

      case "New Game":
        this.resetPlayerState();
        stateMachine.change(GameStateName.Play);
        localStorage.setItem("gameCompleted", "false");
        break;
      case "Quit":
        window.close();
        break;
    }
  }

  loadPlayerState() {
    const savedState = JSON.parse(localStorage.getItem("playerState"));
    if (savedState) {
      console.log("Loading player state");
      this.height = savedState.y;
      this.hops = savedState.hopCount || 0; // Load hop count
    }
  }

  resetPlayerState() {
    const playerState = {
      x: 114,
      y: 1874,
      hopCount: 0, // Save hop count
      state: "idling",
    };
    localStorage.setItem("playerState", JSON.stringify(playerState));
  }

  checkGameCompletion() {
    console.log("Checking game completion");
    const gameCompleted = localStorage.getItem("gameCompleted");
    if (gameCompleted === "true") {
        console.log("Game completed");
        this.menuOptions[0] = "---";
        this.continueColor = "grey";
    } else {
      // this.menuOptions[0] = 'New Game';
      this.menuOptions[0] = "Continue";
      this.continueColor = "white";
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
    context.fillStyle = "black";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.strokeStyle = "#47474f";
    context.lineWidth = 2;
    context.strokeRect(
      CANVAS_WIDTH / 6,
      CANVAS_HEIGHT / 12,
      CANVAS_WIDTH / 1.5,
      CANVAS_HEIGHT / 4
    );

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
        context.fillStyle = '#47474f';
        context.fill();
        context.closePath();
        // Render a circle
        context.beginPath();
        context.arc(CANVAS_WIDTH / 6.1, CANVAS_HEIGHT / 2.5, 15, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();
        
        context.beginPath();
        context.arc(CANVAS_WIDTH / 1.236, CANVAS_HEIGHT / 2.42, 12, 0, Math.PI * 2);
        context.fillStyle = '#47474f';
        context.fill();
        context.closePath();
        // Render a circle
        context.beginPath();
        context.arc(CANVAS_WIDTH / 1.216, CANVAS_HEIGHT / 2.5, 15, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();


        // Render a circle
        context.beginPath();
        context.arc(CANVAS_WIDTH / 5.6, CANVAS_HEIGHT / 1.26, 12, 0, Math.PI * 2);
        context.fillStyle = '#47474f';
        context.fill();
        context.closePath();
        // Render a circle
        context.beginPath();
        context.arc(CANVAS_WIDTH / 6.1, CANVAS_HEIGHT / 1.24, 15, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();
        
        context.beginPath();
        context.arc(CANVAS_WIDTH / 1.236, CANVAS_HEIGHT / 1.26, 12, 0, Math.PI * 2);
        context.fillStyle = '#47474f';
        context.fill();
        context.closePath();
        // Render a circle
        context.beginPath();
        context.arc(CANVAS_WIDTH / 1.216, CANVAS_HEIGHT / 1.24, 15, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();

    // Smoothly transition the title color
    this.titleColor = this.lerpColor(
      this.titleColor,
      this.targetColor,
      this.colorTransitionSpeed
    );
    const titleColorString = `rgb(${Math.round(
      this.titleColor.r
    )}, ${Math.round(this.titleColor.g)}, ${Math.round(this.titleColor.b)})`;

    context.font = "50px Alagard";
    context.fillStyle = titleColorString; // Use the current title color
    context.textAlign = "center";
    context.fillText("ViKing", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

    context.textAlign = "left";

    context.font = "25px Alagard";

    // Render shadow effect by duplicating the text
    this.menuOptions.forEach((option, index) => {
      const x = CANVAS_WIDTH / 4; // Shifted to the right
      const y = CANVAS_HEIGHT / 2 + index * 40;
      // console.log(option)
      if (option === "Continue" && this.continueColor === "grey") {
        option = "---";
      }


        // Render shadow
        if (this.blinking && this.currentSelection === index) {
          context.fillStyle = this.blinkState ? "black" : "transparent";
        } else {
          context.fillStyle = "black";
        }
        context.fillText(option, x - 0, y + 0);


        // Render actual text
        if (this.blinking && this.currentSelection === index) {
          context.fillStyle = this.blinkState ? "yellow" : "black";
        } else {
          context.fillStyle =
            this.currentSelection === index ? "yellow" : "white";
        }
    

        // Shift the selected option right and up slightly
        if (this.currentSelection === index) {
          context.fillText(option, x + 4, y - 4);
        } else {
          context.fillText(option, x, y);
        }
      
    });

    // Render the small rectangular box near the bottom
    const boxWidth = 170;
    const boxHeight = 35;
    const boxX = (CANVAS_WIDTH - boxWidth) / 2;
    const boxY = CANVAS_HEIGHT - boxHeight - 20;

    context.fillStyle = "#121212"; // Dark grey
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    context.strokeStyle = "#47474f"; // Dark grey
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

    context.font = "15px Alagard";
    context.fillStyle = "white";
    context.textAlign = "left";
    context.fillText(
      `Height: ${1920 - Math.floor(this.height + 46)}`,
      boxX + 10,
      boxY + 23
    );

    context.textAlign = "right";
    context.fillText(
      `Hops: ${Math.floor(this.hops)}`,
      boxX + boxWidth - 18,
      boxY + 23
    );
  }
}
