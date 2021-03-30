const conwayOptionsElement = document.getElementById("conway") as HTMLDivElement;
const shouldWrapCheckbox = document.getElementById("shouldWrap") as HTMLInputElement;

shouldWrapCheckbox.onclick = (): void => {
    ipcRenderer.send("set-customOption", "shouldWrap", shouldWrapCheckbox.checked);
};