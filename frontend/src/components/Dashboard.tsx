import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";

import {CyberPongUser} from '../utils/User'
import { TokenAuth } from '../utils/Auth';

import Modes from './MainMenu/Modes';
import ChatMenu from "./Chat/ChatMenu"
import ChatAll from "./Chat/ChatAll"
import BubbleMenu from './MainMenu/BubbleMenu';
import { ChatAddAlert, ChatDeleteAlert, CustomAlert, FriendRequest, KickBanAlert } from './CustomAlert';
import { banUser } from '../utils/ChatUtils/ChatApi';

interface userProps {
	user: CyberPongUser.User;
}

export default function Dashboard(props: userProps) {

	const [isSucc, setisSucc] = useState(false);
	const [dele, setDele] = useState(false);
	const [editedName, setEditedName] = useState(false);
	const [editedAvatar, setEditedAvatar] = useState(false);
	const [stato, setStato] = useState(true);
	
	const handleSuccClose = () => {
		setisSucc(false);
	};
	 
	const handleSuccOpen = () => {
		setisSucc(true);
	};
	const handleDeleClose = () => {
		setDele(false);
	};
	
	const handleDeleOpen = () => {
		setDele(true);
	};

	const handleNameClose = () => {
		setEditedName(false);
	};
	 
	const handleNameOpen = () => {
		setEditedName(true);
	};
	const handleAvatarClose = () => {
		setEditedAvatar(false);
	};
	
	const handleAvatarOpen = () => {
		setEditedAvatar(true);
	};

	React.useEffect(() => {
		if (stato) {
			CyberPongUser.getUserSettings(TokenAuth.getAccessToken(), props.user);
			setStato(false);
		}
	}, []);

	if (props.user.getId()?.length == 0) {
		return <>
			<div className="flex h-screen w-screen justify-center items-center">
				<span className="loading loading-dots loading-lg text-primary-focus"></span>
			</div>
		</>;
	}
	
	return(
		<>
			<div className='flex flex-col h-screen'>
				<div className='flex h-screen relative'>
					<Modes />
				</div>
				<div className='absolute z-50 top-0 right-0 p-2 m-2'>
					<BubbleMenu user={props.user} setEditedName={handleNameOpen} setEditedAvatar={handleAvatarOpen}></BubbleMenu>
				</div>
				<div className='absolute z-50 bottom-0 right-0 p-4 m-4'>
					<ChatMenu user={props.user} setIsSucc={handleSuccOpen} setIsDel={handleDeleOpen}></ChatMenu>
				</div>
				<div className='absolute z-49 bottom-14 right-0 p-4 m-4'>
					<ChatAll user={props.user}></ChatAll>
				</div>
			</div>
			<ChatAddAlert
				isOpen={isSucc}
				onClose={handleSuccClose}
			/>
			<ChatDeleteAlert
				isOpen={dele}
				onClose={handleDeleClose}
			/>
			<CustomAlert 
				isOpen={editedName}
				message='Username edited!'
				onClose={handleNameClose}
			/>
			<CustomAlert 
				isOpen={editedAvatar}
				message='Profile picture edited!'
				onClose={handleAvatarClose}
			/>
			<FriendRequest/>
		</>
	);
}

{/*

<div className='absolute z-50 bottom-10 left-0 p-2 m-2'>
	<div className='btn btn-error btn-circle' onClick={() => {CyberPongUser.getNewAccessToken()}}> TEST REFRESH TOKEN </div>
</div>

*/}