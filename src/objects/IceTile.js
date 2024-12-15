import Player from "../entities/Self/Player.js";
import Tile from "./Tile.js";

export default class IceTile extends Tile {
	/**
	 * @param {Player} player - The player currently interacting with.
	 */
	applyBehavior(player) {
		player.isSliding = true; 
	}
}
