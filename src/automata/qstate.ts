import { BaseAutomaton } from "./baseAutomaton";

export class QState extends BaseAutomaton {

    id: CellularAutomata = "q-state";
    name: CellularAutomataDisplayName = "Q-State";

    getCurrentState: () => State;
    getNextState: () => State;
    getColorMap: () => ColorMap;

    toString(): string {
        throw new Error("Method not implemented.");
    }

}