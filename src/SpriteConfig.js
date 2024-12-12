import Sprite from '../lib/Sprite.js';

export const spriteConfig = {
	idle: [
	  { x: 127, y: 87, width: 44, height: 40 }
	],
	walk: [
	  { x: 0, y: 128, width: 288, height: 128 },
	  { x: 288, y: 128, width: 288, height: 128 },
	  { x: 576, y: 128, width: 288, height: 128 },
	  { x: 864, y: 128, width: 288, height: 128 },
	],
	jump: [
	  { x: 0, y: 256, width: 288, height: 128 },
	  { x: 288, y: 256, width: 288, height: 128 },
	],
	fall: [
	  { x: 0, y: 384, width: 288, height: 128 },
	],
	land: [
	  { x: 4896, y: 512, width: 288, height: 128 },
	  { x: 5184, y: 512, width: 288, height: 128 },
	  { x: 5472, y: 512, width: 288, height: 128 },
	  { x: 5760, y: 512, width: 288, height: 128 },

	],
	crouch: [
	  { x: 288, y: 640, width: 288, height: 128 },
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
