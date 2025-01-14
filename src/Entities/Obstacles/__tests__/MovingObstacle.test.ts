import { MovingObstacle, MovingObstacleConfig, MOVE_DIRECTION, MOVEMENT_PATTERN } from '../MovingObstacle';
import { ImageManager } from '../../../Core/ImageManager';
import { Canvas } from '../../../Core/Canvas';
import { IMAGE_NAMES } from '../../../Constants';

// mock dependencies
jest.mock('../../../Core/ImageManager');
jest.mock('../../../Core/Canvas');

describe('MovingObstacle', () => {
    let mockImageManager: jest.Mocked<ImageManager>;
    let mockCanvas: jest.Mocked<Canvas>;

    beforeEach(() => {
        // clear all mocks before each test
        jest.clearAllMocks();

        // create mock instances
        mockImageManager = new ImageManager() as jest.Mocked<ImageManager>;
        mockCanvas = new Canvas('test', 800, 600) as jest.Mocked<Canvas>;
    });

    describe('constructor', () => {
        it('should initialize with correct config', () => {
            const config: MovingObstacleConfig = {
                direction: MOVE_DIRECTION.LEFT,
                pattern: MOVEMENT_PATTERN.SINGLE_DIRECTION,
                animations: {
                    [MOVE_DIRECTION.LEFT]: [IMAGE_NAMES.DOG_LEFT_1, IMAGE_NAMES.DOG_LEFT_2],
                    [MOVE_DIRECTION.RIGHT]: [IMAGE_NAMES.DOG_RIGHT_1, IMAGE_NAMES.DOG_RIGHT_2],
                }
            };

            const obstacle = new MovingObstacle(config, 100, 200, mockImageManager, mockCanvas);
            expect(obstacle).toBeDefined();
            expect(obstacle.getPosition().x).toBe(100);
            expect(obstacle.getPosition().y).toBe(200);
        });

        it('should throw error if no animations provided for initial direction', () => {
            const config: MovingObstacleConfig = {
                direction: MOVE_DIRECTION.LEFT,
                pattern: MOVEMENT_PATTERN.SINGLE_DIRECTION,
                animations: {
                    [MOVE_DIRECTION.RIGHT]: [IMAGE_NAMES.DOG_RIGHT_1, IMAGE_NAMES.DOG_RIGHT_2],
                }
            };

            expect(() => {
                new MovingObstacle(config, 100, 200, mockImageManager, mockCanvas);
            }).toThrow();
        });
    });

    describe('movement', () => {
        it('should move in single direction', () => {
            const config: MovingObstacleConfig = {
                direction: MOVE_DIRECTION.LEFT,
                pattern: MOVEMENT_PATTERN.SINGLE_DIRECTION,
                animations: {
                    [MOVE_DIRECTION.LEFT]: [IMAGE_NAMES.DOG_LEFT_1, IMAGE_NAMES.DOG_LEFT_2],
                }
            };

            const obstacle = new MovingObstacle(config, 100, 200, mockImageManager, mockCanvas);
            const initialX = obstacle.getPosition().x;

            // Update a few times
            for (let i = 0; i < 5; i++) {
                obstacle.update(Date.now());
            }

            expect(obstacle.getPosition().x).toBeLessThan(initialX);
        });

        it('should change direction in back and forth pattern', () => {
            const config: MovingObstacleConfig = {
                direction: MOVE_DIRECTION.LEFT,
                pattern: MOVEMENT_PATTERN.BACK_AND_FORTH,
                animations: {
                    [MOVE_DIRECTION.LEFT]: [IMAGE_NAMES.DOG_LEFT_1, IMAGE_NAMES.DOG_LEFT_2],
                    [MOVE_DIRECTION.RIGHT]: [IMAGE_NAMES.DOG_RIGHT_1, IMAGE_NAMES.DOG_RIGHT_2],
                }
            };

            const obstacle = new MovingObstacle(config, 100, 200, mockImageManager, mockCanvas);

            // Move left until boundary
            for (let i = 0; i < 100; i++) {
                obstacle.update(Date.now());
            }

            // Should now be moving right
            const positionBeforeRight = obstacle.getPosition().x;
            obstacle.update(Date.now());
            expect(obstacle.getPosition().x).toBeGreaterThan(positionBeforeRight);
        });
    });

    describe('animation', () => {
        it('should update animation frame', () => {
            const config: MovingObstacleConfig = {
                direction: MOVE_DIRECTION.LEFT,
                pattern: MOVEMENT_PATTERN.SINGLE_DIRECTION,
                animations: {
                    [MOVE_DIRECTION.LEFT]: [IMAGE_NAMES.DOG_LEFT_1, IMAGE_NAMES.DOG_LEFT_2],
                }
            };

            const obstacle = new MovingObstacle(config, 100, 200, mockImageManager, mockCanvas);

            // Mock time to force animation update
            const initialImage = obstacle.imageName;
            jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);

            obstacle.update(Date.now());
            expect(obstacle.imageName).not.toBe(initialImage);
        });
    });
});