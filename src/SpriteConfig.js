import Sprite from '../lib/Sprite.js';

export const spriteConfig = {
	idle: [{ x: 24, y: 584, width: 16, height: 32 }],
	lookUp: [{ x: 76, y: 584, width: 16, height: 32 }],
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
	skid: [{ x: 724, y: 584, width: 16, height: 32 }],
	pipe: [{ x: 24, y: 655, width: 16, height: 32 }],
	jump: [{ x: 76, y: 655, width: 16, height: 32 }],
	fall: [{ x: 128, y: 655, width: 16, height: 32 }],
	runJump: [{ x: 180, y: 655, width: 19, height: 32 }],
	spinJump: [
		{ x: 232, y: 584, width: 16, height: 32 },
		{ x: 284, y: 584, width: 16, height: 32 },
		{ x: 336, y: 584, width: 16, height: 32 },
		{ x: 388, y: 584, width: 16, height: 32 },
	],
	slide: [{ x: 440, y: 655, width: 16, height: 32 }],
	kick: [{ x: 492, y: 655, width: 16, height: 32 }],
	swim: [
		{ x: 544, y: 566, width: 20, height: 32 },
		{ x: 596, y: 566, width: 20, height: 32 },
		{ x: 648, y: 566, width: 20, height: 32 },
	],
	victory: [{ x: 700, y: 655, width: 16, height: 32 }],
	death: [{ x: 544, y: 266, width: 16, height: 32 }],
	dust: [
		{ x: 12, y: 3566, width: 8, height: 8 },
		{ x: 32, y: 3566, width: 8, height: 8 },
		{ x: 52, y: 3566, width: 8, height: 8 },
	],
	sparkles: [
		{ x: 307, y: 3566, width: 8, height: 8 },
		{ x: 327, y: 3566, width: 8, height: 8 },
		{ x: 347, y: 3566, width: 8, height: 8 },
	],
	shrink: [
		{ x: 700, y: 258, width: 16, height: 32 }, // big
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 700, y: 258, width: 16, height: 32 }, // big
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 700, y: 258, width: 16, height: 32 }, // big
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 596, y: 258, width: 16, height: 32 }, // small
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 596, y: 258, width: 16, height: 32 }, // small
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 596, y: 258, width: 16, height: 32 }, // small
	],
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
