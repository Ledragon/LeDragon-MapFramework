var logger = LeDragon.Framework.Utilities.loggerFactory.getLogger('app');
try {
    var ortho = new LeDragon.Framework.Map.map('#test', d3);
    var reader = new LeDragon.Framework.Map.Services.countriesReaderService(d3);
    reader.get110m()
        .then(function (countries) {
            ortho.drawCountries(countries);
            ortho.addPosition(5, 50);
            ortho.addPosition(-112, 37, 'red');
        })
        .catch(function (error) {
            logger.errorFormat(error);
        });
} catch (e) {
    logger.errorFormat(e);
}

function center() {
    ortho.centerOnPosition(5, 50);
}

function zoomOnBelgium() {
    ortho.zoomOnCountry('belgium');
}

function drawStates() {

}

function reset() {
    ortho.reset();
}

var x = 0;
var y = 0;
var z = 0;
function rotate() {
    x += 10;
    y += 2;
    z += 1;
    ortho.rotate([x, y, z]);
}