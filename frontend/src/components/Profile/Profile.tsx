import * as React from "react";
import {useEffect, useState} from 'react';
import {IoArrowBackOutline} from 'react-icons/io5';
import {Link, useParams} from 'react-router-dom';

import TopProfile from "./TopProfile";
import Achievements from "./Achievements";
import ChatCard from "../Chat/ChatCard";
import ArrowBack from "../ArrowBack";
import UserCard from '../Chat/UserCard';
import Matches from "./Matches";

import {CyberPongUser} from '../../utils/User';
import {Channel} from "../../utils/ChatUtils/Channel";
import {TokenAuth} from "../../utils/Auth";
import {MdEmail} from "react-icons/md";
import {RiUserAddFill} from "react-icons/ri";
import {AiOutlineStop} from "react-icons/ai";


interface userProps {
	access_token: string;
	me: CyberPongUser.User;
}

function nothin() {

}

async function handleFriend(userId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/friend/request`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({userId: userId})
	});
	const json = await data.json();
	if (json) {
		if (json.statusCode == 200) {
			return;
		}
	}
}

async function handleDirectChat(userId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/chat/directChannel`, {
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

function BlockUser(props: { userId: string }) {
	return (
		<div className="absolute right-5 top-36 btn btn-ghost btn-circle">
			<div className="relative ">
				<div
					className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
					onClick={() => CyberPongUser.blockUser(props.userId)}>
				</div>
				<AiOutlineStop className="btn btn-primary border-0 bg-gray-800 btn-circle"/>
			</div>
		</div>
	)
}

function AddFriend(props: { userId: string }) {

	return (
		<div className="absolute right-5 top-6 btn btn-ghost btn-circle">
			<div className="relative ">
				<div
					className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
					onClick={() => handleFriend(props.userId)}>
				</div>
				<RiUserAddFill className="btn btn-primary border-0 bg-gray-800 btn-circle"/>
			</div>
		</div>
	)
}

function SendDirect(props: { userId: string }) {
	return (
		<div className="absolute right-5 top-24 btn btn-ghost btn-circle">
			<div className="relative ">
				<div
					className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
					onClick={() => handleDirectChat(props.userId)}>
				</div>
				<MdEmail className="btn btn-primary border-0 bg-gray-800 btn-circle"/>
			</div>
		</div>
	)
}

async function getMatches(access_token: string, userId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/game/match_history?userId=${userId}`, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/json"
		},
	});
	return data.json();
}

interface Popo {
	user:	CyberPongUser.User;
	status:	string;
}

export default function Profile(props: userProps) {
	let comp: React.JSX.Element;
	const [achievements, setAchievements] = useState(true);
	const [matches, setMatches] = useState(false);
	const [friends, setFriends] = useState(false);
	const [stato, setStato] = useState(false);
	const [friendsList, setFriendsList] = useState<Popo[] | undefined>();
	let {target} = useParams<string>();
	const [user, setUser] = useState<CyberPongUser.User | undefined>(undefined);
	const [matchesHistory, setMatchesHistory] = useState([]);

	const [isMe, setIsMe] = useState(false);

	useEffect(() => {
		getMatches(props.access_token, target!).then(obj => {
			setMatchesHistory(obj)
		})
	}, []);


	if (achievements === true) {
		comp = <div className="flex w-full overflow-y-auto">
			<Achievements matchHistory={matchesHistory} userId={target!}/>
		</div>
	} else if (matches === true) {
		comp = <div className="flex w-full overflow-y-auto"><Matches matchHistory={matchesHistory}/></div>
	} else {
		let components: Array<React.JSX.Element> = [];
		{
			friendsList?.map((element) => {
				components.push(
					<li className="flex w-full py-2 rounded-xl" key={element["user"].getId()}>
						<UserCard user={element["user"]} isAdmin={false} otherIsAdmin={false}
								  me={props.me.getId() as string} channelId={"false"} setStato={nothin}
								  isOwner={false} setAlertMute={nothin} isLeaderboard={true} onlineStatus={element["status"]}/>
					</li>
				)
			})
		}
		comp = <div className="flex w-full overflow-y-auto columns-1">
			{components}
		</div>
	}

	React.useEffect(() => {
		if (user === undefined) {
			setStato(false)
			CyberPongUser.getUser(target as string).then(user => {
				if (props.me.getId() === user!.getId()) {
					setIsMe(true);
				}
				CyberPongUser.getFriends(target!).then((obj)=>{
					setFriendsList(obj)
				});
				setUser(user);
			})
		} else {
			setStato(true)
		}
	}, [user])

	if (stato) {
		return (
			<div className="flex h-screen items-center justify-center">
				<ArrowBack path={""}/>
				{
					isMe ? (
						<></>
					) : (
						<AddFriend userId={user!.getId() as string}></AddFriend>
					)
				}
				{
					isMe ? (
						<></>
					) : (
						<SendDirect userId={user!.getId() as string}></SendDirect>
					)
				}
				{
					isMe ? (
						<></>
					) : (
						<BlockUser userId={user!.getId() as string}></BlockUser>
					)
				}
				<div className="relative h-4/5 w-4/5">
					<div
						className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
					</div>
					<div className="relative flex h-full w-full pt-10 rounded bg-gray-900 ">
						<div className="flex h-full w-full columns-1 flex-col">
							<div className="pl-10 flex w-full">
								<TopProfile user={isMe ? props.me : user} access_token={props.access_token}
											matchesHistory={matchesHistory}/>
							</div>
							<div className="tabs w-full ">
								{
									achievements === true ? (
										<a className="tab tab-active tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(true);
											   setMatches(false);
											   setFriends(false)
										   }}>Achievements</a>
									) : (
										<a className="tab tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(true);
											   setMatches(false);
											   setFriends(false)
										   }}>Achievements</a>
									)
								}
								{
									matches === true ? (
										<a className="tab tab-active tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(false);
											   setMatches(true);
											   setFriends(false)
										   }}>Matches</a>
									) : (
										<a className="tab tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(false);
											   setMatches(true);
											   setFriends(false)
										   }}>Matches</a>
									)
								}
								{
									friends === true ? (
										<a className="tab tab-active tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(false);
											   setMatches(false);
											   setFriends(true)
										   }}>Friends</a>
									) : (
										<a className="tab tab-bordered w-1/3 font-extrabold bg-gray-900 border-purple-800"
										   onClick={() => {
											   setAchievements(false);
											   setMatches(false);
											   setFriends(true)
										   }}>Friends</a>
									)
								}
							</div>
							{
								comp
							}
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className="flex h-screen w-screen justify-center items-center">
				<span className="loading loading-dots loading-lg text-primary-focus"></span>
			</div>
		)
	}
}

