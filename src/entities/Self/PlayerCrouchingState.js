import PlayerState from './PlayerState.js';
import Input from '../../../lib/Input.js';
import { input } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import { PlayerConfig } from '../../PlayerConfig.js';

/**
 * Represents the crouching state of the player.
 * @extends PlayerState
 */
export default class PlayerCrouchingState extends PlayerState {
    /**
     * Creates a new PlayerCrouchingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
        this.chargeTime = 0;
    }

    /**
     * Called when entering the crouching state.
     */
    enter() {
        this.chargeTime = 0;
        this.originalPosition = this.player.position.y;
        this.player.dimensions.y = 31;
        this.player.position.y = this.originalPosition + 10;
        this.player.velocity.x = 0;
        this.player.velocity.y = -1;
        this.player.currentAnimation = this.player.animations.crouch;
    }

    /**
     * Updates the crouching state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        if (input.isKeyHeld(Input.KEYS.SPACE)) {
            this.chargeTime += dt;

            // Clamp chargeTime to max defined in PlayerConfig
            this.chargeTime = Math.min(this.chargeTime, PlayerConfig.chargeTime);

            // Automatically jump if max charge time is reached
            if (this.chargeTime >= PlayerConfig.chargeTime) {
                const chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * PlayerConfig.maxChargeJumpHeight;
                this.player.position.y = this.originalPosition - 5;
                this.player.stateMachine.change(PlayerStateName.Jumping, { chargedHeight });
            }
        } else if (input.isKeyReleased(Input.KEYS.SPACE)) {
            const chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * PlayerConfig.maxChargeJumpHeight;
            this.player.position.y = this.originalPosition - 5;
            this.player.stateMachine.change(PlayerStateName.Jumping, { chargedHeight });
        }
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (!input.isKeyHeld(Input.KEYS.SPACE)) {
            this.player.stateMachine.change(PlayerStateName.Idling);
        }
    }
}