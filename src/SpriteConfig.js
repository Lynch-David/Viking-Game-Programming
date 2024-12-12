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
	  { x: 4724, y: 599, width: 53, height: 39 },
	  { x: 5012, y: 596, width: 54, height: 42 },
	  { x: 5298, y: 596, width: 60, height: 42 },

	],
	crouch: [
	  { x: 420, y: 863, width: 49, height: 31 },
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
