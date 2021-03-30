"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QState = void 0;
const baseAutomaton_1 = require("./baseAutomaton");
class QState extends baseAutomaton_1.BaseAutomaton {
    constructor() {
        super(...arguments);
        this.id = "q-state";
        this.name = "Q-State";
    }
    toString() {
        throw new Error("Method not implemented.");
    }
}
exports.QState = QState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXN0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2F1dG9tYXRhL3FzdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBZ0Q7QUFFaEQsTUFBYSxNQUFPLFNBQVEsNkJBQWE7SUFBekM7O1FBRUksT0FBRSxHQUFxQixTQUFTLENBQUM7UUFDakMsU0FBSSxHQUFnQyxTQUFTLENBQUM7SUFVbEQsQ0FBQztJQUpHLFFBQVE7UUFDSixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUVKO0FBYkQsd0JBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlQXV0b21hdG9uIH0gZnJvbSBcIi4vYmFzZUF1dG9tYXRvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFFTdGF0ZSBleHRlbmRzIEJhc2VBdXRvbWF0b24ge1xyXG5cclxuICAgIGlkOiBDZWxsdWxhckF1dG9tYXRhID0gXCJxLXN0YXRlXCI7XHJcbiAgICBuYW1lOiBDZWxsdWxhckF1dG9tYXRhRGlzcGxheU5hbWUgPSBcIlEtU3RhdGVcIjtcclxuXHJcbiAgICBnZXRDdXJyZW50U3RhdGU6ICgpID0+IFN0YXRlO1xyXG4gICAgZ2V0TmV4dFN0YXRlOiAoKSA9PiBTdGF0ZTtcclxuICAgIGdldENvbG9yTWFwOiAoKSA9PiBDb2xvck1hcDtcclxuXHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG4gICAgfVxyXG5cclxufSJdfQ==