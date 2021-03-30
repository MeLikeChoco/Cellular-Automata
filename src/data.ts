import { BrowserWindow, ipcMain, dialog } from "electron";
import Store from "electron-store";
import prompt from "electron-prompt";
import { Conway } from "./automata/conway";
import electronIsDev from "electron-is-dev";

const config = new Store<Config>({

    accessPropertiesByDotNotation: true,
    defaults: {

        fps: 1,
        options: {
            shouldTrace: false
        },
        customOptions: {

            "conway": {
                "shouldWrap": true
            },
            "q-state": {

            }

        }

    }

});

if (electronIsDev) {
    config.reset("customOptions", "fps", "options");
}

export const data = {

    init: (browserWindow: BrowserWindow): void => {

        let cellularAutomaton: CellularAutomata;
        let automaton: Automaton;
        let pixelSize = 1;
        const win = browserWindow;

        const getAutomaton = (dimensions: TwoDVector): Automaton => {

            switch (cellularAutomaton) {

                case "conway":
                default:
                    return new Conway(dimensions, config.get("options"), config.get("customOptions.conway"));

            }

        };

        ipcMain.once("set-canvas", (_event, args: unknown[]) => {

            const dimensions = args[0] as TwoDVector;
            automaton = getAutomaton(dimensions);

        });

        ipcMain.on("clear-canvas", () => automaton.clear());
        ipcMain.on("set-pixel", (_event, args: unknown[]) => automaton.setPixel(args[0] as TwoDVector));
        ipcMain.on("clear-pixel", (_event, args: unknown[]) => automaton.clearPixel(args[0] as TwoDVector));

        ipcMain.handle("get-nextState", (): State => {

            const nextState = automaton.getNextState();

            return nextState;

        });

        ipcMain.handle("get-colorMap", (): ColorMap => automaton.getColorMap());

        //#region config
        ipcMain.on("set-pixelSize", (_event, arg: unknown[]) => {

            const oldPixelSize = pixelSize;
            pixelSize = arg[0] as number;
            const dimensions = automaton.dimensions;

            automaton.resize({
                x: dimensions.x * oldPixelSize / pixelSize,
                y: dimensions.y * oldPixelSize / pixelSize
            });

        });

        ipcMain.on("set-automaton", (_event, args: unknown[]) => {

            const input = args[0] as CellularAutomata;
            cellularAutomaton = input;
            automaton = getAutomaton(automaton.dimensions);

        });

        ipcMain.handleOnce("get-fps", () => {
            return config.get("fps");
        });

        ipcMain.on("set-fps", (_event, args: unknown[]) => {

            const fps = args[0] as number;

            config.set("fps", fps);

        });

        ipcMain.handleOnce("get-shouldTrace", () => config.get("options.shouldTrace"));

        ipcMain.on("set-shouldTrace", (_event, args: unknown[]) => {

            const shouldTrace = args[0] as boolean;

            config.set("options.shouldTrace", shouldTrace);
            automaton.options.shouldTrace = shouldTrace;

        });

        ipcMain.on("set-customOption", (_event, args: unknown[]) => {

            const option = args[0] as string;
            const value = args[1];

            automaton.setCustomOption(option, value);
            config.set(`options.${automaton.id}.${option}`, value);

        });

        ipcMain.handle("get-options", (): AutomatonOptions => config.get(`options.${automaton.name}`));
        //#endregion config

        ipcMain.on("save-canvas", async (): Promise<void> => {

            if (automaton.isEmpty()) {

                await dialog.showMessageBox(win, {
                    message: "Canvas is empty!"
                });

                return;

            }

            const name = await prompt({
                height: 178,
                label: "Enter a name"
            }, win) as string;

            if (name === undefined || name === null)
                return;

            const preset: AutomatonPreset = {
                name: name,
                data: automaton.toString()
            };

            console.log(preset.data);

        });

        ipcMain.handle("load-preset", async (): Promise<void> => {

            const name = await dialog.showOpenDialog(win, {
                properties: ["openDirectory"]
            });

            console.log(name);

        });

        ipcMain.handleOnce("get-cellularAutomata", (): { [key in CellularAutomata]: CellularAutomataDisplayName } => {
            return {
                "conway": "Conway",
                "q-state": "Q-State"
            };
        });

    }

};