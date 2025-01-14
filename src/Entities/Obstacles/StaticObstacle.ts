/**
 * A static obstacle that doesn't move or animate. This includes trees, rocks, etc.
 */

import { IMAGE_NAMES } from "../../Constants";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { Obstacle, OBSTACLE_CATEGORY } from "./Obstacle";

/**
 * Different types of static obstacles
 */
export const STATIC_OBSTACLE_CONFIG: Partial<Record<IMAGE_NAMES, { canJumpOver: boolean }>> = {
    [IMAGE_NAMES.TREE]: { canJumpOver: false },
    [IMAGE_NAMES.TREE_CLUSTER]: { canJumpOver: false },
    [IMAGE_NAMES.ROCK1]: { canJumpOver: true },
    [IMAGE_NAMES.ROCK2]: { canJumpOver: true },
    [IMAGE_NAMES.JUMP_RAMP]: { canJumpOver: false }, // Jump ramps aren't jumped over, they're used for jumping
};

export class StaticObstacle extends Obstacle {
    constructor(type: IMAGE_NAMES, x: number, y: number, imageManager: ImageManager, canvas: Canvas) {
        const config = STATIC_OBSTACLE_CONFIG[type];
        if (!config) {
            throw new Error(`Invalid static obstacle type: ${type}`);
        }

        super(
            type,
            OBSTACLE_CATEGORY.STATIC,
            config.canJumpOver,
            true, // All current static obstacles can be crashed into
            x,
            y,
            imageManager,
            canvas
        );
    }

    /**
     * Static obstacles don't need to update
     */
    update(gameTime: number): void {
        // No update needed for static obstacles
    }
}