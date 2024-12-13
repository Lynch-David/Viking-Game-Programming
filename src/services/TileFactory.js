import TileType from "../enums/TileType.js";
/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class EnemyFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
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
