import Animation from '../../../lib/Animation.js';
import Tile from '../../objects/Tile.js';
import Graphic from '../../../lib/Graphic.js';
import Map from '../../services/Map.js';
import ImageName from '../../enums/ImageName.js';
import { birdSpriteConfig, loadPlayerSprites } from '../../SpriteConfig.js';
import GameEntity from '../GameEntity.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from '../../globals.js';
import Hitbox from '../../../lib/Hitbox.js';
import CollisionDetector from '../../services/CollisionDetector.js';

/**
 * Represents a Goomba enemy in the game.
 * @extends Entity
 */
export default class Bird extends GameEntity {
	/**
	 * Creates a new Goomba instance.
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the Goomba.
	 * @param {number} height - The height of the Goomba.
	 * @param {Graphic} spriteSheet - The sprite sheet containing Goomba graphics.
	 * @param {Map} map - The game map instance.
	 */
	constructor(x, y, width, height, map) {
		super(x, y, width, height);
		this.map = map;
		this.speed = 90; // Pixels per second
		this.direction = 1; // 1 for right, -1 for left
		this.hitboxOffset


		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);

		this.sprites = loadPlayerSprites(
			images.get(ImageName.Crow),
			birdSpriteConfig
		);

		this.currentAnimation = new Animation(this.sprites.fly, 0.14);
	}

	/**
	 * Updates the Goomba's state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		this.updateMovement(dt);
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		this.currentAnimation.update(dt);
	}

	/**
	 * Updates the Goomba's movement.
	 * @param {number} dt - The time passed since the last update.
	 */
	updateMovement(dt) {
		// Move horizontally
		this.position.x -= this.direction * this.speed * dt;

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
		if (this.position.x <= 0 || this.position.x + this.dimensions.x >= CANVAS_WIDTH) {			
			// Reverse direction
			this.direction *= -1; // Reverse direction when colliding with the wall
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

		this.hitbox.render(context)

		if (this.direction === 1) {
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
	
	onCollideWithPlayer(player) {
		player.velocity.y *= -1
	}


}
