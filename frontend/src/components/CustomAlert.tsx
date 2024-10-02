import React, {useEffect, useState} from 'react';
import {TokenAuth} from "../utils/Auth";
 
type CustomAlertProps = {
	isOpen: boolean;
	message: string;
	onClose: () => void;
};

type ChatDeleteAlertProps = {
	isOpen:		boolean;
	onClose:	() => void;
}

type ChatAddAlertProps = {
	isOpen:		boolean;
	onClose: () => void;
}

type KickBanAlertProps = {
	isOpen:		boolean;
	message:	string;
	type:		boolean;
	onClose:	() => void;
}

type FriendRequestProps = {
	message:	string;
	accept:		() => void;
	refuse:		() => void;
}
 
export const CustomAlert: React.FC<CustomAlertProps> = ({ isOpen, message, onClose }) => {
	if (!isOpen) {
		return null; // Render nothing if the alert is closed
	}
	
	return (
		<div className="alert alert-success absolute z-50 bottom-5 w-fit left-10">
			<span>{message}</span>
			<div>
				<button className="btn btn-sm btn-primary" onClick={onClose}>Close</button>
			</div>	
		</div>
	);
};

export const ChatDeleteAlert: React.FC<ChatDeleteAlertProps> = ({isOpen, onClose}) => {
	if (!isOpen) {
		return null;
	}
	return (
		<div className="alert alert-warning absolute z-50 bottom-5 w-fit left-10">
			<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span>You left the channel!</span>
			<div>
				<button className="btn btn-sm btn-primary" onClick={onClose}> Close </button>
			</div>
		</div>
	)
}

export const ChatAddAlert: React.FC<ChatAddAlertProps> = ({isOpen, onClose}) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="alert alert-success absolute z-50 bottom-5 w-fit left-10">
			<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>The channel has been created!</span>
			<div>
				<button className="btn btn-sm btn-primary" onClick={onClose}>Close</button>
			</div>
		</div>
	);
}

export const KickBanAlert: React.FC<KickBanAlertProps> = ({ isOpen, message, type, onClose }) => {
	if (!isOpen) {
		return null; // Render nothing if the alert is closed
	}
	
	if (type) {
		return (
			<div className="alert alert-warning absolute z-50 bottom-5 w-fit left-10">
				<span>{message}</span>
				<div>
					<button className="btn btn-sm btn-primary" onClick={onClose}>Close</button>
				</div>	
			</div>
		);
	}
	else {
		return (
			<div className="alert alert-error absolute z-50 bottom-5 w-fit left-10">
				<span>{message}</span>
				<div>
					<button className="btn btn-sm btn-primary" onClick={onClose}>Close</button>
				</div>	
			</div>
		);
	}
};

async function getFriendRequests() {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/friend/request`, {
		method: 'GET',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: null
	})
	return await data.json();
}

async function acceptFriendRequest(requestId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/friend/accept`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({requestId: requestId})
	})
	return await data.json();
}

async function rejectFriendRequest(requestId: string) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/friend/reject`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + TokenAuth.getAccessToken(),
			"Content-Type": "application/json"
		},
		body: JSON.stringify({requestId: requestId})
	})
	return await data.json();
}

export const FriendRequest: React.FC = () => {
	const [showRequest, setShowRequest] = useState<any | undefined>();
	useEffect(() => {
		getFriendRequests().then(requests => {
			if (requests.length != 0) {
				setShowRequest(requests[0])
			} else {
				setShowRequest(undefined)
			}
		})
	}, []);

	if (!showRequest) {
		return undefined;
	}

	return (
		<div className="alert alert-success absolute z-50 bottom-5 w-fit left-10">
			<span> {`${showRequest.sender.username} sent you a friend request!`} </span>
			<div>
				<button className="btn btn-sm btn-primary" onClick={() => {
					acceptFriendRequest(showRequest.id);
					setShowRequest(undefined);
				}}>Accept</button>
			</div>
			<div>
				<button className="btn btn-sm btn-primary" onClick={() => {
					rejectFriendRequest(showRequest.id);
					setShowRequest(undefined);
				}}>Refuse</button>
			</div>
		</div>
	);
};

