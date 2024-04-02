"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlay,
	faStop,
	faPowerOff,
	faPause,
	faForward,
} from "@fortawesome/free-solid-svg-icons";

export default function Pomodoro() {
	//constant variables:
	const DEF_SESS = 3;
	const DEF_BRK = 6;

	const [sessionTimer, setSessionTimer] = useState(DEF_SESS);
	const [breakTimer, setBreakTimer] = useState(DEF_BRK);

	const [sessionLength, setSessionLength] = useState(DEF_SESS);
	const [breakLength, setBreakLength] = useState(DEF_BRK);

	const [sessionInterval, setSessionInterval] = useState(null);
	const [breakInterval, setBreakInterval] = useState(null);

	const [isSession, setIsSession] = useState(true);
	const [isUpdateVisible, setIsUpdateVisible] = useState(true);

	useEffect(() => {
		if (sessionTimer <= 0) {
			startBreak();
		}
		if (breakTimer <= 0) {
			nextSession();
		}
	}, [sessionTimer, breakTimer]);

	useEffect(() => {
		return () => {
			stopSession();
			stopBreak();
		};
	}, []);

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedSeconds =
			remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
		return `${minutes}:${formattedSeconds}`;
	}

	const changeSess = (operator) => {
		if (!(sessionInterval && breakInterval) && sessionLength == sessionTimer) {
			if (operator === "add") {
				setSessionLength((prev) => {
					const newSess = prev + 60;
					setSessionTimer(newSess);
					return newSess;
				});
			} else if (operator === "sub" && sessionLength > 60) {
				setSessionLength((prev) => {
					const newSess = prev - 60;
					setSessionTimer(newSess);
					return newSess;
				});
			}
		}
	};

	const changeBreak = (operator) => {
		if (!(sessionInterval && breakInterval) && sessionLength == sessionTimer) {
			if (operator === "add") {
				setBreakLength((prev) => {
					const newBreak = prev + 60;
					setBreakTimer(newBreak);
					return newBreak;
				});
			} else if (operator === "sub" && breakTimer > 0) {
				setBreakLength((prev) => {
					const newBreak = prev - 60;
					setBreakTimer(newBreak);
					return newBreak;
				});
			}
		}
	};

	const playLetsGo = () => {
		const letsGo = new Audio("./lets-go.mp3");
		letsGo.play();
	};

	const startSession = () => {
		if (!sessionInterval) {
			const temp = setInterval(() => {
				setSessionTimer((prev) => {
					if (prev === 0) {
						return prev;
					}
					return prev - 1;
				});
			}, 1000);
			setSessionInterval(temp);
			if (sessionTimer === sessionLength) {
				playLetsGo();
				setIsUpdateVisible(false);
			}
		}
	};

	const startBreak = () => {
		if (!breakInterval) {
			const temp = setInterval(() => {
				setBreakTimer((prev) => {
					return prev - 1; // Otherwise, decrement sessionTimer
				});
			}, 1000);
			setBreakInterval(temp);
			clearInterval(sessionInterval); // Clear session interval when starting break
			setSessionInterval(null);
			setSessionTimer(DEF_SESS);
			setIsSession((prev) => !prev);
		}
	};

	const nextSession = () => {
		clearInterval(breakInterval);
		setBreakInterval(null);
		setBreakTimer(DEF_BRK);
		setIsSession((prev) => !prev);
		setIsUpdateVisible(true);
	};

	const skipBreak = () => {
		clearInterval(breakInterval);
		setBreakInterval(null);
		setIsSession((prev) => !prev);
		setBreakTimer(DEF_BRK);
		setIsUpdateVisible(true);
	};

	const stopSession = () => {
		clearInterval(sessionInterval);
		setSessionInterval(null);
	};

	const stopBreak = () => {
		clearInterval(breakInterval);
		setBreakInterval(null);
	};

	const resetTimer = () => {
		setSessionLength(DEF_SESS);
		setBreakLength(DEF_BRK);
		setSessionTimer(DEF_SESS);
		setBreakTimer(DEF_BRK);
		stopBreak();
		stopSession();
		setIsUpdateVisible(true);
		if (!isSession) {
			setIsSession(true);
		}
	};

	const displayStatus = () => {
		if (isSession) {
			if (sessionInterval) {
				return (
					<button
						onClick={() => stopSession()}
						className={`${styles.timeBtn} ${styles.startStopBtn}`}
					>
						<FontAwesomeIcon icon={faPause} />
					</button>
				);
			} else {
				return (
					<button
						onClick={() => startSession()}
						className={`${styles.timeBtn} ${styles.startStopBtn}`}
					>
						<FontAwesomeIcon icon={faPlay} />
					</button>
				);
			}
		} else {
			return (
				<button
					onClick={() => skipBreak()}
					className={`${styles.timeBtn} ${styles.startStopBtn}`}
				>
					<FontAwesomeIcon icon={faForward} />
				</button>
			);
		}
	};

	return (
		<>
			<div className={styles.allContainer}>
				<div className={styles.statusLabel}>
					{isSession ? <label>SESSION</label> : <label>BREAK</label>}
				</div>
				<div id="pomodoro" className={styles.pomodoro}>
					<div className={styles.timer}>
						<div className={styles.status}>
							{isSession ? (
								<h1>{formatTime(sessionTimer)}</h1>
							) : (
								<h1>{formatTime(breakTimer)}</h1>
							)}
						</div>
						<div className={styles.timeBtnContainer}>
							{displayStatus()}
							<button
								onClick={resetTimer}
								className={`${styles.timeBtn} ${styles.resetBtn}`}
							>
								<FontAwesomeIcon icon={faPowerOff} />
							</button>
						</div>
					</div>

					<div
						className={`${styles.update} ${
							!isUpdateVisible ? styles.updateHidden : styles.updateVisible
						}`}
					>
						<div className={styles.session}>
							<button
								onClick={() => changeSess("add")}
								className={styles.updateBtn}
							>
								+
							</button>
							<div>
								<label>Session</label>
								<h2 id="session-length">{sessionLength / 60}</h2>
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
								<h2>{breakLength / 60}</h2>
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
		</>
	);
}
