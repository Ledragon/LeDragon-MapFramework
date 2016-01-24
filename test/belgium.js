(function () {

    var logger = LeDragon.Framework.Utilities.loggerFactory.getLogger('app');
    try {
        var map = new LeDragon.Framework.Map.map('#belgium', d3);
        map.type(0);
        var reader = new LeDragon.Framework.Map.Services.lowResolutionService(d3, Q);
        reader.getCountry('BEL')
            .then(function (countries) {
                logger.infoFormat(countries);
                map.drawCountries(countries);
                // map.zoomOnCountry('belgium');
            })
            .catch(function (error) {
                logger.errorFormat(error);
            });
    } catch (e) {
        logger.errorFormat(e);
    }
} ());