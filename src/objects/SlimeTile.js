import Tile from "./Tile.js";

export default class SlimeTile extends Tile {
	applyBehavior(player) {
		player.isBoucing = true;
	}
}