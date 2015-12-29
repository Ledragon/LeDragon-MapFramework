/// <reference path="logger.ts" />
module LeDragon.Framework.Utilities.Extensions {
    export class getNameObject {
        getName(): string {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((this).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        }

        logger(): Ilogger {
            return new logger(console, this.getName());
        }
        
    }
}