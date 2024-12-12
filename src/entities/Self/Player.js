import { images } from '../../globals.js';
import Vector from '../../../lib/Vector.js';
import ImageName from '../../enums/ImageName.js';
import Map from '../../services/Map.js';
import GameEntity from '../GameEntity.js';
import StateMachine from '../../../lib/StateMachine.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import PlayerWalkingState from './PlayerWalkingState.js';
import PlayerJumpingState from './PlayerJumpingState.js';
import PlayerFallingState from './PlayerFallingState.js';
import PlayerIdlingState from './PlayerIdlingState.js';
import { loadPlayerSprites, spriteConfig } from '../../SpriteConfig.js';
import { timer } from '../../globals.js';
import { sounds } from '../../globals.js';
import Animation from "../../../lib/Animation.js";
import PlayerLandingState from './PlayerLandingState.js';

/**
 * Represents the player character in the game.
 * @extends Entity
 */
export default class Player extends GameEntity {
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
			spriteConfig
		);


		// Create animations for different player states
		this.animations = {
			idle: new Animation(this.sprites.idle),
			walk: new Animation(this.sprites.walk, 0.2),
			jump: new Animation(this.sprites.jump),
			fall: new Animation(this.sprites.fall),
			land: new Animation(this.sprites.land, 0.2, 1),
			crouch: new Animation(this.sprites.crouch),
		};
		  



		this.currentAnimation = this.animations.idle;

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
			PlayerStateName.Falling,
			new PlayerFallingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Landing,
			new PlayerLandingState(this)
		);
		// this.stateMachine.add(
		// 	PlayerStateName.Crouching,
		// 	new PlayerFallingState(this)
		// );
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
	}

	/**
	 * Renders the player.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		this.stateMachine.render(context);
	}
}
