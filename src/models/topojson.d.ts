// Type definitions for TopoJSON
// Project: https://github.com/mbostock/topojson
// Definitions by: Hugues Stefanski <https://github.com/Ledragon/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped 
declare module TopoJSON {
    export interface TopoJSON {
        feature(topology, object);
        merge(topology, objects);
        mesh(topology, object, filter?);
        meshArcs(topology, objects?, filter?);
        neighbors(objects);
    }

    export interface TopoJSONObject {
        type: string;
        arcs?: Array<any>;
        objects: { countries: countries };
        transform: any;
    }
    export interface countries {
        type: string,
        geometries: Array<country>
    }

    export interface country {
        type: string,
        properties:
        {
            scalerank: number,
            featurecla: string,
            labelrank: number,
            adm0_a3: string
        }
    }

}

declare var topojson: TopoJSON.TopoJSON;