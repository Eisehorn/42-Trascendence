import * as React from "react";
import { useState, useReducer } from "react";
import { useParams } from "react-router-dom";

import ArrowBack from "../ArrowBack";
import MemberMenu from "./MemberMenu";

import { CyberPongUser } from "../../utils/User"
import { TokenAuth } from "../../utils/Auth";
import { Message } from "../../utils/ChatUtils/Message"
import { getChannelHistory } from "../../utils/ChatUtils/ChatApi";
import { CustomAlert, KickBanAlert } from '../CustomAlert';


interface userProps {
	user:			CyberPongUser.User;		// DEPRECATED
	ws:				WebSocket;
	messages:		Map<string, Message[]>;
	setMessages:	Function;
}

export default function ChatPage(props: userProps) {

	let { channelId, channelName } = useParams<string>();
	const [message, setMessage] = useState('');
	const [stato, setStato] = useState(true);
	const [stato2, setStato2] = useState(false);
	const [user, _] = useState<CyberPongUser.User>(new CyberPongUser.User("", "", "", false));
	const [bannedUser, setBannedUser] = useState(false);
	const [kickUser, setKickUser] = useState(false);
	const [mutedUser, setMuted] = useState(false);
	CyberPongUser.getUserSettings(TokenAuth.getAccessToken(), user);
	
	const handleChange = (event) => {
		setMessage(event.target.value as string);
	};

	if (stato) {
		getChannelHistory(channelId as string, props.messages).then();
		setStato(false);
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' && message !== "") {
			props.ws.send(JSON.stringify(
				{
					"event": "chat_msg_send",
					"data": {
						"channel_id": channelId,
						"message": message
					}
				}
			))
			setMessage("");
		}
	};

	function handleBack() {
		props.messages.clear()
	}

	const handleBan = () => {
		setBannedUser(true);
	}

	const handleKick = () => {
		setKickUser(true);
	}

	const handleMuted = () => {
		setMuted(true);
	}
	

	return (
		<div className="flex flex-col columns-1 w-screen h-screen justify-center items-center" onClick={() => setStato2(true)}>
			<div onClick={() => {handleBack()}}>
				<ArrowBack path={""}/>
			</div>
			<div className="absolute right-5 top-5">
				<MemberMenu channelId={channelId as string} me={user} setMuted={setMuted}/>
			</div>
			<div className="flex w-full mb-4 justify-center">
				<span className=" text-center text-2xl font-bold text-cyan-500 mr-8"> {channelName} </span>
			</div>
			<div className="box-content h-4/6 w-2/5 border-cyan-500 border-4 bg-slate-600 rounded-2xl">
				<div className="w-full h-full flex flex-col columns-1 p-4 overflow-auto">
					{
						stato2 ? (
						props.messages.get(channelId as string)?.map((mess) => {
							if (mess.channelId === channelId) {
								return (mess.render(user.getId() as string))
							}
						})
						) : (
							<span className="loading loading-dots loading-3xl text-green-500"></span>
						)
					}
				</div>
			</div>
			<div className="flex w-full justify-center m-4">
				<input type="text" placeholder="" className="input input-bordered input-secondary w-full max-w-md" onKeyDownCapture={handleKeyDown} onChange={handleChange} value={message}/>
			</div>
			<KickBanAlert
				isOpen={kickUser}
				message='User was kicked from the channel!'
				type={false}
				onClose={handleKick}
			/>
			<KickBanAlert
				isOpen={bannedUser}
				message='User was banned from the channel!'
				type={true}
				onClose={handleBan}
			/>
			<CustomAlert 
				isOpen={mutedUser}
				message='User was muted.'
				onClose={handleMuted}
			/>
		</div>
	)
}