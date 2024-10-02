export default class Connection {

	url:		string;
	connToken:	string | undefined;
	socket:		WebSocket;


	constructor(url: string, token: string | undefined) {
		this.socket = new WebSocket(url + "/?token=" + token);
		this.url = url;
		this.connToken = token;
	}


	
}
