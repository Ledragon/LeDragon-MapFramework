/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="projectionType.ts" />
module LeDragon.Framework.Map {
    export interface Iprojection {

    }

    export class projection {
        private _projection: D3.Geo.Projection;
        private _width: number;
        private _height: number;
        
        constructor(private _d3: D3.Base, type: projectionType, width: number, height: number) {
            this._width = width;
            this._height = height;
            switch (type) {
                case projectionType.Mercator:
                    this._projection = this._d3.geo.mercator()
                        .center([0, 0])
                        .translate([width / 2, height / 2])
                        .scale(width / 8);
                    break;
                case projectionType.Orthographic:
                    this._projection = this._d3.geo.orthographic()
                        .center([0, 0])
                        .translate([width / 2, height / 2])
                        .scale(width/3);
                    break;
                default:
                    throw new Error('Unknown projection type');
                    break;
            }
        }
        
        projection(): D3.Geo.Projection{
            return this._projection;
        }
    }
}