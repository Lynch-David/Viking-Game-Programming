import Entity from './Entity.js';
import Animation from '../../../lib/Animation.js';
import Sprite from '../../lib/Sprite.js';
import Tile from '../services/Tile.js';
import Graphic from '../../lib/Graphic.js';
import Map from '../services/Map.js';

/**
 * Represents a Goomba enemy in the game.
 * @extends Entity
 */
export default class Bird extends Entity {
	/**
	 * Creates a new Goomba instance.
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the Goomba.
	 * @param {number} height - The height of the Goomba.
	 * @param {Graphic} spriteSheet - The sprite sheet containing Goomba graphics.
	 * @param {Map} map - The game map instance.
	 */
	constructor(x, y, width, height, spriteSheet, map) {
		super(x, y, width, height);
		this.map = map;
		this.speed = 30; // Pixels per second
		this.direction = 1; // 1 for right, -1 for left

		this.sprites = loadPlayerSprites(
			images.get(ImageName.Player),
			spriteConfig
		);

		this.currentAnimation = new Animation(
			enemySpriteConfig.goomba.map(
				(frame) =>
					new Sprite(
						spriteSheet,
						frame.x,
						frame.y,
						frame.width,
						frame.height
					)
			),
			0.2 // Animation interval
		);
	}

	/**
	 * Updates the Goomba's state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		this.updateMovement(dt);
		this.currentAnimation.update(dt);
	}

	/**
	 * Updates the Goomba's movement.
	 * @param {number} dt - The time passed since the last update.
	 */
	updateMovement(dt) {
		// Move horizontally
		this.position.x += this.direction * this.speed * dt;

		// Check for collisions
		this.checkCollisions();
	}

	/**
	 * Checks for collisions with the environment.
	 */
	checkCollisions() {
		// Check ground collision
		this.position.y = Math.floor(this.position.y / Tile.SIZE) * Tile.SIZE;

		// Check wall collision
		if (this.isCollidingWithWall()) {
			this.direction *= -1; // Reverse direction
		}
	}


	/**
	 * Checks if the Goomba is colliding with a wall.
	 * @returns {boolean} True if the Goomba is colliding with a wall, false otherwise.
	 */
	isCollidingWithWall() {
		const topTile = Math.floor(this.position.y / Tile.SIZE);
		const bottomTile = Math.floor(
			(this.position.y + this.dimensions.y - 1) / Tile.SIZE
		);
		const sideTile = Math.floor(
			(this.position.x + (this.direction > 0 ? this.dimensions.x : 0)) /
				Tile.SIZE
		);

		return (
			this.map.isSolidTileAt(sideTile, topTile) ||
			this.map.isSolidTileAt(sideTile, bottomTile)
		);
	}

	/**
	 * Renders the Goomba.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		context.save();

		if (this.dying) {
			context.scale(1, -1); // Flip vertically for dying animation
			context.translate(
				Math.floor(this.position.x),
				Math.floor(-this.position.y - this.dimensions.y)
			);
		}
		else if (this.direction === 1) {
			context.scale(-1, 1);
			context.translate(
				Math.floor(-this.position.x - this.dimensions.x),
				Math.floor(this.position.y)
			);
		} else {
			context.translate(
				Math.floor(this.position.x),
				Math.floor(this.position.y)
			);
		}

		this.currentAnimation.getCurrentFrame().render(0,0)

		context.restore();
	}
}
