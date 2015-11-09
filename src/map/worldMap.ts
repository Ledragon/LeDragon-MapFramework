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
        private _group: d3.Selection<any>;
        private _countriesGroup: d3.Selection<any>;
        private _positionsGroup: d3.Selection<any>;
        private _statesGroup: d3.Selection<any>;

        private _projection: d3.geo.Projection;
        private _pathGenerator: d3.geo.Path;
        private _countries: TopoJSON.TopoJSONObject;
        private _geoCountries: GeoJSON.FeatureCollection;
        private _positions: Array<position>;

        private _scale;

        private width: number;
        private height: number;

        constructor(container: any, private logger: Utilities.Ilogger, private _d3: any) {
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
                    .append('g')
                    .classed('map', true);
                this._countriesGroup = this._group.append('g')
                    .classed('countries', true);
                this._statesGroup = this._group.append('g')
                    .classed('states', true);
                this._positionsGroup = this._group.append('g')
                    .classed('positions', true);

                this._positions = [];
                this.setSize(c);

                (<d3.Selection<any>>this._d3.select(window)).on('resize', (d, i) => {
                    this.setSize(c);
                });
            }, 'Initialization failed');
        }

        private setSize(container: any) {
            var width = container.node().clientWidth;
            var height = container.node().clientHeight;
            container.select('svg').attr({
                'width': width,
                'height': height
            });
            this.logger.debugFormat(`width: ${width}, height:${height}`);
            this._projection = new projection(this._d3, projectionType.Orthographic, width, height)
                .projection();
                // .scale(this._scale?this._scale:width/2);
            this._pathGenerator = this._d3.geo.path().projection(this._projection);
            if (this._countries) {
                var dataSelection = this.selectCountries();
                this.updateCountries(dataSelection);
            }
            if (this._positions) {
                this.updatePositions(this.selectPositions());
            }
        }

        drawCountries(countries: TopoJSON.TopoJSONObject): void {
            this.handle(
                () => {
                    this.logger.debugFormat(`Drawing countries.`);
                    this._countries = countries;
                    this._geoCountries = topojson.feature(countries, countries.objects.countries);

                    var dataSelection = this.selectCountries();
                    this.appendCountries(dataSelection);
                    this.updateCountries(dataSelection);
                    this.deleteCountries(dataSelection);

                    this.logger.debugFormat('Countries drawn.');
                },
                'Drawing of map failed.'
            );
        }

        private selectCountries(): d3.selection.Update<GeoJSON.Feature> {
            var dataSelection = this._countriesGroup
                .selectAll('.country')
                .data(this._geoCountries.features);
            return dataSelection;
        }

        private appendCountries(selection: d3.selection.Update<GeoJSON.Feature>) {
            selection.enter()
                .append('g')
                .classed('country', true)
                .append('path')
                .classed('normal', true);
        }

        private updateCountries(selection: d3.Selection<GeoJSON.Feature>) {
            selection.select('.country')
                .attr('id', (d: any, i: any) => d.properties.adm0_a3)
            selection.select('path')
                .attr('d', (d: any, i: any) => this._pathGenerator(d));
        }

        private deleteCountries(selection: d3.selection.Update<GeoJSON.Feature>) {
            selection.exit().remove();
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
                var dataSelection = this.selectPositions();
                dataSelection.enter()
                    .append('circle')
                    .attr({
                        'r': 2
                    });
                this.updatePositions(dataSelection);
                this.logger.debugFormat('Position added.');
            }, 'Addition of position failed');
        }

        private selectPositions(): d3.selection.Update<position> {
            var dataSelection = this._positionsGroup.selectAll('circle')
                .data(this._positions);
            return dataSelection;
        }

        private updatePositions(selection: d3.selection.Update<position>) {
            selection
                .attr({
                    'cx': (d: position) => this._projection([d.longitude, d.latitude])[0],
                    'cy': (d: position) => this._projection([d.longitude, d.latitude])[1],
                    'r': 2
                })
                .style({
                    'fill': d=> d.color ? d.color : 'black'
                });
        }

        centerOnPosition(longitude: number, latitude: number) {
            this.handle(() => {
                this._scale = 8000;
                this._projection.center([longitude, latitude]).scale(this._scale);
                this._countriesGroup
                    .selectAll('path')
                    .data(this._geoCountries.features)
                    .transition()
                    .attr('d', (d: any) => {
                        var result = this._pathGenerator(d);
                        return result;
                    });
                this.updatePositions(this.selectPositions());
            }, 'Centering on position failed.');
        }

        zoomOnCountry(countryName: string): void {
            var country = _.find(this._geoCountries.features,
                c=> c.properties.name.toLowerCase() === countryName.toLowerCase());
            if (!country) {
                this.logger.errorFormat(`No country with name ${countryName} found.`);
            }
            else {
                var c = this.getCentering(country, this._pathGenerator);
            }
        }

        private getCentering(d, pathGenerator: d3.geo.Path) {
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