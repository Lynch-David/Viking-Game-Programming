import PlayerState from './PlayerState.js';
import Input from '../../../lib/Input.js';
import { input } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import { PlayerConfig } from '../../PlayerConfig.js';

/**
 * Represents the idling state of the player.
 * @extends PlayerState
 */
export default class PlayerCrouchingState extends PlayerState {
	/**
	 * Creates a new PlayerIdlingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
		this.chargeTime = 0;
	}

	/**
	 * Called when entering the idling state.
	 */
	enter() {
		// this.player.dimensions.y = 40
		this.chargeTime = 0;
		this.player.velocity.x = 0;
		this.player.velocity.y = 0;
		this.player.currentAnimation = this.player.animations.crouch;

	}

	/**
	 * Updates the idling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);

		if (input.isKeyHeld(Input.KEYS.SPACE)) {
            this.chargeTime += dt;

            // Clamp chargeTime to max defined in PlayerConfig
            this.chargeTime = Math.min(this.chargeTime, PlayerConfig.chargeTime);
        } else if (input.isKeyReleased(Input.KEYS.SPACE)) {
            const chargedHeight = 
                (this.chargeTime / PlayerConfig.chargeTime) * PlayerConfig.maxChargeJumpHeight;

            this.player.stateMachine.change(PlayerStateName.Jumping, { chargedHeight });
        }

	}
	checkTransitions() {
        if (!input.isKeyHeld(Input.KEYS.SPACE)) {
            this.player.stateMachine.change(PlayerStateName.Standing);
        }
    }

}
