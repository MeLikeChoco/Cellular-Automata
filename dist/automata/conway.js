"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conway = void 0;
const baseAutomaton_1 = require("./baseAutomaton");
class Conway extends baseAutomaton_1.BaseAutomaton {
    constructor(dimensions, options, customOptions) {
        super(dimensions, options, customOptions);
        this.shouldWrapKey = "shouldWrap";
        this.getCurrentState = () => {
            return {
                data: this.buffer,
                map: this.getColorMap(),
                traceNumber: -1
            };
        };
        this.getNextState = () => {
            //#region without wrap around
            const getNearbyPopulationNoWrap = (x, y) => {
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
            const wrap = (number, max) => ((number % max) + max) % max;
            const getNearbyPopulationWrap = (x, y) => {
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
            const shouldWrap = this.getCustomOption(this.shouldWrapKey);
            for (let y = 0; y < dimensions.y; y++) {
                for (let x = 0; x < dimensions.x; x++) {
                    const ogPop = this._buffer[y][x];
                    const numOfLiveCellsNearby = shouldWrap ? getNearbyPopulationWrap(x, y) : getNearbyPopulationNoWrap(x, y);
                    let newPop;
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
        this.id = "conway";
        this.name = "Conway";
        this.getColorMap = () => {
            return {
                "-1": "#696969",
                1: "#FFFFFF" //white
            };
        };
    }
    toString() {
        const indexOfY = (buffer, index, condition, indexCalc) => {
            if (index < 0 || index >= buffer.length)
                return -1;
            if (condition(buffer[index]))
                return index;
            return indexOfY(buffer, indexCalc(index), condition, indexCalc);
        };
        const indexOfX = (buffer, condition, indexCalc) => {
            let smallest = buffer[0].indexOf(this.pop);
            for (let i = 1; i < buffer.length; i++) {
                const index = indexCalc(buffer[i]);
                if (condition(smallest, index))
                    smallest = index;
            }
            return smallest;
        };
        const firstY = indexOfY(this._buffer, 0, (array) => array.findIndex((value) => value != this.noPop) != -1, (index) => index + 1);
        const lastY = indexOfY(this._buffer, this._buffer.length - 1, (array) => array.findIndex((value) => value != this.noPop) != -1, (index) => index - 1);
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
exports.Conway = Conway;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ud2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2F1dG9tYXRhL2NvbndheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBZ0Q7QUFFaEQsTUFBYSxNQUFPLFNBQVEsNkJBQWE7SUFJckMsWUFBWSxVQUFzQixFQUFFLE9BQXlCLEVBQUUsYUFBcUM7UUFDaEcsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFIdEMsa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFNckMsb0JBQWUsR0FBRyxHQUFVLEVBQUU7WUFFMUIsT0FBTztnQkFDSCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ2pCLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUN2QixXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQ2xCLENBQUM7UUFFTixDQUFDLENBQUM7UUFFRixpQkFBWSxHQUFHLEdBQVUsRUFBRTtZQUV2Qiw2QkFBNkI7WUFDN0IsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQVUsRUFBRTtnQkFFL0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7Z0JBRXZCLFVBQVU7Z0JBQ1YsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDaEUsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLEtBQUs7Z0JBQ0wsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLGNBQWMsRUFBRSxDQUFDO2dCQUVyQixXQUFXO2dCQUNYLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQy9ELGNBQWMsRUFBRSxDQUFDO2dCQUVyQixPQUFPO2dCQUNQLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyQyxjQUFjLEVBQUUsQ0FBQztnQkFFckIsY0FBYztnQkFDZCxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUM5RCxjQUFjLEVBQUUsQ0FBQztnQkFFckIsUUFBUTtnQkFDUixJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckMsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDL0QsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLE1BQU07Z0JBQ04sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUMzQyxjQUFjLEVBQUUsQ0FBQztnQkFFckIsT0FBTyxjQUFjLENBQUM7WUFFMUIsQ0FBQyxDQUFDO1lBQ0YsNEJBQTRCO1lBRTVCLHFCQUFxQjtZQUNyQixNQUFNLElBQUksR0FBRyxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBRW5GLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFVLEVBQUU7Z0JBRTdELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUNqQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDcEMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO2dCQUV2QixVQUFVO2dCQUNWLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDeEQsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLEtBQUs7Z0JBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDeEMsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLFdBQVc7Z0JBQ1gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUN4RCxjQUFjLEVBQUUsQ0FBQztnQkFFckIsT0FBTztnQkFDUCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUN4QyxjQUFjLEVBQUUsQ0FBQztnQkFFckIsY0FBYztnQkFDZCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ3hELGNBQWMsRUFBRSxDQUFDO2dCQUVyQixRQUFRO2dCQUNSLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ3hDLGNBQWMsRUFBRSxDQUFDO2dCQUVyQixhQUFhO2dCQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDeEQsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLE1BQU07Z0JBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDeEMsY0FBYyxFQUFFLENBQUM7Z0JBRXJCLE9BQU8sY0FBYyxDQUFDO1lBRTFCLENBQUMsQ0FBQztZQUNGLHdCQUF3QjtZQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBVSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFckUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBRW5DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUVuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzFHLElBQUksTUFBYyxDQUFDO29CQUVuQixJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLHFCQUFxQjt3QkFDbEQsTUFBTSxHQUFHLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUM3QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUscUJBQXFCO3dCQUN2QyxNQUFNLEdBQUcsQ0FBQyxvQkFBb0IsS0FBSyxDQUFDLElBQUksb0JBQW9CLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVoRixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQzt3QkFDMUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUVoQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2lCQUU3QjthQUVKO1lBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFFMUIsT0FBTztnQkFDSCxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3ZCLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDbEIsQ0FBQztRQUVOLENBQUMsQ0FBQztRQUVGLE9BQUUsR0FBcUIsUUFBUSxDQUFDO1FBQ2hDLFNBQUksR0FBZ0MsUUFBUSxDQUFDO1FBRTdDLGdCQUFXLEdBQUcsR0FBYSxFQUFFO1lBRXpCLE9BQU87Z0JBQ0gsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxPQUFPO2FBQ3ZCLENBQUM7UUFFTixDQUFDLENBQUE7SUExSkQsQ0FBQztJQTRKRCxRQUFRO1FBRUosTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFrQixFQUFFLEtBQWEsRUFBRSxTQUF1QyxFQUFFLFNBQW9DLEVBQVUsRUFBRTtZQUUxSSxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNO2dCQUNuQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRWQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QixPQUFPLEtBQUssQ0FBQztZQUVqQixPQUFPLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVwRSxDQUFDLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQWtCLEVBQUUsU0FBcUQsRUFBRSxTQUFzQyxFQUFVLEVBQUU7WUFFM0ksSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBRXBDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFbkMsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztvQkFDMUIsUUFBUSxHQUFHLEtBQUssQ0FBQzthQUV4QjtZQUVELE9BQU8sUUFBUSxDQUFDO1FBRXBCLENBQUMsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FDbkIsSUFBSSxDQUFDLE9BQU8sRUFDWixDQUFDLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ2hFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUN2QixDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUNsQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDdkIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ2hFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUN2QixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVoSCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFYixLQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBRWxDLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFO2dCQUNoQyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRWhELEdBQUcsSUFBSSxJQUFJLENBQUM7U0FFZjtRQUVELE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRXRCLENBQUM7Q0FFSjtBQWpPRCx3QkFpT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlQXV0b21hdG9uIH0gZnJvbSBcIi4vYmFzZUF1dG9tYXRvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbndheSBleHRlbmRzIEJhc2VBdXRvbWF0b24ge1xyXG5cclxuICAgIHByaXZhdGUgc2hvdWxkV3JhcEtleSA9IFwic2hvdWxkV3JhcFwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRpbWVuc2lvbnM6IFR3b0RWZWN0b3IsIG9wdGlvbnM6IEF1dG9tYXRvbk9wdGlvbnMsIGN1c3RvbU9wdGlvbnM6IEN1c3RvbUF1dG9tYXRvbk9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihkaW1lbnNpb25zLCBvcHRpb25zLCBjdXN0b21PcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDdXJyZW50U3RhdGUgPSAoKTogU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmJ1ZmZlcixcclxuICAgICAgICAgICAgbWFwOiB0aGlzLmdldENvbG9yTWFwKCksXHJcbiAgICAgICAgICAgIHRyYWNlTnVtYmVyOiAtMVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBnZXROZXh0U3RhdGUgPSAoKTogU3RhdGUgPT4ge1xyXG5cclxuICAgICAgICAvLyNyZWdpb24gd2l0aG91dCB3cmFwIGFyb3VuZFxyXG4gICAgICAgIGNvbnN0IGdldE5lYXJieVBvcHVsYXRpb25Ob1dyYXAgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWF4WSA9IHRoaXMuX2J1ZmZlci5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBjb25zdCBtYXhYID0gdGhpcy5fYnVmZmVyWzBdLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVW5kZXJNaW5ZID0geSAtIDEgPCAwO1xyXG4gICAgICAgICAgICBjb25zdCBpc1VuZGVyTWluWCA9IHggLSAxIDwgMDtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWF4WSA9IHkgKyAxID4gbWF4WTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWF4WCA9IHggKyAxID4gbWF4WDtcclxuICAgICAgICAgICAgbGV0IG51bU9mTGl2ZUNlbGxzID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vdG9wIGxlZnRcclxuICAgICAgICAgICAgaWYgKCFpc1VuZGVyTWluWSAmJiAhaXNVbmRlck1pblggJiYgdGhpcy5fYnVmZmVyW3kgLSAxXVt4IC0gMV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy90b3BcclxuICAgICAgICAgICAgaWYgKCFpc1VuZGVyTWluWSAmJiB0aGlzLl9idWZmZXJbeSAtIDFdW3hdKVxyXG4gICAgICAgICAgICAgICAgbnVtT2ZMaXZlQ2VsbHMrKztcclxuXHJcbiAgICAgICAgICAgIC8vdG9wIHJpZ2h0XHJcbiAgICAgICAgICAgIGlmICghaXNVbmRlck1pblkgJiYgIWlzT3Zlck1heFggJiYgdGhpcy5fYnVmZmVyW3kgLSAxXVt4ICsgMV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9yaWdodFxyXG4gICAgICAgICAgICBpZiAoIWlzT3Zlck1heFggJiYgdGhpcy5fYnVmZmVyW3ldW3ggKyAxXSlcclxuICAgICAgICAgICAgICAgIG51bU9mTGl2ZUNlbGxzKys7XHJcblxyXG4gICAgICAgICAgICAvL2JvdHRvbSByaWdodFxyXG4gICAgICAgICAgICBpZiAoIWlzT3Zlck1heFkgJiYgIWlzT3Zlck1heFggJiYgdGhpcy5fYnVmZmVyW3kgKyAxXVt4ICsgMV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9ib3R0b21cclxuICAgICAgICAgICAgaWYgKCFpc092ZXJNYXhZICYmIHRoaXMuX2J1ZmZlclt5ICsgMV1beF0pXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9ib3R0b20gbGVmdFxyXG4gICAgICAgICAgICBpZiAoIWlzT3Zlck1heFkgJiYgIWlzVW5kZXJNaW5YICYmIHRoaXMuX2J1ZmZlclt5ICsgMV1beCAtIDFdID09PSAxKVxyXG4gICAgICAgICAgICAgICAgbnVtT2ZMaXZlQ2VsbHMrKztcclxuXHJcbiAgICAgICAgICAgIC8vbGVmdFxyXG4gICAgICAgICAgICBpZiAoIWlzT3Zlck1heFggJiYgdGhpcy5fYnVmZmVyW3ldW3ggLSAxXSA9PT0gMSlcclxuICAgICAgICAgICAgICAgIG51bU9mTGl2ZUNlbGxzKys7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVtT2ZMaXZlQ2VsbHM7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uIGVuZCB3cmFwIGFyb3VuZFxyXG5cclxuICAgICAgICAvLyNyZWdpb24gd3JhcCBhcm91bmRcclxuICAgICAgICBjb25zdCB3cmFwID0gKG51bWJlcjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciA9PiAoKG51bWJlciAlIG1heCkgKyBtYXgpICUgbWF4O1xyXG5cclxuICAgICAgICBjb25zdCBnZXROZWFyYnlQb3B1bGF0aW9uV3JhcCA9ICh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXhZID0gdGhpcy5fYnVmZmVyLmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgbWF4WCA9IHRoaXMuX2J1ZmZlclswXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBudW1PZkxpdmVDZWxscyA9IDA7XHJcblxyXG4gICAgICAgICAgICAvL3RvcCBsZWZ0XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9idWZmZXJbd3JhcCh5IC0gMSwgbWF4WSldW3dyYXAoeCAtIDEsIG1heFgpXSA9PT0gMSlcclxuICAgICAgICAgICAgICAgIG51bU9mTGl2ZUNlbGxzKys7XHJcblxyXG4gICAgICAgICAgICAvL3RvcFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyW3dyYXAoeSAtIDEsIG1heFkpXVt4XSA9PT0gMSlcclxuICAgICAgICAgICAgICAgIG51bU9mTGl2ZUNlbGxzKys7XHJcblxyXG4gICAgICAgICAgICAvL3RvcCByaWdodFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyW3dyYXAoeSAtIDEsIG1heFkpXVt3cmFwKHggKyAxLCBtYXhYKV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9yaWdodFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyW3ldW3dyYXAoeCArIDEsIG1heFgpXSA9PT0gMSlcclxuICAgICAgICAgICAgICAgIG51bU9mTGl2ZUNlbGxzKys7XHJcblxyXG4gICAgICAgICAgICAvL2JvdHRvbSByaWdodFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyW3dyYXAoeSArIDEsIG1heFkpXVt3cmFwKHggKyAxLCBtYXhYKV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9ib3R0b21cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2J1ZmZlclt3cmFwKHkgKyAxLCBtYXhZKV1beF0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9ib3R0b20gbGVmdFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyW3dyYXAoeSArIDEsIG1heFkpXVt3cmFwKHggLSAxLCBtYXhYKV0gPT09IDEpXHJcbiAgICAgICAgICAgICAgICBudW1PZkxpdmVDZWxscysrO1xyXG5cclxuICAgICAgICAgICAgLy9sZWZ0XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9idWZmZXJbeV1bd3JhcCh4IC0gMSwgbWF4WCldID09PSAxKVxyXG4gICAgICAgICAgICAgICAgbnVtT2ZMaXZlQ2VsbHMrKztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudW1PZkxpdmVDZWxscztcclxuXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyNlbmRyZWdpb24gd3JhcCBhcm91bmRcclxuXHJcbiAgICAgICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcclxuICAgICAgICBjb25zdCBuZXh0QnVmZmVyID0gdGhpcy5nZW5FbXB0eUFycmF5KGRpbWVuc2lvbnMpO1xyXG4gICAgICAgIGNvbnN0IHNob3VsZFdyYXAgPSB0aGlzLmdldEN1c3RvbU9wdGlvbjxib29sZWFuPih0aGlzLnNob3VsZFdyYXBLZXkpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGRpbWVuc2lvbnMueTsgeSsrKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGRpbWVuc2lvbnMueDsgeCsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2dQb3AgPSB0aGlzLl9idWZmZXJbeV1beF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBudW1PZkxpdmVDZWxsc05lYXJieSA9IHNob3VsZFdyYXAgPyBnZXROZWFyYnlQb3B1bGF0aW9uV3JhcCh4LCB5KSA6IGdldE5lYXJieVBvcHVsYXRpb25Ob1dyYXAoeCwgeSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3UG9wOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9nUG9wID09PSAwIHx8IG9nUG9wID09PSAtMSkgLy9pZiB0aGUgY2VsbCBpcyBkZWFkXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9wID0gKG51bU9mTGl2ZUNlbGxzTmVhcmJ5ID09PSAzKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAob2dQb3AgPT09IDEpIC8vaWYgdGhlIGNlbGwgaXMgbGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1BvcCA9IChudW1PZkxpdmVDZWxsc05lYXJieSA9PT0gMiB8fCBudW1PZkxpdmVDZWxsc05lYXJieSA9PT0gMykgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5zaG91bGRUcmFjZSAmJiBuZXdQb3AgPT09IDAgJiYgKG9nUG9wID09PSAtMSB8fCBvZ1BvcCA9PT0gMSkpXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9wID0gLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgbmV4dEJ1ZmZlclt5XVt4XSA9IG5ld1BvcDtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXh0QnVmZmVyO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkYXRhOiBuZXh0QnVmZmVyLFxyXG4gICAgICAgICAgICBtYXA6IHRoaXMuZ2V0Q29sb3JNYXAoKSxcclxuICAgICAgICAgICAgdHJhY2VOdW1iZXI6IC0xXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGlkOiBDZWxsdWxhckF1dG9tYXRhID0gXCJjb253YXlcIjtcclxuICAgIG5hbWU6IENlbGx1bGFyQXV0b21hdGFEaXNwbGF5TmFtZSA9IFwiQ29ud2F5XCI7XHJcblxyXG4gICAgZ2V0Q29sb3JNYXAgPSAoKTogQ29sb3JNYXAgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcIi0xXCI6IFwiIzY5Njk2OVwiLCAvL2RpbWdyZXlcclxuICAgICAgICAgICAgMTogXCIjRkZGRkZGXCIgLy93aGl0ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4T2ZZID0gKGJ1ZmZlcjogbnVtYmVyW11bXSwgaW5kZXg6IG51bWJlciwgY29uZGl0aW9uOiAoYXJyYXk6IG51bWJlcltdKSA9PiBib29sZWFuLCBpbmRleENhbGM6IChpbmRleDogbnVtYmVyKSA9PiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBidWZmZXIubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbihidWZmZXJbaW5kZXhdKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbmRleE9mWShidWZmZXIsIGluZGV4Q2FsYyhpbmRleCksIGNvbmRpdGlvbiwgaW5kZXhDYWxjKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhPZlggPSAoYnVmZmVyOiBudW1iZXJbXVtdLCBjb25kaXRpb246IChjdXJyZW50OiBudW1iZXIsIG5leHQ6IG51bWJlcikgPT4gYm9vbGVhbiwgaW5kZXhDYWxjOiAoYXJyYXk6IG51bWJlcltdKSA9PiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNtYWxsZXN0ID0gYnVmZmVyWzBdLmluZGV4T2YodGhpcy5wb3ApO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBidWZmZXIubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGluZGV4Q2FsYyhidWZmZXJbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb24oc21hbGxlc3QsIGluZGV4KSlcclxuICAgICAgICAgICAgICAgICAgICBzbWFsbGVzdCA9IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNtYWxsZXN0O1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFkgPSBpbmRleE9mWShcclxuICAgICAgICAgICAgdGhpcy5fYnVmZmVyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAoYXJyYXkpID0+IGFycmF5LmZpbmRJbmRleCgodmFsdWUpID0+IHZhbHVlICE9IHRoaXMubm9Qb3ApICE9IC0xLFxyXG4gICAgICAgICAgICAoaW5kZXgpID0+IGluZGV4ICsgMVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhc3RZID0gaW5kZXhPZlkoXHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlcixcclxuICAgICAgICAgICAgdGhpcy5fYnVmZmVyLmxlbmd0aCAtIDEsXHJcbiAgICAgICAgICAgIChhcnJheSkgPT4gYXJyYXkuZmluZEluZGV4KCh2YWx1ZSkgPT4gdmFsdWUgIT0gdGhpcy5ub1BvcCkgIT0gLTEsXHJcbiAgICAgICAgICAgIChpbmRleCkgPT4gaW5kZXggLSAxXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RYID0gaW5kZXhPZlgodGhpcy5fYnVmZmVyLCAoY3VycmVudCwgbmV4dCkgPT4gbmV4dCA8IGN1cnJlbnQsIChhcnJheSkgPT4gYXJyYXkuaW5kZXhPZih0aGlzLnBvcCkpO1xyXG4gICAgICAgIGNvbnN0IGxhc3RYID0gaW5kZXhPZlgodGhpcy5fYnVmZmVyLCAoY3VycmVudCwgbmV4dCkgPT4gbmV4dCA+IGN1cnJlbnQsIChhcnJheSkgPT4gYXJyYXkubGFzdEluZGV4T2YodGhpcy5wb3ApKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHkgPSBmaXJzdFk7IHkgPD0gbGFzdFk7IHkrKykge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IGZpcnN0WDsgeCA8PSBsYXN0WDsgeCsrKVxyXG4gICAgICAgICAgICAgICAgc3RyICs9IHRoaXMuX2J1ZmZlclt5XVt4XSA9PT0gMSA/IFwiT1wiIDogXCIuXCI7XHJcblxyXG4gICAgICAgICAgICBzdHIgKz0gXCJcXG5cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcclxuXHJcbiAgICB9XHJcblxyXG59Il19