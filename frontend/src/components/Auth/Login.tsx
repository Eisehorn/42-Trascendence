import * as React from "react";
import { useState } from 'react';
import {Route, Routes} from "react-router-dom";

async function getUser() {
	return fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/auth/42`, {
		method: 'GET',
		headers: {
		},
		body: null
	})
	.then(data => data.json())
}

async function getUser2() {
	return fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/auth/google`, {
		method: 'GET',
		headers: {
		},
		body: null
	})
	.then(data => data.json())
}

export default function Login() {

	const handleClick = async e => {
		e.preventDefault();
		const url = await getUser();
		
		window.location.assign(url);
		setUrl(url.redirect_url);
	}
	const handleClick2 = async e => {
		e.preventDefault();
		const url = await getUser2();

		window.location.assign(url);
		setUrl(url.redirect_url);
	}

	const [url, setUrl] = useState <string | undefined>(undefined);

	if (!url) {
		return (
		<>
			<div className="flex justify-center h-screen items-center">
				<div className="relative inline-flex group mr-6">
					<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
					</div>
					<button className="relative px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-gradient-to-br from-[#8a35ff] to-[#34CB4D] font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" onClick={handleClick}>
						<img className="" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="logo"></img>
						<span className="font-bold">Login with 42intra</span>
					</button>
				</div>
			</div>
		</>
		);
	}
	return (
		<>
		<Routes>
			<Route path='/' Component={() => {
				window.location.assign(url);
				return null; 
			}}/>
		</Routes>
		</>
	);
}

{/*
<div className="relative inline-flex group ml-6 ">
					<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
					</div>
					<button className="relative px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-gradient-to-br from-[#34CB4D] to-[#932577] font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" onClick={handleClick2}>
						<img className="" src="https://madeby.google.com/static/images/google_g_logo.svg" alt="logoGoogle"></img>
						<span className="font-bold">Login with Google</span>
					</button>
				</div>
*/}