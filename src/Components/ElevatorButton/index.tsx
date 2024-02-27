import Button from "@mui/material/Button";
import { ButtonEnum } from "../../Constants";
import React from "react";
import { IButtonState } from "../../pages/Elevators";

interface IElevatorButton {
  button: IButtonState;
  onClick: (floor: number) => void;
}

const ElevatorButton = ({ button, onClick }: IElevatorButton) => {
  return (
    <Button
      style={{
        backgroundColor:
          button.variant === ButtonEnum.Contained ? button.color : undefined,
        color:
          button.variant === ButtonEnum.Outlined ? button.color : undefined,
        borderColor:
          button.variant === ButtonEnum.Outlined ? button.color : undefined,
        width: "100px",
        pointerEvents:
          button.state !== ButtonEnum.Available ? "none" : undefined,
      }}
      size="medium"
      className="call-elevator-button"
      variant={button.variant}
      onClick={() => onClick(button.floor)}
    >
      {button.cta}
    </Button>
  );
};

export default ElevatorButton;
