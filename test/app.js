/// <reference path="../typings/d3/d3.d.ts"/>
/// <reference path="../dist/framework.d.ts"/>
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

    reader.getStates10m('FRA').then(function(result){
        console.log(result.length);
    });
    //                    window.setTimeout(function() {
    //                        map.centerOnPosition(5, 50);
    //                        //window.setTimeout(function() {
    //                        //    map.centerOnPosition(-112, 37);
    //                        //},2000);
    //                    },2000);
    //});
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