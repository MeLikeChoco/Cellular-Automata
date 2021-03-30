let settings: {
    getPixelSize: () => number;
    setPixelSize: () => void;
    getFpsInMs: () => number;
    setFpsInMs: () => void;
    getShouldTrace: () => boolean;
    setShouldTrace: () => void;
    setAutomaton: () => void;
    addGeneration: () => void;
    resetGeneration: () => void;
};

const initSettings = async (): Promise<void> => {

    let executed = false;
    const setting = {
        automaton: "",
        pixelSize: 1,
        fpsInMs: 1000,
        generation: 0
    };

    if (!executed) {

        executed = true;

        const cellularAutomata = await ipcRenderer.invoke<{ [key in CellularAutomata]: CellularAutomataDisplayName }>("get-cellularAutomata");
        const pixelSize = pixelSizeSelection.options[0].value;
        const fpsInMs = await ipcRenderer.invoke<number>("get-fps");
        const shouldTrace = await ipcRenderer.invoke<boolean>("get-shouldTrace");

        setting.pixelSize = parseInt(pixelSize);
        setting.fpsInMs = 1000 / fpsInMs;
        shouldTraceCheckbox.checked = shouldTrace;

        Object.keys(cellularAutomata).forEach((value: CellularAutomata) => {

            const option = document.createElement("option");
            option.value = value;
            option.text = cellularAutomata[value];

            automata.add(option);

        });

        automata.value = "conway" as CellularAutomata;
        setting.automaton = automata.value;

        // document.getElementById(setting.automaton).style.visibility = "visible";

        pixelSizeSelection.value = pixelSize;
        fpsSelection.value = fpsInMs.toString();
        generation.textContent = setting.generation.toString();

        settings = {

            getPixelSize: (): number => setting.pixelSize,
            setPixelSize: (): void => {

                const value = parseInt(pixelSizeSelection.value);
                setting.pixelSize = value;

                ipcRenderer.send("set-pixelSize", value);

            },
            getFpsInMs: (): number => setting.fpsInMs,
            setFpsInMs: (): void => {

                const value = parseInt(fpsSelection.value);
                setting.fpsInMs = 1000 / value;

                ipcRenderer.send("set-fps", value);

            },
            getShouldTrace: (): boolean => shouldTraceCheckbox.checked,
            setShouldTrace: (): void => ipcRenderer.send("set-shouldTrace", shouldTraceCheckbox.checked),
            setAutomaton: async (): Promise<void> => {

                const newAutomaton = automata.value;
                const oldAutomaton = setting.automaton;
                setting.automaton = newAutomaton;

                ipcRenderer.send("set-automaton", newAutomaton);
                document.getElementById(oldAutomaton).style.visibility = "hidden";
                document.getElementById(newAutomaton).style.visibility = "visible";

            },
            addGeneration: (): void => {
                generation.textContent = (++setting.generation).toString();
            },
            resetGeneration: (): void => {
                setting.generation = 0;
                generation.textContent = setting.generation.toString();
            }

        };

    }

};

// const getPixelSize = async (): Promise<void> => {

//     const pixelSize = (await ipcRenderer.invoke("get-pixelSize")) as number;

//     // setPixelSize(pixelSize);
//     globals.setPixelSize(pixelSize);
//     pixelSizeSelection.value = pixelSize.toString();

// };

// export const getPixelSize = (): number => setting.pixelSize;

// export const setPixelSize = (): void => {

//     const value = parseInt(pixelSizeSelection.value);
//     setting.pixelSize = value;

//     ipcRenderer.send("set-pixelSize", value);

// };

// const getFps = async (): Promise<void> => {
//     const fps = (await ipcRenderer.invoke("get-fps")) as number;
//     fpsSelection.value = fps.toString();
//     fpsInMs = 1000 / fps;
// };

// export const setFps = (): void => {

//     const value = parseInt(fpsSelection.value);
//     setting.fpsInMs = 1000 / value;

//     ipcRenderer.send("set-fps", value);

// };

// const getShouldWrap = async (): Promise<void> => {
//     shouldWrapCheckbox.checked = (await ipcRenderer.invoke("get-shouldWrap")) as boolean;
// };

// export const setShouldWrap = (): void => {

//     const shouldWrap = shouldWrapCheckbox.checked;

//     ipcRenderer.send("set-shouldWrap", shouldWrap);

// };