import { CyberPongUser } from "../User";
import { TokenAuth } from "../Auth";
import { Channel } from "./Channel";
import { Message } from "./Message";
import {useNavigate} from "react-router-dom";

export async function getAllChannels(setChannels: Function) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/channel`, {
		method: 'GET',
		headers: { "Authorization": "Bearer " + TokenAuth.getAccessToken()},
		body: null
	})
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			let temp = new Map<string, Channel>()
			
			json.forEach((element: { [x: string]: string; }) => {
				let boo = false;

				if (element["isPrivate"] === "true") 
					boo = true;
				temp.set(element["id"], new Channel(element["id"], element["name"], element["password"], boo));
			});
			setChannels(temp);
		}
		else {
			await CyberPongUser.getNewAccessToken();
			await getAllChannels(setChannels);
		}
	}
}

export async function getUserChannels(setChannels: Function) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/joinedChannels`, {
		method: 'GET',
		headers: { "Authorization": "Bearer " + TokenAuth.getAccessToken()},
		body: null
	})
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			let temp = new Map<string, Channel>()
			json.forEach((element: { [x: string]: string; }) => {
				let boo = false;
				
				if (element["isPrivate"] === "true") 
					boo = true;
				temp.set(element["id"], new Channel(element["id"], element["name"], element["password"], boo));
			});
			setChannels(temp);
		}
		else {
			await CyberPongUser.getNewAccessToken();
			await getUserChannels(setChannels);
		}
	}
}

export async function createChannel(name: string | undefined, password: string | undefined, isPrivate: boolean | undefined, setSucc: Function, setStato: Function) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/channel`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"name": name, "password": password, "isPrivate": isPrivate})
	});
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			setSucc(true);
			setStato(true);
		}
	}
}

//	TODO REDO THIS
export async function joinChannel(ch_id: string, password: string | undefined): Promise<number> {
	if (password == null)
		password = "";

	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/joinChannel`, {
		method: 'POST',
		headers: { 
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
	},
		body: JSON.stringify({"channelId": ch_id, "password": password})
	})
	const json = await data.json();
	return data.status
}

export async function leaveChannel(channel: Channel, setIsDel: Function | null, setStato: Function | null) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/leaveChannel`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"channelId": channel.id})
	});
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			if (setIsDel != null) {
				setIsDel(true);
			}
			if (setStato != null) {
				setStato(true);
			}
		}
	}
}

//GET /chat/channelHistory?channelId=<id canale>
export async function getChannelHistory(channelId: string, messages: Map<string, Message[]>) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/channelHistory?channelId=` + channelId, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
	},
		body: null
	})
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			if (!messages.has(channelId)) {
				messages.set(channelId, []);
			}
			json.forEach((element) => {
				messages.get(channelId)!.push(new Message(element["id"], element["message"], undefined, element["sender"], element["channelId"], element["date"]))
			})
		}
		else {
		}
	}
}

// Puó essere usata solo dal creatore del canale
export async function addAdmin(channelId: string, userId: string): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/admin`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "userId": userId
		})
	})
	const json = await data.json();
	return (data.status);
}
export async function removeAdmin(channelId: string, userId: string): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/admin`, {
		method: 'DELETE',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "userId": userId
		})
	})
	const json = await data.json();
	return (data.status);
}

export async function changePassword(channelId: string, password: string | null): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/changePassword`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "password": password
		})
	})
	const json = await data.json();
	return (data.status);
}

export async function kickUser(channelId: string, userId: string): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/kickUser`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "userId": userId
		})
	})
	const json = await data.json();
	return (data.status);
}

export async function banUser(channelId: string, userId: string): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/banUser`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "userId": userId
		})
	})
	const json = await data.json();
	return (data.status);
}

export async function muteUser(channelId: string, userId: string, until: Date): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/muteUser`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"channelId": channelId, "userId": userId, "until": until
		})
	})
	const json = await data.json();
	let num = data.status
	return (num);
}

export async function directChannel(userId: string): Promise<number> {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/directChannel`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"userId": userId
		})
	})
	const json = await data.json();
	return (data.status);
}

export async function getChannelMembers(channelId: string, setMembers: Function, setAdmins: Function, setIsOwner: Function) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/channelMembers?channelId=` + channelId, {
	method: 'GET',
	headers: { 
		"Authorization": "Bearer " + TokenAuth.getAccessToken(),
		"Content-Type": "application/json"
	},
	body: null
	})
	const json = data.json();
	if (json) {
		if (data.status === 200) {
			let members: Map<string, CyberPongUser.User>= new Map<string, CyberPongUser.User>()
			let admins: Map<string, CyberPongUser.User>= new Map<string, CyberPongUser.User>()
			await json.then((obj: Object) => {
				obj["members"].map(async (el) => {
					let user = await CyberPongUser.getUser(el);
					if (user !== undefined) {
						members.set(user?.getId() as string, user);
					}
				})
				obj["admins"].map(async (el) => {
					let user = await CyberPongUser.getUser(el);
					if (user !== undefined) {
						admins.set(user?.getId() as string, user);
					}
				})
				setMembers(members);
				setAdmins(admins);
				setIsOwner(obj["owner"]);
			})
		}
		else {
		}
	}
}