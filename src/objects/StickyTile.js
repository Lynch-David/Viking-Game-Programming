import Tile from "./Tile.js";

export default class StickyTile extends Tile {
	applyBehavior(player) {
		player.isSticky = true;
	}
}