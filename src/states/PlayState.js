import State from '../../lib/State.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { 
    canvas,
     images, 
     sounds, timer,
      input,
       stateMachine,
       CANVAS_HEIGHT,
       CANVAS_WIDTH, } from '../globals.js';
import Input from '../../lib/Input.js';
import Player from '../entities/Self/Player.js';
import Tile from '../objects/Tile.js';
import ImageName from '../enums/ImageName.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import SoundPool from '../../lib/SoundPool.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import Easing from '../../../lib/Easing.js';

export default class PlayState extends State {
    constructor(mapDefinition, loadState = false) {
        super();

        this.map = new Map(mapDefinition);
        this.player = new Player(106, 1800, 38 * 0.75, 40 * 0.75, this.map);

        this.camera = new Camera(
            this.player,
            canvas.width,
            canvas.height,
            this.map.width * Tile.SIZE,
            this.map.height * Tile.SIZE,
            0, // initialCameraX
            this.map.height * Tile.SIZE - canvas.height // initialCameraY
        );

        this.backgroundImage = images.get(ImageName.Background);
        this.parallaxLayers = [
            { image: this.backgroundImage, speedX: 0.04, speedY: 0.1 },
        ];

        this.elapsedTime = 0; // Initialize the timer

        this.message = "Hold [Space] to jump.";
        this.messagePosition = { x: 20, y: 1920 }; // Adjust as needed
    }

    enter(parameters) {
        this.loadPlayerState();
        sounds.stop(SoundName.TitleMusic); // Ensure the music is stopped
        // this.fadeIn();

        // Set the message position near the player's starting position
        this.messagePosition.x = 1920;
        this.messagePosition.y = 20;
    }

    exit() {
        this.player.elapsedTime = this.elapsedTime.toFixed(0)
        this.savePlayerState();
    }

    loadPlayerState() {
        console.log("LOADING")
        const savedState = JSON.parse(localStorage.getItem('playerState'));
        if (savedState) {
            // console.log("Loaded time: " + savedState.elapsedTime);
            // console.log("player position: " + savedState.x)
            this.player.position.x = savedState.x;
            this.player.position.y = savedState.y;
            // this.player.elapsedTime = savedState.z || 0; // Load elapsed time
            this.player.hopCount = savedState.hopCount || 0; // Load hop count
            // this.player.elapsedTime = savedState.elapsedTime || 0; // Load elapsed time
            this.player.stateMachine.change(PlayerStateName.Idling); // Reset to idling state
        }

        const savedTime = JSON.parse(localStorage.getItem('elapsedTime'));
        this.elapsedTime = savedTime || 0;

        // console.log("extracted: " + savedTime)
    }

    savePlayerState() {
        // console.log(this.elapsedTime)
        const playerState = {
            x: this.player.position.x,
            y: this.player.position.y,
            // z: this.player.elapsedTime, // Save actual elapsed time,
            hopCount: this.player.hopCount, // Save hop count
            // elapsedTime: this.player.elapsedTime, // Save actual elapsed time
            // elapsedTime: this.elapsed2, // Save actual elapsed time
            state: this.player.stateMachine.currentState.name,
        };
        // console.log(`const: ${playerState.z}`)
        localStorage.setItem('playerState', JSON.stringify(playerState));
        localStorage.setItem('elapsedTime', this.player.elapsedTime);
    }

