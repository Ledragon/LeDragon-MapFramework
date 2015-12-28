/// <reference path="logger.ts" />
module LeDragon.Framework.Utilities {
    export class loggerFactory {
        private static _loggerList: Array<{ name: string, logger: Ilogger }>=[];

        constructor() {
        }
        
        static getLogger(name: string): Ilogger {
            var l = _.find(loggerFactory._loggerList, l=> l.name === name);
            if (!l) {
                l = { logger: new logger(console, name), name: name };
                loggerFactory._loggerList.push(l);
            }
            return l.logger;
        }
    }
}