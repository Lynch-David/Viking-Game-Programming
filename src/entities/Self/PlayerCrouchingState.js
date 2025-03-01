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
        this.lastDirection = 0; // 0: no direction, -1: left, 1: right
    }

    /**
     * Called when entering the crouching state.
     */
    enter() {
        this.chargeTime = 0;
        this.originalPosition = this.player.position.y;

        // Adjusts the player dimensions so that the sprite appears smaller. 
        this.player.dimensions.y = 29 * 0.75;

        if(!this.player.isSliding){
			this.player.velocity.x = 0;
        }

        // Adds slight down velocity so that the crouching state falls to the ground when we enter it
        this.player.velocity.y = -1;
        this.player.currentAnimation = this.player.animations.crouch;
    }

    /**
     * Updates the crouching state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);
        this.handleSliding()

        // Calculates the direction we want to jump to
        if (input.isKeyHeld(Input.KEYS.A)) {
            this.lastDirection = -1;
        } else if (input.isKeyHeld(Input.KEYS.D)) {
            this.lastDirection = 1;
        } else {
            this.lastDirection = 0; // No direction held
        }

        if (input.isKeyHeld(Input.KEYS.SPACE)) {
            this.chargeTime += dt;

            // Clamp chargeTime to max defined in PlayerConfig
            this.chargeTime = Math.min(this.chargeTime, PlayerConfig.chargeTime);

            // Automatically jump if max charge time is reached
            if (this.chargeTime >= PlayerConfig.chargeTime) {
                let chargedHeight = 0
                if(this.player.isSticky){
                    chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * (PlayerConfig.maxChargeJumpHeight/2); // Half the max jump height if sticky
                }
                else{
                    chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * PlayerConfig.maxChargeJumpHeight;
                }
                this.player.position.y = this.originalPosition - 5;
                this.player.stateMachine.change(PlayerStateName.Jumping, { chargedHeight, direction: this.lastDirection });
            }
        } else if (input.isKeyReleased(Input.KEYS.SPACE)) {
            let chargedHeight = 0
                if(this.player.isSticky){
                    chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * (PlayerConfig.maxChargeJumpHeight/2); // Half the max jump height if sticky
                }
                else{
                    chargedHeight = (this.chargeTime / PlayerConfig.chargeTime) * PlayerConfig.maxChargeJumpHeight;
                }
            this.player.position.y = this.originalPosition - 5;
            this.player.stateMachine.change(PlayerStateName.Jumping, { chargedHeight, direction: this.lastDirection });
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