import PlayerState from './PlayerState.js';
import Input from '../../../lib/Input.js';
import { input } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import Hitbox from '../../../lib/Hitbox.js';
import { PlayerConfig } from '../../PlayerConfig.js';

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
		if (this.player.facingRight)
		{
			this.player.position.x = this.originalPosition - 10
		}
		else{
			this.player.position.x = this.originalPosition + 10
		}

// 		console.log("Debugging Landing State:");
// console.log("Facing Right:", this.player.facingRight);
// console.log("Velocity X Before:", this.player.velocity.x);
// console.log("Sliding?", this.player.isSliding);
// console.log("Velocity inversion condition met:",
//     (this.player.facingRight && this.player.velocity.x > 0) ||
//     (!this.player.facingRight && this.player.velocity.x < 0)
// );
		if (!this.player.isSliding){	
			console.log("1")
			this.player.velocity.x = 0;
		}
		// else
		// {
		// 	// console.log("Inverting velocity for correct sliding direction");
		// 	this.player.velocity.x *= -1;
		// }
		

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

		if (this.player.currentAnimation.isDone()) {
			if (!this.player.isSliding)
				this.player.position.x = this.originalPosition
			this.player.hitboxOffsets = this.originalHitbox
			this.player.stateMachine.change(PlayerStateName.Idling);
		}

	}

	handleSliding() {
		if (this.player.isSliding) {
			this.slowDown(3);
			if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
		}
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
	

}
