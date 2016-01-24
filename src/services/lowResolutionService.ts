/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../models/topojson.d.ts" />
/// <reference path="IResolutionService.d.ts" />

module LeDragon.Framework.Map.Services {
    import topoJsonObject = TopoJSON.TopoJSONObject;
    export class lowResolutionService implements IResolutionService {
        private _resolution = '110m';

        constructor(private _d3: typeof d3, private _q: typeof Q) {

        }

        getAllCountries(): Q.Promise<topoJsonObject> {
            var defered = this._q.defer<topoJsonObject>();
            var path = `/data/${this._resolution}/countries.topo.json`;
            this._d3.json(path, (error, data) => {
                if (error) {
                    console.error(error);
                    defered.reject(error);
                } else {
                    defered.resolve(data);
                }
            });
            return defered.promise;
        }

        getCountry(adm: string): Q.IPromise<TopoJSON.country> {
            var defered = this._q.defer();
            this.getAllCountries()
                .then(data=> {
                    var country = _.find(data.objects.countries.geometries, c=> c.properties.adm0_a3 === adm);
                    data.objects.countries.geometries = [country];
                    defered.resolve(data);
                })
                .catch(reason=> defered.reject(reason));
            return defered.promise;

        }
    }
}