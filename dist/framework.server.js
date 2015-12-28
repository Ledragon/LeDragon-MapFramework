/// <reference path="../../../typings/tsd.d.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Utilities;
        (function (Utilities) {
            var logger = (function () {
                function logger(console, _name) {
                    this.console = console;
                    this._name = _name;
                }
                logger.prototype.debugFormat = function (message) {
                    this.console.debug(this.format('DEBUG', message));
                };
                logger.prototype.infoFormat = function (message) {
                    this.console.info(this.format('INFO', message));
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
                logger.prototype.format = function (level, message) {
                    var now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
                    var formatted = "[" + now + "] - [" + this._name + "] - " + level + " - " + message;
                    return formatted;
                };
                return logger;
            })();
            Utilities.logger = logger;
        })(Utilities = Framework.Utilities || (Framework.Utilities = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
/// <reference path="logger.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Utilities;
        (function (Utilities) {
            var loggerFactory = (function () {
                function loggerFactory() {
                }
                loggerFactory.getLogger = function (name) {
                    var l = _.find(loggerFactory._loggerList, function (l) { return l.name === name; });
                    if (!l) {
                        l = { logger: new Utilities.logger(console, name), name: name };
                        loggerFactory._loggerList.push(l);
                    }
                    return l.logger;
                };
                loggerFactory._loggerList = [];
                return loggerFactory;
            })();
            Utilities.loggerFactory = loggerFactory;
        })(Utilities = Framework.Utilities || (Framework.Utilities = {}));
    })(Framework = LeDragon.Framework || (LeDragon.Framework = {}));
})(LeDragon || (LeDragon = {}));
/// <reference path="../../shared/utilities/loggerFactory.ts" />
var LeDragon;
(function (LeDragon) {
    var Framework;
    (function (Framework) {
        var Map;
        (function (Map) {
            var Services;
            (function (Services) {
                var readerService = (function () {
                    function readerService(d3) {
                        this.d3 = d3;
                        this.logger = LeDragon.Framework.Utilities.loggerFactory.getLogger('readerservice');
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../typings/d3/d3.d.ts" />
/// <reference path="../../../typings/Q/Q.d.ts" />
/// <reference path="../../../typings/geojson/geojson.d.ts" />
/// <reference path="../../models/topojson.d.ts" />
/// <reference path="../../shared/utilities/logger.ts" />
/// <reference path="../../shared/utilities/loggerFactory.ts" />
/// <reference path="./readerService.ts"/>
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
                    function countriesReaderService(_d3) {
                        _super.call(this, _d3);
                        this._d3 = _d3;
                        this._110m = '/src/server/data/countries-110m.topo.json';
                        this._states10mPath = '/src/server/data/states-provinces-10m.topo.json';
                        this._logger = Framework.Utilities.loggerFactory.getLogger('countriesReaderService');
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

//# sourceMappingURL=framework.server.js.map
