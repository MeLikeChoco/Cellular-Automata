let canvas: {
    isPlaying: boolean;
    clearCanvas: () => void;
    getNextState: () => Promise<void>;
    startAnimation: () => Promise<void>;
    pauseAnimation: () => void;
    clicked: (event: MouseEvent) => void;
};

const initCanvas = async (): Promise<void> => {

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
    const findAllFactors = (input: number): number[] => {

        // The more primes you add to this array the lower is the 
        // prohability for calculating new primes at runtime
        // (minimum primes in array: [2, 3, 5])
        const primes = [2, 3, 5, 7, 11, 13, 17, 19];

        // returns array of prime factorization
        const findPrimeFactors = (currentFactor: number, highestFactor = 0, primeFactors: number[] = []): number[] => {

            // Adds next prime to array "primes"
            const addNextPrime = (lastPrime: number): number => {
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

                } else {

                    if (primes[i] <= highestFactor) {
                        if (i === primes.length - 1) {
                            addNextPrime(primes[primes.length - 1]);
                        }
                        if (mod === 0) {
                            primeFactors.push(primes[i]);
                            return findPrimeFactors(currentFactor / primes[i], highestFactor, primeFactors);
                        }
                    } else if (highestFactor) {
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
    const invertColor = (hex: string, bw: boolean): string => {

        const padZero = (str: string, len = 0): string => {

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

        const r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);

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

    const getMousePositionOnCanvas = (event: MouseEvent): TwoDVector => {

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
    const setPixel = async (x: number, y: number, color?: string, isClicked = false): Promise<void> => {

        if (x >= canvasElement.width || x < 0 || y >= canvasElement.height || y < 0)
            return;

        color = color ?? (await ipcRenderer.invoke<ColorMap>("get-colorMap"))[1];

        const pixelSize = settings.getPixelSize();

        const xPixel = pixelSize * Math.trunc(x / pixelSize);
        const yPixel = pixelSize * Math.trunc(y / pixelSize);

        if (pixelSize > 4) {

            context.fillStyle = color.startsWith("#") ? invertColor(color, false) : "black";

            context.fillRect(xPixel, yPixel, pixelSize, pixelSize); //fill for border

            context.fillStyle = color;

            context.fillRect(xPixel + 2, yPixel + 2, pixelSize - 2, pixelSize - 2); //fill for the actul square

        } else {

            context.fillStyle = color;

            context.fillRect(xPixel, yPixel, pixelSize, pixelSize);

        }

        if (isClicked) {

            ipcRenderer.send("set-pixel", {
                x: xPixel / pixelSize,
                y: yPixel / pixelSize
            } as TwoDVector);

        }

    };

    const clearPixel = (x: number, y: number): void => {

        if (x >= canvasElement.width || x < 0 || y >= canvasElement.height || y < 0)
            return;

        const pixelSize = settings.getPixelSize();

        const xPixel = pixelSize * Math.trunc(x / pixelSize);
        const yPixel = pixelSize * Math.trunc(y / pixelSize);

        context.clearRect(xPixel, yPixel, pixelSize, pixelSize);

        ipcRenderer.send("clear-pixel", {
            x: xPixel / pixelSize,
            y: yPixel / pixelSize
        } as TwoDVector);

    };
    //#endregion pixel manipulation

    const getNextState = async (): Promise<void> => {

        const nextState = await ipcRenderer.invoke("get-nextState") as State;

        const data = nextState.data;
        const map = nextState.map;
        const pixelSize = settings.getPixelSize();

        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (let y = 0; y < data.length; y++) {

            for (let x = 0; x < data[0].length; x++) {

                const population = data[y][x];

                if (population != 0 && (settings.getShouldTrace() || population != nextState.traceNumber))
                    await setPixel(x * pixelSize, y * pixelSize, map[population]);

            }

        }

        settings.addGeneration();

    };

    //#region animation
    let lastFrameTime: number;
    let animationHandle: number;
    let isPlaying: boolean;

    const animate = async (): Promise<void> => {

        const elapsed = Date.now() - lastFrameTime;

        if (elapsed > settings.getFpsInMs()) {

            await getNextState();

            lastFrameTime = Date.now();

        }

        animationHandle = requestAnimationFrame(animate);

    };

    const startAnimation = async (): Promise<void> => {

        if (!isPlaying) {

            lastFrameTime = Date.now();
            isPlaying = true;

            await animate();

        }

    };

    const pauseAnimation = (): void => {

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

    const clearCanvas = (): void => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        ipcRenderer.send("clear-canvas");
        settings.resetGeneration();
    };

    const clicked = (event: MouseEvent): void => {

        if (event.button === 0 &&
            event.type === "click" &&
            (event.target as HTMLElement)?.id === canvasId) {

            requestAnimationFrame(async () => {

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
                    await setPixel(x, y, null, true);

            });

        }

    };

    canvas = {

        isPlaying: ((): boolean => isPlaying)(),
        clearCanvas: clearCanvas,
        getNextState: getNextState,
        startAnimation: startAnimation,
        pauseAnimation: pauseAnimation,
        clicked: clicked

    };

};