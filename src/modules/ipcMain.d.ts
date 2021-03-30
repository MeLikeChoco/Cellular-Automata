import "electron";

declare global {

    namespace Electron {

        interface IpcMain {

            handle(channel: Channel, listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown): void;

            on(channel: Channel, listener: (event: IpcMainEvent, ...args: unknown[]) => unknown): IpcMain;

            handleOnce(channel: Channel, listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown): void;

            once(channel: Channel, listener: (event: IpcMainEvent, ...args: unknown[]) => unknown): IpcMain;

        }

    }

}

// declare module "electron" {

//     interface IpcMain {

//         handle(channel: Channel, listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown): void;

//         on(channel: Channel, listener: (event: IpcMainEvent, ...args: unknown[]) => unknown): IpcMain;

//         handleOnce(channel: Channel, listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown): void;

//         once(channel: Channel, listener: (event: IpcMainEvent, ...args: unknown[]) => unknown): IpcMain;

//     }

// }