/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="../../typings/geojson/geojson.d.ts" />
/// <reference path="../topojson.d.ts" />
/// <reference path="../models/position.ts" />
/// <reference path="../utilities/logger.ts" />
/// <reference path="projection.ts" />
/// <reference path="projectionType.ts" />
module LeDragon.Framework.Map {
    import position = Models.position;
    export interface IworldMap {
        drawCountries: (countries: TopoJSON.TopoJSONObject) => void;
        addPosition: (longitude: number, latitude: number, color?: string) => void;
        zoomOnCountry: (countryName: string) => void;
        drawStates: (states: any, color?: string) => void;
    }

    export class map implements IworldMap {
        private _group: D3.Selection;
        private _countriesGroup: D3.Selection;
        private _positionsGroup: D3.Selection;
        private _statesGroup: D3.Selection;

        private _projection: D3.Geo.Projection;
        private _pathGenerator: D3.Geo.Path;
        private _countries: TopoJSON.TopoJSONObject;
        private _geoCountries: GeoJSON.FeatureCollection;
        private _positions: Array<position>;

        private width: number;
        private height: number;

        constructor(container: any, private logger: Utilities.Ilogger, private _d3: D3.Base) {
            this.init(container)
        }

        private init(container) {
            this.handle(() => {
                var c = this._d3.select(container);
                var width = c.node().clientWidth;
                var height = c.node().clientHeight;
                this.width = width;
                this.height = height;
                this._group = c
                    .append('svg')
                    .attr({
                        'width': width,
                        'height': height
                    })
                    .append('g')
                    .classed('map', true);
                //                d3.select(window).on('resize', () => {
                //                    console.log(c.node().clientWidth + '*' + c.node().clientHeight);
                //                });
                this._countriesGroup = this._group.append('g')
                    .classed('countries', true);
                this._statesGroup = this._group.append('g')
                    .classed('states', true);
                this._positionsGroup = this._group.append('g')
                    .classed('positions', true);

                this._projection = new projection(this._d3, projectionType.Orthographic, this.width, this.height)
                    .projection(); 
                // this._projection = this._d3.geo.mercator()
                //     .center([0, 0])
                //     .translate([width / 2, height / 2])
                //     .scale(width / 8);
                
                // this._projection = this._d3.geo.orthographic()
                //     .center([0, 0])
                //     .translate([width / 2, height / 2])
                //     .scale(width / 8);
                this._pathGenerator = this._d3.geo.path().projection(this._projection);

                this._positions = [];
            }, 'Initialization failed');
        }

        drawCountries(countries: TopoJSON.TopoJSONObject): void {
            this.handle(
                () => {
                    this.logger.debugFormat('Drawing map.');
                    this._countries = countries;
                    this._geoCountries = topojson.feature(countries, countries.objects.countries);
                    this._countriesGroup
                        .selectAll('path')
                        .data(this._geoCountries.features)
                        .enter()
                        .append('g')
                        .classed('country', true)
                        .attr('id', (d: any, i: any) => d.properties.adm0_a3)
                        .append('path')
                        .attr('d', (d: any, i: any) => this._pathGenerator(d))
                        .classed('normal', true);
                    this.logger.debugFormat('Map drawn.');

                },
                'Drawing of map failed.'
            );
        }

        drawStates(states: any, color?: string) {
            this.logger.debugFormat(states);
            var selection = this._statesGroup
                .selectAll('path')
                .data(states);
            selection.enter()
                .append('path');
            selection.attr('d', (d: any, i: any) => this._pathGenerator(d));
            if (color) {
                selection.attr('fill', color);
            }
            selection.exit().remove();
        }

        addPosition(longitude: number, latitude: number, color?: string): void {
            this.handle(() => {
                this.logger.debugFormat(`Adding position (${longitude}, ${latitude}).`);
                var p = new position(longitude, latitude);
                p.color = color;
                this._positions.push(p);
                var projected = this._projection([longitude, latitude]);
                var circle = this._positionsGroup.append('circle')
                    .attr({
                        'r': 2,
                        'cx': projected[0],
                        'cy': projected[1]
                    });
                if (color) {
                    circle.attr('fill', color);
                }
                this.logger.debugFormat('Position added.');
            }, 'Addition of position failed');
        }

        centerOnPosition(longitude: number, latitude: number) {
            this.handle(() => {
                this._projection.center([longitude, latitude]).scale(8000);
                this._countriesGroup
                    .selectAll('path')
                    .data(this._geoCountries.features)
                    .transition()
                    .attr('d', (d: any) => {
                        var result = this._pathGenerator(d);
                        return result;
                    });
                this._positionsGroup
                    .selectAll('circle')
                    .data(this._positions)
                    .transition()
                    .attr({
                        'cx': (d: any, i: any) => this._projection([d.longitude, d.latitude])[0],
                        'cy': (d: any, i: any) => this._projection([d.longitude, d.latitude])[1],
                        'r': '2'
                    });
            }, 'Centering on position failed.');
        }

        zoomOnCountry(countryName: string): void {
            var country = _.find(this._geoCountries.features,
                c=> c.properties.name.toLowerCase() === countryName.toLowerCase());
            if (!country) {
                this.logger.errorFormat(`No country with name ${0} found.`);
            }
            else {
                var c = this.getCentering(country, this._pathGenerator);
            }
        }

        private getCentering(d, pathGenerator: D3.Geo.Path) {
            var bounds = pathGenerator.bounds(d);
            var dx = bounds[1][0] - bounds[0][0];
            var dy = bounds[1][1] - bounds[0][1];
            var x = (bounds[0][0] + bounds[1][0]) / 2;
            var y = (bounds[0][1] + bounds[1][1]) / 2;
            var scale = .9 / Math.max(dx / this.width, dy / this.height);
            var translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];
            return {
                scale: scale,
                translate: translate
            };
        }

        private handle(method: any, message: string) {
            try {
                method();
            } catch (e) {
                this.logger.errorFormat(message);
                this.logger.errorFormat(e.message);
                this.logger.errorFormat(e.stack);
            }
        }
    }
}