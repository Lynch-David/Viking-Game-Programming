import Bird from '../entities/Enemy/Bird.js';
import ImageName from '../enums/ImageName.js';
import TileType from '../enums/TileType.js';
import Tile from '../objects/Tile.js';
import TileFactory from './TileFactory.js';

/**
 * Represents a layer in a tile-based game map.
 * Each layer consists of a grid of tiles that can be rendered and manipulated.
 */
export default class Layer {
	/**
	 * Creates a new Layer instance.
	 *
	 * @param {Object} layerDefinition - The definition of the layer, typically from a map editor.
	 * @param {Array} layerDefinition.data - The tile data for the layer.
	 * @param {number} layerDefinition.width - The width of the layer in tiles.
	 * @param {number} layerDefinition.height - The height of the layer in tiles.
	 * @param {Array} sprites - The sprite objects used to render the tiles.
	 */
	constructor(layerDefinition, sprites) {
		this.tiles = []
		this.width = layerDefinition.width;
		this.height = layerDefinition.height;
		
		
		this.entitySpawnPoints = [];
		this.generateTiles(layerDefinition.data, sprites);
	}

	/**
	 * Renders all tiles in the layer.
	 * Iterates through each tile position and calls the render method on existing tiles.
	 */
	render() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// The optional chaining (?.) ensures we only call render if the tile exists
				this.getTile(x, y)?.render(x, y);
			}
		}
	}

	/**
	 * Checks if the given coordinates are within the layer's bounds.
	 *
	 * @param {number} x - The x-coordinate to check.
	 * @param {number} y - The y-coordinate to check.
	 * @returns {boolean} True if the coordinates are within bounds, false otherwise.
	 */
	isInBounds(x, y) {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	/**
	 * Retrieves the tile at the specified coordinates.
	 *
	 * @param {number} x - The x-coordinate of the tile.
	 * @param {number} y - The y-coordinate of the tile.
	 * @returns {Tile|null} The tile at the specified position, or null if out of bounds.
	 */
	getTile(x, y) {
		const tileIndex = x + y * this.width;
		return this.isInBounds(x, y) ? this.tiles[tileIndex] : null;
	}

	/**
	 * Sets a tile at the specified coordinates.
	 *
	 * @param {number} x - The x-coordinate to set the tile at.
	 * @param {number} y - The y-coordinate to set the tile at.
	 * @param {Tile} tile - The tile to set.
	 */
	setTile(x, y, tile) {
		if (this.isInBounds(x, y)) {
			this.tiles[x + y * this.width] = tile;
		}
	}

	/**
	 * Sets the ID of a tile at the specified coordinates.
	 *
	 * @param {number} x - The x-coordinate of the tile.
	 * @param {number} y - The y-coordinate of the tile.
	 * @param {number} id - The new ID to set for the tile.
	 */
	setTileId(x, y, id) {
		if (this.isInBounds(x, y)) {
			this.tiles[x + y * this.width].id = id;
		}
	}

	/**
	 * Generates an array of Tile objects from layer data.
	 *
	 * @param {Array} layerData - The tile data for the layer.
	 * @param {Array} sprites - The sprite objects used to render the tiles.
	 * @returns {Array} An array of Tile objects.
	 */
	generateTiles(layerData, sprites) {
		const tiles = [];

		layerData.forEach((tileId, index) => {
			const x = index % this.width; // Calculate column
        	const y = Math.floor(index / this.width); // Calculate row

			if (tileId === 0) {
				this.tiles.push(null);
			} else {
				let tile;
	
				switch (tileId) {
					case 935, 936:
						tile = TileFactory.createInstance(TileType.Sticky, tileId - 1, sprites);
						break;
					case 518, 519:
						tile = TileFactory.createInstance(TileType.Slime, tileId - 1, sprites);
						break;
					case 939, 940, 941, 942:
						tile = TileFactory.createInstance(TileType.Ice, tileId - 1, sprites);
						break;
					case 545:
						this.entitySpawnPoints.push({ x, y });
                		tile = new Tile(425, sprites);
						break;
					default:
						tile = new Tile(tileId - 1, sprites);
						break;
				}
	
				this.tiles.push(tile);
			}
		});	
	}
}
