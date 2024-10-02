import React, { useRef, useState } from 'react';

import { TokenAuth } from '../../utils/Auth';
import { Channel } from '../../utils/ChatUtils/Channel';
import { createChannel } from '../../utils/ChatUtils/ChatApi';

interface SetSuccProps {
	setSucc:	Function;
	setStato:	Function;
}

export default function NewChat(props: SetSuccProps) {

	const [channelName, setChannelName] = useState(undefined);
	const [channelPassword, setChannelPassword] = useState(undefined);
	const [channelBool, setChannelBool] = useState(false);

	const handleChangeName = event => {
		setChannelName(event.target.value)
	};
	
	const handleChangePassword = event => {
		setChannelPassword(event.target.value)
	};

	const handleChangeBool = ()=> {
		if (channelBool)
			setChannelBool(false);
		else
			setChannelBool(true);
	};

	return (
		<>
			<div className='modal-box justify-center items-center'>
				<div className='flex justify-center items-center'>
					<label className='font-bold text-center text-lg'> CREATE NEW CHANNEL</label>
				</div>
				<div className='flex justify-center py-10'>
					<div className="relative form-control w-full max-w-xs">
						<div className=''>
							<label className="label">
								<span className="label-text text-xl">Channel name?</span>
							</label>
							<input type="text" placeholder="" className="input input-bordered w-full input-2xl max-w-xs" id='channelName' onChange={handleChangeName}/>
						</div>
						<div className='mt-5'>
							<label className="label top-2">
								<span className="label-text text-xl">Channel password?</span>
							</label>
							<input type="password" placeholder="" className="input input-bordered w-full input-2xl max-w-xs" id='channelPassword' onChange={handleChangePassword}/>
							<label className="label">
								<span className="label-text-alt"></span>
								<span className="label-text-alt text-xs">leave empty for no password</span>
							</label>
						</div>
						<div className='mt-5'>
							<div className="form-control w-52">
								<label className="cursor-pointer label">
									<input type="checkbox" className="toggle toggle-accent" checked={channelBool} onChange={handleChangeBool}/>
									<span className="label-text">Private</span> 
								</label>
							</div>
						</div>
						<div className='mt-5 flex justify-center items-center'>
							{
								channelName === undefined || channelName === "" ? (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125 btn-disabled' > SAVE </button></form></div>
								) : (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125' onClick={() => createChannel(channelName, channelPassword, channelBool, props.setSucc, props.setStato)}> SAVE </button></form></div>
								)
							}
						</div>
					</div>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</>
	)
}