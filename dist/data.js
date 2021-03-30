"use strict";
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
exports.data = void 0;
const electron_1 = require("electron");
const electron_store_1 = __importDefault(require("electron-store"));
const electron_prompt_1 = __importDefault(require("electron-prompt"));
const conway_1 = require("./automata/conway");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const config = new electron_store_1.default({
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
            "q-state": {}
        }
    }
});
if (electron_is_dev_1.default) {
    config.reset("customOptions", "fps", "options");
}
exports.data = {
    init: (browserWindow) => {
        let cellularAutomaton;
        let automaton;
        let pixelSize = 1;
        const win = browserWindow;
        const getAutomaton = (dimensions) => {
            switch (cellularAutomaton) {
                case "conway":
                default:
                    return new conway_1.Conway(dimensions, config.get("options"), config.get("customOptions.conway"));
            }
        };
        electron_1.ipcMain.once("set-canvas", (_event, args) => {
            const dimensions = args[0];
            automaton = getAutomaton(dimensions);
        });
        electron_1.ipcMain.on("clear-canvas", () => automaton.clear());
        electron_1.ipcMain.on("set-pixel", (_event, args) => automaton.setPixel(args[0]));
        electron_1.ipcMain.on("clear-pixel", (_event, args) => automaton.clearPixel(args[0]));
        electron_1.ipcMain.handle("get-nextState", () => {
            const nextState = automaton.getNextState();
            return nextState;
        });
        electron_1.ipcMain.handle("get-colorMap", () => automaton.getColorMap());
        //#region config
        electron_1.ipcMain.on("set-pixelSize", (_event, arg) => {
            const oldPixelSize = pixelSize;
            pixelSize = arg[0];
            const dimensions = automaton.dimensions;
            automaton.resize({
                x: dimensions.x * oldPixelSize / pixelSize,
                y: dimensions.y * oldPixelSize / pixelSize
            });
        });
        electron_1.ipcMain.on("set-automaton", (_event, args) => {
            const input = args[0];
            cellularAutomaton = input;
            automaton = getAutomaton(automaton.dimensions);
        });
        electron_1.ipcMain.handleOnce("get-fps", () => {
            return config.get("fps");
        });
        electron_1.ipcMain.on("set-fps", (_event, args) => {
            const fps = args[0];
            config.set("fps", fps);
        });
        electron_1.ipcMain.handleOnce("get-shouldTrace", () => config.get("options.shouldTrace"));
        electron_1.ipcMain.on("set-shouldTrace", (_event, args) => {
            const shouldTrace = args[0];
            config.set("options.shouldTrace", shouldTrace);
            automaton.options.shouldTrace = shouldTrace;
        });
        electron_1.ipcMain.on("set-customOption", (_event, args) => {
            const option = args[0];
            const value = args[1];
            automaton.setCustomOption(option, value);
            config.set(`options.${automaton.id}.${option}`, value);
        });
        electron_1.ipcMain.handle("get-options", () => config.get(`options.${automaton.name}`));
        //#endregion config
        electron_1.ipcMain.on("save-canvas", () => __awaiter(void 0, void 0, void 0, function* () {
            if (automaton.isEmpty()) {
                yield electron_1.dialog.showMessageBox(win, {
                    message: "Canvas is empty!"
                });
                return;
            }
            const name = yield electron_prompt_1.default({
                height: 178,
                label: "Enter a name"
            }, win);
            if (name === undefined || name === null)
                return;
            const preset = {
                name: name,
                data: automaton.toString()
            };
            console.log(preset.data);
        }));
        electron_1.ipcMain.handle("load-preset", () => __awaiter(void 0, void 0, void 0, function* () {
            const name = yield electron_1.dialog.showOpenDialog(win, {
                properties: ["openDirectory"]
            });
            console.log(name);
        }));
        electron_1.ipcMain.handleOnce("get-cellularAutomata", () => {
            return {
                "conway": "Conway",
                "q-state": "Q-State"
            };
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUEwRDtBQUMxRCxvRUFBbUM7QUFDbkMsc0VBQXFDO0FBQ3JDLDhDQUEyQztBQUMzQyxzRUFBNEM7QUFFNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBSyxDQUFTO0lBRTdCLDZCQUE2QixFQUFFLElBQUk7SUFDbkMsUUFBUSxFQUFFO1FBRU4sR0FBRyxFQUFFLENBQUM7UUFDTixPQUFPLEVBQUU7WUFDTCxXQUFXLEVBQUUsS0FBSztTQUNyQjtRQUNELGFBQWEsRUFBRTtZQUVYLFFBQVEsRUFBRTtnQkFDTixZQUFZLEVBQUUsSUFBSTthQUNyQjtZQUNELFNBQVMsRUFBRSxFQUVWO1NBRUo7S0FFSjtDQUVKLENBQUMsQ0FBQztBQUVILElBQUkseUJBQWEsRUFBRTtJQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztDQUNuRDtBQUVZLFFBQUEsSUFBSSxHQUFHO0lBRWhCLElBQUksRUFBRSxDQUFDLGFBQTRCLEVBQVEsRUFBRTtRQUV6QyxJQUFJLGlCQUFtQyxDQUFDO1FBQ3hDLElBQUksU0FBb0IsQ0FBQztRQUN6QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDO1FBRTFCLE1BQU0sWUFBWSxHQUFHLENBQUMsVUFBc0IsRUFBYSxFQUFFO1lBRXZELFFBQVEsaUJBQWlCLEVBQUU7Z0JBRXZCLEtBQUssUUFBUSxDQUFDO2dCQUNkO29CQUNJLE9BQU8sSUFBSSxlQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7YUFFaEc7UUFFTCxDQUFDLENBQUM7UUFFRixr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TztZQUVYLE1BQU0sTUFBTSxHQUFvQjtnQkFDNUIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUU7YUFDN0IsQ0FBQztZQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxrQkFBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBd0IsRUFBRTtZQUVwRCxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtnQkFDMUMsVUFBVSxFQUFFLENBQUMsZUFBZSxDQUFDO2FBQ2hDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEIsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILGtCQUFPLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLEdBQStELEVBQUU7WUFDeEcsT0FBTztnQkFDSCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLFNBQVM7YUFDdkIsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztDQUVKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyV2luZG93LCBpcGNNYWluLCBkaWFsb2cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcclxuaW1wb3J0IFN0b3JlIGZyb20gXCJlbGVjdHJvbi1zdG9yZVwiO1xyXG5pbXBvcnQgcHJvbXB0IGZyb20gXCJlbGVjdHJvbi1wcm9tcHRcIjtcclxuaW1wb3J0IHsgQ29ud2F5IH0gZnJvbSBcIi4vYXV0b21hdGEvY29ud2F5XCI7XHJcbmltcG9ydCBlbGVjdHJvbklzRGV2IGZyb20gXCJlbGVjdHJvbi1pcy1kZXZcIjtcclxuXHJcbmNvbnN0IGNvbmZpZyA9IG5ldyBTdG9yZTxDb25maWc+KHtcclxuXHJcbiAgICBhY2Nlc3NQcm9wZXJ0aWVzQnlEb3ROb3RhdGlvbjogdHJ1ZSxcclxuICAgIGRlZmF1bHRzOiB7XHJcblxyXG4gICAgICAgIGZwczogMSxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIHNob3VsZFRyYWNlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3VzdG9tT3B0aW9uczoge1xyXG5cclxuICAgICAgICAgICAgXCJjb253YXlcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJzaG91bGRXcmFwXCI6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJxLXN0YXRlXCI6IHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuaWYgKGVsZWN0cm9uSXNEZXYpIHtcclxuICAgIGNvbmZpZy5yZXNldChcImN1c3RvbU9wdGlvbnNcIiwgXCJmcHNcIiwgXCJvcHRpb25zXCIpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGF0YSA9IHtcclxuXHJcbiAgICBpbml0OiAoYnJvd3NlcldpbmRvdzogQnJvd3NlcldpbmRvdyk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBsZXQgY2VsbHVsYXJBdXRvbWF0b246IENlbGx1bGFyQXV0b21hdGE7XHJcbiAgICAgICAgbGV0IGF1dG9tYXRvbjogQXV0b21hdG9uO1xyXG4gICAgICAgIGxldCBwaXhlbFNpemUgPSAxO1xyXG4gICAgICAgIGNvbnN0IHdpbiA9IGJyb3dzZXJXaW5kb3c7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldEF1dG9tYXRvbiA9IChkaW1lbnNpb25zOiBUd29EVmVjdG9yKTogQXV0b21hdG9uID0+IHtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoY2VsbHVsYXJBdXRvbWF0b24pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiY29ud2F5XCI6XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29ud2F5KGRpbWVuc2lvbnMsIGNvbmZpZy5nZXQoXCJvcHRpb25zXCIpLCBjb25maWcuZ2V0KFwiY3VzdG9tT3B0aW9ucy5jb253YXlcIikpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpcGNNYWluLm9uY2UoXCJzZXQtY2FudmFzXCIsIChfZXZlbnQsIGFyZ3M6IHVua25vd25bXSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IGFyZ3NbMF0gYXMgVHdvRFZlY3RvcjtcclxuICAgICAgICAgICAgYXV0b21hdG9uID0gZ2V0QXV0b21hdG9uKGRpbWVuc2lvbnMpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXBjTWFpbi5vbihcImNsZWFyLWNhbnZhc1wiLCAoKSA9PiBhdXRvbWF0b24uY2xlYXIoKSk7XHJcbiAgICAgICAgaXBjTWFpbi5vbihcInNldC1waXhlbFwiLCAoX2V2ZW50LCBhcmdzOiB1bmtub3duW10pID0+IGF1dG9tYXRvbi5zZXRQaXhlbChhcmdzWzBdIGFzIFR3b0RWZWN0b3IpKTtcclxuICAgICAgICBpcGNNYWluLm9uKFwiY2xlYXItcGl4ZWxcIiwgKF9ldmVudCwgYXJnczogdW5rbm93bltdKSA9PiBhdXRvbWF0b24uY2xlYXJQaXhlbChhcmdzWzBdIGFzIFR3b0RWZWN0b3IpKTtcclxuXHJcbiAgICAgICAgaXBjTWFpbi5oYW5kbGUoXCJnZXQtbmV4dFN0YXRlXCIsICgpOiBTdGF0ZSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0U3RhdGUgPSBhdXRvbWF0b24uZ2V0TmV4dFN0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXBjTWFpbi5oYW5kbGUoXCJnZXQtY29sb3JNYXBcIiwgKCk6IENvbG9yTWFwID0+IGF1dG9tYXRvbi5nZXRDb2xvck1hcCgpKTtcclxuXHJcbiAgICAgICAgLy8jcmVnaW9uIGNvbmZpZ1xyXG4gICAgICAgIGlwY01haW4ub24oXCJzZXQtcGl4ZWxTaXplXCIsIChfZXZlbnQsIGFyZzogdW5rbm93bltdKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvbGRQaXhlbFNpemUgPSBwaXhlbFNpemU7XHJcbiAgICAgICAgICAgIHBpeGVsU2l6ZSA9IGFyZ1swXSBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpbWVuc2lvbnMgPSBhdXRvbWF0b24uZGltZW5zaW9ucztcclxuXHJcbiAgICAgICAgICAgIGF1dG9tYXRvbi5yZXNpemUoe1xyXG4gICAgICAgICAgICAgICAgeDogZGltZW5zaW9ucy54ICogb2xkUGl4ZWxTaXplIC8gcGl4ZWxTaXplLFxyXG4gICAgICAgICAgICAgICAgeTogZGltZW5zaW9ucy55ICogb2xkUGl4ZWxTaXplIC8gcGl4ZWxTaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXBjTWFpbi5vbihcInNldC1hdXRvbWF0b25cIiwgKF9ldmVudCwgYXJnczogdW5rbm93bltdKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IGFyZ3NbMF0gYXMgQ2VsbHVsYXJBdXRvbWF0YTtcclxuICAgICAgICAgICAgY2VsbHVsYXJBdXRvbWF0b24gPSBpbnB1dDtcclxuICAgICAgICAgICAgYXV0b21hdG9uID0gZ2V0QXV0b21hdG9uKGF1dG9tYXRvbi5kaW1lbnNpb25zKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4uaGFuZGxlT25jZShcImdldC1mcHNcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLmdldChcImZwc1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXBjTWFpbi5vbihcInNldC1mcHNcIiwgKF9ldmVudCwgYXJnczogdW5rbm93bltdKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmcHMgPSBhcmdzWzBdIGFzIG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXQoXCJmcHNcIiwgZnBzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4uaGFuZGxlT25jZShcImdldC1zaG91bGRUcmFjZVwiLCAoKSA9PiBjb25maWcuZ2V0KFwib3B0aW9ucy5zaG91bGRUcmFjZVwiKSk7XHJcblxyXG4gICAgICAgIGlwY01haW4ub24oXCJzZXQtc2hvdWxkVHJhY2VcIiwgKF9ldmVudCwgYXJnczogdW5rbm93bltdKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaG91bGRUcmFjZSA9IGFyZ3NbMF0gYXMgYm9vbGVhbjtcclxuXHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXQoXCJvcHRpb25zLnNob3VsZFRyYWNlXCIsIHNob3VsZFRyYWNlKTtcclxuICAgICAgICAgICAgYXV0b21hdG9uLm9wdGlvbnMuc2hvdWxkVHJhY2UgPSBzaG91bGRUcmFjZTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4ub24oXCJzZXQtY3VzdG9tT3B0aW9uXCIsIChfZXZlbnQsIGFyZ3M6IHVua25vd25bXSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gYXJnc1swXSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXJnc1sxXTtcclxuXHJcbiAgICAgICAgICAgIGF1dG9tYXRvbi5zZXRDdXN0b21PcHRpb24ob3B0aW9uLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXQoYG9wdGlvbnMuJHthdXRvbWF0b24uaWR9LiR7b3B0aW9ufWAsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4uaGFuZGxlKFwiZ2V0LW9wdGlvbnNcIiwgKCk6IEF1dG9tYXRvbk9wdGlvbnMgPT4gY29uZmlnLmdldChgb3B0aW9ucy4ke2F1dG9tYXRvbi5uYW1lfWApKTtcclxuICAgICAgICAvLyNlbmRyZWdpb24gY29uZmlnXHJcblxyXG4gICAgICAgIGlwY01haW4ub24oXCJzYXZlLWNhbnZhc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoYXV0b21hdG9uLmlzRW1wdHkoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGF3YWl0IGRpYWxvZy5zaG93TWVzc2FnZUJveCh3aW4sIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkNhbnZhcyBpcyBlbXB0eSFcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGF3YWl0IHByb21wdCh7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE3OCxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBcIkVudGVyIGEgbmFtZVwiXHJcbiAgICAgICAgICAgIH0sIHdpbikgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCB8fCBuYW1lID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJlc2V0OiBBdXRvbWF0b25QcmVzZXQgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogYXV0b21hdG9uLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZXNldC5kYXRhKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4uaGFuZGxlKFwibG9hZC1wcmVzZXRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGF3YWl0IGRpYWxvZy5zaG93T3BlbkRpYWxvZyh3aW4sIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IFtcIm9wZW5EaXJlY3RvcnlcIl1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlwY01haW4uaGFuZGxlT25jZShcImdldC1jZWxsdWxhckF1dG9tYXRhXCIsICgpOiB7IFtrZXkgaW4gQ2VsbHVsYXJBdXRvbWF0YV06IENlbGx1bGFyQXV0b21hdGFEaXNwbGF5TmFtZSB9ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFwiY29ud2F5XCI6IFwiQ29ud2F5XCIsXHJcbiAgICAgICAgICAgICAgICBcInEtc3RhdGVcIjogXCJRLVN0YXRlXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59OyJdfQ==