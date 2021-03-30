const ipcRenderer = window.api.ipcRenderer;
const automata = document.getElementById("automata") as HTMLSelectElement;
const pixelSizeSelection = document.getElementById("pixelSizes") as HTMLSelectElement;
const fpsSelection = document.getElementById("fps") as HTMLSelectElement;
// const shouldWrapCheckbox = document.getElementById("shouldWrap") as HTMLInputElement;
const presetSelection = document.getElementById("presetSelection") as HTMLSelectElement;
const shouldTraceCheckbox = document.getElementById("shouldTrace") as HTMLInputElement;
const generation = document.getElementById("generation") as HTMLSpanElement;
const canvasId = "canvas";
const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;

// let pixelSize = 1;
// let fpsInMs = 1000;

// export const globals = {

//     setPixelSize: (input: number): void => {
//         pixelSize = input;
//     },
//     setFpsInMs: (input: number): void => {
//         fpsInMs = input;
//     }

// };