import "./App.css";
import { Rnd } from "react-rnd";
import { useState } from "react";
import YouTube from "react-youtube";
import { YoutubePlayerState } from "./utils/constants";
function App() {
  const [styleState, setStyle] = useState({
    youtube: {
      youtubeActive: "none",
      height: "320",
      width: "400",
      youtubeUrl: "",
      youtubePlayer: {},
    },
    scences: { scenesActive: "none", height: "", width: "" },
  });

  const { youtube, scences } = styleState;

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

  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
    },
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
    const playerState = youtube.youtubePlayer.getPlayerState();
    console.log(playerState);
    if (playerState === YoutubePlayerState.PLAYING) {
      youtube.youtubePlayer.pauseVideo();
    } else {
      youtube.youtubePlayer.playVideo();
    }
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
                  // https://developers.google.com/youtube/player_parameters
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
          x: 300,
          y: 400,
          width: 0,
          height: 0,
        }}
      >
        <button className="btn-close" onClick={buttonScenes}>
          <img className="icon close" src="/images/close.png"></img>
        </button>
        <div>
          <p>Scenes</p>
        </div>
      </Rnd>
    </>
  );
}

export default App;
