/// <reference path="../../../typings/tsd.d.ts" />

module LeDragon.Framework.Utilities {
    export interface Ilogger {
        debugFormat: (message: string) => void;
        infoFormat: (message: string) => void;
        warningFormat: (message: string) => void;
        errorFormat: (message: string) => void;
        fatalFormat: (message: string) => void;
    }

    export class logger implements Ilogger {

        constructor(private console: Console, private _name:string) {

        }
        debugFormat(message: string): void {
            this.console.debug(this.format('DEBUG', message));
        }

        infoFormat(message: string): void {
            this.console.info(this.format('INFO', message));
        }

        warningFormat(message: string): void {
            this.console.warn(message);
        }

        errorFormat(message: string): void {
            this.console.error(message);
        }

        fatalFormat(message: string): void {
            this.console.error(message);
        }

        private format(level: string, message: any): string {
            var now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            var formatted = `[${now}] - [${this._name}] - ${level} - ${message}`;
            
            return formatted;
        }
    }
}