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
        // Adjusts the player dimensions to make the sprite transition more seamless
        this.player.dimensions.y += 2

        // Sets the fallHeight parameter of player, this is used to calculate boosting if we land on a bouncy tile (check player.boost)
        this.player.fallHeight = this.player.position.y

        this.player.currentAnimation = this.player.animations.fall;
    }
    
    exit()
    {
        this.player.fallHeight = this.player.position.y
    }
    /**
     * Updates the falling state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

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