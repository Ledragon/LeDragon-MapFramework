/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="../typings/geojson/geojson.d.ts" />
/// <reference path="../src/topojson.d.ts" />
/// <reference path="../src/models/country.d.ts" />
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
        getStates10m: (country_adm0_a3?: string) => Q.IPromise<Array<GeoJSON.Feature>>;
        getEurope110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
    }
    class countriesReaderService extends readerService implements IcountriesReader {
        private _logger;
        private _d3;
        private _110m;
        private _states10mPath;
        private _states10m;
        constructor(_logger: Utilities.Ilogger, _d3: D3.Base);
        get110m(): Q.IPromise<topoJsonObject>;
        get50m(): Q.IPromise<topoJsonObject>;
        get10m(): Q.IPromise<topoJsonObject>;
        getEurope110m(): Q.IPromise<TopoJSON.TopoJSONObject>;
        getStates10m(country_adm0_a3?: string): Q.IPromise<Array<GeoJSON.Feature>>;
        private getStates(country_adm0_a3?);
    }
}
