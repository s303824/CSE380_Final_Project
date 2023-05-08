import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./HW3Level1";
import Level3 from "./HW3Level3";
import Level4 from "./HW3Level4";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import RatController from "../Rat/RatController";

import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Color from "../../Wolfie2D/Utils/Color";

import Level5 from "./HW3Level5";
import Level6 from "./HW3Level6";

/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class Level2 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(40, 224);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL2";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-2.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level2.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));
    protected ratSpriteKey: string;
    protected rat: AnimatedSprite;
    protected ratSpawn: Vec2;
    protected ratSpawn2: Vec2;
    public static readonly RAT_SPRITE_KEY = "RAT_SPRITE_KEY";
    public static readonly RAT_SPRITE_PATH = "hw4_assets/spritesheets/Sewer_rat.json";
    public static readonly RAT_SPAWN = new Vec2(800, 240);
    public static readonly RAT_SPAWN_2= new Vec2(1000, 240);

    protected greenSludge: Rect;


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level2.TILEMAP_KEY;
        this.tilemapScale = Level2.TILEMAP_SCALE;
        this.wallsLayerKey = Level2.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level2.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level2.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;

        // enemies
        this.ratSpriteKey = Level2.RAT_SPRITE_KEY;
        this.ratSpawn = Level2.RAT_SPAWN;
        this.ratSpawn2 = Level2.RAT_SPAWN_2;
        
        // Level end size and position
        this.levelEndPosition = new Vec2(1266, 232).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 64).mult(this.tilemapScale);
        this.endLevelBanner = "Escaped From The Sewers"

    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level2.TILEMAP_PATH);
        this.load.audio(this.levelMusicKey, Level2.LEVEL_MUSIC_PATH);
        this.load.spritesheet(this.ratSpriteKey, Level2.RAT_SPRITE_PATH);
    }

    public startScene(): void {
        super.startScene();
        this.currentLevel = Level2;
        this.nextLevel = Level3;
        this.initializeGreenSludge();
        this.initializeRat(this.ratSpriteKey, this.ratSpawn);
        this.initializeRat(this.ratSpriteKey, this.ratSpawn2);

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
            case 5: 
            {                
                this.nextLevel = Level5
                break
            }
            case 6:
            {
                this.nextLevel = Level6
                break

            }
            default:
                throw new Error(`Unhandled level switch event caught in scene with value ${event.data.get("level")}`)
        }
    }

    protected initializeRat(key: string, spawn: Vec2): void {
       
        if (spawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the rat to the scene
        this.rat = this.add.animatedSprite(this.ratSpriteKey, HW3Layers.PRIMARY);
        this.rat.scale.set(1.0,1.0);
        this.rat.position.copy(spawn);
        
        // Give the rat physics and setup collision groups and triggers for the player
   
        this.rat.addPhysics(new AABB(this.rat.position.clone(), this.rat.boundary.getHalfSize().clone().sub(new Vec2(10,10))));
        this.rat.setGroup(HW3PhysicsGroups.GOOSE);
        this.rat.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_GOOSE_HIT, null);

        // Give the rat it's AI
    this.rat.addAI(RatController, { player: this.player, levelEndArea: this.levelEndArea, tilemap: "Primary"});
    }


    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 0, 160*16, 40*16);
    }
    protected initializeGreenSludge(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        this.greenSludge = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: new Vec2(255, 285).mult(this.tilemapScale), size:  new Vec2(160, 20).mult(this.tilemapScale)});
        this.greenSludge.addPhysics(undefined, undefined, false, true);
        this.greenSludge.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_DEAD, null);
        this.greenSludge.color = new Color(255, 99, 71, 0);
        
    }

    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepSpritesheet(this.ratSpriteKey);
        this.load.keepAudio(this.jumpAudioKey);
    }



}