/**
 * Game Name
 *
 * Authors
 *
 * Brief description
 *
 * Asset sources
 */

import GameStateName from './enums/GameStateName.js';
import Game from '../lib/Game.js';
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	timer,
	sounds,
	stateMachine,
} from './globals.js';
import PlayState from './states/PlayState.js';
import VictoryState from './states/VictoryState.js';
import TitleScreenState from './states/TitleScreenState.js';
import StatsState from './states/StatsState.js';
import PauseState from './states/PauseState.js';
import SoundName from './enums/SoundName.js';

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

const mapDefinition = await fetch('./src/tilemap.json').then((response) =>
	response.json()
);

// Add all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Play, new PlayState(mapDefinition));
stateMachine.add(GameStateName.Pause, new PauseState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Stats, new StatsState());

stateMachine.change(GameStateName.TitleScreen);

const game = new Game(
	stateMachine,
	context,
	timer,
	canvas.width,
	canvas.height
);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();

sounds.play(SoundName.TitleMusic);

