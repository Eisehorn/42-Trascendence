import * as React from "react";
import { useParams } from "react-router-dom";
import ArrowBack from "../ArrowBack";


export default function EndGame() {
	let { type } = useParams();

	return (
		<div className="flex h-screen items-center justify-center">
			<ArrowBack path={""}></ArrowBack>
			<div className="relative h-4/5 w-4/5">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
				<div className="relative flex h-full w-full pt-10 rounded bg-gray-900 justify-center items-center">
					<div className="flex h-full w-full justify-center items-center">
						<div className=" h-1/2 w-1/4">
							{
								type === "winner" ? (
									<img src="https://art.pixilart.com/f1d67478377bbc3.gif"></img>
								) : (
									<img src="https://art.pixilart.com/a9e00f3e24ec365.gif"></img>
								)
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}