import * as React from "react";

import { TokenAuth } from "../../utils/Auth";
import {CyberPongUser} from "../../utils/User";
import {useState} from "react";
import { Link } from "react-router-dom";

export default function FirstLogin() {

	TokenAuth.setFirstLogin();
	const [username, setUsername] = useState("");
	const [avatar, setAvatar] = useState(undefined);

	const handleChangeUsername = event => {
		setUsername(event.target.value)
	};

	const handleChangeAvatar = event => {
		setAvatar(event.target.files[0])
	};
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="relative h-4/5 w-4/5">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
				<div className="relative flex h-full w-full pt-10 rounded bg-gray-900 justify-center items-center">
					<div className="flex items-center justify-center flex-col columns-1 h-full w-full">
						<div className='flex justify-center items-end py-5'>
							<div>
								<label className="label">
									<span className="label-text font-bold text-white">Change your username</span>
								</label>
								<input type="text" placeholder="Type here" className="input input-bordered input-secondary w-full max-w-xs" onChange={handleChangeUsername} value={username}/>
							</div>
								{
									username === undefined || username === "" ? (
										<div className='btn hidden'> SAVE </div>
									) : (
										<div className='btn rounded-lg btn-primary ml-3' onClick={() => {CyberPongUser.editUsername(username, () => {}, undefined); setUsername("")}}> SAVE </div>
									)
								}
						</div>
						<div className='flex justify-center items-end py-5'>
							<div>
								<label className="label">
									<span className="label-text font-bold text-white">Change your profile pic</span>
								</label>
								<input type="file" accept=".jpeg" className="file-input file-input-bordered file-input-primary w-full max-w-xs" onChange={handleChangeAvatar} />
							</div>
							{
								avatar === undefined || avatar === "" ? (
									<div className='btn hidden'> SAVE </div>
								) : (
									<div className='btn rounded-lg btn-primary ml-3' onClick={() => {CyberPongUser.editAvatar(avatar, () => {}, undefined)}}> SAVE </div>
								)
							}
						</div>
						<Link to="/">
							<div className="btn btn-warning btn-lg items-center justify-center"> 
								CONTINUA 
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)

}