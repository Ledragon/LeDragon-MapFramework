/// <reference path="../src/topojson.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../src/models/country.d.ts" />
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
        private d3;
        private _group;
        private _countriesGroup;
        private _positionsGroup;
        private _projection;
        private _pathGenerator;
        private _countries;
        private _geoCountries;
        private _positions;
        constructor(container: any, logger: Utilities.Ilogger, d3: D3.Base);
        drawCountries(countries: TopoJSON.TopoJSONObject): void;
        addPosition(longitude: number, latitude: number, color?: string): void;
        centerOnPosition(longitude: number, latitude: number): void;
        private handle(method, message);
    }
}
declare module LeDragon.Framework.Map.Services {
    interface IreaderService {
        read: (fileName: string) => Q.IPromise<any>;
    }
    class readerService implements IreaderService {
        private logger;
        private d3;
        constructor(logger: Utilities.Ilogger, d3: D3.Base);
        read(fileName: string): Q.IPromise<any>;
    }
}
declare module LeDragon.Framework.Map.Services {
    import topoJsonObject = TopoJSON.TopoJSONObject;
    interface IcountriesReader {
        get110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
        get50m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
        get10m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
        getEurope110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
    }
    class countriesReaderService extends readerService implements IcountriesReader {
        private _110m;
        get110m(): Q.IPromise<topoJsonObject>;
        get50m(): Q.IPromise<topoJsonObject>;
        get10m(): Q.IPromise<topoJsonObject>;
        getEurope110m(): Q.IPromise<TopoJSON.TopoJSONObject>;
    }
}
