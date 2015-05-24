/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../topojson.d.ts"/>
/// <reference path="./readerService.ts"/>
/// <reference path="../models/country.d.ts"/>
module LeDragon.Framework.Map.Services {
	import topoJsonObject = TopoJSON.TopoJSONObject;
	export interface IcountriesReader {
		get110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
		get50m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
		get10m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
		
		getEurope110m:() => Q.IPromise<TopoJSON.TopoJSONObject>;
	}

	export class countriesReaderService extends readerService implements IcountriesReader {
		private _110m = './src/data/countries-110m.topo.json';
		
		get110m(): Q.IPromise<topoJsonObject> {
			return super.read(this._110m);
		}
		
		get50m(): Q.IPromise<topoJsonObject> {
			var defered = Q.defer<topoJsonObject>();
			return defered.promise;
		}

		get10m(): Q.IPromise<topoJsonObject> {
			var defered = Q.defer<topoJsonObject>();
			return defered.promise;
		}
		
		getEurope110m(): Q.IPromise<TopoJSON.TopoJSONObject>{
			var defered = Q.defer<topoJsonObject>();
			super.read(this._110m).then((countries: topoJsonObject) => {
//				var objects: interfaces.country = countries.objects;
				console.log(countries);				
				var europe = countries;
				defered.resolve(europe);
			});
			return defered.promise;
			
		}
		
		

	}
}