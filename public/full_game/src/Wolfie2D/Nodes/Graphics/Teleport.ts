import Vec2 from "../../DataTypes/Vec2";
import Rect from "./Rect";

export default class Teleport extends Rect {
    newLocation: Vec2;
    _velocity: Vec2;
    isTeleporting: boolean;

    constructor(position: Vec2, size: Vec2, newLocation: Vec2){
        super(position, size);
        this.newLocation = newLocation;
        this.isTeleporting = false;
    }

    teleport(deltaT: number): void {
        this._velocity = this.position.dirTo(this.newLocation);

        this._velocity.x *= 75;
        this._velocity.y *= 75;

        super.move(this._velocity.scaled(deltaT));
        this.finishMove();

    }

    update(deltaT: number): void {
        if(this.isTeleporting){
            this.teleport(deltaT)
        }
    }
}