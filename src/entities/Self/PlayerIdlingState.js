import PlayerState from './PlayerState.js';
import Input from '../../../lib/Input.js';
import { input } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';

/**
 * Represents the idling state of the player.
 * @extends PlayerState
 */
export default class PlayerIdlingState extends PlayerState {
	/**
	 * Creates a new PlayerIdlingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
	}

	/**
	 * Called when entering the idling state.
	 */
	enter() {
		this.player.isOnGround = true;
		this.player.dimensions.y = 40 * 0.75
		if(!this.player.isSliding)
			this.player.velocity.x = 0;
		this.player.velocity.y = 100;
		this.player.currentAnimation = this.player.animations.idle;
		this.player.isBouncing = false
	}

	/**
	 * Updates the idling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);
		this.handleInput();

		if(!this.player.isSliding){
			this.player.velocity.x = 0
		}

		this.handleSliding()
	}

	/**
	 * Handles player input.
	 */
	handleInput() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Crouching);
		}

		// If the player is pressing A or D, not both, change to the walking state.
		if (input.isKeyHeld(Input.KEYS.A) !== input.isKeyHeld(Input.KEYS.D)) {
			this.player.stateMachine.change(PlayerStateName.Walking);
		}
	}
}
