import State from '../../lib/State.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { canvas, images, sounds, timer } from '../globals.js';
import Player from '../entities/Self/Player.js';
import Tile from '../services/Tile.js';
import ImageName from '../enums/ImageName.js';
// import MusicName from '../enums/MusicName.js';

/**
 * Represents the main play state of the game.
 * @extends State
 */
export default class PlayState extends State {
	/**
	 * Creates a new PlayState instance.
	 * @param {Object} mapDefinition - The definition object for the game map.
	 */
	constructor(mapDefinition) {
		super();

		this.map = new Map(mapDefinition);
		this.player = new Player(106, 1800, 42, 40, this.map);
		this.camera = new Camera(
			this.player,
			canvas.width,
			canvas.height,
			this.map.width * Tile.SIZE,
			this.map.height * Tile.SIZE
		);

		// Load background image
		this.backgroundImage = images.get(ImageName.Background);

		// Set up parallax layers for background
		this.parallaxLayers = [
			{ image: this.backgroundImage, speedX: 0.04, speedY: 0.1 },
		];

		// sounds.play(MusicName.Overworld);
	}

	/**
	 * Updates the play state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		timer.update(dt);
		this.map.update(dt);
		this.camera.update(dt);
		this.player.update(dt);
	}

	/**
	 * Renders the play state.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		this.camera.applyTransform(context);

		this.renderParallaxBackground();

		this.map.render(context);
		this.player.render(context);

		this.camera.resetTransform(context);
		this.renderCameraGuidelines(context);
		
	}

	/**
	 * Renders the parallax background.
	 */
	renderParallaxBackground() {
		this.parallaxLayers.forEach((layer) => {
			const parallaxX = -this.camera.position.x * layer.speedX;
			const parallaxY = -this.camera.position.y * layer.speedY;

			// Calculate repetitions needed to cover the screen
			const repetitionsX =
				Math.ceil(canvas.width / layer.image.width) + 1;
			const repetitionsY =
				Math.ceil(canvas.height / layer.image.height) + 1;

			for (let y = 0; y < repetitionsY; y++) {
				for (let x = 0; x < repetitionsX; x++) {
					const drawX =
						(parallaxX % layer.image.width) + x * layer.image.width;
					const drawY =
						(parallaxY % layer.image.height) +
						y * layer.image.height;
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

		// Draw vertical line
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvas.height);
		context.stroke();

		// Draw horizontal line
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();

		context.setLineDash([]);
	}

}
