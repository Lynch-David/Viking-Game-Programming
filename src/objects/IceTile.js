import Tile from "./Tile.js";

export default class IceTile extends Tile {
	applyBehavior(player) {
		player.isSliding = true; 
	}
}
