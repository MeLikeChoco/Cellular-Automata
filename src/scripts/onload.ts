window.addEventListener("load", async (): Promise<void> => {

    await initCanvas();
    await initSettings();

    const pixelSize = settings.getPixelSize();

    ipcRenderer.send("set-canvas", {
        x: canvasElement.width / pixelSize,
        y: canvasElement.height / pixelSize
    } as TwoDVector);

    document.getElementById("pixelSizes").onchange = async (): Promise<void> => {

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

    };

    automata.onchange = settings.setAutomaton;
    shouldTraceCheckbox.onclick = settings.setShouldTrace;
    document.getElementById("fps").onchange = settings.setFpsInMs;
    document.getElementById("next").onclick = canvas.getNextState;
    document.getElementById("clear").onclick = canvas.clearCanvas;
    document.getElementById("play").onclick = canvas.startAnimation;
    document.getElementById("pause").onclick = canvas.pauseAnimation;
    document.onclick = canvas.clicked;

    if (window.api.isDev) {
        document.getElementById("testing").onclick = async (): Promise<void> => {
            ipcRenderer.send("save-canvas");
        };
    }

});