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
        private _borderGroup: d3.Selection<any>;

        private _projection: Iprojection;
        private _pathGenerator: d3.geo.Path;
        // private _countries: TopoJSON.TopoJSONObject;
        private _geoCountries: GeoJSON.FeatureCollection;
        private _positions: Array<position>;

        private _scale;

        private width: number;
        private height: number;
        private _ratio: number;

        constructor(container: any, private _logger: Utilities.Ilogger, private _d3: typeof d3) {
            this.init(container)
        }

        private init(container) {
            this.handle(() => {
                var c = this._d3.select(container);
                var svg = c
                    .append('svg');
                var gradient = svg
                    .append('defs')
                    .append('radialGradient')
                    .attr({
                        'id': 'grad',
                        'x1': '0%',
                        'x2': '0%',
                        'y1': '100%',
                        'y2': '0%'
                    });
                gradient.append('stop')
                    .attr('offset', '0%')
                    .style({
                        'stop-color': 'rgb(0,255,255)',
                        'stop-opacity': '1'
                    });
                gradient.append('stop')
                    .attr('offset', '100%')
                    .style({
                        'stop-color': 'rgb(0,0,255)',
                        'stop-opacity': '1'
                    });
                ;
                this._group = svg
                    .append('g')
                    .classed('map', true);

                this._borderGroup = this._group.append('g')
                    .classed('border', true);
                this._countriesGroup = this._group.append('g')
                    .classed('countries', true);
                this._statesGroup = this._group.append('g')
                    .classed('states', true);
                this._positionsGroup = this._group.append('g')
                    .classed('positions', true);

                this._geoCountries = {
                    features: [],
                    bbox: <any>{},
                    crs: <any>{},
                    type: ''
                };
                this._positions = [];
                this._ratio = 1;
                this._projection = new projection(this._d3, projectionType.Orthographic, 1, 1);
                this._borderGroup.append('circle')
                    .style('fill', 'url(#grad)');

                this._pathGenerator = (<d3.geo.Path>this._d3.geo.path()).projection(this._projection.projection());
                this.setSize(c);

                (<d3.Selection<any>>this._d3.select(window))
                    .on('resize', (d, i) => {
                        this.setSize(c);
                    });
            }, 'Initialization failed');
        }

        private setSize(container: d3.Selection<any>): void {
            var width = (<any>container.node()).clientWidth;
            var height;
            if (!width) {
                width = height * this._ratio;
            } else if (!height) {
                height = width / this._ratio;
            }

            this.width = width;
            this.height = height;
            container.select('svg').attr({
                'width': width,
                'height': height
            });
            this._borderGroup.select('circle')
                .transition()
                .attr({
                    r: width / 2,
                    cx: width / 2,
                    cy: width / 2
                });
            this._logger.debugFormat(`width: ${width}, height:${height}`);
            this._projection.resize(width, height);
            // this._pathGenerator = (<d3.geo.Path>this._d3.geo.path()).projection(this._projection.projection());
            this.updateAll();
            
            // var dataSelection = this.selectCountries();
            // this.updateCountries(dataSelection);
            // if (this._positions) {
            //     this.updatePositions(this.selectPositions());
            // }
        }

        drawCountries(countries: TopoJSON.TopoJSONObject): void {
            this.handle(
                () => {
                    this._logger.debugFormat(`Drawing countries.`);
                    // this._countries = countries;
                    this._geoCountries = topojson.feature(countries, countries.objects.countries);

                    var dataSelection = this.selectCountries();
                    this.appendCountries(dataSelection);
                    this.updateCountries(dataSelection);
                    this.deleteCountries(dataSelection);

                    this._logger.debugFormat('Countries drawn.');
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
            selection
                .attr('id', (d: any, i: any) => d.properties.adm0_a3)
            selection.select('path')
                .transition()
                .attr('d', (d: any, i: any) => this._pathGenerator(d));
        }

        private deleteCountries(selection: d3.selection.Update<GeoJSON.Feature>) {
            selection.exit().remove();
        }

        drawStates(states: any, color?: string) {
            this._logger.debugFormat(states);
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
                this._logger.debugFormat(`Adding position (${longitude}, ${latitude}).`);
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
                this._logger.debugFormat('Position added.');
            }, 'Addition of position failed');
        }

        private selectPositions(): d3.selection.Update<position> {
            var dataSelection = this._positionsGroup.selectAll('circle')
                .data(this._positions);
            return dataSelection;
        }

        private updatePositions(selection: d3.selection.Update<position>) {
            var d3Projection = this._projection.projection();
            selection
                .transition()
                .attr({
                    'cx': (d: position) => d3Projection([d.longitude, d.latitude])[0],
                    'cy': (d: position) => d3Projection([d.longitude, d.latitude])[1],
                    'r': 2
                })
                .style({
                    'fill': d=> d.color ? d.color : 'black'
                });
        }

        centerOnPosition(longitude: number, latitude: number) {
            this.handle(() => {
                this._scale = 8000;
                this._projection.projection()
                    .center([longitude, latitude])
                    .scale(this._scale);
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
                this._logger.errorFormat(`No country with name ${countryName} found.`);
            }
            else {
                var c = this.getCentering(country, this._pathGenerator);
                this._projection.projection()
                    .scale(c.scale)
                    .translate(c.translate)
                    .center(<any>c.center);
                this.updateAll();
            }
        }

        reset() {
            this._projection
            // .scale(200)
                .center(0, 0)
                .rotate([0, 0, 0]);
            this.updateAll();
            // var dataSelection = this.selectCountries();
            // this.updateCountries(dataSelection);
        }

        rotate(value: [number, number, number]) {
            this._projection
                .rotate(value);
            this.updateAll();
        }

        type(value: projectionType) {
            this._projection.projectionType(value);

        }

        private updateAll() {
            // if (this._countries) {
            this.updateCountries(this.selectCountries());
            // }
            this.updatePositions(this.selectPositions());
        }

        private getCentering(d, pathGenerator: d3.geo.Path) {
            var bounds = pathGenerator.bounds(d);
            var dx = bounds[1][0] - bounds[0][0];
            var dy = bounds[1][1] - bounds[0][1];
            var x = (bounds[0][0] + bounds[1][0]) / 2;
            var y = (bounds[0][1] + bounds[1][1]) / 2;
            var scale = .9 / Math.max(dx / this.width, dy / this.height);
            var translate: [number, number] = [this.width / 2 - scale * x, this.height / 2 - scale * y];
            return {
                scale: scale,
                translate: translate,
                center: [x, y]
            };
        }

        private handle(method: any, message: string) {
            try {
                method();
            } catch (e) {
                this._logger.errorFormat(message);
                this._logger.errorFormat(e.message);
                this._logger.errorFormat(e.stack);
            }
        }
    }
}