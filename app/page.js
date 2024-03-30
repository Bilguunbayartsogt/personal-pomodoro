"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
	const DEF_SESS = 1500;
	const DEF_BRK = 300;

	const [time, setTime] = useState(DEF_SESS);
	const [timeInterval, setTimeInterval] = useState(null);
	const [session, setSession] = useState(DEF_SESS);
	const [breaktime, setBreak] = useState(DEF_BRK);

	const startTimer = () => {
		if (!timeInterval) {
			setTimeInterval(
				setInterval(() => {
					setTime((prev) => {
						if (prev === 0) {
							clearInterval(timeInterval);
							setTimeInterval(null);
						}
						return prev - 1;
					});
				}, 1000)
			);
		}
	};

	const stopTimer = () => {
		clearInterval(timeInterval);
		setTimeInterval(null);
	};

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedSeconds =
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
		return `${minutes}:${formattedSeconds}`;
	}

	const changeSess = (operator) => {
		if (!timeInterval && session == time) {
			if (operator === "add") {
				setSession((prev) => {
					const newSess = prev + 60;
					setTime(newSess);
					return newSess;
				});
			} else if (operator === "sub") {
				setSession((prev) => {
					return prev - 60;
				});
			}
		}
	};

	const changeBreak = (operator) => {
		if (!timeInterval && session == time) {
			if (operator === "add") {
				setBreak((prev) => {
					return prev + 60;
				});
			} else if (operator === "sub") {
				setBreak((prev) => {
					return prev - 60;
				});
			}
		}
	};

	const resetTimer = () => {
		setSession(DEF_SESS);
		setBreak(DEF_BRK);
		setTime(DEF_SESS);
		clearInterval(timeInterval);
		setTimeInterval(null);
	};

	return (
		<div>
			<div id="pomodoro">
				<div id="timer">
					<h1>{formatTime(time)}</h1>
				</div>
				<div id="control">
					<div class="session">
						<button id="session-increment" onClick={() => changeSess("add")}>
							+
						</button>
						<div>
							<label id="session-label">Session Length</label>
							<h2 id="session-length" class="adjust">
								{session / 60}
							</h2>
						</div>
						<button id="session-decrement" onClick={() => changeSess("sub")}>
							-
						</button>
					</div>
					<div class="break">
						<button id="break-increment" onClick={() => changeBreak("add")}>
							+
						</button>
						<div>
							<label id="break-label">Break Length</label>
							<h2 id="break-length" class="adjust">
								{breaktime / 60}
							</h2>
						</div>
						<button id="break-decrement" onClick={() => changeBreak("sub")}>
							-
						</button>
					</div>
				</div>
				<div id="buttons">
					{!timeInterval ? (
						<button onClick={startTimer}>start</button>
					) : (
						<button onClick={stopTimer}>stop</button>
					)}
					<button onClick={resetTimer}>reset</button>
				</div>
			</div>
		</div>
	);
}
