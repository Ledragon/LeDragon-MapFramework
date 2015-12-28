var logger = LeDragon.Framework.Utilities.loggerFactory.getLogger('app');
try {
    var mercator = new LeDragon.Framework.Map.map('#mercator', d3);
    mercator.type(0);
    var reader = new LeDragon.Framework.Map.Services.countriesReaderService(d3);
    reader.get110m()
        .then(function (countries) {
            mercator.drawCountries(countries);
            mercator.addPosition(5, 50);
            mercator.addPosition(-112, 37, 'red');
        })
        .catch(function (error) {
            logger.errorFormat(error);
        });
} catch (e) {
    logger.errorFormat(e);
}