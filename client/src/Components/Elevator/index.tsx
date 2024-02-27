import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { ReactComponent as ElevatorIcon } from "./elevator.svg";
import { ElevatorEnum, transitionDuration } from "../../Constants";
import "./elevator.css";
import ding from "./dingSound.mp3";

interface IElevator {
  floorCount: number;
  elevatorNumber: number;
  position: number;
  nextPosition: number;
  state: string;
  onDone: (elev: number, floor: number) => void;
}

const formatMillisecondsToTime = (milliseconds: number) => {
  if (milliseconds <= 0) {
    return "";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formattedTime = "";

  if (minutes > 0) {
    formattedTime += `${minutes}m. `;
  }

  formattedTime += `${String(seconds).padStart(2, "0")} sec.`;
  return formattedTime;
};

const audio = new Audio(ding);

const Elevator = ({
  floorCount,
  position,
  state,
  nextPosition,
  elevatorNumber,
  onDone,
}: IElevator) => {
  const [color, setColor] = useState<string>();

  let totalDuration = transitionDuration * Math.abs(position - nextPosition);
  const [timeToArrive, setTimeToArrive] = useState("");

  useEffect(() => {
    setTimeToArrive(formatMillisecondsToTime(totalDuration));

    // Start updating the countdown only if totalDuration is greater than 0
    if (totalDuration > 0) {
      const intervalId = setInterval(() => {
        if (totalDuration > 0) {
          setTimeToArrive(formatMillisecondsToTime(totalDuration - 1000));
          totalDuration = totalDuration - 1000;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);

      // Cleanup the interval when the component unmounts or when totalDuration becomes 0
      return () => clearInterval(intervalId);
    }
  }, [nextPosition]);

  useEffect(() => {
    if (state === ElevatorEnum.Available) {
      setColor(ElevatorEnum.Black);
    } else if (state === ElevatorEnum.Occupied) {
      setColor(ElevatorEnum.Red);
      setTimeout(() => {
        setTimeToArrive("");
        audio.play();
        onDone(elevatorNumber, nextPosition);
      }, totalDuration);
    } else {
      setColor(ElevatorEnum.Green);
    }
  }, [state]);

  const animatedProps = useSpring({
    y: nextPosition * 104,
    config: { duration: totalDuration },
  });

  return (
    <div className="elevator">
      <animated.div
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          bottom: 30,
          transform: animatedProps.y.to((y) => `translateY(-${y}px)`),
        }}
      >
        <ElevatorIcon style={{ fill: color }} />
      </animated.div>
      {Array.from({ length: floorCount }, (_, index) => (
        <div key={index} className="floor">
          {index === nextPosition ? timeToArrive : undefined}
        </div>
      ))}
    </div>
  );
};

export default Elevator;
