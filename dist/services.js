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
/// <reference path="../../typings/geojson/geojson.d.ts"/>
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
                    function countriesReaderService(_logger, _d3) {
                        _super.call(this, _logger, _d3);
                        this._logger = _logger;
                        this._d3 = _d3;
                        this._110m = '/src/data/countries-110m.topo.json';
                        this._states10mPath = '/src/data/states-provinces-10m.topo.json';
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
                            console.log(countries);
                            var europe = countries;
                            defered.resolve(europe);
                        });
                        return defered.promise;
                    };
                    countriesReaderService.prototype.getStates10m = function (country_adm0_a3) {
                        var _this = this;
                        var defered = Q.defer();
                        if (!this._states10m) {
                            this._logger.debugFormat('Reading states file.');
                            d3.json(this._states10mPath, function (error, data) {
                                if (error) {
                                    _this._logger.errorFormat(error);
                                }
                                else {
                                    _this._logger.debugFormat('Successfully read states.');
                                    var geo = topojson.feature(data, data.objects['states-provinces']);
                                    _this._states10m = geo;
                                    defered.resolve(_this.getStates(country_adm0_a3));
                                }
                            });
                        }
                        else {
                            defered.resolve(this.getStates(country_adm0_a3));
                        }
                        return defered.promise;
                    };
                    countriesReaderService.prototype.getStates = function (country_adm0_a3) {
                        var result = this._states10m.features;
                        if (country_adm0_a3) {
                            result = this._states10m.features.filter(function (f) {
                                return f.properties.adm0_a3 === country_adm0_a3;
                            });
                        }
                        return result;
                    };
                    return countriesReaderService;
                })(Services.readerService);
                Services.countriesReaderService = countriesReaderService;
            })(Services = Map.Services || (Map.Services = {}));
        })(Map = Framework.Map || (Framework.Map = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
