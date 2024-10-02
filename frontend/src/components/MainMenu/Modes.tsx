import React, { useState } from "react";
import ClassicAnimation from "../Animations/ClassicAnimation";
import { Link } from 'react-router-dom';
import NeonPongAnimation from "../Animations/NeonPongAnimation";

export default function Modes() {

	const [isHover, setIsHover] = useState(false);
	
	return (
		<div className="columns gap-8 flex justify-center items-center flex-grow px-16 py-16">
			<div className="relative inline-flex group h-full w-full">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
				</div>
				<Link to="/matchmaking/classic">
				<button className="relative px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 h-full w-full">
					<span className="transition-colors duration-300 ease-in-out" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
						<ClassicAnimation active={isHover}/>
					</span>
				</button>
				</Link>
			</div>
			<div className="relative inline-flex group w-full h-full">
				<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
				</div>
				<Link to="/matchmaking/neon">
				<button className="relative px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 h-full w-full">
					<span className="transition-colors duration-300 ease-in-out" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
						<NeonPongAnimation active={isHover}/>
					</span>
				</button>
				</Link>
			</div>
		</div>
	)
}