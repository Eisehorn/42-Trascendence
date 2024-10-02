import * as React from "react";
import {Link} from "react-router-dom";

import {CiMenuKebab} from "react-icons/ci";
import {GiExitDoor} from "react-icons/gi";
import {FaAccessibleIcon} from "react-icons/fa";
import {FaHandHoldingMedical} from "react-icons/fa6";

import {Channel} from "../../utils/ChatUtils/Channel";
import {leaveChannel} from "../../utils/ChatUtils/ChatApi";

interface chatProps {
    channel: Channel;
    avatar: string;
    setIsDel: Function | null;
    setStato: Function | null;
}

export default function ChatCard(props: chatProps) {

    // TODO CHANGE THIS TEMP VAR WITH THE 'props.avatar'
    let rest: string = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

    return (
        <div className="flex w-full items-center border border-gray-200 bg-slate-800 rounded-lg">
            <Link to={"/chat/" + props.channel.id + "/" + props.channel.name} className=" flex w-full items-center">
                <img className="flex max-h-20 rounded-lg justify-start" src={rest}/>
                <div className="flex px-4 w-full rounded-lg h-full overflow-hidden">
                    <label
                        className=" flex max-h-20 font-extrabold w-full justify-stretch"> {props.channel.name} </label>
                </div>
            </Link>
            <div className="dropdown dropdown-top dropdown-end absolute right-2 top-4">
                <label tabIndex={0} className="btn btn-ghost btn-xs"><CiMenuKebab/></label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => leaveChannel(props.channel, props.setIsDel, props.setStato)}><a
                        className="text-red-600">Leave channel <GiExitDoor/></a></li>
                </ul>
            </div>
        </div>
    )
}

export function ChatCardWithoutLink(props: chatProps) {

    // TODO CHANGE THIS TEMP VAR WITH THE 'props.avatar'
    let rest: string = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

    return (
        <div className="flex w-full items-center border border-gray-200 bg-slate-800 rounded-lg">
            <img className="flex max-h-20 rounded-lg justify-start" src={rest}/>
            <div className="flex px-4 w-full rounded-lg h-full overflow-hidden">
                <label className=" flex max-h-20 font-extrabold w-full justify-stretch"> {props.channel.name} </label>
            </div>
            <div className="dropdown dropdown-top dropdown-end absolute right-2 top-4">
                <label tabIndex={0} className="btn btn-ghost btn-xs"><CiMenuKebab/></label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => leaveChannel(props.channel, props.setIsDel, props.setStato)}><a
                        className="text-red-600">Leave channel <GiExitDoor/></a></li>
                </ul>
            </div>
        </div>
    )
}

//<Link to={"/chat/" + props.channel.id + "/" + props.channel.name}></Link>