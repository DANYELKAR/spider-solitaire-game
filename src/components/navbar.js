import React, { useRef } from "react";
import Timer from "react-compound-timer";

const Navbar = ({ onRestart, score, highScore, steps }) => {
  const resetButtonRef = useRef(null);

  return (
    <div className="navbar">
      <div className="navbar_left">
        <div className="navbar_timer">
          <Timer initialTime={0} direction="forward">
            {({ reset }) => (
              <>
                <button
                  type="button"
                  style={{ display: "none" }}
                  onClick={reset}
                  ref={resetButtonRef}
                />
                <Timer.Hours
                  formatValue={(v) => {
                    if (v < 10) {
                      return `0${v}`;
                    }

                    return v;
                  }}
                />
                :
                <Timer.Minutes
                  formatValue={(v) => {
                    if (v < 10) {
                      return `0${v}`;
                    }

                    return v;
                  }}
                />
                :
                <Timer.Seconds
                  formatValue={(v) => {
                    if (v < 10) {
                      return `0${v}`;
                    }
                    return v;
                  }}
                />
              </>
            )}
          </Timer>
        </div>

        <div className="score_box">Score: {score}</div>
        <div className="score_box">Steps: {steps}</div>
      </div>
      <div className="highest_score">Highest score ever: {highScore}</div>
      <div>
        <button
          className="navbar_restart_button"
          type="button"
          onClick={() => {
            resetButtonRef.current.click();
            onRestart();
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default Navbar;
