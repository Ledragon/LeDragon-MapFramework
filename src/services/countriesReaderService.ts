/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/Q/Q.d.ts" />
/// <reference path="../../typings/geojson/geojson.d.ts" />
/// <reference path="../models/topojson.d.ts" />
/// <reference path="../utilities/logger.ts" />
/// <reference path="../utilities/loggerFactory.ts" />
/// <reference path="./readerService.ts"/>
module LeDragon.Framework.Map.Services {
	import topoJsonObject = TopoJSON.TopoJSONObject;
	export interface IcountriesReader {
		get110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
		get50m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
		get10m: () => Q.IPromise<TopoJSON.TopoJSONObject>;

		getStates10m: (country_adm0_a3?: string) => Q.IPromise<Array<GeoJSON.Feature>>;

		getEurope110m: () => Q.IPromise<TopoJSON.TopoJSONObject>;
	}

	export class countriesReaderService extends readerService implements IcountriesReader {
		private _110m = '/data/110m/countries.topo.json';
		private _states10mPath = '/data/10m/states.topo.json';
		private _states10m: GeoJSON.FeatureCollection;
        private _logger: Utilities.Ilogger;
		constructor(private _d3: any) {
            super(_d3);
            this._logger = Utilities.loggerFactory.getLogger('countriesReaderService');
		}

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

		getEurope110m(): Q.IPromise<TopoJSON.TopoJSONObject> {
			var defered = Q.defer<topoJsonObject>();
			super.read(this._110m).then((countries: topoJsonObject) => {
				console.log(countries);
				var europe = countries;
				defered.resolve(europe);
			});
			return defered.promise;
		}

		getStates10m(country_adm0_a3?: string): Q.IPromise<Array<GeoJSON.Feature>> {
			var defered = Q.defer<Array<GeoJSON.Feature>>();
			if (!this._states10m) {
				this._logger.debugFormat('Reading states file.');
				d3.json(this._states10mPath, (error, data) => {
					if (error) {
						this._logger.errorFormat(error);
					} else {
						this._logger.debugFormat('Successfully read states.');
						var geo = topojson.feature(data, data.objects['states-provinces']);
						this._states10m = geo;
						defered.resolve(this.getStates(country_adm0_a3));
					}
				});
			} else {
				defered.resolve(this.getStates(country_adm0_a3));
			}
			return defered.promise;

		}

		private getStates(country_adm0_a3?: string): Array<GeoJSON.Feature> {
			var result = this._states10m.features;
			if (country_adm0_a3) {
				result = this._states10m.features.filter(f=> {
					return f.properties.adm0_a3 === country_adm0_a3;
				});
			}
			return result;
		}

	}
}