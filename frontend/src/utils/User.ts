import { GiSaberToothedCatHead } from "react-icons/gi";
import { TokenAuth } from "./Auth";
import axios from 'axios';


export module CyberPongUser {

	//WIP
	export async function getUser(userId: string): Promise<CyberPongUser.User | undefined> {
		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/user?userId=` + userId, {
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
				let user: CyberPongUser.User = await json.then((obj: Object) => {
					let user: CyberPongUser.User = new CyberPongUser.User(obj["id"], obj["username"], obj["avatar"], false);
					return (user);
				})
				return (user);
			}
			else {
				return (undefined);
			}
		}
	}

	export async function getFriends(whoToStalk: string) {
		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/friend?userId=${whoToStalk}`, {
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
				let idk = [];
				for (let obj of json) {
					let user = await getUser(obj["id"]);
					idk.push({user: user, status: obj["status"]})
				}
				return idk;
			} else {
				return (undefined);
			}
		}
	}

	export async function blockUser(userId: string): Promise<number> {
		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/block`, {
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

	export async function unBlockUser(userId: string): Promise<number> {
		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/block`, {
			method: 'DELETE',
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


	/* WIP */
	export async function getNewAccessToken() {

		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/auth/refreshToken`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({"refresh_token": TokenAuth.getRefreshToken()})
		})
		const json = await data.json();
		if (json) {
			if (data.status === 200) {
				TokenAuth.setToken(json);
			}
			else {
				TokenAuth.clearToken();
				window.location.assign("/"); 
			}
		}
	} 

	export async function getUserSettings(access_token: string, user: CyberPongUser.User) {

		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/me`, {
			method: 'GET',
			headers: { "Authorization": "Bearer " + access_token},
			body: null
		})
		const json = await data.json();
		if (json) {
			if (data.status === 200){
				user.setUsername(json["username"]);
				user.setId(json["id"]);
				user.setAvatar(json["avatar"]);
				user.setTwoFA(json["two_factor_enabled"]);
			}
			else {
				await getNewAccessToken();
				await getUserSettings(TokenAuth.getAccessToken(), user);
			}
		}
	}

	export async function editUsername(newUsername: string, setIsSucc: Function, user: CyberPongUser.User | undefined) {
		const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/updateUsername`, {
			method: 'POST',
			headers: {
				"Authorization": "Bearer " + TokenAuth.getAccessToken(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({"username": newUsername})
		});
		const json = await data.json();
		if (json) {
			if (data.status == 200) {
				if (user !== undefined) {
					user.setUsername(newUsername);
				}
				setIsSucc(true);
			}
		}
	}

	// WIP 
	export async function editAvatar(newAvatar: any | undefined, setIsSucc: Function, user: CyberPongUser.User | undefined) {
		
		const formData = new FormData();
		formData.append('file', newAvatar);

		let config = {
			headers: {
				"Authorization": "Bearer " + TokenAuth.getAccessToken(),
				"Content-Type": "image/jpeg"
			}
		}

		axios.post(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/uploadAvatar`, formData, config)
		
			.then((response) => {
				setIsSucc(true);
			})
			.catch((error) => {
			});
	}

	/**
	*	Represents a User in the application.
	*/
	export class User {
		private id: 					string | undefined;
		private username:				string;
		private avatar:					string;

		private two_factor_enabled:		boolean;

		/** 
		*	Create a new User instance.
		*	@param id - The unique identifier for the user.
		*	@param username - The username of the user.
		*	@param avatar - The URL of the user's avatar.
		*	@param two_factor_enabled - Indicates whether two-factor authentication is enabled for the user.
		*/
		constructor(id: string, username: string, avatar: string, two_factor_enabled: boolean) {
			this.id = id; this.username = username; this.avatar = avatar;
			this.two_factor_enabled = two_factor_enabled;
		}

		/** 
		*	Set the unique identifier for the user.
		*	@param id - The new identifier for the user.
		*/
		setId(id: string) {
			this.id = id;
		}

		/**
		*	Set the username for the user.
		*	@param username - The new username for the user.
		*/
		setUsername(username: string) {
			this.username = username;
		}

		/**
		*	Set the URL of the user's avatar.
		*	@param avatar - The new avatar URL for the user.
		*/
		setAvatar(avatar: string) {
			this.avatar = avatar;
		}

		/**
		*	Set whether two-factor authentication is enabled for the user.
		*	@param two_factor_enabled - The new value indicating whether two-factor authentication is enabled.
		*/
		setTwoFA(two_factor_enabled: boolean) {
			this.two_factor_enabled = two_factor_enabled;
		}
		
		/**
		*	Get the unique identifier for the user.
		*	@returns The user's identifier.
		*/
		getId() {
			return this.id;
		}

		/**
		*	Get the username of the user.
		*	@returns The user's username.
		*/
		getUsername() {
			return this.username;
		}

		/**
		*	Get the URL of the user's avatar.
		*	@returns The URL of the user's avatar.
		*/
		getAvatar() {
			return this.avatar;
		}

		getTwoFA() {
			return this.two_factor_enabled;
		}
	}
}