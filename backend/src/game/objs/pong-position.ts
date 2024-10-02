export class PongPosition {

    constructor(public x: number, public y: number) {
    }

    add(pongPosition: PongPosition) {
        this.x += pongPosition.x
        this.y += pongPosition.y
    }
}
