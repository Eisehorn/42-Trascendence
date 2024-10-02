

export class Entity {
	posx:	number;
	posy:	number;

	width:	number;
	height:	number;

	constructor(x: number, y: number, w: number, h: number) {
		this.posx = x; this.posy = y;
		this.width = w; this.height = h;
	}

}