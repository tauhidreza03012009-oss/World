const defaultBTN = {
  "RUN": { left: 15, bottom: 30, height: 75, width: 75, opacity: 0.5 },
  "JUMP": { left: 85, bottom: 30, height: 75, width: 75, opacity: 0.5 },
  "ZOOM": { left: 15, bottom: 40, height: 75, width: 75, opacity: 0.5 },
  "SHOT": { left: 85, bottom: 40, height: 75, width: 75, opacity: 0.5 },
};

const DefaultSensitivity={
  "NORM":1,
  "ZOOM":1
}

const savedBTN = localStorage.getItem("custom_btn_positions");
const savedSensitivity = localStorage.getItem("custom_sense");

export let BTN = savedBTN ? JSON.parse(savedBTN) : defaultBTN;
export let Sensitivity = savedSensitivity ? JSON.parse(savedSensitivity) : DefaultSensitivity;
