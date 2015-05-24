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
/// <reference path="../topojson.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../models/position.ts" />
/// <reference path="../utilities/logger.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var position = Map.Models.position;
            var map = (function () {
                function map(container, logger, d3) {
                    var _this = this;
                    this.logger = logger;
                    this.d3 = d3;
                    this.handle(function () {
                        var c = _this.d3.select(container);
                        var width = c.node().clientWidth;
                        var height = c.node().clientHeight;
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
                        _this._positionsGroup = _this._group.append('g')
                            .classed('positions', true);
                        _this._projection = _this.d3.geo.mercator()
                            .center([0, 0])
                            .translate([width / 2, height / 2])
                            .scale(width / 8);
                        _this._pathGenerator = _this.d3.geo.path().projection(_this._projection);
                        _this._positions = [];
                    }, 'Initialization failed');
                }
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
/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>
/// <reference path="../utilities/logger.ts"/>
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var Services;
            (function (Services) {
                var readerService = (function () {
                    function readerService(logger, d3) {
                        this.logger = logger;
                        this.d3 = d3;
                    }
                    readerService.prototype.read = function (fileName) {
                        var _this = this;
                        //TODO abstarct Q
                        this.logger.infoFormat("Reading file " + fileName + ".");
                        var defered = Q.defer();
                        this.d3.json(fileName, function (error, data) {
                            if (error) {
                                _this.logger.errorFormat(error);
                                defered.reject(error);
                            }
                            else {
                                _this.logger.infoFormat("File " + fileName + " successfully read.");
                                defered.resolve(data);
                            }
                        });
                        return defered.promise;
                    };
                    return readerService;
                })();
                Services.readerService = readerService;
            })(Services = Map.Services || (Map.Services = {}));
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/d3/d3.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../topojson.d.ts"/>
/// <reference path="./readerService.ts"/>
/// <reference path="../models/country.d.ts"/>
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var Services;
            (function (Services) {
                var countriesReaderService = (function (_super) {
                    __extends(countriesReaderService, _super);
                    function countriesReaderService() {
                        _super.apply(this, arguments);
                        this._110m = './src/data/countries-110m.topo.json';
                    }
                    countriesReaderService.prototype.get110m = function () {
                        return _super.prototype.read.call(this, this._110m);
                    };
                    countriesReaderService.prototype.get50m = function () {
                        var defered = Q.defer();
                        return defered.promise;
                    };
                    countriesReaderService.prototype.get10m = function () {
                        var defered = Q.defer();
                        return defered.promise;
                    };
                    countriesReaderService.prototype.getEurope110m = function () {
                        var defered = Q.defer();
                        _super.prototype.read.call(this, this._110m).then(function (countries) {
                            //				var objects: interfaces.country = countries.objects;
                            console.log(countries);
                            var europe;
                            defered.resolve(europe);
                        });
                        return defered.promise;
                    };
                    return countriesReaderService;
                })(Services.readerService);
                Services.countriesReaderService = countriesReaderService;
            })(Services = Map.Services || (Map.Services = {}));
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
