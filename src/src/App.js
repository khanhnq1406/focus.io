import "./App.css";
import { Rnd } from "react-rnd";
import { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import { YoutubePlayerState, PomodoroState } from "./utils/constants";
import { sleep, wait } from "./utils/wait";
function App() {
  const [styleState, setStyle] = useState({
    youtube: {
      youtubeActive: "none",
      height: "320",
      width: "400",
      youtubeUrl: "",
      youtubePlayer: {},
    },
    scences: { scenesActive: "none", height: "", width: "", backgroundUrl: "" },
    timerSetting: {
      timerSettingActive: "none",
    },
  });

  const [pomodoro, setPomodoro] = useState({
    pomodoroActive: "none",
    status: PomodoroState.PAUSED,
    type: PomodoroState.FOCUS,
    focusTime: 3, //1500
    shortBreakTime: 4, // 300
    longBreakTime: 5, // 600
    counterLongBreak: 0,
    longBreakInterval: 2,
  });
  const { youtube, scences, timerSetting } = styleState;

  const style = function (isActive) {
    return {
      display: isActive,
      alignItems: "flex-start",
      justifyContent: "center",
      border: "1px solid hsla(0, 0%, 100%, 0.2)",
      borderRadius: "10px",
      backgroundColor: "hsla(0, 0%, 7%, 0.7)",
      backdropFilter: "blur(30px)",
      color: "hsla(0,0%,100%,0.8)",
      flexWrap: "wrap",
    };
  };
  const buttonYoutube = function () {
    setStyle((styleState) => ({
      ...styleState,
      youtube: {
        ...styleState.youtube,
        youtubeActive: youtube.youtubeActive === "flex" ? "none" : "flex",
      },
    }));
  };

  const buttonScenes = function () {
    setStyle((styleState) => ({
      ...styleState,
      scences: {
        ...styleState.scences,
        scenesActive: scences.scenesActive === "flex" ? "none" : "flex",
      },
    }));
  };

  const buttonPomodoro = function () {
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      pomodoroActive: pomodoro.pomodoroActive === "flex" ? "none" : "flex",
    }));
  };

  // Youtube handle

  const youtubeUrl = (event) => {
    event.preventDefault();
    let url = event.target[0].value;
    url = url.split("v=")[1];
    console.log(url);
    setStyle((styleState) => ({
      ...styleState,
      youtube: {
        ...styleState.youtube,
        youtubeUrl: url,
      },
    }));
  };

  const onReadyHandle = function (event) {
    setStyle((styleState) => ({
      ...styleState,
      youtube: {
        ...styleState.youtube,
        youtubePlayer: event.target,
      },
    }));
  };

  const playVideoBtn = function () {
    console.log("Video player: ", youtube.youtubePlayer);
    let playerState;
    try {
      playerState = youtube.youtubePlayer.getPlayerState();
      console.log(playerState);
      if (playerState === YoutubePlayerState.PLAYING) {
        youtube.youtubePlayer.pauseVideo();
      } else {
        youtube.youtubePlayer.playVideo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Background handle

  const backgroundUrl = (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    function load(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", resolve);
        image.addEventListener("error", reject);
        image.src = src;
      });
    }
    load(url)
      .then(() => {
        document.body.style.backgroundImage = `url(${url})`;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Pomodoro timer handle

  const startTimer = function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      status:
        pomodoro.status === PomodoroState.PAUSED
          ? PomodoroState.PLAYING
          : PomodoroState.PAUSED,
    }));
  };

  const [timer, setTimer] = useState(pomodoro.focusTime);
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
        setTimer((timer) => {
          timer -= 1;
          if (timer <= 0) {
            const audio = new Audio("/finish-sound.mp3");
            audio.play();
            switch (pomodoro.type) {
              case PomodoroState.FOCUS:
                if (pomodoro.counterLongBreak < pomodoro.longBreakInterval) {
                  setPomodoro((pomodoro) => ({
                    ...pomodoro,
                    type: PomodoroState.SHORT_BREAK,
                    status: PomodoroState.PAUSED,
                  }));
                  return pomodoro.shortBreakTime;
                } else {
                  setPomodoro((pomodoro) => ({
                    ...pomodoro,
                    type: PomodoroState.LONG_BREAK,
                    status: PomodoroState.PAUSED,
                    counterLongBreak: 0,
                  }));
                  return pomodoro.longBreakTime;
                }
                break;

              case PomodoroState.SHORT_BREAK:
                setPomodoro((pomodoro) => ({
                  ...pomodoro,
                  type: PomodoroState.FOCUS,
                  status: PomodoroState.PAUSED,
                  counterLongBreak: (pomodoro.counterLongBreak += 1),
                }));
                return pomodoro.focusTime;
                break;
              case PomodoroState.LONG_BREAK:
                setPomodoro((pomodoro) => ({
                  ...pomodoro,
                  type: PomodoroState.FOCUS,
                  status: PomodoroState.PAUSED,
                }));
                return pomodoro.focusTime;
              default:
                break;
            }
          }
          return timer;
        });
      }, 1000);
    } else {
      clearInterval(tick.current);
    }
    return () => clearInterval(tick.current);
  }, [pomodoro.status]);

  const dispSecondsAsMins = (seconds) => {
    // 25:00
    const hour = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const seconds_ = seconds % 60;
    return (
      (hour == 0 ? "00" : hour.toString()).padStart(2, "0") +
      ":" +
      mins.toString().padStart(2, "0") +
      ":" +
      (seconds_ == 0 ? "00" : seconds_.toString().padStart(2, "0"))
    );
  };

  const settingTimer = function (event) {
    event.preventDefault();
    setStyle((styleState) => ({
      ...styleState,
      timerSetting: {
        ...styleState.timerSetting,
        timerSettingActive:
          timerSetting.timerSettingActive === "flex" ? "none" : "flex",
      },
    }));
  };

  const btnFocusTime = function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      type: PomodoroState.FOCUS,
    }));
    setTimer(pomodoro.focusTime);
  };

  const btnShortBreakTime = async function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      type: PomodoroState.SHORT_BREAK,
    }));
    setTimer(pomodoro.shortBreakTime);
  };

  const btnLongBreakTime = function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      type: PomodoroState.LONG_BREAK,
    }));
    setTimer(pomodoro.longBreakTime);
  };

  return (
    <>
      <div className="menu">
        <div className="btn-wrapper">
          <button data-title="Play" className="btn play" onClick={playVideoBtn}>
            <img className="icon play" src="/images/play.png"></img>
          </button>

          <div className="menu-divider"></div>

          <button
            data-title="Youtube"
            className="btn youtube"
            onClick={buttonYoutube}
          >
            <img className="icon" src="/images/youtube.png"></img>
          </button>

          <button
            data-title="Scenes"
            className="btn background"
            onClick={buttonScenes}
          >
            <img className="icon" src="/images/scenes.png"></img>
          </button>

          <button
            data-title="Pomodoro"
            className="btn background"
            onClick={buttonPomodoro}
          >
            <img className="icon" src="/images/pomodoro.png"></img>
          </button>
        </div>
      </div>

      <Rnd
        style={style(youtube.youtubeActive)}
        default={{
          x: 0,
          y: 0,
          width: 400,
          height: 320,
        }}
        onResize={(e, direction, ref, delta, position) => {
          setStyle((styleState) => ({
            ...styleState,
            youtube: {
              ...styleState.youtube,
              width: ref.style.width,
              height: ref.style.height,
            },
          }));
        }}
      >
        <button className="btn-close" onClick={buttonYoutube}>
          <img className="icon close" src="/images/close.png"></img>
        </button>
        <div
          className="insideBlock"
          style={{ width: youtube.width, margin: "20px" }}
        >
          <form onSubmit={(e) => youtubeUrl(e)}>
            <div className="youtube-url-form">
              <input
                className="input"
                contentEditable="true"
                placeholder="Youtube URL"
                type="text"
                name="urlInput"
              ></input>
              <button type="submit" className="btn send-url" data-title="Send">
                <img
                  className="icon"
                  src="/images/send.png"
                  style={{ opacity: "80%" }}
                ></img>
              </button>
            </div>
          </form>
        </div>
        {youtube.youtubeUrl !== "" ? (
          <div className="insideBlock youtube">
            <YouTube
              videoId={youtube.youtubeUrl}
              opts={{
                width: Math.round(youtube.width.match(/(\d+)/)[0]) - 46,
                height: Math.round(youtube.height.match(/(\d+)/)[0]) - 125,
                playerVars: {
                  autoplay: 1,
                },
              }}
              onReady={onReadyHandle}
            />
          </div>
        ) : (
          <></>
        )}
      </Rnd>

      <Rnd
        style={style(scences.scenesActive)}
        default={{
          x: 0,
          y: 0,
          width: 400,
        }}
        enableResizing={false}
      >
        <button className="btn-close" onClick={buttonScenes}>
          <img className="icon close" src="/images/close.png"></img>
        </button>
        <div
          className="insideBlock"
          style={{
            width: "2000px",
            margin: "20px",
          }}
        >
          <form onSubmit={(e) => backgroundUrl(e)}>
            <div className="youtube-url-form">
              <input
                className="input"
                contentEditable="true"
                placeholder="Background URL"
                type="text"
                name="urlInput"
              ></input>
              <button type="submit" className="btn send-url" data-title="Send">
                <img
                  className="icon"
                  src="/images/send.png"
                  style={{ opacity: "80%" }}
                ></img>
              </button>
            </div>
          </form>
        </div>
      </Rnd>

      <Rnd
        style={style(pomodoro.pomodoroActive)}
        default={{
          x: 0,
          y: 0,
          width: 400,
        }}
        enableResizing={false}
      >
        <button className="btn-close" onClick={buttonPomodoro}>
          <img className="icon close" src="/images/close.png"></img>
        </button>
        <div
          style={{
            justifyContent: "center",
            textAlign: "center",
            padding: "15px",
          }}
        >
          <div>
            <button
              className={`btn-pomodoro-state ${
                pomodoro.type === PomodoroState.FOCUS ? "active" : ""
              }`}
              onClick={btnFocusTime}
            >
              <p style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                Pomodoro
              </p>
            </button>
            <button
              className={`btn-pomodoro-state ${
                pomodoro.type === PomodoroState.SHORT_BREAK ? "active" : ""
              }`}
              onClick={btnShortBreakTime}
            >
              <p style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                Short Break
              </p>
            </button>
            <button
              className={`btn-pomodoro-state ${
                pomodoro.type === PomodoroState.LONG_BREAK ? "active" : ""
              }`}
              onClick={btnLongBreakTime}
            >
              <p style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                Long Break
              </p>
            </button>
          </div>
          <div>
            <p
              style={{
                fontSize: "65px",
                fontWeight: "bold",
                display: "content",
                margin: "0px",
              }}
            >
              {dispSecondsAsMins(timer)}
            </p>
          </div>
          <div>
            <button
              className="btn-start-pomodoro active"
              onClick={settingTimer}
            >
              <img
                className="icon start-pomodoro setting"
                src="/images/setting.png"
              ></img>
            </button>
            <button className="btn-start-pomodoro" onClick={startTimer}>
              <img
                className="icon start-pomodoro"
                src={
                  pomodoro.status === PomodoroState.PLAYING
                    ? "/images/pause.png"
                    : "/images/play-pomodoro.png"
                }
              ></img>
            </button>
            <button className="btn-start-pomodoro">
              <img
                className="icon start-pomodoro setting"
                src="/images/replay.png"
              ></img>
            </button>
          </div>
        </div>
      </Rnd>

      {/*<Rnd
        style={style(pomodoro.pomodoroActive)}
        default={{
          x: 0,
          y: 0,
          width: 400,
        }}
        enableResizing={false}
      >
        <div
          className="insideBlock"
          style={{
            marginBottom: "10px",
          }}
        >
          <div style={{ width: "350px" }}>
            <div
              style={{
                margin: "10px",
                border: "1px solid hsla(0, 0%, 100%, 0.2)",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <input type="checkbox"></input>
              Task name 1
            </div>
            <div style={{ margin: "10px" }}>Task name 2</div>
            <div style={{ margin: "10px" }}>Task name 3</div>
            <div style={{ margin: "10px" }}>Task name 4</div>
            <div style={{ margin: "10px" }}>Task name 5</div>
          </div>
        </div>
            </Rnd>*/}
    </>
  );
}

export default App;
