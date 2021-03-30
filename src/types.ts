type CellularAutomata = "conway" | "q-state"
type CellularAutomataDisplayName = "Conway" | "Q-State"

type AutomatonOptions = {
    shouldTrace: boolean;
}

type CustomAutomatonOptions = { [name: string]: unknown }

interface Automaton {

    id: CellularAutomata;
    name: CellularAutomataDisplayName;
    options: AutomatonOptions;
    customOptions: CustomAutomatonOptions;
    buffer: number[][];
    dimensions: TwoDVector;
    generation: number;
    
    setCustomOption: (name: string, value: unknown) => void;
    getCustomOption: <T>(name: string) => T;
    setPixel: (coord: TwoDVector, value?: number) => void;
    clearPixel: (coord: TwoDVector) => void;
    getCurrentState: () => State;
    getNextState: () => State;
    getColorMap: () => ColorMap;
    resize: (dimensions: TwoDVector) => void;
    clear: () => void;
    isEmpty: () => boolean;
    toString: () => string;

}

type AutomatonPreset = {
    name: string;
    data: string;
}

type Config = {
    fps: number;
    options: AutomatonOptions;
    customOptions: {
        [key in CellularAutomata]: CustomAutomatonOptions;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TwoDVector = {
    x: number;
    y: number;
}

type ColorMap = { [state: number]: string }

type State = {
    data: number[][];
    map: ColorMap;
    traceNumber: number;
}

type Theme = {

    name: string;

    /**
     * Canvas background color
     */
    primaryColor: string;

    /**
     * Toolbar background color
     */
    secondaryColor: string;

    /**
     * Pixel and text color
     */
    tertiaryColor: string;

}

type StoreKeys = "theme";

type StoreArgs<T = string> = {
    success: boolean;
    key: StoreKeys;
    value: T;
}

type Channel = "set-pixelSize" | "set-canvas" | "clear-canvas" | "set-pixel" | "clear-pixel" | "get-nextState" | "set-automaton" | "get-colorMap" | "get-fps" | "set-fps" | "get-shouldTrace" | "set-shouldTrace" | "save-canvas" | "load-preset" | "get-cellularAutomata" | "get-customOption" | "set-customOption";

type ExposedIpcRenderer = {

    send: (channel: Channel, ...args: unknown[]) => void;
    on: (
        channel: Channel,
        func: (...args: unknown[]) => void
    ) => void;
    invoke: <T>(
        channel: Channel,
        ...args: unknown[]
    ) => Promise<T>;
    // handle: (
    //     channel: string,
    //     func: (...args: unknown[]) => Promise<unknown>
    // ) => void;

};

// type StoreChannel = "ReadConfig-Request" | "ReadConfig-Response" | "ReadUnprotectedConfig-Request" | "ReadUnprotectedConfig-Response" | "WriteConfig-Request" | "WriteConfig-Response" | "WriteUnprotectedConfig-Request" | "WriteUnprotectedConfig-Response" | "DeleteConfig-Request" | "DeleteConfig-Response" | "DeleteUnprotectedConfig-Request" | "DeleteUnprotectedConfig-Response" | "SavePasskey-Request" | "SavePasskey-Response" | "UseConfigInMain-Request" | "UseConfigInMain-Response" | "UseUnprotectedConfigInMain-Request" | "UseUnprotectedConfigInMain-Response";

// type ExposedStore = {
//     onReceive: (channel: StoreChannel, func: (args: StoreArgs) => void) => void;
//     send: (channel: StoreChannel, ...args: unknown[]) => void;
// }

type ExposedApi = {
    isDev: boolean;
    ipcRenderer: ExposedIpcRenderer;
    // store: ExposedStore;
}

interface Window {
    api: ExposedApi;
}

window.api.ipcRenderer = window.api.ipcRenderer || null;
// window.api.constants = window.api.constants || null;