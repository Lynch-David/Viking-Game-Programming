import Sprite from '../lib/Sprite.js';

export const spriteConfig = {
	idle: [
		{ x: 127, y: 87, width: 44, height: 40 }
	],
	walk: [
		{ x: 131, y: 208, width: 40, height: 44 },
		{ x: 416, y: 207, width: 40, height: 44 },
		{ x: 708, y: 208, width: 40, height: 44 },
		{ x: 997, y: 211, width: 40, height: 43 },
	],
	jump: [
		//   { x: 126, y: 600, width: 37, height: 38 },
		{ x: 416, y: 595, width: 38, height: 43 },
	],
	fall: [
		{ x: 2721, y: 597, width: 37, height: 38 },
	],
	land: [
		{ x: 5012, y: 596, width: 54, height: 43 },
		{ x: 5298, y: 596, width: 60, height: 43 },
		{ x: 4724, y: 595, width: 53, height: 44 },

	],
	crouch: [
		{ x: 420, y: 863, width: 49, height: 31 },
	]
};

export const birdSpriteConfig = {
	fly: [
		{x: 0, y: 144, width: 48, height: 48},
		{x: 48, y: 144, width: 48, height: 48},
		{x: 96, y: 144, width: 48, height: 48},
		{x: 144, y: 144, width: 48, height: 48},
	]
};

export function loadPlayerSprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}
