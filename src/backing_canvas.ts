export const backingCanvas = ((): {
    setAlgorithm: (input: CellularAutomataDisplayName) => void;
    getShouldWrap: () => boolean;
    setShouldWrap: (input: boolean) => void;
    setShouldTrace: (input: boolean) => void;
    getNextState: (state: number[][]) => State;
    getAlgorithmColorMap: (input?: CellularAutomataDisplayName) => ColorMap;
} => {

    let cellularAutomaton: CellularAutomataDisplayName = "Conway";
    let shouldWrap = true;
    let shouldTrace = true;

    const getAlgorithmColorMap = (input?: CellularAutomataDisplayName): ColorMap => {

        if (input === undefined || input === null)
            input = cellularAutomaton;

        switch (input) {

            case "Conway":
                return {
                    "-1": "#696969", //dimgrey
                    1: "#FFFFFF" //white
                };
            default:
                throw "Invalid automaton!";

        }

    };

    return {

        setAlgorithm: (input: CellularAutomataDisplayName): void => {
            cellularAutomaton = input;
        },
        getShouldWrap: (): boolean => shouldWrap,
        setShouldWrap: (input: boolean): void => {
            shouldWrap = input;
        },
        setShouldTrace: (input: boolean): void => {
            shouldTrace = input;
        },
        getNextState: (state: number[][]): State => {

            const genEmptyArray = (x: number, y: number): number[][] => {

                const array = Array.from(Array<Array<number>>(y), () => new Array<number>(x));

                array.forEach((line) => line.fill(0));

                return array;

            };

            const conway = (state: number[][]): State => {

                //#region without wrap around
                const getNearbyPopulationNoWrap = (x: number, y: number): number => {

                    const maxY = state.length - 1;
                    const maxX = state[0].length - 1;
                    const isUnderMinY = y - 1 < 0;
                    const isUnderMinX = x - 1 < 0;
                    const isOverMaxY = y + 1 > maxY;
                    const isOverMaxX = x + 1 > maxX;
                    let numOfLiveCells = 0;

                    //top left
                    if (!isUnderMinY && !isUnderMinX && state[y - 1][x - 1] === 1)
                        numOfLiveCells++;

                    //top
                    if (!isUnderMinY && state[y - 1][x])
                        numOfLiveCells++;

                    //top right
                    if (!isUnderMinY && !isOverMaxX && state[y - 1][x + 1] === 1)
                        numOfLiveCells++;

                    //right
                    if (!isOverMaxX && state[y][x + 1])
                        numOfLiveCells++;

                    //bottom right
                    if (!isOverMaxY && !isOverMaxX && state[y + 1][x + 1] === 1)
                        numOfLiveCells++;

                    //bottom
                    if (!isOverMaxY && state[y + 1][x])
                        numOfLiveCells++;

                    //bottom left
                    if (!isOverMaxY && !isUnderMinX && state[y + 1][x - 1] === 1)
                        numOfLiveCells++;

                    //left
                    if (!isOverMaxX && state[y][x - 1] === 1)
                        numOfLiveCells++;

                    return numOfLiveCells;

                };
                //#endregion end wrap around

                //#region wrap around
                const wrap = (number: number, max: number): number => ((number % max) + max) % max;

                const getNearbyPopulationWrap = (x: number, y: number): number => {

                    const maxY = state.length;
                    const maxX = state[0].length;
                    let numOfLiveCells = 0;

                    //top left
                    if (state[wrap(y - 1, maxY)][wrap(x - 1, maxX)] === 1)
                        numOfLiveCells++;

                    //top
                    if (state[wrap(y - 1, maxY)][x] === 1)
                        numOfLiveCells++;

                    //top right
                    if (state[wrap(y - 1, maxY)][wrap(x + 1, maxX)] === 1)
                        numOfLiveCells++;

                    //right
                    if (state[y][wrap(x + 1, maxX)] === 1)
                        numOfLiveCells++;

                    //bottom right
                    if (state[wrap(y + 1, maxY)][wrap(x + 1, maxX)] === 1)
                        numOfLiveCells++;

                    //bottom
                    if (state[wrap(y + 1, maxY)][x] === 1)
                        numOfLiveCells++;

                    //bottom left
                    if (state[wrap(y + 1, maxY)][wrap(x - 1, maxX)] === 1)
                        numOfLiveCells++;

                    //left
                    if (state[y][wrap(x - 1, maxX)] === 1)
                        numOfLiveCells++;

                    return numOfLiveCells;

                };
                //#endregion wrap around

                const nextState = genEmptyArray(state[0].length, state.length);

                for (let y = 0; y < state.length; y++) {

                    for (let x = 0; x < state[0].length; x++) {

                        const ogPop = state[y][x];
                        const numOfLiveCellsNearby = shouldWrap ? getNearbyPopulationWrap(x, y) : getNearbyPopulationNoWrap(x, y);
                        let newPop: number;

                        if (ogPop === 0 || ogPop === -1) //if the cell is dead
                            newPop = (numOfLiveCellsNearby === 3) ? 1 : 0;
                        else if (ogPop === 1) //if the cell is live
                            newPop = (numOfLiveCellsNearby === 2 || numOfLiveCellsNearby === 3) ? 1 : 0;

                        if (shouldTrace && newPop === 0 && (ogPop === -1 || ogPop === 1))
                            newPop = -1;

                        nextState[y][x] = newPop;

                    }

                }

                const stateDataMap: State = {
                    data: nextState,
                    map: getAlgorithmColorMap("Conway"),
                    traceNumber: shouldTrace ? -1 : null
                };

                return stateDataMap;

            };

            switch (cellularAutomaton) {

                case "Conway":
                default:
                    return conway(state);

            }

        },
        getAlgorithmColorMap: getAlgorithmColorMap

    };

})();