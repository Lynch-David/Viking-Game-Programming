import Player from "../entities/Self/Player.js";
import { sounds } from "../globals.js";
import Tile from "./Tile.js";
import SoundName from "../enums/SoundName.js";

export default class SlimeTile extends Tile {
	/**
	 * @param {Player} player - The player currently interacting with.
	 */
	static applyBehavior(player) {
		sounds.play(SoundName.slimeBounce);
		player.isSticky = false;
		player.isBouncing = true;
		player.isSliding = false; 
	}
}