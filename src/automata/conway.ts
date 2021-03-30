import { BaseAutomaton } from "./baseAutomaton";

export class Conway extends BaseAutomaton {

    private shouldWrapKey = "shouldWrap";

    constructor(dimensions: TwoDVector, options: AutomatonOptions, customOptions: CustomAutomatonOptions) {
        super(dimensions, options, customOptions);
    }

    getCurrentState = (): State => {

        return {
            data: this.buffer,
            map: this.getColorMap(),
            traceNumber: -1
        };

    };

    getNextState = (): State => {

        //#region without wrap around
        const getNearbyPopulationNoWrap = (x: number, y: number): number => {

            const maxY = this._buffer.length - 1;
            const maxX = this._buffer[0].length - 1;
            const isUnderMinY = y - 1 < 0;
            const isUnderMinX = x - 1 < 0;
            const isOverMaxY = y + 1 > maxY;
            const isOverMaxX = x + 1 > maxX;
            let numOfLiveCells = 0;

            //top left
            if (!isUnderMinY && !isUnderMinX && this._buffer[y - 1][x - 1] === 1)
                numOfLiveCells++;

            //top
            if (!isUnderMinY && this._buffer[y - 1][x])
                numOfLiveCells++;

            //top right
            if (!isUnderMinY && !isOverMaxX && this._buffer[y - 1][x + 1] === 1)
                numOfLiveCells++;

            //right
            if (!isOverMaxX && this._buffer[y][x + 1])
                numOfLiveCells++;

            //bottom right
            if (!isOverMaxY && !isOverMaxX && this._buffer[y + 1][x + 1] === 1)
                numOfLiveCells++;

            //bottom
            if (!isOverMaxY && this._buffer[y + 1][x])
                numOfLiveCells++;

            //bottom left
            if (!isOverMaxY && !isUnderMinX && this._buffer[y + 1][x - 1] === 1)
                numOfLiveCells++;

            //left
            if (!isOverMaxX && this._buffer[y][x - 1] === 1)
                numOfLiveCells++;

            return numOfLiveCells;

        };
        //#endregion end wrap around

        //#region wrap around
        const wrap = (number: number, max: number): number => ((number % max) + max) % max;

        const getNearbyPopulationWrap = (x: number, y: number): number => {

            const maxY = this._buffer.length;
            const maxX = this._buffer[0].length;
            let numOfLiveCells = 0;

            //top left
            if (this._buffer[wrap(y - 1, maxY)][wrap(x - 1, maxX)] === 1)
                numOfLiveCells++;

            //top
            if (this._buffer[wrap(y - 1, maxY)][x] === 1)
                numOfLiveCells++;

            //top right
            if (this._buffer[wrap(y - 1, maxY)][wrap(x + 1, maxX)] === 1)
                numOfLiveCells++;

            //right
            if (this._buffer[y][wrap(x + 1, maxX)] === 1)
                numOfLiveCells++;

            //bottom right
            if (this._buffer[wrap(y + 1, maxY)][wrap(x + 1, maxX)] === 1)
                numOfLiveCells++;

            //bottom
            if (this._buffer[wrap(y + 1, maxY)][x] === 1)
                numOfLiveCells++;

            //bottom left
            if (this._buffer[wrap(y + 1, maxY)][wrap(x - 1, maxX)] === 1)
                numOfLiveCells++;

            //left
            if (this._buffer[y][wrap(x - 1, maxX)] === 1)
                numOfLiveCells++;

            return numOfLiveCells;

        };
        //#endregion wrap around

        const dimensions = this.dimensions;
        const nextBuffer = this.genEmptyArray(dimensions);
        const shouldWrap = this.getCustomOption<boolean>(this.shouldWrapKey);

        for (let y = 0; y < dimensions.y; y++) {

            for (let x = 0; x < dimensions.x; x++) {

                const ogPop = this._buffer[y][x];
                const numOfLiveCellsNearby = shouldWrap ? getNearbyPopulationWrap(x, y) : getNearbyPopulationNoWrap(x, y);
                let newPop: number;

                if (ogPop === 0 || ogPop === -1) //if the cell is dead
                    newPop = (numOfLiveCellsNearby === 3) ? 1 : 0;
                else if (ogPop === 1) //if the cell is live
                    newPop = (numOfLiveCellsNearby === 2 || numOfLiveCellsNearby === 3) ? 1 : 0;

                if (this._options.shouldTrace && newPop === 0 && (ogPop === -1 || ogPop === 1))
                    newPop = -1;

                nextBuffer[y][x] = newPop;

            }

        }

        this._buffer = nextBuffer;

        return {
            data: nextBuffer,
            map: this.getColorMap(),
            traceNumber: -1
        };

    };

    id: CellularAutomata = "conway";
    name: CellularAutomataDisplayName = "Conway";

    getColorMap = (): ColorMap => {

        return {
            "-1": "#696969", //dimgrey
            1: "#FFFFFF" //white
        };

    }

    toString(): string {

        const indexOfY = (buffer: number[][], index: number, condition: (array: number[]) => boolean, indexCalc: (index: number) => number): number => {

            if (index < 0 || index >= buffer.length)
                return -1;

            if (condition(buffer[index]))
                return index;

            return indexOfY(buffer, indexCalc(index), condition, indexCalc);

        };

        const indexOfX = (buffer: number[][], condition: (current: number, next: number) => boolean, indexCalc: (array: number[]) => number): number => {

            let smallest = buffer[0].indexOf(this.pop);

            for (let i = 1; i < buffer.length; i++) {

                const index = indexCalc(buffer[i]);

                if (condition(smallest, index))
                    smallest = index;

            }

            return smallest;

        };

        const firstY = indexOfY(
            this._buffer,
            0,
            (array) => array.findIndex((value) => value != this.noPop) != -1,
            (index) => index + 1
        );

        const lastY = indexOfY(
            this._buffer,
            this._buffer.length - 1,
            (array) => array.findIndex((value) => value != this.noPop) != -1,
            (index) => index - 1
        );

        const firstX = indexOfX(this._buffer, (current, next) => next < current, (array) => array.indexOf(this.pop));
        const lastX = indexOfX(this._buffer, (current, next) => next > current, (array) => array.lastIndexOf(this.pop));

        let str = "";

        for (let y = firstY; y <= lastY; y++) {

            for (let x = firstX; x <= lastX; x++)
                str += this._buffer[y][x] === 1 ? "O" : ".";

            str += "\n";

        }

        return str.trim();

    }

}