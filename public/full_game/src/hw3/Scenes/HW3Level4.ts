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

/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class Level4 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(48, 320);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL4";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-4.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level4.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level4.TILEMAP_KEY;
        this.tilemapScale = Level4.TILEMAP_SCALE;
        this.wallsLayerKey = Level4.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level4.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level4.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 864).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);

    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level4.TILEMAP_PATH);
        this.load.audio(this.levelMusicKey, Level4.LEVEL_MUSIC_PATH);

    }
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 16, 16*16*2, 60*16*2);
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
                this.nextLevel = Level3
                break
            }            
            /*case 2: 
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
            }*/
            default:
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
        }
    }


    public startScene(): void {
        super.startScene();
        this.nextLevel = MainMenu;
        this.currentLevel = Level4;
        this.levelTeleportPosition = new Vec2(1840, 320).mult(this.tilemapScale)
        this.levelTeleportHalfSize = new Vec2(48, 96).mult(this.tilemapScale)
        this.playerNewLocation = new Vec2(1840, 864).mult(this.tilemapScale)

        this.initializePlayerTeleport();
    }
    protected initializePlayerTeleport(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelTeleportArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelTeleportPosition, size:  this.levelTeleportHalfSize});
        this.levelTeleportArea.addPhysics(undefined, undefined, false, true);
        this.levelTeleportArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_TELEPORT, null);
        this.levelTeleportArea.color = new Color(255, 0, 255, 1.0);
        
    }

}