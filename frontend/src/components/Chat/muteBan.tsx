import * as React from "react";
import { muteUser } from "../../utils/ChatUtils/ChatApi";

interface muteProps {
	channelId:	string;
	userId:		string;
	setIsSucc:	Function;
}

export default function MuteBan(props: muteProps) {
	const [channelName, setChannelName] = React.useState(undefined);
	
	const handleChangeName = event => {
		setChannelName(event.target.value)
	};

	return (
		<>
			<div className='modal-box justify-center items-center'>
				<div className='flex justify-center items-center'>
					<label className='font-bold text-center text-lg'> Mute User</label>
				</div>
				<div className='flex justify-center py-10'>
					<div className="relative form-control w-full max-w-xs">
						<div className=''>
							<label className="label">
								<span className="label-text text-xl">Until?</span>
							</label>
							<input type="datetime-local" placeholder="" className="input input-bordered w-full input-2xl max-w-xs" id='channelName' onChange={handleChangeName}/>
						</div>
						<div className='mt-5 flex justify-center items-center'>
							{
								channelName === undefined || channelName === "" ? (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125 btn-disabled' > SAVE </button></form></div>
								) : (
									<div className="modal-action"><form method="dialog"><button className='btn btn-primary btn-lg rounded-2xl hover:scale-125' onClick={() => {muteUser(props.channelId, props.userId, new Date(channelName)).then((num) => { num === 200 ? props.setIsSucc(true) : props.setIsSucc(false)})}}> SAVE </button></form></div>
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