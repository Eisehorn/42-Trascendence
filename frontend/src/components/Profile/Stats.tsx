import React from "react";

export default function StatProfile(props: { matchesHistory: any[], userId: string }) {

    return (
        <div className="absolute stats stats-vertical lg:stats-horizontal shadow left-5 bg-gray-800">

            <div className="stat place-items-center hover:text-secondary z-50">
                <div className="stat-title ">Total Games</div>
                <div className="stat-value">{props.matchesHistory.length}</div>
            </div>

            <div className="stat place-items-center hover:text-secondary">
                <div className="stat-title">Win Games</div>
                <div
                    className="stat-value">{props.matchesHistory ? props.matchesHistory.filter(obj => obj.winner.id === props.userId).length : 0}</div>
            </div>

            <div className="stat place-items-center hover:text-secondary">
                <div className="stat-title">Lost Games</div>
                <div
                    className="stat-value">{props.matchesHistory ? props.matchesHistory.filter(obj => obj.looser.id === props.userId).length : 0}</div>
            </div>

        </div>
    )
}