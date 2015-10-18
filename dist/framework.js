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
                    switch (type) {
                        case Map.projectionType.Mercator:
                            this._projection = this._d3.geo.mercator()
                                .center([0, 0])
                                .translate([width / 2, height / 2])
                                .scale(width / 8);
                            break;
                        case Map.projectionType.Orthographic:
                            this._projection = this._d3.geo.orthographic()
                                .center([0, 0])
                                .translate([width / 2, height / 2])
                                .scale(width / 3);
                            break;
                        default:
                            throw new Error('Unknown projection type');
                            break;
                    }
                }
                projection.prototype.projection = function () {
                    return this._projection;
                };
                return projection;
            })();
            Map.projection = projection;
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
                function map(container, logger, _d3) {
                    this.logger = logger;
                    this._d3 = _d3;
                    this.init(container);
                }
                map.prototype.init = function (container) {
                    var _this = this;
                    this.handle(function () {
                        var c = _this._d3.select(container);
                        var width = c.node().clientWidth;
                        var height = c.node().clientHeight;
                        _this.width = width;
                        _this.height = height;
                        _this._group = c
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
                        _this._countriesGroup = _this._group.append('g')
                            .classed('countries', true);
                        _this._statesGroup = _this._group.append('g')
                            .classed('states', true);
                        _this._positionsGroup = _this._group.append('g')
                            .classed('positions', true);
                        _this._projection = new Map.projection(_this._d3, Map.projectionType.Orthographic, _this.width, _this.height)
                            .projection();
                        // this._projection = this._d3.geo.mercator()
                        //     .center([0, 0])
                        //     .translate([width / 2, height / 2])
                        //     .scale(width / 8);
                        // this._projection = this._d3.geo.orthographic()
                        //     .center([0, 0])
                        //     .translate([width / 2, height / 2])
                        //     .scale(width / 8);
                        _this._pathGenerator = _this._d3.geo.path().projection(_this._projection);
                        _this._positions = [];
                    }, 'Initialization failed');
                };
                map.prototype.drawCountries = function (countries) {
                    var _this = this;
                    this.handle(function () {
                        _this.logger.debugFormat('Drawing map.');
                        _this._countries = countries;
                        _this._geoCountries = topojson.feature(countries, countries.objects.countries);
                        _this._countriesGroup
                            .selectAll('path')
                            .data(_this._geoCountries.features)
                            .enter()
                            .append('g')
                            .classed('country', true)
                            .attr('id', function (d, i) { return d.properties.adm0_a3; })
                            .append('path')
                            .attr('d', function (d, i) { return _this._pathGenerator(d); })
                            .classed('normal', true);
                        _this.logger.debugFormat('Map drawn.');
                    }, 'Drawing of map failed.');
                };
                map.prototype.drawStates = function (states, color) {
                    var _this = this;
                    this.logger.debugFormat(states);
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
                        _this.logger.debugFormat("Adding position (" + longitude + ", " + latitude + ").");
                        var p = new position(longitude, latitude);
                        p.color = color;
                        _this._positions.push(p);
                        var projected = _this._projection([longitude, latitude]);
                        var circle = _this._positionsGroup.append('circle')
                            .attr({
                            'r': 2,
                            'cx': projected[0],
                            'cy': projected[1]
                        });
                        if (color) {
                            circle.attr('fill', color);
                        }
                        _this.logger.debugFormat('Position added.');
                    }, 'Addition of position failed');
                };
                map.prototype.centerOnPosition = function (longitude, latitude) {
                    var _this = this;
                    this.handle(function () {
                        _this._projection.center([longitude, latitude]).scale(8000);
                        _this._countriesGroup
                            .selectAll('path')
                            .data(_this._geoCountries.features)
                            .transition()
                            .attr('d', function (d) {
                            var result = _this._pathGenerator(d);
                            return result;
                        });
                        _this._positionsGroup
                            .selectAll('circle')
                            .data(_this._positions)
                            .transition()
                            .attr({
                            'cx': function (d, i) { return _this._projection([d.longitude, d.latitude])[0]; },
                            'cy': function (d, i) { return _this._projection([d.longitude, d.latitude])[1]; },
                            'r': '2'
                        });
                    }, 'Centering on position failed.');
                };
                map.prototype.zoomOnCountry = function (countryName) {
                    var country = _.find(this._geoCountries.features, function (c) { return c.properties.name.toLowerCase() === countryName.toLowerCase(); });
                    if (!country) {
                        this.logger.errorFormat("No country with name " + 0 + " found.");
                    }
                    else {
                        var c = this.getCentering(country, this._pathGenerator);
                    }
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
                        translate: translate
                    };
                };
                map.prototype.handle = function (method, message) {
                    try {
                        method();
                    }
                    catch (e) {
                        this.logger.errorFormat(message);
                        this.logger.errorFormat(e.message);
                        this.logger.errorFormat(e.stack);
                    }
                };
                return map;
            })();
            Map.map = map;
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
