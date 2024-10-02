import { Entity } from "./Entity";


export class Ball extends Entity {
	r: number;

	constructor(x: number, y: number, w: number, h: number, r: number) {
		super(x, y, w, h);
		this.r = r;
	}
}