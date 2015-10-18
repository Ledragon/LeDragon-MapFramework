/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/geojson/geojson.d.ts" />
/// <reference path="../src/topojson.d.ts" />
declare module LeDragon.Framework.Map.Models {
    class position {
        constructor(longitude: number, latitude: number);
        longitude: number;
        latitude: number;
        color: string;
    }
}
declare module LeDragon.Framework.Map {
    enum projectionType {
        Mercator = 0,
        Orthographic = 1,
    }
}
declare module LeDragon.Framework.Map {
    interface Iprojection {
    }
    class projection {
        private _d3;
        private _projection;
        private _width;
        private _height;
        constructor(_d3: D3.Base, type: projectionType, width: number, height: number);
        projection(): D3.Geo.Projection;
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
        zoomOnCountry: (countryName: string) => void;
        drawStates: (states: any, color?: string) => void;
    }
    class map implements IworldMap {
        private logger;
        private _d3;
        private _group;
        private _countriesGroup;
        private _positionsGroup;
        private _statesGroup;
        private _projection;
        private _pathGenerator;
        private _countries;
        private _geoCountries;
        private _positions;
        private width;
        private height;
        constructor(container: any, logger: Utilities.Ilogger, _d3: D3.Base);
        private init(container);
        drawCountries(countries: TopoJSON.TopoJSONObject): void;
        drawStates(states: any, color?: string): void;
        addPosition(longitude: number, latitude: number, color?: string): void;
        centerOnPosition(longitude: number, latitude: number): void;
        zoomOnCountry(countryName: string): void;
        private getCentering(d, pathGenerator);
        private handle(method, message);
    }
}
