import PlayerState from './PlayerState.js';
import { input, sounds } from '../../globals.js';
import { PlayerConfig } from '../../PlayerConfig.js';
import Input from '../../../lib/Input.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import SoundName from '../../enums/SoundName.js';

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
    }

    /**
     * Called when entering the jumping state.
     */
    enter(params = {}) {
        this.player.jumpTime = 0;

        this.chargedHeight = params.chargedHeight;

        // Set initial horizontal velocity based on the last held direction
        if (params.direction === -1) {
            this.player.velocity.x = -PlayerConfig.maxSpeed;
        } else if (params.direction === 1) {
            this.player.velocity.x = PlayerConfig.maxSpeed;
        } else {
            this.player.velocity.x = 0;
        }

        this.player.velocity.y = 0;
        this.player.currentAnimation = this.player.animations.jump;
        sounds.play(SoundName.Jump);
    }

    /**
     * Called when exiting the jumping state.
     */
    exit() {}

    /**
     * Updates the jumping state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        this.handleInput(dt);
        this.checkTransitions();
    }

    /**
     * Handles player input.
     */
    handleInput(dt) {
        if (this.player.jumpTime <= PlayerConfig.maxJumpTime) {
            this.player.velocity.y = this.chargedHeight * (1 - this.player.jumpTime / PlayerConfig.maxJumpTime);
            this.player.jumpTime += dt;
        } else {
            this.player.jumpTime = 1;
        }
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (this.player.velocity.y >= 0) {
            this.player.stateMachine.change(PlayerStateName.Falling);
        }
    }
}