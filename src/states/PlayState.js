import State from '../../lib/State.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { canvas, images, sounds, timer, input, stateMachine } from '../globals.js';
import Player from '../entities/Self/Player.js';
import Tile from '../services/Tile.js';
import ImageName from '../enums/ImageName.js';
import GameStateName from '../enums/GameStateName.js';
import SoundName from '../enums/SoundName.js';

export default class PlayState extends State {
    constructor(mapDefinition) {
        super();

        this.map = new Map(mapDefinition);
        this.player = new Player(106, 1800, 42, 40, this.map);
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

    update(dt) {
        if (input.isKeyPressed(input.keys.P)) {
			sounds.play(SoundName.MenuBlip)
            stateMachine.change(GameStateName.Pause);
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
        this.renderCameraGuidelines(context);
    }

	renderParallaxBackground() {
		const offsetY = 300; // Adjust this value to set how much higher the background should be
	
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
}