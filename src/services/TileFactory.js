import TileType from "../enums/TileType.js";
/**
 * Encapsulates all definitions for instantiating new tiels.
 */
export default class TileFactory {
	/**
	 * @param {string} type A string using the TileType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an tile specified by TileType.
	 */
	static createInstance(type, sprites) {
		switch (type) {
			case TileType.Sticky:
				// return new Sticky(sprites);
			case TileType.Slime:
				// return new Slime(sprites);
			case TileType.Ice:
				// return new Ice(sprites);
		}
	}
}
