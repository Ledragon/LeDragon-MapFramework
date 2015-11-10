/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="projectionType.ts" />
module LeDragon.Framework.Map {
    export interface Iprojection {
        projection(): d3.geo.Projection;
        resize(width: number, height: number): void;
        projectionType(value?: projectionType): projection | projectionType;
        center(latitude: number, longitude: number): projection;
        scale(value: number): projection;
    }

    export class projection {
        private _projection: d3.geo.Projection;
        private _width: number;
        private _height: number;
        private _scale: number;
        private _type: projectionType;
        private _center: [number, number];

        constructor(private _d3: typeof d3, type: projectionType, width: number, height: number) {
            this._width = width;
            this._height = height;
            this._type = type;
            this._center = [0, 0];
            this.createProjection();
        }

        private createProjection() {
            switch (this._type) {
                case projectionType.Mercator:
                    this._projection = this._d3.geo.mercator()
                        .center(this._center)
                        .translate([this._width / 2, this._height / 2])
                        .scale(this._width / 8);
                    break;
                case projectionType.Orthographic:
                    this._projection = this._d3.geo.orthographic()
                        .center(this._center)
                        .translate([this._width / 2, this._height / 2])
                        .scale(this._width / 2);
                    break;
                default:
                    throw new Error('Unknown projection type');
                    break;
            }
        }

        resize(width: number, height: number): void {
            this._width = width;
            this._height = height;
            this._projection
                .translate([width / 2, height / 2]);
            switch (this._type) {
                case projectionType.Mercator:
                    this._projection.scale(width / 8);
                    break;
                case projectionType.Orthographic:
                    this._projection.scale(width / 2);
                    break;
                default:
                    throw new Error('Unknown projection type');
                    break;
            }
        }

        projectionType(value?: projectionType): projection | projectionType {
            if (arguments) {
                this._type = value;
                this.createProjection();
                return this;
            }
            return this._type;
        }

        projection(): d3.geo.Projection {
            return this._projection;
        }

        center(latitude: number, longitude: number): projection {
            this._center = [latitude, longitude];
            this._projection.center(this._center);
            return this;
        }

        scale(value: number): projection {
            this._projection.scale(value);
            return this;
        }
    }
}