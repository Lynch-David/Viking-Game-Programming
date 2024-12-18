import Player from "../entities/Self/Player.js";
import { sounds } from "../globals.js";
import Tile from "./Tile.js";
import SoundName from "../enums/SoundName.js";

export default class SlimeTile extends Tile {
    static lastSoundTime = 0; // Static variable to track the last time the sound was played

    /**
     * @param {Player} player - The player currently interacting with.
     */
    static applyBehavior(player) {
        const currentTime = Date.now();
        const cooldown = 500; // 1 second cooldown

        if (currentTime - SlimeTile.lastSoundTime >= cooldown) {
            sounds.play(SoundName.slimeBounce);
            SlimeTile.lastSoundTime = currentTime;
        }

        player.isSticky = false;
        player.isBouncing = true;
        player.isSliding = false;
    }
}