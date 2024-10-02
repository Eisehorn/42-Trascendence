import * as React from 'react';
import Avatar from './Avatar';
import StatProfile from './Stats';
import { CyberPongUser } from '../../utils/User';

import { MdEmail } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";


interface userProps {
	access_token: string;
	user: CyberPongUser.User | undefined;
	matchesHistory: any[]
}

export default function TopProfile(props: userProps) {
	let immg: string;
	let uss:  string;

	if (props.user === undefined) {
		immg = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
		uss = "BUGGINO"
	}
	else {
		immg = props.user.getAvatar();
		uss = props.user.getUsername();
	}

	return (
		<>
			<div className="mt-[-0.9rem]">
				<Avatar img={immg} />
			</div>
			<div className="flex flex-row">
				<span className="text-3xl absolute top-7 ml-10 font-extrabold uppercase hover:text-secondary-focus text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{uss}</span>	
				<div className="flex absolute py-10 ml-2">
					<StatProfile matchesHistory={props.matchesHistory} userId={props.user.getId()}/>
				</div>
			</div>
		</>
	)
}