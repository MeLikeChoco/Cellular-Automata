var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let settings;
const initSettings = () => __awaiter(this, void 0, void 0, function* () {
    let executed = false;
    const setting = {
        automaton: "",
        pixelSize: 1,
        fpsInMs: 1000,
        generation: 0
    };
    if (!executed) {
        executed = true;
        const cellularAutomata = yield ipcRenderer.invoke("get-cellularAutomata");
        const pixelSize = pixelSizeSelection.options[0].value;
        const fpsInMs = yield ipcRenderer.invoke("get-fps");
        const shouldTrace = yield ipcRenderer.invoke("get-shouldTrace");
        setting.pixelSize = parseInt(pixelSize);
        setting.fpsInMs = 1000 / fpsInMs;
        shouldTraceCheckbox.checked = shouldTrace;
        Object.keys(cellularAutomata).forEach((value) => {
            const option = document.createElement("option");
            option.value = value;
            option.text = cellularAutomata[value];
            automata.add(option);
        });
        automata.value = "conway";
        setting.automaton = automata.value;
        // document.getElementById(setting.automaton).style.visibility = "visible";
        pixelSizeSelection.value = pixelSize;
        fpsSelection.value = fpsInMs.toString();
        generation.textContent = setting.generation.toString();
        settings = {
            getPixelSize: () => setting.pixelSize,
            setPixelSize: () => {
                const value = parseInt(pixelSizeSelection.value);
                setting.pixelSize = value;
                ipcRenderer.send("set-pixelSize", value);
            },
            getFpsInMs: () => setting.fpsInMs,
            setFpsInMs: () => {
                const value = parseInt(fpsSelection.value);
                setting.fpsInMs = 1000 / value;
                ipcRenderer.send("set-fps", value);
            },
            getShouldTrace: () => shouldTraceCheckbox.checked,
            setShouldTrace: () => ipcRenderer.send("set-shouldTrace", shouldTraceCheckbox.checked),
            setAutomaton: () => __awaiter(this, void 0, void 0, function* () {
                const newAutomaton = automata.value;
                const oldAutomaton = setting.automaton;
                setting.automaton = newAutomaton;
                ipcRenderer.send("set-automaton", newAutomaton);
                document.getElementById(oldAutomaton).style.visibility = "hidden";
                document.getElementById(newAutomaton).style.visibility = "visible";
            }),
            addGeneration: () => {
                generation.textContent = (++setting.generation).toString();
            },
            resetGeneration: () => {
                setting.generation = 0;
                generation.textContent = setting.generation.toString();
            }
        };
    }
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NyaXB0cy9zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLFFBVUgsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLEdBQXdCLEVBQUU7SUFFM0MsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLE1BQU0sT0FBTyxHQUFHO1FBQ1osU0FBUyxFQUFFLEVBQUU7UUFDYixTQUFTLEVBQUUsQ0FBQztRQUNaLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLENBQUM7S0FDaEIsQ0FBQztJQUVGLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFFWCxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWhCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUE2RCxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3RJLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsTUFBTSxDQUFTLFNBQVMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBVSxpQkFBaUIsQ0FBQyxDQUFDO1FBRXpFLE9BQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNqQyxtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUF1QixFQUFFLEVBQUU7WUFFOUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxN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RUwsOENBQThDO0FBQzlDLG1FQUFtRTtBQUNuRSwyQ0FBMkM7QUFDM0MsNEJBQTRCO0FBQzVCLEtBQUs7QUFFTCxzQ0FBc0M7QUFFdEMsa0RBQWtEO0FBQ2xELHNDQUFzQztBQUV0QywwQ0FBMEM7QUFFMUMsS0FBSztBQUVMLHFEQUFxRDtBQUNyRCw0RkFBNEY7QUFDNUYsS0FBSztBQUVMLDZDQUE2QztBQUU3QyxxREFBcUQ7QUFFckQsc0RBQXNEO0FBRXRELEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgc2V0dGluZ3M6IHtcclxuICAgIGdldFBpeGVsU2l6ZTogKCkgPT4gbnVtYmVyO1xyXG4gICAgc2V0UGl4ZWxTaXplOiAoKSA9PiB2b2lkO1xyXG4gICAgZ2V0RnBzSW5NczogKCkgPT4gbnVtYmVyO1xyXG4gICAgc2V0RnBzSW5NczogKCkgPT4gdm9pZDtcclxuICAgIGdldFNob3VsZFRyYWNlOiAoKSA9PiBib29sZWFuO1xyXG4gICAgc2V0U2hvdWxkVHJhY2U6ICgpID0+IHZvaWQ7XHJcbiAgICBzZXRBdXRvbWF0b246ICgpID0+IHZvaWQ7XHJcbiAgICBhZGRHZW5lcmF0aW9uOiAoKSA9PiB2b2lkO1xyXG4gICAgcmVzZXRHZW5lcmF0aW9uOiAoKSA9PiB2b2lkO1xyXG59O1xyXG5cclxuY29uc3QgaW5pdFNldHRpbmdzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuICAgIGxldCBleGVjdXRlZCA9IGZhbHNlO1xyXG4gICAgY29uc3Qgc2V0dGluZyA9IHtcclxuICAgICAgICBhdXRvbWF0b246IFwiXCIsXHJcbiAgICAgICAgcGl4ZWxTaXplOiAxLFxyXG4gICAgICAgIGZwc0luTXM6IDEwMDAsXHJcbiAgICAgICAgZ2VuZXJhdGlvbjogMFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoIWV4ZWN1dGVkKSB7XHJcblxyXG4gICAgICAgIGV4ZWN1dGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VsbHVsYXJBdXRvbWF0YSA9IGF3YWl0IGlwY1JlbmRlcmVyLmludm9rZTx7IFtrZXkgaW4gQ2VsbHVsYXJBdXRvbWF0YV06IENlbGx1bGFyQXV0b21hdGFEaXNwbGF5TmFtZSB9PihcImdldC1jZWxsdWxhckF1dG9tYXRhXCIpO1xyXG4gICAgICAgIGNvbnN0IHBpeGVsU2l6ZSA9IHBpeGVsU2l6ZVNlbGVjdGlvbi5vcHRpb25zWzBdLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IGZwc0luTXMgPSBhd2FpdCBpcGNSZW5kZXJlci5pbnZva2U8bnVtYmVyPihcImdldC1mcHNcIik7XHJcbiAgICAgICAgY29uc3Qgc2hvdWxkVHJhY2UgPSBhd2FpdCBpcGNSZW5kZXJlci5pbnZva2U8Ym9vbGVhbj4oXCJnZXQtc2hvdWxkVHJhY2VcIik7XHJcblxyXG4gICAgICAgIHNldHRpbmcucGl4ZWxTaXplID0gcGFyc2VJbnQocGl4ZWxTaXplKTtcclxuICAgICAgICBzZXR0aW5nLmZwc0luTXMgPSAxMDAwIC8gZnBzSW5NcztcclxuICAgICAgICBzaG91bGRUcmFjZUNoZWNrYm94LmNoZWNrZWQgPSBzaG91bGRUcmFjZTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMoY2VsbHVsYXJBdXRvbWF0YSkuZm9yRWFjaCgodmFsdWU6IENlbGx1bGFyQXV0b21hdGEpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBvcHRpb24udGV4dCA9IGNlbGx1bGFyQXV0b21hdGFbdmFsdWVdO1xyXG5cclxuICAgICAgICAgICAgYXV0b21hdGEuYWRkKG9wdGlvbik7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhdXRvbWF0YS52YWx1ZSA9IFwiY29ud2F5XCIgYXMgQ2VsbHVsYXJBdXRvbWF0YTtcclxuICAgICAgICBzZXR0aW5nLmF1dG9tYXRvbiA9IGF1dG9tYXRhLnZhbHVlO1xyXG5cclxuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZXR0aW5nLmF1dG9tYXRvbikuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuICAgICAgICBwaXhlbFNpemVTZWxlY3Rpb24udmFsdWUgPSBwaXhlbFNpemU7XHJcbiAgICAgICAgZnBzU2VsZWN0aW9uLnZhbHVlID0gZnBzSW5Ncy50b1N0cmluZygpO1xyXG4gICAgICAgIGdlbmVyYXRpb24udGV4dENvbnRlbnQgPSBzZXR0aW5nLmdlbmVyYXRpb24udG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgc2V0dGluZ3MgPSB7XHJcblxyXG4gICAgICAgICAgICBnZXRQaXhlbFNpemU6ICgpOiBudW1iZXIgPT4gc2V0dGluZy5waXhlbFNpemUsXHJcbiAgICAgICAgICAgIHNldFBpeGVsU2l6ZTogKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQocGl4ZWxTaXplU2VsZWN0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcucGl4ZWxTaXplID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcInNldC1waXhlbFNpemVcIiwgdmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RnBzSW5NczogKCk6IG51bWJlciA9PiBzZXR0aW5nLmZwc0luTXMsXHJcbiAgICAgICAgICAgIHNldEZwc0luTXM6ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGZwc1NlbGVjdGlvbi52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nLmZwc0luTXMgPSAxMDAwIC8gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcInNldC1mcHNcIiwgdmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0U2hvdWxkVHJhY2U6ICgpOiBib29sZWFuID0+IHNob3VsZFRyYWNlQ2hlY2tib3guY2hlY2tlZCxcclxuICAgICAgICAgICAgc2V0U2hvdWxkVHJhY2U6ICgpOiB2b2lkID0+IGlwY1JlbmRlcmVyLnNlbmQoXCJzZXQtc2hvdWxkVHJhY2VcIiwgc2hvdWxkVHJhY2VDaGVja2JveC5jaGVja2VkKSxcclxuICAgICAgICAgICAgc2V0QXV0b21hdG9uOiBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3QXV0b21hdG9uID0gYXV0b21hdGEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRBdXRvbWF0b24gPSBzZXR0aW5nLmF1dG9tYXRvbjtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcuYXV0b21hdG9uID0gbmV3QXV0b21hdG9uO1xyXG5cclxuICAgICAgICAgICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJzZXQtYXV0b21hdG9uXCIsIG5ld0F1dG9tYXRvbik7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRBdXRvbWF0b24pLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV3QXV0b21hdG9uKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRHZW5lcmF0aW9uOiAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uLnRleHRDb250ZW50ID0gKCsrc2V0dGluZy5nZW5lcmF0aW9uKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNldEdlbmVyYXRpb246ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcuZ2VuZXJhdGlvbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uLnRleHRDb250ZW50ID0gc2V0dGluZy5nZW5lcmF0aW9uLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy8gY29uc3QgZ2V0UGl4ZWxTaXplID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuLy8gICAgIGNvbnN0IHBpeGVsU2l6ZSA9IChhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoXCJnZXQtcGl4ZWxTaXplXCIpKSBhcyBudW1iZXI7XHJcblxyXG4vLyAgICAgLy8gc2V0UGl4ZWxTaXplKHBpeGVsU2l6ZSk7XHJcbi8vICAgICBnbG9iYWxzLnNldFBpeGVsU2l6ZShwaXhlbFNpemUpO1xyXG4vLyAgICAgcGl4ZWxTaXplU2VsZWN0aW9uLnZhbHVlID0gcGl4ZWxTaXplLnRvU3RyaW5nKCk7XHJcblxyXG4vLyB9O1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IGdldFBpeGVsU2l6ZSA9ICgpOiBudW1iZXIgPT4gc2V0dGluZy5waXhlbFNpemU7XHJcblxyXG4vLyBleHBvcnQgY29uc3Qgc2V0UGl4ZWxTaXplID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuLy8gICAgIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQocGl4ZWxTaXplU2VsZWN0aW9uLnZhbHVlKTtcclxuLy8gICAgIHNldHRpbmcucGl4ZWxTaXplID0gdmFsdWU7XHJcblxyXG4vLyAgICAgaXBjUmVuZGVyZXIuc2VuZChcInNldC1waXhlbFNpemVcIiwgdmFsdWUpO1xyXG5cclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGdldEZwcyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuLy8gICAgIGNvbnN0IGZwcyA9IChhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoXCJnZXQtZnBzXCIpKSBhcyBudW1iZXI7XHJcbi8vICAgICBmcHNTZWxlY3Rpb24udmFsdWUgPSBmcHMudG9TdHJpbmcoKTtcclxuLy8gICAgIGZwc0luTXMgPSAxMDAwIC8gZnBzO1xyXG4vLyB9O1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IHNldEZwcyA9ICgpOiB2b2lkID0+IHtcclxuXHJcbi8vICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGZwc1NlbGVjdGlvbi52YWx1ZSk7XHJcbi8vICAgICBzZXR0aW5nLmZwc0luTXMgPSAxMDAwIC8gdmFsdWU7XHJcblxyXG4vLyAgICAgaXBjUmVuZGVyZXIuc2VuZChcInNldC1mcHNcIiwgdmFsdWUpO1xyXG5cclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGdldFNob3VsZFdyYXAgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbi8vICAgICBzaG91bGRXcmFwQ2hlY2tib3guY2hlY2tlZCA9IChhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoXCJnZXQtc2hvdWxkV3JhcFwiKSkgYXMgYm9vbGVhbjtcclxuLy8gfTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBzZXRTaG91bGRXcmFwID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuLy8gICAgIGNvbnN0IHNob3VsZFdyYXAgPSBzaG91bGRXcmFwQ2hlY2tib3guY2hlY2tlZDtcclxuXHJcbi8vICAgICBpcGNSZW5kZXJlci5zZW5kKFwic2V0LXNob3VsZFdyYXBcIiwgc2hvdWxkV3JhcCk7XHJcblxyXG4vLyB9OyJdfQ==