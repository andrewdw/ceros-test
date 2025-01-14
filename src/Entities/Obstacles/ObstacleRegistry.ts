/**
 * Registry for all obstacles in the game. Maps obstacle names to their properties.
 */

import { IMAGE_NAMES } from "../../Constants";

/**
 * Enum for obstacle types
 */
export enum OBSTACLE_TYPES {
    TREE = "tree",
    TREE_CLUSTER = "treeCluster",
    ROCK1 = "rock1",
    ROCK2 = "rock2",
    JUMP_RAMP = "jumpRamp",
}

/**
 * Configuration for different types of obstacles
 */
export const OBSTACLE_REGISTRY: Record<OBSTACLE_TYPES, { imageName: IMAGE_NAMES, canJumpOver: boolean }> = {
    [OBSTACLE_TYPES.TREE]: { imageName: IMAGE_NAMES.TREE, canJumpOver: false },
    [OBSTACLE_TYPES.TREE_CLUSTER]: { imageName: IMAGE_NAMES.TREE_CLUSTER, canJumpOver: false },
    [OBSTACLE_TYPES.ROCK1]: { imageName: IMAGE_NAMES.ROCK1, canJumpOver: true },
    [OBSTACLE_TYPES.ROCK2]: { imageName: IMAGE_NAMES.ROCK2, canJumpOver: true },
    [OBSTACLE_TYPES.JUMP_RAMP]: { imageName: IMAGE_NAMES.JUMP_RAMP, canJumpOver: false }, // Jump ramps aren't jumped over, they're used for jumping
};