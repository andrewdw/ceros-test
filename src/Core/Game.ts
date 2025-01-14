/**
 * The main game class. This initializes the game as well as runs the game/render loop and initial handling of input.
 */

import { GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT, IMAGES, KEYS } from "../Constants";
import { Canvas } from "./Canvas";
import { ImageManager } from "./ImageManager";
import { Position, Rect } from "./Utils";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rhino } from "../Entities/Rhino";
import { Skier } from "../Entities/Skier";

export class Game {
    /**
     * The canvas the game will be displayed on
     */
    private canvas!: Canvas;

    /**
     * Coordinates denoting the active rectangular space in the game world
     * */
    private gameWindow!: Rect;

    /**
     * Current game time
     */
    private gameTime: number = Date.now();

    /**
     * Whether the game is currently paused
     */
    private isPaused: boolean = false;

    /**
     * Animation frame ID for canceling
     */
    private animationFrameId?: number;

    private imageManager!: ImageManager;

    private obstacleManager!: ObstacleManager;

    /**
     * The skier player
     */
    private skier!: Skier;

    /**
     * The enemy that chases the skier
     */
    private rhino!: Rhino;

    /**
     * Initialize the game and setup any input handling needed.
     */
    constructor() {
        this.init();
        this.setupInputHandling();
    }

    /**
     * Create all necessary game objects and initialize them as needed.
     */
    init() {
        this.canvas = new Canvas(GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT);
        this.imageManager = new ImageManager();
        this.obstacleManager = new ObstacleManager(this.imageManager, this.canvas);

        this.createEntities();
    }

    /**
     * create Entities in the game at their starting positions
     */
    private createEntities() {
        this.skier = new Skier(0, 0, this.imageManager, this.obstacleManager, this.canvas);
        this.rhino = new Rhino(-500, -20000, this.imageManager, this.canvas);

        this.calculateGameWindow();
        this.obstacleManager.placeInitialObstacles();
    }

    /**
     * reset the game state
     */
    private resetGame() {
        // clear all obstacles
        this.obstacleManager = new ObstacleManager(this.imageManager, this.canvas);

        // reset entities to starting positions
        this.createEntities();

        // Reset game time
        this.gameTime = Date.now();

        // Unpause if paused
        this.isPaused = false;
    }

    /**
     * Toggle the pause state
     */
    private togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            // Resume the game loop
            this.run();
        }
    }

    /**
     * Setup listeners for any input events we might need.
     */
    setupInputHandling() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    /**
     * Load any assets we need for the game to run. Return a promise so that we can wait on something until all assets
     * are loaded before running the game.
     */
    async load(): Promise<void> {
        await this.imageManager.loadImages(IMAGES);
    }

    /**
     * The main game loop. Clear the screen, update the game objects and then draw them.
     */
    run() {
        // clear the canvas
        this.canvas.clearCanvas();

        // Only update game state if not paused
        if (!this.isPaused) {
            this.updateGameWindow();
        }

        // Always draw the game window (and pause overlay if paused)
        this.drawGameWindow();

        // request the next frame
        this.animationFrameId = requestAnimationFrame(this.run.bind(this));
    }

    /**
     * Do any updates needed to the game objects
     */
    updateGameWindow() {
        this.gameTime = Date.now();

        const previousGameWindow: Rect = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        this.skier.update(this.gameTime);
        this.rhino.update(this.gameTime, this.skier);
    }

    /**
     * Draw all entities to the canvas
     */
    drawGameWindow() {
        this.canvas.clearCanvas();

        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        this.skier.draw();
        this.rhino.draw();
        this.obstacleManager.drawObstacles(this.gameTime);

        // Draw pause indicator if paused
        if (this.isPaused) {
            this.drawPauseIndicator();
        }
    }

    /**
     * Draw the pause indicator
     */
    private drawPauseIndicator() {
        const ctx = this.canvas.getContext();
        ctx.save();

        // Reset any existing transforms/offsets
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw "PAUSED" text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // Draw instructions
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Press P to resume', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
        ctx.fillText('Press R to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90);

        ctx.restore();
    }

    /**
     * Calculate the game window (the rectangular space drawn to the screen). It's centered around the player and must
     * be updated since the player moves position.
     */
    calculateGameWindow() {
        const skierPosition: Position = this.skier.getPosition();
        const left: number = skierPosition.x - GAME_WIDTH / 2;
        const top: number = skierPosition.y - GAME_HEIGHT / 2;

        this.gameWindow = new Rect(left, top, left + GAME_WIDTH, top + GAME_HEIGHT);
    }

    /**
     * Handle keypresses and delegate to any game objects that might have key handling of their own.
     */
    handleKeyDown(event: KeyboardEvent) {
        let handled: boolean = false;

        switch (event.key) {
            case KEYS.PAUSE:
                this.togglePause();
                handled = true;
                break;
            case KEYS.RESET:
                this.resetGame();
                handled = true;
                break;
            default:
                handled = this.skier.handleInput(event.key);
        }

        if (handled) {
            event.preventDefault();
        }
    }
}
