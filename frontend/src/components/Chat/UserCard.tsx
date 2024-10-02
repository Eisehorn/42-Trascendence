import * as React from "react";
import { GiBootKick, GiThorHammer } from "react-icons/gi";
import { CiMenuKebab } from "react-icons/ci";
import {FaUserMinus, FaUserPlus, FaMicrophoneSlash, FaAccessibleIcon} from "react-icons/fa";

import { Link } from "react-router-dom";
import { CyberPongUser } from "../../utils/User";
import { addAdmin, banUser, kickUser, removeAdmin } from "../../utils/ChatUtils/ChatApi";
import MuteBan from "./muteBan";
import {TokenAuth} from "../../utils/Auth";


interface userProps {
	user:			CyberPongUser.User;
	channelId:		string;
	isAdmin:		boolean;
	otherIsAdmin:	boolean;
	isOwner:		boolean;
	me:				string;
	setStato:		Function;
	setAlertMute:	Function;
	isLeaderboard:	boolean;
	onlineStatus: string | undefined;
}

function nothing() {
}

async function handleGameRequest(userId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/game_invite`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"userId": userId})
	});
	const json = await data.json();
	if (json) {
		if (json.statusCode == 200) {
			return;
		}
	}
}

export default function UserCard(props: userProps) {
	const modal2 = React.useRef<HTMLDialogElement>(null);
	const [imgEr, setImgEr] = React.useState(true);
	
	let rest: string = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
	
	return (
		<div className="flex w-full items-center border text-black border-cyan-400 bg-purple-900 hover:bg-slate-500 hover:text-black rounded-lg">
			<Link to={"/profile/" + props.user.getId()}>
			{
				imgEr ? (
					<img className="flex w-20 h-20 rounded-lg justify-start" src={props.user.getAvatar()} onError={() => setImgEr(false)}/>
				) : (
					<div className="skeleton w-20 h-20"></div>
				)
				}
			</Link>
			<div className="flex px-4 w-full rounded-lg h-full overflow-hidden">
				<label className=" flex max-h-20 font-extrabold w-full justify-stretch"> {props.user.getUsername()}  {props.onlineStatus} </label>
				{
					props.user.getId() != props.me && !props.isLeaderboard ? (
						<div className="btn btn-ghost btn-xs" onClick={() => handleGameRequest(props.user.getId()!)}><FaAccessibleIcon /> </div>
					) : (
						<></>
					)
				}
			</div>
			{ props.isAdmin ? (
				<div className="dropdown dropdown-end absolute right-2 top-4">
					<label tabIndex={0} className="btn btn-ghost btn-xs"><CiMenuKebab /></label>
					<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
						{
							props.isOwner ? (
								props.otherIsAdmin ? (
									<li onClick={() => {
										if (props.user.getId() !== props.me) {
											removeAdmin(props.channelId, props.user.getId() as string);
											props.setStato(false);
										}
									}}><a className="text-orange-600">Remove admin <FaUserMinus /></a></li>
								) : (
									<li onClick={() => {
										if (props.user.getId() !== props.me) {
											addAdmin(props.channelId, props.user.getId() as string);
											props.setStato(false);
										}
									}}><a className="text-white"> Add admin <FaUserPlus /></a></li>
								)
							) : (
								<></>
							)
						}
						
						<li onClick={() => {props.user.getId() !== props.me ? modal2.current?.showModal() : nothing}}><a className="text-white">Mute Player <FaMicrophoneSlash /></a></li>
						<dialog id="newchat" className="modal" ref={modal2}>
							<MuteBan channelId={props.channelId} userId={props.user.getId() as string} setIsSucc={props.setAlertMute}/>
						</dialog>

						<li onClick={() => {
							if (props.user.getId() !== props.me) {
								kickUser(props.channelId, props.user.getId() as string);
								props.setStato(false);
							}
						}}><a className="text-orange-600">Kick User <GiBootKick /></a></li>
						<li onClick={() => {
							if (props.user.getId() !== props.me) {
								banUser(props.channelId, props.user.getId() as string);
								props.setStato(false);
							}
						}}><a className="text-red-600">Ban User <GiThorHammer /></a></li>
					</ul>
				</div>
				) : (
				<div></div>
				)
			}
		</div>
	)
}