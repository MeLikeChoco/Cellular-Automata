// import fs from "fs";
import { contextBridge, ipcRenderer } from "electron";
// import Store from "secure-electron-store";

const exposedIpcRenderer: ExposedIpcRenderer = {

    send: (channel, ...args) => ipcRenderer.send(channel, args),
    on: (channel, func) => ipcRenderer.on(channel, (_event, args: unknown[]) => func(args)),
    invoke: async <T>(channel: Channel, ...args: unknown[]): Promise<T> => (await ipcRenderer.invoke(channel, args)) as T

};

// const exposedStore: ExposedStore = new Store().preloadBindings(ipcRenderer, fs);

contextBridge.exposeInMainWorld("api", {
    isDev: process.argv.includes("--dev"),
    ipcRenderer: exposedIpcRenderer,
    // store: exposedStore
} as ExposedApi);