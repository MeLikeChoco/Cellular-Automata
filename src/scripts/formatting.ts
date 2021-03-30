const toolbarElement = document.getElementById("toolbar") as HTMLDivElement;
const infoElement = document.getElementById("info") as HTMLDivElement;
const toolbarElements = toolbarElement.children;

for (let i = 0; i < toolbarElements.length; i++) {

    const element = toolbarElements[i] as HTMLElement;

    element.style.float = "right";

}