import * as React from "react";
import { CyberPongUser } from "../User";


export class Message {
	id:			string;
	text:		string;
	color:		number | undefined;
	sender:		CyberPongUser.User;
	channelId:	string;
	date:		string;

	constructor(id: string, text: string, color: number | undefined, sender: any, channelId: string, date: string) {
		this.text = text; this.color = color; this.id = id; this.channelId = channelId; this.date = date;
		this.sender = new CyberPongUser.User(sender["id"], sender["username"], sender["avatar"], false);
	}

	render(cli: string) {
		if (this.sender.getId() === cli) {
			return (
				<div className="chat chat-end" key={this.id}>
					<div className="chat-bubble chat-bubble-success"> {this.text} </div>
				</div>
			)
		}
		else {
			return (
				<div className="chat chat-start" key={this.id}>
					<div className="chat-header"> {this.sender.getUsername()} </div>
					<div className="chat-bubble chat-bubble-primary"> {this.text} </div>
				</div>
			)
		}
	};
}
