/**
 * A moving obstacle that can animate and move around. This includes dogs, other skiers, etc.
 */

import { Canvas } from "../../Core/Canvas";
import { ImageManager } from "../../Core/ImageManager";
import { Animation } from "../../Core/Animation";
import { Obstacle, OBSTACLE_CATEGORY } from "./Obstacle";
import { IMAGE_NAMES } from "../../Constants";
import { randomInt } from "../../Core/Utils";

/**
 * The different directions a moving obstacle can travel
 */
export enum MOVE_DIRECTION {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down",
    DIAGONAL_LEFT_UP = "diagonalLeftUp",
    DIAGONAL_RIGHT_UP = "diagonalRightUp",
    DIAGONAL_LEFT_DOWN = "diagonalLeftDown",
    DIAGONAL_RIGHT_DOWN = "diagonalRightDown"
}

/**
 * The different movement patterns available
 */
export enum MOVEMENT_PATTERN {
    BACK_AND_FORTH = "backAndForth",
    SINGLE_DIRECTION = "singleDirection",
    DIAGONAL = "diagonal"
}

/**
 * The speed at of obstacle travel
 */
const MOVING_SPEED = 3;

/**
 * The distance the obstacle will move from its initial position
 */
const MOVEMENT_RANGE = 100;

export interface MovingObstacleConfig {
    direction: MOVE_DIRECTION;
    pattern: MOVEMENT_PATTERN;
    animations: {
        [key in MOVE_DIRECTION]?: IMAGE_NAMES[];
    };
}

export class MovingObstacle extends Obstacle {
    /**
     * The current direction of movement
     */
    private direction: MOVE_DIRECTION;

    /**
     * The movement pattern to follow
     */
    private pattern: MOVEMENT_PATTERN;

    /**
     * The speed at which the obstacle moves
     */
    private speed: number = MOVING_SPEED;

    /**
     * The initial position of the obstacle
     */
    private initialX: number;
    private initialY: number;

    /**
     * Initialize a moving obstacle with animations
     */
    constructor(
        config: MovingObstacleConfig,
        x: number,
        y: number,
        imageManager: ImageManager,
        canvas: Canvas
    ) {
        // Get the initial animation for the direction
        const directionImages = config.animations[config.direction];
        if (!directionImages || directionImages.length === 0) {
            throw new Error(`No animations provided for direction: ${config.direction}`);
        }

        super(
            directionImages[0], // Use first image of direction as default
            OBSTACLE_CATEGORY.MOVING,
            true, // Can be jumped over
            true, // Can be crashed into
            x,
            y,
            imageManager,
            canvas
        );

        this.direction = config.direction;
        this.pattern = config.pattern;
        this.initialX = x;
        this.initialY = y;

        this.setupAnimations(config.animations);
        this.setAnimation();
    }

    /**
     * Create and store the animations for each direction
     */
    private setupAnimations(animations: { [key in MOVE_DIRECTION]?: IMAGE_NAMES[] }) {
        // Set up animations for each provided direction
        Object.entries(animations).forEach(([direction, images]) => {
            if (images && images.length > 0) {
                this.animations[direction] = new Animation(images, true);
            }
        });
    }

    /**
     * Get the current state for animation purposes
     */
    protected getState(): string {
        return this.direction;
    }

    /**
     * Update the obstacle's position and animation
     */
    update(gameTime: number): void {
        this.move();
        this.animate(gameTime);
    }

    /**
     * Move the obstacle according to its pattern
     */
    private move(): void {
        // Apply movement based on direction
        switch (this.direction) {
            case MOVE_DIRECTION.LEFT:
                this.position.x -= this.speed;
                break;
            case MOVE_DIRECTION.RIGHT:
                this.position.x += this.speed;
                break;
            case MOVE_DIRECTION.UP:
                this.position.y -= this.speed;
                break;
            case MOVE_DIRECTION.DOWN:
                this.position.y += this.speed;
                break;
            // diagonal movement
            case MOVE_DIRECTION.DIAGONAL_LEFT_UP:
                this.position.x -= this.speed;
                this.position.y -= this.speed;
                break;
            case MOVE_DIRECTION.DIAGONAL_RIGHT_UP:
                this.position.x += this.speed;
                this.position.y -= this.speed;
                break;
            case MOVE_DIRECTION.DIAGONAL_LEFT_DOWN:
                this.position.x -= this.speed;
                this.position.y += this.speed;
                break;
            case MOVE_DIRECTION.DIAGONAL_RIGHT_DOWN:
                this.position.x += this.speed;
                this.position.y += this.speed;
                break;
        }

        // Handle pattern-specific behavior
        if (this.pattern === MOVEMENT_PATTERN.BACK_AND_FORTH) {
            this.handleBackAndForthMovement();
        }
    }

    /**
     * Handle back and forth movement pattern
     */
    private handleBackAndForthMovement(): void {
        // Only handle horizontal movement for now
        if (this.direction === MOVE_DIRECTION.LEFT && this.position.x <= this.initialX - MOVEMENT_RANGE) {
            this.direction = MOVE_DIRECTION.RIGHT;
            this.setAnimation();
        } else if (this.direction === MOVE_DIRECTION.RIGHT && this.position.x >= this.initialX + MOVEMENT_RANGE) {
            this.direction = MOVE_DIRECTION.LEFT;
            this.setAnimation();
        }
    }

}
