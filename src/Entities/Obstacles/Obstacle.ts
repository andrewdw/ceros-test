/**
 * Base class for all obstacles in the game. Different types of obstacles can extend this
 * to implement their own behavior and animations.
 */

import { IMAGE_NAMES } from "../../Constants";
import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { Entity } from "../Entity";

/**
 * The different categories of obstacles
 */
export enum OBSTACLE_CATEGORY {
    STATIC = "static",    // Non-moving, non-animated obstacles (rocks)
    ANIMATED = "animated", // Animated but stationary obstacles (flags, lifts)
    MOVING = "moving",    // Moving obstacles (other skiers, snowmobiles)
    INTERACTIVE = "interactive" // Obstacles that can be interacted with (jumps, gates)
}

/**
 * Base class for all obstacles
 */
export abstract class Obstacle extends Entity {
    /**
     * The name of the current image being displayed for the obstacle.
     */
    imageName: IMAGE_NAMES;

    /**
     * The category this obstacle belongs to
     */
    protected category: OBSTACLE_CATEGORY;

    /**
     * Whether the skier can jump over this obstacle
     */
    protected canJumpOver: boolean;

    /**
     * Whether this obstacle can be crashed into
     */
    protected canCrashInto: boolean;

    /**
     * Initialize an obstacle
     */
    constructor(
        type: IMAGE_NAMES,
        category: OBSTACLE_CATEGORY,
        canJumpOver: boolean,
        canCrashInto: boolean,
        x: number,
        y: number,
        imageManager: ImageManager,
        canvas: Canvas
    ) {
        super(x, y, imageManager, canvas);
        this.imageName = type;
        this.category = category;
        this.canJumpOver = canJumpOver;
        this.canCrashInto = canCrashInto;
    }

    /**
     * Get the current state of the obstacle.
     */
    protected getState(): string {
        return "";
    }

    /**
     * Obstacles can't be destroyed
     */
    die(): void {}
}
