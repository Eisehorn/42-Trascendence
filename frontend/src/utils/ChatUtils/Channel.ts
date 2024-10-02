
export class Channel {
	id:				string;
	name:			string;
	password:		string;
	isPrivate:		boolean;

	constructor(id: string, name: string, password: string, isPrivate: boolean) {
		this.id = id; 
		this.name = name; 
		this.password = password;
		this.isPrivate = isPrivate
	}
}