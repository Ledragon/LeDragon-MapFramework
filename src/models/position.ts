module LeDragon.Framework.Map.Models{
    export class position {
        constructor(longitude: number, latitude: number) {
            this.longitude = longitude;
            this.latitude = latitude;
        }

        longitude: number;
        latitude: number;
        color: string;
    }
}