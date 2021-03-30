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
Object.defineProperty(exports, "__esModule", { value: true });
// import fs from "fs";
const electron_1 = require("electron");
// import Store from "secure-electron-store";
const exposedIpcRenderer = {
    send: (channel, ...args) => electron_1.ipcRenderer.send(channel, args),
    on: (channel, func) => electron_1.ipcRenderer.on(channel, (_event, args) => func(args)),
    invoke: (channel, ...args) => __awaiter(void 0, void 0, void 0, function* () { return (yield electron_1.ipcRenderer.invoke(channel, args)); })
};
// const exposedStore: ExposedStore = new Store().preloadBindings(ipcRenderer, fs);
electron_1.contextBridge.exposeInMainWorld("api", {
    isDev: process.argv.includes("--dev"),
    ipcRenderer: exposedIpcRenderer,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUJBQXVCO0FBQ3ZCLHVDQUFzRDtBQUN0RCw2Q0FBNkM7QUFFN0MsTUFBTSxrQkFBa0IsR0FBdUI7SUFFM0MsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxzQkFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO0lBQzNELEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLHNCQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFlLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RixNQUFNLEVBQUUsQ0FBVSxPQUFnQixFQUFFLEdBQUcsSUFBZSxFQUFjLEVBQUUsa0RBQUMsT0FBQSxDQUFDLE1BQU0sc0JBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFNLENBQUEsR0FBQTtDQUV4SCxDQUFDO0FBRUYsbUZBQW1GO0FBRW5GLHdCQUFhLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFO0lBQ25DLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDckMsV0FBVyxFQUFFLGtCQUFrQjtDQUVwQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcbi8vIGltcG9ydCBTdG9yZSBmcm9tIFwic2VjdXJlLWVsZWN0cm9uLXN0b3JlXCI7XHJcblxyXG5jb25zdCBleHBvc2VkSXBjUmVuZGVyZXI6IEV4cG9zZWRJcGNSZW5kZXJlciA9IHtcclxuXHJcbiAgICBzZW5kOiAoY2hhbm5lbCwgLi4uYXJncykgPT4gaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCBhcmdzKSxcclxuICAgIG9uOiAoY2hhbm5lbCwgZnVuYykgPT4gaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKF9ldmVudCwgYXJnczogdW5rbm93bltdKSA9PiBmdW5jKGFyZ3MpKSxcclxuICAgIGludm9rZTogYXN5bmMgPFQ+KGNoYW5uZWw6IENoYW5uZWwsIC4uLmFyZ3M6IHVua25vd25bXSk6IFByb21pc2U8VD4gPT4gKGF3YWl0IGlwY1JlbmRlcmVyLmludm9rZShjaGFubmVsLCBhcmdzKSkgYXMgVFxyXG5cclxufTtcclxuXHJcbi8vIGNvbnN0IGV4cG9zZWRTdG9yZTogRXhwb3NlZFN0b3JlID0gbmV3IFN0b3JlKCkucHJlbG9hZEJpbmRpbmdzKGlwY1JlbmRlcmVyLCBmcyk7XHJcblxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKFwiYXBpXCIsIHtcclxuICAgIGlzRGV2OiBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWRldlwiKSxcclxuICAgIGlwY1JlbmRlcmVyOiBleHBvc2VkSXBjUmVuZGVyZXIsXHJcbiAgICAvLyBzdG9yZTogZXhwb3NlZFN0b3JlXHJcbn0gYXMgRXhwb3NlZEFwaSk7Il19