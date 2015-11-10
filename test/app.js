/// <reference path="../typings/d3/d3.d.ts"/>
var logger = new LeDragon.Framework.Utilities.logger(console);
try {
    var map = new LeDragon.Framework.Map.map('#test', logger, d3);
    var reader = new LeDragon.Framework.Map.Services.countriesReaderService(logger, d3);
    reader.get110m()
        .then(function (countries) {
            map.drawCountries(countries);
            map.addPosition(5, 50);
            map.addPosition(-112, 37, 'red');
        })
        .catch(function (error) {
            console.log(error);
        });

    reader.getStates10m('FRA')
        .then(function (result) {
            console.log(result.length);
            // var franceMap = new LeDragon.Framework.Map.map('#france', logger, d3);
            // franceMap.drawStates(result);
        });
} catch (e) {
    logger.errorFormat(e);
}

function center() {
    map.centerOnPosition(5, 50);
}

function zoomOnBelgium() {
    map.zoomOnCountry('belgium');
}

function drawStates() {

}

function reset() {
    map.reset();
}
var x = 0;
var y = 0;
var z = 0;
function rotate() {
    x += 10;
    y += 2;
    z += 1;
    map.rotate([x,y,z]);
}