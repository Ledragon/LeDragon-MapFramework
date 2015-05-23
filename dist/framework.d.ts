/// <reference path="../src/topojson.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
declare module LeDragon.Framework.Map.Models {
    class position {
        constructor(longitude: number, latitude: number);
        longitude: number;
        latitude: number;
        color: string;
    }
}
declare module LeDragon.Framework.Utilities {
    interface Ilogger {
        debugFormat: (message: string) => void;
        infoFormat: (message: string) => void;
        warningFormat: (message: string) => void;
        errorFormat: (message: string) => void;
        fatalFormat: (message: string) => void;
    }
    class logger implements Ilogger {
        private console;
        constructor(console: Console);
        debugFormat(message: string): void;
        infoFormat(message: string): void;
        warningFormat(message: string): void;
        errorFormat(message: string): void;
        fatalFormat(message: string): void;
    }
}
declare module LeDragon.Framework.Map {
    interface IworldMap {
        drawCountries: (countries: TopoJSON.TopoJSONObject) => void;
        addPosition: (longitude: number, latitude: number, color?: string) => void;
    }
    class map implements IworldMap {
        private logger;
        private _group;
        private _countriesGroup;
        private _positionsGroup;
        private _projection;
        private _pathGenerator;
        private _countries;
        private _geoCountries;
        private _positions;
        constructor(container: any, logger: Utilities.Ilogger);
        drawCountries(countries: TopoJSON.TopoJSONObject): void;
        addPosition(longitude: number, latitude: number, color?: string): void;
        centerOnPosition(longitude: number, latitude: number): void;
        private handle(method, message);
    }
}
