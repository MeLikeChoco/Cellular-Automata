var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener("load", () => __awaiter(this, void 0, void 0, function* () {
    yield initCanvas();
    yield initSettings();
    const pixelSize = settings.getPixelSize();
    ipcRenderer.send("set-canvas", {
        x: canvasElement.width / pixelSize,
        y: canvasElement.height / pixelSize
    });
    document.getElementById("pixelSizes").onchange = () => __awaiter(this, void 0, void 0, function* () {
        if (canvas.isPlaying) {
            new Notification("Pause the animation first.", {
                body: "Changing pixel sizes can only be done when no animation is playing."
            });
            pixelSizeSelection.value = settings.getPixelSize().toString();
        }
        else {
            settings.setPixelSize();
            canvas.clearCanvas();
        }
    });
    automata.onchange = settings.setAutomaton;
    shouldTraceCheckbox.onclick = settings.setShouldTrace;
    document.getElementById("fps").onchange = settings.setFpsInMs;
    document.getElementById("next").onclick = canvas.getNextState;
    document.getElementById("clear").onclick = canvas.clearCanvas;
    document.getElementById("play").onclick = canvas.startAnimation;
    document.getElementById("pause").onclick = canvas.pauseAnimation;
    document.onclick = canvas.clicked;
    if (window.api.isDev) {
        document.getElementById("testing").onclick = () => __awaiter(this, void 0, void 0, function* () {
            ipcRenderer.send("save-canvas");
        });
    }
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25sb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdHMvb25sb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBd0IsRUFBRTtJQUV0RCxNQUFNLFVBQVUsRUFBRSxDQUFDO0lBQ25CLE1BQU0sWUFBWSxFQUFFLENBQUM7SUFFckIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRTFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQzNCLENBQUMsRUFBRSxhQUFhLENBQUMsS0FBSyxHQUFHLFNBQVM7UUFDbEMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsU0FBUztLQUN4QixDQUFDLENBQUM7SUFFakIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEdBQUcsR0FBd0IsRUFBRTtRQUV2RSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFFbEIsSUFBSSxZQUFZLENBQUMsNEJBQTRCLEVBQUU7Z0JBQzNDLElBQUksRUFBRSxxRUFBcUU7YUFDOUUsQ0FBQyxDQUFDO1lBRUgsa0JBQWtCLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUVqRTthQUNJO1lBRUQsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUV4QjtJQUVMLENBQUMsQ0FBQSxDQUFDO0lBRUYsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQzFDLG1CQUFtQixDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO0lBQ3RELFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDOUQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUM5RCxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQzlELFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDaEUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUNqRSxRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFFbEMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNsQixRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUF3QixFQUFFO1lBQ25FLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFBLENBQUM7S0FDTDtBQUVMLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuICAgIGF3YWl0IGluaXRDYW52YXMoKTtcclxuICAgIGF3YWl0IGluaXRTZXR0aW5ncygpO1xyXG5cclxuICAgIGNvbnN0IHBpeGVsU2l6ZSA9IHNldHRpbmdzLmdldFBpeGVsU2l6ZSgpO1xyXG5cclxuICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJzZXQtY2FudmFzXCIsIHtcclxuICAgICAgICB4OiBjYW52YXNFbGVtZW50LndpZHRoIC8gcGl4ZWxTaXplLFxyXG4gICAgICAgIHk6IGNhbnZhc0VsZW1lbnQuaGVpZ2h0IC8gcGl4ZWxTaXplXHJcbiAgICB9IGFzIFR3b0RWZWN0b3IpO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGl4ZWxTaXplc1wiKS5vbmNoYW5nZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcy5pc1BsYXlpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIG5ldyBOb3RpZmljYXRpb24oXCJQYXVzZSB0aGUgYW5pbWF0aW9uIGZpcnN0LlwiLCB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiBcIkNoYW5naW5nIHBpeGVsIHNpemVzIGNhbiBvbmx5IGJlIGRvbmUgd2hlbiBubyBhbmltYXRpb24gaXMgcGxheWluZy5cIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHBpeGVsU2l6ZVNlbGVjdGlvbi52YWx1ZSA9IHNldHRpbmdzLmdldFBpeGVsU2l6ZSgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHNldHRpbmdzLnNldFBpeGVsU2l6ZSgpO1xyXG4gICAgICAgICAgICBjYW52YXMuY2xlYXJDYW52YXMoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgYXV0b21hdGEub25jaGFuZ2UgPSBzZXR0aW5ncy5zZXRBdXRvbWF0b247XHJcbiAgICBzaG91bGRUcmFjZUNoZWNrYm94Lm9uY2xpY2sgPSBzZXR0aW5ncy5zZXRTaG91bGRUcmFjZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnBzXCIpLm9uY2hhbmdlID0gc2V0dGluZ3Muc2V0RnBzSW5NcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV4dFwiKS5vbmNsaWNrID0gY2FudmFzLmdldE5leHRTdGF0ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJcIikub25jbGljayA9IGNhbnZhcy5jbGVhckNhbnZhcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKS5vbmNsaWNrID0gY2FudmFzLnN0YXJ0QW5pbWF0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZVwiKS5vbmNsaWNrID0gY2FudmFzLnBhdXNlQW5pbWF0aW9uO1xyXG4gICAgZG9jdW1lbnQub25jbGljayA9IGNhbnZhcy5jbGlja2VkO1xyXG5cclxuICAgIGlmICh3aW5kb3cuYXBpLmlzRGV2KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXN0aW5nXCIpLm9uY2xpY2sgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJzYXZlLWNhbnZhc1wiKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSk7Il19