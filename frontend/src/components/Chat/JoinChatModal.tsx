import React, { useRef, useState } from 'react';

import { joinChannel, getAllChannels } from '../../utils/ChatUtils/ChatApi';

interface SetSuccProps {
	setSucc:	Function;
	setStato:	Function;
	autofill:	string;
}


export default function JoinChat(props: SetSuccProps) {

	const [channelId, setChannelId] = useState(undefined);
	const [channelPassword, setChannelPassword] = useState(undefined);

	const handleChangeName = event => {
		setChannelId(event.target.value)
	};
	
	const handleChangePassword = event => {
		setChannelPassword(event.target.value)
	};

	return (
		<>
			<div className='modal-box justify-center items-center'>
				<div className='flex justify-center items-center'>
					<label className='font-bold text-center text-lg'> JOIN CHANNEL</label>
				</div>
				<div className='flex justify-center py-10'>
					<div className="relative form-control w-full max-w-xs">
						<div className=''>
							<label className="label">
								<span className="label-text text-xl">Channel id?</span>
							</label>
							<input value={props.autofill} type="text" placeholder="" className="input input-bordered w-full input-2xl max-w-xs" id='channelId' onChange={handleChangeName}/>
						</div>
						<div className='mt-5'>
							<label className="label top-2">
								<span className="label-text text-xl">Channel password?</span>
							</label>
							<input type="password" placeholder="" className="input input-bordered w-full input-2xl max-w-xs" id='channelJoinPassword' onChange={handleChangePassword}/>
							<label className="label">
								<span className="label-text-alt"></span>
								<span className="label-text-alt text-xs">leave empty for no password</span>
							</label>
						</div>
						<div className='mt-5 flex justify-center items-center'>
							{
								!props.autofill && (channelId === undefined || channelId === "") ? (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125 btn-disabled' > JOIN </button></form></div>
								) : (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125' onClick={() => joinChannel(props.autofill ? props.autofill : channelId, channelPassword)}> JOIN </button></form></div>
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