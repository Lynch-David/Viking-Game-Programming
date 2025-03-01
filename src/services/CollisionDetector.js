import GameEntity from '../entities/GameEntity.js';
import SoundName from '../enums/SoundName.js';
import TileType from '../enums/TileType.js';
import { sounds } from '../globals.js';
import IceTile from '../objects/IceTile.js';
import SlimeTile from '../objects/SlimeTile.js';
import StickyTile from '../objects/StickyTile.js';
import Tile from '../objects/Tile.js';
import Map from './Map.js';

/**
 * Handles collision detection for entities in the game world.
 */
export default class CollisionDetector {
	/**
	 * Creates a new CollisionDetector.
	 * @param {Map} map - The game map containing collision information.
	 */
	constructor(map) {
		this.map = map;
	}

	/**
	 * Checks and resolves horizontal collisions for an entity.
	 * @param {GameEntity} entity - The entity to check collisions for.
	 */
	checkHorizontalCollisions(entity) {
		
		const tileSize = this.map.tileSize;
		const tileLeft = Math.floor(entity.position.x / tileSize);
		const tileRight = Math.floor(
			(entity.position.x + entity.dimensions.x) / tileSize
		);
		const tileTop = Math.floor(entity.position.y / tileSize);
		const tileBottom = Math.floor(
			(entity.position.y + entity.dimensions.y - 1) / tileSize
		);
		
		if (entity.velocity.x > 0) {
			// Moving right
			if (this.isSolidTileInColumn(tileRight, tileTop, tileBottom)) {
				// Collision on the right side
				sounds.play(SoundName.WallBump);
				entity.position.x = tileRight * tileSize - entity.dimensions.x;
				if (!entity.isSliding) {
					entity.velocity.x *= -1;
				}
			}
		} else if (entity.velocity.x < 0) {
			// Moving left
			if (this.isSolidTileInColumn(tileLeft, tileTop, tileBottom)) {
				// Collision on the left side
				sounds.play(SoundName.WallBump);
				entity.position.x = (tileLeft + 1) * tileSize;
				if (!entity.isSliding) {
					entity.velocity.x *= -1;
				}
			}
		}
	}

	/**
	 * Checks and resolves vertical collisions for an entity.
	 * @param {GameEntity} entity - The entity to check collisions for.
	 */
	checkVerticalCollisions(entity) {
		const tileSize = this.map.tileSize;
		const tileLeft = Math.floor(entity.position.x / tileSize);
		const tileRight = Math.floor(
			(entity.position.x + entity.dimensions.x - 1) / tileSize
		);
		const tileTop = Math.floor(entity.position.y / tileSize);
		const tileBottom = Math.floor(
			(entity.position.y + entity.dimensions.y) / tileSize
		);

		entity.isOnGround = false;

		if (entity.velocity.y >= 0) {
			// Falling or on ground
			if (this.isSolidTileInRow(tileBottom, tileLeft, tileRight)) {
				// Collision below while checking for if that tile is a special tile type
				switch (this.isSpecialTileInRow(tileBottom, tileLeft, tileRight)) {
					case TileType.Sticky:
						StickyTile.applyBehavior(entity) 
						break;
					case TileType.Ice:
						IceTile.applyBehavior(entity) 
						break;
					case TileType.Slime:
						SlimeTile.applyBehavior(entity) 
						break;
					default:
						// Set entity values to default
						entity.isSticky = false;
						entity.isSliding = false;
						entity.isBouncing = false;
						break;
				}
				if(entity.isBouncing && entity.velocity.y >= 400){
					// Checks for if the entity is on a slime tile block, if so we boost the player essentially causing
					// the player to jump, checking for the velocity so that the player had a long enough time to fall before bouncing.
					entity.boost()
				}
				else{
					entity.position.y = tileBottom * tileSize - entity.dimensions.y;
					entity.velocity.y = 0;
	
					entity.isOnGround = true;
				}

			}
		} else if (entity.velocity.y < 0) {
			// Jumping or moving upwards
			if (this.isSolidTileInRow(tileTop, tileLeft, tileRight)) {
				// Collision above
				entity.position.y = (tileTop + 1) * tileSize;
				entity.velocity.y = 0;
			}
		}
	}

	/**
	 * Checks if there's a solid tile in a vertical column of tiles.
	 * @param {number} x - The x-coordinate of the column to check.
	 * @param {number} yStart - The starting y-coordinate of the column.
	 * @param {number} yEnd - The ending y-coordinate of the column.
	 * @returns {boolean} True if a solid tile is found, false otherwise.
	 */
	isSolidTileInColumn(x, yStart, yEnd) {
		for (let y = yStart; y <= yEnd; y++) {
			if (this.map.isSolidTileAt(x, y) || x === 16 || x === -1) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks if there's a solid tile in a horizontal row of tiles.
	 * @param {number} y - The y-coordinate of the row to check.
	 * @param {number} xStart - The starting x-coordinate of the row.
	 * @param {number} xEnd - The ending x-coordinate of the row.
	 * @returns {boolean} True if a solid tile is found, false otherwise.
	 */
	isSolidTileInRow(y, xStart, xEnd) {
		for (let x = xStart; x <= xEnd; x++) {
			if (this.map.isSolidTileAt(x, y)) {
				return true;
			}
		}
		return false;
	}

	isSpecialTileInRow(y, xStart, xEnd) {
		for (let x = xStart; x <= xEnd; x++) {
			if (this.map.isStickyTileAt(x, y)) {
				return TileType.Sticky;
			}
			else if (this.map.isIceTileAt(x, y)) {
				return TileType.Ice;
			}
			else if (this.map.isSlimeTileAt(x, y)) {
				return TileType.Slime;
			}
		}
		return false;
	}
}
