import React, { useRef, useEffect } from 'react';

interface hoverProps {
	active: boolean;
}

export default function NeonPongAnimation(props: hoverProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const ball = useRef({
		x: 100,
		y: 100,
		radius: 10,
		speedX: 3,
		speedY: 3,
	});

	useEffect(() => {

		const canvas = canvasRef.current;

		if (!canvas) return;
		const context = canvas.getContext('2d');

		if (!context) return;
		contextRef.current = context;

		canvas.style.width ='100%';
		canvas.style.height='100%';
		canvas.width  = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		let animationId: number | null = null;

		const animate = () => {
			const context = contextRef.current;
			context?.clearRect(0, 0, canvas.width, canvas.height);

			if (props.active) {
				ball.current.x += ball.current.speedX;
				ball.current.y += ball.current.speedY;

				if (ball.current.x + ball.current.radius > canvas.width || ball.current.x - ball.current.radius < 0) {
					ball.current.speedX *= -1;
				}
				if (ball.current.y + ball.current.radius > canvas.height || ball.current.y - ball.current.radius < 0) {
					ball.current.speedY *= -1;
				}
				if (ball.current.x + ball.current.radius > canvas.width - 20 || ball.current.x - ball.current.radius <= 30) {
					ball.current.speedX *= -1;
					ball.current.speedY *= -1;
				}
			}
			context?.beginPath();
			context?.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
			context!.fillStyle = 'white';
			context?.fill();
			context?.closePath();
			context!.fillStyle = 'white';
			context?.fillRect(20, ball.current.y - 50, 10, 100);
			context!.fillStyle = 'white';
			context!.fillRect(canvas.width - 20, ball.current.y - 50, 10, 100);

			context!.fillStyle = "white";
			context!.font = "bold 30px Arial ";
			context?.fillText("Neon Pong", canvas.width / 2 - 60, canvas.height / 2 + 10 );
			if (props.active) {
				animationId = requestAnimationFrame(animate);
			}
		};
		animate();
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [props.active]);

	return (
		<div className='flex w-full h-full border-2'>
			<canvas ref={canvasRef}>
			</canvas>
		</div>
	);
}