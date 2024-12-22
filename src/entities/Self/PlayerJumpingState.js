import PlayerState from './PlayerState.js';
import { input, sounds } from '../../globals.js';
import { PlayerConfig } from '../../PlayerConfig.js';
import Input from '../../../lib/Input.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import SoundName from '../../enums/SoundName.js';
import Hitbox from '../../../lib/Hitbox.js';

/**
 * Represents the jumping state of the player.
 * @extends PlayerState
 */
export default class PlayerJumpingState extends PlayerState {
    /**
     * Creates a new PlayerJumpingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
        this.chargedHeight = PlayerConfig.jumpPower;
        this.finalVelocity = 0;

        this.originalSlidingBool = false
        this.originalHitbox = this.player.hitboxOffsets
    }

    /**
     * Called when entering the jumping state.
     */
    enter(params = {}) {
        this.player.jumpTime = 0;

        // Sets originalSlidingBool to if the player is currently sliding, we dont want to slide while jumping as it will
        // mess with our x velocity and will not create a consistent jumping animations.
        this.originalSlidingBool = this.player.isSliding
        this.player.isSliding = false

        // Makes the player sprite smaller to match up with our tile sprite sizes 
        this.player.dimensions.y = 40 * 0.75

        // We pass in a charged height that is used to calculate how high to jump
        this.chargedHeight = params.chargedHeight;

        // Set initial horizontal velocity based on the last held direction and changes the direction the player is facing
        if (params.direction === -1) {
            this.player.facingRight = false
            this.player.velocity.x = -PlayerConfig.maxSpeed;
        } else if (params.direction === 1) {
            this.player.facingRight = true
            this.player.velocity.x = PlayerConfig.maxSpeed;
        } else {
            this.player.velocity.x = 0; // No direction held
        }

        // Set the y velocity to 0 to prevent issues that can be caused when calculating this in update
        this.player.velocity.y = 0;

        this.player.currentAnimation = this.player.animations.jump;
        sounds.play(SoundName.Jump);

        // Increment hop count
        this.player.incrementHopCount();
    }

    /**
     * Called when exiting the jumping state.
     */
    exit() {
        // Resets player sliding bool back to what it was originally
        this.player.isSliding = this.originalSlidingBool
    }

    /**
     * Updates the jumping state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        this.handleJumping(dt);
        this.checkTransitions();
    }

    /**
     * Handles player jumping.
     */
    handleJumping(dt) {
        // Calculates how high to jump based off of how long we've been jumping for and how high we set the jump height to be
        if (this.player.jumpTime <= PlayerConfig.maxJumpTime) {
            this.player.velocity.y = this.chargedHeight * (1 - this.player.jumpTime / PlayerConfig.maxJumpTime);
            this.player.jumpTime += dt;
        } else {
            this.player.jumpTime = PlayerConfig.maxJumpTime;
        }
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        // If player stops moving upwards or starts to fall then switch to the falling state
        if (this.player.velocity.y >= 0) {
            this.player.stateMachine.change(PlayerStateName.Falling);
        }
    }
}