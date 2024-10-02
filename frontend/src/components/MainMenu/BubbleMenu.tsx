import React, { useRef } from 'react';
import {CyberPongUser} from '../../utils/User';
import { TokenAuth } from "../../utils/Auth";

import Settings from './Settings';
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';

interface userProps {
	user:				CyberPongUser.User;
	setEditedName:		Function;
	setEditedAvatar:	Function;
}

export default function BubbleMenu(props: userProps) {
	const modal = useRef<HTMLDialogElement>(null);

	return (
	<div className="dropdown dropdown-left">
		<div className="relative inline-flex group">	
			<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
			<div className="relative transition-all btn btn-circle btn-ghost bg-transparent hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
				<label tabIndex={0} className="btn btn-ghost btn-circle bg-transparent hover:bg-transparent focus:outline-none hover:scale-125"><RxHamburgerMenu size={25} /></label>
				<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
					<li>
						<Link to={"/profile/" + props.user.getId()}>
							Profile
						</Link>
					</li>
					<li className="" onClick={() => modal.current?.showModal()}><a>Settings</a></li>
					<dialog id="settings" className="modal" ref={modal}>
						<Settings access_token={TokenAuth.getAccessToken()} twoFaEnabled={props.user.getTwoFA()} setEditedName={props.setEditedName} setEditedAvatar={props.setEditedAvatar}/>
					</dialog>
					<li>
						<Link to={"/leaderboard"}>
							Leaderboard
						</Link>
					</li>
				</ul>
			</div>
		</div>
	</div>
	)
}


<div className="dropdown dropdown-end">
		<div className="relative inline-flex group ">
			<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
			{/*This is the "container" of the swap element*/}
			<label className="swap swap-rotate relative transition-all btn btn-circle btn-ghost bg-transparent hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
				{/* this hidden checkbox controls the state */}
				<input type="checkbox" tabIndex={0} />
				<div className="swap-off fill-current">
					<label className=""><RxHamburgerMenu size={25} /></label>
				</div>
				<div className="swap-on fill-current">
					<RxCross2 size={25}/>
					<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
						<li>
							<a className="">
								Profile
							</a>
						</li>
						{/*<button className="btn" onClick={()=>window.my_modal_1.showModal()}>open modal</button>
						<li className="" onClick={()=>modal.current?.showModal()}><a>Settings</a></li>
						<dialog id="settings" className="modal" ref={modal}>
							<Settings access_token={props.access_token} twoFaEnabled={props.user.getTwoFA()}/>
						</dialog>
						*/}
					</ul>
				</div>
			</label>
		</div>
	</div>