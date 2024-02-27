import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Elevator from "../../Components/Elevator";
import { ButtonEnum, ElevatorEnum } from "../../Constants";
import "./Elevators.css";
import ElevatorButton from "../../Components/ElevatorButton";

export interface IButtonState {
  state: ButtonEnum.Waiting | ButtonEnum.Arrived | ButtonEnum.Available;
  color: ButtonEnum.Green | ButtonEnum.Red;
  variant: ButtonEnum.Contained | ButtonEnum.Outlined | undefined;
  cta: ButtonEnum.CallCta | ButtonEnum.ArrivedCta | ButtonEnum.WaitingCta;
  floor: number;
}

export interface IElevatorState {
  state: ElevatorEnum.Arrived | ElevatorEnum.Available | ElevatorEnum.Occupied;
  position: number;
  nextPosition: number;
  elevatorNumber: number;
}

const Elevators = () => {
  const { state } = useLocation();
  const { elevators, floors } = state;
  const [callQueue, setCallQueue] = useState<number[]>([]);
  const [buttonsArray, setButtonsArray] = useState<IButtonState[]>(
    Array.from({ length: floors }, (_, index) => ({
      state: ButtonEnum.Available,
      color: ButtonEnum.Green,
      variant: ButtonEnum.Contained,
      cta: ButtonEnum.CallCta,
      floor: index,
    }))
  );
  const [elevatorsArray, setElevatorsArray] = useState<IElevatorState[]>(
    Array.from({ length: elevators }, (_, index) => ({
      state: ElevatorEnum.Available,
      position: 0,
      nextPosition: 0,
      elevatorNumber: index,
    }))
  );

  const handleCallElevator = (floorIndex: number) => {
    setButtonsArray((prevState) => {
      const updatedState = [...prevState];
      updatedState[floorIndex] = {
        state: ButtonEnum.Waiting,
        color: ButtonEnum.Red,
        variant: ButtonEnum.Contained,
        cta: ButtonEnum.WaitingCta,
        floor: floorIndex,
      };
      return updatedState;
    });
    setCallQueue((prevState) => {
      return [...prevState, floorIndex];
    });
  };

  const onElevatorArriving = (elevNum: number, floor: number) => {
    setElevatorsArray((prevState) => {
      const updatedState = [...prevState];
      updatedState[elevNum] = {
        state: ElevatorEnum.Arrived,
        elevatorNumber: elevNum,
        position: elevatorsArray[elevNum].nextPosition,
        nextPosition: elevatorsArray[elevNum].nextPosition,
      };
      return updatedState;
    });
    setButtonsArray((prevState) => {
      const updatedState = [...prevState];
      updatedState[floor] = {
        state: ButtonEnum.Arrived,
        color: ButtonEnum.Green,
        variant: ButtonEnum.Outlined,
        cta: ButtonEnum.ArrivedCta,
        floor: floor,
      };
      return updatedState;
    });
    setTimeout(() => {
      setElevatorsArray((prevState) => {
        const updatedState = [...prevState];
        updatedState[elevNum] = {
          state: ElevatorEnum.Available,
          elevatorNumber: elevNum,
          position: elevatorsArray[elevNum].nextPosition,
          nextPosition: elevatorsArray[elevNum].nextPosition,
        };
        return updatedState;
      });
      setButtonsArray((prevState) => {
        const updatedState = [...prevState];
        updatedState[floor] = {
          state: ButtonEnum.Available,
          color: ButtonEnum.Green,
          variant: ButtonEnum.Contained,
          cta: ButtonEnum.CallCta,
          floor: floor,
        };
        return updatedState;
      });
    }, 2000);
  };

  const findElevator = (floor: number) => {
    let closestElevator = -1;
    let distances = Infinity;
    for (let i = 0; i < elevatorsArray.length; i++) {
      if (elevatorsArray[i].state === ElevatorEnum.Available) {
        if (distances > Math.abs(elevatorsArray[i].position - floor)) {
          closestElevator = elevatorsArray[i].elevatorNumber;
          distances = Math.abs(elevatorsArray[i].position - floor);
        }
      }
    }

    return closestElevator;
  };

  useEffect(() => {
    const currentCall = callQueue[0];
    if (currentCall !== undefined) {
      const elev = findElevator(currentCall);
      if (elev >= 0) {
        callQueue.shift();
        setElevatorsArray((prevState) => {
          const updatedState = [...prevState];
          updatedState[elev] = {
            state: ElevatorEnum.Occupied,
            elevatorNumber: elev,
            position: elevatorsArray[elev].position,
            nextPosition: currentCall,
          };
          return updatedState;
        });
      }
    }
  }, [callQueue.length, buttonsArray, elevatorsArray]);

  return (
    <div className="elevators-wrapper">
      <h2>Elevator exercise </h2>
      <div className="elevators-page">
        <div className="floors">
          {Array.from({ length: floors }, (_, index) => (
            <h3 key={index}>{index === 0 ? "Ground floor" : `${index}th`}</h3>
          ))}
        </div>
        <div className="grid-layout">
          {elevatorsArray.map((value) => (
            <Elevator
              key={value.elevatorNumber}
              floorCount={floors}
              onDone={onElevatorArriving}
              elevatorNumber={value.elevatorNumber}
              position={value.position}
              state={value.state}
              nextPosition={value.nextPosition}
            />
          ))}
        </div>
        <div className="elevators-buttons">
          {buttonsArray.map((value, index) => (
            <div className="call-button" key={index}>
              <ElevatorButton button={value} onClick={handleCallElevator} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elevators;
