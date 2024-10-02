import {useState, useReducer, useEffect} from 'react';
import * as React from "react";

import Login from "./components/Auth/Login";
import FirstLogin from './components/Auth/FirstLogin';
import Dashboard from './components/Dashboard';
import Game from "./components/Game";
import Profile from './components/Profile/Profile';
import ChatPage from './components/Chat/ChatPage';

import ErrorPage from "./routes/errorPage";

import "./App.css";

import {Route, Routes, useNavigate, } from "react-router-dom";
import { CyberPongUser } from './utils/User';
import { TokenAuth } from './utils/Auth';
import { Message} from './utils/ChatUtils/Message';
import Matchmaking from './components/Game/Matchmaking';
import { getMessageHandlers } from "./utils/WSUtil"
import LeaderBoard from './components/Game/LeaderBoard';
import EndGame from './components/Game/EndGame';

interface tokenProps {
	access_token:	string | undefined,
	refresh_token:	string | undefined
}

function gamePing(ws: WebSocket) {
	if (ws.readyState == ws.OPEN) {
		ws.send(JSON.stringify({
			event: "game_ping"
		}))
	}

	setTimeout(() => gamePing(ws), 1000);
}

function App(props: tokenProps) {
	const auth = props.access_token;
	let [user, setUser] = useState<CyberPongUser.User>(new CyberPongUser.User("", "", "", false));
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const navigate = useNavigate();

	React.useEffect(() => {
		document.querySelector('html')?.setAttribute('data-theme', "dark");
		if (user.getUsername() !== "")
			CyberPongUser.getUserSettings(props.access_token as string, user);
	}, ["dark"]);

	if (!auth)
		return (<Login />);

	useEffect(() => {
		if (TokenAuth.getFirstLogin() === true) {
			navigate("first_login")
		}

		CyberPongUser.getUserSettings(TokenAuth.getAccessToken(), user).then(obj => {
			forceUpdate()
		});
	}, []);


	const ws = new WebSocket(`ws://${import.meta.env.VITE_HOSTNAME}:${import.meta.env.VITE_BACKEND_PORT}/?token=` + TokenAuth.getAccessToken());
	let [messages, setMessages] = useState<Map<string, Message[]>>(new Map<string, Message[]>())

	gamePing(ws)

	ws.onopen = (event) => {
		ws.send(JSON.stringify(
			{
				"event": "chat_connect",
				"data": {
				}
			}
		));
	};

	ws.onmessage = (event) => {
		let json = JSON.parse(event.data);
		if (json.event === "chat_msg_receive") {
			if (messages.has(json.data.channelId)) {
				messages.get(json.data.channelId)!.push(new Message(json.data.id, json.data.message, undefined, json.data.sender, json.data.channelId, json.data.date)) 
			} else {
				messages.set(json.data.channelId as string, new Array<Message>(new Message(json.data.id, json.data.message, undefined, json.data.sender, json.data.channelId, json.data.date)))
			}
			setMessages(messages);
			forceUpdate();
		} else if (json.event === "game_start") {
			navigate(`/game/${json.data.type}`)
		} else if (json.event === "game_end") {
			navigate(`/EndGame/${json.data.isWinner ? "winner" : "loser"}`)
		} else {
			getMessageHandlers().forEach((handler) => handler(json))
		}
	};

	ws.onclose = () => {
		ws.close(0);
	}
	
	return (
		<Routes>
			<Route path="/" element={<Dashboard user={user} />} errorElement={<ErrorPage />} />
			<Route path="/first_login" element={<FirstLogin />} errorElement={<ErrorPage />} />
			<Route path="/profile/:target" element={<Profile access_token={props.access_token as string} me={user} />} errorElement={<ErrorPage />} />
			<Route path="/matchmaking/:type" element={<Matchmaking />} errorElement={<ErrorPage />} />
			<Route path='/leaderboard' element={<LeaderBoard />} errorElement={<ErrorPage />} />
			<Route path='/chat/:channelId/:channelName' element={<ChatPage ws={ws} messages={messages} user={user} setMessages={setMessages}/>} errorElement={<ErrorPage />} />
			<Route path='/game/:type' element={<Game ws={ws}/>} errorElement={<ErrorPage />} />
			<Route path="/EndGame/:type" element={<EndGame />}></Route>
		</Routes>
	)
}

//<Route path="/chat" element={<ChatPage user={user} interloc={new CyberPongUser.User("", "", "", false)}/>} errorElement={<ErrorPage />} ></Route>
export default App
