import { useState, useRef, useEffect } from "react";
import { PomodoroState } from "../utils/constants";
export function Timer(pomodoro) {
  const [timer, setTimer] = useState(3700);
  const firstStart = useRef(true);
  const tick = useRef();
  useEffect(() => {
    if (firstStart.current) {
      // first render, don't run useEffect for timer
      firstStart.current = !firstStart.current;
      return;
    }
    if (pomodoro.status === PomodoroState.PLAYING) {
      tick.current = setInterval(() => {
        console.log(pomodoro.status);
        setTimer((timer) => timer - 1);
      }, 1000);
    } else {
      console.log("clear interval");
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [pomodoro.status]);
  const dispSecondsAsMins = (seconds) => {
    // HH:MM:SS
    console.log("seconds " + seconds);
    const hour = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const seconds_ = seconds % 60;
    return (
      (hour == 0 ? "00" : hour.toString()) +
      ":" +
      mins.toString() +
      ":" +
      (seconds_ == 0 ? "00" : seconds_.toString())
    );
  };
  return dispSecondsAsMins(timer);
}
