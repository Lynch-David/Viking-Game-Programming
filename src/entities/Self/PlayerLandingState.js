import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import Hitbox from '../../../lib/Hitbox.js';

/**
 * Represents the landing state of the player.
 * @extends PlayerState
 */
export default class PlayerLandingState extends PlayerState {
	/**
	 * Creates a new PlayerLandingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
		this.originalPosition = 0
		this.originalHitbox = this.player.hitboxOffsets
	}

	/**
	 * Called when entering the landing state.
	 */
	enter() {
		this.player.isOnGround = true;

		// Sets new player hitbox sizes, dimensions and position based on what direction were facing as 
		// the landing sprite is much larger than the normal ones
		if (this.player.facingRight) {
			this.player.hitboxOffsets = new Hitbox(
				16,
				this.player.dimensions.y,
				-12,
				-this.player.dimensions.y
			);
		}
		else {
			this.player.hitboxOffsets = new Hitbox(
				-3,
				this.player.dimensions.y,
				-12,
				-this.player.dimensions.y
			);
		}
		this.player.dimensions.y = 43 * 0.75
		this.originalPosition = this.player.position.x

		if (!this.player.isSliding){	
			this.player.velocity.x = 0;
		}

		this.player.velocity.y = 0;
		this.player.currentAnimation = this.player.animations.land;
		this.player.currentAnimation.timesPlayed = 0
	}

	/**
	 * Updates the idling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);

		this.handleSliding();

		// When the animation finishes for the landing handle resetting values and changing to idle state
		if (this.player.currentAnimation.isDone()) {
			if (!this.player.isSliding){
				this.player.position.x = this.originalPosition
			}
			this.player.hitboxOffsets = this.originalHitbox
			this.player.stateMachine.change(PlayerStateName.Idling);
		}

	}

	/**
	 * Handles the sliding of the player.
	 */
	handleSliding() {
		// If were sliding slow down the player and check for if the velocity gets below a certain threshold to stop the sliding
		if (this.player.isSliding) {
			this.slowDown(3);
			if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
		}
	}

	/**
	 * Handles slowing down the x velocity of the player
	 * @param {number} deceleration  - The speed at which the player should slow down. 
	 */
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
	

}
