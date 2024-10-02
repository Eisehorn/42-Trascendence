import { TfiCup } from "react-icons/tfi";
import * as React from "react";
import { useEffect, useRef, useState } from 'react';
import UserCard from '../Chat/UserCard';
//import NewChat from './NewChatModal';


import ArrowBack from "../ArrowBack";
import { CyberPongUser } from "../../utils/User";
import { getChannelMembers } from '../../utils/ChatUtils/ChatApi';

import { TokenAuth } from "../../utils/Auth";


export  async function getLeaderboard() {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/game/leaderboard`, {
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
			return json.map((obj)=>{return new CyberPongUser.User(obj["id"], obj["username"], obj["avatar"], false)})
			let user: CyberPongUser.User = await json.then((obj: Object) => {
				//let user: CyberPongUser.User = new CyberPongUser.User(obj["id"], obj["username"], obj["avatar"], false);
				return (user);
			})
			return (user);
		}
		else {
			return (undefined);
		}
	}
}

function showCards() {
	/*
	let components: Array<React.JSX.Element> = [];
	let isAdmin = admins.has(props.me.getId() as string);
	let isOwner = false;
	if (owner === props.me.getId())
		isOwner = true;
	for (let key of users.keys()) {
		let user = users.get(key)!;
		let otherIsAdmin = admins.has(user.getId() as string);
		
		components.push(
			<li className="flex w-full py-2 rounded-xl" key={key}>
				<UserCard user={user} isAdmin={isAdmin} otherIsAdmin={otherIsAdmin} me={props.me.getId() as string} channelId={props.channelId} setStato={setStato} isOwner={isOwner} setAlertMute={props.setMuted}/>
			</li>)
	}
	return components; */
}

export default function LeaderBoard() {
	const [users, setUsers] = useState([])

	useEffect(() => {
		getLeaderboard().then((obj)=>setUsers(obj));

	}, [])
	

	return (
		<div className="flex flex-col columns-1 w-screen h-screen justify-center items-center" onClick={() => {}}>
			<div onClick={() => {}}>
				<ArrowBack path={""}/>
			</div>
			
			<div className="flex w-full mb-4 justify-center">
				<span className=" text-center text-2xl font-bold text-cyan-500 mr-8"> LEADERBOARD </span>
			</div>
			<div className="box-content h-4/6 w-2/5 border-cyan-500 border-4 bg-slate-600 rounded-2xl">
				<div className="w-full h-full flex flex-col columns-2 p-4 overflow-auto">
					{users.map((user, i) => {
						let	_user = new CyberPongUser.User(user["id"], user["username"], user["avatar"], false);
						return(
							<div className="flex mb-2 items-center">
								<span className="text-black text-2xl font-extrabold mr-2"> {i + 1} </span>
								<UserCard user={_user} channelId="" isAdmin={false} otherIsAdmin={false} isOwner={false} me={user} setStato={() => {}} setAlertMute={() => {}} isLeaderboard={true} onlineStatus={undefined}/>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}