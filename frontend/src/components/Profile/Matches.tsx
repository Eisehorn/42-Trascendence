import React from "react";

export default function Matches(props: { matchHistory: any[] }) {

	function showMatches() {

		return props.matchHistory.map(match => {
			return <div key={match.id}>
				<div className="flex w-full items-center border justify-evenly border-gray-200 bg-slate-800 rounded-lg">
					<img className="flex w-20 h-20  rounded-lg justify-start" src={match.winner.avatar}/>
					<div className="flex px-4 w-full rounded-lg h-full overflow-hidden items-center">
						<label className=" flex max-h-20 font-extrabold w-full justify-stretch "> {`${match.winner.username} vs ${match.looser.username}`} </label>
					</div>
					<img className="flex w-20 h-20 rounded-lg justify-end" src={match.looser.avatar}/>
				</div>
			</div>
		})
	}

	return (
		<div className="flex flex-col rounded-box border-purple-800 w-full">
			{showMatches()}
		</div>
	)
}