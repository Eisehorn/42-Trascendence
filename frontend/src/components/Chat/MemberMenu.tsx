import React, { useEffect, useRef, useState } from 'react';
import { FaUsers } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

import UserCard from './UserCard';
//import NewChat from './NewChatModal';

import { CyberPongUser } from "../../utils/User";
import {createChannel, getChannelMembers} from '../../utils/ChatUtils/ChatApi';
import {TokenAuth} from "../../utils/Auth";

interface memberProps {
	me:			CyberPongUser.User;
	channelId:	string;
	setMuted:	Function;
}

async function handleChatPasswordChange(channelId: string, password: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/changePassword`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"channelId": channelId, "password": password})
	});
	return await data.json();
}

export default function MemberMenu(props: memberProps) {

	let [users, setUsers] = React.useState<Map<string, CyberPongUser.User>>(new Map<string, CyberPongUser.User>());
	let [admins, setAdmins] = React.useState<Map<string, CyberPongUser.User>>(new Map<string, CyberPongUser.User>());
	const [owner, setOwner] = React.useState(undefined);
	const [stato, setStato] = useState<boolean>(false);
	const [channelPassword, setChannelPassword] = useState(undefined);

	const handleChangePassword = event => {
		setChannelPassword(event.target.value)
	};

	const modal = useRef<HTMLDialogElement>(null);
	const modal2 = useRef<HTMLDialogElement>(null);
	
	function showCards() {
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
					<UserCard user={user} isAdmin={isAdmin} otherIsAdmin={otherIsAdmin} me={props.me.getId() as string} channelId={props.channelId} setStato={setStato} isOwner={isOwner} setAlertMute={props.setMuted} isLeaderboard={false} onlineStatus={undefined}/>
				</li>)
		}
		return components;
	}
	
	useEffect (() => {
		if (stato === false) {
			getChannelMembers(props.channelId, setUsers, setAdmins, setOwner);
			setStato(true);
		}
	}, [stato]);

	return (
		<div className="drawer-end">
			<input id="my-drawer" type="checkbox" className="drawer-toggle" onClick={() => {/*TODO getUsers*/}} />
			<div className="relative inline-flex group w-full h-full drawer-content">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
				<label htmlFor="my-drawer" className="relative transition-all btn btn-circle btn-ghost bg-transparent hover:bg-transparent hover:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 drawer-button">
					<FaUsers size={25}/>
				</label>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-96 min-h-full bg-base-200">
					<div className="flex relative items-center w-full pt-3">
						<label className="absolute flex left-0 text-lg font-bold">MEMBERS</label>
						<div className="absolute flex btn btn-ghost right-0 btn-circle " onClick={()=>modal.current?.showModal()}>< CiEdit size={30}/></div>
						<dialog id="editPassword" className="modal" ref={modal}>
							<div className='modal-box justify-center items-center'>
								<div className='flex justify-center items-center'>
									<label className='font-bold text-center text-lg'>Change Password</label>
								</div>
								<div className="relative form-control w-full max-w-xs">
									<div className='mt-5'>
										<label className="label top-2">
											<span className="label-text text-xl">Channel password?</span>
										</label>
										<input type="password" placeholder=""
											   className="input input-bordered w-full input-2xl max-w-xs"
											   id='channelPassword' onChange={handleChangePassword}/>
										<label className="label">
											<span className="label-text-alt"></span>
											<span className="label-text-alt text-xs">leave empty for no password</span>
										</label>
									</div>
									<div className='mt-5 flex justify-center items-center'>
										<div className="modal-action">
											<form method="dialog">
												<button className='btn btn-primary btn-lg rounded-2xl hover:scale-125'
														onClick={() => {handleChatPasswordChange(props.channelId, channelPassword)}}> SAVE
												</button>
											</form>
										</div>
									</div>
								</div>
							</div>
						</dialog>
					</div>
					<div className="divider py-3"></div>
					{showCards()}
				</ul>
			</div>
		</div>
	)
}