import { images } from '../../globals.js';
import {
	bigSpriteConfig,
	loadPlayerSprites,
	smallSpriteConfig,
} from '../../../config/SpriteConfig.js';
import Vector from '../../../lib/Vector.js';
import ImageName from '../../enums/ImageName.js';
import Animation from '../../../lib/Animation.js';
import Map from '../../services/Map.js';
import Entity from '../Entity.js';
import StateMachine from '../../../lib/StateMachine.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import PlayerWalkingState from './PlayerWalkingState.js';
import PlayerJumpingState from './PlayerJumpingState.js';
import PlayerSkiddingState from './PlayerSkiddingState.js';
import PlayerFallingState from './PlayerFallingState.js';
import PlayerIdlingState from './PlayerIdlingState.js';
import PlayerGrowingState from './PlayerGrowingState.js';
import PlayerShrinkingState from './PlayerShrinkingState.js';
import { timer } from '../../globals.js';
import Easing from '../../../lib/Easing.js';
import PlayerDyingState from './PlayerDyingState.js';
import { sounds } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';
import MusicName from '../../enums/MusicName.js';

/**
 * Represents the player character in the game.
 * @extends Entity
 */
export default class Player extends Entity {
	/**
	 * Creates a new Player instance.
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the player.
	 * @param {number} height - The height of the player.
	 * @param {Map} map - The game map instance.
	 */
	constructor(x, y, width, height, map) {
		super(x, y, width, height);

		this.initialPosition = new Vector(x, y);
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.map = map;
		this.jumpTime = 0;
		this.facingRight = true;

		this.didFall = false;

		this.sprites = loadPlayerSprites(
			images.get(ImageName.Player),
			smallSpriteConfig
		);


		// Create animations for different player states
		this.animations = {
			idle: new Animation(this.sprites.idle),
			walk: new Animation(this.sprites.walk, 0.07),
			jump: new Animation(this.sprites.jump),
			fall: new Animation(this.sprites.fall),
		};


		this.sizeAnimations = this.animations;

		this.currentAnimation = this.sizeAnimations.idle;

		// Initialize state machine for player behavior
		this.stateMachine = new StateMachine();

		// Add states to the state machine
		this.stateMachine.add(
			PlayerStateName.Walking,
			new PlayerWalkingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Jumping,
			new PlayerJumpingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Shrinking,
			new PlayerShrinkingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Falling,
			new PlayerFallingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Idling,
			new PlayerIdlingState(this)
		);
	}

	/**
	 * Updates the player's state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		this.stateMachine.update(dt);
		if (!this.dies) {
			this.checkGoombaCollision();
			this.checkMushroomCollision();
		}
	}

	/**
	 * Renders the player.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		this.stateMachine.render(context);
	}

	/**
	 * Checks for collisions with Goombas.
	 */
	checkGoombaCollision = () => {
		this.map.goombas.forEach((goomba) => {
			if (this.collidesWith(goomba) && !goomba.isDead) {
				goomba.onCollideWithPlayer(this);
			}
		});
	};

	checkMushroomCollision = () => {
		this.map.mushrooms.forEach((mushroom) => {
			if (this.collidesWith(mushroom)) {
				mushroom.onCollideWithPlayer(this);
			}
		});
	};

	/**
	 * Handles player death by resetting position.
	 */
	async die(didFall) {
		if (this.isBig) {
			this.isBig = false;
			sounds.play(SoundName.Powerup)
			this.stateMachine.change(PlayerStateName.Shrinking);
			this.sizeAnimations = this.animations;
		}
		else if(this.isSmall){
			this.didFall = didFall
			this.dies = true;
			sounds.play(MusicName.PlayerDown)
			this.stateMachine.change(PlayerStateName.Dying);
		}
	}

	grow() {
		if(this.isSmall){
			this.isBig = true;
			this.isSmall = false;
			this.stateMachine.change(PlayerStateName.Growing);
			this.sizeAnimations = this.growAnimations;
		}
	}
}
