import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import Tile from './Tile.js';
import Layer from './Layer.js';
import { images } from '../globals.js';

/**
 * Represents the game map, including layers, blocks, and entities.
 */
export default class Map {
	/**
	 * The index of the foreground layer in the layers array.
	 * @type {number}
	 */
	static FOREGROUND_LAYER = 0;

	/**
	 * Creates a new Map instance.
	 * @param {Object} mapDefinition - The map definition object, typically loaded from a JSON file.
	 */
	constructor(mapDefinition) {
		this.width = mapDefinition.width;
		this.height = mapDefinition.height;
		this.tileSize = mapDefinition.tilewidth;
		this.tilesets = mapDefinition.tilesets;

		// Generate sprites from the tileset image
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			this.tileSize,
			this.tileSize
		);

		// Create Layer instances for each layer in the map definition
		this.layers = mapDefinition.layers.map(
			(layerData) => new Layer(layerData, sprites)
		);
		this.foregroundLayer = this.layers[Map.FOREGROUND_LAYER];
	}


	/**
	 * Updates all entities in the map.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {

	}

	/**
	 * Renders the map and all its entities.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		
		this.foregroundLayer.render();
	}

	/**
	 * Gets a tile from a specific layer at the given column and row.
	 * @param {number} layerIndex - The index of the layer.
	 * @param {number} col - The column of the tile.
	 * @param {number} row - The row of the tile.
	 * @returns {Tile|null} The tile at the specified position, or null if no tile exists.
	 */
	getTileAt(layerIndex, col, row) {
		return this.layers[layerIndex].getTile(col, row);
	}

	/**
	 * Checks if there's a solid tile at the specified column and row.
	 * @param {number} col - The column to check.
	 * @param {number} row - The row to check.
	 * @returns {boolean} True if there's a solid tile, false otherwise.
	 */
	isSolidTileAt(col, row) {
		const tile = this.foregroundLayer.getTile(col, row);
		return tile !== null && tile.id !== -1;
	}

	isSolidTileExcludingPlatformAt(col, row) {
		const tile = this.foregroundLayer.getTile(col, row);
		return tile !== null && tile.id !== -1 && tile.id !== 3 && tile.id !== 4 && tile.id !== 1;
	}

	/**
	 * Renders a debug grid over the map.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	renderGrid(context) {
		context.save();
		context.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // White with transparency
		context.lineWidth = 0.5;

		// Render vertical lines
		for (let x = 0; x <= this.width; x++) {
			context.beginPath();
			context.moveTo(x * this.tileSize, 0);
			context.lineTo(x * this.tileSize, this.height * this.tileSize);
			context.stroke();
		}

		// Render horizontal lines
		for (let y = 0; y <= this.height; y++) {
			context.beginPath();
			context.moveTo(0, y * this.tileSize);
			context.lineTo(this.width * this.tileSize, y * this.tileSize);
			context.stroke();
		}

		context.restore();
	}
}
