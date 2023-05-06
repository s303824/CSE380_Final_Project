import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./HW3Level1";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level3";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import Color from "../../Wolfie2D/Utils/Color";
import Level4 from "./HW3Level4";
import Level6 from "./HW3Level6";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import HumanController from "../Human/HumanController";

/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class Level5 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(48, 320);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL4";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-5.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level4.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";
    
    protected humanSpriteKey: string;
    protected human: AnimatedSprite;
    protected humanSpawn: Vec2;
    protected humanSpawn2: Vec2;
    protected humanSpawn3: Vec2;

    public static readonly HUMAN_SPRITE_KEY = "HUMAN_SPRITE_KEY";
    public static readonly HUMAN_SPRITE_PATH = "hw4_assets/spritesheets/Lab_scientist.json";
    public static readonly HUMAN_SPAWN = new Vec2(400, 150);
    public static readonly HUMAN_SPAWN_2= new Vec2(500, 150);
    public static readonly HUMAN_SPAWN_3= new Vec2(500, 632);


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level5.TILEMAP_KEY;
        this.tilemapScale = Level5.TILEMAP_SCALE;
        this.wallsLayerKey = Level5.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level5.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level5.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 880).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(64, 64).mult(this.tilemapScale);
        
        // enemies
        this.humanSpriteKey = Level4.HUMAN_SPRITE_KEY;
        this.humanSpawn = Level4.HUMAN_SPAWN;
        this.humanSpawn2 = Level4.HUMAN_SPAWN_2;
        this.humanSpawn3 = Level4.HUMAN_SPAWN_3;


    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level5.TILEMAP_PATH);
        this.load.audio(this.levelMusicKey, Level5.LEVEL_MUSIC_PATH);
        this.load.spritesheet(this.humanSpriteKey, Level5.HUMAN_SPRITE_PATH);

    }
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 16, 120*16, 60*16*4);
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
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
        }
    }

    public startScene(): void {
        super.startScene();
        this.nextLevel = Level6;
        this.currentLevel = Level5;
        this.levelTeleportPosition = new Vec2(1856, 328).mult(this.tilemapScale)
        this.levelTeleportHalfSize = new Vec2(48, 96).mult(this.tilemapScale)
        this.playerNewLocation = new Vec2(1856, 864).mult(this.tilemapScale)

        this.initializePlayerTeleport();

        this.initializeHuman(this.humanSpriteKey, this.humanSpawn);
        this.initializeHuman(this.humanSpriteKey, this.humanSpawn2);        
        this.initializeHuman(this.humanSpriteKey, this.humanSpawn3);

    }
    protected initializePlayerTeleport(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelTeleportArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelTeleportPosition, size:  this.levelTeleportHalfSize});
        this.levelTeleportArea.addPhysics(undefined, undefined, false, true);
        this.levelTeleportArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_TELEPORT, null);
        this.levelTeleportArea.color = new Color(255, 0, 255, 0.0);
        
    }
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio(this.jumpAudioKey);
    }

    protected initializeHuman(key: string, spawn: Vec2): void {
       
        if (spawn === undefined) {
            throw new Error("Human spawn must be set before initializing the human!");
        }

        // Add the human enemy to the scene
        this.human = this.add.animatedSprite(this.humanSpriteKey, HW3Layers.PRIMARY);
        this.human.scale.set(1.5,1.5);
        this.human.position.copy(spawn);
        
        // Give the human physics and setup collision groups and triggers for the player
   
        this.human.addPhysics(new AABB(this.human.position.clone(), this.human.boundary.getHalfSize().clone().sub(new Vec2(10,10))));
        this.human.setGroup(HW3PhysicsGroups.GOOSE);
        this.human.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_GOOSE_HIT, null);

        // Give the human it's AI
    this.human.addAI(HumanController, { player: this.player, levelEndArea: this.levelEndArea, tilemap: "Primary"});
    }


}