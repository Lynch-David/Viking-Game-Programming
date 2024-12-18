import State from '../../lib/State.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { canvas, images, sounds, timer, input, stateMachine } from '../globals.js';
import Input from '../../../lib/Input.js';
import Player from '../entities/Self/Player.js';
import Tile from '../objects/Tile.js';
import ImageName from '../enums/ImageName.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';
import SoundPool from '../../lib/SoundPool.js';
import PlayerStateName from '../enums/PlayerStateName.js';

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
    }

    enter(parameters) {
        this.loadPlayerState();
        // this.elapsedTime = this.player.elapsedTime;
        sounds.stop(SoundName.TitleMusic); // Ensure the music is stopped
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

        console.log("extracted: " + savedState.z)
    }

    savePlayerState() {
        console.log(this.elapsedTime)
        const playerState = {
            x: this.player.position.x,
            y: this.player.position.y,
            // z: this.player.elapsedTime, // Save actual elapsed time,
            hopCount: this.player.hopCount, // Save hop count
            // elapsedTime: this.player.elapsedTime, // Save actual elapsed time
            // elapsedTime: this.elapsed2, // Save actual elapsed time
            state: this.player.stateMachine.currentState.name,
        };
        console.log(`const: ${playerState.z}`)
        localStorage.setItem('playerState', JSON.stringify(playerState));
    }

    update(dt) {
        this.elapsedTime += dt; // Update the timer
        console.log("The Elapsed time: " + this.elapsedTime.toFixed(0));
        this.elapsed2 = this.elapsedTime.toFixed(0)
        this.player.elapsedTime = this.elapsed2
        // console.log(this.elapsed2)

        if (input.isKeyPressed(Input.KEYS.P)) {
            sounds.play(SoundName.MenuBlip);
            stateMachine.change(GameStateName.Pause, { playState: this, player: this.player });
        }

        if (input.isKeyPressed(Input.KEYS.O)) {
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
        this.camera.applyTransform(context);
        this.renderParallaxBackground();
        this.map.render(context);
        this.player.render(context);
        this.camera.resetTransform(context);
        this.renderHeightScore(context);
        this.renderTimer(context); // Render the timer
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

    renderHeightScore(context) {
        context.save();
        context.font = '15px Alagard';
        context.fillStyle = 'white';
        context.textAlign = 'right';
        var playerFeetY = this.map.height * Tile.SIZE - (this.player.position.y + this.player.dimensions.y) - 16;
        if (playerFeetY < 0) {
            playerFeetY = 0;
        }
        context.fillText(`Height: ${Math.floor(playerFeetY)}`, canvas.width - 10, 20);
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
}