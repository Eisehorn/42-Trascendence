import * as React from "react";
import { useState } from 'react';

interface LoginProps {
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>
}


async function getUser(req: string, props: LoginProps) {

	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/auth/google/callback?code=` + req, {
		method: 'GET'
	})
	const json = await data.json();
	if (json) {
		if (data.status === 200) {
			props.setToken(json);
			if (json.temp_access_token) {
				window.location.assign("/Auth2Fa");	
			}
			else {
				window.location.assign("/");
			}
		}
	}
}


export default function GoogleAuth(props: LoginProps) { 
	const urlParams = new URLSearchParams(window.location.search);
	const codeParam = urlParams.get('code');
	React.useEffect(() => {
		if (codeParam)
			getUser(codeParam as string, props);
	})

	return (
		<>
			<div className="flex justify-center h-screen items-center">
				<span className="loading loading-lg loading-spinner text-primary"></span>
			</div>
		</>
	);
}
