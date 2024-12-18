import Player from "../entities/Self/Player.js";
import Tile from "./Tile.js";

export default class StickyTile extends Tile {
	/**
	 * @param {Player} player - The player currently interacting with.
	 */
	static applyBehavior(player) {
		player.isSticky = true;
		player.isBouncing = false;
		player.isSliding = false; 
	}
}