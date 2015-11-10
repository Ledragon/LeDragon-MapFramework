var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var Models;
            (function (Models) {
                var position = (function () {
                    function position(longitude, latitude) {
                        this.longitude = longitude;
                        this.latitude = latitude;
                    }
                    return position;
                })();
                Models.position = position;
            })(Models = Map.Models || (Map.Models = {}));
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Utilities;
        (function (Utilities) {
            var logger = (function () {
                function logger(console) {
                    this.console = console;
                }
                logger.prototype.debugFormat = function (message) {
                    this.console.debug(message);
                };
                logger.prototype.infoFormat = function (message) {
                    this.console.info(message);
                };
                logger.prototype.warningFormat = function (message) {
                    this.console.warn(message);
                };
                logger.prototype.errorFormat = function (message) {
                    this.console.error(message);
                };
                logger.prototype.fatalFormat = function (message) {
                    this.console.error(message);
                };
                return logger;
            })();
            Utilities.logger = logger;
        })(Utilities = Framework.Utilities || (Framework.Utilities = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            (function (projectionType) {
                projectionType[projectionType["Mercator"] = 0] = "Mercator";
                projectionType[projectionType["Orthographic"] = 1] = "Orthographic";
            })(Map.projectionType || (Map.projectionType = {}));
            var projectionType = Map.projectionType;
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="projectionType.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var projection = (function () {
                function projection(_d3, type, width, height) {
                    this._d3 = _d3;
                    this._width = width;
                    this._height = height;
                    this._type = type;
                    this._center = [0, 0];
                    this.createProjection();
                }
                projection.prototype.createProjection = function () {
                    switch (this._type) {
                        case Map.projectionType.Mercator:
                            this._projection = this._d3.geo.mercator()
                                .center(this._center)
                                .translate([this._width / 2, this._height / 2])
                                .scale(this._width / 8);
                            break;
                        case Map.projectionType.Orthographic:
                            this._projection = this._d3.geo.orthographic()
                                .center(this._center)
                                .translate([this._width / 2, this._height / 2])
                                .scale(this._width / 2)
                                .clipAngle(90);
                            break;
                        default:
                            throw new Error('Unknown projection type');
                            break;
                    }
                };
                projection.prototype.resize = function (width, height) {
                    this._width = width;
                    this._height = height;
                    this._projection
                        .translate([width / 2, height / 2]);
                    switch (this._type) {
                        case Map.projectionType.Mercator:
                            this._projection.scale(width / 8);
                            break;
                        case Map.projectionType.Orthographic:
                            this._projection.scale(width / 2);
                            break;
                        default:
                            throw new Error('Unknown projection type');
                            break;
                    }
                };
                projection.prototype.projectionType = function (value) {
                    if (arguments) {
                        this._type = value;
                        this.createProjection();
                        return this;
                    }
                    return this._type;
                };
                projection.prototype.projection = function () {
                    return this._projection;
                };
                projection.prototype.center = function (latitude, longitude) {
                    this._center = [latitude, longitude];
                    this._projection.center(this._center);
                    return this;
                };
                projection.prototype.scale = function (value) {
                    this._projection.scale(value);
                    return this;
                };
                projection.prototype.rotate = function (value) {
                    if (value) {
                        this._projection.rotate(value);
                        return this;
                    }
                    return this._projection.rotate();
                };
                return projection;
            })();
            Map.projection = projection;
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
/// <reference path="../../typings/geojson/geojson.d.ts" />
/// <reference path="../topojson.d.ts" />
/// <reference path="../models/position.ts" />
/// <reference path="../utilities/logger.ts" />
/// <reference path="projection.ts" />
/// <reference path="projectionType.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var position = Map.Models.position;
            var map = (function () {
                function map(container, _logger, _d3) {
                    this._logger = _logger;
                    this._d3 = _d3;
                    this.init(container);
                }
                map.prototype.init = function (container) {
                    var _this = this;
                    this.handle(function () {
                        var c = _this._d3.select(container);
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
                        _this._group = svg
                            .append('g')
                            .classed('map', true);
                        _this._borderGroup = _this._group.append('g')
                            .classed('border', true);
                        _this._countriesGroup = _this._group.append('g')
                            .classed('countries', true);
                        _this._statesGroup = _this._group.append('g')
                            .classed('states', true);
                        _this._positionsGroup = _this._group.append('g')
                            .classed('positions', true);
                        _this._geoCountries = {
                            features: [],
                            bbox: {},
                            crs: {},
                            type: ''
                        };
                        _this._positions = [];
                        _this._ratio = 1;
                        _this._projection = new Map.projection(_this._d3, Map.projectionType.Orthographic, 1, 1);
                        _this._borderGroup.append('circle')
                            .style('fill', 'url(#grad)');
                        _this._pathGenerator = _this._d3.geo.path().projection(_this._projection.projection());
                        _this.setSize(c);
                        _this._d3.select(window)
                            .on('resize', function (d, i) {
                            _this.setSize(c);
                        });
                    }, 'Initialization failed');
                };
                map.prototype.setSize = function (container) {
                    var width = container.node().clientWidth;
                    var height;
                    if (!width) {
                        width = height * this._ratio;
                    }
                    else if (!height) {
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
                    this._logger.debugFormat("width: " + width + ", height:" + height);
                    this._projection.resize(width, height);
                    // this._pathGenerator = (<d3.geo.Path>this._d3.geo.path()).projection(this._projection.projection());
                    this.updateAll();
                    // var dataSelection = this.selectCountries();
                    // this.updateCountries(dataSelection);
                    // if (this._positions) {
                    //     this.updatePositions(this.selectPositions());
                    // }
                };
                map.prototype.drawCountries = function (countries) {
                    var _this = this;
                    this.handle(function () {
                        _this._logger.debugFormat("Drawing countries.");
                        // this._countries = countries;
                        _this._geoCountries = topojson.feature(countries, countries.objects.countries);
                        var dataSelection = _this.selectCountries();
                        _this.appendCountries(dataSelection);
                        _this.updateCountries(dataSelection);
                        _this.deleteCountries(dataSelection);
                        _this._logger.debugFormat('Countries drawn.');
                    }, 'Drawing of map failed.');
                };
                map.prototype.selectCountries = function () {
                    var dataSelection = this._countriesGroup
                        .selectAll('.country')
                        .data(this._geoCountries.features);
                    return dataSelection;
                };
                map.prototype.appendCountries = function (selection) {
                    selection.enter()
                        .append('g')
                        .classed('country', true)
                        .append('path')
                        .classed('normal', true);
                };
                map.prototype.updateCountries = function (selection) {
                    var _this = this;
                    selection
                        .attr('id', function (d, i) { return d.properties.adm0_a3; });
                    selection.select('path')
                        .transition()
                        .attr('d', function (d, i) { return _this._pathGenerator(d); });
                };
                map.prototype.deleteCountries = function (selection) {
                    selection.exit().remove();
                };
                map.prototype.drawStates = function (states, color) {
                    var _this = this;
                    this._logger.debugFormat(states);
                    var selection = this._statesGroup
                        .selectAll('path')
                        .data(states);
                    selection.enter()
                        .append('path');
                    selection.attr('d', function (d, i) { return _this._pathGenerator(d); });
                    if (color) {
                        selection.attr('fill', color);
                    }
                    selection.exit().remove();
                };
                map.prototype.addPosition = function (longitude, latitude, color) {
                    var _this = this;
                    this.handle(function () {
                        _this._logger.debugFormat("Adding position (" + longitude + ", " + latitude + ").");
                        var p = new position(longitude, latitude);
                        p.color = color;
                        _this._positions.push(p);
                        var dataSelection = _this.selectPositions();
                        dataSelection.enter()
                            .append('circle')
                            .attr({
                            'r': 2
                        });
                        _this.updatePositions(dataSelection);
                        _this._logger.debugFormat('Position added.');
                    }, 'Addition of position failed');
                };
                map.prototype.selectPositions = function () {
                    var dataSelection = this._positionsGroup.selectAll('circle')
                        .data(this._positions);
                    return dataSelection;
                };
                map.prototype.updatePositions = function (selection) {
                    var d3Projection = this._projection.projection();
                    selection
                        .transition()
                        .attr({
                        'cx': function (d) { return d3Projection([d.longitude, d.latitude])[0]; },
                        'cy': function (d) { return d3Projection([d.longitude, d.latitude])[1]; },
                        'r': 2
                    })
                        .style({
                        'fill': function (d) { return d.color ? d.color : 'black'; }
                    });
                };
                map.prototype.centerOnPosition = function (longitude, latitude) {
                    var _this = this;
                    this.handle(function () {
                        _this._scale = 8000;
                        _this._projection.projection()
                            .center([longitude, latitude])
                            .scale(_this._scale);
                        _this._countriesGroup
                            .selectAll('path')
                            .data(_this._geoCountries.features)
                            .transition()
                            .attr('d', function (d) {
                            var result = _this._pathGenerator(d);
                            return result;
                        });
                        _this.updatePositions(_this.selectPositions());
                    }, 'Centering on position failed.');
                };
                map.prototype.zoomOnCountry = function (countryName) {
                    var country = _.find(this._geoCountries.features, function (c) { return c.properties.name.toLowerCase() === countryName.toLowerCase(); });
                    if (!country) {
                        this._logger.errorFormat("No country with name " + countryName + " found.");
                    }
                    else {
                        var c = this.getCentering(country, this._pathGenerator);
                        this._projection.projection()
                            .scale(c.scale)
                            .translate(c.translate)
                            .center(c.center);
                        this.updateAll();
                    }
                };
                map.prototype.reset = function () {
                    this._projection
                        .center(0, 0)
                        .rotate([0, 0, 0]);
                    this.updateAll();
                    // var dataSelection = this.selectCountries();
                    // this.updateCountries(dataSelection);
                };
                map.prototype.rotate = function (value) {
                    this._projection
                        .rotate(value);
                    this.updateAll();
                };
                map.prototype.type = function (value) {
                    this._projection.projectionType(value);
                };
                map.prototype.updateAll = function () {
                    // if (this._countries) {
                    this.updateCountries(this.selectCountries());
                    // }
                    this.updatePositions(this.selectPositions());
                };
                map.prototype.getCentering = function (d, pathGenerator) {
                    var bounds = pathGenerator.bounds(d);
                    var dx = bounds[1][0] - bounds[0][0];
                    var dy = bounds[1][1] - bounds[0][1];
                    var x = (bounds[0][0] + bounds[1][0]) / 2;
                    var y = (bounds[0][1] + bounds[1][1]) / 2;
                    var scale = .9 / Math.max(dx / this.width, dy / this.height);
                    var translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];
                    return {
                        scale: scale,
                        translate: translate,
                        center: [x, y]
                    };
                };
                map.prototype.handle = function (method, message) {
                    try {
                        method();
                    }
                    catch (e) {
                        this._logger.errorFormat(message);
                        this._logger.errorFormat(e.message);
                        this._logger.errorFormat(e.stack);
                    }
                };
                return map;
            })();
            Map.map = map;
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));

//# sourceMappingURL=framework.js.map
