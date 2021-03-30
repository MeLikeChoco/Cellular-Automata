import { app, BrowserWindow } from "electron";
import * as path from "path";
import { register } from "electron-localshortcut";
import { data } from "./data";
import electronIsDev from "electron-is-dev";

// export const isDev = process.argv.includes("--dev");

const windowOptions: Electron.WebPreferences = {
  backgroundThrottling: false,
  contextIsolation: true,
  preload: path.join(__dirname, "preload.js"),
  additionalArguments: electronIsDev ? process.argv.slice(2) : null
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
  app.quit();
}

if (electronIsDev) {

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // require("electron-reloader")(module);
    require("source-map-support").install();
    // eslint-disable-next-line no-empty
  } catch (_) { }

}

let win: BrowserWindow = null;
// let store: Store = null;

const createWindow = async (): Promise<void> => {

  // Create the browser window.
  win = new BrowserWindow({

    show: false,
    useContentSize: true,
    title: "Game of Life",
    webPreferences: windowOptions

  });

  // store = new Store({
  //   path: app.getPath("userData")
  // });

  // store.mainBindings(ipcMain, win, fs, undefined, undefined);

  data.init(win);

  win.maximize();
  win.setMenuBarVisibility(false);
  await win.loadFile(path.join(__dirname, "../src/index.html"));
  win.show();

};

const registerShortcuts = (): void => {

  register(win, "F12", () => {

    const webContents = win.webContents;

    if (webContents.isDevToolsOpened())
      webContents.closeDevTools();
    else
      webContents.openDevTools();

  });

  register(win, "CmdOrCtrl+W", () => {
    win.close();
  });

};

app.whenReady()
  .then(createWindow)
  .then(registerShortcuts);

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {

  if (process.platform !== "darwin")
    app.quit();
  // else
  //   store.clearMainBindings(ipcMain);

});

// On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", () => {

  if (BrowserWindow.getAllWindows().length === 0)
    createWindow();

});