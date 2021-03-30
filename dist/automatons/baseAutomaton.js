"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAutomaton = exports.CustomAutomatonOption = void 0;
class CustomAutomatonOption {
    constructor(name, value, additionalData = undefined) {
        this.name = name;
        this.value = value;
        this.additionalDataType = additionalData === undefined ?
            AdditionalDataType.NONE : (Array.isArray(additionalData) ? AdditionalDataType.ARRAY : AdditionalDataType.DICTIONARY);
        this.additionalData = additionalData;
    }
}
exports.CustomAutomatonOption = CustomAutomatonOption;
class BaseAutomaton {
    constructor(dimensions, options, customOptions) {
        this.genEmptyArray = (dimensions) => {
            this._generation = 0;
            return Array.from(Array(dimensions.y), () => {
                const length = new Array(dimensions.x);
                length.fill(0);
                return length;
            });
        };
        this.setCustomOption = (name, value) => {
            if (Object.keys(this._customOptions).includes(name))
                this._customOptions[name].value = value;
        };
        this.getCustomOption = (name) => {
            if (Object.keys(this._customOptions).includes(name))
                return this._customOptions[name].value;
        };
        this.setPixel = (coord, value) => {
            this._buffer[coord.y][coord.x] = value !== null && value !== void 0 ? value : 1;
        };
        this.clearPixel = (coord) => {
            this._buffer[coord.y][coord.x] = 0;
        };
        this.getCurrentState = () => {
            throw new Error("Method is not implemented!");
        };
        this.getNextState = () => {
            throw new Error("Method is not implemented!");
        };
        this.getColorMap = () => {
            throw new Error("Method is not implemented!");
        };
        this.resize = (dimensions) => {
            this._buffer = this.genEmptyArray(dimensions);
        };
        this.clear = () => {
            this._buffer.forEach(length => {
                length.fill(0);
            });
        };
        this.isEmpty = () => this._buffer.every(length => length.every((pop) => pop === this.noPop));
        this._options = options;
        this._customOptions = customOptions;
        this._generation = 0;
        this.resize(dimensions);
    }
    get noPop() {
        return 0;
    }
    get pop() {
        return 1;
    }
    get buffer() {
        return this._buffer;
    }
    get dimensions() {
        return {
            x: this._buffer[0].length,
            y: this._buffer.length
        };
    }
    get generation() {
        return this._generation;
    }
    get options() {
        return this._options;
    }
    get customOptions() {
        return this._customOptions;
    }
}
exports.BaseAutomaton = BaseAutomaton;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZUF1dG9tYXRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRvbWF0b25zL2Jhc2VBdXRvbWF0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxxQkFBcUI7SUFPOUIsWUFBWSxJQUFZLEVBQUUsS0FBYyxFQUFFLGlCQUEwQixTQUFTO1FBQ3pFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDcEQsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekgsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDekMsQ0FBQztDQUVKO0FBZkQsc0RBZUM7QUFFRCxNQUFzQixhQUFhO0lBTy9CLFlBQXNCLFVBQXNCLEVBQUUsT0FBeUIsRUFBRSxhQUFxQztRQXlDcEcsa0JBQWEsR0FBRyxDQUFDLFVBQXNCLEVBQWMsRUFBRTtZQUU3RCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUVyQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQ2IsS0FBSyxDQUFnQixVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQ2xDLEdBQUcsRUFBRTtnQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBUyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRS9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWYsT0FBTyxNQUFNLENBQUM7WUFFbEIsQ0FBQyxDQUNKLENBQUM7UUFFTixDQUFDLENBQUM7UUFJ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QU8sQ0FBQyxNQUFNO1NBQ3pCLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBVyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQy9CLENBQUM7Q0F5RUo7QUF2SEQsc0NBdUhDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEN1c3RvbUF1dG9tYXRvbk9wdGlvbiB7XHJcblxyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdmFsdWU6IHVua25vd247XHJcbiAgICBhZGRpdGlvbmFsRGF0YVR5cGU6IEFkZGl0aW9uYWxEYXRhVHlwZTtcclxuICAgIGFkZGl0aW9uYWxEYXRhOiB1bmtub3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHVua25vd24sIGFkZGl0aW9uYWxEYXRhOiB1bmtub3duID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5hZGRpdGlvbmFsRGF0YVR5cGUgPSBhZGRpdGlvbmFsRGF0YSA9PT0gdW5kZWZpbmVkID9cclxuICAgICAgICAgICAgQWRkaXRpb25hbERhdGFUeXBlLk5PTkUgOiAoQXJyYXkuaXNBcnJheShhZGRpdGlvbmFsRGF0YSkgPyBBZGRpdGlvbmFsRGF0YVR5cGUuQVJSQVkgOiBBZGRpdGlvbmFsRGF0YVR5cGUuRElDVElPTkFSWSk7XHJcbiAgICAgICAgdGhpcy5hZGRpdGlvbmFsRGF0YSA9IGFkZGl0aW9uYWxEYXRhO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VBdXRvbWF0b24gaW1wbGVtZW50cyBBdXRvbWF0b24ge1xyXG5cclxuICAgIHByb3RlY3RlZCBfb3B0aW9uczogQXV0b21hdG9uT3B0aW9ucztcclxuICAgIHByb3RlY3RlZCBfY3VzdG9tT3B0aW9uczogQ3VzdG9tQXV0b21hdG9uT3B0aW9ucztcclxuICAgIHByb3RlY3RlZCBfYnVmZmVyOiBudW1iZXJbXVtdO1xyXG4gICAgcHJvdGVjdGVkIF9nZW5lcmF0aW9uOiBudW1iZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGRpbWVuc2lvbnM6IFR3b0RWZWN0b3IsIG9wdGlvbnM6IEF1dG9tYXRvbk9wdGlvbnMsIGN1c3RvbU9wdGlvbnM6IEN1c3RvbUF1dG9tYXRvbk9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fY3VzdG9tT3B0aW9ucyA9IGN1c3RvbU9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplKGRpbWVuc2lvbnMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IG5vUG9wKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBwb3AoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGJ1ZmZlcigpOiBudW1iZXJbXVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZGltZW5zaW9ucygpOiBUd29EVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLl9idWZmZXJbMF0ubGVuZ3RoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLl9idWZmZXIubGVuZ3RoXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdlbmVyYXRpb24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9wdGlvbnMoKTogQXV0b21hdG9uT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjdXN0b21PcHRpb25zKCk6IEN1c3RvbUF1dG9tYXRvbk9wdGlvbnMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21PcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZW5FbXB0eUFycmF5ID0gKGRpbWVuc2lvbnM6IFR3b0RWZWN0b3IpOiBudW1iZXJbXVtdID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5fZ2VuZXJhdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxyXG4gICAgICAgICAgICBBcnJheTxBcnJheTxudW1iZXI+PihkaW1lbnNpb25zLnkpLFxyXG4gICAgICAgICAgICAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gbmV3IEFycmF5PG51bWJlcj4oZGltZW5zaW9ucy54KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZW5ndGguZmlsbCgwKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBhYnN0cmFjdCBnZXQgbmFtZSgpOiBDZWxsdWxhckF1dG9tYXRhO1xyXG5cclxuICAgIHNldEN1c3RvbU9wdGlvbiA9IChuYW1lOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9jdXN0b21PcHRpb25zKS5pbmNsdWRlcyhuYW1lKSlcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tT3B0aW9uc1tuYW1lXS52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgZ2V0Q3VzdG9tT3B0aW9uID0gPFQ+KG5hbWU6IHN0cmluZyk6IFQgPT4ge1xyXG5cclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fY3VzdG9tT3B0aW9ucykuaW5jbHVkZXMobmFtZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXN0b21PcHRpb25zW25hbWVdLnZhbHVlIGFzIFQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldFBpeGVsID0gKGNvb3JkOiBUd29EVmVjdG9yLCB2YWx1ZT86IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcltjb29yZC55XVtjb29yZC54XSA9IHZhbHVlID8/IDE7XHJcbiAgICB9O1xyXG5cclxuICAgIGNsZWFyUGl4ZWwgPSAoY29vcmQ6IFR3b0RWZWN0b3IpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLl9idWZmZXJbY29vcmQueV1bY29vcmQueF0gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGdldEN1cnJlbnRTdGF0ZSA9ICgpOiBTdGF0ZSA9PiB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIGlzIG5vdCBpbXBsZW1lbnRlZCFcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIGFic3RyYWN0IGdldE5leHRTdGF0ZSA9ICgpOiBTdGF0ZSA9PiB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIGlzIG5vdCBpbXBsZW1lbnRlZCFcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIGFic3RyYWN0IGdldENvbG9yTWFwID0gKCk6IENvbG9yTWFwID0+IHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2QgaXMgbm90IGltcGxlbWVudGVkIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemUgPSAoZGltZW5zaW9uczogVHdvRFZlY3Rvcik6IHZvaWQgPT4ge1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IHRoaXMuZ2VuRW1wdHlBcnJheShkaW1lbnNpb25zKTtcclxuICAgIH07XHJcblxyXG4gICAgY2xlYXIgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMuX2J1ZmZlci5mb3JFYWNoKGxlbmd0aCA9PiB7XHJcbiAgICAgICAgICAgIGxlbmd0aC5maWxsKDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpc0VtcHR5ID0gKCk6IGJvb2xlYW4gPT4gdGhpcy5fYnVmZmVyLmV2ZXJ5KGxlbmd0aCA9PiBsZW5ndGguZXZlcnkoKHBvcCkgPT4gcG9wID09PSB0aGlzLm5vUG9wKSk7XHJcblxyXG4gICAgYWJzdHJhY3QgdG9TdHJpbmcoKTogc3RyaW5nO1xyXG5cclxufSJdfQ==