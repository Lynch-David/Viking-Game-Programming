import Easing from './Easing.js';

/**
 * Uses delta time passed in from our game loop to keep track of individual
 * tasks over a given period of time. You can specify an action to be done at
 * each interval of time, or only once after a duration. There is also a tween
 * function that makes use of the timer mechanism to interpolate a value between
 * a start and end value.
 */
export default class Timer {
    constructor() {
        this.tasks = [];
        this.paused = false; // Add a paused flag
    }

    update(dt) {
        if (this.paused) return; // Skip updating tasks if paused
        this.removeFinishedTasks();
        this.updateTasks(dt);
    }

    /**
     * Adds a task to the timer's list of tasks to be run.
     *
     * @param {function} action The function to execute after a certain period of time.
     * @param {number} interval How often the action should execute (frequency).
     * @param {number} duration How long the task will be tracked in this.tasks.
     * @param {function} callback The function to execute after duration has passed.
     */
    addTask(action, interval, duration = 0, callback = () => {}) {
        this.tasks.push(new Task(action, interval, duration, callback));
    }

    /**
     * Loops through the tasks and updates them accordingly based on delta time.
     *
     * @param {number} dt How much time has elapsed since the last time this was called.
     */
    updateTasks(dt) {
        this.tasks.forEach((task) => {
            task.update(dt);
        });
    }

    /**
     * Removes the finished tasks by looping through each tasks and checking the isDone flag.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    removeFinishedTasks() {
        this.tasks = this.tasks.filter((task) => !task.isDone);
    }

    clear() {
        this.tasks = [];
    }

    /**
     * Interpolate a value until a specified value is reached over a specified period of time in seconds.
     *
     * @param {object} object An object that has at least one numerical property to interpolate.
     * @param {array} parameters The properties of the object to interpolate (as strings) and the final numerical values the parameters should reach.
     * @param {number} duration How long the interpolation should take.
     * @param {function} callback The function to execute after duration has passed.
     */
    tween(
        object,
        parameters,
        duration,
        easing = Easing.linear,
        callback = () => {}
    ) {
        const startingValues = JSON.parse(JSON.stringify(object)); // Remove extra parameters (ex. prototype).
        const keys = Object.keys(parameters);

        this.addTask(
            (time) => {
                keys.forEach((key) => {
                    // Calculate the direction in case we have to tween values from high to low.
                    const direction =
                        parameters[key] - object[key] > 0 ? 1 : -1;
                    const startValue = startingValues[key];
                    const endValue = parameters[key];
                    const currentValue = easing(
                        time,
                        startValue,
                        endValue - startValue,
                        duration
                    );

                    if (direction === 1) {
                        object[key] = Math.min(endValue, currentValue);
                    } else {
                        object[key] = Math.max(endValue, currentValue);
                    }
                });
            },
            0,
            duration,
            callback
        );
    }

    async tweenAsync(object, parameters, duration, easing = Easing.linear) {
        return new Promise((resolve) => {
            this.tween(object, parameters, duration, easing, resolve);
        });
    }

    async wait(duration) {
        return new Promise((resolve) => {
            this.addTask(() => {}, 0, duration, resolve);
        });
    }

    // Add pause method
    pause() {
        this.paused = true;
    }

    // Add resume method
    resume() {
        this.paused = false;
    }
}

class Task {
    /**
     * Represents an action to be done after a certain period of time.
     *
     * @param {function} action The function to execute after a certain period of time.
     * @param {number} interval How often the action should execute (frequency).
     * @param {number} duration How long the task will be tracked in this.tasks.
     * @param {function} callback The function to execute after duration has passed.
     */
    constructor(action, interval, duration = 0, callback = () => {}) {
        this.action = action;
        this.interval = interval;
        this.intervalTimer = 0;
        this.totalTime = 0;
        this.duration = duration;
        this.callback = callback;
        this.isDone = false;
    }

    update(dt) {
        this.intervalTimer += dt; // Counts from 0 until interval.
        this.totalTime += dt; // Counts from 0 until duration.

        // An interval of 0 means we're tweening.
        if (this.interval === 0) {
            this.action(this.totalTime);
        }
        // Otherwise, at every interval, execute the action.
        else if (this.intervalTimer >= this.interval) {
            this.action();
            this.intervalTimer = 0;
        }

        // At the end of the duration, execute the callback.
        if (this.duration !== 0 && this.totalTime >= this.duration) {
            this.callback();
            this.isDone = true;
        }
    }
}