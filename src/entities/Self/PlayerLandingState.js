import PlayerState from './PlayerState.js';
import Input from '../../../lib/Input.js';
import { input } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';

/**
 * Represents the idling state of the player.
 * @extends PlayerState
 */
export default class PlayerLandingState extends PlayerState {
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
		this.player.dimensions.y = 40
		this.player.velocity.x = 0;
		this.player.velocity.y = 0;
		this.player.currentAnimation = this.player.animations.land;

	}

	/**
	 * Updates the idling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);
		this.handleInput();
	}

	/**
	 * Handles player input.
	 */
	handleInput() {
		
	}
}
