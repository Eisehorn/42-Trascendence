import React, {useRef, useEffect} from 'react';
import {addMessageHandler, removeMessageHandler} from "../utils/WSUtil";

interface gameProps {
    setInGame: React.Dispatch<React.SetStateAction<boolean>>
    ws: WebSocket;
}


export default function PongGame(props: { ws: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const msgHandler = (msg) => {
            if (msg.event == "match_sync") {
                animate(msg.data)
            }
        };
        addMessageHandler(msgHandler)

        let goUp = false;
        let goDown = false;
        const keyDownHandler = (e: any) => {
            if (e.keyCode === 38) {
                goUp = true;
            } else if (e.keyCode === 40) {
                goDown = true;
            } else if (e.keyCode === 87) {
                goUp = true;
            } else if (e.keyCode === 83) {
                goDown = true;
            }
        };
        const keyUpHandler = (e: any) => {
            if (e.keyCode === 38) {
                goUp = false;
            } else if (e.keyCode === 40) {
                goDown = false;
            } else if (e.keyCode === 87) {
                goUp = false;
            } else if (e.keyCode === 83) {
                goDown = false;
            }
        };

        const timer = setInterval(() => {
            if (goUp) {
                props.ws.send(JSON.stringify({event: "game_up"}))
            }
            if (goDown) {
                props.ws.send(JSON.stringify({event: "game_down"}))
            }
            return false;
        }, 10)


        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);

        const canvas = canvasRef.current;

        if (!canvas) return;
        const context = canvas.getContext('2d');

        if (!context) return;
        contextRef.current = context;

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = 1920;
        canvas.height = 1080;

        const animate = (mawtf) => {
            const context = contextRef.current;
            context?.clearRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = "white"
            context.textAlign = "center";
            context.font = "60px Arial bold";
            context.fillText(`${mawtf.opponent1.score} - ${mawtf.opponent2.score}`, 1920 / 2, 50);

            context?.beginPath();
            context?.arc(mawtf.ball.pos.x, mawtf.ball.pos.y, 15, 0, Math.PI * 2);
            context!.fillStyle = 'red';
            context?.fill();
            context?.closePath();

            if (mawtf.neon) {
                context!.fillStyle = "purple";
                context?.fillRect(mawtf.power.x, mawtf.power.y, 50, 50)
            }

            context!.fillStyle = mawtf.opponent1.is_me ? 'blue' : 'white';
            context?.fillRect(mawtf.opponent1.pos.x, mawtf.opponent1.pos.y - (mawtf.opponent1.height / 2), 15, mawtf.opponent1.height);
            context!.fillStyle = mawtf.opponent2.is_me ? 'blue' : 'white';
            context?.fillRect(mawtf.opponent2.pos.x - 15, mawtf.opponent2.pos.y - (mawtf.opponent2.height / 2), 15, mawtf.opponent2.height);
            requestAnimationFrame(() => {
            });
        };

        return () => {
            clearInterval(timer)
            removeMessageHandler(msgHandler)
            document.removeEventListener("keydown", keyDownHandler)
            document.removeEventListener("keyup", keyUpHandler)
        };
    }, []);

    return (
        <div className='w-screen h-screen'>
            <div className='flex w-full h-full border-4'>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};
