import * as React from "react"

interface avatarProps {
	img: string;
}

export default function Avatar(props: avatarProps) {

	return (
		<div className="avatar">
			<div className="rounded-full border border-spacing-0 border-gray-300 w-[160px] h-[160px]" >
				<img src={props.img}></img>
			</div>
		</div>
	)
}