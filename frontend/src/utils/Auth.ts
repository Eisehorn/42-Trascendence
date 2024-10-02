import React from "react";

export module TokenAuth {

	export function setToken(userToken: React.Dispatch<React.SetStateAction<string | undefined>>) {
		sessionStorage.setItem('token', JSON.stringify(userToken));
	}

	export function clearToken() {
		sessionStorage.clear();
	}
	
	export function getAccessToken() {
		const tokenString = sessionStorage.getItem('token');
		if (!tokenString)
			return null;
		const userToken = JSON.parse(tokenString);
		return userToken?.access_token
	}
	
	export function getRefreshToken() {
		const tokenString = sessionStorage.getItem('token');
		if (!tokenString)
			return null;
		const userToken = JSON.parse(tokenString);
		return userToken?.refresh_token
	}
	
	export function getTempAccessToken() {
		const tokenString = sessionStorage.getItem('token');
		if (!tokenString)
			return null;
		const userToken = JSON.parse(tokenString);
		return userToken?.temp_access_token
	}

	export function getFirstLogin() {
		const tokenString = sessionStorage.getItem('token');
		if (!tokenString)
			return null;
		const userToken = JSON.parse(tokenString);
		return userToken?.first_login;
	}

	export function setFirstLogin() {
		const tokenString = sessionStorage.getItem('token');
		if (!tokenString)
			return null;
		let json = JSON.parse(tokenString);
		json.first_login = false;

		sessionStorage.setItem('token', JSON.stringify(json));
	}
}