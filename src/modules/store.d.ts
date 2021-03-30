// declare module "secure-electron-store" {

//     export const readConfigRequest = "ReadConfig-Request";
//     export const readConfigResponse = "ReadConfig-Response";
//     export const readUnprotectedConfigRequest = "ReadUnprotectedConfig-Request";
//     export const readUnprotectedConfigResponse = "ReadUnprotectedConfig-Response";
//     export const writeConfigRequest = "WriteConfig-Request";
//     export const writeConfigResponse = "WriteConfig-Response";
//     export const writeUnprotectedConfigRequest = "WriteUnprotectedConfig-Request";
//     export const writeUnprotectedConfigResponse = "WriteUnprotectedConfig-Response";
//     export const deleteConfigRequest = "DeleteConfig-Request";
//     export const deleteConfigResponse = "DeleteConfig-Response";
//     export const deleteUnprotectedConfigRequest = "DeleteUnprotectedConfig-Request";
//     export const deleteUnprotectedConfigResponse = "DeleteUnprotectedConfig-Response";
//     export const savePasskeyRequest = "SavePasskey-Request";
//     export const savePasskeyResponse = "SavePasskey-Response";
//     export const useConfigInMainRequest = "UseConfigInMain-Request";
//     export const useConfigInMainResponse = "UseConfigInMain-Response";
//     export const useUnprotectedConfigInMainRequest = "UseUnprotectedConfigInMain-Request";
//     export const useUnprotectedConfigInMainResponse = "UseUnprotectedConfigInMain-Response";

//     export default class Store {

//         constructor(options?: unknown);

//         // Gets the IV value; or optionally creates
//         // a new one if it does not already exist
//         getIv(fs: typeof import("fs")): void;

//         preloadBindings(ipcRenderer: Electron.IpcRenderer, fs: typeof import("fs")): ExposedStore;

//         mainBindings(
//             ipcMain: Electron.IpcMain,
//             browserWindow: Electron.BrowserWindow,
//             fs: typeof import("fs"),
//             mainProcessCallback: (b: boolean, data: unknown) => void,
//             unprotectedMainProcessCallback: (b: boolean, data: unknown) => void
//         ): void;

//         mainInitialStore(fs: typeof import("fs")): unknown;

//         // Clears ipcMain bindings;
//         // mainly intended to be used within Mac-OS
//         clearMainBindings(ipcMain: Electron.IpcMain): void;

//     }

// }