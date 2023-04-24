import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController, { PlayerTweens } from "../Player/PlayerController";
import PlayerWeapon from "../Player/PlayerWeapon";
import GooseController from "../Goose/GooseController";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import HW3FactoryManager from "../Factory/HW3FactoryManager";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import Level1 from "./HW3Level1";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";

/**
 * A const object for the layer names
 */
export const HW3Layers = {
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI"
} as const;

// The layers as a type
export type HW3Layer = typeof HW3Layers[keyof typeof HW3Layers]

/**
 * An abstract HW4 scene class.
 */
export default abstract class HW3Level extends Scene {

    /** Overrride the factory manager */
    public add: HW3FactoryManager;


    /** The particle system used for the player's weapon */
    protected playerWeaponSystem: PlayerWeapon
    /** The key for the player's animated sprite */
    protected playerSpriteKey: string;
    /** The animated sprite that is the player */
    protected player: AnimatedSprite;
    /** The player's spawn position */
    protected playerSpawn: Vec2;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;
    private instructionLabel: Label;
    private instructionLabel2: Label;
    private instructionLabel3: Label;

    protected gooseSpriteKey: string;
    protected goose: AnimatedSprite;
    protected gooseSpawn: Vec2;
    /** The end of level stuff */

    protected levelEndPosition: Vec2;
    protected levelEndHalfSize: Vec2;

    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => Scene;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Level end transition timer and graphic
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    protected wallsLayerKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    /** Sound and music */
    protected levelMusicKey: string;
    protected jumpAudioKey: string;
    protected tileDestroyedAudioKey: string;
    protected panicAudioKey: string;

