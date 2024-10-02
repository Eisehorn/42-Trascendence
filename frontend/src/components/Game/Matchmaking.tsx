import * as React from "react";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
//import { CyberPongUser } from "frontend/src/utils";
import { TokenAuth } from "../../utils/Auth";
import ArrowBack from "../ArrowBack";

async function startMatchmaking(neon: boolean) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/game/matchmaking/${neon ? "neon" : "classic"}`, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
	});
	const json = await data.json();
	return data.status === 200;
}

async function stopMatchmaking() {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/game/matchmaking/exit`, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
	});
	const json = await data.json();
	return data.status === 200;
}

export default function Matchmaking() {
	let { type } = useParams<string>();
	let [ isError, setIsError ] = useState<boolean>(false);

	React.useEffect(() => {
		startMatchmaking(type === "neon")
			.then(done => {
				setIsError(!done)
			})
	}, [])


	if (isError === true) {
		return (
			<Link to="frontend/src/routes/errorPage.tsx" ></Link>
		)
	}

	return (
		<div className="flex h-screen items-center justify-center">
			<div>
				{
					type === "classic" ? (
						<div>
							<span className="text-secondary">Finding a player...</span>
							<span className="loading loading-bars loading-lg text-secondary"></span>
							<div onClick={() => stopMatchmaking()}><ArrowBack path={""}/></div>
						</div>
					) : (
						<div>
							<span className="text-primary ">Finding a NEON player...</span>
							<span className="loading loading-bars loading-lg text-primary"></span>
							<div onClick={() => stopMatchmaking()}><ArrowBack path={""}/></div>
						</div>
					)
				}
			</div>
		</div>
	)
}