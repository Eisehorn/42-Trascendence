import * as React from "react";

import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

interface arrowProps {
	path:		string;
}

// Component to make the top left aligned arrow to go back. Pass the path you want the arrow go, empty string to default dashboard.
export default function ArrowBack(props: arrowProps) {
	return (
		<div className="absolute left-5 top-5" >
			<Link to={"/" + props.path}>
				<div className="relative ">
					<div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xxl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
					</div>
					<IoArrowBackOutline className="btn btn-primary border-0 bg-gray-800 btn-circle w-10 h-4"></IoArrowBackOutline>
				</div>
			</Link>
		</div>
	)

}