    update(dt) {
        this.elapsedTime += dt; // Update the timer
        // console.log("The Elapsed time: " + this.elapsedTime.toFixed(0));
        this.elapsed2 = this.elapsedTime.toFixed(0)
        this.player.elapsedTime = this.elapsed2
        // console.log(this.elapsed2)

        if (input.isKeyPressed(Input.KEYS.P)) {
            sounds.play(SoundName.MenuBlip);
            stateMachine.change(GameStateName.Pause, { playState: this, player: this.player });
        }

        if (input.isKeyPressed(Input.KEYS.NUMPAD_0)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 1800;
            this.player.position.x = 106;
        }

        if (input.isKeyPressed(Input.KEYS.NUMPAD_1)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 1474;
            this.player.position.x = 106;
        }

        if (input.isKeyPressed(Input.KEYS.NUMPAD_2)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 1234;
            this.player.position.x = 156;
        }

        if (input.isKeyPressed(Input.KEYS.NUMPAD_3)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 882;
            this.player.position.x = 168;
        }

        if (input.isKeyPressed(Input.KEYS.NUMPAD_4)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 546;
            this.player.position.x = 187;
        }

        if (input.isKeyPressed(Input.KEYS.MINUS)) {
            sounds.play(SoundName.MenuBlip);
            this.player.position.y = 80;
            this.player.position.x = 170;
        }


        if (this.player.position.y < 20) {
            console.log("Player has reached the top of the map!");
            stateMachine.change(GameStateName.Victory, { playState: this, player: this.player });
        }

        timer.update(dt);
        this.map.update(dt);
        this.camera.update(dt);
        this.player.update(dt);
    }

    render(context) {
        
        // console.log(this.player.position.x, this.player.position.y)
        // console.log(this.messagePosition.x, this.messagePosition.y)

        this.camera.applyTransform(context);
        this.renderParallaxBackground();
        this.map.render(context);
        this.player.render(context);
        this.camera.resetTransform(context);
        this.renderHeightScore(context);
        this.renderTimer(context); // Render the timer

		var playerFeetY = 1920 - (this.player.position.y) - 10;
		if (playerFeetY < 0) {
			playerFeetY = 0;
		}
        let level = Math.floor(playerFeetY / 320);
        if (level == 0) {
            this.renderMessage(context, "Hold [Space]",95, 250 );
            this.renderMessage(context, " [Space] + A",0, 200 );
            this.renderMessage(context, " [Space] + D",CANVAS_WIDTH - 80, 200 );
        }
    }

    renderParallaxBackground() {
        const offsetY = 1850; // Adjust this value to set how much higher the background should be
        this.parallaxLayers.forEach((layer) => {
            const parallaxX = -this.camera.position.x * layer.speedX;
            const parallaxY = -this.camera.position.y * layer.speedY;
            const repetitionsX = Math.ceil(canvas.width / layer.image.width) + 1;
            const repetitionsY = Math.ceil(canvas.height / layer.image.height) + 1;
            for (let y = 0; y < repetitionsY; y++) {
                for (let x = 0; x < repetitionsX; x++) {
                    const drawX = (parallaxX % layer.image.width) + x * layer.image.width;
                    const drawY = (parallaxY % layer.image.height) + y * layer.image.height + (this.map.height * Tile.SIZE - canvas.height) - offsetY;
                    layer.image.render(drawX, drawY);
                }
            }
        });
    }

    // async fadeIn() {
    //     // console.log('Starting fadeIn tween');
    //      await timer.tweenAsync(this.textPosition, { y: CANVAS_HEIGHT / 4 }, 0.5, Easing.easeInQuad);
    // }

    renderHeightScore(context) {
        context.save();
        context.font = '15px Alagard';
        context.fillStyle = 'white';
        context.textAlign = 'right';
        var playerFeetY = this.map.height * Tile.SIZE - (this.player.position.y + this.player.dimensions.y) - 16;
        if (playerFeetY < 0) {
            playerFeetY = 0;
        }
        context.fillText(`Height: ${Math.floor(playerFeetY)}ft`, canvas.width - 10, 20);
        context.restore();
    }

    renderTimer(context) {
        context.save();
        context.font = '15px Alagard';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = Math.floor(this.elapsedTime % 60);
        context.fillText(`Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, 10, 20);
        context.restore();
    }

    renderMessage(context, message, x, y) {
        context.save();
        context.font = '6px dogica';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        context.fillText(message, x, y);
        context.restore();
    }
}