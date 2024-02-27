import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./Main.css";

const Main = () => {
  const [elevators, setElevators] = useState("5");
  const [floors, setFloors] = useState("10");
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/elevators", {
      state: { elevators: Number(elevators), floors: Number(floors) },
    });
  };

  return (
    <Container component="main" maxWidth="xs" className="main-page">
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to our Elevators Simulator
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please enter the number of elevators:
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(e) => setElevators(e.target.value)}
          value={elevators}
          type="number"
          label="Number of Elevators"
        />
        <Typography variant="subtitle1" gutterBottom>
          Please enter the number of floors:
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          onChange={(e) => setFloors(e.target.value)}
          value={floors}
          type="number"
          label="Number of Floors"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={onClick}
          disabled={!elevators || !floors}
        >
          Start
        </Button>
      </Box>
    </Container>
  );
};

export default Main;
