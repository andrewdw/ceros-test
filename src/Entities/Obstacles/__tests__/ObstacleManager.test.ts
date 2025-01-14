import { ObstacleManager } from '../ObstacleManager';
import { ImageManager } from '../../../Core/ImageManager';
import { Canvas } from '../../../Core/Canvas';
import { OBSTACLE_TYPES } from '../ObstacleRegistry';
import { Rect } from '../../../Core/Utils';
import { MovingObstacle } from '../MovingObstacle';
import { StaticObstacle } from '../StaticObstacle';

// mock dependencies
jest.mock('../../../Core/ImageManager');
jest.mock('../../../Core/Canvas');

describe('ObstacleManager', () => {
    let obstacleManager: ObstacleManager;
    let mockImageManager: jest.Mocked<ImageManager>;
    let mockCanvas: jest.Mocked<Canvas>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create mock instances
        mockImageManager = new ImageManager() as jest.Mocked<ImageManager>;
        mockCanvas = new Canvas('test', 800, 600) as jest.Mocked<Canvas>;

        // Create obstacle manager instance
        obstacleManager = new ObstacleManager(mockImageManager, mockCanvas);
    });

    describe('getRandomObstacleName', () => {
        it('should return valid obstacle types', () => {
            // test multiple times to account for randomness
            for (let i = 0; i < 100; i++) {
                const result = obstacleManager.getRandomObstacleName();
                expect(Object.values(OBSTACLE_TYPES)).toContain(result);
            }
        });
    });

    describe('placeRandomObstacle', () => {
        it('should create and add a static obstacle', () => {
            const testArea = new Rect(0, 0, 100, 100);

            // mock getRandomObstacleName to return a static obstacle
            jest.spyOn(obstacleManager, 'getRandomObstacleName')
                .mockReturnValue(OBSTACLE_TYPES.ROCK1);

            obstacleManager.placeRandomObstacle(testArea);

            // check if obstacle was added
            expect(obstacleManager.getObstacles()).toHaveLength(1);
            expect(obstacleManager.getObstacles()[0]).toBeInstanceOf(StaticObstacle);
        });

        it('should create and add a moving obstacle', () => {
            const testArea = new Rect(0, 0, 100, 100);

            // mock getRandomObstacleName to return a moving obstacle
            jest.spyOn(obstacleManager, 'getRandomObstacleName')
                .mockReturnValue(OBSTACLE_TYPES.DOG);

            obstacleManager.placeRandomObstacle(testArea);

            // Check if obstacle was added
            expect(obstacleManager.getObstacles()).toHaveLength(1);
            expect(obstacleManager.getObstacles()[0]).toBeInstanceOf(MovingObstacle);
        });
    });

    describe('placeInitialObstacles', () => {
        it('should place multiple obstacles', () => {
            obstacleManager.placeInitialObstacles();

            // Should have placed at least one obstacle
            expect(obstacleManager.getObstacles().length).toBeGreaterThan(0);
        });

        it('should sort obstacles by y position', () => {
            obstacleManager.placeInitialObstacles();

            const obstacles = obstacleManager.getObstacles();
            for (let i = 1; i < obstacles.length; i++) {
                expect(obstacles[i].getPosition().y).toBeGreaterThanOrEqual(obstacles[i-1].getPosition().y);
            }
        });
    });

    describe('drawObstacles', () => {
        it('should update moving obstacles', () => {
            // create a moving obstacle (dog)
            const testArea = new Rect(0, 0, 100, 100);
            jest.spyOn(obstacleManager, 'getRandomObstacleName')
                .mockReturnValue(OBSTACLE_TYPES.DOG);
            obstacleManager.placeRandomObstacle(testArea);

            const gameTime = Date.now();
            const obstacle = obstacleManager.getObstacles()[0] as MovingObstacle;
            const updateSpy = jest.spyOn(obstacle, 'update');
            const drawSpy = jest.spyOn(obstacle, 'draw');

            obstacleManager.drawObstacles(gameTime);

            expect(updateSpy).toHaveBeenCalledWith(gameTime);
            expect(drawSpy).toHaveBeenCalled();
        });

        it('should not update static obstacles', () => {
            // create a static obstacle (rock)
            const testArea = new Rect(0, 0, 100, 100);
            jest.spyOn(obstacleManager, 'getRandomObstacleName')
                .mockReturnValue(OBSTACLE_TYPES.ROCK1);
            obstacleManager.placeRandomObstacle(testArea);

            const gameTime = Date.now();
            const obstacle = obstacleManager.getObstacles()[0];
            const drawSpy = jest.spyOn(obstacle, 'draw');

            obstacleManager.drawObstacles(gameTime);

            expect(drawSpy).toHaveBeenCalled();
        });
    });
});