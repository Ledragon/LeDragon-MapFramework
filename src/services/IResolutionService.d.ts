declare module LeDragon.Framework.Map.Services {
    export interface IResolutionService{
        getAllCountries(): any;
        getCountry(adm: string): any;
    }
}