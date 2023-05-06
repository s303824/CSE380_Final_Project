import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./HW3Level1";
import Cutscene1 from "./HW3LevelCutscene1";
import LevelSelect from "./LevelSelect";


// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class MainMenu extends Scene {

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";
    public static readonly TILEMAP_KEY = "MENU";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/main_menu.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly WALLS_LAYER_KEY = "Main";


    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    protected wallsLayerKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    public loadScene(): void {
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = MainMenu.TILEMAP_KEY;
        this.tilemapScale = MainMenu.TILEMAP_SCALE;
        this.wallsLayerKey = MainMenu.WALLS_LAYER_KEY;

        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, MainMenu.TILEMAP_PATH);

        // Load the menu song
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
    }

    public startScene(): void {
        // Initialize the tilemaps
        this.initializeTilemap();

        this.addUILayer(MenuLayers.MAIN);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        
        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x, size.y - 100), text: "Start"});
        playBtn.backgroundColor = Color.TRANSPARENT;
        playBtn.borderColor = Color.WHITE;
        playBtn.borderRadius = 0;
        playBtn.setPadding(new Vec2(50, 10));
        playBtn.fontSize = 50;
        playBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
            this.sceneManager.changeToScene(Cutscene1);
        }

        // FIX
        /*
        let levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x, size.y+100), text: "Level Select"});
        levelBtn.backgroundColor = Color.TRANSPARENT;
        levelBtn.borderColor = Color.WHITE;
        levelBtn.borderRadius = 0;
        levelBtn.setPadding(new Vec2(50, 10));
        levelBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        levelBtn.onClick = () => {
            this.sceneManager.changeToScene(LevelSelect);
        }*/


        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
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

    
}

