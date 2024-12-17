import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import { PlayerConfig } from '../../PlayerConfig.js';
import { CANVAS_HEIGHT, input } from '../../globals.js';
import Tile from '../../objects/Tile.js';
import CollisionDetector from '../../services/CollisionDetector.js';
import Player from './Player.js';

/**
 * Base class for all player states.
 * @extends State
 */
export default class PlayerState extends State {
	/**
	 * @param {Player} player - The player instance.
	 */
	constructor(player) {
		super();
		this.player = player;
		this.collisionDetector = new CollisionDetector(player.map);
	}

	/**
	 * Updates the player state.
	 * @param {number} dt - Delta time.
	 */
	update(dt) {
		this.applyGravity(dt);
		this.updatePosition(dt);
		this.player.currentAnimation.update(dt);
	}

	/**
	 * Renders the player on the canvas.
	 * This method handles the player's orientation, animation, and optional debug rendering.
	 *
	 * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
	 */
	render(context) {
		// Call the parent class's render method
		super.render();

    // Save the current canvas state
    context.save();

    // Apply the scaling factor
    const scale = 0.75;  // Example scale factor (50% smaller)

    // Handle player orientation (facing right or left)
    if (this.player.facingRight) {
        // If facing right, just translate to the player's position and apply scaling
        context.translate(Math.floor(this.player.position.x), Math.floor(this.player.position.y));
        context.scale(scale, scale);  // Apply scaling
    } else {
        // If facing left, flip the sprite horizontally and apply scaling
        context.scale(-1, 1);
        // Adjust position to account for the flip and scaling
        context.translate(
            Math.floor(-this.player.position.x - this.player.dimensions.x),
            Math.floor(this.player.position.y)
        );
        context.scale(scale, scale);  // Apply scaling
    }

    // Render the current animation frame at the scaled size
    this.player.currentAnimation.getCurrentFrame().render(0, 0);

    // Restore the canvas state to prevent scaling affecting other objects
    context.restore();

		
	}

	
	/**
	 * Gets the tiles that the player is colliding with.
	 * @param {number} left - Leftmost tile x-coordinate.
	 * @param {number} top - Topmost tile y-coordinate.
	 * @param {number} right - Rightmost tile x-coordinate.
	 * @param {number} bottom - Bottommost tile y-coordinate.
	 * @returns {Array} Array of colliding tile coordinates.
	 */
	getCollidingTiles(left, top, right, bottom) {
		const collidingTiles = [];
		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				if (this.player.map.isSolidTileAt(x, y)) {
					collidingTiles.push({ x, y });
				}
			}
		}
		return collidingTiles;
	}

	/**
	 * Handles horizontal movement of the player.
	 * This method updates the player's horizontal velocity based on input
	 * and applies acceleration, deceleration, and speed limits.
	 */
	handleHorizontalMovement() {
		let acceleration = 0 
		let deceleration = 0;
		if(this.player.isSliding){
			acceleration = PlayerConfig.iceAcceleration 
			deceleration = PlayerConfig.iceDeceleration
		}
		else{
			acceleration = PlayerConfig.acceleration 
			deceleration = PlayerConfig.deceleration
		}
	
		if (input.isKeyHeld(Input.KEYS.A) && input.isKeyHeld(Input.KEYS.D)) {
			this.slowDown(deceleration);
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.moveLeft(acceleration);
			this.player.facingRight = false;
		} else if (input.isKeyHeld(Input.KEYS.D)) {
			this.moveRight(acceleration);
			this.player.facingRight = true;
		} else {
			this.slowDown(deceleration);
		}
	
		// Set speed to zero if it's close to zero
		if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
	}

	moveRight(acceleration) {
		this.player.velocity.x = Math.min(
			this.player.velocity.x + PlayerConfig.acceleration,
			(PlayerConfig.maxSpeed / 2)
		);
	}
	
	moveLeft(acceleration) {
		this.player.velocity.x = Math.max(
			this.player.velocity.x - PlayerConfig.acceleration ,
			(-PlayerConfig.maxSpeed / 2)
		) ;
	}
	
	slowDown(deceleration) {
		if (this.player.velocity.x > 0) {
			this.player.velocity.x = Math.max(
				0,
				this.player.velocity.x - deceleration
			);
		} else if (this.player.velocity.x < 0) {
			this.player.velocity.x = Math.min(
				0,
				this.player.velocity.x + deceleration
			);
		}
	}
	

	/**
	 * Applies gravity to the player.
	 * This method increases the player's vertical velocity when they're not on the ground,
	 * simulating the effect of gravity.
	 *
	 * @param {number} dt - Delta time (time since last update).
	 */
	applyGravity(dt) {
		if (!this.player.isOnGround) {
			// Increase downward velocity, but don't exceed max fall speed
			this.player.velocity.y = Math.min(
				this.player.velocity.y + PlayerConfig.gravity * dt,
				PlayerConfig.maxFallSpeed
			);
		}
	}

	handleSliding() {
		if(this.player.isSliding){
			this.slowDown(PlayerConfig.iceDeceleration);
			if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
		}
	}

	/**
	 * Updates the player's position based on their current velocity.
	 * This method also handles collision detection and keeps the player within the map boundaries.
	 *
	 * @param {number} dt - Delta time (time since last update).
	 */
	async updatePosition(dt) {
		// Calculate position change
		const dx = this.player.velocity.x * dt;
		const dy = this.player.velocity.y * dt;

		// Update horizontal position and check for collisions
		this.player.position.x += dx;
		this.collisionDetector.checkHorizontalCollisions(this.player);

		// Update vertical position and check for collisions
		this.player.position.y += dy;
		this.collisionDetector.checkVerticalCollisions(this.player);

		// Keep player within horizontal map boundaries
		this.player.position.x = Math.max(
			0,
			Math.min(
				Math.round(this.player.position.x),
				this.player.map.width * Tile.SIZE - this.player.dimensions.x
			)
		);

		// Round vertical position to avoid sub-pixel rendering
		this.player.position.y = Math.round(this.player.position.y);
	}
}
