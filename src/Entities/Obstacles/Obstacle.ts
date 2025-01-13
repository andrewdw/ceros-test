/**
 * An obstacle that appears on the mountain. Randomly created as one of the types defined in the OBSTACLE_TYPES array.
 */

import { IMAGE_NAMES } from "../../Constants";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { randomInt } from "../../Core/Utils";
import { Entity } from "../Entity";

/**
 * The different types of obstacles that can be placed in the game.
 */
export const OBSTACLE_TYPES: IMAGE_NAMES[] = [
    IMAGE_NAMES.TREE,
    IMAGE_NAMES.TREE_CLUSTER,
    IMAGE_NAMES.ROCK1,
    IMAGE_NAMES.ROCK2,
    IMAGE_NAMES.JUMP_RAMP,
];

/**
 * export object as helper for selecting objects directly
 **/
export const OBSTACLE_TYPES_DIR = OBSTACLE_TYPES.reduce((acc, type: IMAGE_NAMES) => {
    acc[type] = type;
    return acc;
}, {} as Record<IMAGE_NAMES, IMAGE_NAMES>);

export class Obstacle extends Entity {
    /**
     * The name of the current image being displayed for the obstacle.
     */
    imageName: IMAGE_NAMES;

    /**
     * Initialize an obstacle of the given type and position it on the game screen
     */
    constructor(x: number, y: number, imageManager: ImageManager, canvas: Canvas) {
        super(x, y, imageManager, canvas);

        const typeIdx = randomInt(0, OBSTACLE_TYPES.length - 1);
        this.imageName = OBSTACLE_TYPES[typeIdx];
    }

    /**
     * Get the current state of the obstacle. Obstacles don't have states, so return an empty string.
     */
    protected getState(): string {
        return "";
    }

    /**
     * Obstacles can't be destroyed
     */
    die() {}
}
