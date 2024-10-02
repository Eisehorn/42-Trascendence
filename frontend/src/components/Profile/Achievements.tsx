import React, {useEffect} from "react";
import {GiTrophy} from "react-icons/gi";

class Achievement {
    id: string;
    amount: number;
    name: string;
    about: string;
    done: boolean = false;

    constructor(id: string, amount: number, name: string, about: string) {
        this.id = id;
        this.amount = amount;
        this.name = name;
        this.about = about;
    }

    setDone(done: boolean) {
        this.done = done;
    }

}

function NewAchievemet(ach: Achievement) {
    return (
        <div className="h-20 w-full" key={ach.id}>
            <div className="flex w-full items-center border border-purple-700 bg-slate-800 rounded-lg">
                <GiTrophy className="ml-2" size={65} color={ach.done ? 'gold' : 'white'}/>
                <div className="flex px-4 w-full rounded-lg h-full">
                    <label className="flex max-h-20 font-extrabold w-full justify-stretch"> {ach.name} </label>
                </div>
            </div>
        </div>
    )
}

export default function Achievements(props: { matchHistory: any[], userId: string }) {
    let [achievements, setAchievements] = React.useState<Map<string, Achievement>>(new Map<string, Achievement>);
    let [achComponents, setAchComponents] = React.useState(undefined);

    achievements.set("3_Win", new Achievement("3_Win", 3, "3 Win", ""))
    achievements.set("5_Win", new Achievement("5_Win", 5, "5 Win", ""))
    achievements.set("10_Win", new Achievement("10_Win", 10, "10 Win", ""))
    achievements.set("20_Win", new Achievement("20_Win", 20, "20 Win", ""))
    achievements.set("50_Win", new Achievement("50_Win", 50, "50 Win", ""))
    achievements.set("60_Win", new Achievement("60_Win", 60, "60 Win", ""))
    achievements.set("70_Win", new Achievement("70_Win", 70, "70 Win", ""))
    achievements.set("80_Win", new Achievement("80_Win", 80, "80 Win", ""))
    achievements.set("90_Win", new Achievement("90_Win", 90, "90 Win", ""))

    function showAchievemets() {
        let components: Array<React.JSX.Element> = [];
        for (let key of achievements.keys()) {
            components.push(NewAchievemet(achievements.get(key) as Achievement))
        }
        setAchComponents(components);
    }

    useEffect(() => {
        if (props.matchHistory != null) {
            const wonMatches = props.matchHistory.filter(match => match.winner.id == props.userId).length;
            achievements.forEach((value, key) => {
                value.setDone(value.amount <= wonMatches);
            })

            setAchievements(achievements)

            showAchievemets()
        }
    }, [props.matchHistory]);

    return (
        <div className="flex flex-col rounded-box border-purple-800 w-full">
            {achComponents}
        </div>
    )
}