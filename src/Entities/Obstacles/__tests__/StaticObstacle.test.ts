import { StaticObstacle } from '../StaticObstacle';
import { ImageManager } from '../../../Core/ImageManager';
import { Canvas } from '../../../Core/Canvas';
import { OBSTACLE_TYPES } from '../ObstacleRegistry';

// mock dependencies
jest.mock('../../../Core/ImageManager');
jest.mock('../../../Core/Canvas');

describe('StaticObstacle', () => {
    let mockImageManager: jest.Mocked<ImageManager>;
    let mockCanvas: jest.Mocked<Canvas>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Create mock instances
        mockImageManager = new ImageManager() as jest.Mocked<ImageManager>;
        mockCanvas = new Canvas('test', 800, 600) as jest.Mocked<Canvas>;
    });

    describe('constructor', () => {
        it('should initialize with correct position', () => {
            const obstacle = new StaticObstacle(
                OBSTACLE_TYPES.TREE,
                100,
                200,
                mockImageManager,
                mockCanvas
            );

            expect(obstacle).toBeDefined();
            expect(obstacle.getPosition().x).toBe(100);
            expect(obstacle.getPosition().y).toBe(200);
        });

        it('should throw error for invalid obstacle type', () => {
            expect(() => {
                new StaticObstacle(
                    'INVALID_TYPE' as OBSTACLE_TYPES,
                    100,
                    200,
                    mockImageManager,
                    mockCanvas
                );
            }).toThrow('Invalid static obstacle type');
        });
    });

    describe('update', () => {
        it('should not modify position when updated', () => {
            const obstacle = new StaticObstacle(
                OBSTACLE_TYPES.TREE,
                100,
                200,
                mockImageManager,
                mockCanvas
            );

            const initialPosition = obstacle.getPosition();
            obstacle.update(Date.now());

            expect(obstacle.getPosition()).toEqual(initialPosition);
        });
    });

    describe('drawing', () => {
        it('should call drawImage on canvas', () => {
            const obstacle = new StaticObstacle(
                OBSTACLE_TYPES.TREE,
                100,
                200,
                mockImageManager,
                mockCanvas
            );

            // Mock getImage to return a dummy image
            mockImageManager.getImage.mockReturnValue({} as HTMLImageElement);

            obstacle.draw();

            expect(mockCanvas.drawImage).toHaveBeenCalled();
        });
    });
});