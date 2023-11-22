import "./App.css";
import { Rnd } from "react-rnd";
import { useState } from "react";

function App() {
  const [active, setActive] = useState({
    youtubeActive: "none",
    scenesActive: "none",
  });

  const { youtubeActive, scenesActive } = active;

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
    };
  };
  const buttonYoutube = function () {
    setActive((active) => ({
      ...active,
      youtubeActive: youtubeActive === "flex" ? "none" : "flex",
    }));
  };

  const buttonScenes = function () {
    setActive((active) => ({
      ...active,
      scenesActive: scenesActive === "flex" ? "none" : "flex",
    }));
  };

  const youtubeUrl = function (e) {
    console.log(e);
  };
  return (
    <>
      <div className="menu">
        <div className="btn-wrapper">
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
        style={style(youtubeActive)}
        default={{
          x: 300,
          y: 400,
          width: 320,
          height: 200,
        }}
      >
        <div className="insideBlock">
          <div className="youtube-url-form">
            <div
              className="input"
              contentEditable="true"
              data-placeholder="Youtube URL"
            ></div>
            <button onSubmit={youtubeUrl}>Submit</button>
          </div>
        </div>
      </Rnd>

      <Rnd
        style={style(scenesActive)}
        default={{
          x: 300,
          y: 400,
          width: 320,
          height: 200,
        }}
      >
        <div>
          <p>Scenes</p>
        </div>
      </Rnd>
    </>
  );
}

export default App;
