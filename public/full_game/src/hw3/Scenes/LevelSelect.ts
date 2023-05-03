import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./HW3Level1";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level4";
import Level4 from "./HW3Level5";


// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class LevelSelect extends Scene {

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        // Load the menu song
        this.load.audio(LevelSelect.MUSIC_KEY, LevelSelect.MUSIC_PATH);
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Create a play button
        let firstBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x-100, size.y), text: "Level 1"});
        firstBtn.backgroundColor = Color.TRANSPARENT;
        firstBtn.borderColor = Color.WHITE;
        firstBtn.borderRadius = 0;
        firstBtn.setPadding(new Vec2(50, 10));
        firstBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        firstBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
        }

        let secondBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x+100, size.y), text: "Level 2"});
        secondBtn.backgroundColor = Color.TRANSPARENT;
        secondBtn.borderColor = Color.WHITE;
        secondBtn.borderRadius = 0;
        secondBtn.setPadding(new Vec2(50, 10));
        secondBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        secondBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
            this.sceneManager.changeToScene(Level2);
        }

        let thirdBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x-100, size.y+100), text: "Level 3"});
        thirdBtn.backgroundColor = Color.TRANSPARENT;
        thirdBtn.borderColor = Color.WHITE;
        thirdBtn.borderRadius = 0;
        thirdBtn.setPadding(new Vec2(50, 10));
        thirdBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        thirdBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
            this.sceneManager.changeToScene(Level3);
        }

        let fourthBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x+100, size.y+100), text: "Level 4"});
        fourthBtn.backgroundColor = Color.TRANSPARENT;
        fourthBtn.borderColor = Color.WHITE;
        fourthBtn.borderRadius = 0;
        fourthBtn.setPadding(new Vec2(50, 10));
        fourthBtn.font = "PixelSimple";

        // When the play button is clicked, go to the next scene
        fourthBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
            this.sceneManager.changeToScene(Level4);
        }


        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: LevelSelect.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: LevelSelect.MUSIC_KEY});
    }
}

