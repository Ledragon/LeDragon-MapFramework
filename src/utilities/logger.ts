module LeDragon.Framework.Utilities {
    export interface Ilogger {
        debugFormat: (message: string) => void;
        infoFormat: (message: string) => void;
        warningFormat: (message: string) => void;
        errorFormat: (message: string) => void;
        fatalFormat: (message: string) => void;
    }

    export class logger implements Ilogger{
        constructor(private console: Console) {
            
        }
        debugFormat(message: string): void {
            this.console.debug(message);
        }

        infoFormat(message: string): void {
            this.console.info(message);
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
    }
}