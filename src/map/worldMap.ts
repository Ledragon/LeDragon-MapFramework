/// <reference path="../../public/scripts/topojson.d.ts" />
module LeDragon.Framework.Map {
    export interface IworldMap {
        drawCountries: (countries: TopoJSON.TopoJSONObject) => void;
        addPosition: (longitude: number, latitude: number, color?: string) => void;
    }

    export class map implements IworldMap {
        private _group: D3.Selection;
        private _countriesGroup: D3.Selection;
        private _positionsGroup: D3.Selection;

        private _projection: D3.Geo.Projection;
        private _pathGenerator: D3.Geo.Path;
        private _countries: TopoJSON.TopoJSONObject;
        private _geoCountries: any;
        private _positions: Array<position>;

        constructor(container: any, private logger: Utilities.Ilogger) {
            this.handle(() => {
                var c = d3.select(container);
                var width = c.node().clientWidth;
                var height = c.node().clientHeight;
                this._group = c
                    .append('svg')
                    .attr({
                        'width': width,
                        'height': height
                    })
                    .append('g')
                    .classed('map', true);
                d3.select(window).on('resize', () => {
                    console.log(c.node().clientWidth + '*' + c.node().clientHeight);
                });
                this._countriesGroup = this._group.append('g')
                    .classed('countries', true);
                this._positionsGroup = this._group.append('g')
                    .classed('positions', true);
                this._projection = d3.geo.mercator()
                    .center([0, 0])
                    .translate([width / 2, height / 2])
                    .scale(width / 8);
                this._pathGenerator = d3.geo.path().projection(this._projection);

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

    class position {
        constructor(longitude: number, latitude: number) {
            this.longitude = longitude;
            this.latitude = latitude;
        }

        longitude: number;
        latitude: number;
        color: string;
    }
}