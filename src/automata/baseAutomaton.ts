export abstract class BaseAutomaton implements Automaton {

    protected _options: AutomatonOptions;
    protected _customOptions: CustomAutomatonOptions;
    protected _buffer: number[][];
    protected _generation: number;

    protected constructor(dimensions: TwoDVector, options: AutomatonOptions, customOptions: CustomAutomatonOptions) {

        this._options = options;
        this._customOptions = customOptions;
        this._generation = 0;

        this.resize(dimensions);

    }

    protected get noPop(): number {
        return 0;
    }

    protected get pop(): number {
        return 1;
    }

    public get buffer(): number[][] {
        return this._buffer;
    }

    public get dimensions(): TwoDVector {
        return {
            x: this._buffer[0].length,
            y: this._buffer.length
        };
    }

    public get generation(): number {
        return this._generation;
    }

    public get options(): AutomatonOptions {
        return this._options;
    }

    public get customOptions(): CustomAutomatonOptions {
        return this._customOptions;
    }

    protected genEmptyArray = (dimensions: TwoDVector): number[][] => {

        this._generation = 0;

        return Array.from(
            Array<Array<number>>(dimensions.y),
            () => {

                const length = new Array<number>(dimensions.x);

                length.fill(0);

                return length;

            }
        );

    };

    abstract id: CellularAutomata;
    abstract name: CellularAutomataDisplayName;

    setCustomOption = (name: string, value: unknown): void => {

        if (Object.keys(this._customOptions).includes(name))
            this._customOptions[name] = value;

    };

    getCustomOption = <T>(name: string): T => {

        if (Object.keys(this._customOptions).includes(name))
            return this._customOptions[name] as T;

    }

    setPixel = (coord: TwoDVector, value?: number): void => {
        this._buffer[coord.y][coord.x] = value ?? 1;
    };

    clearPixel = (coord: TwoDVector): void => {
        this._buffer[coord.y][coord.x] = 0;
    }

    abstract getCurrentState = (): State => {
        throw new Error("Method is not implemented!");
    };

    abstract getNextState = (): State => {
        throw new Error("Method is not implemented!");
    };

    abstract getColorMap = (): ColorMap => {
        throw new Error("Method is not implemented!");
    }

    resize = (dimensions: TwoDVector): void => {
        this._buffer = this.genEmptyArray(dimensions);
    };

    clear = (): void => {

        this._buffer.forEach(length => {
            length.fill(0);
        });

    }

    isEmpty = (): boolean => this._buffer.every(length => length.every((pop) => pop === this.noPop));

    abstract toString(): string;

}