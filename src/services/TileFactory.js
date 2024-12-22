import TileType from "../enums/TileType.js";
import StickyTile from "../objects/StickyTile.js"
import SlimeTile from "../objects/SlimeTile.js"
import IceTile from "../objects/IceTile.js"

/**
 * Encapsulates all definitions for instantiating new tiles.
 */
export default class TileFactory {
	/**
	 * @param {string} type A string using the TileType enum.
	 * @param {array} sprites The sprites to be used for the tiles.
	 * @returns An instance of an tile specified by TileType.
	 */
	static createInstance(type, id, sprites) {
		switch (type) {
			case TileType.Sticky:
				return new StickyTile(id, sprites);
			case TileType.Slime:
				return new SlimeTile(id, sprites);
			case TileType.Ice:
				return new IceTile(id, sprites);
		}
	}
}
