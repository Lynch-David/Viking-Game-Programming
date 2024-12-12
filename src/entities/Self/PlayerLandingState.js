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
		this.originalPosition = 0
	}

	/**
	 * Called when entering the idling state.
	 */
	enter() {
		this.player.dimensions.y = 43
		this.originalPosition = this.player.position.x
		this.player.position.x = this.originalPosition - 10
		this.player.velocity.x = 0;
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
		if(this.player.currentAnimation.isDone()){
			this.player.position.x = this.originalPosition
			this.player.stateMachine.change(PlayerStateName.Idling);
		}
	}

}
