/**
 * A static obstacle that doesn't move or animate. This includes trees, rocks, etc.
 */

import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { Obstacle, OBSTACLE_CATEGORY } from "./Obstacle";
import { OBSTACLE_REGISTRY, OBSTACLE_TYPES } from "./ObstacleRegistry";

export class StaticObstacle extends Obstacle {
    constructor(type: OBSTACLE_TYPES, x: number, y: number, imageManager: ImageManager, canvas: Canvas) {
        const config = OBSTACLE_REGISTRY[type];
        if (!config) {
            throw new Error(`Invalid static obstacle type: ${type}`);
        }

        super(
            config.imageName,
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