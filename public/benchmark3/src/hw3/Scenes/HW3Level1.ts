import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import MainMenu from "./MainMenu";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import { HW3Events } from "../HW3Events";
import Color from "../../Wolfie2D/Utils/Color";
import GooseController from "../Goose/GooseController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Level2 from "./HW3Level2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";

/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
export default class Level1 extends HW3Level {

    protected gooseSpriteKey: string;
    protected goose: AnimatedSprite;
    protected gooseSpawn: Vec2;
    protected gooseSpawn2: Vec2;
    protected gooseSpawn3: Vec2;
    private instructionLabel: Label;
    private instructionLabel2: Label;
    private instructionLabel3: Label;

    public static readonly PLAYER_SPAWN = new Vec2(256, 208);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-1.json";

    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level1.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";

    public static readonly PANIC_AUDIO_KEY = "PANIC_AUDIO";
    public static readonly PANIC_AUDIO_PATH = "hw4_assets/sounds/panic.wav";

    public static readonly GOOSE_SPAWN = new Vec2(600, 222);
    public static readonly GOOSE_SPAWN_2= new Vec2(750, 222);
    public static readonly GOOSE_SPAWN_3= new Vec2(1600, 222);

    public static readonly GOOSE_SPRITE_KEY = "GOOSE_SPRITE_KEY";
    public static readonly GOOSE_SPRITE_PATH = "hw4_assets/spritesheets/Goose.json";

    protected levelTeleportPosition: Vec2;
    protected levelTeleportHalfSize: Vec2;

    protected levelTeleportArea: Rect;

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level1.TILEMAP_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level1.PLAYER_SPAWN;
        this.gooseSpriteKey = Level1.GOOSE_SPRITE_KEY;
        this.gooseSpawn = Level1.GOOSE_SPAWN;
        this.gooseSpawn2 = Level1.GOOSE_SPAWN_2;
        this.gooseSpawn3 = Level1.GOOSE_SPAWN_3;

        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.panicAudioKey = Level1.PANIC_AUDIO_KEY;


        // Level end size and position
        this.levelEndPosition = new Vec2(1856, 216).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
        this.playerNewLocation = new Vec2(1312,224).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level1.PLAYER_SPRITE_PATH);
       
        this.load.spritesheet(this.gooseSpriteKey, Level1.GOOSE_SPRITE_PATH);
        // Audio and music
        //this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.panicAudioKey, Level1.PANIC_AUDIO_PATH);

    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
    }

    protected handleLevelSwitchEvent(event: GameEvent): void {
        switch(event.data.get("level")){
            case 1: 
            {                
                this.nextLevel = Level1
                break
            }            
            case 2: 
            {
                this.nextLevel = Level2
                break
            }
            case 3: 
            {                
                this.nextLevel = Level3
                break
            }
            case 4: 
            {                
                this.nextLevel = Level4
                break
            }
            default:
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
        }
    }

    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        this.nextLevel = Level2;
        this.initializePlayerTeleport()
        this.initializeGoose(this.gooseSpriteKey, this.gooseSpawn);
        this.initializeGoose(this.gooseSpriteKey, this.gooseSpawn2);
        this.initializeGoose(this.gooseSpriteKey, this.gooseSpawn3);
        this.receiver.subscribe(HW3Events.SWITCH_LEVELS);

    }

    protected initializePlayerTeleport(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelTeleportPosition = new Vec2(736, 128).mult(this.tilemapScale)
        this.levelTeleportHalfSize = new Vec2(96, 32).mult(this.tilemapScale)
        this.levelTeleportArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelTeleportPosition, size:  this.levelTeleportHalfSize});
        this.levelTeleportArea.addPhysics(undefined, undefined, false, true);
        this.levelTeleportArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_TELEPORT, null);
        this.levelTeleportArea.color = new Color(255, 0, 255, .0);
        
    }

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up 
     * when I was making the tilemap for the first level is what it boils down to.
     * 
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 0, 120*16, 20*16);

    }
    protected initializeGoose(key: string, spawn: Vec2): void {
       
        if (spawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        this.goose = this.add.animatedSprite(this.gooseSpriteKey, HW3Layers.PRIMARY);
        this.goose.scale.set(.75,.75);
        this.goose.position.copy(spawn);
        //let gooseCollider = new AABB(Vec2.ZERO, this.goose.sizeWithZoom);
        //this.goose.setCollisionShape(gooseCollider);
        
        // Give the player physics and setup collision groups and triggers for the player
   
        this.goose.addPhysics(new AABB(this.goose.position.clone(), this.goose.boundary.getHalfSize().clone()));
        this.goose.setGroup(HW3PhysicsGroups.GOOSE);
        this.goose.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_GOOSE_HIT, null);

        // Give the player it's AI
    this.goose.addAI(GooseController, { player: this.player, tilemap: "Primary"});
    }
    protected initializeUI(): void {
        super.initializeUI();
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

    }

}