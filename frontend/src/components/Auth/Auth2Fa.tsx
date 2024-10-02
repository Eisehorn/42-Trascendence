import * as React from "react";

interface LoginProps {
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>
	temp_access_token: string
}

async function getUser(code: string, props: LoginProps) {
	const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/auth/2fa`, {
		method: 'POST',
		headers: {
			"Authorization": "Bearer " + props.temp_access_token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"code": code})
	});
	const json = await data.json();
	if (json) {
		props.setToken(json);
		window.location.assign("/");
	}
}

export default function LoginTwoFa(props: LoginProps) { 
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
					getUser(otp.join(""), props);
				else {
					if (data.current?.value) {
						otp.push(data.current.value);
						if (i + 1 < 6)
							inputs[i + 1].current?.focus();
						if (otp.length == 6) {
							getUser(otp.join(""), props);
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

	return (
		<div className="flex items-center justify-center h-screen w-screen">
			<div className="card w-96 h-52 bg-neutral text-neutral-content shadow-2xl">
				<div id="otp" className="card-body items-center text-center">
					<div className=" card-title px-2 mt-5">
						{showInputs()}
					</div>
					<div className="card-actions justify-end">
						<button className="btn btn-outline btn-error" onClick={() => window.location.assign("/")}> Back </button>
					</div>
				</div>
			</div>
		</div>
		
	);
}

//						setOtp([
//							...otp, data.current.value
//						  ]);