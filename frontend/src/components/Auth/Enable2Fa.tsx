import * as React from "react";
import {TokenAuth} from "../../utils/Auth";
import {useEffect} from "react";

interface TokenProps {
	access_token: string;
	enable2fa: Function;	/* to make the settings reappear */
}

async function sendReq(code: string,  setSucc: Function, props: TokenProps) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/enable2fa`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + props.access_token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"code": code})
	});
	const json = await data.json();
	if (json) {
		if (json.statusCode == 200) {
			props.enable2fa(false);
			setSucc(true);
		}
		TokenAuth.clearToken()
		window.location.assign("/");
	}
}

async function askReq(setImg: Function, props: TokenProps) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/enable2fa`, {
		method: "GET", 
		headers: {
			"Authorization": "Bearer " + props.access_token, 
			"Content-Type": "application/json"
		}
	});
	const blob = await data.blob()
	setImg(URL.createObjectURL(blob));
}

export default function Enable2fa(props: TokenProps) {

	const [img, setImg] = React.useState(undefined);
	const [succ, setSucc] = React.useState(false);

	useEffect(() => {
		askReq(setImg, props);
	}, []);

	const [otp, setOtp] = React.useState<string[]>([]);

	const inputs = [
		React.useRef<HTMLInputElement>(null),
		React.useRef<HTMLInputElement>(null),
		React.useRef<HTMLInputElement>(null),
		React.useRef<HTMLInputElement>(null),
		React.useRef<HTMLInputElement>(null),
		React.useRef<HTMLInputElement>(null)
	];

	const showInputs = () => {
		const components: any[] = [];
		for (let i = 0; i < 6; i++) {
			components.push(<input className="m-2 border h-10 w-10 text-center form-control rounded" name="otp" type="text" maxLength={1} ref={inputs[i]} key={i} onKeyDown={e => {
				const data = inputs[i];
				if (otp.length == 6)
					sendReq(otp.join(""), setSucc, props);
				else {
					if (data.current?.value) {
						otp.push(data.current.value);
						if (i + 1 < 6)
							inputs[i + 1].current?.focus();
						if (otp.length == 6) {
							sendReq(otp.join(""), setSucc, props);
						}
					} 
					else {
						if (i != 0) {
							otp.pop();
							inputs[i - 1].current?.focus();
						}
					}
				}
			}} />)
		}
		return components;
	}

	if (succ) {
		return (
			<>
				<div className="modal-box justify-center items-center">
					<div className='flex justify-center'>
						<h1>Two Factor Authentication Enabled.</h1>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</>
		)
	}
	return (
		<>
			<div className="modal-box justify-center items-center">
				<div className='flex justify-center py-5'>
					<span className="font-bold "> Scan me with Google Auth to obtain the code... </span>
				</div>
				<div className='flex justify-center'>
					<img src={img} className="test" alt="test" />
				</div>
				<div className='flex justify-center py-5'>
					{showInputs()}
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</>
	);
	
}