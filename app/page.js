"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function Pomodoro() {
	const DEF_SESS = 1500;
	const DEF_BRK = 300;

	const [timeStatus, setTimeStatus] = useState(DEF_SESS);
	const [breakStatus, setBreakStatus] = useState(DEF_BRK);
	const [sessionInterval, setSessionInterval] = useState(null);
	const [breakInterval, setBreakInterval] = useState(null);
	const [session, setSession] = useState(DEF_SESS);
	const [breaktime, setBreak] = useState(DEF_BRK);
	const [isSession, setIsSession] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [isSessOver, setIsSessOver] = useState(false);

	useEffect(() => {
		if (timeStatus <= 0) {
			setTimeStatus(DEF_SESS);
			setIsSessOver(true);
			stopTimer();
		}
	}, [timeStatus, breaktime]);

	// useEffect(() => {
	// 	return () => {
	// 		// Cleanup function to clear the interval when the component unmounts
	// 		stopTimer();
	// 	};
	// }, []);

	const startSession = () => {
		if (!sessionInterval) {
			const sessionIntervalId = setInterval(() => {
				setTimeStatus((prev) => {
					return prev - 1;
				});
			}, 1000);
			setSessionInterval(sessionIntervalId);
			setIsSession(true);
			setIsBreak(false);
		}
	};

	const startBreak = () => {
		if (!breakInterval) {
			const breakIntervalId = setInterval(() => {
				setBreakStatus((prev) => {
					return prev - 1;
				});
			}, 1000);
			setBreakInterval(breakIntervalId);
			setIsSession(false);
			setIsBreak(true);
			setIsSessOver(false);
		}
	};

	const stopTimer = () => {
		clearInterval(sessionInterval);
		clearInterval(breakInterval);
		setSessionInterval(null);
		setBreakInterval(null);
	};

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedSeconds =
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
		return `${minutes}:${formattedSeconds}`;
	}

	const changeSess = (operator) => {
		if (!sessionInterval && session == time) {
			if (operator === "add") {
				setSession((prev) => {
					const newSess = prev + 60;
					setTime(newSess);
					return newSess;
				});
			} else if (operator === "sub" && session > 60) {
				setSession((prev) => {
					const newSess = prev - 60;
					setTime(newSess);
					return newSess;
				});
			}
		}
	};

	const changeBreak = (operator) => {
		if (!sessionInterval && session == time) {
			if (operator === "add") {
				setBreak((prev) => {
					return prev + 60;
				});
			} else if (operator === "sub" && breaktime > 0) {
				setBreak((prev) => {
					return prev - 60;
				});
			}
		}
	};

	const resetTimer = () => {
		setSession(DEF_SESS);
		setBreakStatus(DEF_BRK);
		setTimeStatus(DEF_SESS);
		clearInterval(sessionInterval);
		clearInterval(breakInterval);
		setSessionInterval(null);
		setBreakInterval(null);
	};

	const startBreakBtn = (
		<button onClick={() => startBreak()}>Start Break!</button>
	);

	const displayStatus = () => {
		if (isSessOver) {
			return startBreakBtn;
		} else if (!isSessOver && isSession) {
			return <h1>{formatTime(timeStatus)}</h1>;
		} else if (isBreak) {
			return <h1>{formatTime(breakStatus)}</h1>;
		} else {
			return <h1>{formatTime(timeStatus)}</h1>;
		}
	};

	return (
		<div className={styles.allContainer}>
			<div className={styles.statusLabel}>
				{/* {timeInterval ? (
					<div>{isSession ? <label>Session</label> : <label>Break</label>}</div>
				) : (
					<label>Good Morning!</label>
				)} */}
			</div>
			<div id="pomodoro" className={styles.pomodoro}>
				<div className={styles.timer}>
					{!sessionInterval ? (
						<button
							onClick={startSession}
							className={`${styles.timeBtn} ${styles.startStopBtn}`}
						>
							<FontAwesomeIcon icon={faPlay} />
						</button>
					) : (
						<button
							onClick={stopTimer}
							className={`${styles.timeBtn} ${styles.startStopBtn}`}
						>
							<FontAwesomeIcon icon={faStop} />
						</button>
					)}
					<div className={styles.status}>{displayStatus()}</div>
					<button
						onClick={resetTimer}
						className={`${styles.timeBtn} ${styles.resetBtn}`}
					>
						<FontAwesomeIcon icon={faPowerOff} />
					</button>
				</div>

				<div className={styles.update}>
					<div className={styles.session}>
						<button
							onClick={() => changeSess("add")}
							className={styles.updateBtn}
						>
							+
						</button>
						<div>
							<label>Session</label>
							<h2 id="session-length">{session / 60}</h2>
						</div>
						<button
							onClick={() => changeSess("sub")}
							className={styles.updateBtn}
						>
							-
						</button>
					</div>
					<div className={styles.break}>
						<button
							onClick={() => changeBreak("add")}
							className={styles.updateBtn}
						>
							+
						</button>
						<div>
							<label>Break</label>
							<h2>{breaktime / 60}</h2>
						</div>
						<button
							onClick={() => changeBreak("sub")}
							className={styles.updateBtn}
						>
							-
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
