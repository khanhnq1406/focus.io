import "./App.css";
import { Rnd } from "react-rnd";
import { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";
import { YoutubePlayerState, PomodoroState } from "./utils/constants";
function App() {
  const [styleState, setStyle] = useState({
    youtube: {
      youtubeActive: "none",
      height: "320",
      width: "400",
      youtubeUrl: "",
      youtubePlayer: {},
      isPlaylist: false,
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
    focusTime: 1500, //1500
    shortBreakTime: 300, // 300
    longBreakTime: 600, // 600
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
  const timerStyle = function (isActive) {
    return {
      display: isActive,
      alignItems: "start",
      justifyContent: "center",
      border: "1px solid hsla(0, 0%, 100%, 0.2)",
      borderRadius: "10px",
      backgroundColor: "hsla(0, 0%, 5%, 0.9)",
      backdropFilter: "blur(20px)",
      color: "hsla(0,0%,100%,0.8)",
      flexWrap: "wrap",
      transition: "opacity 0.2s ease-in 0.1s",
    };
  };

  // retrieve objects from localStorage
  useEffect(() => {
    try {
      const youtubeUrl = JSON.parse(localStorage.getItem("youtubeUrl"));
      const isPlaylist = JSON.parse(localStorage.getItem("isPlaylist"));
      if (youtubeUrl) {
        setStyle((styleState) => ({
          ...styleState,
          youtube: {
            ...styleState.youtube,
            youtubeUrl: youtubeUrl,
          },
        }));
      }
      if (isPlaylist) {
        setStyle((styleState) => ({
          ...styleState,
          youtube: {
            ...styleState.youtube,
            isPlaylist: isPlaylist,
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const toDoListLocalStorage = JSON.parse(localStorage.getItem("toDoList"));
      if (toDoListLocalStorage) {
        setToDoList((toDoList) => ({
          ...toDoList,
          isAddTask: toDoList.isAddTask === "" ? "none" : "",
          lists: toDoListLocalStorage,
        }));
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const scencesUrl = JSON.parse(localStorage.getItem("scencesUrl"));
      if (scencesUrl) {
        load(scencesUrl)
          .then(() => {
            document.body.style.backgroundImage = `url(${scencesUrl})`;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Youtube handle

  const buttonYoutube = function () {
    setStyle((styleState) => ({
      ...styleState,
      youtube: {
        ...styleState.youtube,
        youtubeActive: youtube.youtubeActive === "flex" ? "none" : "flex",
      },
    }));
  };

  const youtubeUrl = (event) => {
    event.preventDefault();
    let url = event.target[0].value;
    const startListString = url.indexOf("list=");
    if (startListString >= 0) {
      const endListString =
        url.indexOf("&", startListString) >= 0
          ? url.indexOf("&", startListString)
          : undefined;
      url = url.substring(startListString + 5, endListString);
      console.log(url.substring(startListString + 5, endListString));
      setStyle((styleState) => ({
        ...styleState,
        youtube: {
          ...styleState.youtube,
          isPlaylist: true,
        },
      }));
      localStorage.setItem("isPlaylist", JSON.stringify(true));
    } else {
      url = url.split("v=")[1];
      setStyle((styleState) => ({
        ...styleState,
        youtube: {
          ...styleState.youtube,
          isPlaylist: false,
        },
      }));
      localStorage.setItem("isPlaylist", JSON.stringify(false));
    }
    if (!url) return;
    setStyle((styleState) => ({
      ...styleState,
      youtube: {
        ...styleState.youtube,
        youtubeUrl: url,
      },
    }));
    localStorage.setItem("youtubeUrl", JSON.stringify(url));
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
    let playerState;
    try {
      playerState = youtube.youtubePlayer.getPlayerState();
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

  const buttonScenes = function () {
    setStyle((styleState) => ({
      ...styleState,
      scences: {
        ...styleState.scences,
        scenesActive: scences.scenesActive === "flex" ? "none" : "flex",
      },
    }));
  };

  function load(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", resolve);
      image.addEventListener("error", reject);
      image.src = src;
    });
  }

  const backgroundUrl = (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    localStorage.setItem("scencesUrl", JSON.stringify(url));
    load(url)
      .then(() => {
        document.body.style.backgroundImage = `url(${url})`;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setScencesDefault = (event) => {
    event.preventDefault();
    const url =
      "https://wallpaperxyz.com/wp-content/uploads/Chill-Lofi-Background-Wallpaper-Full-HD-Free-Download-for-PC-Laptop-Macbook-231121-Wallpaperxyz.com-57.jpg";
    load(url)
      .then(() => {
        document.body.style.backgroundImage = `url(${url})`;
      })
      .catch((err) => {
        console.log(err);
      });
    localStorage.setItem("scencesUrl", JSON.stringify(url));
  };
  // Pomodoro timer handle

  const buttonPomodoro = function () {
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      pomodoroActive: pomodoro.pomodoroActive === "flex" ? "none" : "flex",
    }));
  };

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
            console.log("============");
            console.log("interval: ", pomodoro.longBreakInterval);
            console.log("counter: ", pomodoro.counterLongBreak);
            console.log("type: ", pomodoro.type);
            switch (pomodoro.type) {
              case PomodoroState.FOCUS:
                console.log("Debug: focus");
                if (
                  pomodoro.counterLongBreak <
                  pomodoro.longBreakInterval - 1
                ) {
                  setPomodoro((pomodoro) => ({
                    ...pomodoro,
                    type: PomodoroState.SHORT_BREAK,
                    status: PomodoroState.PAUSED,
                  }));
                  timer = pomodoro.shortBreakTime;
                } else {
                  setPomodoro((pomodoro) => ({
                    ...pomodoro,
                    type: PomodoroState.LONG_BREAK,
                    status: PomodoroState.PAUSED,
                    counterLongBreak: 0,
                  }));
                  timer = pomodoro.longBreakTime;
                }
                break;
              case PomodoroState.SHORT_BREAK:
                console.log("Short break");
                setPomodoro((pomodoro) => ({
                  ...pomodoro,
                  type: PomodoroState.FOCUS,
                  status: PomodoroState.PAUSED,
                  counterLongBreak: (pomodoro.counterLongBreak += 1),
                }));
                timer = pomodoro.focusTime;
                break;
              case PomodoroState.LONG_BREAK:
                setPomodoro((pomodoro) => ({
                  ...pomodoro,
                  type: PomodoroState.FOCUS,
                  status: PomodoroState.PAUSED,
                }));
                timer = pomodoro.focusTime;
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
    setPomodoro((pomodoro) => ({
      ...pomodoro,
    }));
    console.log(pomodoro.longBreakInterval);

    switch (pomodoro.type) {
      case PomodoroState.FOCUS:
        setTimer(pomodoro.focusTime);
        break;
      case PomodoroState.SHORT_BREAK:
        setTimer(pomodoro.shortBreakTime);
        break;
      case PomodoroState.LONG_BREAK:
        setTimer(pomodoro.longBreakTime);
        break;
    }
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

  const setTimePomodoro = function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      [event.target.name]: (event.target.value * 60).toFixed(0),
    }));
    setTimer(pomodoro[event.target.name]);
  };

  const setLongBreakInterval = function (event) {
    event.preventDefault();
    setPomodoro((pomodoro) => ({
      ...pomodoro,
      longBreakInterval: event.target.value,
    }));
  };

  // Todo list
  const [toDoList, setToDoList] = useState({
    isActive: "none",
    isAddTask: "none",
    lists: [],
  });
  const buttonToDoList = function () {
    setToDoList((toDoList) => ({
      ...toDoList,
      isActive: toDoList.isActive === "flex" ? "none" : "flex",
    }));
  };

  const removeTask = function (event, id) {
    event.preventDefault();
    setToDoList((toDoList) => ({
      ...toDoList,
      lists: toDoList.lists.filter((index) => Number(index.id) !== Number(id)),
    }));
    localStorage.setItem(
      "toDoList",
      JSON.stringify(
        toDoList.lists.filter((index) => Number(index.id) !== Number(id))
      )
    );
  };

  const displayTodoList = toDoList.lists
    .sort((a, b) => a.id - b.id)
    .map((value) => (
      <div className="insideBlock toDoTask">
        <input type="checkbox" className="toDo checkBox"></input>
        <div style={{ margin: "5px", width: "300px", overflow: "hidden" }}>
          {value.taskName}
        </div>
        <button
          className="btn-remove-todo"
          onClick={(e, id = value.id) => removeTask(e, id)}
        >
          <img src="/images/remove.png"></img>
        </button>
      </div>
    ));

  const btnAddTodo = function (event) {
    event.preventDefault();
    setToDoList((toDoList) => ({
      ...toDoList,
      isAddTask: toDoList.isAddTask === "" ? "none" : "",
    }));
  };

  const btnSubmitTodo = function (event) {
    event.preventDefault();
    const newTask = {
      id: toDoList.lists.length,
      taskName: event.target[0].value,
      isDone: false,
    };
    setToDoList((toDoList) => ({
      ...toDoList,
      isAddTask: toDoList.isAddTask === "" ? "none" : "",
      lists: [...toDoList.lists, newTask],
    }));
    localStorage.setItem(
      "toDoList",
      JSON.stringify([...toDoList.lists, newTask])
    );
    event.target[0].value = "";
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

          <button
            data-title="To-do list"
            className="btn background"
            onClick={buttonToDoList}
          >
            <img className="icon" src="/images/todo.png" name="toDo"></img>
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
        disableDragging={true}
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
        {youtube.youtubeUrl !== "" && !youtube.isPlaylist ? (
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
        ) : youtube.youtubeUrl !== "" && youtube.isPlaylist ? (
          <div className="insideBlock youtube">
            <YouTube
              opts={{
                width: Math.round(youtube.width.match(/(\d+)/)[0]) - 46,
                height: Math.round(youtube.height.match(/(\d+)/)[0]) - 125,
                playerVars: {
                  autoplay: 1,
                  listType: "playlist",
                  list: youtube.youtubeUrl,
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
            marginBottom: "10px",
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
        <button className="btn-set-default" onClick={setScencesDefault}>
          Set default
        </button>
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

        <Rnd
          style={timerStyle(timerSetting.timerSettingActive)}
          default={{ width: 400, height: 241 }}
          className="settingTimer"
          enableResizing={false}
        >
          <p style={{ fontWeight: "bold" }}>Setting</p>
          <button className="btn-close" onClick={settingTimer}>
            <img className="icon close" src="/images/close.png"></img>
          </button>
          <div className="horizontal-divider" style={{ top: "33px" }}></div>

          <div style={{ width: "370px", top: "50px", position: "absolute" }}>
            <p style={{ fontWeight: "bold", fontSize: "15px" }}>
              Time (minutes)
            </p>

            <div className="timer-setting-container">
              <div className="timer-setting-item">
                {/* <form onSubmit={setTimePomodoro}> */}
                <label className="timer-setting-label">Pomodoro</label>
                <input
                  type="number"
                  className="timer-time-input"
                  defaultValue={pomodoro.focusTime / 60}
                  onChange={setTimePomodoro}
                  name="focusTime"
                ></input>
                {/* </form> */}
              </div>

              <div className="timer-setting-item">
                <label className="timer-setting-label">Short Break</label>
                <input
                  type="number"
                  className="timer-time-input"
                  defaultValue={pomodoro.shortBreakTime / 60}
                  onChange={setTimePomodoro}
                  name="shortBreakTime"
                ></input>
              </div>

              <div className="timer-setting-item">
                <label className="timer-setting-label">Long Break</label>
                <input
                  type="number"
                  className="timer-time-input"
                  defaultValue={pomodoro.longBreakTime / 60}
                  onChange={setTimePomodoro}
                  name="longBreakTime"
                ></input>
              </div>
            </div>

            <div className="timer-setting-container">
              <div
                className="timer-setting-item"
                style={{
                  width: "200px",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Long Break interval
                </label>
              </div>
              <div className="timer-setting-item long-break">
                <input
                  type="number"
                  className="timer-time-input"
                  defaultValue={pomodoro.longBreakInterval}
                  onChange={setLongBreakInterval}
                ></input>
              </div>
            </div>
          </div>
        </Rnd>
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
      <Rnd
        style={style(toDoList.isActive)}
        default={{
          x: 0,
          y: 0,
          width: 400,
        }}
        enableResizing={false}
      >
        <button className="btn-close" onClick={buttonToDoList}>
          <img className="icon close" src="/images/close.png"></img>
        </button>
        <p style={{ fontWeight: "bold", fontSize: "17px" }}>To-do list</p>
        <div className="list-wrapper">
          {toDoList.lists.length !== 0 ? (
            displayTodoList
          ) : (
            <div className="insideBlock empty-message">
              <p>Your to-do list is empty.</p>
              <p>Add tasks to get started!</p>
            </div>
          )}
        </div>
        <div
          className="add-item"
          style={{ display: toDoList.isAddTask === "" ? "none" : "" }}
        >
          <button onClick={btnAddTodo}>
            <img src="/images/plus.png"></img>
            Add Task
          </button>
        </div>
        <div
          className="add-item active"
          style={{ display: toDoList.isAddTask }}
        >
          <form onSubmit={btnSubmitTodo}>
            <input
              className="input to-do"
              placeholder="Enter your task here..."
            ></input>
            <button data-title="Save" className="btn add-todo" type="submit">
              <img src="/images/plus.png"></img>
            </button>

            <button
              data-title="Cancel"
              className="btn close-add-todo"
              onClick={btnAddTodo}
            >
              <img src="/images/cancel.png"></img>
            </button>
          </form>
        </div>
      </Rnd>
    </>
  );
}

export default App;
