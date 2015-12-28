/// <reference path="../../shared/utilities/loggerFactory.ts" />

module LeDragon.Framework.Map.Services {
    export interface IreaderService {
        read: (fileName: string) => Q.IPromise<any>;
    }

    export class readerService implements IreaderService {
        private logger: Utilities.Ilogger;
        constructor(private d3: any) {
            this.logger = LeDragon.Framework.Utilities.loggerFactory.getLogger('readerservice');
        }

        read(fileName: string): Q.IPromise<any> {
            //TODO abstarct Q
            this.logger.infoFormat(`Reading file ${fileName}.`);
            var defered = Q.defer();
            this.d3.json(fileName, (error, data) => {
                if (error) {
                    this.logger.errorFormat(error);
                    defered.reject(error);
                } else {
                    this.logger.infoFormat(`File ${fileName} successfully read.`);
                    defered.resolve(data);
                }
            });

            return defered.promise;
        }
    }
}
