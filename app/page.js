"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function Pomodoro() {
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
			<div id="pomodoro" className={styles.pomodoro}>
				<div className={styles.timer}>
					{!timeInterval ? (
						<button
							onClick={startTimer}
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
					<div className={styles.status}>
						<h1>{formatTime(time)}</h1>
					</div>
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
							<h2 id="break-length" class="adjust">
								{breaktime / 60}
							</h2>
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
