// const toolbarElement = document.getElementById("toolbar") as HTMLDivElement;
// const themeSelection = document.getElementById("themes") as HTMLSelectElement;
// const defaultTheme = "Matrix";
// const themes: { [name: string]: Theme } = {

//     Matrix: {
//         name: "Matrix",
//         primaryColor: "#000000",
//         secondaryColor: "#003B00",
//         tertiaryColor: "#008F11"
//     },
//     LivingStormBiome: {
//         name: "Living Storm Biome",
//         primaryColor: "#FC766A",
//         secondaryColor: "#B0B8B4",
//         tertiaryColor: "#184A45"
//     }

// };

// let currentTheme: Theme = null;

// //source: https://css-tricks.com/converting-color-spaces-in-javascript/
// const rgbaToHex = (r: number, g: number, b: number, a?: number): string => {

//     let red = r.toString(16).toUpperCase(),
//         green = g.toString(16).toUpperCase(),
//         blue = b.toString(16).toUpperCase(),
//         alpha: string = undefined;

//     if (a != undefined)
//         alpha = Math.round(a * 255).toString(16).toUpperCase();

//     if (red.length === 1)
//         red = "0" + r;
//     if (green.length === 1)
//         green = "0" + g;
//     if (blue.length === 1)
//         blue = "0" + b;
//     if (alpha != undefined && alpha.length === 1)
//         alpha = "0" + a;

//     if (a != undefined)
//         return "#" + red + green + blue + alpha;

//     return "#" + red + green + blue;

// };

// const hexToRGBA = (hex: string): { r: number; g: number; b: number; a?: number } => {

//     const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})?$/i.exec(hex);

//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16),
//         a: result[4] != undefined ? parseInt(result[4], 16) : undefined
//     } : null;

// };

// const themeStringToOption = (key: string): HTMLOptionElement => {

//     const option = document.createElement("option");
//     const theme = themes[key];
//     option.value = key;
//     option.text = theme.name;

//     return option;

// };

// const updateWindowToTheme = (theme: Theme): void => {

//     canvas.style.backgroundColor = theme.primaryColor;

//     const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
//     const pixels = imgData.data;
//     const colorToRecolorTo = hexToRGBA(theme.tertiaryColor);

//     for (let i = 0; i < pixels.length; i += 4) {

//         if (pixels[i] != 0) {

//             pixels[i] = colorToRecolorTo.r;
//             pixels[i + 1] = colorToRecolorTo.g;
//             pixels[i + 2] = colorToRecolorTo.b;

//         }

//     }

//     context.putImageData(imgData, 0, 0);

//     toolbarElement.style.background = theme.secondaryColor;
//     toolbarElement.style.color = theme.tertiaryColor;

//     currentTheme = theme;

// };

// const changeToTheme = (key: string, theme: Theme): void => {

//     updateWindowToTheme(theme);

//     window.api.store.send("WriteConfig-Request", "theme" as StoreKeys, key);

// };

// const handleConfig = (args: StoreArgs): void => {

//     if (args.success) {

//         switch (args.key) {

//             case "theme": {

//                 if (args.value === undefined || args.value === null) {

//                     window.api.store.send("WriteConfig-Request", args.key, defaultTheme);
//                     currentTheme = themes[defaultTheme];

//                 } else
//                     currentTheme = themes[args.value];

//                 console.log(`Current theme is: ${currentTheme.name}`);

//                 break;

//             }

//         }

//     }

//     for (const theme in themes)
//         themeSelection.add(themeStringToOption(theme));

//     themeSelection.onchange = (): void => {
//         requestAnimationFrame(() => changeToTheme(themeSelection.value, themes[themeSelection.value]));
//     };

//     themeSelection.value = args.value;

//     requestAnimationFrame(() => updateWindowToTheme(themes[themeSelection.value]));

// };

// window.api.store.onReceive("ReadConfig-Response", handleConfig);
// window.api.store.send("ReadConfig-Request", "theme" as StoreKeys);