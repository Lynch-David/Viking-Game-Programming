import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import { sounds } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';

/**
 * Represents the falling state of the player.
 * @extends PlayerState
 */
export default class PlayerFallingState extends PlayerState {
    /**
     * Creates a new PlayerFallingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
    }

    /**
     * Called when entering the falling state.
     */
    enter() {
        this.player.dimensions.y += 2
        this.player.fallHeight = this.player.position.y
        this.player.currentAnimation = this.player.animations.fall;
    }
    
    exit()
    {
        this.player.fallHeight = 0
    }
    /**
     * Updates the falling state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        // Prevent horizontal movement during falling
        // this.player.velocity.x = 0;

        this.checkTransitions();
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (this.player.isOnGround) {
            sounds.play(SoundName.Landing);
            this.player.stateMachine.change(PlayerStateName.Landing);
        }
    }
}