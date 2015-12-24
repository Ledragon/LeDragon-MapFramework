module LeDragon.Framework.Map.Services {
	export interface IreaderService {
		read: (fileName: string) => Q.IPromise<any>;
	}

	export class readerService implements IreaderService {
		constructor(private logger: Utilities.Ilogger, private d3:any) {

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
