const defaultBTN = {
  "RUN": { left: 15, bottom: 30, height: 75, width: 75, opacity: 0.5 },
  "JUMP": { left: 85, bottom: 30, height: 75, width: 75, opacity: 0.5 },
  "ZOOM": { left: 15, bottom: 40, height: 75, width: 75, opacity: 0.5 },
  "SHOT": { left: 85, bottom: 40, height: 75, width: 75, opacity: 0.5 },
  "GET": { left: 85, bottom: 60, height: 75, width: 75, opacity: 0.5 },
  "OUT": { left: 85, bottom: 60, height: 75, width: 75, opacity: 0.5 },
  "BREAK": { left: 5, bottom: 6, height: 75, width: 75, opacity: 0.5 },
  "SPEED": { left: 85, bottom: 6, height: 75, width: 75, opacity: 0.5 },
  "HORN": { left: 85, bottom: 50, height: 75, width: 75, opacity: 0.5 },
};

export let Speed={car:1}

const DefaultSensitivity={
  "NORM":1,
  "ZOOM":1
}

const savedBTN = localStorage.getItem("custom_btn_positions");
const savedSensitivity = localStorage.getItem("custom_sense");

export let BTN = savedBTN ? JSON.parse(savedBTN) : defaultBTN;
export let Sensitivity = savedSensitivity ? JSON.parse(savedSensitivity) : DefaultSensitivity;
