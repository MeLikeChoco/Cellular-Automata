"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const electron_localshortcut_1 = require("electron-localshortcut");
const data_1 = require("./data");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
// export const isDev = process.argv.includes("--dev");
const windowOptions = {
    backgroundThrottling: false,
    contextIsolation: true,
    preload: path.join(__dirname, "preload.js"),
    additionalArguments: electron_is_dev_1.default ? process.argv.slice(2) : null
};
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    electron_1.app.quit();
}
if (electron_is_dev_1.default) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // require("electron-reloader")(module);
        require("source-map-support").install();
        // eslint-disable-next-line no-empty
    }
    catch (_) { }
}
let win = null;
// let store: Store = null;
const createWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        show: false,
        useContentSize: true,
        title: "Game of Life",
        webPreferences: windowOptions
    });
    // store = new Store({
    //   path: app.getPath("userData")
    // });
    // store.mainBindings(ipcMain, win, fs, undefined, undefined);
    data_1.data.init(win);
    win.maximize();
    win.setMenuBarVisibility(false);
    yield win.loadFile(path.join(__dirname, "../src/index.html"));
    win.show();
});
const registerShortcuts = () => {
    electron_localshortcut_1.register(win, "F12", () => {
        const webContents = win.webContents;
        if (webContents.isDevToolsOpened())
            webContents.closeDevTools();
        else
            webContents.openDevTools();
    });
    electron_localshortcut_1.register(win, "CmdOrCtrl+W", () => {
        win.close();
    });
};
electron_1.app.whenReady()
    .then(createWindow)
    .then(registerShortcuts);
// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
    // else
    //   store.clearMainBindings(ipcMain);
});
// On OS X it"s common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQThDO0FBQzlDLDJDQUE2QjtBQUM3QixtRUFBa0Q7QUFDbEQsaUNBQThCO0FBQzlCLHNFQUE0QztBQUU1Qyx1REFBdUQ7QUFFdkQsTUFBTSxhQUFhLEdBQTRCO0lBQzdDLG9CQUFvQixFQUFFLEtBQUs7SUFDM0IsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0lBQzNDLG1CQUFtQixFQUFFLHlCQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0NBQ2xFLENBQUM7QUFFRiw4RUFBOEU7QUFDOUUsSUFBSSxPQUFPLENBQUMsMkJBQTJCLENBQUMsRUFBRSxFQUFFLHFDQUFxQztJQUMvRSxjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FDWjtBQUVELElBQUkseUJBQWEsRUFBRTtJQUVqQixJQUFJO1FBQ0YsOERBQThEO1FBQzlELHdDQUF3QztRQUN4QyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4QyxvQ0FBb0M7S0FDckM7SUFBQyxPQUFPLENBQUMsRUFBRSxHQUFHO0NBRWhCO0FBRUQsSUFBSSxHQUFHLEdBQWtCLElBQUksQ0FBQztBQUM5QiwyQkFBMkI7QUFFM0IsTUFBTSxZQUFZLEdBQUcsR0FBd0IsRUFBRTtJQUU3Qyw2QkFBNkI7SUFDN0IsR0FBRyxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUV0QixJQUFJLEVBQUUsS0FBSztRQUNYLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLEtBQUssRUFBRSxjQUFjO1FBQ3JCLGNBQWMsRUFBRSxhQUFhO0tBRTlCLENBQUMsQ0FBQztJQUVILHNCQUFzQjtJQUN0QixrQ0FBa0M7SUFDbEMsTUFBTTtJQUVOLDhEQUE4RDtJQUU5RCxXQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWYsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2YsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDOUQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRWIsQ0FBQyxDQUFBLENBQUM7QUFFRixNQUFNLGlCQUFpQixHQUFHLEdBQVMsRUFBRTtJQUVuQyxpQ0FBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1FBRXhCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFFcEMsSUFBSSxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztZQUU1QixXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxpQ0FBUSxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDO0FBRUYsY0FBRyxDQUFDLFNBQVMsRUFBRTtLQUNaLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDbEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFM0Isd0VBQXdFO0FBQ3hFLDBFQUEwRTtBQUMxRSwyQkFBMkI7QUFDM0IsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFFL0IsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVE7UUFDL0IsY0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2IsT0FBTztJQUNQLHNDQUFzQztBQUV4QyxDQUFDLENBQUMsQ0FBQztBQUVILGdFQUFnRTtBQUNoRSw0REFBNEQ7QUFDNUQsY0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBRXRCLElBQUksd0JBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUM1QyxZQUFZLEVBQUUsQ0FBQztBQUVuQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tIFwiZWxlY3Ryb24tbG9jYWxzaG9ydGN1dFwiO1xuaW1wb3J0IHsgZGF0YSB9IGZyb20gXCIuL2RhdGFcIjtcbmltcG9ydCBlbGVjdHJvbklzRGV2IGZyb20gXCJlbGVjdHJvbi1pcy1kZXZcIjtcblxuLy8gZXhwb3J0IGNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKFwiLS1kZXZcIik7XG5cbmNvbnN0IHdpbmRvd09wdGlvbnM6IEVsZWN0cm9uLldlYlByZWZlcmVuY2VzID0ge1xuICBiYWNrZ3JvdW5kVGhyb3R0bGluZzogZmFsc2UsXG4gIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gIHByZWxvYWQ6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwicHJlbG9hZC5qc1wiKSxcbiAgYWRkaXRpb25hbEFyZ3VtZW50czogZWxlY3Ryb25Jc0RldiA/IHByb2Nlc3MuYXJndi5zbGljZSgyKSA6IG51bGxcbn07XG5cbi8vIEhhbmRsZSBjcmVhdGluZy9yZW1vdmluZyBzaG9ydGN1dHMgb24gV2luZG93cyB3aGVuIGluc3RhbGxpbmcvdW5pbnN0YWxsaW5nLlxuaWYgKHJlcXVpcmUoXCJlbGVjdHJvbi1zcXVpcnJlbC1zdGFydHVwXCIpKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgYXBwLnF1aXQoKTtcbn1cblxuaWYgKGVsZWN0cm9uSXNEZXYpIHtcblxuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgLy8gcmVxdWlyZShcImVsZWN0cm9uLXJlbG9hZGVyXCIpKG1vZHVsZSk7XG4gICAgcmVxdWlyZShcInNvdXJjZS1tYXAtc3VwcG9ydFwiKS5pbnN0YWxsKCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gIH0gY2F0Y2ggKF8pIHsgfVxuXG59XG5cbmxldCB3aW46IEJyb3dzZXJXaW5kb3cgPSBudWxsO1xuLy8gbGV0IHN0b3JlOiBTdG9yZSA9IG51bGw7XG5cbmNvbnN0IGNyZWF0ZVdpbmRvdyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcblxuICAvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XG5cbiAgICBzaG93OiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcbiAgICB0aXRsZTogXCJHYW1lIG9mIExpZmVcIixcbiAgICB3ZWJQcmVmZXJlbmNlczogd2luZG93T3B0aW9uc1xuXG4gIH0pO1xuXG4gIC8vIHN0b3JlID0gbmV3IFN0b3JlKHtcbiAgLy8gICBwYXRoOiBhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpXG4gIC8vIH0pO1xuXG4gIC8vIHN0b3JlLm1haW5CaW5kaW5ncyhpcGNNYWluLCB3aW4sIGZzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG5cbiAgZGF0YS5pbml0KHdpbik7XG5cbiAgd2luLm1heGltaXplKCk7XG4gIHdpbi5zZXRNZW51QmFyVmlzaWJpbGl0eShmYWxzZSk7XG4gIGF3YWl0IHdpbi5sb2FkRmlsZShwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL3NyYy9pbmRleC5odG1sXCIpKTtcbiAgd2luLnNob3coKTtcblxufTtcblxuY29uc3QgcmVnaXN0ZXJTaG9ydGN1dHMgPSAoKTogdm9pZCA9PiB7XG5cbiAgcmVnaXN0ZXIod2luLCBcIkYxMlwiLCAoKSA9PiB7XG5cbiAgICBjb25zdCB3ZWJDb250ZW50cyA9IHdpbi53ZWJDb250ZW50cztcblxuICAgIGlmICh3ZWJDb250ZW50cy5pc0RldlRvb2xzT3BlbmVkKCkpXG4gICAgICB3ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XG4gICAgZWxzZVxuICAgICAgd2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG5cbiAgfSk7XG5cbiAgcmVnaXN0ZXIod2luLCBcIkNtZE9yQ3RybCtXXCIsICgpID0+IHtcbiAgICB3aW4uY2xvc2UoKTtcbiAgfSk7XG5cbn07XG5cbmFwcC53aGVuUmVhZHkoKVxuICAudGhlbihjcmVhdGVXaW5kb3cpXG4gIC50aGVuKHJlZ2lzdGVyU2hvcnRjdXRzKTtcblxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQsIGV4Y2VwdCBvbiBtYWNPUy4gVGhlcmUsIGl0XCJzIGNvbW1vblxuLy8gZm9yIGFwcGxpY2F0aW9ucyBhbmQgdGhlaXIgbWVudSBiYXIgdG8gc3RheSBhY3RpdmUgdW50aWwgdGhlIHVzZXIgcXVpdHNcbi8vIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRLlxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT4ge1xuXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSBcImRhcndpblwiKVxuICAgIGFwcC5xdWl0KCk7XG4gIC8vIGVsc2VcbiAgLy8gICBzdG9yZS5jbGVhck1haW5CaW5kaW5ncyhpcGNNYWluKTtcblxufSk7XG5cbi8vIE9uIE9TIFggaXRcInMgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4vLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+IHtcblxuICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID09PSAwKVxuICAgIGNyZWF0ZVdpbmRvdygpO1xuXG59KTsiXX0=