import PlayerState from './PlayerState.js';
import { input } from '../../globals.js';
import Input from '../../../lib/Input.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';

/**
 * Represents the walking state of the player.
 * @extends PlayerState
 */
export default class PlayerWalkingState extends PlayerState {
	/**
	 * Creates a new PlayerWalkingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
		this.isMovingRight = false;
		this.isMovingLeft = false;
	}

	/**
	 * Called when entering the walking state.
	 */
	enter() {
		// Modifies position and dimensions of player for sprite matching and handling
		if(this.player.facingRight){
			this.player.position.x += 5
		}
		this.player.dimensions.y = 44 * 0.75

		this.player.isOnGround = true;
		this.player.currentAnimation = this.player.animations.walk;
	}

	/**
	 * Updates the walking state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);
		this.checkTransitions();
		this.handleInput();
		this.handleHorizontalMovement();
		this.handleSliding()
	}

	/**
	 * Handles player input.
	 */
	handleInput() {
		if (input.isKeyHeld(Input.KEYS.A) && !this.isMovingRight) {
			this.isMovingLeft = true;
		} else {
			this.isMovingLeft = false;
		}

		if (input.isKeyHeld(Input.KEYS.D) && !this.isMovingLeft) {
			this.isMovingRight = true;
		} else {
			this.isMovingRight = false;
		}

		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Crouching);
		}
	}

	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		if (this.shouldIdle()) {
			this.player.stateMachine.change(PlayerStateName.Idling);
		}

		if (!this.player.isOnGround) {
			if (this.player.velocity.y < 0) {
				this.player.stateMachine.change(PlayerStateName.Crouching);
			} else {
				this.player.stateMachine.change(PlayerStateName.Falling);
			}
		}
	}

	/**
	 * Determines if the player should transition to the idling state.
	 * @returns {boolean} True if the player should idle, false otherwise.
	 */
	shouldIdle() {
		return (
			!this.isMovingLeft &&
			!this.isMovingRight &&
			Math.abs(this.player.velocity.x) < 0.1
		);
	}
}
