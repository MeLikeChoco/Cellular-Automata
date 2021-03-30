var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let canvas;
const initCanvas = () => __awaiter(this, void 0, void 0, function* () {
    const context = canvasElement.getContext("2d");
    //#region set canvas
    const scale = window.devicePixelRatio || 1;
    // canvas.width = 1280 * scale;
    // canvas.height = 720 * scale;
    // canvas.width = parseInt(getComputedStyle(canvas).width.slice(0, -2)) * scale;
    // canvas.height = parseInt(getComputedStyle(canvas).height.slice(0, -2)) * scale;
    canvasElement.width = window.screen.width * scale;
    canvasElement.height = window.screen.height * scale;
    context.imageSmoothingEnabled = false;
    context.scale(scale, scale);
    // ipcRenderer.send("set-canvas", {
    //     x: canvasElement.width,
    //     y: canvasElement.height
    // } as TwoDVector);
    //#endregion set canvas
    //#region init pixel sizes
    //#region common factors
    //source: https://stackoverflow.com/a/47947866
    // Calculates the missing factors by combining prime factors
    const findAllFactors = (input) => {
        // The more primes you add to this array the lower is the 
        // prohability for calculating new primes at runtime
        // (minimum primes in array: [2, 3, 5])
        const primes = [2, 3, 5, 7, 11, 13, 17, 19];
        // returns array of prime factorization
        const findPrimeFactors = (currentFactor, highestFactor = 0, primeFactors = []) => {
            // Adds next prime to array "primes"
            const addNextPrime = (lastPrime) => {
                const primeCandidate = lastPrime + (lastPrime % 10 === 3 ? 4 : 2);
                const sqrtNumber = Math.floor(Math.sqrt(primeCandidate));
                for (let i = 2; i < sqrtNumber + 1; i++) {
                    if (primeCandidate % i === 0) {
                        return addNextPrime(primeCandidate);
                    }
                }
                primes.push(primeCandidate);
            };
            for (let i = 0; i < primes.length; i++) {
                const mod = currentFactor % primes[i];
                if (highestFactor === 0 && mod === 0) {
                    highestFactor = currentFactor / primes[i];
                    primeFactors.push(primes[i]);
                    return findPrimeFactors(currentFactor / primes[i], highestFactor, primeFactors);
                }
                else {
                    if (primes[i] <= highestFactor) {
                        if (i === primes.length - 1) {
                            addNextPrime(primes[primes.length - 1]);
                        }
                        if (mod === 0) {
                            primeFactors.push(primes[i]);
                            return findPrimeFactors(currentFactor / primes[i], highestFactor, primeFactors);
                        }
                    }
                    else if (highestFactor) {
                        return primeFactors;
                    }
                }
            }
        };
        const factors = findPrimeFactors(input);
        const primeCount = factors.length;
        let combinedFactor = 0;
        for (let i = 0; i < primeCount - 1; i++) {
            for (let j = i + 1; j < primeCount; j++) {
                combinedFactor = (j === i + 1) ? factors[i] * factors[j] : combinedFactor * factors[j];
                factors.push(factors[i] * factors[j]);
                factors.push(combinedFactor);
            }
        }
        factors.push(1);
        return factors.sort((a, b) => a - b).filter((value, index, array) => index === array.indexOf(value));
    };
    //#endregion common factors
    const xFactors = findAllFactors(canvasElement.width);
    const yFactors = findAllFactors(canvasElement.height);
    const commonFactors = xFactors.filter(factor => yFactors.includes(factor));
    commonFactors
        .sort((a, b) => a - b)
        .forEach((size) => {
        const option = document.createElement("option");
        const str = size.toString();
        option.value = str;
        option.text = str;
        pixelSizeSelection.add(option);
    });
    //#endregion init pixel sizes
    //#region color inversion
    //source: https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
    const invertColor = (hex, bw) => {
        const padZero = (str, len = 0) => {
            len = len || 2;
            const zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        };
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        const invertedR = (255 - r).toString(16);
        const invertedG = (255 - g).toString(16);
        const invertedB = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + padZero(invertedR) + padZero(invertedG) + padZero(invertedB);
    };
    //#endregion color inversion
    //#region mouse position
    // const mousePos = {
    //     x: 0, y: 0,
    //     lastX: 0, lastY: 0,
    //     isDrawing: false
    // };
    //source: https://stackoverflow.com/questions/43853119/javascript-wrong-mouse-position-when-drawing-on-canvas
    // const setMousePosition = (event: MouseEvent): void => {
    //     const bounds = canvas.getBoundingClientRect();
    //     // get the mouse coordinates, subtract the canvas top left and any scrolling
    //     mousePos.x = event.pageX - bounds.left - scrollX;
    //     mousePos.y = event.pageY - bounds.top - scrollY;
    //     //first normalize the mouse coordinates from 0 to 1 (0,0) top left
    //     mousePos.x /= bounds.width;
    //     mousePos.y /= bounds.height;
    //     // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
    //     mousePos.x *= canvas.width;
    //     mousePos.y *= canvas.height;
    //     if (event.button === 0) {
    //         if (event.type === "mousedown" && (event.target as HTMLElement)?.id === canvasId)
    //             mousePos.isDrawing = true;
    //         else if (event.type === "mouseup")
    //             mousePos.isDrawing = false;
    //     }
    // };
    //#endregion mouse position
    const getMousePositionOnCanvas = (event) => {
        const bounds = canvasElement.getBoundingClientRect();
        // get the mouse coordinates, subtract the canvas top left and any scrolling
        let x = event.pageX - bounds.left - scrollX;
        let y = event.pageY - bounds.top - scrollY;
        //first normalize the mouse coordinates from 0 to 1 (0,0) top left
        x /= bounds.width;
        y /= bounds.height;
        // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
        x *= canvasElement.width;
        y *= canvasElement.height;
        return {
            x: x,
            y: y
        };
    };
    //#region pixel manipulation
    const setPixel = (x, y, color, isClicked = false) => __awaiter(this, void 0, void 0, function* () {
        if (x >= canvasElement.width || x < 0 || y >= canvasElement.height || y < 0)
            return;
        color = color !== null && color !== void 0 ? color : (yield ipcRenderer.invoke("get-colorMap"))[1];
        const pixelSize = settings.getPixelSize();
        const xPixel = pixelSize * Math.trunc(x / pixelSize);
        const yPixel = pixelSize * Math.trunc(y / pixelSize);
        if (pixelSize > 4) {
            context.fillStyle = color.startsWith("#") ? invertColor(color, false) : "black";
            context.fillRect(xPixel, yPixel, pixelSize, pixelSize); //fill for border
            context.fillStyle = color;
            context.fillRect(xPixel + 2, yPixel + 2, pixelSize - 2, pixelSize - 2); //fill for the actul square
        }
        else {
            context.fillStyle = color;
            context.fillRect(xPixel, yPixel, pixelSize, pixelSize);
        }
        if (isClicked) {
            ipcRenderer.send("set-pixel", {
                x: xPixel / pixelSize,
                y: yPixel / pixelSize
            });
        }
    });
    const clearPixel = (x, y) => {
        if (x >= canvasElement.width || x < 0 || y >= canvasElement.height || y < 0)
            return;
        const pixelSize = settings.getPixelSize();
        const xPixel = pixelSize * Math.trunc(x / pixelSize);
        const yPixel = pixelSize * Math.trunc(y / pixelSize);
        context.clearRect(xPixel, yPixel, pixelSize, pixelSize);
        ipcRenderer.send("clear-pixel", {
            x: xPixel / pixelSize,
            y: yPixel / pixelSize
        });
    };
    //#endregion pixel manipulation
    const getNextState = () => __awaiter(this, void 0, void 0, function* () {
        const nextState = yield ipcRenderer.invoke("get-nextState");
        const data = nextState.data;
        const map = nextState.map;
        const pixelSize = settings.getPixelSize();
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[0].length; x++) {
                const population = data[y][x];
                if (population != 0 && (settings.getShouldTrace() || population != nextState.traceNumber))
                    yield setPixel(x * pixelSize, y * pixelSize, map[population]);
            }
        }
        settings.addGeneration();
    });
    //#region animation
    let lastFrameTime;
    let animationHandle;
    let isPlaying;
    const animate = () => __awaiter(this, void 0, void 0, function* () {
        const elapsed = Date.now() - lastFrameTime;
        if (elapsed > settings.getFpsInMs()) {
            yield getNextState();
            lastFrameTime = Date.now();
        }
        animationHandle = requestAnimationFrame(animate);
    });
    const startAnimation = () => __awaiter(this, void 0, void 0, function* () {
        if (!isPlaying) {
            lastFrameTime = Date.now();
            isPlaying = true;
            yield animate();
        }
    });
    const pauseAnimation = () => {
        isPlaying = false;
        cancelAnimationFrame(animationHandle);
    };
    //#endregion animation
    //#region free form draw
    //source: http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
    // const line = (x0: number, y0: number, x1: number, y1: number): void => {
    //     x0 = Math.trunc(x0), y0 = Math.trunc(y0), x1 = Math.trunc(x1), y1 = Math.trunc(y1);
    //     const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    //     const dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    //     let err = (dx > dy ? dx : -dy) / 2;
    //     // eslint-disable-next-line no-constant-condition
    //     while (true) {
    //         setPixel(x0, y0);
    //         if (x0 === x1 && y0 === y1)
    //             break;
    //         const e2 = err;
    //         if (e2 > -dx) {
    //             err -= dy;
    //             x0 += sx;
    //         }
    //         if (e2 < dy) {
    //             err += dx;
    //             y0 += sy;
    //         }
    //     }
    // };
    // const draw = (): void => {
    //     if (mousePos.isDrawing) {
    //         //drawing with a single pixel
    //         if (mousePos.lastX === mousePos.x && mousePos.lastY === mousePos.y) {
    //             setPixel(mousePos.x, mousePos.y);
    //             // const x = mousePos.x;
    //             // const y = mousePos.y;
    //             // const imageData = context.getImageData(x, y, 1, 1);
    //             // const data = imageData.data;
    //             // const r = data[0];
    //             // const g = data[1];
    //             // const b = data[2];
    //             // if (r != 0 || g != 0 || b != 0)
    //             //     clearPixel(x, y);
    //             // else
    //             //     setPixel(x, y);
    //         }
    //         else //drawing when moving mouse
    //             line(mousePos.lastX, mousePos.lastY, mousePos.x, mousePos.y);
    //     }
    //     mousePos.lastX = mousePos.x;
    //     mousePos.lastY = mousePos.y;
    //     requestAnimationFrame(draw);
    // };
    //#endregion free form draw
    const clearCanvas = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ipcRenderer.send("clear-canvas");
        settings.resetGeneration();
    };
    const clicked = (event) => {
        var _a;
        if (event.button === 0 &&
            event.type === "click" &&
            ((_a = event.target) === null || _a === void 0 ? void 0 : _a.id) === canvasId) {
            requestAnimationFrame(() => __awaiter(this, void 0, void 0, function* () {
                const mousePos = getMousePositionOnCanvas(event);
                const x = mousePos.x;
                const y = mousePos.y;
                const imageData = context.getImageData(x, y, 1, 1);
                const data = imageData.data;
                const r = data[0];
                const g = data[1];
                const b = data[2];
                if (r != 0 || g != 0 || b != 0)
                    clearPixel(x, y);
                else
                    yield setPixel(x, y, null, true);
            }));
        }
    };
    canvas = {
        isPlaying: (() => isPlaying)(),
        clearCanvas: clearCanvas,
        getNextState: getNextState,
        startAnimation: startAnimation,
        pauseAnimation: pauseAnimation,
        clicked: clicked
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjcmlwdHMvY2FudmFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLElBQUksTUFPSCxDQUFDO0FBRUYsTUFBTSxVQUFVLEdBQUcsR0FBd0IsRUFBRTtJQUV6QyxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9DLG9CQUFvQjtJQUNwQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO0lBQzNDLCtCQUErQjtJQUMvQiwrQkFBK0I7SUFDL0IsZ0ZBQWdGO0lBQ2hGLGtGQUFrRjtJQUNsRixhQUFhLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsRCxhQUFhLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUVwRCxPQUFPLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBRXRDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTVCLG1DQUFtQztJQUNuQyw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCLG9CQUFvQjtJQUNwQix1QkFBdUI7SUFFdkIsMEJBQTBCO0lBQzFCLHdCQUF3QjtJQUN4Qiw4Q0FBOEM7SUFDOUMsNERBQTREO0lBQzVELE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBYSxFQUFZLEVBQUU7UUFFL0MsMERBQTBEO1FBQzFELG9EQUFvRDtRQUNwRCx1Q0FBdUM7UUFDdkMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFNUMsdUNBQXVDO1FBQ3ZDLE1BQU0s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LENBQUMsQ0FBQzs7b0JBRWpCLE1BQU0sUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXpDLENBQUMsQ0FBQSxDQUFDLENBQUM7U0FFTjtJQUVMLENBQUMsQ0FBQztJQUVGLE1BQU0sR0FBRztRQUVMLFNBQVMsRUFBRSxDQUFDLEdBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3ZDLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLFlBQVksRUFBRSxZQUFZO1FBQzFCLGNBQWMsRUFBRSxjQUFjO1FBQzlCLGNBQWMsRUFBRSxjQUFjO1FBQzlCLE9BQU8sRUFBRSxPQUFPO0tBRW5CLENBQUM7QUFFTixDQUFDLENBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImxldCBjYW52YXM6IHtcclxuICAgIGlzUGxheWluZzogYm9vbGVhbjtcclxuICAgIGNsZWFyQ2FudmFzOiAoKSA9PiB2b2lkO1xyXG4gICAgZ2V0TmV4dFN0YXRlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gICAgc3RhcnRBbmltYXRpb246ICgpID0+IFByb21pc2U8dm9pZD47XHJcbiAgICBwYXVzZUFuaW1hdGlvbjogKCkgPT4gdm9pZDtcclxuICAgIGNsaWNrZWQ6IChldmVudDogTW91c2VFdmVudCkgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IGluaXRDYW52YXMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblxyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIC8vI3JlZ2lvbiBzZXQgY2FudmFzXHJcbiAgICBjb25zdCBzY2FsZSA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XHJcbiAgICAvLyBjYW52YXMud2lkdGggPSAxMjgwICogc2NhbGU7XHJcbiAgICAvLyBjYW52YXMuaGVpZ2h0ID0gNzIwICogc2NhbGU7XHJcbiAgICAvLyBjYW52YXMud2lkdGggPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKGNhbnZhcykud2lkdGguc2xpY2UoMCwgLTIpKSAqIHNjYWxlO1xyXG4gICAgLy8gY2FudmFzLmhlaWdodCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUoY2FudmFzKS5oZWlnaHQuc2xpY2UoMCwgLTIpKSAqIHNjYWxlO1xyXG4gICAgY2FudmFzRWxlbWVudC53aWR0aCA9IHdpbmRvdy5zY3JlZW4ud2lkdGggKiBzY2FsZTtcclxuICAgIGNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gd2luZG93LnNjcmVlbi5oZWlnaHQgKiBzY2FsZTtcclxuXHJcbiAgICBjb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnRleHQuc2NhbGUoc2NhbGUsIHNjYWxlKTtcclxuXHJcbiAgICAvLyBpcGNSZW5kZXJlci5zZW5kKFwic2V0LWNhbnZhc1wiLCB7XHJcbiAgICAvLyAgICAgeDogY2FudmFzRWxlbWVudC53aWR0aCxcclxuICAgIC8vICAgICB5OiBjYW52YXNFbGVtZW50LmhlaWdodFxyXG4gICAgLy8gfSBhcyBUd29EVmVjdG9yKTtcclxuICAgIC8vI2VuZHJlZ2lvbiBzZXQgY2FudmFzXHJcblxyXG4gICAgLy8jcmVnaW9uIGluaXQgcGl4ZWwgc2l6ZXNcclxuICAgIC8vI3JlZ2lvbiBjb21tb24gZmFjdG9yc1xyXG4gICAgLy9zb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80Nzk0Nzg2NlxyXG4gICAgLy8gQ2FsY3VsYXRlcyB0aGUgbWlzc2luZyBmYWN0b3JzIGJ5IGNvbWJpbmluZyBwcmltZSBmYWN0b3JzXHJcbiAgICBjb25zdCBmaW5kQWxsRmFjdG9ycyA9IChpbnB1dDogbnVtYmVyKTogbnVtYmVyW10gPT4ge1xyXG5cclxuICAgICAgICAvLyBUaGUgbW9yZSBwcmltZXMgeW91IGFkZCB0byB0aGlzIGFycmF5IHRoZSBsb3dlciBpcyB0aGUgXHJcbiAgICAgICAgLy8gcHJvaGFiaWxpdHkgZm9yIGNhbGN1bGF0aW5nIG5ldyBwcmltZXMgYXQgcnVudGltZVxyXG4gICAgICAgIC8vIChtaW5pbXVtIHByaW1lcyBpbiBhcnJheTogWzIsIDMsIDVdKVxyXG4gICAgICAgIGNvbnN0IHByaW1lcyA9IFsyLCAzLCA1LCA3LCAxMSwgMTMsIDE3LCAxOV07XHJcblxyXG4gICAgICAgIC8vIHJldHVybnMgYXJyYXkgb2YgcHJpbWUgZmFjdG9yaXphdGlvblxyXG4gICAgICAgIGNvbnN0IGZpbmRQcmltZUZhY3RvcnMgPSAoY3VycmVudEZhY3RvcjogbnVtYmVyLCBoaWdoZXN0RmFjdG9yID0gMCwgcHJpbWVGYWN0b3JzOiBudW1iZXJbXSA9IFtdKTogbnVtYmVyW10gPT4ge1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkcyBuZXh0IHByaW1lIHRvIGFycmF5IFwicHJpbWVzXCJcclxuICAgICAgICAgICAgY29uc3QgYWRkTmV4dFByaW1lID0gKGxhc3RQcmltZTogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByaW1lQ2FuZGlkYXRlID0gbGFzdFByaW1lICsgKGxhc3RQcmltZSAlIDEwID09PSAzID8gNCA6IDIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3FydE51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KHByaW1lQ2FuZGlkYXRlKSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IHNxcnROdW1iZXIgKyAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJpbWVDYW5kaWRhdGUgJSBpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhZGROZXh0UHJpbWUocHJpbWVDYW5kaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByaW1lcy5wdXNoKHByaW1lQ2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJpbWVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbW9kID0gY3VycmVudEZhY3RvciAlIHByaW1lc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaGlnaGVzdEZhY3RvciA9PT0gMCAmJiBtb2QgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdEZhY3RvciA9IGN1cnJlbnRGYWN0b3IgLyBwcmltZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1lRmFjdG9ycy5wdXNoKHByaW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmRQcmltZUZhY3RvcnMoY3VycmVudEZhY3RvciAvIHByaW1lc1tpXSwgaGlnaGVzdEZhY3RvciwgcHJpbWVGYWN0b3JzKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJpbWVzW2ldIDw9IGhpZ2hlc3RGYWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IHByaW1lcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGROZXh0UHJpbWUocHJpbWVzW3ByaW1lcy5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWVGYWN0b3JzLnB1c2gocHJpbWVzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5kUHJpbWVGYWN0b3JzKGN1cnJlbnRGYWN0b3IgLyBwcmltZXNbaV0sIGhpZ2hlc3RGYWN0b3IsIHByaW1lRmFjdG9ycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhpZ2hlc3RGYWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW1lRmFjdG9ycztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmYWN0b3JzID0gZmluZFByaW1lRmFjdG9ycyhpbnB1dCk7XHJcbiAgICAgICAgY29uc3QgcHJpbWVDb3VudCA9IGZhY3RvcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb21iaW5lZEZhY3RvciA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJpbWVDb3VudCAtIDE7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgcHJpbWVDb3VudDsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tYmluZWRGYWN0b3IgPSAoaiA9PT0gaSArIDEpID8gZmFjdG9yc1tpXSAqIGZhY3RvcnNbal0gOiBjb21iaW5lZEZhY3RvciAqIGZhY3RvcnNbal07XHJcblxyXG4gICAgICAgICAgICAgICAgZmFjdG9ycy5wdXNoKGZhY3RvcnNbaV0gKiBmYWN0b3JzW2pdKTtcclxuICAgICAgICAgICAgICAgIGZhY3RvcnMucHVzaChjb21iaW5lZEZhY3Rvcik7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZmFjdG9ycy5wdXNoKDEpO1xyXG4gICAgICAgIHJldHVybiBmYWN0b3JzLnNvcnQoKGEsIGIpID0+IGEgLSBiKS5maWx0ZXIoKHZhbHVlLCBpbmRleCwgYXJyYXkpID0+IGluZGV4ID09PSBhcnJheS5pbmRleE9mKHZhbHVlKSk7XHJcblxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvbiBjb21tb24gZmFjdG9yc1xyXG5cclxuICAgIGNvbnN0IHhGYWN0b3JzID0gZmluZEFsbEZhY3RvcnMoY2FudmFzRWxlbWVudC53aWR0aCk7XHJcbiAgICBjb25zdCB5RmFjdG9ycyA9IGZpbmRBbGxGYWN0b3JzKGNhbnZhc0VsZW1lbnQuaGVpZ2h0KTtcclxuICAgIGNvbnN0IGNvbW1vbkZhY3RvcnMgPSB4RmFjdG9ycy5maWx0ZXIoZmFjdG9yID0+IHlGYWN0b3JzLmluY2x1ZGVzKGZhY3RvcikpO1xyXG5cclxuICAgIGNvbW1vbkZhY3RvcnNcclxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYSAtIGIpXHJcbiAgICAgICAgLmZvckVhY2goKHNpemUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IHNpemUudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IHN0cjtcclxuICAgICAgICAgICAgb3B0aW9uLnRleHQgPSBzdHI7XHJcblxyXG4gICAgICAgICAgICBwaXhlbFNpemVTZWxlY3Rpb24uYWRkKG9wdGlvbik7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgLy8jZW5kcmVnaW9uIGluaXQgcGl4ZWwgc2l6ZXNcclxuXHJcbiAgICAvLyNyZWdpb24gY29sb3IgaW52ZXJzaW9uXHJcbiAgICAvL3NvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU5Njk2NTYvaG93LWNhbi1pLWdlbmVyYXRlLXRoZS1vcHBvc2l0ZS1jb2xvci1hY2NvcmRpbmctdG8tY3VycmVudC1jb2xvclxyXG4gICAgY29uc3QgaW52ZXJ0Q29sb3IgPSAoaGV4OiBzdHJpbmcsIGJ3OiBib29sZWFuKTogc3RyaW5nID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcGFkWmVybyA9IChzdHI6IHN0cmluZywgbGVuID0gMCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZW4gPSBsZW4gfHwgMjtcclxuICAgICAgICAgICAgY29uc3QgemVyb3MgPSBuZXcgQXJyYXkobGVuKS5qb2luKCcwJyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKHplcm9zICsgc3RyKS5zbGljZSgtbGVuKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGhleC5pbmRleE9mKCcjJykgPT09IDApIHtcclxuICAgICAgICAgICAgaGV4ID0gaGV4LnNsaWNlKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY29udmVydCAzLWRpZ2l0IGhleCB0byA2LWRpZ2l0cy5cclxuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA9PT0gMykge1xyXG4gICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaGV4Lmxlbmd0aCAhPT0gNikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSEVYIGNvbG9yLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgciA9IHBhcnNlSW50KGhleC5zbGljZSgwLCAyKSwgMTYpLFxyXG4gICAgICAgICAgICBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDIsIDQpLCAxNiksXHJcbiAgICAgICAgICAgIGIgPSBwYXJzZUludChoZXguc2xpY2UoNCwgNiksIDE2KTtcclxuXHJcbiAgICAgICAgaWYgKGJ3KSB7XHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5NDMwMjMvMTEyNzMxXHJcbiAgICAgICAgICAgIHJldHVybiAociAqIDAuMjk5ICsgZyAqIDAuNTg3ICsgYiAqIDAuMTE0KSA+IDE4NlxyXG4gICAgICAgICAgICAgICAgPyAnIzAwMDAwMCdcclxuICAgICAgICAgICAgICAgIDogJyNGRkZGRkYnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaW52ZXJ0IGNvbG9yIGNvbXBvbmVudHNcclxuICAgICAgICBjb25zdCBpbnZlcnRlZFIgPSAoMjU1IC0gcikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgIGNvbnN0IGludmVydGVkRyA9ICgyNTUgLSBnKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgY29uc3QgaW52ZXJ0ZWRCID0gKDI1NSAtIGIpLnRvU3RyaW5nKDE2KTtcclxuXHJcbiAgICAgICAgLy8gcGFkIGVhY2ggd2l0aCB6ZXJvcyBhbmQgcmV0dXJuXHJcbiAgICAgICAgcmV0dXJuIFwiI1wiICsgcGFkWmVybyhpbnZlcnRlZFIpICsgcGFkWmVybyhpbnZlcnRlZEcpICsgcGFkWmVybyhpbnZlcnRlZEIpO1xyXG5cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb24gY29sb3IgaW52ZXJzaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIG1vdXNlIHBvc2l0aW9uXHJcbiAgICAvLyBjb25zdCBtb3VzZVBvcyA9IHtcclxuICAgIC8vICAgICB4OiAwLCB5OiAwLFxyXG4gICAgLy8gICAgIGxhc3RYOiAwLCBsYXN0WTogMCxcclxuICAgIC8vICAgICBpc0RyYXdpbmc6IGZhbHNlXHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vc291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80Mzg1MzExOS9qYXZhc2NyaXB0LXdyb25nLW1vdXNlLXBvc2l0aW9uLXdoZW4tZHJhd2luZy1vbi1jYW52YXNcclxuICAgIC8vIGNvbnN0IHNldE1vdXNlUG9zaXRpb24gPSAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgYm91bmRzID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vICAgICAvLyBnZXQgdGhlIG1vdXNlIGNvb3JkaW5hdGVzLCBzdWJ0cmFjdCB0aGUgY2FudmFzIHRvcCBsZWZ0IGFuZCBhbnkgc2Nyb2xsaW5nXHJcbiAgICAvLyAgICAgbW91c2VQb3MueCA9IGV2ZW50LnBhZ2VYIC0gYm91bmRzLmxlZnQgLSBzY3JvbGxYO1xyXG4gICAgLy8gICAgIG1vdXNlUG9zLnkgPSBldmVudC5wYWdlWSAtIGJvdW5kcy50b3AgLSBzY3JvbGxZO1xyXG5cclxuICAgIC8vICAgICAvL2ZpcnN0IG5vcm1hbGl6ZSB0aGUgbW91c2UgY29vcmRpbmF0ZXMgZnJvbSAwIHRvIDEgKDAsMCkgdG9wIGxlZnRcclxuICAgIC8vICAgICBtb3VzZVBvcy54IC89IGJvdW5kcy53aWR0aDtcclxuICAgIC8vICAgICBtb3VzZVBvcy55IC89IGJvdW5kcy5oZWlnaHQ7XHJcblxyXG4gICAgLy8gICAgIC8vIHRoZW4gc2NhbGUgdG8gY2FudmFzIGNvb3JkaW5hdGVzIGJ5IG11bHRpcGx5aW5nIHRoZSBub3JtYWxpemVkIGNvb3JkcyB3aXRoIHRoZSBjYW52YXMgcmVzb2x1dGlvblxyXG4gICAgLy8gICAgIG1vdXNlUG9zLnggKj0gY2FudmFzLndpZHRoO1xyXG4gICAgLy8gICAgIG1vdXNlUG9zLnkgKj0gY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAvLyAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xyXG5cclxuICAgIC8vICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IFwibW91c2Vkb3duXCIgJiYgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk/LmlkID09PSBjYW52YXNJZClcclxuICAgIC8vICAgICAgICAgICAgIG1vdXNlUG9zLmlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgIGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09IFwibW91c2V1cFwiKVxyXG4gICAgLy8gICAgICAgICAgICAgbW91c2VQb3MuaXNEcmF3aW5nID0gZmFsc2U7XHJcblxyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyB9O1xyXG4gICAgLy8jZW5kcmVnaW9uIG1vdXNlIHBvc2l0aW9uXHJcblxyXG4gICAgY29uc3QgZ2V0TW91c2VQb3NpdGlvbk9uQ2FudmFzID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogVHdvRFZlY3RvciA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IGNhbnZhc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgbW91c2UgY29vcmRpbmF0ZXMsIHN1YnRyYWN0IHRoZSBjYW52YXMgdG9wIGxlZnQgYW5kIGFueSBzY3JvbGxpbmdcclxuICAgICAgICBsZXQgeCA9IGV2ZW50LnBhZ2VYIC0gYm91bmRzLmxlZnQgLSBzY3JvbGxYO1xyXG4gICAgICAgIGxldCB5ID0gZXZlbnQucGFnZVkgLSBib3VuZHMudG9wIC0gc2Nyb2xsWTtcclxuXHJcbiAgICAgICAgLy9maXJzdCBub3JtYWxpemUgdGhlIG1vdXNlIGNvb3JkaW5hdGVzIGZyb20gMCB0byAxICgwLDApIHRvcCBsZWZ0XHJcbiAgICAgICAgeCAvPSBib3VuZHMud2lkdGg7XHJcbiAgICAgICAgeSAvPSBib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyB0aGVuIHNjYWxlIHRvIGNhbnZhcyBjb29yZGluYXRlcyBieSBtdWx0aXBseWluZyB0aGUgbm9ybWFsaXplZCBjb29yZHMgd2l0aCB0aGUgY2FudmFzIHJlc29sdXRpb25cclxuICAgICAgICB4ICo9IGNhbnZhc0VsZW1lbnQud2lkdGg7XHJcbiAgICAgICAgeSAqPSBjYW52YXNFbGVtZW50LmhlaWdodDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvLyNyZWdpb24gcGl4ZWwgbWFuaXB1bGF0aW9uXHJcbiAgICBjb25zdCBzZXRQaXhlbCA9IGFzeW5jICh4OiBudW1iZXIsIHk6IG51bWJlciwgY29sb3I/OiBzdHJpbmcsIGlzQ2xpY2tlZCA9IGZhbHNlKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblxyXG4gICAgICAgIGlmICh4ID49IGNhbnZhc0VsZW1lbnQud2lkdGggfHwgeCA8IDAgfHwgeSA+PSBjYW52YXNFbGVtZW50LmhlaWdodCB8fCB5IDwgMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb2xvciA9IGNvbG9yID8/IChhd2FpdCBpcGNSZW5kZXJlci5pbnZva2U8Q29sb3JNYXA+KFwiZ2V0LWNvbG9yTWFwXCIpKVsxXTtcclxuXHJcbiAgICAgICAgY29uc3QgcGl4ZWxTaXplID0gc2V0dGluZ3MuZ2V0UGl4ZWxTaXplKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHhQaXhlbCA9IHBpeGVsU2l6ZSAqIE1hdGgudHJ1bmMoeCAvIHBpeGVsU2l6ZSk7XHJcbiAgICAgICAgY29uc3QgeVBpeGVsID0gcGl4ZWxTaXplICogTWF0aC50cnVuYyh5IC8gcGl4ZWxTaXplKTtcclxuXHJcbiAgICAgICAgaWYgKHBpeGVsU2l6ZSA+IDQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3Iuc3RhcnRzV2l0aChcIiNcIikgPyBpbnZlcnRDb2xvcihjb2xvciwgZmFsc2UpIDogXCJibGFja1wiO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCh4UGl4ZWwsIHlQaXhlbCwgcGl4ZWxTaXplLCBwaXhlbFNpemUpOyAvL2ZpbGwgZm9yIGJvcmRlclxyXG5cclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeFBpeGVsICsgMiwgeVBpeGVsICsgMiwgcGl4ZWxTaXplIC0gMiwgcGl4ZWxTaXplIC0gMik7IC8vZmlsbCBmb3IgdGhlIGFjdHVsIHNxdWFyZVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeFBpeGVsLCB5UGl4ZWwsIHBpeGVsU2l6ZSwgcGl4ZWxTaXplKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNDbGlja2VkKSB7XHJcblxyXG4gICAgICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwic2V0LXBpeGVsXCIsIHtcclxuICAgICAgICAgICAgICAgIHg6IHhQaXhlbCAvIHBpeGVsU2l6ZSxcclxuICAgICAgICAgICAgICAgIHk6IHlQaXhlbCAvIHBpeGVsU2l6ZVxyXG4gICAgICAgICAgICB9IGFzIFR3b0RWZWN0b3IpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjbGVhclBpeGVsID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmICh4ID49IGNhbnZhc0VsZW1lbnQud2lkdGggfHwgeCA8IDAgfHwgeSA+PSBjYW52YXNFbGVtZW50LmhlaWdodCB8fCB5IDwgMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBwaXhlbFNpemUgPSBzZXR0aW5ncy5nZXRQaXhlbFNpemUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeFBpeGVsID0gcGl4ZWxTaXplICogTWF0aC50cnVuYyh4IC8gcGl4ZWxTaXplKTtcclxuICAgICAgICBjb25zdCB5UGl4ZWwgPSBwaXhlbFNpemUgKiBNYXRoLnRydW5jKHkgLyBwaXhlbFNpemUpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCh4UGl4ZWwsIHlQaXhlbCwgcGl4ZWxTaXplLCBwaXhlbFNpemUpO1xyXG5cclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiY2xlYXItcGl4ZWxcIiwge1xyXG4gICAgICAgICAgICB4OiB4UGl4ZWwgLyBwaXhlbFNpemUsXHJcbiAgICAgICAgICAgIHk6IHlQaXhlbCAvIHBpeGVsU2l6ZVxyXG4gICAgICAgIH0gYXMgVHdvRFZlY3Rvcik7XHJcblxyXG4gICAgfTtcclxuICAgIC8vI2VuZHJlZ2lvbiBwaXhlbCBtYW5pcHVsYXRpb25cclxuXHJcbiAgICBjb25zdCBnZXROZXh0U3RhdGUgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IGF3YWl0IGlwY1JlbmRlcmVyLmludm9rZShcImdldC1uZXh0U3RhdGVcIikgYXMgU3RhdGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXh0U3RhdGUuZGF0YTtcclxuICAgICAgICBjb25zdCBtYXAgPSBuZXh0U3RhdGUubWFwO1xyXG4gICAgICAgIGNvbnN0IHBpeGVsU2l6ZSA9IHNldHRpbmdzLmdldFBpeGVsU2l6ZSgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNFbGVtZW50LndpZHRoLCBjYW52YXNFbGVtZW50LmhlaWdodCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgZGF0YS5sZW5ndGg7IHkrKykge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBkYXRhWzBdLmxlbmd0aDsgeCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9wdWxhdGlvbiA9IGRhdGFbeV1beF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBvcHVsYXRpb24gIT0gMCAmJiAoc2V0dGluZ3MuZ2V0U2hvdWxkVHJhY2UoKSB8fCBwb3B1bGF0aW9uICE9IG5leHRTdGF0ZS50cmFjZU51bWJlcikpXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2V0UGl4ZWwoeCAqIHBpeGVsU2l6ZSwgeSAqIHBpeGVsU2l6ZSwgbWFwW3BvcHVsYXRpb25dKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR0aW5ncy5hZGRHZW5lcmF0aW9uKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAvLyNyZWdpb24gYW5pbWF0aW9uXHJcbiAgICBsZXQgbGFzdEZyYW1lVGltZTogbnVtYmVyO1xyXG4gICAgbGV0IGFuaW1hdGlvbkhhbmRsZTogbnVtYmVyO1xyXG4gICAgbGV0IGlzUGxheWluZzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdCBhbmltYXRlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBlbGFwc2VkID0gRGF0ZS5ub3coKSAtIGxhc3RGcmFtZVRpbWU7XHJcblxyXG4gICAgICAgIGlmIChlbGFwc2VkID4gc2V0dGluZ3MuZ2V0RnBzSW5NcygpKSB7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBnZXROZXh0U3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGxhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFuaW1hdGlvbkhhbmRsZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0QW5pbWF0aW9uID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG5cclxuICAgICAgICBpZiAoIWlzUGxheWluZykge1xyXG5cclxuICAgICAgICAgICAgbGFzdEZyYW1lVGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgIGlzUGxheWluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBhbmltYXRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBhdXNlQW5pbWF0aW9uID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25IYW5kbGUpO1xyXG5cclxuICAgIH07XHJcbiAgICAvLyNlbmRyZWdpb24gYW5pbWF0aW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIGZyZWUgZm9ybSBkcmF3XHJcbiAgICAvL3NvdXJjZTogaHR0cDovL3Jvc2V0dGFjb2RlLm9yZy93aWtpL0JpdG1hcC9CcmVzZW5oYW0lMjdzX2xpbmVfYWxnb3JpdGhtI0phdmFTY3JpcHRcclxuICAgIC8vIGNvbnN0IGxpbmUgPSAoeDA6IG51bWJlciwgeTA6IG51bWJlciwgeDE6IG51bWJlciwgeTE6IG51bWJlcik6IHZvaWQgPT4ge1xyXG5cclxuICAgIC8vICAgICB4MCA9IE1hdGgudHJ1bmMoeDApLCB5MCA9IE1hdGgudHJ1bmMoeTApLCB4MSA9IE1hdGgudHJ1bmMoeDEpLCB5MSA9IE1hdGgudHJ1bmMoeTEpO1xyXG4gICAgLy8gICAgIGNvbnN0IGR4ID0gTWF0aC5hYnMoeDEgLSB4MCksIHN4ID0geDAgPCB4MSA/IDEgOiAtMTtcclxuICAgIC8vICAgICBjb25zdCBkeSA9IE1hdGguYWJzKHkxIC0geTApLCBzeSA9IHkwIDwgeTEgPyAxIDogLTE7XHJcbiAgICAvLyAgICAgbGV0IGVyciA9IChkeCA+IGR5ID8gZHggOiAtZHkpIC8gMjtcclxuXHJcbiAgICAvLyAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxyXG4gICAgLy8gICAgIHdoaWxlICh0cnVlKSB7XHJcblxyXG4gICAgLy8gICAgICAgICBzZXRQaXhlbCh4MCwgeTApO1xyXG5cclxuICAgIC8vICAgICAgICAgaWYgKHgwID09PSB4MSAmJiB5MCA9PT0geTEpXHJcbiAgICAvLyAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGUyID0gZXJyO1xyXG5cclxuICAgIC8vICAgICAgICAgaWYgKGUyID4gLWR4KSB7XHJcbiAgICAvLyAgICAgICAgICAgICBlcnIgLT0gZHk7XHJcbiAgICAvLyAgICAgICAgICAgICB4MCArPSBzeDtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgaWYgKGUyIDwgZHkpIHtcclxuICAgIC8vICAgICAgICAgICAgIGVyciArPSBkeDtcclxuICAgIC8vICAgICAgICAgICAgIHkwICs9IHN5O1xyXG4gICAgLy8gICAgICAgICB9XHJcblxyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyB9O1xyXG5cclxuICAgIC8vIGNvbnN0IGRyYXcgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgLy8gICAgIGlmIChtb3VzZVBvcy5pc0RyYXdpbmcpIHtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vZHJhd2luZyB3aXRoIGEgc2luZ2xlIHBpeGVsXHJcbiAgICAvLyAgICAgICAgIGlmIChtb3VzZVBvcy5sYXN0WCA9PT0gbW91c2VQb3MueCAmJiBtb3VzZVBvcy5sYXN0WSA9PT0gbW91c2VQb3MueSkge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIHNldFBpeGVsKG1vdXNlUG9zLngsIG1vdXNlUG9zLnkpO1xyXG4gICAgLy8gICAgICAgICAgICAgLy8gY29uc3QgeCA9IG1vdXNlUG9zLng7XHJcbiAgICAvLyAgICAgICAgICAgICAvLyBjb25zdCB5ID0gbW91c2VQb3MueTtcclxuICAgIC8vICAgICAgICAgICAgIC8vIGNvbnN0IGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpO1xyXG4gICAgLy8gICAgICAgICAgICAgLy8gY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIC8vIGNvbnN0IHIgPSBkYXRhWzBdO1xyXG4gICAgLy8gICAgICAgICAgICAgLy8gY29uc3QgZyA9IGRhdGFbMV07XHJcbiAgICAvLyAgICAgICAgICAgICAvLyBjb25zdCBiID0gZGF0YVsyXTtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBpZiAociAhPSAwIHx8IGcgIT0gMCB8fCBiICE9IDApXHJcbiAgICAvLyAgICAgICAgICAgICAvLyAgICAgY2xlYXJQaXhlbCh4LCB5KTtcclxuICAgIC8vICAgICAgICAgICAgIC8vIGVsc2VcclxuICAgIC8vICAgICAgICAgICAgIC8vICAgICBzZXRQaXhlbCh4LCB5KTtcclxuXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgZWxzZSAvL2RyYXdpbmcgd2hlbiBtb3ZpbmcgbW91c2VcclxuICAgIC8vICAgICAgICAgICAgIGxpbmUobW91c2VQb3MubGFzdFgsIG1vdXNlUG9zLmxhc3RZLCBtb3VzZVBvcy54LCBtb3VzZVBvcy55KTtcclxuXHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICBtb3VzZVBvcy5sYXN0WCA9IG1vdXNlUG9zLng7XHJcbiAgICAvLyAgICAgbW91c2VQb3MubGFzdFkgPSBtb3VzZVBvcy55O1xyXG5cclxuICAgIC8vICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcblxyXG4gICAgLy8gfTtcclxuICAgIC8vI2VuZHJlZ2lvbiBmcmVlIGZvcm0gZHJhd1xyXG5cclxuICAgIGNvbnN0IGNsZWFyQ2FudmFzID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhc0VsZW1lbnQud2lkdGgsIGNhbnZhc0VsZW1lbnQuaGVpZ2h0KTtcclxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKFwiY2xlYXItY2FudmFzXCIpO1xyXG4gICAgICAgIHNldHRpbmdzLnJlc2V0R2VuZXJhdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjbGlja2VkID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5idXR0b24gPT09IDAgJiZcclxuICAgICAgICAgICAgZXZlbnQudHlwZSA9PT0gXCJjbGlja1wiICYmXHJcbiAgICAgICAgICAgIChldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpPy5pZCA9PT0gY2FudmFzSWQpIHtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbW91c2VQb3MgPSBnZXRNb3VzZVBvc2l0aW9uT25DYW52YXMoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IG1vdXNlUG9zLng7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gbW91c2VQb3MueTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlRGF0YSA9IGNvbnRleHQuZ2V0SW1hZ2VEYXRhKHgsIHksIDEsIDEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZyA9IGRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gZGF0YVsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAociAhPSAwIHx8IGcgIT0gMCB8fCBiICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJQaXhlbCh4LCB5KTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZXRQaXhlbCh4LCB5LCBudWxsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBjYW52YXMgPSB7XHJcblxyXG4gICAgICAgIGlzUGxheWluZzogKCgpOiBib29sZWFuID0+IGlzUGxheWluZykoKSxcclxuICAgICAgICBjbGVhckNhbnZhczogY2xlYXJDYW52YXMsXHJcbiAgICAgICAgZ2V0TmV4dFN0YXRlOiBnZXROZXh0U3RhdGUsXHJcbiAgICAgICAgc3RhcnRBbmltYXRpb246IHN0YXJ0QW5pbWF0aW9uLFxyXG4gICAgICAgIHBhdXNlQW5pbWF0aW9uOiBwYXVzZUFuaW1hdGlvbixcclxuICAgICAgICBjbGlja2VkOiBjbGlja2VkXHJcblxyXG4gICAgfTtcclxuXHJcbn07Il19