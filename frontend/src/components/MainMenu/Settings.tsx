import React, {useEffect, useState} from 'react';
import Enable2fa from '../Auth/Enable2Fa';
import Disable2Fa from '../Auth/Disable2Fa';
import {CyberPongUser} from "../../utils/User"

interface TokenProps {
    access_token: string;
    twoFaEnabled: boolean;
    setEditedName: Function;
    setEditedAvatar: Function;
}

async function sendReq(setIsSucc: Function, setDisable2FA: Function, props: TokenProps) {
    const data = await fetch(`http://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/users/disable2fa`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + props.access_token,
            "Content-Type": "application/json"
        },
    });
    const json = await data.json();
    if (json) {
        if (data.status == 200) {
            setIsSucc(true);
            setDisable2FA(false);
        }
    }
}

export default function Settings(props: TokenProps) {
    const [enable2Fa, setEnable2Fa] = useState(false);
    const [isSucc, setIsSucc] = useState<boolean>(false);

    const [username, setUsername] = useState(undefined);
    const [avatar, setAvatar] = useState(undefined);

    const [showDisable2Fa, setShowDisable2Fa] = useState(true)

    const handleChangeUsername = event => {
        setUsername(event.target.value)
    };

    const handleChangeAvatar = event => {
        setAvatar(event.target.files[0])
    };

    const twoFaBtn = () => {
        if (props.twoFaEnabled) {
            /* /users/disable2fa/ POST */
            if (showDisable2Fa) {
                return (
                    <div className='btn btn-outline btn-error'
                         onClick={() => sendReq(setIsSucc, setShowDisable2Fa, props)}> Disable 2FA</div>
                )
            }
        }
        return (
            <div className='btn btn-outline btn-accent' onClick={() => setEnable2Fa(true)}> Enable 2FA</div>
        )
    }

    let alert_: React.JSX.Element | undefined = undefined
    useEffect(() => {
        if (isSucc) {
            alert_ = <Disable2Fa isSucc={isSucc}></Disable2Fa>
        }
    }, [isSucc])

    if (enable2Fa) {
        return (
            <Enable2fa access_token={props.access_token} enable2fa={setEnable2Fa}/>
        );
    }

    return (
        <>
            <div className="modal-box justify-center items-center">
                <div className='flex justify-center font-bold text-2xl text-[#fb04e6]'>Settings</div>
                <div className='flex justify-center items-end py-5'>
                    <div>
                        <label className="label">
                            <span className="label-text font-bold text-white">Change your username</span>
                        </label>
                        <input type="text" placeholder="Type here"
                               className="input input-bordered input-secondary w-full max-w-xs"
                               onChange={handleChangeUsername}/>
                    </div>
                    {
                        username === undefined || username === "" ? (
                            <div className='btn hidden'> SAVE </div>
                        ) : (
                            <div className='btn rounded-lg btn-primary ml-3' onClick={() => {
                                CyberPongUser.editUsername(username, props.setEditedName, undefined)
                            }}> SAVE </div>
                        )
                    }
                </div>
                <div className='flex justify-center items-end py-5'>
                    <div>
                        <label className="label">
                            <span className="label-text font-bold text-white">Change your profile pic</span>
                        </label>
                        <input type="file" accept=".jpeg"
                               className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                               onChange={handleChangeAvatar}/>
                    </div>
                    {
                        avatar === undefined || avatar === "" ? (
                            <div className='btn hidden'> SAVE </div>
                        ) : (
                            <div className='btn rounded-lg btn-primary ml-3' onClick={() => {
                                CyberPongUser.editAvatar(avatar, props.setEditedAvatar, undefined)
                            }}> SAVE </div>
                        )
                    }
                </div>
                <div className='flex py-5 justify-center'>
                    {twoFaBtn()}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
            <div>
                {alert_}
            </div>
        </>
    );
}