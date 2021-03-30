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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdHMvdGhlbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtFQUErRTtBQUMvRSxpRkFBaUY7QUFDakYsaUNBQWlDO0FBQ2pDLDhDQUE4QztBQUU5QyxnQkFBZ0I7QUFDaEIsMEJBQTBCO0FBQzFCLG1DQUFtQztBQUNuQyxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLFNBQVM7QUFDVCwwQkFBMEI7QUFDMUIsc0NBQXNDO0FBQ3RDLG1DQUFtQztBQUNuQyxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLFFBQVE7QUFFUixLQUFLO0FBRUwsa0NBQWtDO0FBRWxDLDBFQUEwRTtBQUMxRSwrRUFBK0U7QUFFL0UsOENBQThDO0FBQzlDLGdEQUFnRDtBQUNoRCwrQ0FBK0M7QUFDL0MscUNBQXFDO0FBRXJDLDBCQUEwQjtBQUMxQixrRUFBa0U7QUFFbEUsNEJBQTRCO0FBQzVCLHlCQUF5QjtBQUN6Qiw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCLDZCQUE2QjtBQUM3QiwwQkFBMEI7QUFDMUIsb0RBQW9EO0FBQ3BELDJCQUEyQjtBQUUzQiwwQkFBMEI7QUFDMUIsbURBQW1EO0FBRW5ELHVDQUF1QztBQUV2QyxLQUFLO0FBRUwsd0ZBQXdGO0FBRXhGLHFHQUFxRztBQUVyRyx3QkFBd0I7QUFDeEIsc0NBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEMsMEVBQTBFO0FBQzFFLGdCQUFnQjtBQUVoQixLQUFLO0FBRUwsb0VBQW9FO0FBRXBFLHVEQUF1RDtBQUN2RCxpQ0FBaUM7QUFDakMsMEJBQTBCO0FBQzFCLGdDQUFnQztBQUVoQyxxQkFBcUI7QUFFckIsS0FBSztBQUVMLHdEQUF3RDtBQUV4RCx5REFBeUQ7QUFFekQsK0VBQStFO0FBQy9FLG1DQUFtQztBQUNuQywrREFBK0Q7QUFFL0QsbURBQW1EO0FBRW5ELGdDQUFnQztBQUVoQyw4Q0FBOEM7QUFDOUMsa0RBQWtEO0FBQ2xELGtEQUFrRDtBQUVsRCxZQUFZO0FBRVosUUFBUTtBQUVSLDJDQUEyQztBQUUzQyw4REFBOEQ7QUFDOUQsd0RBQXdEO0FBRXhELDRCQUE0QjtBQUU1QixLQUFLO0FBRUwsK0RBQStEO0FBRS9ELGtDQUFrQztBQUVsQywrRUFBK0U7QUFFL0UsS0FBSztBQUVMLG9EQUFvRDtBQUVwRCwwQkFBMEI7QUFFMUIsOEJBQThCO0FBRTlCLDhCQUE4QjtBQUU5Qix5RUFBeUU7QUFFekUsNEZBQTRGO0FBQzVGLDJEQUEyRDtBQUUzRCx5QkFBeUI7QUFDekIseURBQXlEO0FBRXpELHlFQUF5RTtBQUV6RSx5QkFBeUI7QUFFekIsZ0JBQWdCO0FBRWhCLFlBQVk7QUFFWixRQUFRO0FBRVIsa0NBQWtDO0FBQ2xDLDBEQUEwRDtBQUUxRCw4Q0FBOEM7QUFDOUMsMEdBQTBHO0FBQzFHLFNBQVM7QUFFVCx5Q0FBeUM7QUFFekMsc0ZBQXNGO0FBRXRGLEtBQUs7QUFFTCxtRUFBbUU7QUFDbkUscUVBQXFFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29uc3QgdG9vbGJhckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvb2xiYXJcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbi8vIGNvbnN0IHRoZW1lU2VsZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aGVtZXNcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbi8vIGNvbnN0IGRlZmF1bHRUaGVtZSA9IFwiTWF0cml4XCI7XHJcbi8vIGNvbnN0IHRoZW1lczogeyBbbmFtZTogc3RyaW5nXTogVGhlbWUgfSA9IHtcclxuXHJcbi8vICAgICBNYXRyaXg6IHtcclxuLy8gICAgICAgICBuYW1lOiBcIk1hdHJpeFwiLFxyXG4vLyAgICAgICAgIHByaW1hcnlDb2xvcjogXCIjMDAwMDAwXCIsXHJcbi8vICAgICAgICAgc2Vjb25kYXJ5Q29sb3I6IFwiIzAwM0IwMFwiLFxyXG4vLyAgICAgICAgIHRlcnRpYXJ5Q29sb3I6IFwiIzAwOEYxMVwiXHJcbi8vICAgICB9LFxyXG4vLyAgICAgTGl2aW5nU3Rvcm1CaW9tZToge1xyXG4vLyAgICAgICAgIG5hbWU6IFwiTGl2aW5nIFN0b3JtIEJpb21lXCIsXHJcbi8vICAgICAgICAgcHJpbWFyeUNvbG9yOiBcIiNGQzc2NkFcIixcclxuLy8gICAgICAgICBzZWNvbmRhcnlDb2xvcjogXCIjQjBCOEI0XCIsXHJcbi8vICAgICAgICAgdGVydGlhcnlDb2xvcjogXCIjMTg0QTQ1XCJcclxuLy8gICAgIH1cclxuXHJcbi8vIH07XHJcblxyXG4vLyBsZXQgY3VycmVudFRoZW1lOiBUaGVtZSA9IG51bGw7XHJcblxyXG4vLyAvL3NvdXJjZTogaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9jb252ZXJ0aW5nLWNvbG9yLXNwYWNlcy1pbi1qYXZhc2NyaXB0L1xyXG4vLyBjb25zdCByZ2JhVG9IZXggPSAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYT86IG51bWJlcik6IHN0cmluZyA9PiB7XHJcblxyXG4vLyAgICAgbGV0IHJlZCA9IHIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCksXHJcbi8vICAgICAgICAgZ3JlZW4gPSBnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLFxyXG4vLyAgICAgICAgIGJsdWUgPSBiLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLFxyXG4vLyAgICAgICAgIGFscGhhOiBzdHJpbmcgPSB1bmRlZmluZWQ7XHJcblxyXG4vLyAgICAgaWYgKGEgIT0gdW5kZWZpbmVkKVxyXG4vLyAgICAgICAgIGFscGhhID0gTWF0aC5yb3VuZChhICogMjU1KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcclxuXHJcbi8vICAgICBpZiAocmVkLmxlbmd0aCA9PT0gMSlcclxuLy8gICAgICAgICByZWQgPSBcIjBcIiArIHI7XHJcbi8vICAgICBpZiAoZ3JlZW4ubGVuZ3RoID09PSAxKVxyXG4vLyAgICAgICAgIGdyZWVuID0gXCIwXCIgKyBnO1xyXG4vLyAgICAgaWYgKGJsdWUubGVuZ3RoID09PSAxKVxyXG4vLyAgICAgICAgIGJsdWUgPSBcIjBcIiArIGI7XHJcbi8vICAgICBpZiAoYWxwaGEgIT0gdW5kZWZpbmVkICYmIGFscGhhLmxlbmd0aCA9PT0gMSlcclxuLy8gICAgICAgICBhbHBoYSA9IFwiMFwiICsgYTtcclxuXHJcbi8vICAgICBpZiAoYSAhPSB1bmRlZmluZWQpXHJcbi8vICAgICAgICAgcmV0dXJuIFwiI1wiICsgcmVkICsgZ3JlZW4gKyBibHVlICsgYWxwaGE7XHJcblxyXG4vLyAgICAgcmV0dXJuIFwiI1wiICsgcmVkICsgZ3JlZW4gKyBibHVlO1xyXG5cclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGhleFRvUkdCQSA9IChoZXg6IHN0cmluZyk6IHsgcjogbnVtYmVyOyBnOiBudW1iZXI7IGI6IG51bWJlcjsgYT86IG51bWJlciB9ID0+IHtcclxuXHJcbi8vICAgICBjb25zdCByZXN1bHQgPSAvXiM/KFthLWZBLUZcXGRdezJ9KShbYS1mQS1GXFxkXXsyfSkoW2EtZkEtRlxcZF17Mn0pKFthLWZBLUZcXGRdezJ9KT8kL2kuZXhlYyhoZXgpO1xyXG5cclxuLy8gICAgIHJldHVybiByZXN1bHQgPyB7XHJcbi8vICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbi8vICAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbi8vICAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNiksXHJcbi8vICAgICAgICAgYTogcmVzdWx0WzRdICE9IHVuZGVmaW5lZCA/IHBhcnNlSW50KHJlc3VsdFs0XSwgMTYpIDogdW5kZWZpbmVkXHJcbi8vICAgICB9IDogbnVsbDtcclxuXHJcbi8vIH07XHJcblxyXG4vLyBjb25zdCB0aGVtZVN0cmluZ1RvT3B0aW9uID0gKGtleTogc3RyaW5nKTogSFRNTE9wdGlvbkVsZW1lbnQgPT4ge1xyXG5cclxuLy8gICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbi8vICAgICBjb25zdCB0aGVtZSA9IHRoZW1lc1trZXldO1xyXG4vLyAgICAgb3B0aW9uLnZhbHVlID0ga2V5O1xyXG4vLyAgICAgb3B0aW9uLnRleHQgPSB0aGVtZS5uYW1lO1xyXG5cclxuLy8gICAgIHJldHVybiBvcHRpb247XHJcblxyXG4vLyB9O1xyXG5cclxuLy8gY29uc3QgdXBkYXRlV2luZG93VG9UaGVtZSA9ICh0aGVtZTogVGhlbWUpOiB2b2lkID0+IHtcclxuXHJcbi8vICAgICBjYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhlbWUucHJpbWFyeUNvbG9yO1xyXG5cclxuLy8gICAgIGNvbnN0IGltZ0RhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4vLyAgICAgY29uc3QgcGl4ZWxzID0gaW1nRGF0YS5kYXRhO1xyXG4vLyAgICAgY29uc3QgY29sb3JUb1JlY29sb3JUbyA9IGhleFRvUkdCQSh0aGVtZS50ZXJ0aWFyeUNvbG9yKTtcclxuXHJcbi8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpeGVscy5sZW5ndGg7IGkgKz0gNCkge1xyXG5cclxuLy8gICAgICAgICBpZiAocGl4ZWxzW2ldICE9IDApIHtcclxuXHJcbi8vICAgICAgICAgICAgIHBpeGVsc1tpXSA9IGNvbG9yVG9SZWNvbG9yVG8ucjtcclxuLy8gICAgICAgICAgICAgcGl4ZWxzW2kgKyAxXSA9IGNvbG9yVG9SZWNvbG9yVG8uZztcclxuLy8gICAgICAgICAgICAgcGl4ZWxzW2kgKyAyXSA9IGNvbG9yVG9SZWNvbG9yVG8uYjtcclxuXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBjb250ZXh0LnB1dEltYWdlRGF0YShpbWdEYXRhLCAwLCAwKTtcclxuXHJcbi8vICAgICB0b29sYmFyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gdGhlbWUuc2Vjb25kYXJ5Q29sb3I7XHJcbi8vICAgICB0b29sYmFyRWxlbWVudC5zdHlsZS5jb2xvciA9IHRoZW1lLnRlcnRpYXJ5Q29sb3I7XHJcblxyXG4vLyAgICAgY3VycmVudFRoZW1lID0gdGhlbWU7XHJcblxyXG4vLyB9O1xyXG5cclxuLy8gY29uc3QgY2hhbmdlVG9UaGVtZSA9IChrZXk6IHN0cmluZywgdGhlbWU6IFRoZW1lKTogdm9pZCA9PiB7XHJcblxyXG4vLyAgICAgdXBkYXRlV2luZG93VG9UaGVtZSh0aGVtZSk7XHJcblxyXG4vLyAgICAgd2luZG93LmFwaS5zdG9yZS5zZW5kKFwiV3JpdGVDb25maWctUmVxdWVzdFwiLCBcInRoZW1lXCIgYXMgU3RvcmVLZXlzLCBrZXkpO1xyXG5cclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IGhhbmRsZUNvbmZpZyA9IChhcmdzOiBTdG9yZUFyZ3MpOiB2b2lkID0+IHtcclxuXHJcbi8vICAgICBpZiAoYXJncy5zdWNjZXNzKSB7XHJcblxyXG4vLyAgICAgICAgIHN3aXRjaCAoYXJncy5rZXkpIHtcclxuXHJcbi8vICAgICAgICAgICAgIGNhc2UgXCJ0aGVtZVwiOiB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgaWYgKGFyZ3MudmFsdWUgPT09IHVuZGVmaW5lZCB8fCBhcmdzLnZhbHVlID09PSBudWxsKSB7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hcGkuc3RvcmUuc2VuZChcIldyaXRlQ29uZmlnLVJlcXVlc3RcIiwgYXJncy5rZXksIGRlZmF1bHRUaGVtZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lID0gdGhlbWVzW2RlZmF1bHRUaGVtZV07XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbi8vICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lID0gdGhlbWVzW2FyZ3MudmFsdWVdO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IHRoZW1lIGlzOiAke2N1cnJlbnRUaGVtZS5uYW1lfWApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGZvciAoY29uc3QgdGhlbWUgaW4gdGhlbWVzKVxyXG4vLyAgICAgICAgIHRoZW1lU2VsZWN0aW9uLmFkZCh0aGVtZVN0cmluZ1RvT3B0aW9uKHRoZW1lKSk7XHJcblxyXG4vLyAgICAgdGhlbWVTZWxlY3Rpb24ub25jaGFuZ2UgPSAoKTogdm9pZCA9PiB7XHJcbi8vICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGNoYW5nZVRvVGhlbWUodGhlbWVTZWxlY3Rpb24udmFsdWUsIHRoZW1lc1t0aGVtZVNlbGVjdGlvbi52YWx1ZV0pKTtcclxuLy8gICAgIH07XHJcblxyXG4vLyAgICAgdGhlbWVTZWxlY3Rpb24udmFsdWUgPSBhcmdzLnZhbHVlO1xyXG5cclxuLy8gICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB1cGRhdGVXaW5kb3dUb1RoZW1lKHRoZW1lc1t0aGVtZVNlbGVjdGlvbi52YWx1ZV0pKTtcclxuXHJcbi8vIH07XHJcblxyXG4vLyB3aW5kb3cuYXBpLnN0b3JlLm9uUmVjZWl2ZShcIlJlYWRDb25maWctUmVzcG9uc2VcIiwgaGFuZGxlQ29uZmlnKTtcclxuLy8gd2luZG93LmFwaS5zdG9yZS5zZW5kKFwiUmVhZENvbmZpZy1SZXF1ZXN0XCIsIFwidGhlbWVcIiBhcyBTdG9yZUtleXMpOyJdfQ==