    /** Teleporting player */
    protected playerNewLocation: Vec2;
    protected levelTeleportPosition: Vec2;
    protected levelTeleportHalfSize: Vec2;
    protected levelTeleportArea: Rect;
    protected isTeleporting: boolean;
    protected levelTeleportVelocity: Vec2;


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames: [
                HW3PhysicsGroups.GROUND, 
                HW3PhysicsGroups.PLAYER, 
                HW3PhysicsGroups.PLAYER_WEAPON, 
            ],
            collisions:
            [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0],
            ]
        }});
        this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the sprite and particle system for the players weapon 
        this.initializeWeaponSystem();

        // Initialize the player 
        this.initializePlayer(this.playerSpriteKey);
        this.initializeGoose(this.gooseSpriteKey);
        this.player.addAI(PlayerController, { goose: this.goose,
            tilemap: "Primary" 
        });
        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        this.initializeUI();
        

        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        this.initializeLevelEnds();

        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // Initially disable player movement
        Input.disableInput();

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Start playing the level music for the HW4 level
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.levelMusicKey, loop: true, holdReference: true});
        this.isTeleporting = false;

    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        if(this.isTeleporting){
            this.levelTeleportVelocity = this.levelTeleportPosition.dirTo(this.playerNewLocation);

            this.levelTeleportVelocity.x *= 75;
            this.levelTeleportVelocity.y *= 75;

            this.levelTeleportArea.move(this.levelTeleportVelocity.scaled(deltaT));
            this.levelTeleportArea.finishMove();
        }

    }
    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case HW3Events.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case HW3Events.LEVEL_START: {
                Input.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case HW3Events.LEVEL_END: {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
           
            case HW3Events.HEALTH_CHANGE: {
                this.handleHealthChange(event.data.get("curhp"), event.data.get("maxhp"));
                break;
            }
            case HW3Events.PLAYER_DEAD: {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case HW3Events.PLAYER_TELEPORT: {     
                if(!this.isTeleporting){
                    Input.disableInput();

                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.getPanicAudioKey(), loop: false, holdReference: false});
                    this.player.tweens.play(PlayerTweens.DISAPPEAR);           
                    this.player.position.copy(this.playerNewLocation);
                    this.viewport.follow(this.levelTeleportArea);
                    this.isTeleporting = true;  
                    
                    
                    // Because the code was written in a way that assumes we only have one enemy at a time i had to move the goose elsewhere
                    this.goose.position.copy(new Vec2(1600, 208).mult(this.tilemapScale))
                }
                else{
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.panicAudioKey});
                    console.log("Teleport Complete")
                    this.player.tweens.play(PlayerTweens.REAPPEAR);      
                    this.levelTeleportArea.position.copy(new Vec2(1, 1).mult(this.tilemapScale));     
                    this.viewport.follow(this.player);
                    this.isTeleporting = false;   
                    Input.enableInput();
 
                }
                break;
            }
            case HW3Events.SWITCH_LEVELS: {
                if(event.data.get("level") == 1 )
                    this.sceneManager.changeToScene(Level1);
                else if(event.data.get("level") == 2)
                    this.sceneManager.changeToScene(Level2);
                else if(event.data.get("level") == 3)
                    this.sceneManager.changeToScene(Level3);
                else if(event.data.get("level") == 4)
                    this.sceneManager.changeToScene(Level4);

                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }

    /* Handlers for the different events the scene is subscribed to */

    /**
     * Handle the event when the player enters the level end area.
     */
    protected handleEnteredLevelEnd(): void {
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     * 
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handleHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}
    
    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(HW3Layers.UI);
        // Add a layer for players and enemies
        this.addLayer(HW3Layers.PRIMARY);
    }
    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    protected initializeTilemap(): void {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        }
        // Add the tilemap to the scene
        this.add.tilemap(this.tilemapKey, this.tilemapScale);

        if (this.wallsLayerKey === undefined) {
            throw new Error("Make sure the keys for the wall layer are both set");
        }

        // Get the wall layers 
        this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(HW3Events.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(HW3Events.LEVEL_START);
        this.receiver.subscribe(HW3Events.LEVEL_END);
        this.receiver.subscribe(HW3Events.HEALTH_CHANGE);
        this.receiver.subscribe(HW3Events.PLAYER_DEAD);
        this.receiver.subscribe(HW3Events.PLAYER_TELEPORT);

    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {
        this.instructionLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 170), text: "Move with WASD "});
        this.instructionLabel.size.set(300, 30);
        this.instructionLabel.fontSize = 24;
        this.instructionLabel.font = "Courier";
        this.instructionLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 175), text: "Press Space to Jump "});
        this.instructionLabel2.size.set(300, 30);
        this.instructionLabel2.fontSize = 24;
        this.instructionLabel2.font = "Courier";

        this.instructionLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 180), text: "Press E to Interact"});
        this.instructionLabel3.size.set(300, 30);
        this.instructionLabel3.fontSize = 24;
        this.instructionLabel3.font = "Courier";
        // HP Label

		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(400, 20), text: "HP "});
		this.healthLabel.size.set(300, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";

        // HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(400, 20), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

        // HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(400, 20), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, { position: new Vec2(-300, 100), text: "Level Complete" });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 150,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.UI, { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_END
        });

        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_START
        });
    }
    /**
     * Initializes the particles system used by the player's weapon.
     */
    protected initializeWeaponSystem(): void {
        this.playerWeaponSystem = new PlayerWeapon(50, Vec2.ZERO, 1000, 3, 0, 50);
        this.playerWeaponSystem.initializePool(this, HW3Layers.PRIMARY);
    }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        if (this.playerWeaponSystem === undefined) {
            throw new Error("Player weapon system must be initialized before initializing the player!");
        }
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        this.player = this.add.animatedSprite(key, HW3Layers.PRIMARY);
        this.player.scale.set(0.0625, 0.0625);
        this.player.position.copy(this.playerSpawn);
        
        //let playerCollider = new AABB(Vec2.ZERO, this.player.sizeWithZoom);
        //this.player.setCollisionShape(playerCollider);
        // Give the player physics and setup collision groups and triggers for the player
        this.player.addPhysics(new AABB(this.player.position.clone(), this.player.boundary.getHalfSize().clone()));
        this.player.setGroup(HW3PhysicsGroups.PLAYER);


        // Give the player a death animation
        this.player.tweens.add(PlayerTweens.DEATH, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.PLAYER_DEAD
        });
        // Give the player a disappear animation
        this.player.tweens.add(PlayerTweens.DISAPPEAR, {
            startDelay: 0,
            duration: 100,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });

                // Give the player a reappear animation
                this.player.tweens.add(PlayerTweens.REAPPEAR, {
                    startDelay: 0,
                    duration: 100,
                    effects: [
                        {
                            property: "alpha",
                            start: 0,
                            end: 1,
                            ease: EaseFunctionType.IN_OUT_QUAD
                        }
                    ],
                });
        
    }

    protected initializeGoose(key: string): void {
       
        if (this.gooseSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        this.goose = this.add.animatedSprite(this.gooseSpriteKey, HW3Layers.PRIMARY);
        this.goose.scale.set(.75,.75);
        this.goose.position.copy(this.gooseSpawn);
        //let gooseCollider = new AABB(Vec2.ZERO, this.goose.sizeWithZoom);
        //this.goose.setCollisionShape(gooseCollider);
        
        // Give the player physics and setup collision groups and triggers for the player
       
        this.goose.addPhysics(new AABB(this.goose.position.clone(), this.goose.boundary.getHalfSize().clone()));
        this.goose.setGroup(HW3PhysicsGroups.GOOSE);

        // Give the player it's AI
    this.goose.addAI(GooseController, { player: this.player, tilemap: "Primary"});
    }
    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(4);
        this.viewport.setBounds(0, 0, 512, 512);
    }
    /**
     * Initializes the level end area
     */
    protected initializeLevelEnds(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelEndPosition, size: this.levelEndHalfSize });
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(255, 0, 255, .20);
        
    }

    /* Misc methods */

    // Get the key of the player's jump audio file
    public getJumpAudioKey(): string {
        return this.jumpAudioKey
    }

    public getPanicAudioKey(): string {
        return this.panicAudioKey
    }


}