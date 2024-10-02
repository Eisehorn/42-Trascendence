import {Bar} from "./Bar";

export class Player{

	bar: Bar;
	id: string;
	score: number;

	constructor(x: number, y: number, w: number, h: number, id: string, score: number) {
		this.bar = new Bar(x, y, w, h);
		this.id = id;
		this.score = score;
	}
}
