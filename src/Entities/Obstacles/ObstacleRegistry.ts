/**
 * Registry for all obstacles in the game. Maps obstacle names to their properties.
 */

import { IMAGE_NAMES } from "../../Constants";
import { MOVE_DIRECTION, MOVEMENT_PATTERN, MovingObstacleConfig } from "./MovingObstacle";
import { randomInt } from "../../Core/Utils";

/**
 * Enum for obstacle types
 */
export enum OBSTACLE_TYPES {
    TREE = "tree",
    TREE_CLUSTER = "treeCluster",
    ROCK1 = "rock1",
    ROCK2 = "rock2",
    JUMP_RAMP = "jumpRamp",
    DOG = "dog",
}

/**
 * Configuration for different types of obstacles
 */
export interface ObstacleConfig {
    imageName: IMAGE_NAMES;
    canJumpOver: boolean;
    isMoving?: boolean;
    movingConfig?: () => MovingObstacleConfig; // Function to generate random config if needed
}

// Helper function to get a random dog configuration
function getRandomDogConfig(): MovingObstacleConfig {
    // 70% chance to run in a single direction, 30% chance to run back and forth
    const pattern = Math.random() < 0.7 ? MOVEMENT_PATTERN.SINGLE_DIRECTION : MOVEMENT_PATTERN.BACK_AND_FORTH;

    // For single direction, randomly choose left or right
    const direction = Math.random() < 0.5 ? MOVE_DIRECTION.LEFT : MOVE_DIRECTION.RIGHT;

    return {
        direction,
        pattern,
        animations: {
            [MOVE_DIRECTION.LEFT]: [IMAGE_NAMES.DOG_LEFT_1, IMAGE_NAMES.DOG_LEFT_2],
            [MOVE_DIRECTION.RIGHT]: [IMAGE_NAMES.DOG_RIGHT_1, IMAGE_NAMES.DOG_RIGHT_2],
        }
    };
}

/**
 * Configuration for different types of obstacles
 */
export const OBSTACLE_REGISTRY: Record<OBSTACLE_TYPES, ObstacleConfig> = {
    [OBSTACLE_TYPES.TREE]: { imageName: IMAGE_NAMES.TREE, canJumpOver: false },
    [OBSTACLE_TYPES.TREE_CLUSTER]: { imageName: IMAGE_NAMES.TREE_CLUSTER, canJumpOver: false },
    [OBSTACLE_TYPES.ROCK1]: { imageName: IMAGE_NAMES.ROCK1, canJumpOver: true },
    [OBSTACLE_TYPES.ROCK2]: { imageName: IMAGE_NAMES.ROCK2, canJumpOver: true },
    [OBSTACLE_TYPES.JUMP_RAMP]: { imageName: IMAGE_NAMES.JUMP_RAMP, canJumpOver: false }, // Jump ramps aren't jumped over, they're used for jumping
    [OBSTACLE_TYPES.DOG]: {
        imageName: IMAGE_NAMES.DOG_LEFT_1,
        canJumpOver: true,
        isMoving: true,
        movingConfig: getRandomDogConfig,
    },
};