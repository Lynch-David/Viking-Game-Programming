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

        var state = localStorage.getItem('playerState');

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
    }

    enter(parameters) {
        this.loadPlayerState();
        sounds.stop(SoundName.TitleMusic); // Ensure the music is stopped
    }

    exit() {

    }

    loadPlayerState() {
        const savedState = JSON.parse(localStorage.getItem('playerState'));
        if (savedState) {
            this.player.position.x = savedState.x;
            this.player.position.y = savedState.y;
            this.player.hopCount = savedState.hopCount || 0; // Load hop count
            this.player.stateMachine.change(PlayerStateName.Idling); // Reset to idling state
        }
    }

    update(dt) {

        console.log(this.player.hopCount);

        
        if (input.isKeyPressed(Input.KEYS.P)) {
            sounds.play(SoundName.MenuBlip);
            stateMachine.change(GameStateName.Pause, { playState: this, player: this.player });
        }

        if (1920 - (this.player.position.y) > 320) {
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
        // this.renderCameraGuidelines(context);
    
        this.renderHeightScore(context);
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

    renderCameraGuidelines(context) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        context.setLineDash([5, 5]);
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255, 255, 255, 0.9)';

        context.beginPath();
        context.moveTo(centerX, 0);
        context.lineTo(centerX, canvas.height);
        context.stroke();

        context.beginPath();
        context.moveTo(0, centerY);
        context.lineTo(canvas.width, centerY);
        context.stroke();

        context.setLineDash([]);
    }

	renderHeightScore(context) {
		context.save();
		context.font = '15px Alagard';

		context.fillStyle = 'white';
		context.textAlign = 'right';
	
		// Calculate the player's height relative to the bottom of the map
		var playerFeetY = this.map.height * Tile.SIZE - (this.player.position.y + this.player.dimensions.y) - 16;
		if (playerFeetY < 0) {
			playerFeetY = 0;
		}
		context.fillText(`Height: ${Math.floor(playerFeetY)}`, canvas.width - 10, 20);
	
		context.restore();
	}
}