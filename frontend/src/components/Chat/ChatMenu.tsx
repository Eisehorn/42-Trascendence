import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { FaRocketchat, } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

import ChatCard from "./ChatCard";
import NewChat from './NewChatModal';

import { Channel } from "../../utils/ChatUtils/Channel";
import { getUserChannels } from '../../utils/ChatUtils/ChatApi';
import { CyberPongUser } from "../../utils/User";
import { TokenAuth } from "../../utils/Auth";
import JoinChat from './JoinChatModal';

interface userProps {
	user:		CyberPongUser.User;
	setIsSucc:		Function;
	setIsDel:		Function;
}

export default function ChatMenu(props: userProps) {

	let [channels, setChannels] = React.useState<Map<string, Channel>>(new Map<string, Channel>());
	const [stato, setStato] = useState<boolean>(false);
	
	const modal = useRef<HTMLDialogElement>(null);
	const modal2 = useRef<HTMLDialogElement>(null);
	
	function showCards() {
		let components: Array<React.JSX.Element> = [];
		for (let key of channels.keys()) {
			let channel = channels.get(key)!;
			components.push(
				<li className="flex w-full py-2 rounded-xl" key={key}>
					<ChatCard channel={channel} avatar="" setIsDel={props.setIsDel} setStato={setStato} />
				</li>)
		}
		return components;
	}
	
	useEffect (() => {
		if (stato === true) {
			getUserChannels(setChannels)
			setStato(false);
		}
	}, [stato]);

	return (
		<div className="drawer-end">
			<input id="my-drawer" type="checkbox" className="drawer-toggle" onClick={() => {getUserChannels(setChannels)}} />
			<div className="relative inline-flex group w-full h-full drawer-content">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
				<label htmlFor="my-drawer" className="relative transition-all btn btn-circle btn-ghost bg-transparent hover:bg-transparent hover:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 drawer-button">
					<FaRocketchat size={25}/>
				</label>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-96 min-h-full bg-base-200">
					<div className="flex relative items-center w-full pt-3">
						<label className="absolute flex left-0 text-lg font-bold">CHAT</label>
						<div className="absolute flex btn btn-primary btn-sm right-0 mr-14 rounded-xl font-bold" onClick={()=>modal2.current?.showModal()}> JOIN </div>
						<dialog id="joinchat" className="modal" ref={modal2}>
							<JoinChat setSucc={props.setIsSucc} setStato={setStato} autofill={""}/>
						</dialog>
						<div className="absolute flex btn btn-ghost right-0 btn-circle " onClick={()=>modal.current?.showModal()}>< IoMdAdd size={30}/></div>
						<dialog id="newchat" className="modal" ref={modal}>
							<NewChat setSucc={props.setIsSucc} setStato={setStato}/>
						</dialog>
					</div>
					<div className="divider py-3"></div> 
					{showCards()}
				</ul>
			</div>
		</div>
	)
}
