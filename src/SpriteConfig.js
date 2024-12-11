import Sprite from '../lib/Sprite.js';

export const spriteConfig = {
	idle: [{ x: 24, y: 584, width: 288, height: 128 }],
	duck: [{ x: 128, y: 600, width: 16, height: 16 }],
	walk: [
		{ x: 180, y: 584, width: 16, height: 32 },
		{ x: 232, y: 584, width: 16, height: 32 },
		{ x: 284, y: 584, width: 16, height: 32 },
	],
	run: [
		{ x: 336, y: 584, width: 18, height: 32 },
		{ x: 388, y: 584, width: 18, height: 32 },
		{ x: 440, y: 584, width: 18, height: 32 },
	],
	jump: [{ x: 76, y: 655, width: 16, height: 32 }],
	fall: [{ x: 128, y: 655, width: 16, height: 32 }],
	runJump: [{ x: 180, y: 655, width: 19, height: 32 }],
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
